'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-vehicle-bundles');
(async()=>{
 const b=await session(root,output);
 try{
  await b.navigate();
  const result=await b.evaluate(`(()=>{
   const plan={id:'plan-bundle',routeId:'EF3H',line:'3',tram:'801',vehicleId:'vehicle-test',vehicleTypeId:'tramlink',stops:allRouteStops('EF3H')};
   state.vehicles=[{id:'vehicle-test',code:'801',typeId:'tramlink'}];
   state.active={id:'bundle-trip',plan,position:1,startedAtEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,status:'running'};
   const ids=ERFURT_VEHICLE_CATALOG.types.map(type=>getVehicleBundle({vehicleTypeId:type.id}).id);
   const inherited=ids.every(id=>JSON.stringify(VEHICLE_BUNDLES[id].sounds)===JSON.stringify(VEHICLE_BUNDLES.default.sounds));
   const images=new Set(ids.map(id=>VEHICLE_BUNDLES[id].cab.image)).size;
   const screws=ids.every(id=>VEHICLE_BUNDLES[id].cab.screws.length===4);
   const fallback=getVehicleBundle({vehicleTypeId:'future-tram',tram:'801'}).id;
   const legacy=getVehicleBundle({tram:'801'}).id;
   const retained=getVehicleBundle({vehicleTypeId:'kt4d',tram:'801'}).id;
   const custom=clone(VEHICLE_BUNDLES.tramlink);
   custom.cab.buttons.next.x=240;custom.cab.colors.console='#123456';custom.cab.width=2000;
   custom.sounds.effects.door_open='audio/effects/passenger.mp3';
   custom.sounds.mechanical.down='audio/effects/back.mp3';
   window.VEHICLE_BUNDLES={...VEHICLE_BUNDLES,tramlink:custom};
   showView('driver');
   window.bundleCalls=[];window.AndroidAnnouncements={playEffectAsset:(path,id,ticket)=>bundleCalls.push({path,id,ticket}),playEffect:(id,ticket)=>bundleCalls.push({id,ticket}),playMechanical:(path,kind)=>bundleCalls.push({path,kind}),stopMechanical:()=>{},playSequence:()=>{},stop:()=>{}};
   toggleDoors();
   return {ids,inherited,images,screws,fallback,legacy,retained,bundle:document.querySelector('.cab-console').dataset.vehicleBundle,left:document.getElementById('nextStopBtn').style.left,color:getComputedStyle(document.querySelector('.cab-console')).backgroundColor,calls:bundleCalls};
  })()`);
  assert.equal(result.ids.length,23);assert(result.inherited);assert.equal(result.images,8);assert(result.screws);assert.equal(result.fallback,'default');assert.equal(result.legacy,'tramlink');assert.equal(result.retained,'kt4d');assert.equal(result.bundle,'tramlink');assert.equal(result.left,'12%');assert.equal(result.color,'rgb(18, 52, 86)');
  assert.equal(result.calls[0].path,'audio/effects/passenger.mp3');assert.equal(result.calls[0].id,'door_open');
  await b.evaluate('onNativeDriverSoundEnd(bundleCalls[0].ticket,true);playCabMechanical("down")');
  assert.equal(await b.evaluate('bundleCalls.at(-1).kind'),'down');
  // Partial bundles retain the default close sound and door completion protocol.
  await b.evaluate('toggleDoors();void 0');assert.equal(await b.evaluate('bundleCalls.at(-1).id'),'door_close');
  assert.equal(await b.evaluate('!!doorMotion'),true);await b.evaluate('onNativeDriverSoundEnd(bundleCalls.at(-1).ticket,true)');assert.equal(await b.evaluate('!!doorMotion'),false);
  // A missing custom browser sound falls back, and cancelling while loading cannot restart it.
  await b.evaluate('delete window.AndroidAnnouncements;VEHICLE_BUNDLES.tramlink.sounds.effects.passenger="vehicle-bundles/tramlink/audio/missing.mp3";window.effectResult=playDriverSound("passenger")');
  assert.equal(await b.evaluate('effectResult'),true);
  await b.evaluate('state.active.plan.vehicleTypeId="unknown";showView("driver")');
  assert.equal(await b.evaluate('document.querySelector(".cab-console").dataset.vehicleBundle'),'default');
  // All manifests and inherited media are in the generated offline asset list.
  const files=JSON.parse(fs.readFileSync(path.join(root,'vehicle-bundle-assets.json'),'utf8'));
  assert(files.includes('vehicle-bundles/tramlink/bundle.json'));assert(files.includes('images/cab-panel-photoreal.webp'));
  for(const file of files)assert(fs.existsSync(path.join(root,file)),file);
  await b.evaluate('navigator.serviceWorker.ready.then(()=>true)');
  assert.equal(await b.evaluate(`caches.keys().then(async keys=>{const cache=await caches.open(keys.find(key=>key.includes('v6.2.10-vehicle-layouts')));return (await Promise.all(['vehicle-bundles-data.js','vehicle-bundles/tramlink/bundle.json','images/cab-panel-photoreal.webp','updates.js'].map(file=>cache.match('./'+file)))).every(Boolean)})`),true);
  assert.equal(await b.evaluate(`caches.keys().then(async keys=>{const cache=await caches.open(keys.find(key=>key.includes('v6.2.10-vehicle-layouts')));return (await Promise.all([...new Set(Object.values(VEHICLE_BUNDLES).map(b=>b.cab.image)),'vehicle-previews.js'].map(file=>cache.match('./'+file)))).every(Boolean)})`),true);
  await b.cdp('Network.enable');await b.cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await b.navigate();
  assert.equal(await b.evaluate('getVehicleBundle({vehicleTypeId:"tramlink"}).id'),'tramlink');
  assert.equal(await b.evaluate('fetch("vehicle-bundles/tramlink/bundle.json").then(r=>r.ok)'),true);
  assert.equal(await b.evaluate('fetch("vehicle-bundles/family-tramlink/panel-front.webp").then(r=>r.ok)'),true);
  assert.equal(b.errors.length,0);console.log('Vehicle bundle checks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
