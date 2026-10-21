'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-all-screws'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  await b.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.navigate();await b.evaluate(`showView('vehicles');window.screwSounds=[];playCabMechanical=kind=>screwSounds.push(kind)`);
  const types=await b.evaluate('ERFURT_VEHICLE_CATALOG.types.map(t=>t.id)');let count=0;
  const settled=async()=>{for(let i=0;i<40;i++){if(await b.evaluate(`!document.querySelector('.cab-screw[aria-busy]')`))return;await b.delay(50);}throw Error('Screw animation did not finish');};
  for(const type of types){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)});document.querySelector('.cab-stage').scrollIntoView({block:'center'});screwSounds=[]`);
   const screws=await b.evaluate(`(()=>{const p=vehicleBundlePreview.cab,s=document.querySelector('.cab-stage').getBoundingClientRect();return [...document.querySelectorAll('.cab-screw')].map((n,i)=>{const r=n.getBoundingClientRect(),face=n.querySelector('.cab-screw-face').getBoundingClientRect(),top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {id:n.id,hit:!!top&&n.contains(top),cap:face.width/s.width*p.width,expected:p.screws[i][3]||p.screwCap||54}})})()`);
   assert.equal(screws.length,await b.evaluate('vehicleBundlePreview.cab.screws.length'),type);
   for(const s of screws){assert(s.hit,type+' blocked '+s.id);assert(Math.abs(s.cap-s.expected)<.1,type+' screw crop '+s.id);}
   count+=screws.length;
   await b.evaluate(`document.querySelectorAll('.cab-screw').forEach(n=>n.dispatchEvent(new MouseEvent('dblclick',{bubbles:true})))`);
   assert.equal(await b.evaluate('vehiclePreviewLooseScrews.size'),screws.length,type);
   await settled();
   assert.equal(await b.evaluate(`document.querySelectorAll('.cab-screw.is-missing').length`),screws.length,type);
   await b.evaluate(`document.querySelectorAll('.cab-screw').forEach(n=>n.dispatchEvent(new MouseEvent('dblclick',{bubbles:true})))`);
   await settled();
   assert.equal(await b.evaluate(`document.querySelectorAll('.cab-screw.is-missing').length`),0,type);
   assert.deepEqual(await b.evaluate('screwSounds'),[...screws.map(()=>'screw'),...screws.map(()=>'ratchet')],type);
  }
  // Added screws retain state after a live trip rerenders and support keyboard/touch.
  await b.evaluate(`closeModal();state.active={id:'screw-trip',plan:{line:'3',tram:'801',vehicleTypeId:'kt4dc',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()};showView('driver');document.getElementById('cabScrew4').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))`);
  await settled();assert.equal(await b.evaluate('cabLooseScrews.has(4)'),true);
  await b.evaluate(`showView('driver')`);assert.equal(await b.evaluate(`document.getElementById('cabScrew4').classList.contains('is-missing')`),true);
  await b.evaluate(`const n=document.getElementById('cabScrew4');for(let i=0;i<2;i++)n.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch',clientX:100,clientY:100,bubbles:true}))`);
  await settled();assert.equal(await b.evaluate('cabLooseScrews.has(4)'),false);
  await b.evaluate(`showView('vehicles');openVehicleBundlePreview('g4-65');document.querySelector('.cab-stage').scrollIntoView({block:'center'})`);
  await b.screenshot('all-screws-installed.png');
  assert.equal(b.errors.length,0);console.log(`All screws: ${types.length} types, ${count} screws, hit targets, individual sizes, removal/reinsertion, sounds, animations, live persistence, keyboard and touch passed.`);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
