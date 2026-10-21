'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-cab-bindings'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate(`state.active={id:'binding-test',plan:{id:'binding-plan',line:'3',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running'};showView('vehicles');state.settings.dev_mode=true;openVehicleBundlePreview('kt4dc');toggleCabLayoutEditor();window.calls=[];previewVehicleCabAction=action=>calls.push(action)`);
  const original=await b.evaluate('JSON.stringify(state.active)');
  const field=async(id,value)=>b.evaluate(`(()=>{const n=document.getElementById(${JSON.stringify(id)});n.value=${JSON.stringify(value)};n.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  // A real right click opens the assignment dialog without operating the control.
  const point=await b.evaluate(`(()=>{const r=document.querySelector('[data-cab-reserve="reserve-0"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'right',buttons:2,clickCount:1,...point});
  await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'right',buttons:0,clickCount:1,...point});
  assert.equal(await b.evaluate('document.getElementById("cabReserveMenu").dataset.key'),'reserve-0');
  await b.evaluate(`document.querySelector('[data-cab-position="0"]').value='passenger';document.getElementById('cabReserveText').value='Info <Test>';document.getElementById('cabReserveIcon').value='passenger';saveCabReserveBinding()`);
  assert.equal(await b.evaluate('cabLayoutEditor.history.length'),1);
  assert.equal(await b.evaluate('document.querySelector("#cabAccessory0 .cab-label").textContent'),'Info <Test>');
  assert.equal(await b.evaluate('document.querySelector("#cabAccessory0 svg path").getAttribute("d")'),await b.evaluate('CAB_ICONS.passenger'));
  assert.equal(await b.evaluate('document.querySelector("#cabAccessory0 .cab-label test")'),null);
  await b.evaluate('document.getElementById("cabAccessory0").click();toggleCabAccessory(0)');
  assert.deepEqual(await b.evaluate('calls'),[]);assert.equal(await b.evaluate('vehiclePreviewAccessoryStates.size'),0);
  await b.evaluate('undoCabLayout()');
  assert.equal(await b.evaluate('document.querySelector("#cabAccessory0 svg path").getAttribute("d")'),'');
  assert.equal(await b.evaluate('document.querySelector("#cabAccessory0 .cab-label").textContent'),'');
  await b.evaluate('openCabReserveMenu("reserve-0");document.querySelector("[data-cab-position]").value="passenger";document.getElementById("cabReserveText").value="Info";document.getElementById("cabReserveIcon").value="passenger";saveCabReserveBinding();selectCabLayout("icon-reserve-0")');
  await field('cabLayoutIconSize','90');
  const size=await b.evaluate(`(()=>{const s=cabLayoutEditor.stage.getBoundingClientRect(),i=document.querySelector('#cabAccessory0 svg').getBoundingClientRect();return {size:i.width/s.width*cabLayoutEditor.panel.width,x:(i.x+i.width/2-s.x)/s.width*cabLayoutEditor.panel.width}})()`);
  assert(Math.abs(size.size-90)<.1);
  await b.evaluate('undoCabLayout()');assert.notEqual(await b.evaluate('cabLayoutEditor.draft["icon-reserve-0"]?.iconSize'),90);
  await field('cabLayoutIconSize','80');
  await b.evaluate('selectCabLayout("label-reserve-0")');
  await field('cabLayoutBackground','#225588');
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector("#cabAccessory0 .cab-label")).backgroundColor'),'rgb(34, 85, 136)');
  await field('cabLayoutBackgroundMode','transparent');
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector("#cabAccessory0 .cab-label")).backgroundColor'),'rgba(0, 0, 0, 0)');
  await b.evaluate('undoCabLayout()');
  assert.equal(await b.evaluate('cabLayoutExportData().cab.layout["label-reserve-0"].background'),'#225588');
  await b.evaluate('toggleCabLayoutEditor();document.getElementById("cabAccessory0").click()');
  assert.deepEqual(await b.evaluate('calls'),['passenger']);
  await b.evaluate('document.querySelector(".cab-button[data-cab-control=passenger]").disabled=true;document.getElementById("cabAccessory0").click()');
  assert.deepEqual(await b.evaluate('calls'),['passenger']);
  // Both positions of the shared Gotha lever have independent functions.
  await b.evaluate(`closeModal();openVehicleBundlePreview('t57e');toggleCabLayoutEditor();openCabReserveMenu('reserve-0');document.querySelector('[data-cab-position="0"]').value='back';document.querySelector('[data-cab-position="1"]').value='next';document.getElementById('cabReserveText').value='Fahrtrichtung';document.getElementById('cabReserveIcon').value='next';saveCabReserveBinding();window.leverExport=cabLayoutExportData();toggleCabLayoutEditor();calls=[];document.getElementById('cabAccessory0').click();document.getElementById('cabAccessory0').click()`);
  assert.deepEqual(await b.evaluate('calls'),['next','back']);
  await b.evaluate(`closeModal();openVehicleBundlePreview('combino-basic');toggleCabLayoutEditor();openCabReserveMenu('rotary-0');['passenger','doors','traffic','next'].forEach((action,i)=>document.querySelector('[data-cab-position="'+i+'"]').value=action);saveCabReserveBinding();toggleCabLayoutEditor();calls=[];for(let i=0;i<4;i++)document.getElementById('cabRotary0').click()`);
  assert.deepEqual(await b.evaluate('calls'),['doors','traffic','next','passenger']);
  // Previously graphical spare buttons can be assigned too; touch UI opens the same menu.
  await b.evaluate('toggleCabLayoutEditor();document.getElementById("cabReserveElement").value="spare-0";document.querySelector("#cabReserveTools button").click()');
  assert.equal(await b.evaluate('document.getElementById("cabReserveMenu").dataset.key'),'spare-0');
  await b.evaluate('document.querySelector("[data-cab-position]").value="fullscreen";saveCabReserveBinding();toggleCabLayoutEditor();calls=[];document.querySelector("[data-cab-reserve=spare-0]").click()');
  assert.deepEqual(await b.evaluate('calls'),['fullscreen']);
  assert.equal(await b.evaluate('JSON.stringify(state.active)'),original);
  // A compiled export operates in the driver without Dev mode or editor drafts.
  await b.evaluate(`closeModal();state.settings.dev_mode=false;window.VEHICLE_BUNDLES={...VEHICLE_BUNDLES,t57e:{...VEHICLE_BUNDLES.t57e,cab:{...VEHICLE_BUNDLES.t57e.cab,layout:leverExport.cab.layout}}};state.active.plan.vehicleTypeId='t57e';showView('driver');window.driverCalls=[];nextStop=()=>driverCalls.push('next');driverPrevious=()=>driverCalls.push('back');document.getElementById('cabAccessory0').click();document.getElementById('cabAccessory0').click()`);
  assert.deepEqual(await b.evaluate('driverCalls'),['next','back']);
  assert.equal(await b.evaluate('document.querySelector("#cabAccessory0 .cab-label").textContent'),'Fahrtrichtung');
  await b.evaluate('showView("vehicles");state.settings.dev_mode=true;openVehicleBundlePreview("kt4dc");toggleCabLayoutEditor();selectCabLayout("icon-reserve-0")');
  assert.equal(await b.evaluate('document.getElementById("cabLayoutIconSize").value'),'80');
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.evaluate('openCabReserveMenu("reserve-0")');
  assert.equal(await b.evaluate('(()=>{const r=document.getElementById("cabReserveMenu").getBoundingClientRect();return r.x>=0&&r.right<=innerWidth&&r.y>=0&&r.bottom<=innerHeight})()'),true);
  await b.screenshot('assignment-mobile.png');
  assert.equal(b.errors.length,0);console.log('Cab bindings: context menu, touch selection, button/lever/4 rotary positions, disabled guards, icon size, text backgrounds, undo, persistence and compiled driver actions passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
