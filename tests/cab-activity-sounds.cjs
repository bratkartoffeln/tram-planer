'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-activity-sounds'));
 try{
  await b.navigate();
  await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');openVehicleBundlePreview('tramlink');window.effects=[];window.mechanics=[];window.AndroidAnnouncements={playEffect:(id,ticket)=>effects.push({id,ticket}),playEffectAsset:(path,id,ticket)=>effects.push({path,id,ticket}),playMechanical:(path,kind)=>mechanics.push({path,kind}),playSequence:()=>{},stop:()=>{},stopMechanical:()=>{}}`);
  const assign=async(key,action,sound,position=0)=>b.evaluate(`if(!cabLayoutAllowed())toggleCabLayoutEditor();openCabControlMenu(${JSON.stringify(key)});document.querySelector('[data-cab-position="${position}"]').value=${JSON.stringify(action)};document.querySelector('[data-cab-sound-position="${position}"]').value=${JSON.stringify(sound)};saveCabReserveBinding();toggleCabLayoutEditor();effects=[];mechanics=[]`);
  await assign('traffic','traffic','effect:passenger');
  await b.evaluate(`document.querySelector('[data-cab-control="traffic"]').click()`);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['passenger']);
  assert.deepEqual(await b.evaluate('mechanics'),[]);
  await b.evaluate('onNativeDriverSoundEnd(effects.at(-1).ticket,true)');
  await assign('traffic','traffic','none');
  await b.evaluate(`document.querySelector('[data-cab-control="traffic"]').click()`);
  assert.deepEqual(await b.evaluate('effects'),[]);
  await assign('traffic','traffic','');
  await b.evaluate(`document.querySelector('[data-cab-control="traffic"]').click()`);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['traffic']);
  await b.evaluate('onNativeDriverSoundEnd(effects.at(-1).ticket,true)');
  // Each rotary position stores and uses its own activity sound.
  await assign('rotary-0','traffic','effect:back',1);
  await b.evaluate(`document.getElementById('cabRotary0').click()`);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['back']);
  await b.evaluate('onNativeDriverSoundEnd(effects.at(-1).ticket,true)');
  // A custom door activity controls motion completion, without the old ding.
  await assign('doors','doors','effect:passenger');
  await b.evaluate(`document.getElementById('doorBtn').click()`);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['passenger']);
  assert.equal(await b.evaluate('vehiclePreviewDoorsOpen'),false);
  await b.evaluate('onNativeDriverSoundEnd(effects.at(-1).ticket,true)');
  assert.equal(await b.evaluate('vehiclePreviewDoorsOpen'),true);
  await b.evaluate(`effects=[];document.getElementById('doorBtn').click();onNativeDriverSoundEnd(effects.at(-1).ticket,true)`);
  assert.equal(await b.evaluate('vehiclePreviewDoorsOpen'),false);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['passenger']);
  // Saved settings also replace the live trip's effect and preserve door state.
  await b.evaluate(`closeModal();state.settings.dev_mode=false;state.active={id:'activity-trip',plan:{line:'3',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()};showView('driver');effects=[];document.getElementById('doorBtn').click()`);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['passenger']);
  assert.equal(await b.evaluate('!!doorMotion'),true);
  await b.evaluate('onNativeDriverSoundEnd(effects.at(-1).ticket,true)');
  assert.equal(await b.evaluate('doorMotion'),null);
  assert.equal(await b.evaluate('state.active.doorsOpen'),true);
  await b.evaluate(`effects=[];document.getElementById('doorBtn').click();onNativeDriverSoundEnd(effects.at(-1).ticket,true)`);
  assert.equal(await b.evaluate('state.active.doorsOpen'),false);
  assert.deepEqual(await b.evaluate('effects.map(e=>e.id)'),['passenger']);
  assert.equal(b.errors.length,0);
  console.log('Activity sounds: replacement, mute, default, rotary positions, preview/live door completion and no duplicate ding passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
