'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const output=path.resolve(__dirname,'../build/qa-cab-route-panel');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];await page.setViewportSize({width:1366,height:900});await page.goto(b.origin);
  await b.evaluate(`(()=>{const p={id:'route-pane',routeId:'EF3H',line:'3',tram:'615',stops:allRouteStops('EF3H')};state.active={id:'pane-run',plan:p,position:12,startedAtEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,status:'running'};window.AndroidDisplay={setImmersive:()=>{}};showView('driver');toggleCabFullscreen()})()`);
  const trip=await b.evaluate('clone(state.active)');
  for(const viewport of [{width:1366,height:900},{width:390,height:844}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(100);
   const initial=await page.locator('#driverRouteMap').boundingBox();
   await page.locator('#cabRouteToggle').click();assert.equal(await page.locator('#cabRouteToggle').getAttribute('aria-expanded'),'false');await page.waitForTimeout(70);
   assert.equal(await page.locator('.driver-view>.grid>.col-4').isVisible(),false);
   await page.locator('#driverRouteMap').waitFor({state:'hidden'});assert.equal(await page.locator('.driver-view>.grid>.col-4').evaluate(e=>e.inert),true);assert(await page.locator('#cabRouteToggle').isVisible());
   await page.screenshot({path:path.join(output,`collapsed-${viewport.width}.png`)});
   await page.locator('#cabRouteToggle').press('Enter');await page.waitForTimeout(350);assert(await page.locator('#driverRouteMap').isVisible());assert.equal(await page.locator('.driver-view>.grid>.col-4').evaluate(e=>e.inert),false);
   assert.equal(await b.evaluate("(()=>{const m=document.getElementById('driverRouteMap'),r=m.querySelector('.current').getBoundingClientRect(),b=m.getBoundingClientRect();return r.top>=b.top-1&&r.bottom<=b.bottom+1})()"),true);
   // The live clock must not replace a focused route toggle.
   await page.locator('#cabRouteToggle').focus();await b.evaluate('tick()');assert.equal(await page.locator('#cabRouteToggle').evaluate(e=>e===document.activeElement),true);
   assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
  }
  await b.evaluate('toggleCabRoutePanel();setCabFullscreen(false)');assert(await page.locator('#driverRouteMap').isVisible());assert.equal(await page.locator('.driver-view>.grid>.col-4').evaluate(e=>e.inert),false);
  await b.evaluate('setCabFullscreen(true)');await page.locator('#driverRouteMap').waitFor({state:'hidden'});
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#cabRouteToggle').click();assert.equal(await page.locator('.driver-view>.grid').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
  assert.deepEqual(await b.evaluate('clone(state.active)'),trip);assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['animated desktop and portrait route pane','icon remains accessible','keyboard toggle','focus survives live update','current stop follows expansion','fullscreen exit restores normal route','reduced motion','trip unchanged']},null,2));console.log('Route panel checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
