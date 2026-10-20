'use strict';
const CAB_ICONS={
 back:'M16 6 6 16l10 10M7 16h20',doors:'M7 5h18v22H7zM16 5v22M3 16h8m-4-4-4 4 4 4M21 16h8m-4-4 4 4-4 4',
 close:'M7 5h18v22H7zM16 5v22M2 16h9m-4-4 4 4-4 4M30 16h-9m4-4-4 4 4 4',next:'m12 6 10 10-10 10M4 16h17M27 6v20',
 traffic:'M7 21V11h18v10M5 21h22M9 25v2m14-2v2M10 7h12M9 16h2m10 0h2',emergency:'m16 3 14 25H2zM16 11v8m0 4v1',
 passenger:'M4 5h24v18H4zM10 28h12M16 23v5M8 11h16M8 17h10',finish:'M12 4H5v24h7M19 9l7 7-7 7M12 16h14',
 fullscreen:'M12 5H5v7m15-7h7v7M5 20v7h7m15-7v7h-7'
};
let cabFullscreen=false,cabOwnsBrowserFullscreen=false,cabFullscreenRequest=null;
let cabScrewTripId=null;
const cabLooseScrews=new Set(),cabScrewTouches=new Map();
const cabRotaryTurns=[0,0];
const CAB_PANEL={width:1681,height:936};
function cabPosition(x,y,size=140){return `left:${x/CAB_PANEL.width*100}%;top:${y/CAB_PANEL.height*100}%;width:${size/CAB_PANEL.width*100}%`;}
function cabButton({id='',color,label,icon,action,disabled=false,pressed,emergency=false,x,y}){
 const size=emergency?200:140,cap=emergency?148:96;
 const crop=`--cap-inset:${(size-cap)/size*50}%;--cap-size-x:${CAB_PANEL.width/cap*100}%;--cap-size-y:${CAB_PANEL.height/cap*100}%;--cap-x:${(x-cap/2)/(CAB_PANEL.width-cap)*100}%;--cap-y:${(y-cap/2)/(CAB_PANEL.height-cap)*100}%`;
 const adjustment=icon==='traffic'?' transform="translate(0 -1)"':icon==='finish'?' transform="translate(.5 0)"':'';
 return `<button ${id?`id="${id}"`:''} ${emergency?'aria-label="Notfall"':''} ${id==='cabFullscreenBtn'?`title="${cabFullscreen?'Vollbild beenden':'Vollbild einschalten'}"`:''} class="cab-button cab-${color}${emergency?' cab-emergency':''}" style="${cabPosition(x,y,size)};${crop}" onclick="${action}" ${disabled?'disabled':''} ${pressed===undefined?'':`aria-pressed="${pressed}"`}><span class="cab-bezel"><span class="cab-face"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS[icon]}"${adjustment}/></svg></span></span><span class="cab-label">${esc(label)}</span></button>`;
}
function cabPlaceholder(x,y){
 return `<span class="cab-placeholder cab-reserve" style="${cabPosition(x,y)}" aria-hidden="true"><span class="cab-bezel"><span class="cab-face"></span></span></span>`;
}
function cabPhotoCrop(prefix,x,y,width,height=width){
 return `--${prefix}-size:${CAB_PANEL.width/width*100}% ${CAB_PANEL.height/height*100}%;--${prefix}-position:${(x-width/2)/(CAB_PANEL.width-width)*100}% ${(y-height/2)/(CAB_PANEL.height-height)*100}%`;
}
function cabRotaryLabel(index){return `Reserve-Drehschalter ${index===0?'Scheibe':'Betrieb'}, Stellung ${cabRotaryTurns[index]%4*90}°`;}
function renderCabRotary(index,x,y){
 const crop=[cabPhotoCrop('rotary-mask',1172,292,32),cabPhotoCrop('rotary-ring',1262,234,146),cabPhotoCrop('rotary-grip',1088,251,34,124)].join(';');
 return `<button type="button" id="cabRotary${index}" class="cab-rotary cab-reserve" style="${cabPosition(x,y,180)};${crop};--rotary-angle:${cabRotaryTurns[index]*90}deg" aria-label="${cabRotaryLabel(index)}" title="Reserve: pro Klick 90° im Uhrzeigersinn" onclick="turnCabRotary(${index})"><span class="cab-rotary-mask"></span><span class="cab-rotary-ring"><span class="cab-rotary-disc"></span></span><span class="cab-rotary-turn"><span class="cab-rotary-grip"></span></span></button>`;
}
function turnCabRotary(index){
 if(currentView!=='driver'||!state.active||!Number.isInteger(index)||index<0||index>=cabRotaryTurns.length)return;
 const knob=document.getElementById('cabRotary'+index);if(!knob)return;
 cabRotaryTurns[index]++;knob.style.setProperty('--rotary-angle',cabRotaryTurns[index]*90+'deg');knob.setAttribute('aria-label',cabRotaryLabel(index));playCabMechanical('rotary');
}
function cabDoorIndicator(x,y,color,label,active,icon){
 const size=140,cap=96;
 const crop=`--cap-inset:${(size-cap)/size*50}%;--cap-size-x:${CAB_PANEL.width/cap*100}%;--cap-size-y:${CAB_PANEL.height/cap*100}%;--cap-x:${(x-cap/2)/(CAB_PANEL.width-cap)*100}%;--cap-y:${(y-cap/2)/(CAB_PANEL.height-cap)*100}%`;
 return `<span class="cab-door-indicator cab-indicator-${color}${active?' is-lit':''}" data-door-indicator="${color==='green'?'closed':'open'}" style="${cabPosition(x,y,size)};${crop}" aria-hidden="true"><span class="cab-bezel"><span class="cab-face"><svg viewBox="0 0 32 32"><path d="${CAB_ICONS[icon]}"/></svg></span></span><span class="cab-label">${label}</span></span>`;
}
function renderCabScrew(index,x,y,label){
 const cap=54,missing=cabLooseScrews.has(index);
 const crop=`--screw-size-x:${CAB_PANEL.width/cap*100}%;--screw-size-y:${CAB_PANEL.height/cap*100}%;--screw-x:${(x-cap/2)/(CAB_PANEL.width-cap)*100}%;--screw-y:${(y-cap/2)/(CAB_PANEL.height-cap)*100}%`;
 return `<button type="button" id="cabScrew${index}" class="cab-screw${missing?' is-missing':''}" style="${cabPosition(x,y,72)};${crop}" data-screw-label="${label}" aria-label="${missing?'Schraubenloch':'Schraube'} ${label}" title="Doppelklick: Schraube ${missing?'eindrehen':'herausdrehen'}" ondblclick="toggleCabScrew(${index})" onpointerup="touchCabScrew(event,${index})" onkeydown="if(!event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();toggleCabScrew(${index})}"><span class="cab-screw-hole"></span><span class="cab-screw-face"></span></button>`;
}
function touchCabScrew(event,index){
 if(event.pointerType==='mouse')return;
 const now=performance.now(),previous=cabScrewTouches.get(index);
 if(previous&&now-previous.at<=450&&Math.hypot(event.clientX-previous.x,event.clientY-previous.y)<24){cabScrewTouches.delete(index);toggleCabScrew(index);}
 else cabScrewTouches.set(index,{at:now,x:event.clientX,y:event.clientY});
}
function toggleCabScrew(index){
 if(currentView!=='driver'||!state.active)return;
 const screw=document.getElementById('cabScrew'+index);if(!screw)return;
 if(screw.classList.contains('is-loose')||screw.classList.contains('is-tightening'))return;
 const tightening=cabLooseScrews.has(index);
 if(tightening)cabLooseScrews.delete(index);else cabLooseScrews.add(index);
 screw.classList.remove('is-missing');screw.classList.add(tightening?'is-tightening':'is-loose');screw.setAttribute('aria-busy','true');
 screw.setAttribute('aria-label',`${tightening?'Schraube':'Schraubenloch'} ${screw.dataset.screwLabel}`);
 screw.title=`Doppelklick: Schraube ${tightening?'herausdrehen':'eindrehen'}`;
 screw.querySelector('.cab-screw-face').addEventListener('animationend',()=>{
  screw.classList.remove('is-loose','is-tightening');screw.classList.toggle('is-missing',!tightening);screw.removeAttribute('aria-busy');
 },{once:true});
 playCabMechanical(tightening?'ratchet':'screw');
}
function renderCabControls(a,pause){
 if(cabScrewTripId!==a.id){cabScrewTripId=a.id;cabLooseScrews.clear();cabScrewTouches.clear();cabRotaryTurns.fill(0);}
 const spares=[[510,247],[686,247],[334,475],[510,475],[686,475],[1262,234],[1093,485],[1493,485],[194,752],[1270,750]];
 const headings=[['FAHRT & TÜREN',432,106],['SCHEIBE',1170,106],['SPIEGEL',1295,373],['FAHRGASTINFO',415,616],['BETRIEB',1295,616]];
 return `<section class="cab-console" aria-label="Fahrpult in Frontalansicht"><div class="cab-header"><span>FAHRPULT <small>LINIE ${esc(a.plan.line)} · TRAM ${esc(a.plan.tram)}</small></span></div><p class="cab-scroll-hint">Das Pult bei Bedarf seitlich verschieben.</p><div class="cab-panel-viewport" tabindex="0" role="region" aria-label="Fahrpult, auf kleinen Bildschirmen seitlich verschiebbar"><div class="cab-stage"><img class="cab-panel-photo" src="images/cab-panel-photoreal.webp" width="1681" height="936" alt="" draggable="false">${[[60,50,'oben links'],[1620,50,'oben rechts'],[60,880,'unten links'],[1620,880,'unten rechts']].map(([x,y,label],index)=>renderCabScrew(index,x,y,label)).join('')}<div class="driver-controls cab-controls">
 ${headings.map(([name,x,y])=>`<span class="cab-group-mark" style="left:${x/CAB_PANEL.width*100}%;top:${y/CAB_PANEL.height*100}%">${name}</span>`).join('')}
 ${cabButton({id:'nextStopBtn',x:166,y:247,color:'blue',label:'Nächster Halt',icon:'next',action:'nextStop()',disabled:pause>0||a.doorsOpen||a.position>=a.plan.stops.length-1})}
 ${cabButton({x:334,y:247,color:'white',label:'Zurück',icon:'back',action:'driverPrevious()',disabled:a.position===0||pause>0})}
 ${cabButton({id:'doorBtn',x:166,y:475,color:'green',label:a.doorsOpen?'Türen schließen':'Türen öffnen',icon:a.doorsOpen?'close':'doors',action:'toggleDoors()',pressed:a.doorsOpen})}
 ${cabButton({x:406,y:749,color:'white',label:'Fahrgastanzeige',icon:'passenger',action:'openPassengerDisplay()'})}
 ${cabButton({id:'cabFullscreenBtn',x:626,y:749,color:'fullscreen-toggle',label:'Vollbild',icon:'fullscreen',action:'toggleCabFullscreen()',pressed:cabFullscreen})}
 ${cabButton({x:871,y:748,color:'amber',label:'Stau',icon:'traffic',action:'openTrafficModal()'})}
 ${cabButton({x:1493,y:748,color:'red',label:'Fahrt beenden',icon:'finish',action:'finishTrip(state.active.position>=state.active.plan.stops.length-1)'})}
 ${cabButton({id:'emergencyBtn',x:1510,y:220,color:'red',label:'NOT-AUS',icon:'emergency',action:'pressCabEmergency()',emergency:true,pressed:a.status==='suspended'})}
 <div class="cab-door-indicators" role="status" aria-label="${a.doorsOpen?'Türen geöffnet':'Türen geschlossen'}">${cabDoorIndicator(884,248,'green','Türen zu',!a.doorsOpen,'close')}${cabDoorIndicator(884,481,'amber','Türen offen',a.doorsOpen,'doors')}</div>
 ${spares.map(([x,y])=>cabPlaceholder(x,y)).join('')}
 ${renderCabRotary(0,1088,236)}${renderCabRotary(1,1088,750)}
 </div></div></div><div class="cab-footer"><span>FAHRPLAN MANAGER · BEDIENPULT</span><div><button class="cab-text-button" onclick="toggleCockpitSound()" aria-pressed="${!!state.settings.cockpit_muted}">${state.settings.cockpit_muted?'Tastentöne aus':'Tastentöne an'}</button><button class="cab-text-button" onclick="showCockpitSources()">Bild- & Tonquellen</button></div></div></section>`;
}
function toggleCabFullscreen(){if(currentView==='driver'&&state.active)setCabFullscreen(!cabFullscreen);}
function setCabFullscreen(enabled){
 cabFullscreen=enabled===true&&currentView==='driver'&&!!state.active;
 document.body.classList.toggle('cab-fullscreen',cabFullscreen);
 updateCabFullscreenStatus();
 const button=document.getElementById('cabFullscreenBtn');
 if(button){button.setAttribute('aria-pressed',String(cabFullscreen));button.title=cabFullscreen?'Vollbild beenden':'Vollbild einschalten';}
 let native=false;
 if(window.AndroidDisplay&&typeof AndroidDisplay.setImmersive==='function'){
  try{AndroidDisplay.setImmersive(cabFullscreen);native=true;}catch{/* The layout remains usable without a native display bridge. */}
 }
 if(cabFullscreen&&!native&&!document.fullscreenElement&&!cabFullscreenRequest&&document.documentElement.requestFullscreen){
  cabOwnsBrowserFullscreen=true;
  try{
   cabFullscreenRequest=Promise.resolve(document.documentElement.requestFullscreen({navigationUI:'hide'})).then(()=>{
    cabOwnsBrowserFullscreen=document.fullscreenElement===document.documentElement;
    if(!cabFullscreen&&cabOwnsBrowserFullscreen){cabOwnsBrowserFullscreen=false;return document.exitFullscreen();}
   }).catch(()=>{if(!document.fullscreenElement)cabOwnsBrowserFullscreen=false;}).finally(()=>{cabFullscreenRequest=null;});
  }catch{cabOwnsBrowserFullscreen=false;}
 }else if(!cabFullscreen&&cabOwnsBrowserFullscreen){
  cabOwnsBrowserFullscreen=false;
  if(document.fullscreenElement===document.documentElement)Promise.resolve(document.exitFullscreen()).catch(()=>{});
 }
 queueCabRouteLayout();
}
function queueCabRouteLayout(){
 requestAnimationFrame(()=>{
  const map=document.getElementById('driverRouteMap');
  if(map&&state.active&&currentView==='driver'){delete map.dataset.followedStop;followCurrentRouteStop(map,state.active);}
 });
}
window.addEventListener('resize',queueCabRouteLayout);
function updateCabFullscreenStatus(){
 const host=document.getElementById('cabFullscreenStatus'),trip=state.active;
 if(!host||!cabFullscreen||!trip)return;
 const delay=activeDelayMin(),pause=currentPauseSeconds();
 host.innerHTML=`<div><span class="eyebrow">Aktueller Halt</span><strong class="cab-fullscreen-stop">${esc(trip.plan.stops[trip.position].name)}</strong><span class="muted">Linie ${esc(trip.plan.line)} · Tram ${esc(trip.plan.tram)} · Halt ${trip.position+1}/${trip.plan.stops.length}</span></div><div class="actions"><span class="status ${statusClass(delay)}">${esc(statusText(delay))}</span><span class="pill">${nowClock()}</span>${pause>0?`<span class="pill">Pause ${Math.floor(pause/60)}:${String(pause%60).padStart(2,'0')}</span>`:''}</div>`;
}
document.addEventListener('fullscreenchange',()=>{if(cabOwnsBrowserFullscreen&&!document.fullscreenElement){cabOwnsBrowserFullscreen=false;setCabFullscreen(false);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&cabFullscreen&&!document.getElementById('modalRoot').innerHTML){event.preventDefault();setCabFullscreen(false);}});
function pressCabEmergency(){
 if(!state.active||state.active.status!=='running')return;
 const b=document.getElementById('emergencyBtn');if(b)b.setAttribute('aria-pressed','true');
 openEmergencyModal();
}
function resetCabEmergency(){if(state.active?.status==='running')document.getElementById('emergencyBtn')?.setAttribute('aria-pressed','false');}
function toggleCockpitSound(){state.settings.cockpit_muted=!state.settings.cockpit_muted;stopCabMechanics();stopDriverSound();saveState();showView('driver');}
function showCockpitSources(){
 showModal('Fahrpult · Bild- und Tonquellen',`<p>Fotorealistische Pultgrafik mit dem integrierten Imagegen-Tool nach der vom Nutzer bereitgestellten Vorlage erzeugt. Weiße Gruppenumrandungen, elfenbeinfarbene Tasterringe und vier Schrauben sind Teil der Grafik. Acht Funktionstaster sind interaktiv, darunter Vollbild. Zwei separate Kontrollleuchten zeigen den Türzustand; zwei Reserve-Drehschalter lassen sich ohne Fahrfunktion drehen; zehn graue Reserveelemente bleiben rein grafisch. Quelle, Arbeitsdatei und Prompt sind in IMAGE_SOURCES.md dokumentiert.</p><p>Mechanischer Tasterdruck, Loslassen und Einrasten des Not-Aus: eigene digitale Synthese, getrennt von Ansagen und Funktionssounds. Notfallbuzzer: eigene Synthese.</p><p>Türen: „Tram doors open and close hiss and beeping“, stephan, Public Domain. <a href="https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg" target="_blank" rel="noopener">Quelle</a>. Ausschnitte, Pegel angepasst, synthetischer Vorwarnton ergänzt.</p><p>Stau: „Audio sound of a busy traffic in Porthacourt“, ElemePodcast, CC BY 4.0, und „Car Horn“, 15HPanska_Ruttner_Jan, CC0. Ausschnitte mit Hupe gemischt. Fahrtende: Windows XP Shutdown, Microsoft, aus dem Winhistory-Archiv, leiser abgemischt. Zurück: bereitgestellter Jingle aus „Back to the Future“, Alan Silvestri. Details und Quellenlinks: AUDIO_SOURCES.md.</p>`, '<button class="primary" onclick="closeModal()">Schließen</button>');
}
// A separate Web Audio channel keeps short mechanical transients independent of
// stop announcements and the Android MediaPlayer sequence. No runtime downloads.
let cabAudioContext=null;
const cabMechanicalSources=new Set();
function stopCabMechanics(){for(const s of cabMechanicalSources){try{s.stop();}catch{}}cabMechanicalSources.clear();}
function playCabMechanical(kind){
 if(kind==='screw'||kind==='ratchet'){playCabScrewSound(kind==='ratchet');return;}
 if(state.settings.cockpit_muted||document.hidden)return;
 try{
  cabAudioContext??=new (window.AudioContext||window.webkitAudioContext)();
  const ctx=cabAudioContext;void ctx.resume();
  const rotary=kind==='rotary',latch=kind==='latch',up=kind==='up',duration=rotary ? .24 : latch ? .16 : up ? .045 : .065;
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let seed=23;
  for(let i=0;i<data.length;i++){
   const t=i/ctx.sampleRate;seed=(seed*1664525+1013904223)>>>0;
   const strike=(at,decay,hz)=>{const u=t-at;return u<0?0:Math.exp(-u*decay)*Math.min(1,u/.0005)*(Math.sin(2*Math.PI*hz*u)*.48+(seed/4294967296*2-1)*.18);};
   data[i]=rotary?(strike(0,130,1150)*.025+strike(.155,95,780)*.4+strike(.172,160,1450)*.2):(strike(0,latch?65:up?180:125,up?2600:latch?420:1150)+(latch?strike(.043,90,760)*.7:0))*.32;
  }
  const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);cabMechanicalSources.add(source);
  source.onended=()=>cabMechanicalSources.delete(source);source.start();
 }catch{/* A muted/unavailable audio device must not prevent operating the cab. */}
}
let cabHeld=null;
function playCabScrewSound(tightening=false){
 if(state.settings.cockpit_muted||document.hidden)return;
 try{
  cabAudioContext??=new (window.AudioContext||window.webkitAudioContext)();
  const ctx=cabAudioContext;void ctx.resume();
  const duration=tightening?1.25:1.65;
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let seed=71;
  for(let i=0;i<data.length;i++){
   const t=i/ctx.sampleRate;seed=(seed*1664525+1013904223)>>>0;
   const noise=seed/4294967296*2-1;
   const strike=(at,decay,level)=>{const u=t-at;return u<0?0:level*Math.exp(-u*decay)*Math.min(1,u/.0008)*(Math.sin(2*Math.PI*1850*u)+.46*Math.sin(2*Math.PI*3170*u)+.25*noise);};
   let value=0;
   if(tightening){
    // Drive strokes alternate with short, dry pawl clicks on the return stroke.
    for(let stroke=0;stroke<4;stroke++){
     value+=strike(.12+stroke*.25,100,.025);
     if(stroke<3)for(let tooth=0;tooth<7;tooth++){
      const u=t-(.28+stroke*.25+tooth*.012);
      if(u>=0)value+=Math.exp(-u*310)*Math.min(1,u/.0003)*(.09*Math.sin(2*Math.PI*2400*u)+.04*Math.sin(2*Math.PI*4100*u)+.018*noise);
     }
    }
    value+=strike(1.13,100,.095);
   }else{
    for(let turn=0;turn<10;turn++)value+=strike(turn*.062,95,.035);
    value+=strike(1.10,28,.18)+strike(1.29,40,.11)+strike(1.44,60,.065);
   }
   data[i]=Math.max(-.65,Math.min(.65,value));
  }
  const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);cabMechanicalSources.add(source);
  source.onended=()=>cabMechanicalSources.delete(source);source.start();
 }catch{/* The visual Easter egg also works without an audio device. */}
}
function releaseCabButton(){if(!cabHeld)return;cabHeld.classList.remove('is-down');if(!cabHeld.classList.contains('cab-emergency'))playCabMechanical('up');cabHeld=null;}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.cab-button');if(!b||b.disabled||e.button!==0)return;releaseCabButton();cabHeld=b;b.classList.add('is-down');playCabMechanical(b.classList.contains('cab-emergency')?'latch':'down');},true);
document.addEventListener('pointerup',releaseCabButton,true);
document.addEventListener('pointercancel',releaseCabButton,true);
document.addEventListener('keydown',e=>{const b=e.target.closest('.cab-button');if(!b||b.disabled||e.repeat||!['Enter',' '].includes(e.key))return;releaseCabButton();cabHeld=b;b.classList.add('is-down');playCabMechanical(b.classList.contains('cab-emergency')?'latch':'down');},true);
document.addEventListener('keyup',e=>{if(['Enter',' '].includes(e.key))releaseCabButton();},true);
window.addEventListener('blur',()=>{releaseCabButton();stopCabMechanics();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseCabButton();stopCabMechanics();}});
