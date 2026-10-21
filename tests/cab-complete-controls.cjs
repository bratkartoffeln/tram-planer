'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-complete-controls'));
 try{
  await b.navigate();await b.evaluate(`state.settings.dev_mode=true;showView('vehicles')`);
  for(const type of ['combino-basic','tramlink','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)});toggleCabLayoutEditor()`);
   const keys=await b.evaluate(`[...cabLayoutEditor.stage.querySelectorAll('.cab-button,[data-cab-reserve]')].map(cabControlKey)`);
   for(const key of keys){
    await b.evaluate(`openCabControlMenu(${JSON.stringify(key)})`);
    assert(await b.evaluate(`!!document.querySelector('[data-cab-position]')&&!!document.getElementById('cabReserveText')&&!!document.getElementById('cabReserveIcon')&&!!document.getElementById('cabControlMode')`),type+' '+key);
   }
  }
  await b.evaluate(`openVehicleBundlePreview('tramlink');toggleCabLayoutEditor();openCabControlMenu('passenger');document.getElementById('cabReserveText').value='Displaytext';saveCabReserveBinding()`);
  assert.equal(await b.evaluate(`document.querySelector('[data-cab-control=passenger] .cab-label').textContent`),'Displaytext');
  await b.evaluate('undoCabLayout()');assert.equal(await b.evaluate(`document.querySelector('[data-cab-control=passenger] .cab-label').textContent`),'Fahrgastinfo');
  // A predefined button can change function, text, icon, sound and mode.
  await b.evaluate(`openVehicleBundlePreview('combino-basic');toggleCabLayoutEditor();openCabControlMenu('next');document.querySelector('[data-cab-position]').value='traffic';document.getElementById('cabReserveText').value='Meldung';document.getElementById('cabReserveIcon').value='traffic';document.querySelector('[data-cab-sound-position]').value='effect:passenger';document.getElementById('cabControlMode').value='momentary';saveCabReserveBinding()`);
  const exported=await b.evaluate('cabLayoutExportData()');assert.equal(exported.cab.layout['control-next'].action,'traffic');
  assert.equal(await b.evaluate(`document.querySelector('#nextStopBtn .cab-label').textContent`),'Meldung');
  assert.equal(await b.evaluate(`document.querySelector('#nextStopBtn path').getAttribute('d')===CAB_ICONS.traffic`),true);
  // Native completion callbacks hold both follow sounds until release finishes.
  await b.evaluate(`toggleCabLayoutEditor();window.soundEvents=[];window.mechanical=[];window.effects=[];window.AndroidAnnouncements={playMechanicalWithCompletion:(path,kind,id)=>{mechanical.push({path,kind,id});soundEvents.push(kind)},playEffect:(id,ticket)=>{effects.push({id,ticket});soundEvents.push('effect:'+id)},playSequence:()=>{},stop:()=>{},stopMechanical:()=>{}}`);
  const point=await b.evaluate(`(()=>{const n=document.getElementById('nextStopBtn');n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  const pointer=async down=>b.cdp('Input.dispatchMouseEvent',{type:down?'mousePressed':'mouseReleased',button:'left',buttons:down?1:0,clickCount:1,...point});
  await pointer(true);assert.deepEqual(await b.evaluate('effects'),[]);
  await pointer(false);
  assert.equal(await b.evaluate(`mechanical.at(-1).kind`),'up');assert.deepEqual(await b.evaluate('effects'),[]);
  const release=await b.evaluate('mechanical.at(-1).id');
  await b.evaluate(`onNativeCabMechanicalEnd(${release},true)`);
  assert.equal(await b.evaluate('effects[0].id'),'traffic');
  assert(await b.evaluate(`mechanical.some(c=>c.path==='audio/effects/passenger.mp3')`));
  await b.evaluate(`onNativeDriverSoundEnd(effects.at(-1).ticket,true);closeModal()`);
  // Reload preserves the complete native-button binding and preview behavior.
  await b.navigate();await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');openVehicleBundlePreview('combino-basic')`);
  assert.equal(await b.evaluate(`document.querySelector('#nextStopBtn .cab-label').textContent`),'Meldung');
  // A view change cancels a queued effect while release audio is pending.
  await b.evaluate(`closeModal();state.active={id:'queued-trip',plan:{line:'3',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('EF3H')},position:1,doorsOpen:false,status:'running',startedAtEpoch:Date.now()};showView('driver');window.effects=[];window.mechanical=[];window.AndroidAnnouncements={playMechanicalWithCompletion:(path,kind,id)=>mechanical.push({path,kind,id}),playEffect:(id,ticket)=>effects.push({id,ticket}),playSequence:()=>{},stop:()=>{}};const cancelledButton=document.getElementById('doorBtn');cancelledButton.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0}));cancelledButton.click();showView('home');onNativeCabMechanicalEnd(mechanical.at(-1).id,true)`);
  assert.deepEqual(await b.evaluate('effects'),[]);assert.equal(await b.evaluate('doorMotion'),null);
  await b.evaluate(`delete window.AndroidAnnouncements;showView('vehicles');openVehicleBundlePreview('combino-basic')`);
  // Real Web Audio: follow playback starts after the release buffer ends.
  await b.evaluate(`window.starts=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){starts.push({context:this.context===cabAudioContext?'mechanical':'effect',duration:this.buffer.duration,at:performance.now()});return start.apply(this,args)};const n=document.getElementById('nextStopBtn');n.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0}));n.click()`);
  for(let i=0;i<80&&!await b.evaluate(`starts.some(s=>s.context==='effect')`);i++)await b.delay(50);
  const starts=await b.evaluate('starts'),releaseStart=starts.find(s=>s.context==='mechanical'),follow=starts.find(s=>s.context==='effect');assert(releaseStart&&follow);
  assert(follow.at>=releaseStart.at+releaseStart.duration*1000-20,JSON.stringify(starts));
  assert.equal(b.errors.length,0);console.log('Complete controls: 8 cab families, predefined and reserve editors, binding export/persistence, native release completion and Web Audio ordering passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
