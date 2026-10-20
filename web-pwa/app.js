'use strict';
const APP_VERSION='6.2.4';
const STOP_W2D=['Wiesenhügel','Färberwaidweg','Abzweig Wiesenhügel','Blücherstraße','Sozialversicherungszentrum','Am Schwemmbach','Stadion Ost','Tschaikowskistraße','Robert-Koch-Straße','Hauptbahnhof','Anger','Fischmarkt/Rathaus','Domplatz'];
const STOP_D2W=[...STOP_W2D].reverse();
const STOP_L3D=['Melchendorf Betriebshof','Melchendorf','Abzweig Wiesenhügel','Blücherstraße','Sozialversicherungszentrum','Am Schwemmbach','Stadion Ost','Tschaikowskistraße','Robert-Koch-Straße','Hauptbahnhof','Anger','Fischmarkt/Rathaus','Domplatz'];
const STOP_D3M=[...STOP_L3D].reverse();
const ROUTES={
 W2D:{name:'Wiesenhügel → Domplatz',stops:STOP_W2D,reverse:'D2W',line:'2'},
 D2W:{name:'Domplatz → Wiesenhügel',stops:STOP_D2W,reverse:'W2D',line:'2'},
 W2S:{name:'Wiesenhügel → Stadion Ost',stops:['Wiesenhügel','Färberwaidweg','Abzweig Wiesenhügel','Blücherstraße','Sozialversicherungszentrum','Am Schwemmbach','Stadion Ost'],reverse:'S2W',line:'2'},
 S2W:{name:'Stadion Ost → Wiesenhügel',stops:['Stadion Ost','Am Schwemmbach','Sozialversicherungszentrum','Blücherstraße','Abzweig Wiesenhügel','Färberwaidweg','Wiesenhügel'],reverse:'W2S',line:'2'},
 S2M:{name:'Stadion Ost → Melchendorf',stops:['Stadion Ost','Am Schwemmbach','Sozialversicherungszentrum','Blücherstraße','Abzweig Wiesenhügel','Melchendorf'],reverse:'M2S',line:'2'},
 M2S:{name:'Melchendorf → Stadion Ost',stops:['Melchendorf','Abzweig Wiesenhügel','Blücherstraße','Sozialversicherungszentrum','Am Schwemmbach','Stadion Ost'],reverse:'S2M',line:'2'},
 L3D:{name:'Melchendorf Betriebshof → Domplatz',stops:STOP_L3D,reverse:'D3M',line:'3'},
 D3M:{name:'Domplatz → Melchendorf Betriebshof',stops:STOP_D3M,reverse:'L3D',line:'3'}
};
Object.assign(ROUTES,ERFURT_NETWORK.routes);
Object.assign(ROUTES,ERFURT_NETWORK.constructionRoutes);
const DEFAULT_STATE={schemaVersion:2,customRoutes:{},networkEdits:bundledNetworkEdits(),vehicles:[],plans:[],history:[],active:null,selectedPlanId:null,settings:{dark_mode:false,show_eta:false,dev_mode:false,dev_options_unlocked:false,sidebar_collapsed:false,route_names:{}}};
let state=loadState();let currentView='home';let draftStops=[];let toastTimeout;
syncCustomRoutes();
let preparation={planId:null,departure:''};
let editingPlanId=null;
let devVersionClicks=[];
function clone(v){return JSON.parse(JSON.stringify(v))}
function loadState(){
 try { return normalizeState(JSON.parse(localStorage.getItem('fm_tablet_state_v1')||'null')); }
 catch(e){ return clone(DEFAULT_STATE); }
}
function newPlanId(){
 const suffix=window.crypto?.randomUUID?.()||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
 return 'plan-'+suffix;
}
function normalizeState(raw){
 if(!raw||typeof raw!=='object')return clone(DEFAULT_STATE);
 const result={...clone(DEFAULT_STATE),...raw,settings:{...clone(DEFAULT_STATE.settings),...(raw.settings||{})}};
 const legacyIds=new Map();
 const usedIds=new Set();
 result.plans=(Array.isArray(raw.plans)?raw.plans:[]).map(source=>{
  const plan=clone(source);
  let id=typeof plan.id==='string'&&/^plan-[a-zA-Z0-9-]+$/.test(plan.id)?plan.id:newPlanId();
  if(usedIds.has(id))id=newPlanId();
  usedIds.add(id);
  if(plan.code!=null)legacyIds.set(String(plan.code),id);
  plan.id=id;
  delete plan.code;
  delete plan.departure;
  return plan;
 });
 const migrateTrip=trip=>{
  if(!trip||!trip.plan)return null;
  const copy=clone(trip);
  const oldPlan=copy.plan;
  copy.departure=isDepartureTime(copy.departure)?copy.departure:
   isDepartureTime(oldPlan.departure)?oldPlan.departure:
   Number.isFinite(copy.startedAtEpoch)?fmtTime(copy.startedAtEpoch):'';
  oldPlan.id=legacyIds.get(String(oldPlan.code))||
   (typeof oldPlan.id==='string'&&/^plan-[a-zA-Z0-9-]+$/.test(oldPlan.id)?oldPlan.id:newPlanId());
  delete oldPlan.code;
  delete oldPlan.departure;
  return copy;
 };
 result.active=migrateTrip(raw.active);
 result.history=(Array.isArray(raw.history)?raw.history:[]).map(item=>{
  const entry=clone(item);
  if(entry.resumeTrip)entry.resumeTrip=migrateTrip(entry.resumeTrip);
  return entry;
 });
 result.selectedPlanId=result.plans.some(p=>p.id===raw.selectedPlanId)?raw.selectedPlanId:
  legacyIds.get(String(raw.selectedCode))||null;
 delete result.selectedCode;
 result.schemaVersion=2;
 result.settings.route_names=result.settings.route_names&&typeof result.settings.route_names==='object'?result.settings.route_names:{};
 result.customRoutes=validCustomRoutes(raw.customRoutes);
 result.vehicles=validVehicles(raw.vehicles);
 result.settings.dev_options_unlocked=result.settings.dev_options_unlocked===true;
 result.settings.dev_mode=result.settings.dev_options_unlocked&&result.settings.dev_mode===true;
 result.settings.sidebar_collapsed=result.settings.sidebar_collapsed===true;
 result.networkEdits=Object.hasOwn(raw,'networkEdits')?validNetworkEdits(raw.networkEdits):bundledNetworkEdits();
 return result;
}
function saveState(){try{localStorage.setItem('fm_tablet_state_v1',JSON.stringify(state))}catch(e){showToast('Speicher voll — bitte Export erstellen.')}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function nowClock(){return new Date().toLocaleTimeString('de-DE',{hour12:false})}
function fmtDate(ms){return new Date(ms).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}
function fmtTime(ms){return new Date(ms).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',hour12:false})}
function routeLabel(id){return state.settings.route_names[id]||ROUTES[id]?.code||(id.startsWith('custom-')?'L'+String(ROUTES[id]?.line||'NEU').slice(0,13):id)}
function routeName(id){return ROUTES[id]?.name||id}
function allRouteStops(id){return ROUTES[id].stops.map((name,i)=>({name,travel:i===0?0:(ROUTES[id].times?.[i]??2),pause:0}))}

function showToast(s){const r=document.getElementById('toastRoot');r.innerHTML='<div class="toast">'+esc(s)+'</div>';clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>r.innerHTML='',3000)}
function applyTheme(){document.body.classList.toggle('dark',!!state.settings.dark_mode)}
function updateShell(){
 const collapsed=state.settings.sidebar_collapsed===true;
 document.body.classList.toggle('sidebar-collapsed',collapsed);
 const toggle=document.getElementById('sidebarToggle');
 toggle.setAttribute('aria-expanded',String(!collapsed));
 toggle.setAttribute('aria-label',collapsed?'Menü ausklappen':'Menü einklappen');
 toggle.title=collapsed?'Menü ausklappen':'Menü einklappen';
 toggle.querySelector('.sidebar-toggle-label').textContent=collapsed?'Menü':'Menü einklappen';
 document.getElementById('clock').textContent=nowClock();
 document.getElementById('appVersion').textContent=`v${APP_VERSION} Android`;
 document.getElementById('activeDot').textContent=state.active?'●':'';
 document.querySelectorAll('#nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView||(currentView==='detail'&&b.dataset.view==='plans')));
}
function toggleSidebar(){
 state.settings.sidebar_collapsed=!state.settings.sidebar_collapsed;saveState();updateShell();
 if(currentView==='network')resizeNetworkMap();
 if(currentView==='driver')queueCabRouteLayout();
}
function titleFor(v){return ({network:'Linien & Netz',home:'Übersicht',new:'Neue Fahrt erstellen',plans:'Meine Fahrpläne',vehicles:'Fahrzeuge',detail:'Fahrplan',driver:'Fahrer-Modus',history:'Fahrt-Historie',settings:'Einstellungen'})[v]||'Fahrplan Manager'}
function showView(v){
 if(v==='new'&&currentView!=='new'&&!editingPlanId&& !window.draftRoute){draftStops=[];}
 if(v!=='new'&&currentView==='new'){editingPlanId=null;draftStops=[];}
 if(v==='driver'&&!state.active){showToast('Es gibt keine aktive Fahrt.');v='home';}
 if(v!=='driver'&&cabFullscreen)setCabFullscreen(false);
 if(v!=='settings')devVersionClicks=[];
 if(v!=='driver')cancelStopAnnouncement();
 currentView=v;applyTheme();updateShell();
 document.getElementById('pageTitle').textContent=titleFor(v);
 document.getElementById('modalRoot').innerHTML='';
 const el=document.getElementById('view');
 el.classList.toggle('network-view',v==='network');
 el.classList.toggle('driver-view',v==='driver');
 if(v==='home')renderHome(el);
 else if(v==='network')renderNetwork(el);
 else if(v==='new')renderNew(el);
 else if(v==='plans')renderPlans(el);
 else if(v==='vehicles')renderVehicles(el);
 else if(v==='detail')renderPlanDetail(el,state.selectedPlanId);
 else if(v==='driver')renderDriver(el);
 else if(v==='history')renderHistory(el);
 else if(v==='settings')renderSettings(el);
 updateShell();
}
function openActiveTrip(){if(!state.active){showView('home');showToast('Starte zuerst eine Fahrt.');return}if(state.active.status==='suspended'){showModal('Fahrt angehalten','Deine Fahrt ist pausiert. Möchtest du sie fortsetzen?',`<button class="ghost" onclick="closeModal()">Später</button><button class="primary" onclick="closeModal();resumeActive()">Fahrt fortsetzen</button>`);return}showView('driver')}
function card(content,extra=''){return `<section class="card ${extra}">${content}</section>`}
function renderHome(el){
 const active=state.active;const latest=state.history.slice().sort((a,b)=>(b.at||0)-(a.at||0))[0];
 el.innerHTML=`<div class="grid">
 ${`<section class="card hero col-12"><div class="eyebrow" style="color:#a8edf1">DEIN FAHRERCOCKPIT</div><h2>Deine Strecke.<br>Dein Fahrplan.</h2><p>Erstelle eigene Fahrten, beobachte Verspätung und Verfrühung in Echtzeit und nutze das Pausensystem — auf deinem Tablet, auch offline.</p><div class="actions"><button class="primary" onclick="showView('new')">＋ Neue Fahrt erstellen</button>${active?`<button onclick="openActiveTrip()">▶ ${active.status==='suspended'?'Fahrt fortsetzen':'Zur aktiven Fahrt'}</button>`:''}</div></section>`}
 <div class="col-4">${card(`<div class="stat"><strong>${state.plans.length}</strong><span>Gespeicherte Fahrpläne</span></div>`)}</div>
 <div class="col-4">${card(`<div class="stat"><strong>${state.history.filter(h=>h.type==='FAHRT').length}</strong><span>Fahrten in der Historie</span></div>`)}</div>
 <div class="col-4">${card(`<div class="stat"><strong>${state.history.filter(h=>h.type==='NOTFALL').length}</strong><span>Notfallmeldungen</span></div>`)}</div>
 <div class="col-7">${card(`<h2>Strecken-Vorlagen</h2><p class="muted">Keine Beispiel-Fahrten werden automatisch gespeichert. Wähle eine Vorlage zum Erstellen.</p>${Object.entries(ROUTES).map(([id,r])=>`<div class="route-card"><div><div class="route-name">${esc(r.name)}</div><div class="muted" style="font-size:.82rem;margin-top:5px">${r.stops.length} Haltestellen · Linie ${esc(r.line)}</div></div><div class="actions"><span class="route-code">${esc(routeLabel(id))}</span><button class="small" onclick="startDraftWithRoute('${id}')">Verwenden</button></div></div>`).join('')}`)}</div>
 <div class="col-5">${card(`<h2>Systemstatus</h2><div class="settings-row"><span>Aktive Fahrt</span><strong>${active?(active.status==='suspended'?'Angehalten':'Läuft'):'Keine'}</strong></div><div class="settings-row"><span>Design</span><strong>${state.settings.dark_mode?'Darkmode':'Hell'}</strong></div><div class="settings-row"><span>Versionsnummer</span><strong>v${APP_VERSION} Android</strong></div>${latest?`<div style="margin-top:15px"><div class="muted" style="font-size:.78rem">Letzter Historieneintrag</div><strong>${esc(latest.title||latest.type)}</strong><div class="muted" style="font-size:.8rem">${esc(fmtDate(latest.at))}</div></div>`:''}<div class="notice" style="margin-top:15px">Fiktive Simulation — keine echten EVAG-/SWE-Dienstplandaten.</div>` )}</div>
 </div>`;
}
function startDraftWithRoute(id){editingPlanId=null;window.draftRoute=id;draftStops=allRouteStops(id);showView('new')}
function planHasActiveTrip(id){return state.active?.plan?.id===id&&state.active.status!=='finished';}
function editPlan(id){
 const plan=state.plans.find(p=>p.id===id);if(!plan)return;
 if(planHasActiveTrip(id)){showToast('Dieser Fahrplan wird von einer aktiven oder angehaltenen Fahrt verwendet.');return;}
 editingPlanId=id;window.draftRoute=plan.routeId;draftStops=clone(plan.stops);showView('new');
}
function renderNew(el){
 const editing=state.plans.find(p=>p.id===editingPlanId);
 const chosen=editing?.routeId||(ROUTES[window.draftRoute]?window.draftRoute:'W2D');window.draftRoute=chosen;
 if(!draftStops.length)draftStops=allRouteStops(chosen);
 el.innerHTML=`<div class="grid"><div class="col-12">${card(`<h2>Fahrplan einrichten</h2><p class="muted">Lege Strecke, Fahrzeug sowie Fahr- und Pausenzeiten fest. Die Abfahrtszeit wählst du später unter „Fahrt vorbereiten“.</p><div class="form-grid"><div class="field"><label for="routeSelect">Strecke</label><select id="routeSelect" onchange="routeChanged()">${editing&&!ROUTES[chosen]?`<option value="${esc(chosen)}" selected>${esc(editing.routeName)}</option>`:''}${Object.entries(ROUTES).map(([id,r])=>`<option value="${id}" ${id===chosen?'selected':''}>${esc(routeLabel(id))} · ${esc(r.name)}</option>`).join('')}</select></div><div class="field"><label for="lineInput">Linie</label><input id="lineInput" value="${esc(ROUTES[chosen]?.line||editing?.line)}" placeholder="z. B. 3"></div>${renderPlanVehicleField(editing)}</div>`)}</div>
 <div class="col-12">${card(`<div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><h2>Haltestellen & Zeiten</h2><p class="muted" style="margin:0">Fahrzeit ab der vorherigen Haltestelle. Pausen blockieren „Nächster Halt“, bis sie abgelaufen sind.</p></div><span class="pill">${draftStops.length} Haltestellen</span></div><div id="stopEditor">${renderStopEditorHTML()}</div><div class="actions" style="justify-content:space-between;margin-top:14px"><button class="ghost" onclick="showView('home')">Abbrechen</button><button class="primary" onclick="saveNewPlan()">Fahrplan speichern</button></div>`)}</div></div>`;
 if(editing){
  document.getElementById('pageTitle').textContent='Fahrplan bearbeiten';
  document.querySelector('#view h2').textContent='Fahrplan bearbeiten';
  document.getElementById('lineInput').value=editing.line;
  document.getElementById('vehicleInput').value=editing.tram;
  document.querySelector('#view button[onclick="saveNewPlan()"]').textContent='Änderungen speichern';
 }
 syncPlanVehicleChoice();refreshDraftTimes();
}
function renderStopEditorHTML(){return draftStops.map((s,i)=>`<div class="stop-editor"><div class="stop-editor-top"><span class="stop-number">${i+1}</span><span class="stop-label">${esc(s.name)}</span><span class="time-text" id="arr_${i}">--:--</span></div><div class="stop-editor-fields"><div class="field"><label>Fahrzeit ${i===0?'(Start)':'(Min.)'}</label><input class="travel-input" data-index="${i}" type="number" min="0" max="240" value="${Number(s.travel)||0}" ${i===0?'readonly':''} onchange="pullDraftValues();refreshDraftTimes()" oninput="pullDraftValues();refreshDraftTimes()"></div><div class="field"><label>Pause (Min.)</label><input class="pause-input" data-index="${i}" type="number" min="0" max="240" value="${i===0?0:(Number(s.pause)||0)}" ${i===0?'readonly title="Start-Halt: keine Pause in dieser Version"':''} onchange="pullDraftValues();refreshDraftTimes()" oninput="pullDraftValues();refreshDraftTimes()"></div></div></div>`).join('')}
function pullDraftValues(){document.querySelectorAll('.travel-input').forEach(e=>{const i=Number(e.dataset.index);if(draftStops[i])draftStops[i].travel=Math.max(0,Number(e.value)||0)});document.querySelectorAll('.pause-input').forEach(e=>{const i=Number(e.dataset.index);if(draftStops[i])draftStops[i].pause=i===0?0:Math.max(0,Number(e.value)||0)})}
function routeChanged(){const id=document.getElementById('routeSelect').value;pullDraftValues();window.draftRoute=id;draftStops=allRouteStops(id);const li=document.getElementById('lineInput');if(li)li.value=ROUTES[id].line;const old=document.getElementById('stopEditor');if(old)old.innerHTML=renderStopEditorHTML();refreshDraftTimes();}
function refreshDraftTimes(){
 let minutes=0;
 draftStops.forEach((stop,index)=>{
  if(index>0)minutes+=Number(stop.travel)||0;
  const label=document.getElementById('arr_'+index);
  if(label)label.textContent=index===0?'Start':`+${minutes} Min.`;
  if(index<draftStops.length-1)minutes+=Number(stop.pause)||0;
 });
}
function saveNewPlan(){
 if(editingPlanId&&planHasActiveTrip(editingPlanId)){showToast('Bearbeiten während einer aktiven oder angehaltenen Fahrt ist gesperrt.');return;}
 pullDraftValues();
 const routeId=document.getElementById('routeSelect').value;
 const line=document.getElementById('lineInput').value.trim();
 const enteredVehicle=document.getElementById('vehicleInput').value.trim();
 const tram=vehicleForCode(enteredVehicle)?.code||enteredVehicle;
 if(!line||!tram){showToast('Bitte Linie und Tram/Fahrzeug eingeben.');return;}
 if(draftStops.some(s=>!Number.isFinite(Number(s.travel))||!Number.isFinite(Number(s.pause))||s.travel<0||s.pause<0||s.travel>240||s.pause>240)){
  showToast('Fahr- und Pausenminuten müssen zwischen 0 und 240 liegen.');return;
 }
 const existing=state.plans.find(p=>p.id===editingPlanId);
 const plan={...(existing||{}),id:existing?.id||newPlanId(),routeId,routeCode:existing?.routeId===routeId?existing.routeCode:routeLabel(routeId),routeName:existing?.routeId===routeId?existing.routeName:routeName(routeId),line,tram,...vehicleAssignment(tram,existing),stops:clone(draftStops),createdAt:existing?.createdAt||Date.now()};
 if(existing)state.plans[state.plans.indexOf(existing)]=plan;else state.plans.unshift(plan);
 editingPlanId=null;draftStops=[];saveState();showPlan(plan.id);
 showToast(existing?'Fahrplan aktualisiert.':'Fahrplan gespeichert. Trage nun die Abfahrtszeit ein.');
}
function calcSchedule(plan,origin){
 if(!Number.isFinite(origin))return [];
 return plan.stops.map((stop,index)=>origin+scheduleCumSeconds(plan,index)*1000);
}
function isDepartureTime(value){return typeof value==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);}
function departureEpoch(hhmm,now=Date.now()){
 if(!isDepartureTime(hhmm))return NaN;
 const [hour,minute]=hhmm.split(':').map(Number);
 const date=new Date(now);date.setHours(hour,minute,0,0);
 const difference=date.getTime()-now;
 if(difference< -12*60*60*1000)date.setDate(date.getDate()+1);
 else if(difference>12*60*60*1000)date.setDate(date.getDate()-1);
 return date.getTime();
}
function showPlan(id){
 state.selectedPlanId=id;preparation={planId:id,departure:''};saveState();showView('detail');
}
function renderPlans(el){
 el.innerHTML=`<div class="grid"><div class="col-12">${card(`<div class="actions" style="justify-content:space-between"><div><h2>Meine Fahrpläne</h2><p class="muted" style="margin:0">Wähle einen Fahrplan und bereite die nächste Fahrt vor.</p></div><button class="primary" onclick="showView('new')">＋ Neue Fahrt</button></div><div class="data-list" style="margin-top:15px">${state.plans.length?state.plans.map(p=>`<div class="data-item"><div class="data-main"><strong>${esc(p.routeName)} <span class="route-code">${esc(p.routeCode)}</span></strong><p>Linie ${esc(p.line)} · Tram ${esc(p.tram)}<br>${p.stops.length} Haltestellen · ${scheduleCumSeconds(p,p.stops.length-1)/60} Min. bis zum Ziel</p></div><div class="data-actions"><button class="small primary" onclick="showPlan('${p.id}')">Öffnen</button><button class="small" onclick="editPlan('${p.id}')" ${planHasActiveTrip(p.id)?'disabled title="Aktive oder angehaltene Fahrt vorhanden"':''}>Bearbeiten</button><button class="small danger" onclick="deletePlan('${p.id}')">Löschen</button></div></div>`).join(''):`<div class="empty">Du hast noch keine Fahrpläne gespeichert.<br><button class="primary" style="margin-top:12px" onclick="showView('new')">Ersten Fahrplan erstellen</button></div>`}</div>`)}</div></div>`;
}
function renderPlanDetail(el,id){
 const plan=state.plans.find(p=>p.id===id);
 if(!plan){el.innerHTML=card(`<h2>Fahrplan nicht gefunden</h2><button onclick="showView('plans')">Zurück</button>`);return;}
 if(preparation.planId!==id)preparation={planId:id,departure:''};
 const departure=preparation.departure;
 const times=calcSchedule(plan,departureEpoch(departure));
 el.innerHTML=`<div class="grid"><div class="col-8">${card(`<span class="route-code">${esc(plan.routeCode)}</span><h2 style="margin-top:10px">${esc(plan.routeName)}</h2><p class="muted">Linie ${esc(plan.line)} · Tram ${esc(plan.tram)}</p><div class="route-progress">${plan.stops.map((stop,index)=>`<div class="route-stop"><span class="route-dot" aria-hidden="true"></span><div class="route-stop-name">${esc(stop.name)}<small>${index===0?'Start':`Fahrzeit ${Number(stop.travel)||0} min`} · Pause ${Number(stop.pause)||0} min</small></div><div class="route-stop-time" data-plan-stop-index="${index}">${times.length?fmtTime(times[index]):index===0?'Start':`+${scheduleCumSeconds(plan,index)/60} Min.`}</div></div>`).join('')}</div>`)}</div><div class="col-4">${card(`<h2>Fahrt vorbereiten</h2><div class="settings-row"><span>Start</span><strong>${esc(plan.stops[0].name)}</strong></div><div class="settings-row"><span>Ziel</span><strong>${esc(plan.stops[plan.stops.length-1].name)}</strong></div><div class="field" style="margin-top:16px"><label for="tripDepartureInput">Abfahrt (HH:MM)</label><div class="departure-controls"><input id="tripDepartureInput" type="time" step="60" required value="${esc(departure)}" aria-describedby="departureHint" oninput="updatePreparedDeparture('${plan.id}')" onchange="updatePreparedDeparture('${plan.id}')"><button type="button" id="departureNowButton" onclick="setDepartureNow('${plan.id}')">Jetzt</button><button type="button" id="departureFiveButton" onclick="setDepartureNow('${plan.id}',5)">in 5 min.</button></div><div class="muted" id="departureHint" style="font-size:.84rem">Bitte vor dem Start die Abfahrtszeit eintragen.</div></div><button class="primary" id="startTripButton" style="width:100%;margin-top:15px" onclick="startTrip('${plan.id}')" ${isDepartureTime(departure)?'':'disabled'}>▶ Fahrt starten</button><button style="width:100%;margin-top:8px" onclick="showView('plans')">Zur Übersicht</button><button class="danger" style="width:100%;margin-top:8px" onclick="deletePlan('${plan.id}')">Fahrplan löschen</button>`)}</div></div>`;
 updatePreparedDeparture(id);
}
function updatePreparedDeparture(id){
 const input=document.getElementById('tripDepartureInput');
 const plan=state.plans.find(p=>p.id===id);
 if(!input||!plan)return;
 preparation={planId:id,departure:input.value};
 const valid=isDepartureTime(input.value);
 document.getElementById('startTripButton').disabled=!valid;
 document.getElementById('departureHint').textContent=valid?'Die Ankunftszeiten werden aus dieser Abfahrt berechnet.':'Bitte vor dem Start die Abfahrtszeit eintragen.';
 const times=valid?calcSchedule(plan,departureEpoch(input.value)):[];
 document.querySelectorAll('[data-plan-stop-index]').forEach(label=>{
  const index=Number(label.dataset.planStopIndex);
  label.textContent=valid?fmtTime(times[index]):index===0?'Start':`+${scheduleCumSeconds(plan,index)/60} Min.`;
 });
}
function setDepartureNow(id,minutes=0){
 const input=document.getElementById('tripDepartureInput');
 if(!input)return;
 input.value=fmtTime(Date.now()+minutes*60000);
 updatePreparedDeparture(id);
}
function deletePlan(id){
 showModal('Fahrplan löschen','Möchtest du diesen gespeicherten Fahrplan unwiderruflich löschen?',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="confirmDeletePlan('${id}')">Fahrplan löschen</button>`);
}
function confirmDeletePlan(id){
 state.plans=state.plans.filter(p=>p.id!==id);
 if(state.selectedPlanId===id)state.selectedPlanId=null;
 if(preparation.planId===id)preparation={planId:null,departure:''};
 saveState();closeModal();showView('plans');
}
function startTrip(id){
 const plan=state.plans.find(p=>p.id===id);
 if(!plan)return;
 const input=document.getElementById('tripDepartureInput');
 const departure=input?input.value:(preparation.planId===id?preparation.departure:'');
 if(!isDepartureTime(departure)){showToast('Bitte zuerst eine gültige Abfahrtszeit eintragen.');input?.focus();return;}
 preparation={planId:id,departure};
 if(state.active&&state.active.status!=='finished'){
  showModal('Fahrt bereits aktiv','Es gibt bereits eine aktive oder angehaltene Fahrt. Möchtest du sie beenden und diese Fahrt starten?',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="reallyStartTrip('${id}','${departure}')">Neue Fahrt starten</button>`);
  return;
 }
 reallyStartTrip(id,departure);
}
function reallyStartTrip(id,departure){
 const plan=state.plans.find(p=>p.id===id);
 if(!plan||!isDepartureTime(departure)){showToast('Bitte zuerst eine gültige Abfahrtszeit eintragen.');return;}
 cancelStopAnnouncement();prepareAnnouncementAudio();
 const origin=departureEpoch(departure);const now=Date.now();
 state.active={id:'run-'+now,plan:clone(plan),departure,position:0,startedAtEpoch:origin,actualStartEpoch:now,positionReachedAt:now,pauseEndEpoch:null,doorsOpen:false,trafficDelayMin:0,status:'running',suspendedAt:null,lastEmergencyId:null};
 preparation={planId:null,departure:''};
 saveState();showView('driver');
}
function activePlan(){return state.active?.plan}
function scheduleCumSeconds(plan,pos){let total=0;for(let i=1;i<=pos;i++){total+=(Number(plan.stops[i]?.travel)||0)*60;total+=(Number(plan.stops[i-1]?.pause)||0)*60}return total}
function activeDelayMin(at=Date.now()){const a=state.active;if(!a)return 0;const plan=a.plan;const actual=(at-a.startedAtEpoch)/1000;let expected=scheduleCumSeconds(plan,a.position);if(a.position>0){const pauseSecs=(Number(plan.stops[a.position]?.pause)||0)*60;if(pauseSecs>0&&a.positionReachedAt){expected+=Math.min(pauseSecs,Math.max(0,(at-a.positionReachedAt)/1000))}}return Math.round((actual-expected)/60)+(Number(a.trafficDelayMin)||0)}
function currentPauseSeconds(at=Date.now()){const a=state.active;if(!a||!a.pauseEndEpoch)return 0;return Math.max(0,Math.ceil((a.pauseEndEpoch-at)/1000))}
function timeDeltaText(n){return n>0?`+${n} MIN`:n<0?`${n} MIN`:'±0 MIN'}
function statusText(n){return n>0?`VERSPÄTUNG ${timeDeltaText(n)}`:n<0?`VERFRÜHUNG ${timeDeltaText(n)}`:'PÜNKTLICH ±0 MIN'}
function statusClass(n){return n>0?'late':n<0?'early':'on-time'}
function etaEpoch(){
 const active=state.active;
 if(!active)return Date.now();
 return calcSchedule(active.plan,active.startedAtEpoch)[active.position]+activeDelayMin()*60000;
}
function renderDriver(el){const a=state.active;if(!a){el.innerHTML=card(`<h2>Keine aktive Fahrt</h2><p class="muted">Öffne einen gespeicherten Fahrplan und starte die Fahrt.</p><button class="primary" onclick="showView('plans')">Fahrpläne öffnen</button>`);return}const p=a.plan;const stop=p.stops[a.position];const arrival=calcSchedule(p,a.startedAtEpoch)[a.position];const pause=currentPauseSeconds();el.innerHTML=`<div class="cab-fullscreen-status" id="cabFullscreenStatus" aria-label="Fahrtstatus"></div><div class="grid"><div class="col-8">${card(`<div class="actions" style="justify-content:space-between"><span class="pill">LINIE ${esc(p.line)} · TRAM ${esc(p.tram)}</span><span class="pill" id="runClock">${nowClock()}</span></div><div style="margin-top:23px"><div class="eyebrow">AKTUELLER HALT</div><div class="driver-station" id="currentStop">${esc(stop.name)}</div><p class="muted" style="margin:8px 0 15px">${esc(p.stops[0].name)} → ${esc(p.stops[p.stops.length-1].name)}</p><div class="actions"><span class="pill">Ankunft ${fmtTime(arrival)}</span><span class="pill" id="durationText">Fahrtdauer 00:00</span></div><div style="margin-top:16px"><span id="delayStatus" class="status ${statusClass(activeDelayMin())}">${statusText(activeDelayMin())}</span></div><div id="etaRow" class="notice ${state.settings.show_eta?'':'hidden'}" style="margin-top:13px">Geschätzte Ankunft: <strong id="etaText">${fmtTime(etaEpoch())}</strong></div><div id="pauseNotice" class="notice ${pause>0?'':'hidden'}" style="margin-top:13px">⏸️ Planmäßige Pause — noch <strong id="pauseText">${Math.floor(pause/60)}:${String(pause%60).padStart(2,'0')}</strong>. Nächster Halt ist bis zum Ende gesperrt.</div></div><div style="margin-top:20px"><div style="height:8px;background:var(--line);border-radius:999px;overflow:hidden"><div id="progressBar" style="height:100%;width:${(a.position/(p.stops.length-1))*100}%;background:var(--teal);transition:width .2s"></div></div><p class="muted" id="positionText">Haltestelle ${a.position+1} von ${p.stops.length}</p></div>` )}</div><div class="col-4">${card(`<h2>Streckenverlauf</h2><p class="muted">Ankunftszeiten aus deinem Fahrplan. Die aktuelle Zeitabweichung steht oben.</p><div class="route-progress" id="driverRouteMap">${renderRouteMapHTML(a)}</div>` )}${card(`<div class="settings-row"><span>Abfahrt</span><strong>${esc(a.departure)}</strong></div><div class="settings-row"><span>Ziel</span><strong>${esc(p.stops[p.stops.length-1].name)}</strong></div><button style="width:100%;margin-top:9px" onclick="showView('home')">Zur Übersicht</button>` )}</div><div class="col-12 cab-panel-row">${renderCabControls(a,pause)}</div></div>`;updateDriverLive()}
function renderRouteMapHTML(a){const p=a.plan;const t=calcSchedule(p,a.startedAtEpoch);const d=activeDelayMin();return p.stops.map((s,i)=>`<div class="route-stop ${i===a.position?'current':''} ${i<a.position?'visited':''}"><span class="route-dot"></span><div class="route-stop-name">${esc(s.name)}<small>${i===a.position?'Aktueller Halt':i<a.position?'Bereits passiert':'Noch bevorstehend'}</small></div><div class="route-stop-time">${fmtTime(t[i])}${i===a.position?`<small style="color:var(--${d>0?'red':d<0?'green':'teal'})">${esc(timeDeltaText(d))}</small>`:''}</div></div>`).join('')}
function followCurrentRouteStop(map,trip){
 const key=trip.id+':'+trip.position;
 if(map.dataset.followedStop===key)return;
 const row=map.querySelector('.route-stop.current');
 if(!row)return;
 const top=row.getBoundingClientRect().top-map.getBoundingClientRect().top+map.scrollTop;
 map.scrollTop=Math.max(0,top-(map.clientHeight-row.offsetHeight)/2);
 map.dataset.followedStop=key;
}
function updateDriverLive(){if(!state.active||currentView!=='driver')return;updateCabFullscreenStatus();const a=state.active;const p=a.plan;const stop=p.stops[a.position];const now=Date.now();const d=activeDelayMin(now);const clock=document.getElementById('runClock');if(clock)clock.textContent=nowClock();const st=document.getElementById('currentStop');if(st)st.textContent=stop.name;const label=document.getElementById('delayStatus');if(label){label.className='status '+statusClass(d);label.textContent=statusText(d)}const eta=document.getElementById('etaText');if(eta)eta.textContent=fmtTime(etaEpoch());const started=a.actualStartEpoch||a.startedAtEpoch;const elapsed=Math.max(0,Math.floor((now-started)/1000));const dur=document.getElementById('durationText');if(dur)dur.textContent=`Fahrtdauer ${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`;const left=currentPauseSeconds(now);const pn=document.getElementById('pauseNotice');if(pn)pn.classList.toggle('hidden',left<=0);const pt=document.getElementById('pauseText');if(pt)pt.textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;const nb=document.getElementById('nextStopBtn');if(nb)nb.disabled=left>0||a.doorsOpen||a.position>=p.stops.length-1;const pb=document.getElementById('progressBar');if(pb)pb.style.width=(a.position/(p.stops.length-1))*100+'%';const pos=document.getElementById('positionText');if(pos)pos.textContent=`Haltestelle ${a.position+1} von ${p.stops.length}`;const map=document.getElementById('driverRouteMap');if(map){map.innerHTML=renderRouteMapHTML(a);followCurrentRouteStop(map,a)}}
function tick(){document.getElementById('clock').textContent=nowClock();if(state.active&&state.active.status==='running'){if(state.active.pauseEndEpoch&&Date.now()>=state.active.pauseEndEpoch){state.active.pauseEndEpoch=null;saveState();showToast('Planmäßige Pause beendet — weiterfahren möglich.')}if(currentView==='driver')updateDriverLive();}updateShell()}
function nextStop(){
 const active=state.active;
 if(!active||active.status!=='running')return;
 if(currentPauseSeconds()>0){showToast('Die planmäßige Pause läuft noch.');return;}
 if(active.doorsOpen){showToast('Bitte zuerst die Türen schließen.');return;}
 if(active.position>=active.plan.stops.length-1)return;
 cancelStopAnnouncement();prepareAnnouncementAudio();
 active.position++;active.positionReachedAt=Date.now();active.doorsOpen=false;
 const pause=Number(active.plan.stops[active.position].pause)||0;
 active.pauseEndEpoch=pause>0?Date.now()+pause*60000:null;
 saveState();showView('driver');
 scheduleStopAnnouncement(active.id,active.position,active.plan.stops[active.position].name);
}
function driverPrevious(){
 const active=state.active;
 if(!active||active.status!=='running'||active.position<=0||currentPauseSeconds()>0)return;
 cancelStopAnnouncement();active.position--;active.positionReachedAt=Date.now();active.pauseEndEpoch=null;
 saveState();showView('driver');playDriverSound('back');
}
function toggleDoors(){if(!state.active||state.active.status!=='running')return;state.active.doorsOpen=!state.active.doorsOpen;saveState();showView('driver');playDriverSound(state.active.doorsOpen?'door_open':'door_close')}
function openTrafficModal(){if(!state.active||state.active.status!=='running'){showToast('Keine laufende Fahrt.');return}playDriverSound('traffic');showModal('🚧 Stau melden','Wie viel zusätzliche Verspätung soll durch den Stau entstehen?',`<div class="traffic-actions">${[1,2,5,10].map(n=>`<button onclick="applyTraffic(${n})">+${n} Min.</button>`).join('')}<button onclick="closeModal()">Abbrechen</button></div>`)}
function applyTraffic(n){if(!state.active)return;state.active.trafficDelayMin=(Number(state.active.trafficDelayMin)||0)+n;state.history.unshift({id:'h'+Date.now(),type:'STAU',at:Date.now(),title:'Stau +'+n+' min',line:state.active.plan.line,tram:state.active.plan.tram,route:state.active.plan.routeName,stop:state.active.plan.stops[state.active.position].name,delta:n});saveState();closeModal();showView('driver');showToast(`Stau gemeldet: +${n} min`)}
function openEmergencyModal(){const a=state.active;if(!a||a.status!=='running')return;const p=a.plan;playDriverSound('emergency');showModal('⚠ Notfall melden','Die Simulation wird bis zum Fortsetzen angehalten. Wähle einen Halt dieser Strecke und schreibe bei Bedarf eine Notiz.',`<div class="field"><label>Aktueller Standort</label><select id="emergencyLocation">${p.stops.map((s,i)=>`<option ${i===a.position?'selected':''} value="${esc(s.name)}">${esc(s.name)}</option>`).join('')}</select></div><div class="field" style="margin-top:12px"><label>Grund / Notiz (optional)</label><textarea id="emergencyNote" rows="3" placeholder="Was ist passiert?"></textarea></div><p class="muted">Zeitpunkt: ${fmtDate(Date.now())}</p><div class="modal-footer"><button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="confirmEmergency()">Notfall speichern</button></div>`)}
function confirmEmergency(){const a=state.active;if(!a)return;cancelStopAnnouncement();const location=document.getElementById('emergencyLocation').value;const note=document.getElementById('emergencyNote').value.trim();a.status='suspended';a.suspendedAt=Date.now();const h={id:'h'+Date.now(),type:'NOTFALL',at:Date.now(),title:'Notfall · '+location,line:a.plan.line,tram:a.plan.tram,route:a.plan.routeName,stop:location,delta:activeDelayMin(),note,resumeTrip:clone(a)};state.history.unshift(h);a.lastEmergencyId=h.id;saveState();closeModal();showView('home');showModal('Notfall gespeichert','Deine Fahrt wurde angehalten und in der Historie gespeichert. Du kannst sie später fortsetzen.',`<button class="primary" onclick="closeModal();resumeActive()">Fahrt fortsetzen</button><button onclick="closeModal();showView('history')">Historie öffnen</button>`)}
function resumeActive(){const a=state.active;if(!a){showToast('Keine angehaltene Fahrt vorhanden.');showView('home');return}if(a.status==='suspended'&&a.suspendedAt){const shift=Date.now()-a.suspendedAt;a.startedAtEpoch+=shift;if(a.positionReachedAt)a.positionReachedAt+=shift;if(a.pauseEndEpoch)a.pauseEndEpoch+=shift;a.status='running';a.suspendedAt=null;saveState()}showView('driver')}
function finishTrip(reachedEnd){const a=state.active;if(!a)return;cancelStopAnnouncement();playDriverSound('finish');const p=a.plan;const d=activeDelayMin();const elapsed=Math.max(0,Math.floor((Date.now()-(a.actualStartEpoch||a.startedAtEpoch))/1000));state.history.unshift({id:'h'+Date.now(),type:'FAHRT',at:Date.now(),title:(reachedEnd?'Ziel erreicht':'Vorzeitig beendet')+' · '+p.routeName,line:p.line,tram:p.tram,route:p.routeName,duration:`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`,delta:d,stop:p.stops[a.position].name,status:reachedEnd?'Ziel erreicht':'Vorzeitig beendet'});state.active=null;if(cabFullscreen)setCabFullscreen(false);saveState();if(reachedEnd){const rev=ROUTES[p.routeId]?.reverse;if(rev&&ROUTES[rev]){showModal('Fahrt beendet','Du hast dein Ziel erreicht. Möchtest du eine Rückfahrt zum Startpunkt vorbereiten?',`<button onclick="closeModal();showView('home')">Nein, zur Übersicht</button><button class="primary" data-route="${esc(rev)}" data-line="${esc(p.line)}" data-tram="${esc(p.tram)}" onclick="closeModal();createReturnPlan(this.dataset.route,this.dataset.line,this.dataset.tram)">Ja, Rückfahrt erstellen</button>`);return}}showModal('Fahrt gespeichert',`Fahrtdauer: <strong>${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}</strong><br>Zeitabweichung: <strong>${esc(timeDeltaText(d))}</strong><br>Status: ${esc(reachedEnd?'Ziel erreicht':'Vorzeitig beendet')}`,`<button class="primary" onclick="closeModal();showView('history')">Historie ansehen</button><button onclick="closeModal();showView('home')">Zur Übersicht</button>`)}
function createReturnPlan(routeId,line,tram){
 if(!ROUTES[routeId])return;
 const plan={id:newPlanId(),routeId,routeCode:routeLabel(routeId),routeName:routeName(routeId),line,tram,...vehicleAssignment(tram),stops:allRouteStops(routeId),createdAt:Date.now()};
 state.plans.unshift(plan);saveState();showPlan(plan.id);
 showToast('Rückfahrt vorbereitet. Bitte Abfahrtszeit eintragen.');
}
function openPassengerDisplay(){if(!state.active)return;playDriverSound('passenger');const a=state.active;const p=a.plan;const next=p.stops[Math.min(p.stops.length-1,a.position+1)].name;showModal('📟 Fahrgastanzeige',`<div style="background:var(--nav);color:white;border-radius:16px;padding:23px;text-align:center"><div style="font-size:.84rem;letter-spacing:.15em;color:#8edce1;font-weight:900">LINIE ${esc(p.line)}</div><div style="font-size:1.5rem;font-weight:900;margin:8px 0 17px">${esc(p.stops[p.stops.length-1].name)}</div><div style="border-top:1px solid #46616b;border-bottom:1px solid #46616b;padding:15px"><div style="font-size:.76rem;color:#b6ccd2">AKTUELLER HALT</div><div style="font-size:1.45rem;font-weight:900;margin:6px 0">${esc(p.stops[a.position].name)}</div><div style="color:#d8e7eb">Nächster Halt: ${esc(next)}</div></div><div style="font-size:1.8rem;font-weight:900;margin-top:16px">${nowClock()}</div><div style="margin-top:9px;color:#ffc5be;font-weight:850">${esc(statusText(activeDelayMin()))}</div>${currentPauseSeconds()>0?`<div style="margin-top:8px;color:#ffe19a">Pause ${Math.ceil(currentPauseSeconds()/60)} min</div>`:''}</div>`,`<button class="primary" onclick="closeModal()">Schließen</button>`)}
function renderHistory(el){el.innerHTML=`<div class="grid"><div class="col-12">${card(`<div class="actions" style="justify-content:space-between"><div><h2>Fahrt-Historie</h2><p class="muted" style="margin:0">Fahrten, Notfallmeldungen und Stau-Ereignisse. Einträge können einzeln gelöscht werden.</p></div><button class="danger" onclick="clearHistory()">Alles löschen</button></div><div class="data-list" style="margin-top:15px">${state.history.length?state.history.map(h=>`<div class="data-item"><div class="data-main"><strong>${esc(h.title||h.type)} ${h.type==='NOTFALL'?'<span class="route-code" style="background:var(--red);color:white">NOTFALL</span>':''}</strong><p>${esc(fmtDate(h.at))}${h.line?`<br>Linie ${esc(h.line)} · Tram ${esc(h.tram||'—')} · ${esc(h.route||'')}`:''}${h.stop?`<br>Haltestelle: ${esc(h.stop)}`:''}${h.duration?`<br>Fahrtdauer ${esc(h.duration)} · Abweichung ${esc(timeDeltaText(Number(h.delta)||0))}`:''}${h.note?`<br>Notiz: ${esc(h.note)}`:''}</p></div><div class="data-actions">${h.type==='NOTFALL'&&h.resumeTrip?`<button class="small primary" onclick="resumeFromHistory('${h.id}')">Fahrt fortsetzen</button>`:''}<button class="small danger" onclick="deleteHistoryEntry('${h.id}')">Eintrag löschen</button></div></div>`).join(''):`<div class="empty">Noch keine Historieneinträge gespeichert.</div>`}</div>` )}</div></div>`}
function resumeFromHistory(id){const h=state.history.find(x=>x.id===id);if(!h||!h.resumeTrip){showToast('Kein fortsetzbarer Fahrzustand gespeichert.');return}state.active=clone(h.resumeTrip);if(state.active.status!=='suspended'){state.active.status='suspended';state.active.suspendedAt=Date.now()}saveState();resumeActive()}
function deleteHistoryEntry(id){showModal('Eintrag löschen','Diesen Historieneintrag dauerhaft löschen?',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="state.history=state.history.filter(h=>h.id!=='${id}');saveState();closeModal();showView('history')">Löschen</button>`)}
function clearHistory(){if(!state.history.length){showToast('Die Historie ist bereits leer.');return}showModal('Historie löschen','Möchtest du wirklich alle Historieneinträge löschen?',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="state.history=[];saveState();closeModal();showView('history')">Alles löschen</button>`)}
function renderSettings(el){el.innerHTML=`<div class="grid"><div class="col-7">${card(`<h2>Darstellung</h2><div class="settings-row"><div><strong>Darkmode</strong><div class="muted" style="font-size:.84rem">Dunkles Design für abends.</div></div><input type="checkbox" ${state.settings.dark_mode?'checked':''} onchange="state.settings.dark_mode=this.checked;saveState();applyTheme();showView('settings')"></div><div class="settings-row"><div><strong>Geschätzte Ankunft (ETA)</strong><div class="muted" style="font-size:.84rem">Zeigt eine berechnete Zeit zusätzlich zur Zeitabweichung.</div></div><input type="checkbox" ${state.settings.show_eta?'checked':''} onchange="state.settings.show_eta=this.checked;saveState();showView('settings')"></div>${renderDevModeSetting()}<div class="settings-row"><div><strong>Version</strong><div class="muted" style="font-size:.84rem">© MeisterErwat</div></div><button id="settingsVersion" class="version-trigger" type="button" onclick="registerDevVersionClick()" aria-label="Versionsnummer">v${APP_VERSION}</button></div>` )}${card(`<h2>Daten sichern</h2><p class="muted">Exportiere deine Fahrpläne, Historie und Einstellungen in eine JSON-Datei. Auf diesem Tablet bleiben die Daten lokal.</p><div class="actions"><button class="primary" onclick="exportData()">Daten exportieren</button><button onclick="document.getElementById('importFile').click()">Daten importieren</button><input id="importFile" type="file" accept="application/json,.json" class="hidden" onchange="importData(event)"></div>` )}</div><div class="col-5">${card(`<h2>Eigene Routencodes</h2><p class="muted">Benenne jede Streckenvorlage selbst, zum Beispiel L3D oder D3M. Die gespeicherten Fahrpläne bleiben unverändert.</p>${Object.entries(ROUTES).map(([id,r])=>`<div class="field" style="margin:10px 0"><label>${esc(r.name)} <span class="muted">(${esc(id.startsWith('custom-')?routeLabel(id):id)})</span></label><input id="rn_${id}" value="${esc(routeLabel(id))}" maxlength="14"></div>`).join('')}<button class="primary" style="width:100%;margin-top:8px" onclick="saveRouteNames()">Routencodes speichern</button>` )}</div><div class="col-12">${card(`<h2>Über die App</h2><p class="muted">Fahrplan Manager Tablet ist eine eigenständige, offlinefähige fiktive Simulation. Sie ist nicht mit einem echten EVAG-/SWE-System verbunden und enthält keine Echtzeitdaten.</p><div class="notice">Die Uhrzeit wird von deinem Tablet bezogen. Bitte stelle unter Android Datum, Uhrzeit und Zeitzone korrekt ein, damit die Verspätungsberechnung stimmt.</div>` )}</div></div>`}
function renderDevModeSetting(){
 return state.settings.dev_options_unlocked?`<label class="settings-row" for="devMode"><div><strong>Dev-Modus</strong><div class="muted" style="font-size:.84rem">Bearbeitung des schematischen Netzplans freischalten.</div></div><input id="devMode" type="checkbox" ${state.settings.dev_mode?'checked':''} onchange="setDevMode(this.checked)"></label>`:'';
}
function registerDevVersionClick(){
 if(currentView!=='settings'){devVersionClicks=[];return;}
 const now=performance.now();devVersionClicks=devVersionClicks.filter(at=>now-at<=5000);devVersionClicks.push(now);
 if(devVersionClicks.length<10)return;
 devVersionClicks=[];state.settings.dev_options_unlocked=!state.settings.dev_options_unlocked;
 if(!state.settings.dev_options_unlocked){state.settings.dev_mode=false;networkEditing=false;networkEditSelection=null;networkConnectFrom=null;networkUndo=[];}
 saveState();showView('settings');showToast(state.settings.dev_options_unlocked?'Dev-Einstellungen freigeschaltet.':'Dev-Modus deaktiviert und ausgeblendet.');
}
document.addEventListener('click',event=>{if(!event.target.closest('#settingsVersion,#appVersion'))devVersionClicks=[];},true);
function setDevMode(enabled){if(enabled&&!state.settings.dev_options_unlocked)return;state.settings.dev_mode=enabled===true;networkEditing=false;networkEditSelection=null;networkUndo=[];saveState();showView('settings');}
function saveRouteNames(){Object.keys(ROUTES).forEach(id=>{const v=document.getElementById('rn_'+id)?.value.trim();if(v)state.settings.route_names[id]=v;else delete state.settings.route_names[id]});saveState();showToast('Routencodes gespeichert.');showView('settings')}
function exportData(){
 const json=JSON.stringify(state,null,2);
 if(window.AndroidBackup&&typeof AndroidBackup.save==='function'){
  try{AndroidBackup.save(json);return;}catch(error){showToast('Export konnte nicht gestartet werden.');return;}
 }
 const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download='fahrplan-manager-tablet-backup.json';
 document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importData(event){
 const file=event.target.files?.[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const data=JSON.parse(reader.result);
   if(!Array.isArray(data.plans)||!Array.isArray(data.history)||!data.settings||data.plans.some(plan=>!Array.isArray(plan.stops)||plan.stops.length<2))throw new Error('Ungültiges Format');
   const imported=normalizeState(data);
   cancelStopAnnouncement();state=imported;syncCustomRoutes();networkEditing=false;networkEditSelection=null;networkUndo=[];vehicleEditId=null;editingPlanId=null;lineDraft=null;draftStops=[];window.draftRoute=null;preparation={planId:null,departure:''};
   saveState();applyTheme();showView('home');showToast('Daten importiert.');
  }catch(error){showToast('Datei ist ungültig oder kein Backup dieser App.');}
 };
 reader.onerror=()=>showToast('Die Sicherungsdatei konnte nicht gelesen werden.');
 reader.readAsText(file);
}
function showModal(title,body,footer){document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" role="presentation" onclick="if(event.target===this)closeModal()"><div class="modal" role="dialog" aria-modal="true"><h2>${title}</h2><div>${body}</div><div class="modal-footer">${footer||'<button class="primary" onclick="closeModal()">Schließen</button>'}</div></div></div>`}
function closeModal(){resetCabEmergency();stopDriverSound();document.getElementById('modalRoot').innerHTML=''}

function appBack(){if(document.getElementById('modalRoot').innerHTML){closeModal();return}if(cabFullscreen){setCabFullscreen(false);return}if(currentView==='driver'){showView('home')}else if(currentView==='detail'){showView('plans')}else showView('home')}
window.appBack=appBack;
applyTheme();saveState();showView('home');setInterval(tick,1000);
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
