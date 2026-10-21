'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-vehicle-previews');
(async()=>{
 const b=await session(root,output);
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate(`state.active={id:'unchanged-trip',plan:{id:'unchanged-plan',line:'3',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running'};showView('driver');cabLooseScrews.add(0);showView('vehicles');setVehicleCatalog(true)`);
  const original=await b.evaluate('JSON.stringify(state)'),screwTrip=await b.evaluate('cabScrewTripId');
  assert.equal(await b.evaluate('document.querySelectorAll("[data-cab-preview]").length'),23);
  const types=await b.evaluate('ERFURT_VEHICLE_CATALOG.types.map(t=>t.id)');
  const families=new Set();
  for(const type of types){
   await b.evaluate('openVehicleBundlePreview('+JSON.stringify(type)+')');
   const result=await b.evaluate(`(()=>{const bundle=vehicleBundlePreview,p=document.querySelector('.vehicle-bundle-modal');return {id:bundle.id,image:bundle.cab.image,screws:p.querySelectorAll('.cab-screw').length,buttons:p.querySelectorAll('.cab-button').length,sounds:p.querySelectorAll('[data-preview-action]').length,description:bundle.presentation.description,variant:bundle.presentation.variant,sourceCount:p.querySelectorAll('a[href^="https://"]').length,missing:p.querySelectorAll('.cab-screw.is-missing').length,photo:p.querySelector('.cab-panel-front')!==null}})()`);
   // Cached images may still finish decoding after the DOM is built.
   await b.evaluate('Promise.all([...document.querySelectorAll(".vehicle-bundle-modal img")].map(i=>i.decode()))');
   assert.equal(result.id,type);assert.equal(result.screws,4);assert.equal(result.buttons,8);assert.equal(result.sounds,8);assert(result.photo);assert(result.sourceCount);assert.equal(result.missing,0);
   if(type.includes('trailer')||type.startsWith('b2'))assert(result.description.includes('kein eigenes Fahrerpult'));
   if(!families.has(result.image)){families.add(result.image);await b.screenshot('preview-'+type+'.png');}
   await b.evaluate('closeModal()');
   assert.equal(await b.evaluate('JSON.stringify(state)'),original);assert.equal(await b.evaluate('cabScrewTripId'),screwTrip);assert.equal(await b.evaluate('cabLooseScrews.has(0)'),true);
  }
  assert.equal(families.size,8);
  // All seven effects use the preview bundle even while another vehicle is active.
  await b.evaluate(`openVehicleBundlePreview('kt4dc');vehicleBundlePreview=clone(vehicleBundlePreview);vehicleBundlePreview.sounds.effects.door_open='audio/effects/back.mp3';window.previewCalls=[];window.AndroidAnnouncements={playSequence:(name,paths)=>previewCalls.push({sequence:name,paths:JSON.parse(paths)}),playEffect:(id,ticket)=>previewCalls.push({id,ticket}),playEffectAsset:(path,id,ticket)=>previewCalls.push({path,id,ticket}),stop:()=>previewCalls.push({stop:true}),stopMechanical:()=>previewCalls.push({mechanicalStop:true})};document.querySelector('[data-preview-action="doors"]').click()`);
  assert.equal(await b.evaluate('previewCalls.find(c=>c.id).path'),'audio/effects/back.mp3');
  assert.equal(await b.evaluate('state.active.plan.vehicleTypeId'),'tramlink');
  assert.equal(await b.evaluate('document.getElementById("doorBtn").disabled'),true);
  await b.evaluate('onNativeDriverSoundEnd(previewCalls.findLast(c=>c.id).ticket,true)');
  assert.equal(await b.evaluate('vehiclePreviewDoorsOpen'),true);
  for(const id of ['door_close','emergency','traffic','passenger','finish','back']){
   await b.evaluate('document.querySelector(\'[data-preview-action="'+(id==='door_close'?'doors':id)+'"]\').click()');
   assert.equal(await b.evaluate('previewCalls.findLast(c=>c.id).id'),id);
   await b.evaluate('onNativeDriverSoundEnd(previewCalls.findLast(c=>c.id).ticket,true)');
   assert.equal(await b.evaluate('document.getElementById("vehicleSoundStatus").textContent'),'Hörprobe beendet.');
  }
  assert.equal(await b.evaluate('vehiclePreviewDoorsOpen'),false);
  await b.evaluate('document.querySelector(\'[data-preview-action="next"]\').click()');
  assert.equal(await b.evaluate('previewCalls.findLast(c=>c.sequence).sequence'),'Anger');
  assert(await b.evaluate('previewCalls.findLast(c=>c.sequence).paths.includes(recordedStopPath("Anger"))'));
  // Preview screws have their own state and do not remove a screw in the trip.
  await b.evaluate('toggleCabScrew(2)');assert.equal(await b.evaluate('vehiclePreviewLooseScrews.has(2)'),true);assert.equal(await b.evaluate('cabLooseScrews.has(2)'),false);
  await b.evaluate('void previewVehicleSound("door_open");closeModal()');assert.equal(await b.evaluate('vehicleBundlePreview'),null);
  assert(await b.evaluate('previewCalls.slice(-2).some(c=>c.stop===true)&&previewCalls.slice(-2).some(c=>c.mechanicalStop===true)'));
  await b.evaluate('openVehicleBundlePreview("g4-65");void previewVehicleSound("door_open");showView("network")');assert.equal(await b.evaluate('vehicleBundlePreview'),null);
  assert.equal(await b.evaluate('JSON.stringify(state)'),original);
  await b.evaluate('delete window.AndroidAnnouncements;showView("vehicles");openVehicleBundlePreview("combino-basic")');
  // Real Web Audio decode and completion through the explicit bundle path.
  await b.evaluate('previewVehicleCabAction("passenger")');assert.equal(await b.evaluate('document.getElementById("vehicleSoundStatus").textContent'),'Hörprobe beendet.');
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
  await b.screenshot('preview-mobile.png');
  await b.evaluate('closeModal();showView("driver")');
  for(const type of ['tramlink','combino-basic','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate(`state.active.plan.vehicleTypeId=${JSON.stringify(type)};showView('driver');toggleCabScrew(1)`);
   assert.equal(await b.evaluate('document.getElementById("cabScrew1").classList.contains("is-loose")'),true);
   await b.evaluate('document.querySelector("#cabScrew1 .cab-screw-face").dispatchEvent(new Event("animationend"));toggleCabScrew(1)');
   assert.equal(await b.evaluate('document.getElementById("cabScrew1").classList.contains("is-tightening")'),true);
   await b.evaluate('document.querySelector("#cabScrew1 .cab-screw-face").dispatchEvent(new Event("animationend"))');
  }
  await b.evaluate('showView("vehicles");state.settings.cockpit_muted=true;openVehicleBundlePreview("t2d")');
  assert.equal(await b.evaluate('[...document.querySelectorAll("[data-preview-action]")].every(b=>b.disabled)'),true);
  assert.equal(b.errors.length,0);console.log('Vehicle previews: 23 types, 8 cabs, explicit audio, lifecycle, mobile and screw checks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
