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
