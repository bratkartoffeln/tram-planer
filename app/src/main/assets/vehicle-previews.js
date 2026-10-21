'use strict';
let vehicleBundlePreview=null,vehiclePreviewTicket=0,vehiclePreviewTimer=null,vehiclePreviewDoorsOpen=false;
const vehiclePreviewAccessoryStates=new Map();
const vehiclePreviewRotaryTurns=[0,0];
const vehiclePreviewLooseScrews=new Set(),vehiclePreviewScrewTouches=new Map();
const VEHICLE_PREVIEW_SOUNDS={door_open:'Türen öffnen',door_close:'Türen schließen',emergency:'Notfall',traffic:'Stau',passenger:'Fahrgastanzeige',finish:'Fahrtende',back:'Zurück'};
const VEHICLE_PREVIEW_MECHANICS={down:'Taster drücken',up:'Taster loslassen',latch:'Not-Aus einrasten',rotary:'Drehschalter',screw:'Schraube lösen',ratchet:'Schraube eindrehen'};
function vehicleCabThumbnail(type){
 const bundle=getVehicleBundle({vehicleTypeId:type.id}),info=vehicleBundleInfo(bundle);
 return `<div class="vehicle-cab-preview"><img src="${esc(bundle.cab.image)}" alt="Frontales Schalterpanel für ${esc(type.name)}" width="${bundle.cab.width}" height="${bundle.cab.height}" loading="lazy"><p><strong>${esc(info.title)}</strong><br><small>${esc(info.variant)}</small></p><button type="button" class="small" data-cab-preview="${esc(type.id)}" onclick="openVehicleBundlePreview('${type.id}')">Fahrpult & Sounds ausprobieren</button></div>`;
}
function openVehicleBundlePreview(typeId){
 const type=vehicleType(typeId);if(!type)return;
 closeModal();
 const bundle=getVehicleBundle({vehicleTypeId:typeId}),info=vehicleBundleInfo(bundle);
 vehicleBundlePreview=bundle;vehiclePreviewDoorsOpen=false;vehiclePreviewLooseScrews.clear();vehiclePreviewScrewTouches.clear();vehiclePreviewAccessoryStates.clear();vehiclePreviewRotaryTurns.fill(0);
 const example={id:'preview-'+typeId,plan:{line:'–',tram:type.name,stops:[{},{},{}]},position:1,doorsOpen:false,status:'running'};
 showModal(`${esc(type.name)} · Fahrpult & Sounds`,`${renderCabControls(example,0,bundle)}<p class="vehicle-preview-instructions">Pulttasten drücken, um die Sounds vorzuhören. Der Türtaster wechselt zwischen Öffnen und Schließen. „Nächster Halt“ spielt eine Beispielansage; „Vollbild“ gibt den Tastenklick wieder. Zusatzschalter und Hebel sind als Reserve ohne Fahrfunktion schaltbar. Die Schrauben lassen sich per Doppelklick oder Doppeltippen ausprobieren.</p><p id="vehicleSoundStatus" role="status" aria-live="polite">Pulttaste für eine Hörprobe drücken.</p><p class="muted">${esc(info.soundNote)}</p>${state.settings.cockpit_muted?'<p class="notice">Tastentöne sind in den Einstellungen stummgeschaltet. Aktiviere sie dort für die Hörprobe.</p>':''}<details><summary>Nachbildung, Varianten & Quellen</summary>${vehicleBundleSources(bundle)}</details>`, '<button type="button" onclick="stopVehiclePreviewSound()">■ Wiedergabe stoppen</button><button type="button" class="primary" onclick="closeModal()">Schließen</button>');
 const modal=document.querySelector('#modalRoot .modal');modal.classList.add('vehicle-bundle-modal');
 if(state.settings.cockpit_muted)modal.querySelectorAll('.cab-button').forEach(button=>button.disabled=true);
}
function syncVehiclePreviewDoors(moving=false){
 if(!vehicleBundlePreview)return;
 const root=document.querySelector('.vehicle-bundle-modal'),button=root?.querySelector('#doorBtn');if(!button)return;
 button.setAttribute('aria-pressed',String(vehiclePreviewDoorsOpen));button.querySelector('.cab-label').textContent=vehiclePreviewDoorsOpen?'Türen schließen':'Türen öffnen';
 button.disabled=moving||state.settings.cockpit_muted;
 const closed=root.querySelector('[data-door-indicator="closed"]'),open=root.querySelector('[data-door-indicator="open"]');
 closed.classList.toggle('is-lit',!vehiclePreviewDoorsOpen&&!moving);open.classList.toggle('is-lit',vehiclePreviewDoorsOpen||moving);open.classList.toggle('is-blinking',moving);
}
function stopVehiclePreviewSound(){
 ++vehiclePreviewTicket;clearTimeout(vehiclePreviewTimer);vehiclePreviewTimer=null;
 if(!vehicleBundlePreview)return;
 stopDriverSound();stopCabMechanics();
 document.querySelectorAll('.vehicle-bundle-modal .is-sound-playing').forEach(button=>button.classList.remove('is-sound-playing'));
 document.querySelector('.vehicle-bundle-modal #emergencyBtn')?.setAttribute('aria-pressed','false');
 syncVehiclePreviewDoors();
 const status=document.getElementById('vehicleSoundStatus');if(status)status.textContent='Wiedergabe gestoppt.';
}
function stopVehicleBundlePreview(){if(vehicleBundlePreview){releaseCabButton();stopVehiclePreviewSound();vehicleBundlePreview=null;vehiclePreviewScrewTouches.clear();}}
async function previewVehicleSound(id,mechanical=false){
 const labels=mechanical?VEHICLE_PREVIEW_MECHANICS:VEHICLE_PREVIEW_SOUNDS;
 if(!vehicleBundlePreview||!Object.hasOwn(labels,id)||state.settings.cockpit_muted)return false;
 stopVehiclePreviewSound();
 const ticket=vehiclePreviewTicket,bundle=vehicleBundlePreview,status=document.getElementById('vehicleSoundStatus');
 status.textContent=`${labels[id]} wird abgespielt …`;
 if(mechanical){playCabMechanical(id,bundle);vehiclePreviewTimer=setTimeout(()=>{if(ticket===vehiclePreviewTicket)status.textContent='Hörprobe beendet.';},id==='screw'||id==='ratchet'?1800:350);return true;}
 const completed=await playDriverSound(id,bundle);
 if(ticket!==vehiclePreviewTicket||bundle!==vehicleBundlePreview)return false;
 status.textContent=completed?'Hörprobe beendet.':'Wiedergabe gestoppt.';return completed;
}
async function previewVehicleCabAction(action){
 if(!vehicleBundlePreview||state.settings.cockpit_muted)return;
 const labels={next:'Beispielansage Anger',back:'Zurück',doors:vehiclePreviewDoorsOpen?'Türen schließen':'Türen öffnen',passenger:'Fahrgastanzeige',fullscreen:'Vollbild · Tastenklick',traffic:'Stau',finish:'Fahrtende',emergency:'Notfall'};
 if(!Object.hasOwn(labels,action))return;
 stopVehiclePreviewSound();
 const ticket=vehiclePreviewTicket,bundle=vehicleBundlePreview,status=document.getElementById('vehicleSoundStatus');
 const button=document.querySelector(`[data-preview-action="${action}"]`),opening=!vehiclePreviewDoorsOpen;
 button?.classList.add('is-sound-playing');status.textContent=`${labels[action]} wird abgespielt …`;
 if(action==='doors')syncVehiclePreviewDoors(true);
 if(action==='emergency')button?.setAttribute('aria-pressed','true');
 let completed;
 if(action==='next')completed=await playStopAnnouncementPreview('Anger');
 else if(action==='fullscreen'){playCabMechanical('down',bundle);completed=true;}
 else completed=await playDriverSound(action==='doors'?(opening?'door_open':'door_close'):action,bundle);
 if(ticket!==vehiclePreviewTicket||bundle!==vehicleBundlePreview)return;
 button?.classList.remove('is-sound-playing');if(action==='emergency')button?.setAttribute('aria-pressed','false');
 if(action==='doors'){if(completed)vehiclePreviewDoorsOpen=opening;syncVehiclePreviewDoors();}
 status.textContent=completed===null?'Beispielansage gestartet.':completed?'Hörprobe beendet.':'Wiedergabe gestoppt.';
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVehiclePreviewSound();});
window.addEventListener('blur',stopVehiclePreviewSound);
window.addEventListener('pagehide',stopVehicleBundlePreview);
