'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-cab-vehicle-layouts'));
 try{
  await b.navigate();
  await b.evaluate(`state.settings.dev_mode=true;state.vehicles=[{id:'vehicle-a',code:'Bahn A',typeId:'combino-basic'},{id:'vehicle-b',code:'Bahn B',typeId:'combino-basic'},{id:'vehicle-c',code:'Bahn C',typeId:'combino-advanced-long'}];localStorage.setItem(CAB_LAYOUT_STORAGE,JSON.stringify({[VEHICLE_BUNDLES.default.cab.image]:{'label-next':{text:'Bisheriges Layout'}}}));showView('vehicles')`);
  // Fleet cards open the vehicle instance, rather than the shared type preview.
  await b.evaluate(`document.querySelector('[data-vehicle-id="vehicle-a"] [data-cab-preview]').click();toggleCabLayoutEditor()`);
  assert.equal(await b.evaluate('cabLayoutEditor.scope.vehicleId'),'vehicle-a');
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'Bisheriges Layout');
  await b.evaluate(`selectCabLayout('label-next');editCabLayout('text','A weiter');openCabReserveMenu('spare-0');document.querySelector('[data-cab-position]').value='back';document.querySelector('[data-cab-sound-position]').value='effect:traffic';document.getElementById('cabReserveText').value='A Taste';document.getElementById('cabControlMode').value='latching';saveCabReserveBinding()`);
  const exported=await b.evaluate('cabLayoutExportData()');assert.equal(exported.vehicleId,'vehicle-a');assert.equal(exported.vehicleCode,'Bahn A');assert.equal(exported.vehicleType,'combino-basic');
  await b.evaluate(`openVehicleBundlePreview('combino-basic','vehicle-b');toggleCabLayoutEditor()`);
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'Bisheriges Layout');
  assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=spare-0] .cab-label").textContent'),'');
  await b.evaluate(`selectCabLayout('label-next');editCabLayout('text','B weiter');openCabReserveMenu('spare-0');document.querySelector('[data-cab-position]').value='next';document.getElementById('cabReserveText').value='B Taste';document.getElementById('cabControlMode').value='momentary';saveCabReserveBinding()`);
  await b.evaluate(`openVehicleBundlePreview('combino-basic');toggleCabLayoutEditor();selectCabLayout('label-next');editCabLayout('text','Typvorlage')`);
  // Another type with the same panel stays independent as well.
  await b.evaluate(`openVehicleBundlePreview('combino-advanced-long','vehicle-c')`);
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'Bisheriges Layout');
  // Reload, rename and rebuild preserve the individual instance by its stable ID.
  await b.evaluate('saveState()');await b.navigate();
  await b.evaluate(`state.settings.dev_mode=true;state.vehicles.find(v=>v.id==='vehicle-a').code='A umbenannt';openVehicleBundlePreview('combino-basic','vehicle-a');toggleCabLayoutEditor()`);
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'A weiter');
  assert.equal(await b.evaluate('cabLayoutExportData().vehicleCode'),'A umbenannt');
  const all=await b.evaluate('cabLayoutAllExportData()');
  const a=all.layouts.find(layout=>layout.vehicles?.some(v=>v.id==='vehicle-a')),other=all.layouts.find(layout=>layout.vehicles?.some(v=>v.id==='vehicle-b'));
  assert.equal(a.cab.layout['control-spare-0'].action,'back');assert.equal(other.cab.layout['control-spare-0'].action,'next');
  assert.notEqual(a,other);
  // Driver uses the matching instance's functions, sounds and mode with Dev off.
  await b.evaluate(`closeModal();state.settings.dev_mode=false;window.calls=[];window.tones=[];window.AndroidAnnouncements={playMechanical:(path)=>tones.push(path),stopMechanical:()=>{},stop:()=>{}};nextStop=()=>calls.push('next');driverPrevious=()=>calls.push('back');state.active={id:'instance-trip',plan:{id:'instance-plan',line:'3',tram:'Bahn A',vehicleId:'vehicle-a',vehicleTypeId:'combino-basic',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()}`);
  for(const [id,label,action,mode] of [['vehicle-a','A weiter','back','latching'],['vehicle-b','B weiter','next','momentary']]){
   await b.evaluate(`state.active.plan.vehicleId=${JSON.stringify(id)};showView('driver')`);
   assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),label);
   assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=spare-0]").dataset.cabMode'),mode);
   await b.evaluate('document.querySelector("[data-cab-reserve=spare-0]").click()');assert.equal(await b.evaluate('calls.at(-1)'),action);
  }
  assert((await b.evaluate('tones')).includes('audio/effects/traffic.mp3'));
  // Resetting A loads the project layout only for A, never B or the type.
  await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');openVehicleBundlePreview('combino-basic','vehicle-a');toggleCabLayoutEditor();resetCabLayout()`);
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'Nächster Halt');
  await b.evaluate(`openVehicleBundlePreview('combino-basic','vehicle-b')`);assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'B weiter');
  await b.evaluate(`state.vehicles.find(v=>v.id==='vehicle-b').typeId='tramlink';openVehicleBundlePreview('tramlink','vehicle-b')`);
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'Nächster Halt');
  await b.evaluate(`state.vehicles.find(v=>v.id==='vehicle-b').typeId='combino-basic';openVehicleBundlePreview('combino-basic','vehicle-b')`);
  assert.equal(await b.evaluate('document.querySelector("#nextStopBtn .cab-label").textContent'),'B weiter');
  await b.screenshot('individual-vehicle-preview.png');
  assert.equal(b.errors.length,0);console.log('Vehicle layouts: legacy fallback, independent same-type fleet instances and shared-panel types, persistence, rename, reset, exports, live actions/sounds/modes passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
