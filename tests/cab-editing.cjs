'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-cab-editing'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate('state.settings.dev_mode=true;showView("vehicles");openVehicleBundlePreview("combino-basic");toggleCabLayoutEditor();window.tones=[];playCabMechanical=kind=>tones.push(kind)');
  const indicators=await b.evaluate('[...document.querySelectorAll(".cab-door-indicator svg")].map(node=>({outline:getComputedStyle(node).outlineStyle,color:getComputedStyle(node).outlineColor,opacity:getComputedStyle(node).opacity}))');
  assert.equal(indicators.length,2);assert(indicators.every(item=>item.outline==='dashed'&&item.color==='rgb(0, 191, 232)'&&item.opacity==='1'));
  assert.equal(await b.evaluate('document.querySelectorAll(".cab-emergency-editor-outline").length'),2);
  assert.equal(await b.evaluate('[...document.querySelectorAll(".cab-emergency-editor-outline")].every(node=>getComputedStyle(node).zIndex==="1000"&&getComputedStyle(node).pointerEvents==="none")'),true);
  await b.evaluate('selectCabLayout("icon-open")');assert.equal(await b.evaluate('document.querySelector("[data-door-indicator=open]").classList.contains("cab-layout-control-selected")'),true);
  const keys=await b.evaluate('[...cabLayoutEditor.stage.querySelectorAll(".cab-button,[data-cab-reserve],.cab-screw")].map(cabControlKey)');
  assert(keys.includes('emergency'));assert(keys.includes('screw-0'));
  for(const key of keys){await b.evaluate('openCabControlMenu('+JSON.stringify(key)+')');assert.equal(await b.evaluate('document.querySelectorAll("[data-cab-tone-phase]").length'),2);await b.evaluate('closeCabReserveMenu()');}
  await b.evaluate('openCabControlMenu("spare-0")');
  assert.equal(await b.evaluate('document.querySelectorAll("[data-cab-symbol]").length'),await b.evaluate('CAB_LAYOUT_SYMBOLS.length'));
  assert.equal(await b.evaluate('[...document.querySelectorAll("[data-cab-symbol]")].every(button=>button.textContent.trim()&&(button.dataset.cabSymbol?button.querySelector("svg path").getAttribute("d")===CAB_ICONS[button.dataset.cabSymbol]:!!button.querySelector(".cab-symbol-none")))'),true);
  await b.evaluate('document.querySelector("[data-cab-symbol=traffic]").click()');
  assert.equal(await b.evaluate('document.getElementById("cabReserveIcon").value'),'traffic');assert.equal(await b.evaluate('document.querySelectorAll("[data-cab-symbol][aria-pressed=true]").length'),1);
  await b.evaluate('saveCabReserveBinding()');assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=spare-0] svg path").getAttribute("d")'),await b.evaluate('CAB_ICONS.traffic'));
  await b.evaluate('selectCabLayout("icon-emergency");document.querySelector(".cab-stage").scrollIntoView({block:"center"})');
  await b.screenshot('emergency-foreground-outline.png');
  await b.evaluate('document.getElementById("cabEditSelectedControl").click()');
  assert.equal(await b.evaluate('document.querySelectorAll(".cab-emergency-editor-outline").length'),3);
  assert.equal(await b.evaluate('document.getElementById("cabReserveMenu").dataset.actuationKey'),'emergency');
  await b.evaluate('document.querySelector("[data-cab-tone-phase=press]").value="mechanical:rotary";document.querySelector("[data-cab-tone-phase=release]").value="none";saveCabActuation()');
  assert.deepEqual(await b.evaluate('cabLayoutExportData().cab.layout["actuation-emergency"]'),{press:'mechanical:rotary',release:'none'});
  await b.evaluate('undoCabLayout()');assert.equal(await b.evaluate('cabLayoutEditor.draft["actuation-emergency"]'),undefined);
  // Selecting free text identifies the complete panel and exposes panel operations.
  await b.evaluate('selectCabLayout("heading-0")');
  assert.equal(await b.evaluate('cabLayoutEditor.stage.classList.contains("cab-layout-control-selected")'),true);
  assert.equal(await b.evaluate('document.getElementById("cabReserveElement").value'),'panel');
  await b.evaluate('document.getElementById("cabEditSelectedControl").click()');assert.equal(await b.evaluate('document.getElementById("cabReserveMenu").dataset.key'),'panel');
  await b.evaluate('addFreeCabLabel()');const key=await b.evaluate('cabLayoutEditor.selected');assert.equal(key,'heading-free-1');
  await b.evaluate(`document.getElementById('cabLayoutText').value='Eigener Pulttext';document.getElementById('cabLayoutText').dispatchEvent(new Event('input'));editCabLayout('color','#112233');editCabLayout('background','#ddeeff')`);
  assert.equal(await b.evaluate('document.querySelector("[data-cab-free-label]").textContent'),'Eigener Pulttext');
  await b.evaluate('deleteFreeCabLabel()');assert.equal(await b.evaluate('getComputedStyle(document.querySelector("[data-cab-free-label]")).display'),'none');
  await b.evaluate('undoCabLayout()');assert.notEqual(await b.evaluate('getComputedStyle(document.querySelector("[data-cab-free-label]")).display'),'none');
  await b.evaluate('selectCabLayout("heading-0");deleteFreeCabLabel();undoCabLayout()');assert.notEqual(await b.evaluate('getComputedStyle(document.querySelector("[data-cab-layout-key=heading-0]")).display'),'none');
  // Empty labels are clickable; a tap immediately puts the text field into editing focus.
  const point=async selector=>b.evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});n.scrollIntoView({block:'center',inline:'center'});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  const tap=await point('[data-cab-reserve="spare-0"] .cab-label');
  await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...tap});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...tap});
  assert.equal(await b.evaluate('cabLayoutEditor.selected'),'label-spare-0');assert.equal(await b.evaluate('document.activeElement.id'),'cabLayoutText');assert.equal(await b.evaluate('document.querySelector("[data-cab-reserve=spare-0]").classList.contains("cab-layout-control-selected")'),true);
  // Real touch events exercise the Android/WebView long press, with no layout change.
  await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  const touch=await point('#emergencyBtn'),before=await b.evaluate('JSON.stringify(cabLayoutEditor.draft)');
  await b.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...touch,id:1}]});await b.delay(650);
  assert.equal(await b.evaluate('document.getElementById("cabReserveMenu")?.dataset.actuationKey'),'emergency');
  await b.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await b.evaluate('JSON.stringify(cabLayoutEditor.draft)'),before);assert.equal(await b.evaluate('!!document.getElementById("cabReserveMenu")'),true);
  await b.evaluate('closeCabReserveMenu()');
  const drag=await point('[data-cab-layout-key="label-back"]');
  await b.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...drag,id:2}]});await b.cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:drag.x+35,y:drag.y,id:2}]});await b.delay(650);
  assert.equal(await b.evaluate('document.getElementById("cabReserveMenu")'),null);await b.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  // Custom actuation replaces the normal press/release transients in preview.
  await b.evaluate('openCabControlMenu("spare-0");document.querySelector("[data-cab-tone-phase=press]").value="mechanical:latch";document.querySelector("[data-cab-tone-phase=release]").value="mechanical:rotary";saveCabReserveBinding();toggleCabLayoutEditor();tones=[]');
  const button=await point('[data-cab-reserve="spare-0"]');await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...button});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...button});
  assert.deepEqual(await b.evaluate('tones'),['latch','rotary']);
  await b.evaluate('state.settings.dev_mode=true;state.settings.dark_mode=true;applyTheme();showView("vehicles");openVehicleBundlePreview("combino-basic");toggleCabLayoutEditor();openCabControlMenu("spare-0")');
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  await b.evaluate('document.querySelector(".cab-symbol-picker").scrollIntoView({block:"center"})');
  assert.equal(await b.evaluate('document.getElementById("cabReserveMenu").scrollWidth<=document.getElementById("cabReserveMenu").clientWidth'),true);
  assert.equal(await b.evaluate('(()=>{const rect=document.getElementById("cabReserveMenu").getBoundingClientRect();return rect.x>=0&&rect.right<=innerWidth&&rect.y>=0&&rect.bottom<=innerHeight})()'),true);
  await b.screenshot('symbol-picker-mobile-dark.png');
  // Free labels and mechanical settings survive reopening with Dev mode disabled.
  await b.evaluate('closeModal();state.settings.dev_mode=false');
  await b.evaluate('openVehicleBundlePreview("combino-basic")');
  assert.equal(await b.evaluate('document.querySelector("[data-cab-free-label]").textContent'),'Eigener Pulttext');
  assert.equal(await b.evaluate('document.getElementById("cabLayoutToggle")'),null);
  await b.evaluate(`closeModal();state.active={id:'free-label-trip',plan:{id:'free-label-plan',line:'3',tram:'801',vehicleTypeId:'combino-basic',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()};showView('driver');tones=[]`);
  assert.equal(await b.evaluate('document.querySelector("[data-cab-free-label]").textContent'),'Eigener Pulttext');
  const live=await point('[data-cab-reserve="spare-0"]');await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...live});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...live});
  assert.deepEqual(await b.evaluate('tones'),['latch','rotary']);
  assert.equal(b.errors.length,0);console.log('Cab editing: all controls/emergency actuation, selected-control button, panel ownership, free labels add/delete/undo/persist, empty-label click, real touch long-press, drag cancellation and preview tones passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
