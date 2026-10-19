'use strict';
let lineDraft=null;
let networkZoom=null;
let networkServiceMode='current';
function resizeNetworkMap(){const svg=document.getElementById('lineMapSvg');if(!svg)return;const scale=networkZoom??svg.parentElement.clientWidth/1100;svg.style.width=1100*scale+'px';svg.style.height=1080*scale+'px';}
function zoomNetwork(factor){const svg=document.getElementById('lineMapSvg');if(!svg)return;networkZoom=factor==='fit'?null:Math.max(.2,Math.min(3,(networkZoom??svg.parentElement.clientWidth/1100)*factor));resizeNetworkMap();}
window.addEventListener('resize',()=>{if(currentView==='network')resizeNetworkMap();});
function setNetworkServiceMode(mode){networkServiceMode=mode==='regular'?'regular':'current';renderNetworkMap();}
function networkConnections(mode=networkServiceMode){
 const active=mode==='regular'?ERFURT_NETWORK.routes:ERFURT_NETWORK.serviceRoutes;
 const edges=new Map(),activePairs=new Set();
 const key=(a,b)=>JSON.stringify([a,b].sort());
 for(const r of Object.values(active))for(let i=1;i<r.stops.length;i++){
  const from=r.stops[i-1],to=r.stops[i],pair=key(from,to);activePairs.add(pair);edges.set(r.line+pair,{from,to,line:r.line,color:r.color,inactive:false});
 }
 if(mode!=='regular')for(const r of Object.values(ERFURT_NETWORK.routes))for(let i=1;i<r.stops.length;i++){
  const from=r.stops[i-1],to=r.stops[i],pair=key(from,to);if(!activePairs.has(pair))edges.set('inactive'+pair,{from,to,line:r.line,color:'#83919a',inactive:true});
 }
 return [...edges.values()];
}
function validCustomRoutes(value){
 const result={};
 if(!value||typeof value!=='object')return result;
 for(const [id,r] of Object.entries(value)){
  if(!/^custom-[a-zA-Z0-9-]+$/.test(id)||!r||typeof r.name!=='string'||typeof r.line!=='string'||!Array.isArray(r.stops)||r.stops.length<2||r.stops.length>150)continue;
  if(r.stops.some(n=>typeof n!=='string'||!n.trim()||n.length>100))continue;
  const points=r.stops.map((name,i)=>{
const p=r.points?.[i];
   return {x:Number.isFinite(p?.x)?Math.max(15,Math.min(1085,p.x)):100+i%8*120,y:Number.isFinite(p?.y)?Math.max(15,Math.min(1065,p.y)):100+Math.floor(i/8)*85};
  });
  result[id]={name:r.name.slice(0,100),line:r.line.slice(0,20),code:typeof r.code==='string'?r.code.trim().slice(0,14):'',stops:r.stops.map(n=>n.trim()),points,color:/^#[0-9a-f]{6}$/i.test(r.color)?r.color:'#168a95',times:r.stops.map((_,i)=>i?Math.max(0,Math.min(240,Number.isFinite(Number(r.times?.[i]))?Number(r.times[i]):2)):0)};
 }
 return result;
}
function syncCustomRoutes(){
 Object.keys(ROUTES).filter(id=>id.startsWith('custom-')).forEach(id=>delete ROUTES[id]);
 Object.assign(ROUTES,state.customRoutes);
 Object.keys(state.customRoutes).forEach(id=>{if(state.settings.route_names[id]===id)delete state.settings.route_names[id];});
 state.plans.forEach(plan=>{if(plan.routeId?.startsWith('custom-')&&plan.routeCode===plan.routeId)plan.routeCode=routeLabel(plan.routeId);});
}
function openLineEditor(id){
 if(lineDraft?.dirty){showModal('Ungespeicherte Linie','Die Änderungen zuerst speichern oder verwerfen.',`<button onclick="closeModal()">Weiter bearbeiten</button><button class="danger" onclick="lineDraft=null;closeModal();openLineEditor('${id||''}')">Änderungen verwerfen</button>`);return;}
 const r=ROUTES[id];
 lineDraft={sourceId:id,id:id?.startsWith('custom-')?id:null,name:r?.name||'Neue Linie',line:r?.line||'',code:r?.code||(id?.startsWith('custom-')?state.settings.route_names[id]||'':''),color:r?.color||'#168a95',dirty:false,stops:(r?.stops||[]).map((name,i)=>({name,travel:i?(r.times?.[i]??2):0,...(r.points?.[i]||ERFURT_NETWORK.positions[name]||{x:100+i%8*120,y:100+Math.floor(i/8)*85})}))};
 showView('network');
}
function renderNetwork(el){
 const currentIds=['EF1BH','EF1BR','EF2H','EF2R','EF3H','EF3R','EF4H','EF4R','EF5H','EF5R','EF6BH','EF6BR'];
 const option=(id,r)=>`<option value="${esc(id)}" ${id===lineDraft?.sourceId?'selected':''}>Linie ${esc(r.line)} · ${esc(r.name)}</option>`;
 const other=Object.entries(ROUTES).filter(([id])=>!currentIds.includes(id));
 el.innerHTML=`<div class="grid network-workspace">
 <div class="col-12">${card(`<h2>Linien & Netz</h2>
 <p class="muted">Erfurt · mit EVAG-Fahrplänen am 19.10.2026 abgeglichen · beide Fahrtrichtungen.</p>
 <div class="actions"><select id="networkTemplate" aria-label="Linie zum Bearbeiten wählen" style="flex:1">
 <optgroup label="Fahrplanstand 19.10.2026">${currentIds.map(id=>option(id,ROUTES[id])).join('')}</optgroup>
 <optgroup label="Weitere Vorlagen & eigene Linien">${other.map(([id,r])=>option(id,r)).join('')}</optgroup></select>
 <button onclick="openLineEditor(document.getElementById('networkTemplate').value)">Linie bearbeiten</button><button class="primary" onclick="openLineEditor()">＋ Neue Linie</button></div>
 <details style="margin-top:14px"><summary>Fahrplan, Quellen & Gültigkeit</summary>
 <p>Linie 1 fährt während der Baustelle Rieth–Thüringenhalle, Linie 6 Europaplatz–Steigerstraße. Grundlage: EVAG-Baufahrpläne F1012, gültig ab 10.10.2026, und die Haltestellenfahrpläne beider Richtungen. Die Sperrung gilt vom 09.10.2026, 21 Uhr, bis 26.10.2026, Betriebsbeginn. Die Ansicht „Regelnetz“ bleibt zusätzlich verfügbar.</p>
 <p>Die Haltestellenfolgen sind recherchiert. Fahrzeiten im Planer bleiben frei einstellbare Simulationswerte, vorbelegt mit zwei Minuten je Abschnitt. Abfahrtsminuten, Kurzläufer und Nachtlinien sind nicht vollständig importiert. Kein Live-Datenfeed.</p>
 <p><a href="https://www.evag-erfurt.de/evag/fahrplan/liniennetz" target="_blank" rel="noopener">EVAG-Netzplan</a> · <a href="https://www.evag-erfurt.de/evag/home/fahrplan/haltestellenfahrplan" target="_blank" rel="noopener">Offizielle Linienfahrpläne</a> · <a href="https://www.evag-erfurt.de/evag/warschauer%2Bstrasse" target="_blank" rel="noopener">Baustelle und Baufahrpläne 1/6</a></p></details>`)}</div>
 <div class="col-12" id="networkCanvasSection">${card(`<h2>Schematischer Netzplan</h2>
 <div class="field network-mode-field"><label for="networkServiceMode">Fahrplanstand der Karte</label><select id="networkServiceMode" onchange="setNetworkServiceMode(this.value)"><option value="current" ${networkServiceMode==='current'?'selected':''}>19.10.2026 · Baufahrplan 1 und 6</option><option value="regular" ${networkServiceMode==='regular'?'selected':''}>Regelnetz · ohne Baustelle</option></select></div>
 <div class="notice" id="networkServiceNotice"></div><div class="network-legend" id="networkLegend"></div>
 <p class="muted">${lineDraft?'Haltestelle anklicken: anhängen. Gewählte Halte ziehen: Position ändern. Für einen neuen Halt Namen eingeben und auf freie Fläche klicken.':'Wähle eine Vorlage oder erstelle eine neue Linie.'}</p>
 ${lineDraft?`<div class="field"><label for="mapStopName">Neuer Halt auf der Karte</label><input id="mapStopName" maxlength="100" placeholder="Haltestellenname, dann auf die Karte klicken"></div>`:''}
 <div class="actions network-map-tools"><button class="small" onclick="zoomNetwork(1/1.25)" aria-label="Netzplan verkleinern">−</button><button class="small" onclick="zoomNetwork(1.25)" aria-label="Netzplan vergrößern">＋</button><button class="small" onclick="zoomNetwork('fit')">Ganzes Netz</button></div>
 <div class="network-map" id="networkMap"></div>`)}</div>
 <div class="col-12" id="lineInspector"></div></div>`;
 renderLineInspector();renderNetworkMap();
}
function renderLineInspector(){
 const el=document.getElementById('lineInspector');if(!el)return;
 if(!lineDraft){el.innerHTML=card('<h2>Deine Linienwerkstatt</h2><p class="muted">Verbinde vorhandene Haltestellen oder zeichne eigene. Danach kannst du die Linie unter „Neue Fahrt“ verwenden. Die bisherigen Streckenvorlagen bleiben verfügbar.</p>');return;}
 const d=lineDraft;
 el.innerHTML=card(`<h2>${d.id?'Eigene Linie bearbeiten':'Linie entwerfen'}</h2><div class="field"><label for="editorName">Name</label><input id="editorName" maxlength="100" value="${esc(d.name)}" oninput="lineDraft.name=this.value;lineDraft.dirty=true"></div><div class="form-grid" style="margin:12px 0"><div class="field"><label for="editorLine">Linie</label><input id="editorLine" maxlength="20" value="${esc(d.line)}" oninput="lineDraft.line=this.value;lineDraft.dirty=true"></div><div class="field"><label for="editorCode">Streckenkürzel (optional)</label><input id="editorCode" maxlength="14" value="${esc(d.code||'')}" placeholder="z. B. L7N, RING" oninput="lineDraft.code=this.value;lineDraft.dirty=true"></div><div class="field"><label for="editorColor">Farbe</label><input id="editorColor" type="color" value="${esc(d.color)}" oninput="lineDraft.color=this.value;lineDraft.dirty=true;renderNetworkMap()"></div></div><div class="actions"><button class="small" onclick="reverseLineDraft()">⇄ Reihenfolge umkehren</button><span class="pill">${d.stops.length} Halte</span></div><p class="muted">Fahrzeit ab vorherigem Halt in Minuten. Pfeile ändern die Reihenfolge.</p><div class="line-stops">${d.stops.map((s,i)=>`<div class="line-stop"><span class="stop-number">${i+1}</span><div class="field"><label for="ln_${i}">Haltestelle ${i+1}</label><input id="ln_${i}" maxlength="100" value="${esc(s.name)}" onchange="lineDraft.stops[${i}].name=this.value;lineDraft.dirty=true;renderNetworkMap()"><label for="lt_${i}">Fahrzeit (Min.)</label><input id="lt_${i}" type="number" min="0" max="240" step="1" value="${s.travel}" ${i?'':'readonly'} oninput="lineDraft.stops[${i}].travel=Number(this.value);lineDraft.dirty=true"></div><div class="line-stop-actions"><button class="small" aria-label="Halt ${i+1} nach oben" ${i?'':'disabled'} onclick="moveLineStop(${i},-1)">↑</button><button class="small" aria-label="Halt ${i+1} nach unten" ${i<d.stops.length-1?'':'disabled'} onclick="moveLineStop(${i},1)">↓</button><button class="small" aria-label="Halt ${i+1} entfernen" onclick="lineDraft.stops.splice(${i},1);refreshLineDraft()">×</button></div></div>`).join('')}</div><div class="actions" style="margin-top:14px"><button class="primary" onclick="saveLineDraft()">Linie speichern</button><button onclick="lineDraft=null;showView('network')">Verwerfen</button>${d.id?`<button class="danger" onclick="deleteCustomLine()">Löschen</button>`:''}</div>`);
}
function refreshLineDraft(){lineDraft.dirty=true;if(lineDraft.stops[0])lineDraft.stops[0].travel=0;renderLineInspector();renderNetworkMap();}
function moveLineStop(i,delta){const j=i+delta;if(j<0||j>=lineDraft.stops.length)return;[lineDraft.stops[i],lineDraft.stops[j]]=[lineDraft.stops[j],lineDraft.stops[i]];refreshLineDraft();}
function reverseLineDraft(){const times=lineDraft.stops.slice(1).map(s=>s.travel).reverse();lineDraft.stops.reverse().forEach((s,i)=>s.travel=i?times[i-1]:0);refreshLineDraft();}
function renderNetworkMap(){
 const host=document.getElementById('networkMap');if(!host)return;
 const service=networkServiceMode==='regular'?ERFURT_NETWORK.routes:ERFURT_NETWORK.serviceRoutes;
 document.getElementById('networkServiceNotice').textContent=networkServiceMode==='regular'?'Regelnetz in beiden Richtungen, ohne die befristete Baustellenführung.':'Stand 19.10.2026: Linie 1 ab Rieth, Linie 6 ab Europaplatz. Grau gestrichelt: Regelverbindungen, die im Baufahrplan nicht von der Stadtbahn bedient werden; dort besteht teilweise Schienenersatzverkehr.';
 document.getElementById('networkLegend').innerHTML=Object.values(service).filter((_,i)=>i%2===0).map(r=>`<span class="pill" style="--route-color:${r.color}">${r.line} · ${esc(r.stops[0])} → ${esc(r.stops.at(-1))}</span>`).join('');
 const pts=ERFURT_NETWORK.positions;
 const path=stops=>stops.map(s=>`${s.x},${s.y}`).join(' ');
 const connections=networkConnections().sort((a,b)=>Number(b.inactive)-Number(a.inactive));
 host.innerHTML=`<svg id="lineMapSvg" viewBox="0 0 1100 1080" role="group" aria-label="Schematisches Erfurter Straßenbahnnetz mit bearbeitbarer Linie"><rect width="1100" height="1080" fill="var(--soft)"/>
 <g class="network-connections" pointer-events="none">${connections.map(edge=>{
  const a=pts[edge.from],b=pts[edge.to];
  return `<line class="network-link${edge.inactive?' inactive':''}" data-from="${esc(edge.from)}" data-to="${esc(edge.to)}" data-line="${edge.line}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${edge.color}" stroke-width="4" opacity="${edge.inactive?'.45':'.65'}" ${edge.inactive?'stroke-dasharray="7 7"':''}/>`;
 }).join('')}</g>
 ${Object.entries(pts).map(([n,p],i)=>`<g class="network-node" data-name="${esc(n)}" data-stop="${i}" tabindex="0" role="button" aria-label="${esc(n)} anhängen"><circle cx="${p.x}" cy="${p.y}" r="9" fill="var(--panel)" stroke="var(--muted)" stroke-width="2"/><text x="${p.x+12}" y="${p.y+4}">${esc(n)}</text><title>${esc(n)}</title></g>`).join('')}
 ${lineDraft?`<polyline id="draftPolyline" points="${path(lineDraft.stops)}" fill="none" stroke="${lineDraft.color}" stroke-width="6"/>${lineDraft.stops.map((s,i)=>`<g class="draft-node" data-index="${i}"><circle cx="${s.x}" cy="${s.y}" r="13" fill="${lineDraft.color}"/><text x="${s.x}" y="${s.y+4}" text-anchor="middle" fill="white">${i+1}</text><title>${esc(s.name)} · ziehen zum Verschieben</title></g>`).join('')}`:''}</svg>`;
 const svg=host.querySelector('svg');
 const point=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());};
 resizeNetworkMap();
 let dragging=null,suppressClick=false;
 svg.onpointerdown=e=>{const g=e.target.closest('.draft-node');if(!g||!lineDraft)return;dragging={i:Number(g.dataset.index),x:e.clientX,y:e.clientY,moved:false};svg.setPointerCapture(e.pointerId);e.preventDefault();};
 svg.onpointermove=e=>{if(!dragging)return;const p=point(e);dragging.moved ||= Math.hypot(e.clientX-dragging.x,e.clientY-dragging.y)>4;if(!dragging.moved)return;const s=lineDraft.stops[dragging.i];s.x=Math.max(15,Math.min(1085,p.x));s.y=Math.max(15,Math.min(1065,p.y));const g=svg.querySelector(`[data-index="${dragging.i}"]`);g.querySelector('circle').setAttribute('cx',s.x);g.querySelector('circle').setAttribute('cy',s.y);g.querySelector('text').setAttribute('x',s.x);g.querySelector('text').setAttribute('y',s.y+4);svg.querySelector('#draftPolyline').setAttribute('points',path(lineDraft.stops));lineDraft.dirty=true;};
 svg.onpointerup=()=>{if(dragging){suppressClick=dragging.moved;dragging=null;}};
 svg.onpointercancel=()=>{dragging=null;};
 const append=n=>{if(!lineDraft)return;const p=pts[n];lineDraft.stops.push({name:n,...p,travel:lineDraft.stops.length?2:0});refreshLineDraft();};
 svg.querySelectorAll('.network-node').forEach(g=>{g.onclick=()=>append(Object.keys(pts)[Number(g.dataset.stop)]);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}));}};});
 svg.onclick=e=>{if(suppressClick){suppressClick=false;return;}if(!lineDraft||e.target.closest('.network-node,.draft-node'))return;const input=document.getElementById('mapStopName');const name=input.value.trim();if(!name){showToast('Zuerst den Namen für den neuen Halt eingeben.');return;}const p=point(e);lineDraft.stops.push({name,x:p.x,y:p.y,travel:lineDraft.stops.length?2:0});input.value='';refreshLineDraft();};
}
function saveLineDraft(){
 const d=lineDraft;
 if(!d||!d.name.trim()||!d.line.trim()||d.stops.length<2||d.stops.length>150||d.stops.some(s=>!s.name.trim()||!Number.isFinite(s.travel)||s.travel<0||s.travel>240)){showToast('Name, Linie und 2–150 benannte Halte mit Fahrzeiten von 0–240 Minuten erforderlich.');return;}
 const id=d.id||'custom-'+newPlanId().slice(5);
 state.customRoutes[id]={name:d.name.trim(),line:d.line.trim(),code:(d.code||'').trim().slice(0,14),color:d.color,stops:d.stops.map(s=>s.name.trim()),times:d.stops.map((s,i)=>i?s.travel:0),points:d.stops.map(s=>({x:s.x,y:s.y}))};
 delete state.settings.route_names[id];
 saveState();syncCustomRoutes();lineDraft=null;openLineEditor(id);showToast('Linie gespeichert und unter „Neue Fahrt“ verfügbar.');
}
function deleteCustomLine(){const id=lineDraft.id;showModal('Eigene Linie löschen','Gespeicherte Fahrpläne und laufende Fahrten bleiben erhalten.',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="delete state.customRoutes['${id}'];if(window.draftRoute==='${id}'){window.draftRoute=null;draftStops=[];}saveState();syncCustomRoutes();lineDraft=null;closeModal();showView('network')">Linie löschen</button>`);}
