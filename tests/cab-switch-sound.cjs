'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,'../app/src/main/assets'),sound='vehicle-bundles/default/audio/switch.mp3';
(async()=>{
 const b=await session(root,path.resolve(__dirname,'../build/qa-switch-sound'));
 try{
  await b.navigate();
  await b.evaluate(`window.switchCalls=[];window.AndroidAnnouncements={playMechanical:(path,kind)=>switchCalls.push({path,kind}),stopMechanical:()=>{},stop:()=>{}};showView('vehicles')`);
  const types=await b.evaluate('ERFURT_VEHICLE_CATALOG.types.map(t=>t.id)');
  let controls=0;
  for(const type of types){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)});window.switchCalls=[]`);
   assert.equal(await b.evaluate('vehicleBundlePreview.sounds.mechanical.rotary'),sound,type);
   const selectors=await b.evaluate(`[...document.querySelectorAll('.vehicle-bundle-modal .cab-rotary,.vehicle-bundle-modal .cab-accessory-lever')].map(n=>'#'+n.id)`);
   for(const selector of selectors){
    await b.evaluate(`switchCalls=[];document.querySelector(${JSON.stringify(selector)}).click();document.querySelector(${JSON.stringify(selector)}).click()`);
    assert.deepEqual(await b.evaluate('switchCalls'),[{path:sound,kind:'rotary'},{path:sound,kind:'rotary'}],type+' '+selector);controls++;
   }
  }
  // An ordinary button configured as an on/off switch clicks once per change.
  await b.evaluate(`openVehicleBundlePreview('combino-basic');vehicleBundlePreview=clone(vehicleBundlePreview);vehicleBundlePreview.cab.layout={'actuation-spare-0':{mode:'latching'}};applyCabLayoutToStage(document.querySelector('.vehicle-bundle-modal .cab-stage'),vehicleBundlePreview);switchCalls=[]`);
  const click=()=>b.evaluate(`(()=>{const n=document.querySelector('[data-cab-reserve="spare-0"]');n.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0}));n.click()})()`);
  await click();await click();assert.equal(await b.evaluate('switchCalls.length'),2);
  assert.deepEqual(await b.evaluate('switchCalls'),[{path:'vehicle-bundles/default/audio/push-button.mp3',kind:'down'},{path:'vehicle-bundles/default/audio/release-button.mp3',kind:'up'}]);
  // Explicit sound choices and mute override the shared standard.
  await b.evaluate(`window.synthCalls=[];const synth=playCabMechanicalSynth;playCabMechanicalSynth=kind=>{synthCalls.push(kind);synth(kind)};vehicleBundlePreview.cab.layout['actuation-spare-0'].press='mechanical:up';applyCabLayoutToStage(document.querySelector('.vehicle-bundle-modal .cab-stage'),vehicleBundlePreview);switchCalls=[]`);
  await click();assert.deepEqual(await b.evaluate('switchCalls'),[{path:'vehicle-bundles/default/audio/release-button.mp3',kind:'up'}]);assert.deepEqual(await b.evaluate('synthCalls'),[]);
  await b.evaluate(`vehicleBundlePreview.cab.layout['actuation-spare-0'].press='none';vehicleBundlePreview.cab.layout['actuation-spare-0'].release='none';switchCalls=[];applyCabLayoutToStage(document.querySelector('.vehicle-bundle-modal .cab-stage'),vehicleBundlePreview)`);
  await click();assert.equal(await b.evaluate('switchCalls.length'),0);
  await b.evaluate(`vehicleBundlePreview.cab.layout['actuation-spare-0'].press='';applyCabLayoutToStage(document.querySelector('.vehicle-bundle-modal .cab-stage'),vehicleBundlePreview);state.settings.cockpit_muted=true`);
  await click();assert.equal(await b.evaluate('switchCalls.length'),0);
  // Decode and play the actual MP3 through the independent Web Audio channel.
  await b.evaluate(`state.settings.cockpit_muted=false;delete window.AndroidAnnouncements;window.switchStarts=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){switchStarts.push(this.buffer.duration);return start.apply(this,args)};void playCabMechanicalAsset(${JSON.stringify(sound)},'rotary')`);
  for(let i=0;i<40&&!await b.evaluate('switchStarts.length');i++)await b.delay(50);
  const duration=await b.evaluate('switchStarts[0]');assert(duration>.2&&duration<.4);
  assert(JSON.parse(fs.readFileSync(path.join(root,'vehicle-bundle-assets.json'))).includes(sound));
  assert.equal(b.errors.length,0);console.log(`Switch sound: ${types.length} types, ${controls} rotary/lever controls, both directions, latching buttons, overrides, mute and real MP3 playback passed.`);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
