'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const output=path.resolve(__dirname,'../build/qa-door-motion');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];await page.setViewportSize({width:1366,height:900});await page.goto(b.origin);
  await b.evaluate(`(()=>{const p={id:'doors',routeId:'EF3H',line:'3',tram:'615',stops:allRouteStops('EF3H')};state.active={id:'door-run',plan:p,position:1,startedAtEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,status:'running'};window.effectCalls=[];window.AndroidAnnouncements={playMechanicalWithCompletion:(path,kind,id)=>queueMicrotask(()=>onNativeCabMechanicalEnd(id,true)),playEffect:(id,ticket)=>effectCalls.push({id,ticket,closed:document.querySelector('[data-door-indicator=closed]').classList.contains('is-lit'),blinking:document.querySelector('[data-door-indicator=open]').classList.contains('is-blinking')}),playSequence:()=>{},stop:()=>{}};showView('driver')})()`);
  const lamps=()=>b.evaluate("({open:document.querySelector('[data-door-indicator=open]').classList.contains('is-lit'),closed:document.querySelector('[data-door-indicator=closed]').classList.contains('is-lit'),blinking:document.querySelector('[data-door-indicator=open]').classList.contains('is-blinking')})");
  const complete=success=>b.evaluate('onNativeDriverSoundEnd(effectCalls.at(-1).ticket,'+success+')');
  await page.locator('#doorBtn').click();assert.deepEqual(await lamps(),{open:true,closed:false,blinking:true});assert(await page.locator('#doorBtn').isDisabled());assert(await page.locator('#nextStopBtn').isDisabled());
  await b.evaluate('toggleDoors()');assert.equal(await b.evaluate('effectCalls.length'),1);
  assert.equal(await page.locator('[data-door-indicator=open] .cab-face').evaluate(e=>getComputedStyle(e).animationName),'cab-door-blink');
  await complete(true);await page.waitForFunction(()=>!doorMotion);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:false});
  await page.locator('#doorBtn').click();assert.deepEqual(await lamps(),{open:true,closed:false,blinking:true});assert.equal(await b.evaluate('state.active.doorsOpen'),true);
  await b.evaluate('nextStop();onNativeDriverSoundEnd(effectCalls[0].ticket,true)');assert.equal(await b.evaluate('state.active.position'),1);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:true});
  await page.screenshot({path:path.join(output,'closing.png')});
  await complete(true);await page.waitForFunction(()=>!doorMotion);assert.deepEqual(await lamps(),{open:false,closed:true,blinking:false});assert.equal(await b.evaluate('state.active.doorsOpen'),false);
  assert.deepEqual(await b.evaluate('effectCalls.map(c=>c.id)'),['door_open','door_close','door_closed']);
  assert.deepEqual(await b.evaluate('({closed:effectCalls.at(-1).closed,blinking:effectCalls.at(-1).blinking})'),{closed:true,blinking:false});
  assert.equal(await page.locator('#doorBtn').isDisabled(),false);
  // A cancelled/failed close must not falsely report closed doors.
  await page.locator('#doorBtn').click();await complete(true);await page.waitForFunction(()=>!doorMotion);await page.locator('#doorBtn').click();await b.evaluate('stopDriverSound()');await page.waitForFunction(()=>!doorMotion);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:false});
  await b.evaluate('onNativeDriverSoundEnd(effectCalls.at(-1).ticket,true)');assert.equal(await b.evaluate('state.active.doorsOpen'),true);
  await page.locator('#doorBtn').click();await complete(false);await page.waitForFunction(()=>!doorMotion);assert.equal(await b.evaluate('state.active.doorsOpen'),true);
  await page.locator('#doorBtn').click();await b.evaluate('openTrafficModal()');await page.waitForFunction(()=>!doorMotion);assert(await page.locator('.traffic-actions').isVisible());await b.evaluate('closeModal()');
  assert.equal(await b.evaluate("effectCalls.filter(c=>c.id==='door_closed').length"),1);
  // Muted operations finish immediately without a permanently blinking lamp.
  await b.evaluate('state.settings.cockpit_muted=true;toggleDoors()');await page.waitForFunction(()=>!doorMotion);assert.deepEqual(await lamps(),{open:false,closed:true,blinking:false});
  await b.evaluate('state.settings.cockpit_muted=false;toggleDoors();showView("home")');await page.waitForFunction(()=>!doorMotion);await b.evaluate('showView("driver")');assert.equal(await b.evaluate('state.active.doorsOpen'),true);
  // Actual Web Audio playback, not a timer inferred from the catalog.
  await b.evaluate('state.active.doorsOpen=false;delete window.AndroidAnnouncements;showView("driver");window.motionStart=performance.now();toggleDoors();void 0');
  await page.waitForTimeout(1000);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:true});
  await page.waitForFunction(()=>!doorMotion,null,{timeout:10000});assert((await b.evaluate('performance.now()-motionStart'))>3900);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:false});
  await b.evaluate(`window.audioStarts=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){audioStarts.push({duration:this.buffer.duration,closed:document.querySelector('[data-door-indicator=closed]').classList.contains('is-lit'),at:performance.now()});return start.apply(this,args)};window.motionStart=performance.now();toggleDoors();void 0`);await page.waitForTimeout(1000);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:true});assert(await page.locator('#nextStopBtn').isDisabled());
  await page.waitForFunction(()=>!doorMotion,null,{timeout:12000});assert((await b.evaluate('performance.now()-motionStart'))>3700);assert.deepEqual(await lamps(),{open:false,closed:true,blinking:false});
  await page.waitForFunction(()=>audioStarts.length===2);
  const starts=await b.evaluate('audioStarts');assert.equal(starts[0].closed,false);assert.equal(starts[1].closed,true);
  assert(Math.abs(starts[0].duration-3.78)<.03);assert(Math.abs(starts[1].duration-3.023)<.03);
  assert(starts[1].at-starts[0].at>=starts[0].duration*1000-50);
  await b.evaluate('toggleDoors();cancelStopAnnouncement()');await page.waitForFunction(()=>!doorMotion);assert.deepEqual(await lamps(),{open:true,closed:false,blinking:false});
  assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['native completion protocol','opening and closing blink','closed lamp only after completion','departure interlock','duplicate clicks','stale completion','cancellation and failure','mute and navigation','real complete Web Audio playback']},null,2));console.log('Door motion checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
