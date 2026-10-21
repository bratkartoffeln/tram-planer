'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-cab-extras');
(async()=>{
 const b=await session(root,output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];await page.setViewportSize({width:1366,height:900});await page.goto(b.origin);
  await b.evaluate(`(()=>{const p={id:'plan-extra-test',routeId:'W2D',routeCode:'W2D',routeName:ROUTES.W2D.name,line:'2',tram:'801',stops:allRouteStops('W2D'),createdAt:1};state.plans=[p];state.active={id:'run-extra-test',plan:clone(p),position:1,departure:'10:00',startedAtEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,status:'running'};window.AndroidDisplay={setImmersive:()=>{}};window.AndroidAnnouncements={playEffect:(id,ticket)=>queueMicrotask(()=>onNativeDriverSoundEnd(ticket,true)),playSequence:()=>{},stop:()=>{}};showView('driver');toggleCabFullscreen();window.screwAudio=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){if(this.context===cabAudioContext)screwAudio.push(this.buffer.duration);return start.apply(this,args)}})()`);
  assert.equal(await page.locator('.cab-lamp').count(),0);assert.equal(await page.locator('.cab-door-indicator').count(),2);assert.equal(await page.locator('.cab-spare').count(),10);
  assert.equal(await page.locator('[data-door-indicator="closed"]').evaluate(el=>el.classList.contains('is-lit')),true);
  await page.locator('#doorBtn').click();assert.equal(await page.locator('[data-door-indicator="open"]').evaluate(el=>el.classList.contains('is-lit')),true);assert.equal(await page.locator('[data-door-indicator="closed"]').evaluate(el=>el.classList.contains('is-lit')),false);assert(await page.locator('#nextStopBtn').isDisabled());
  await page.screenshot({path:path.join(output,'doors-open.png')});await page.locator('#doorBtn').click();
  // Photo-derived cap centers and geometric SVG centers, independent of viewport scaling.
  for(const [selector,x,y] of [['#cabFullscreenBtn',626,749],['.cab-amber',871,748],['.cab-red:not(.cab-emergency)',1493,748]]){
   const stage=await page.locator('.cab-stage').boundingBox(),button=await page.locator(selector).boundingBox(),symbol=await page.locator(selector+' svg path').boundingBox();
   assert(Math.abs((button.x+button.width/2-stage.x)/stage.width*1681-x)<.1);assert(Math.abs((button.y+button.height/2-stage.y)/stage.height*936-y)<.1);
   assert(Math.abs(symbol.x+symbol.width/2-button.x-button.width/2)<.6);assert(Math.abs(symbol.y+symbol.height/2-button.y-button.height/2)<.6);
  }
  const original=await b.evaluate('clone(state.active)');await b.evaluate('screwAudio=[]');
  assert.equal(await page.locator('.cab-rotary').count(),2);
  for(const degrees of [90,180,270,360]){
   await page.locator('#cabRotary0').click();await page.waitForTimeout(220);
   assert.equal(await page.locator('#cabRotary0').evaluate(el=>el.style.getPropertyValue('--rotary-angle')),degrees+'deg');
   const matrix=await page.locator('#cabRotary0 .cab-rotary-turn').evaluate(el=>{const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return [m.a,m.b]});
   assert(Math.abs(matrix[0]-Math.cos(degrees*Math.PI/180))<.001);assert(Math.abs(matrix[1]-Math.sin(degrees*Math.PI/180))<.001);
   if(degrees===90)await page.screenshot({path:path.join(output,'rotary-clockwise.png')});
  }
  assert.deepEqual(await b.evaluate('screwAudio'),[.24,.24,.24,.24]);
  assert((await page.locator('#cabRotary0').getAttribute('aria-label')).endsWith('0°'));assert.equal(await b.evaluate('cabRotaryTurns[1]'),0);
  await page.locator('#cabRotary1').press('Enter');await page.locator('#cabRotary1').press('Space');assert.equal(await b.evaluate('cabRotaryTurns[1]'),2);
  await b.evaluate('showView("driver")');assert.equal(await page.locator('#cabRotary0').evaluate(el=>el.style.getPropertyValue('--rotary-angle')),'360deg');assert.equal(await page.locator('#cabRotary1').evaluate(el=>el.style.getPropertyValue('--rotary-angle')),'180deg');
  const box=await page.locator('#cabRotary1').boundingBox();await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await b.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await b.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>cabRotaryTurns[1]===3);await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});assert.deepEqual(await b.evaluate('clone(state.active)'),original);
  await b.evaluate('screwAudio=[]');
  await page.locator('#cabScrew0').click();assert.equal(await b.evaluate('cabLooseScrews.size'),0);
  await page.locator('#cabScrew0').dblclick();assert.equal(await b.evaluate('cabLooseScrews.has(0)'),true);assert.deepEqual(await b.evaluate('screwAudio'),[1.65]);
  const motion=await page.locator('#cabScrew0 .cab-screw-face').evaluate(el=>({name:getComputedStyle(el).animationName,duration:getComputedStyle(el).animationDuration}));assert.deepEqual(motion,{name:'cab-screw-drop',duration:'1.5s'});
  await page.waitForTimeout(300);await page.screenshot({path:path.join(output,'screw-unscrewing.png')});await page.waitForTimeout(1300);assert.equal(await page.locator('#cabScrew0 .cab-screw-face').evaluate(el=>Number(getComputedStyle(el).opacity)),0);
  assert.equal(await page.locator('#cabScrew0 .cab-screw-hole').evaluate(el=>Number(getComputedStyle(el).opacity)),1);assert.deepEqual(await b.evaluate('clone(state.active)'),original);
  await b.evaluate('showView("driver")');assert.equal(await page.locator('#cabScrew0').isDisabled(),false);assert.equal(await page.locator('#cabScrew0').evaluate(el=>el.classList.contains('is-missing')),true);
  assert.equal(await page.locator('#cabScrew0').getAttribute('aria-label'),'Schraubenloch oben links');
  await page.locator('#cabScrew0').dblclick();assert.equal(await b.evaluate('cabLooseScrews.has(0)'),false);assert.deepEqual(await b.evaluate('screwAudio'),[1.65,1.25]);
  assert.equal(await page.locator('#cabScrew0 .cab-screw-face').evaluate(el=>getComputedStyle(el).animationName),'cab-screw-tighten');
  await page.locator('#cabScrew0').dblclick();assert.deepEqual(await b.evaluate('screwAudio'),[1.65,1.25]);assert.equal(await b.evaluate('cabLooseScrews.has(0)'),false);
  await page.waitForTimeout(500);await page.screenshot({path:path.join(output,'screw-tightening.png')});
  await page.waitForFunction(()=>!document.getElementById('cabScrew0').hasAttribute('aria-busy'));
  assert.equal(await page.locator('#cabScrew0 .cab-screw-face').evaluate(el=>Number(getComputedStyle(el).opacity)),1);assert.equal(await page.locator('#cabScrew0 .cab-screw-hole').evaluate(el=>Number(getComputedStyle(el).opacity)),0);
  assert.equal(await page.locator('#cabScrew0').getAttribute('aria-label'),'Schraube oben links');assert.deepEqual(await b.evaluate('clone(state.active)'),original);
  await page.locator('#cabScrew0').press('Enter');assert.equal(await b.evaluate('cabLooseScrews.has(0)'),true);
  await page.waitForFunction(()=>!document.getElementById('cabScrew0').hasAttribute('aria-busy'));await page.locator('#cabScrew0').press('Space');assert.equal(await b.evaluate('cabLooseScrews.has(0)'),false);
  // Rerendering during insertion retains the new, installed state.
  await b.evaluate('showView("driver")');assert.equal(await page.locator('#cabScrew0').evaluate(el=>el.classList.contains('is-missing')),false);
  await page.locator('#cabScrew1').dispatchEvent('pointerup',{pointerType:'touch',clientX:100,clientY:100});await page.locator('#cabScrew1').dispatchEvent('pointerup',{pointerType:'touch',clientX:100,clientY:100});assert.equal(await b.evaluate('cabLooseScrews.has(1)'),true);
  await page.waitForFunction(()=>!document.getElementById('cabScrew1').hasAttribute('aria-busy'));
  await page.locator('#cabScrew1').dispatchEvent('pointerup',{pointerType:'touch',clientX:100,clientY:100});await page.locator('#cabScrew1').dispatchEvent('pointerup',{pointerType:'touch',clientX:100,clientY:100});assert.equal(await b.evaluate('cabLooseScrews.has(1)'),false);
  await b.evaluate('state.settings.cockpit_muted=true');const sounds=await b.evaluate('screwAudio.length');await page.locator('#cabScrew2').dblclick();assert.equal(await b.evaluate('screwAudio.length'),sounds);
  await page.waitForFunction(()=>!document.getElementById('cabScrew2').hasAttribute('aria-busy'));await page.locator('#cabScrew2').dblclick();assert.equal(await b.evaluate('screwAudio.length'),sounds);
  await page.locator('#cabRotary0').click();assert.equal(await b.evaluate('screwAudio.length'),sounds);
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#cabScrew3').dblclick();assert.equal(await page.locator('#cabScrew3 .cab-screw-face').evaluate(el=>getComputedStyle(el).animationName),'cab-screw-fade');
  assert.equal(await page.locator('#cabRotary0 .cab-rotary-turn').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  await page.waitForFunction(()=>!document.getElementById('cabScrew3').hasAttribute('aria-busy'));await page.locator('#cabScrew3').dblclick();assert.equal(await page.locator('#cabScrew3 .cab-screw-face').evaluate(el=>getComputedStyle(el).animationName),'cab-screw-appear');
  await b.evaluate("state.active.id='another-run';showView('driver')");assert.equal(await b.evaluate('cabLooseScrews.size'),0);assert.equal(await page.locator('.cab-screw:disabled').count(),0);
  assert.deepEqual(await b.evaluate('cabRotaryTurns'),[0,0]);
  assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['two independent clockwise rotary switches with 90 degree detents','full turn continues clockwise','rotary audio, keyboard and real touch','rotary state survives rerender and leaves trip unchanged','rotary mute and reduced motion','two door status lights and no old header lamp','door interlock retained','photo calibrated cap positions','centered SVG symbols','double click unscrew animation','real synthesized metal audio','hole and fallen screw','double click reinserts with ratchet sound','busy animation ignores repeat clicks','installed screw and covered hole','trip data unchanged','screw state survives rerender','touch double tap in both directions','keyboard controls','mute and reduced motion in both directions','new trip resets screws']},null,2));console.log('Cab extras checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
