'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-panel-controls');
(async()=>{
 const b=await session(root,output);
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1680,height:1100,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate(`window.AndroidDisplay={setImmersive:()=>{}};window.AndroidAnnouncements={playSequence:()=>{},playEffect:(id,ticket)=>queueMicrotask(()=>onNativeDriverSoundEnd(ticket,true)),stop:()=>{}}`);
  for(const type of ['default','tramlink','combino-basic','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate(`state.active={id:'controls-'+${JSON.stringify(type)},plan:{id:'plan-controls',line:'3',tram:'test',vehicleTypeId:${JSON.stringify(type)},stops:allRouteStops('EF3H')},position:1,status:'running',doorsOpen:false,startedAtEpoch:Date.now(),positionReachedAt:Date.now()};showView('driver');setCabFullscreen(true)`);
   await b.delay(450);
   const icons=await b.evaluate(`([...document.querySelectorAll('.cab-button')].map(button=>{const face=button.querySelector('.cab-face').getBoundingClientRect(),icon=button.querySelector('svg path').getBoundingClientRect();return {label:button.querySelector('.cab-label').textContent,dx:icon.x+icon.width/2-face.x-face.width/2,dy:icon.y+icon.height/2-face.y-face.height/2}}))`);
   for(const icon of icons){assert(Math.abs(icon.dx)<.16,JSON.stringify({type,...icon}));assert(Math.abs(icon.dy)<.16,JSON.stringify({type,...icon}));}
   if(type!=='default'){
    const labels=await b.evaluate(`([...document.querySelectorAll('.cab-panel-front .cab-label')].map(label=>({background:getComputedStyle(label).backgroundColor,wrap:getComputedStyle(label).whiteSpace})))`);
    assert(labels.every(label=>label.background==='rgba(0, 0, 0, 0)'&&label.wrap==='nowrap'),type+' transparent one-line labels');
    const pads=await b.evaluate(`(()=>{const panel=getVehicleBundle().cab,stage=document.querySelector('.cab-stage').getBoundingClientRect();return Object.entries(panel.buttons).filter(([,control])=>control.labelPad).map(([key,control])=>{const label=document.querySelector(key==='emergency'?'#emergencyBtn .cab-label':key==='doors'?'#doorBtn .cab-label':'.cab-button[onclick="'+({next:'nextStop()',back:'driverPrevious()',passenger:'openPassengerDisplay()',fullscreen:'toggleCabFullscreen()',traffic:'openTrafficModal()',finish:'finishTrip(state.active.position>=state.active.plan.stops.length-1)'})[key]+'"] .cab-label'),rect=label.getBoundingClientRect();return {dx:rect.x+rect.width/2-stage.x-control.labelPad.x/panel.width*stage.width,dy:rect.y+rect.height/2-stage.y-control.labelPad.y/panel.height*stage.height,width:rect.width,content:label.scrollWidth,color:getComputedStyle(label).color}})})()`);
    for(const pad of pads){assert(Math.abs(pad.dx)<.2&&Math.abs(pad.dy)<.2,type+' pad center');assert(pad.content<=pad.width+1,type+' pad text fits');assert.equal(pad.color,type==='g4-65'?'rgb(29, 35, 40)':'rgb(255, 248, 223)');}
   }
   const before=await b.evaluate(`(()=>{const face=document.querySelector('#emergencyBtn .cab-face').getBoundingClientRect(),button=document.getElementById('emergencyBtn').getBoundingClientRect(),ring=document.querySelector('#emergencyBtn .cab-emergency-ring');return {face:{x:face.x,y:face.y,width:face.width,height:face.height},button:{x:button.x,y:button.y,width:button.width,height:button.height},ring:JSON.stringify(ring.getBoundingClientRect().toJSON())}})()`);
   await b.screenshot(type+'-raised.png');
   await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:before.button.x+before.button.width/2,y:before.button.y+before.button.height/2});
   await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:before.button.x+before.button.width/2,y:before.button.y+before.button.height/2,button:'left',clickCount:1});await b.delay(180);
   const down=await b.evaluate(`(()=>{const face=document.querySelector('#emergencyBtn .cab-face').getBoundingClientRect(),ring=document.querySelector('#emergencyBtn .cab-emergency-ring');return {width:face.width,height:face.height,ring:JSON.stringify(ring.getBoundingClientRect().toJSON()),mask:getComputedStyle(document.querySelector('#emergencyBtn .cab-emergency-mask')).opacity}})()`);
   assert(down.width<before.face.width*.96,type+' deep press');assert.equal(down.ring,before.ring,type+' fixed ring');assert.equal(down.mask,'1');
   await b.screenshot(type+'-pressed.png');
   await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:before.button.x+before.button.width/2,y:before.button.y+before.button.height/2,button:'left',clickCount:1});
   assert.equal(await b.evaluate('document.getElementById("emergencyBtn").getAttribute("aria-pressed")'),'true');await b.evaluate('closeModal()');
   const count=await b.evaluate('getVehicleBundle().cab.accessories?.length||0');
   assert.equal(await b.evaluate('document.querySelectorAll(".cab-accessory").length'),count);
   const snapshot=await b.evaluate('JSON.stringify(state.active)');
   for(let i=0;i<count;i++){
    await b.evaluate(`document.getElementById('cabAccessory${i}').click()`);
    assert.equal(await b.evaluate(`document.getElementById('cabAccessory${i}').getAttribute('aria-pressed')`),'true');
   }
   if(count){await b.delay(200);await b.screenshot(type+'-switches-on.png');await b.evaluate('showView("driver")');assert.equal(await b.evaluate('[...document.querySelectorAll(".cab-accessory")].every(b=>b.getAttribute("aria-pressed")==="true")'),true);}
   if(['g4-65','t57e'].includes(type)){
    const levers=await b.evaluate(`([...document.querySelectorAll('.cab-accessory-lever')].map(button=>{const off=button.querySelector('.cab-lever-off'),on=button.querySelector('.cab-lever-on'),a=off.getBoundingClientRect(),b=on.getBoundingClientRect();return {off:getComputedStyle(off).opacity,on:getComputedStyle(on).opacity,transforms:[getComputedStyle(off).transform,getComputedStyle(on).transform],distance:Math.hypot(b.x-a.x,b.y-a.y)}}))`);
    assert(levers.every(lever=>lever.off==='0'&&lever.on==='1'&&lever.transforms.every(value=>value==='none')&&lever.distance>10),type+' levers change position without rotating');
   }
   assert.equal(await b.evaluate('JSON.stringify(state.active)'),snapshot);
  }
  await b.evaluate('showView("vehicles");openVehicleBundlePreview("g4-65");document.getElementById("cabAccessory0").click()');
  assert.equal(await b.evaluate('vehiclePreviewAccessoryStates.get("g4-65:0")'),true);
  await b.evaluate('closeModal();openVehicleBundlePreview("g4-65")');assert.equal(await b.evaluate('document.getElementById("cabAccessory0").getAttribute("aria-pressed")'),'false');
  await b.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".cab-accessory-cap")).transitionDuration'),'0s');
  await b.evaluate('document.getElementById("cabAccessory0").focus()');
  await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
  assert.equal(await b.evaluate('document.getElementById("cabAccessory0").getAttribute("aria-pressed")'),'true');
  assert.equal(b.errors.length,0);console.log('Panel controls: centered icons, transparent pad labels, deep emergency press, fixed rings and opposite lever positions passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
