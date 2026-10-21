'use strict';

// Bundles are compiled by sync-assets.py, including inheritance and validation.
// The trip's saved type wins so deleting a fleet entry cannot change its cab.
function getVehicleBundle(plan=state.active?.plan){
 const vehicle=plan&&(state.vehicles.find(item=>item.id===plan.vehicleId)||vehicleForCode(plan.tram));
 const typeId=plan?.vehicleTypeId||vehicle?.typeId;
 return window.VEHICLE_BUNDLES[typeId]||window.VEHICLE_BUNDLES.default;
}
function driverSoundPath(id){return getVehicleBundle().sounds.effects[id];}
function cabMechanicalSound(kind){return getVehicleBundle().sounds.mechanical[kind];}
function cabPanel(){return getVehicleBundle().cab;}
function vehicleBundleInfo(bundle){return bundle.presentation||{title:'Standard-Fahrpult',variant:'Standard-Fallback',description:'Das bisherige Fahrpult wird für freie oder unbekannte Fahrzeugtypen verwendet.',soundNote:'Vorhandene Standardklänge und synthetische Mechanik.',references:[]};}
function vehicleBundleSources(bundle){
 const info=vehicleBundleInfo(bundle);
 return `<p><strong>${esc(info.variant)}</strong></p><p>${esc(info.description)}</p><p>Das frontale Panel ist nach der Referenz nachgebildet; Tastenanzahl und Anordnung sind an die acht Spielaktionen angepasst. Instrumente sind Bildkulisse. Zusätzliche bedienbare Schalter sind Reserveelemente ohne Fahrfunktion.</p>${info.references.map(source=>`<p><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)}</a></p>`).join('')}${(bundle.credits||[]).map(text=>`<p>${esc(text)}</p>`).join('')}<p>${esc(info.soundNote)}</p>`;
}
