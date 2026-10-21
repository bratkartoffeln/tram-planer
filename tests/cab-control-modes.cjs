'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-cab-control-modes'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate('state.settings.dev_mode=true;showView("vehicles")');
  const pointer=async(selector,down)=>{
   const p=await b.evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
   await b.cdp('Input.dispatchMouseEvent',{type:down?'mousePressed':'mouseReleased',button:'left',buttons:down?1:0,clickCount:1,...p});await b.delay(30);
  };
  const setMode=async(key,mode)=>{
   await b.evaluate(`openCabControlMenu(${JSON.stringify(key)});document.getElementById('cabControlMode').value=${JSON.stringify(mode)};document.querySelector('#cabReserveMenu .primary').click()`);
  };
  for(const type of ['combino-basic','tramlink','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)});toggleCabLayoutEditor()`);
   const controls=await b.evaluate(`([...cabLayoutEditor.stage.querySelectorAll('.cab-button,[data-cab-reserve],.cab-screw')].map(n=>({key:cabControlKey(n),selector:n.dataset.cabReserve?'[data-cab-reserve="'+n.dataset.cabReserve+'"]':n.id?'#'+n.id:'.cab-button[data-cab-control="'+n.dataset.cabControl+'"]'})))`);
   // Every control's editor exposes the setting, and it survives export/undo.
   for(const {key} of controls)await setMode(key,'latching');
   assert(controls.every(({key})=>key));
   assert.equal(await b.evaluate('Object.values(cabLayoutExportData().cab.layout).filter(v=>v.mode==="latching").length'),controls.length,type);
   await b.evaluate('undoCabLayout()');
   assert.equal(await b.evaluate('Object.values(cabLayoutExportData().cab.layout).filter(v=>v.mode==="latching").length'),controls.length-1,type+' mode undo');
   await setMode(controls.at(-1).key,'latching');
   await b.evaluate('toggleCabLayoutEditor();window.modeCalls=0;document.querySelectorAll(".cab-button").forEach(n=>n.onclick=()=>modeCalls++)');
   for(const {key,selector} of controls.filter(c=>!c.key.startsWith('screw-'))){
    await pointer(selector,true);await pointer(selector,false);
    assert.equal(await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('cab-mode-on')`),true,type+' latch '+key);
    await b.evaluate('cabLayoutRefresh()');
    assert.equal(await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('cab-mode-on')`),true,type+' refresh '+key);
    await pointer(selector,true);await pointer(selector,false);
    assert.equal(await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('cab-mode-on')`),false,type+' unlatch '+key);
   }
   await b.evaluate('toggleCabLayoutEditor()');
   for(const {key} of controls)await setMode(key,'momentary');
   await b.evaluate('toggleCabLayoutEditor();document.querySelectorAll(".cab-button").forEach(n=>n.onclick=()=>modeCalls++)');
   for(const {key,selector} of controls.filter(c=>!c.key.startsWith('screw-'))){
    await pointer(selector,true);
    assert.equal(await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('cab-mode-on')`),true,type+' held '+key);
    await pointer(selector,false);
    assert.equal(await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('cab-mode-on')`),false,type+' released '+key);
    if(key.startsWith('rotary-'))assert.equal(await b.evaluate(`getComputedStyle(document.querySelector(${JSON.stringify(selector)})).getPropertyValue('--rotary-angle').trim()`),'0deg');
    if(key.startsWith('reserve-'))assert.equal(await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).classList.contains('is-on')`),false);
   }
  }
  // A spring-return lever invokes the assigned positions once each, including
  // keyboard operation. Cancellation restores the hardware without an action.
  await b.evaluate(`openVehicleBundlePreview('t57e');toggleCabLayoutEditor();openCabReserveMenu('reserve-0');document.getElementById('cabControlMode').value='momentary';document.querySelector('[data-cab-position="0"]').value='back';document.querySelector('[data-cab-position="1"]').value='next';saveCabReserveBinding();toggleCabLayoutEditor();window.modeActions=[];document.querySelector('[data-cab-control="next"]').onclick=()=>modeActions.push('next');document.querySelector('[data-cab-control="back"]').onclick=()=>modeActions.push('back')`);
  await pointer('[data-cab-reserve="reserve-0"]',true);await pointer('[data-cab-reserve="reserve-0"]',false);
  assert.deepEqual(await b.evaluate('modeActions'),['next','back']);
  await b.evaluate('modeActions=[];document.querySelector("[data-cab-reserve=reserve-0]").focus()');
  await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
  assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=reserve-0]").classList.contains("is-on")'),true);
  await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
  assert.deepEqual(await b.evaluate('modeActions'),['next','back']);
  await b.evaluate('modeActions=[]');await pointer('[data-cab-reserve="reserve-0"]',true);
  await b.evaluate('window.dispatchEvent(new Event("blur"))');
  assert.deepEqual(await b.evaluate('modeActions'),['next']);
  assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=reserve-0]").classList.contains("is-on")'),false);
  await pointer('[data-cab-reserve="reserve-0"]',false);
  await b.evaluate('openVehicleBundlePreview("combino-basic")');
  assert.equal(await b.evaluate('document.getElementById("nextStopBtn").dataset.cabMode'),'momentary');
  // Saved shared layout is used in the actual trip with Dev mode switched off.
  await b.evaluate(`closeModal();state.settings.dev_mode=false;state.active={id:'mode-trip',plan:{id:'mode-plan',line:'3',tram:'801',vehicleTypeId:'combino-basic',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()};showView('driver')`);
  assert.equal(await b.evaluate('document.getElementById("nextStopBtn").dataset.cabMode'),'momentary');
  assert.equal(b.errors.length,0);console.log('Control modes: all 8 cabs, every control editor/export, latch/unlatch, held/released buttons/levers/rotaries, refresh and shared live layout passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
