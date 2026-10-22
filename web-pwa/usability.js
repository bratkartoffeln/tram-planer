'use strict';
// Shared browser / Android navigation and accessible controls.
let mobileMenuOpen=false;
let menuReturnFocus=null;
let modalReturnFocus=null;
let driverSecondaryOpen=false;
let dialogPageScroll=null,menuPageScroll=null;
function captureDialogPageScroll(){if(!document.querySelector('#modalRoot .modal'))dialogPageScroll={x:scrollX,y:scrollY};}
function restoreDialogPageScroll(){if(!dialogPageScroll)return;const position=dialogPageScroll;dialogPageScroll=null;window.scrollTo(position.x,position.y);}
function fitPageTextareas(){for(const field of document.querySelectorAll('textarea')){if(!field.getClientRects().length)continue;field.style.height='auto';field.style.height=(field.scrollHeight+2)+'px';}}
let textareaFrame=null;
function queuePageTextareas(){if(textareaFrame!==null)return;textareaFrame=requestAnimationFrame(()=>{textareaFrame=null;fitPageTextareas();});}
new MutationObserver(queuePageTextareas).observe(document.getElementById('modalRoot'),{childList:true,subtree:true});
new MutationObserver(queuePageTextareas).observe(document.getElementById('view'),{childList:true,subtree:true});
document.addEventListener('input',queuePageTextareas);document.addEventListener('toggle',queuePageTextareas,true);window.addEventListener('resize',queuePageTextareas);
const compactScreen=()=>window.matchMedia('(max-width:900px)').matches;
function setMobileMenu(open){
 const wasOpen=mobileMenuOpen;
 if(open&&compactScreen()&&!wasOpen)menuPageScroll={x:scrollX,y:scrollY};
 mobileMenuOpen=!!open&&compactScreen();
 document.body.classList.toggle('menu-open',mobileMenuOpen);
 const sidebar=document.getElementById('sidebar');
 sidebar.inert=compactScreen()&&!mobileMenuOpen;
 sidebar.setAttribute('aria-label','Alle Bereiche');
 if(compactScreen()){
  sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal',String(mobileMenuOpen));
 }else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');}
 document.getElementById('menuBackdrop').hidden=!mobileMenuOpen;
 document.getElementById('mobileMore').setAttribute('aria-expanded',String(mobileMenuOpen));
 document.querySelector('.main').inert=mobileMenuOpen;
 document.getElementById('mobileNav').inert=mobileMenuOpen;
 if(mobileMenuOpen){menuReturnFocus=document.activeElement;sidebar.querySelector('button').focus();}
 else if(menuReturnFocus){if(menuReturnFocus.isConnected)menuReturnFocus.focus();menuReturnFocus=null;}
 if(mobileMenuOpen&&!wasOpen)window.scrollTo(0,0);
 else if(wasOpen&&menuPageScroll){window.scrollTo(menuPageScroll.x,menuPageScroll.y);menuPageScroll=null;}
}
function syncNavigation(){
 const compact=compactScreen();
 syncDevModeBanner();
 document.getElementById('sidebar').inert=compact&&!mobileMenuOpen;
 document.getElementById('nav').inert=false;
 document.querySelectorAll('[data-view]').forEach(button=>{
  const active=button.dataset.view===currentView||(currentView==='detail'&&button.dataset.view==='plans');
  button.classList.toggle('active',active);
  if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
 });
 const more=document.getElementById('mobileMore');
 more.classList.toggle('active',['network','vehicles','history','settings'].includes(currentView));
 const resume=document.getElementById('resumeTrip');
 resume.hidden=!state.active||currentView==='driver';
 resume.textContent=state.active?.status==='suspended'?'▶ Fahrt fortsetzen':'▶ Zur Fahrt';
 const door=document.getElementById('quickDoors'),next=document.getElementById('quickNext');
 const stop=document.getElementById('quickStop'),status=document.getElementById('quickDoorStatus');if(stop)stop.textContent=state.active?.plan.stops[state.active.position]?.name||'Fahrt bedienen';if(status)status.textContent=doorMotion?'Türen bewegen sich …':state.active?.doorsOpen?'Türen geöffnet':currentPauseSeconds()>0?'Planmäßige Pause läuft':'Türen geschlossen';
 if(door){door.textContent=state.active?.doorsOpen?'Türen schließen':'Türen öffnen';door.disabled=!!doorMotion||state.active?.status!=='running';door.setAttribute('aria-pressed',String(!!state.active?.doorsOpen));}
 if(next)next.disabled=!state.active||state.active.status!=='running'||state.active.doorsOpen||currentPauseSeconds()>0||state.active.position>=state.active.plan.stops.length-1;
}
function filterCards(inputId,rootId,itemSelector,countId){
 const query=document.getElementById(inputId).value.trim().toLocaleLowerCase('de-DE');
 const rows=[...document.getElementById(rootId).querySelectorAll(itemSelector)];
 let count=0;
 rows.forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase('de-DE').includes(query);if(!row.hidden)count++;});
 document.getElementById(countId).textContent=count?`${count} Treffer`:'Keine Treffer. Versuche eine andere Linie, Strecke oder Fahrzeugnummer.';
}
function addListSearch(root,id,label,placeholder,selector){
 const list=root.querySelector(selector);if(!list||list.querySelector('.empty'))return;
 const container=document.createElement('div');container.className='list-search';
 container.innerHTML=`<label for="${id}">${label}</label><input type="search" id="${id}" placeholder="${placeholder}" autocomplete="off"><p class="muted search-count" id="${id}Count" role="status"></p>`;
 list.before(container);list.id=id+'Results';
 container.querySelector('input').addEventListener('input',()=>filterCards(id,list.id,':scope > *',id+'Count'));
}
function enhanceView(view,root){
 root.dataset.page=view;
 if(view==='plans')addListSearch(root,'planSearch','Fahrpläne durchsuchen','Strecke, Linie oder Fahrzeug …','.data-list');
 if(view==='history')addListSearch(root,'historySearch','Historie durchsuchen','Ereignis, Datum oder Haltestelle …','.data-list');
 if(view==='vehicles')addListSearch(root,'fleetSearch','Eigene Fahrzeuge suchen','Fahrzeugnummer oder Bauart …','#vehicleFleet .vehicle-grid');
 if(view==='new'){
  const steps=document.createElement('ol');steps.className='workflow';steps.setAttribute('aria-label','So startest du eine Fahrt');
  steps.innerHTML='<li aria-current="step"><span>1</span> Fahrplan erstellen</li><li><span>2</span> Abfahrt wählen</li><li><span>3</span> Fahrt starten</li>';root.prepend(steps);
  root.querySelector('button[onclick="saveNewPlan()"]').parentElement.classList.add('save-bar');
  mountBulkTimes();
 }
 if(view==='detail'){
  const back=document.createElement('button');back.className='back-link';back.textContent='← Alle Fahrpläne';back.onclick=()=>showView('plans');root.prepend(back);
 }
 if(view==='settings'){
  const card=[...root.querySelectorAll('.card')].find(c=>c.querySelector('h2')?.textContent==='Eigene Routencodes');
  if(card){const details=document.createElement('details');details.className='route-settings';const summary=document.createElement('summary');summary.textContent='Eigene Routencodes bearbeiten';card.replaceWith(details);details.append(summary,card);}
 }
 if(view==='driver'){
  const toolbar=document.createElement('section');toolbar.className='drive-toolbar';toolbar.setAttribute('aria-label','Fahrt bedienen');
  toolbar.innerHTML='<div><strong id="quickStop" class="quick-stop">Fahrt bedienen</strong><span class="muted" id="quickDoorStatus">Türen schließen, dann zum nächsten Halt</span></div><div class="actions"><button id="quickDoors" onclick="toggleDoors()">Türen öffnen</button><button id="quickNext" class="primary" onclick="nextStop()">Nächster Halt →</button></div><details class="drive-secondary"><summary>Weitere Fahrtaktionen</summary><div class="actions"><button onclick="setCabFullscreen(true)" aria-label="Fahrpult im Vollbild öffnen">⛶ Vollbild</button><button onclick="openTrafficModal()">Stau melden</button><button class="danger" onclick="openEmergencyModal()">Notfall melden</button></div></details>';
  root.querySelector('.grid').before(toolbar);
  const secondary=toolbar.querySelector('.drive-secondary');secondary.open=driverSecondaryOpen;secondary.addEventListener('toggle',()=>{if(secondary.isConnected)driverSecondaryOpen=secondary.open;});
  mountLiveCabZoom(root);
 }
 // Give dynamically generated inputs names and generous label hit areas.
 root.querySelectorAll('.field').forEach((field,index)=>{const label=field.querySelector('label'),control=field.querySelector('input,select,textarea');if(label&&control&&!label.htmlFor){control.id ||= 'field-'+view+'-'+index;label.htmlFor=control.id;}});
 root.querySelectorAll('.settings-row').forEach((row,index)=>{const control=row.querySelector('input[type=checkbox]'),title=row.querySelector('strong');if(control&&title){title.id ||= 'setting-'+index;control.id ||= 'setting-control-'+index;control.setAttribute('aria-labelledby',title.id);const content=row.firstElementChild;if(content.tagName==='DIV'){const label=document.createElement('label');label.htmlFor=control.id;while(content.firstChild)label.append(content.firstChild);content.replaceWith(label);}}});
 syncNavigation();
}
function trapFocus(event,container){
 if(event.key!=='Tab')return;
 const elements=[...container.querySelectorAll('button,input,select,textarea,a[href],summary,[tabindex="0"]')].filter(e=>!e.disabled&&!e.closest('[hidden]')&&e.getClientRects().length);
 const first=elements[0],last=elements.at(-1);if(!first)return;
 if(event.shiftKey&&(document.activeElement===container||document.activeElement===first||!container.contains(document.activeElement))){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&(document.activeElement===last||!container.contains(document.activeElement))){event.preventDefault();first.focus();}
}
document.addEventListener('keydown',event=>{
 const modal=document.querySelector('#modalRoot .modal');
 if(modal){if(event.key==='Escape'){event.preventDefault();closeModal();}else trapFocus(event,modal);}
 else if(mobileMenuOpen){if(event.key==='Escape'){event.preventDefault();setMobileMenu(false);}else trapFocus(event,document.getElementById('sidebar'));}
});
window.matchMedia('(max-width:900px)').addEventListener('change',()=>{setMobileMenu(false);syncNavigation();});
