'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
const down='vehicle-bundles/default/audio/push-button.mp3',up='vehicle-bundles/default/audio/release-button.mp3';
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-button-sounds'));
 try{
  await b.navigate();
  await b.evaluate(`window.buttonCalls=[];window.synthCalls=[];window.AndroidAnnouncements={playMechanical:(path,kind)=>buttonCalls.push({path,kind}),stopMechanical:()=>{},stop:()=>{}};playCabMechanicalSynth=kind=>synthCalls.push(kind);showView('vehicles');window.pressRelease=n=>{n.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0}))}`);
  const types=await b.evaluate('ERFURT_VEHICLE_CATALOG.types.map(t=>t.id)');let controls=0;
  for(const type of types){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)})`);
   assert.deepEqual(await b.evaluate('[vehicleBundlePreview.sounds.mechanical.down,vehicleBundlePreview.sounds.mechanical.up]'),[down,up]);
   const result=await b.evaluate(`(()=>{const nodes=[...document.querySelectorAll('.vehicle-bundle-modal .cab-button:not(.cab-emergency),.vehicle-bundle-modal .cab-spare,.vehicle-bundle-modal .cab-accessory-button')];return nodes.map(n=>{buttonCalls=[];pressRelease(n);pressRelease(n);return {id:n.id,calls:[...buttonCalls]}})})()`);
   for(const {id,calls} of result)assert.deepEqual(calls,[{path:down,kind:'down'},{path:up,kind:'up'},{path:down,kind:'down'},{path:up,kind:'up'}],type+' '+id);
   controls+=result.length;
   const latched=await b.evaluate(`(()=>{vehicleBundlePreview=clone(vehicleBundlePreview);const stage=document.querySelector('.vehicle-bundle-modal .cab-stage'),nodes=[...stage.querySelectorAll('.cab-button:not(.cab-emergency),.cab-spare,.cab-accessory-button')];for(const n of nodes){vehicleBundlePreview.cab.layout??={};vehicleBundlePreview.cab.layout['actuation-'+cabControlKey(n)]={mode:'latching'};n.onclick=()=>{}}applyCabLayoutToStage(stage,vehicleBundlePreview);return nodes.map(n=>{buttonCalls=[];pressRelease(n);const first=buttonCalls.length;n.click();pressRelease(n);const second=buttonCalls.length;n.click();return {id:n.id,calls:[...buttonCalls],first,second,on:cabModeIsOn(n)}})})()`);
   for(const {id,calls,first,second,on} of latched){assert.deepEqual(calls,[{path:down,kind:'down'},{path:up,kind:'up'}],type+' latching '+id);assert.equal(first,1);assert.equal(second,2);assert.equal(on,false);}

   await b.evaluate(`buttonCalls=[];synthCalls=[];pressRelease(document.getElementById('emergencyBtn'))`);
   assert.deepEqual(await b.evaluate('buttonCalls'),[],type+' emergency must not use button recordings');
   assert.deepEqual(await b.evaluate('synthCalls'),['latch']);
  }
  // Explicit actuation choices and mute still override the defaults.
  await b.evaluate(`openVehicleBundlePreview('combino-basic');vehicleBundlePreview=clone(vehicleBundlePreview);vehicleBundlePreview.cab.layout={'actuation-spare-0':{press:'mechanical:rotary',release:'none'}};applyCabLayoutToStage(document.querySelector('.vehicle-bundle-modal .cab-stage'),vehicleBundlePreview);buttonCalls=[];pressRelease(document.querySelector('[data-cab-reserve="spare-0"]'))`);
  assert.deepEqual(await b.evaluate('buttonCalls'),[{path:'vehicle-bundles/default/audio/switch.mp3',kind:'rotary'}]);
  await b.evaluate(`state.settings.cockpit_muted=true;buttonCalls=[];pressRelease(document.getElementById('nextStopBtn'))`);assert.deepEqual(await b.evaluate('buttonCalls'),[]);
  // The active trip uses the same paths without the preview or editor.
  await b.evaluate(`closeModal();state.settings.cockpit_muted=false;state.active={id:'button-trip',plan:{line:'3',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()};showView('driver');buttonCalls=[];pressRelease(document.getElementById('nextStopBtn'))`);
  assert.deepEqual(await b.evaluate('buttonCalls'),[{path:down,kind:'down'},{path:up,kind:'up'}]);
  // Actual Web Audio decoding and playback of both provided recordings.
  await b.evaluate(`delete window.AndroidAnnouncements;window.buttonStarts=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){buttonStarts.push(this.buffer.duration);return start.apply(this,args)};void playCabMechanicalAsset(${JSON.stringify(down)},'down');void playCabMechanicalAsset(${JSON.stringify(up)},'up')`);
  for(let i=0;i<40&&(await b.evaluate('buttonStarts.length'))<2;i++)await b.delay(50);
  assert.equal(await b.evaluate('buttonStarts.length'),2);assert((await b.evaluate('buttonStarts')).every(d=>d>0&&d<1));
  assert.equal(b.errors.length,0);console.log(`Button sounds: ${types.length} types, ${controls} pushbuttons, press/release, Not-Aus exclusion, overrides, mute, active trip and real MP3 playback passed.`);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
