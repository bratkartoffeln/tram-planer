'use strict';
const CAB_ICONS={
 back:'M16 6 6 16l10 10M7 16h20',
 doors:'M7 5h18v22H7zM16 5v22M3 16h8m-4-4-4 4 4 4M21 16h8m-4-4 4 4-4 4',
 close:'M7 5h18v22H7zM16 5v22M2 16h9m-4-4 4 4-4 4M30 16h-9m4-4-4 4 4 4',
 next:'m12 6 10 10-10 10M4 16h17M27 6v20',
 traffic:'M7 21V11h18v10M5 21h22M9 25v2m14-2v2M10 7h12M9 16h2m10 0h2',
 emergency:'m16 3 14 25H2zM16 11v8m0 4v1',
 passenger:'M4 5h24v18H4zM10 28h12M16 23v5M8 11h16M8 17h10',
 finish:'M12 4H5v24h7M19 9l7 7-7 7M12 16h14'
};
function cabButton({id='',color,label,icon,action,disabled=false,pressed}){
 return `<button ${id?`id="${id}"`:''} class="cab-button cab-${color}" onclick="${action}" ${disabled?'disabled':''} ${pressed===undefined?'':`aria-pressed="${pressed}"`}><span class="cab-bezel"><span class="cab-face"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS[icon]}"/></svg></span></span><span class="cab-label">${esc(label)}</span></button>`;
}
function renderCabControls(a,pause){
 return `<section class="cab-console cab-photographic" aria-label="Fahrpult"><div class="cab-header"><span>FAHRPULT <small>LINIE ${esc(a.plan.line)} · TRAM ${esc(a.plan.tram)}</small></span><span class="cab-lamp ${a.doorsOpen?'is-open':''}"><i></i> ${a.doorsOpen?'TÜREN OFFEN':'TÜREN GESCHLOSSEN'}</span></div><div class="cab-deck"><img class="cab-photo" src="images/tram-cockpit.jpg" alt="Fotografiertes Fahrpult einer Dresdner Straßenbahn mit Instrumenten und farbigen Tastern"><div class="cab-photo-note">Fahrpultfoto · Dresden</div><div class="driver-controls cab-controls">
 ${cabButton({color:'white',label:'Zurück',icon:'back',action:'driverPrevious()',disabled:a.position===0||pause>0})}
 ${cabButton({id:'doorBtn',color:a.doorsOpen?'amber':'green',label:a.doorsOpen?'Türen schließen':'Türen öffnen',icon:a.doorsOpen?'close':'doors',action:'toggleDoors()',pressed:a.doorsOpen})}
 ${cabButton({id:'nextStopBtn',color:'blue',label:a.position>=a.plan.stops.length-1?'Ziel erreichen & beenden':'Nächster Halt',icon:'next',action:'nextStop()',disabled:pause>0||a.doorsOpen})}
 ${cabButton({color:'amber',label:'Stau',icon:'traffic',action:'openTrafficModal()'})}
 ${cabButton({color:'red',label:'Notfall',icon:'emergency',action:'openEmergencyModal()'})}
 ${cabButton({color:'white',label:'Fahrgastanzeige',icon:'passenger',action:'openPassengerDisplay()'})}
 ${cabButton({color:'black',label:'Fahrt beenden',icon:'finish',action:'finishTrip(false)'})}
 </div></div><div class="cab-footer"><span>FOTO: SILVIO P. · CC BY-SA 3.0</span><div><button class="cab-text-button" onclick="toggleCockpitSound()" aria-pressed="${!!state.settings.cockpit_muted}">${state.settings.cockpit_muted?'Tastentöne aus':'Tastentöne an'}</button><button class="cab-text-button" onclick="showCockpitSources()">Bild- & Tonquellen</button></div></div></section>`;
}
function toggleCockpitSound(){state.settings.cockpit_muted=!state.settings.cockpit_muted;stopDriverSound();saveState();showView('driver');}
function showCockpitSources(){
 showModal('Fahrpult - Bild- und Tonquellen',`<p>Foto: „Cockpit NGTD8DD Dresden“, Silvio P. – Bus und Bahn DD, 2007. <a href="https://commons.wikimedia.org/wiki/File:Cockpit_NGTD8DD_Dresden.jpg" target="_blank" rel="noopener">Original auf Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>. Die Bilddatei ist unverändert; der sichtbare Ausschnitt wird per CSS angepasst und mit Bedienelementen überlagert. Das Foto zeigt ein Dresdner Fahrpult.</p>
<p>Türen: „Tram doors open and close hiss and beeping“, stephan, Public Domain; Ausschnitte, Lautstärke angepasst, synthetischer Vorwarnton ergänzt. <a href="https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg" target="_blank" rel="noopener">Quelle</a>.</p><p>Stau: „Audio sound of a busy traffic in Porthacourt“, ElemePodcast, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>; gekürzt, mit Hupe gemischt. <a href="https://commons.wikimedia.org/wiki/File:Audio_sound_of_a_busy_traffic_in_Porthacourt.ogg" target="_blank" rel="noopener">Quelle</a>. Hupe: „Car Horn“, 15HPanska_Ruttner_Jan, CC0. <a href="https://commons.wikimedia.org/wiki/File:Car_Horn.wav" target="_blank" rel="noopener">Quelle</a>.</p><p>Fahrtende: Windows XP Shutdown, Microsoft; Originalaufnahme aus dem <a href="https://www.winhistory.de/more/winstart/winstart_en.htm" target="_blank" rel="noopener">Winhistory-Archiv</a>, Lautstärke reduziert.</p><p>Zurück: im Projekt bereitgestellter Jingle aus „Back to the Future“, Komposition Alan Silvestri. Notfall und gedämpfter Ding-Dong: eigene Synthese.</p>`, '<button class="primary" onclick="closeModal()">Schließen</button>');
}
