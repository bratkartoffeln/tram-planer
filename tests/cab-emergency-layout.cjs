'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-cab-emergency-layout'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');window.effectCalls=[];window.AndroidAnnouncements={playEffect:(id,ticket)=>effectCalls.push({id,ticket}),playSequence:()=>{},stop:()=>{},stopMechanical:()=>{}}`);
  const anchor=`(()=>{const button=document.getElementById('emergencyBtn'),face=button.querySelector('.cab-face').getBoundingClientRect(),icon=button.querySelector('svg').getBoundingClientRect();return {x:(icon.x+icon.width/2-face.x)/face.width,y:(icon.y+icon.height/2-face.y)/face.height,left:parseFloat(button.querySelector('svg').style.left),top:parseFloat(button.querySelector('svg').style.top)}})()`;
  const same=(actual,expected,message)=>{for(const field of ['x','y','left','top'])assert(Math.abs(actual[field]-expected[field])<(field==='left'||field==='top'?.001:.0001),message+' '+field+': '+JSON.stringify({actual,expected}));};
  for(const type of ['combino-basic','tramlink','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)});toggleCabLayoutEditor();selectCabLayout('icon-emergency');editCabLayout('x',cabLayoutEditor.panel.buttons.emergency.x+12);editCabLayout('y',cabLayoutEditor.panel.buttons.emergency.y-9);toggleCabLayoutEditor()`);await b.delay(180);
   const original=await b.evaluate(anchor);
   for(let cycle=0;cycle<3;cycle++){
    const point=await b.evaluate(`(()=>{const n=document.getElementById('emergencyBtn');n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...point});await b.delay(170);
    same(await b.evaluate(anchor),original,type+' held '+cycle);
    await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...point});
    // Starting the preview refreshes its layout while the cap is still pressed.
    same(await b.evaluate(anchor),original,type+' preview starts '+cycle);await b.delay(50);
    same(await b.evaluate(anchor),original,type+' latched '+cycle);
    await b.evaluate('onNativeDriverSoundEnd(effectCalls.at(-1).ticket,true)');await b.delay(35);
    await b.evaluate('cabLayoutRefresh()');same(await b.evaluate(anchor),original,type+' mid-return refresh '+cycle);
    await b.delay(170);same(await b.evaluate(anchor),original,type+' fully returned '+cycle);
   }
   await b.evaluate('closeModal()');
  }
  assert.equal(b.errors.length,0);console.log('Edited emergency icon: stable cap-relative anchor through first press, latch, mid-return refresh and three repeated cycles in all 8 panel families passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
