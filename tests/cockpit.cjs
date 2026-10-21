'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const crypto=require('node:crypto');
const session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-cockpit');
async function main(){
 const b=await session(root,output);
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate(`(()=>{const p={id:'plan-cab-test',routeId:'EF5H',routeCode:'5',routeName:'Zoopark → Hauptbahnhof',line:'5',tram:'615',stops:allRouteStops('EF5H'),createdAt:Date.now()};state.plans=[p];state.active={id:'trip-cab-test',plan:clone(p),departure:'10:00',position:1,startedAtEpoch:Date.now(),actualStartEpoch:Date.now(),positionReachedAt:Date.now(),pauseEndEpoch:null,doorsOpen:false,trafficDelayMin:0,status:'running'};saveState();showView('driver');})()`);
  assert.equal(await b.evaluate('document.querySelectorAll(".cab-controls button").length'),20);
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".cab-face")).borderRadius'),'50%');
  assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".cab-controls")).display'),'grid');
  assert.deepEqual(await b.evaluate("buildStopAnnouncement('Lutherkirche/SWE')"),['audio/chimes/ding_dong.mp3','audio/phrases/naechste_haltestelle.mp3','audio/stops/lutherkirche_stadtwerke.mp3']);
  assert.deepEqual(await b.evaluate("buildStopAnnouncement('Boyneburgufer')"),['audio/chimes/ding_dong.mp3','audio/phrases/naechste_haltestelle.mp3','audio/stops/boyneburg_ufer.mp3']);
  assert.deepEqual(await b.evaluate("buildStopAnnouncement('Stadtmuseum/Kaisersaal')"),['audio/chimes/ding_dong.mp3','audio/phrases/naechste_haltestelle.mp3','audio/stops/stadtmuseum_kaisersaal.mp3']);
  assert.equal(await b.evaluate('document.querySelectorAll(".cab-screw").length'),4);
  assert.equal(await b.evaluate('document.querySelectorAll(".cab-spare").length'),10);
  assert.equal(await b.evaluate('document.querySelectorAll(".cab-photo").length'),0);
  await b.evaluate('document.querySelector(".cab-panel-photo").decode()');assert.equal(await b.evaluate('document.querySelector(".cab-panel-photo").naturalWidth'),1681);
  await b.evaluate("showPlan(state.plans[0].id);document.getElementById('departureNowButton').click()");
  assert.equal(await b.evaluate('document.getElementById("tripDepartureInput").value'),await b.evaluate('fmtTime(Date.now())'));
  assert.equal(await b.evaluate('document.getElementById("startTripButton").disabled'),false);
  assert.equal(await b.evaluate("'departure' in state.plans[0]"),false);await b.evaluate("showView('driver')");
  await b.evaluate("state.active.position=12;showView('driver')");
  assert.equal(await b.evaluate("(()=>{const m=document.getElementById('driverRouteMap'),r=m.querySelector('.current').getBoundingClientRect(),b=m.getBoundingClientRect();return r.top>=b.top-1&&r.bottom<=b.bottom+1&&m.scrollTop>0})()"),true);
  await b.evaluate("document.getElementById('driverRouteMap').scrollTop=0;updateDriverLive()");assert.equal(await b.evaluate('document.getElementById("driverRouteMap").scrollTop'),0);
  await b.evaluate("driverPrevious()");assert.equal(await b.evaluate("(()=>{const m=document.getElementById('driverRouteMap'),r=m.querySelector('.current').getBoundingClientRect(),b=m.getBoundingClientRect();return r.top>=b.top-1&&r.bottom<=b.bottom+1})()"),true);
  await b.evaluate("state.active.position=1;showView('driver')");
  // Decode every bundled effect in the real browser and verify signal levels.
  const levels=await b.evaluate(`(async()=>{const c=new AudioContext(),list=await(await fetch('audio/effects/catalog.json')).json(),result={};for(const item of list){const r=await fetch(item.file);if(!r.ok)throw Error(item.file);const buffer=await c.decodeAudioData(await r.arrayBuffer());let sum=0,peak=0;const data=buffer.getChannelData(0);for(const s of data){sum+=s*s;peak=Math.max(peak,Math.abs(s));}result[item.id]={duration:buffer.duration,rms:Math.sqrt(sum/data.length),peak};}const gong=await c.decodeAudioData(await(await fetch('audio/chimes/ding_dong.mp3')).arrayBuffer());let sum=0;for(const s of gong.getChannelData(0))sum+=s*s;result.gongRms=Math.sqrt(sum/gong.length);await c.close();return result;})()`);
  const catalog=JSON.parse(fs.readFileSync(path.join(root,'audio/effects/catalog.json'),'utf8'));
  assert.equal(catalog.length,7);assert.ok(catalog.every(item=>item.file.endsWith('.mp3')));
  for(const item of catalog)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.file))).digest('hex'),item.sha256,item.id+' checksum');
  const back=catalog.find(item=>item.id==='back');
  if(back.midiNotes){assert.deepEqual(back.midiNotes,[65,58,64,65,67,65,62,58,64]);assert.ok(back.noteCount<=10);}
  assert.equal(fs.readdirSync(path.join(root,'audio/effects')).filter(file=>file.endsWith('.wav')).length,0);
  for(const [id,r]of Object.entries(levels)){if(id==='gongRms')continue;assert.ok(r.duration>1&&r.duration<7,id);assert.ok(r.rms>.001&&r.peak<=1,id);}
  assert.ok(levels.passenger.rms<levels.gongRms*.25);
  await b.evaluate("window.cabEvents=[];window.AndroidAnnouncements={playEffect:(id,ticket)=>{cabEvents.push({name:'Fahrpult: '+id,paths:['audio/effects/'+id+'.mp3']});queueMicrotask(()=>onNativeDriverSoundEnd(ticket,true))},playSequence:(name,json)=>cabEvents.push({name,paths:JSON.parse(json)}),stop:()=>cabEvents.push({stop:true})}");
  async function check(action,id){await b.evaluate(action);assert.equal(await b.evaluate('cabEvents.filter(e=>e.paths).at(-1).paths[0]'),'audio/effects/'+id+'.mp3');}
  await check("document.getElementById('doorBtn').click()",'door_open');assert.equal(await b.evaluate('state.active.doorsOpen'),true);assert.equal(await b.evaluate('document.getElementById("nextStopBtn").disabled'),true);
  await check("document.getElementById('doorBtn').click()",'door_close');assert.equal(await b.evaluate('state.active.doorsOpen'),false);
  await check('openTrafficModal()','traffic');
  for(const width of [1280,390]){
   await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});
   assert.equal(await b.evaluate("(()=>{const r=[...document.querySelectorAll('.traffic-actions button')].map(e=>e.getBoundingClientRect());return r.length===5&&r.every(b=>Math.abs(b.top-r[0].top)<1&&Math.abs(b.height-r[0].height)<1)&&r.at(-1).right<=document.querySelector('.modal').getBoundingClientRect().right})()"),true,'Traffic buttons aligned at '+width);
  }
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  await b.evaluate('applyTraffic(2)');assert.equal(await b.evaluate('state.active.trafficDelayMin'),2);
  await check('openEmergencyModal()','emergency');await b.evaluate('closeModal()');assert.equal(await b.evaluate('state.active.status'),'running');
  await check('openPassengerDisplay()','passenger');await b.evaluate('closeModal()');
  await check('driverPrevious()','back');assert.equal(await b.evaluate('state.active.position'),0);
  const before=await b.evaluate('cabEvents.filter(e=>e.paths).length');await b.evaluate('driverPrevious()');assert.equal(await b.evaluate('cabEvents.filter(e=>e.paths).length'),before);
  await b.evaluate('toggleCockpitSound();toggleDoors()');assert.equal(await b.evaluate('cabEvents.filter(e=>e.paths).length'),before);
  await b.evaluate('toggleDoors();toggleCockpitSound()');
  // Existing announcements still begin after one second and a fast step cancels them.
  await b.evaluate('nextStop();nextStop()');await b.delay(1100);assert.equal(await b.evaluate('cabEvents.filter(e=>e.paths).at(-1).name'),'August-Frölich-Straße');
  await b.evaluate('state.active.position=8;nextStop()');await b.delay(1100);
  assert.equal(await b.evaluate('cabEvents.filter(e=>e.paths).at(-1).name'),'Lutherkirche/SWE');
  assert.deepEqual(await b.evaluate('cabEvents.filter(e=>e.paths).at(-1).paths'),['audio/chimes/ding_dong.mp3','audio/phrases/naechste_haltestelle.mp3','audio/stops/lutherkirche_stadtwerke.mp3']);
  const beforeMissing=await b.evaluate('cabEvents.filter(e=>e.paths).length');
  await b.evaluate("state.active.plan.stops[10].name='Unbekannte Testhaltestelle';nextStop()");await b.delay(1100);
  assert.equal(await b.evaluate('cabEvents.filter(e=>e.paths).length'),beforeMissing);
  assert.equal(await b.evaluate('document.getElementById("toastRoot").textContent.includes("keine Aufnahme")'),true);
  await check('finishTrip(false)','finish');assert.equal(await b.evaluate('state.active'),null);assert.equal(await b.evaluate('state.history.filter(h=>h.type==="FAHRT").length'),1);
  await b.evaluate("closeModal();state.active={id:'trip-shot',plan:clone(state.plans[0]),position:1,departure:'10:00',startedAtEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,status:'running'};showView('driver');document.querySelector('.cab-console').scrollIntoView({block:'center'});");
  await b.screenshot('tablet.png');await b.evaluate("state.settings.dark_mode=true;showView('driver');document.querySelector('.cab-console').scrollIntoView({block:'center'})");await b.screenshot('dark.png');
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await b.evaluate("showView('driver');document.querySelector('.cab-console').scrollIntoView({block:'center'})");assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);await b.screenshot('mobile.png');
  // Real Web Audio playback and replacement; the obsolete request must not start.
  await b.evaluate("delete window.AndroidAnnouncements;window.soundStarts=[];const oldStart=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){soundStarts.push(this.buffer.duration);return oldStart.apply(this,args)};playDriverSound('traffic');playDriverSound('back')");await b.delay(250);
  assert.equal(await b.evaluate('soundStarts.length'),1);assert.ok(Math.abs((await b.evaluate('soundStarts[0]'))-levels.back.duration)<.01);
  await b.evaluate('onNativeAnnouncementPause()');
  await b.evaluate('navigator.serviceWorker.ready.then(()=>true)');await b.delay(500);await b.cdp('Network.enable');await b.cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await b.cdp('Page.reload');await b.delay(500);
  assert.equal(await b.evaluate('typeof renderCabControls'),'function');assert.equal(await b.evaluate("fetch('audio/effects/traffic.mp3').then(r=>r.ok)"),true);assert.equal(b.errors.length,0);
  assert.equal(await b.evaluate("fetch('images/tram-cockpit.jpg').then(r=>r.ok)"),true);
  assert.equal(await b.evaluate("fetch('images/cab-panel-photoreal.webp').then(r=>r.ok)"),true);
  fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,levels,checks:['seven mapped button sounds','door interlock','traffic and history','disabled buttons','mute','one-second stop announcement','real audio decoding and playback','replacement and background cancellation','tablet/dark/mobile layout','offline assets']},null,2));console.log('Cockpit checks passed: '+output);
 }finally{await b.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
