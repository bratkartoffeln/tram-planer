'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-cab-live-layout'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');openVehicleBundlePreview('combino-basic');toggleCabLayoutEditor();window.sounds=[];window.AndroidAnnouncements={playMechanical:(path,kind)=>sounds.push({path,kind}),stopMechanical:()=>{},stop:()=>{}};openCabReserveMenu('spare-0');document.querySelector('[data-cab-position]').value='next';document.querySelector('[data-cab-sound-position]').value='effect:traffic';document.getElementById('cabReserveText').value='Reserve A';document.getElementById('cabReserveIcon').value='next';saveCabReserveBinding();selectCabLayout('label-spare-0');editCabLayout('color','#eeeeee');editCabLayout('background','#112233');editCabLayout('fontFamily','Arial');editCabLayout('fontSize',20);editCabLayout('bold',true);selectCabLayout('icon-spare-0');editCabLayout('iconSize',64)`);
  assert.equal(await b.evaluate('cabLayoutExportData().cab.layout["control-spare-0"].sound'),'effect:traffic');
  await b.evaluate('undoCabLayout()');assert.equal(await b.evaluate('cabLayoutEditor.draft["icon-spare-0"]?.iconSize'),undefined);await b.evaluate('editCabLayout("iconSize",64)');
  const press=async selector=>{
   const point=await b.evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
   await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...point});await b.delay(160);
   return point;
  };
  const release=async point=>{await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...point});await b.delay(160);};
  const cap=`(()=>{const n=document.querySelector('[data-cab-reserve="spare-0"]');return {transform:getComputedStyle(n.querySelector('.cab-spare-cap')).transform,socket:getComputedStyle(n.querySelector('.cab-spare-socket')).opacity,held:n.classList.contains('is-down')}})()`;
  let point=await press('[data-cab-reserve="spare-0"]');assert.deepEqual(await b.evaluate(cap),{transform:'none',socket:'0',held:false});await release(point);assert.deepEqual(await b.evaluate('sounds'),[]);
  await b.evaluate('previewCabBindingSound("effect:traffic")');assert.equal(await b.evaluate('sounds.at(-1).path'),'audio/effects/traffic.mp3');
  await b.evaluate('toggleCabLayoutEditor();window.calls=[];previewVehicleCabAction=action=>calls.push(action);sounds=[]');
  point=await press('[data-cab-reserve="spare-0"]');const down=await b.evaluate(cap);assert.notEqual(down.transform,'none',JSON.stringify(await b.evaluate(`({active:cabLayoutEditor.active,stage:cabLayoutEditor.stage.className,held:cabHeld?.outerHTML,target:document.elementFromPoint(${point.x},${point.y})?.outerHTML})`)));assert.equal(down.socket,'1');assert.equal(down.held,true);await release(point);
  assert.equal((await b.evaluate(cap)).held,false);assert.deepEqual(await b.evaluate('calls'),['next']);assert.equal(await b.evaluate('sounds.at(-1).path'),'audio/effects/traffic.mp3');
  // Editing blocks lever and rotary operation too; leaving it restores their animation.
  await b.evaluate('toggleCabLayoutEditor();turnCabRotary(0)');assert.deepEqual(await b.evaluate('vehiclePreviewRotaryTurns'),[0,0]);
  await b.evaluate('toggleCabLayoutEditor();turnCabRotary(0)');assert.deepEqual(await b.evaluate('vehiclePreviewRotaryTurns'),[1,0]);
  // Shared layouts are applied in real driver DOM with Dev mode switched off.
  const combos=await b.evaluate('ERFURT_VEHICLE_CATALOG.types.filter(type=>type.id.startsWith("combino-")).map(type=>type.id)');
  await b.evaluate(`closeModal();state.settings.dev_mode=false;window.driverCalls=[];nextStop=()=>driverCalls.push('next');driverPrevious=()=>driverCalls.push('back');state.active={id:'shared-cab-test',plan:{id:'shared-plan',line:'3',tram:'801',vehicleTypeId:'combino-basic',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()}`);
  for(const type of combos){
   await b.evaluate(`state.active.plan.vehicleTypeId=${JSON.stringify(type)};showView('driver')`);
   if(type!=='combino-basic'){
    assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=spare-0] .cab-label").textContent'),'');
    continue;
   }
   assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=spare-0] .cab-label").textContent'),'Reserve A');
   assert.equal(await b.evaluate('getComputedStyle(document.querySelector("[data-cab-reserve=spare-0] .cab-label")).backgroundColor'),'rgb(17, 34, 51)');
   const size=await b.evaluate(`document.querySelector('[data-cab-reserve="spare-0"] svg').getBoundingClientRect().width/document.querySelector('.cab-stage').getBoundingClientRect().width*cabPanel().width`);assert(Math.abs(size-64)<.1);
   await b.evaluate('document.querySelector("[data-cab-reserve=spare-0]").click()');assert.equal(await b.evaluate('driverCalls.at(-1)'),'next');
   const count=await b.evaluate('driverCalls.length');await b.evaluate('state.active.doorsOpen=true;updateDriverLive();document.querySelector("[data-cab-reserve=spare-0]").click()');assert.equal(await b.evaluate('driverCalls.length'),count);await b.evaluate('state.active.doorsOpen=false');
  }
  await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');openVehicleBundlePreview('t57e');toggleCabLayoutEditor();openCabReserveMenu('reserve-0');document.querySelector('[data-cab-position="0"]').value='back';document.querySelector('[data-cab-position="1"]').value='next';document.querySelector('[data-cab-sound-position="0"]').value='effect:back';document.querySelector('[data-cab-sound-position="1"]').value='effect:emergency';saveCabReserveBinding();toggleCabAccessory(0)`);
  assert.equal(await b.evaluate('vehiclePreviewAccessoryStates.size'),0);
  assert.deepEqual(await b.evaluate('cabLayoutExportData().cab.layout["control-reserve-0"].sounds'),{'0':'effect:back','1':'effect:emergency'});
  await b.evaluate('closeModal();state.settings.dev_mode=false;state.active.plan.vehicleTypeId="t57e";state.active.id="lever-trip";showView("driver");sounds=[];driverCalls=[];document.getElementById("cabAccessory0").click();document.getElementById("cabAccessory0").click()');
  assert.deepEqual(await b.evaluate('driverCalls'),['next','back']);assert.deepEqual(await b.evaluate('sounds.map(sound=>sound.path)'),['audio/effects/emergency.mp3','audio/effects/back.mp3']);
  assert.equal(b.errors.length,0);console.log('Live layouts: editor blocks animations, preview restores press/rotary/lever, sound audition/assignments, per-position sounds, all shared Combinos in driver with Dev off and door interlocks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
