'use strict';
const CAB_ICONS={
 back:'M16 6 6 16l10 10M7 16h20',doors:'M7 5h18v22H7zM16 5v22M3 16h8m-4-4-4 4 4 4M21 16h8m-4-4 4 4-4 4',
 close:'M7 5h18v22H7zM16 5v22M2 16h9m-4-4 4 4-4 4M30 16h-9m4-4-4 4 4 4',next:'m12 6 10 10-10 10M4 16h17M27 6v20',
 traffic:'M7 21V11h18v10M5 21h22M9 25v2m14-2v2M10 7h12M9 16h2m10 0h2',emergency:'m16 3 14 25H2zM16 11v8m0 4v1',
 passenger:'M4 5h24v18H4zM10 28h12M16 23v5M8 11h16M8 17h10',finish:'M12 4H5v24h7M19 9l7 7-7 7M12 16h14'
};
const CAB_PANEL={width:1681,height:936};
function cabPosition(x,y,size=140){return `left:${x/CAB_PANEL.width*100}%;top:${y/CAB_PANEL.height*100}%;width:${size/CAB_PANEL.width*100}%`;}
function cabButton({id='',color,label,icon,action,disabled=false,pressed,emergency=false,x,y}){
 const size=emergency?200:140,cap=emergency?148:96;
 const crop=`--cap-inset:${(size-cap)/size*50}%;--cap-size-x:${CAB_PANEL.width/cap*100}%;--cap-size-y:${CAB_PANEL.height/cap*100}%;--cap-x:${(x-cap/2)/(CAB_PANEL.width-cap)*100}%;--cap-y:${(y-cap/2)/(CAB_PANEL.height-cap)*100}%`;
 return `<button ${id?`id="${id}"`:''} ${emergency?'aria-label="Notfall"':''} class="cab-button cab-${color}${emergency?' cab-emergency':''}" style="${cabPosition(x,y,size)};${crop}" onclick="${action}" ${disabled?'disabled':''} ${pressed===undefined?'':`aria-pressed="${pressed}"`}><span class="cab-bezel"><span class="cab-face"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS[icon]}"/></svg></span></span><span class="cab-label">${esc(label)}</span></button>`;
}
function cabPlaceholder(x,y){
 return `<span class="cab-placeholder cab-reserve" style="${cabPosition(x,y)}" aria-hidden="true"><span class="cab-bezel"><span class="cab-face"></span></span></span>`;
}
function renderCabControls(a,pause){
 const spares=[[510,247],[686,247],[334,475],[510,475],[686,475],[884,248],[884,481],[1090,234],[1262,234],[1093,485],[1493,485],[194,752],[604,752],[1090,750],[1270,750]];
 const headings=[['FAHRT & TÜREN',432,106],['SCHEIBE',1170,106],['SPIEGEL',1295,373],['FAHRGASTINFO',415,616],['BETRIEB',1295,616]];
 return `<section class="cab-console" aria-label="Fahrpult in Frontalansicht"><div class="cab-header"><span>FAHRPULT <small>LINIE ${esc(a.plan.line)} · TRAM ${esc(a.plan.tram)}</small></span><span class="cab-lamp ${a.doorsOpen?'is-open':''}"><i></i>${a.doorsOpen?'TÜREN OFFEN':'TÜREN GESCHLOSSEN'}</span></div><p class="cab-scroll-hint">Das Pult bei Bedarf seitlich verschieben.</p><div class="cab-panel-viewport" tabindex="0" role="region" aria-label="Fahrpult, auf kleinen Bildschirmen seitlich verschiebbar"><div class="cab-stage"><img class="cab-panel-photo" src="images/cab-panel-photoreal.webp" width="1681" height="936" alt="" draggable="false">${[[60,50],[1620,50],[60,880],[1620,880]].map(([x,y])=>`<i class="cab-screw" style="${cabPosition(x,y,54)}" aria-hidden="true"></i>`).join('')}<div class="driver-controls cab-controls">
 ${headings.map(([name,x,y])=>`<span class="cab-group-mark" style="left:${x/CAB_PANEL.width*100}%;top:${y/CAB_PANEL.height*100}%">${name}</span>`).join('')}
 ${cabButton({id:'nextStopBtn',x:166,y:247,color:'blue',label:'Nächster Halt',icon:'next',action:'nextStop()',disabled:pause>0||a.doorsOpen||a.position>=a.plan.stops.length-1})}
 ${cabButton({x:334,y:247,color:'white',label:'Zurück',icon:'back',action:'driverPrevious()',disabled:a.position===0||pause>0})}
 ${cabButton({id:'doorBtn',x:166,y:475,color:'green',label:a.doorsOpen?'Türen schließen':'Türen öffnen',icon:a.doorsOpen?'close':'doors',action:'toggleDoors()',pressed:a.doorsOpen})}
 ${cabButton({x:404,y:752,color:'white',label:'Fahrgastanzeige',icon:'passenger',action:'openPassengerDisplay()'})}
 ${cabButton({x:875,y:752,color:'amber',label:'Stau',icon:'traffic',action:'openTrafficModal()'})}
 ${cabButton({x:1490,y:750,color:'red',label:'Fahrt beenden',icon:'finish',action:'finishTrip(state.active.position>=state.active.plan.stops.length-1)'})}
 ${cabButton({id:'emergencyBtn',x:1510,y:220,color:'red',label:'NOT-AUS',icon:'emergency',action:'pressCabEmergency()',emergency:true,pressed:a.status==='suspended'})}
 ${spares.map(([x,y])=>cabPlaceholder(x,y)).join('')}
 </div></div></div><div class="cab-footer"><span>FAHRPLAN MANAGER · BEDIENPULT</span><div><button class="cab-text-button" onclick="toggleCockpitSound()" aria-pressed="${!!state.settings.cockpit_muted}">${state.settings.cockpit_muted?'Tastentöne aus':'Tastentöne an'}</button><button class="cab-text-button" onclick="showCockpitSources()">Bild- & Tonquellen</button></div></div></section>`;
}
function pressCabEmergency(){
 if(!state.active||state.active.status!=='running')return;
 const b=document.getElementById('emergencyBtn');if(b)b.setAttribute('aria-pressed','true');
 openEmergencyModal();
}
function resetCabEmergency(){if(state.active?.status==='running')document.getElementById('emergencyBtn')?.setAttribute('aria-pressed','false');}
function toggleCockpitSound(){state.settings.cockpit_muted=!state.settings.cockpit_muted;stopCabMechanics();stopDriverSound();saveState();showView('driver');}
function showCockpitSources(){
 showModal('Fahrpult · Bild- und Tonquellen',`<p>Fotorealistische Pultgrafik mit dem integrierten Imagegen-Tool nach der vom Nutzer bereitgestellten Vorlage erzeugt. Weiße Gruppenumrandungen, elfenbeinfarbene Tasterringe und vier Schrauben sind Teil der Grafik. Sieben Funktionstaster sind interaktiv; fünfzehn graue Reserveelemente haben keine Funktion. Quelle, Arbeitsdatei und Prompt sind in IMAGE_SOURCES.md dokumentiert.</p><p>Mechanischer Tasterdruck, Loslassen und Einrasten des Not-Aus: eigene digitale Synthese, getrennt von Ansagen und Funktionssounds. Notfallbuzzer: eigene Synthese.</p><p>Türen: „Tram doors open and close hiss and beeping“, stephan, Public Domain. <a href="https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg" target="_blank" rel="noopener">Quelle</a>. Ausschnitte, Pegel angepasst, synthetischer Vorwarnton ergänzt.</p><p>Stau: „Audio sound of a busy traffic in Porthacourt“, ElemePodcast, CC BY 4.0, und „Car Horn“, 15HPanska_Ruttner_Jan, CC0. Ausschnitte mit Hupe gemischt. Fahrtende: Windows XP Shutdown, Microsoft, aus dem Winhistory-Archiv, leiser abgemischt. Zurück: bereitgestellter Jingle aus „Back to the Future“, Alan Silvestri. Details und Quellenlinks: AUDIO_SOURCES.md.</p>`, '<button class="primary" onclick="closeModal()">Schließen</button>');
}
// A separate Web Audio channel keeps short mechanical transients independent of
// stop announcements and the Android MediaPlayer sequence. No runtime downloads.
let cabAudioContext=null;
const cabMechanicalSources=new Set();
function stopCabMechanics(){for(const s of cabMechanicalSources){try{s.stop();}catch{}}cabMechanicalSources.clear();}
function playCabMechanical(kind){
 if(state.settings.cockpit_muted||document.hidden)return;
 try{
  cabAudioContext??=new (window.AudioContext||window.webkitAudioContext)();
  const ctx=cabAudioContext;void ctx.resume();
  const latch=kind==='latch',up=kind==='up',duration=latch ? .16 : up ? .045 : .065;
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let seed=23;
  for(let i=0;i<data.length;i++){
   const t=i/ctx.sampleRate;seed=(seed*1664525+1013904223)>>>0;
   const strike=(at,decay,hz)=>{const u=t-at;return u<0?0:Math.exp(-u*decay)*Math.min(1,u/.0005)*(Math.sin(2*Math.PI*hz*u)*.48+(seed/4294967296*2-1)*.18);};
   data[i]=(strike(0,latch?65:up?180:125,up?2600:latch?420:1150)+(latch?strike(.043,90,760)*.7:0))*.32;
  }
  const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);cabMechanicalSources.add(source);
  source.onended=()=>cabMechanicalSources.delete(source);source.start();
 }catch{/* A muted/unavailable audio device must not prevent operating the cab. */}
}
let cabHeld=null;
function releaseCabButton(){if(!cabHeld)return;cabHeld.classList.remove('is-down');if(!cabHeld.classList.contains('cab-emergency'))playCabMechanical('up');cabHeld=null;}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.cab-button');if(!b||b.disabled||e.button!==0)return;releaseCabButton();cabHeld=b;b.classList.add('is-down');playCabMechanical(b.classList.contains('cab-emergency')?'latch':'down');},true);
document.addEventListener('pointerup',releaseCabButton,true);
document.addEventListener('pointercancel',releaseCabButton,true);
document.addEventListener('keydown',e=>{const b=e.target.closest('.cab-button');if(!b||b.disabled||e.repeat||!['Enter',' '].includes(e.key))return;releaseCabButton();cabHeld=b;b.classList.add('is-down');playCabMechanical(b.classList.contains('cab-emergency')?'latch':'down');},true);
document.addEventListener('keyup',e=>{if(['Enter',' '].includes(e.key))releaseCabButton();},true);
window.addEventListener('blur',()=>{releaseCabButton();stopCabMechanics();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseCabButton();stopCabMechanics();}});
