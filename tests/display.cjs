'use strict';
// Real browser fullscreen, compact navigation, responsive layout and Android bridge flows.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-display');
(async()=>{
 const b=await session(root,output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];page.setDefaultTimeout(8000);
  await page.setViewportSize({width:1366,height:900});await page.goto(b.origin,{timeout:30000});
  await b.evaluate(`(()=>{const p={id:'plan-display-test',routeId:'W2D',routeCode:'W2D',routeName:ROUTES.W2D.name,line:'2',tram:'801',stops:allRouteStops('W2D'),createdAt:1};state.plans=[p];state.active={id:'run-display-test',plan:clone(p),position:4,departure:'10:00',startedAtEpoch:Date.now(),actualStartEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,pauseEndEpoch:null,trafficDelayMin:0,status:'running'};window.AndroidAnnouncements={playSequence:()=>{},stop:()=>{}};saveState();showView('driver')})()`);
  assert.equal(await page.locator('.cab-controls button').count(),20);assert.equal(await page.locator('.cab-spare').count(),10);
  const width=async()=>Math.round((await page.locator('.cab-stage').boundingBox()).width);
  const normalWidth=await width(),trip=await b.evaluate('clone(state.active)');
  await page.locator('#sidebarToggle').click();assert.equal(await page.locator('#sidebarToggle').getAttribute('aria-expanded'),'false');
  await page.waitForTimeout(70);
  const movingWidth=await page.locator('#sidebar').evaluate(e=>e.getBoundingClientRect().width);assert(movingWidth>64&&movingWidth<240);
  await page.waitForFunction(()=>Math.abs(document.getElementById('sidebar').getBoundingClientRect().width-64)<.1);
  const collapsedWidth=await width();assert(collapsedWidth>normalWidth+80);assert.equal(Math.round((await page.locator('#sidebar').boundingBox()).width),64);
  await page.getByRole('button',{name:'Einstellungen',exact:true}).click();assert.equal(await b.evaluate('currentView'),'settings');
  await page.reload();assert.equal(await b.evaluate('state.settings.sidebar_collapsed'),true);await b.evaluate("showView('driver')");
  await page.screenshot({path:path.join(output,'collapsed-desktop.png')});
  await page.locator('#cabFullscreenBtn').click();await page.waitForFunction(()=>cabFullscreen&&document.fullscreenElement===document.documentElement);
  assert(await page.locator('#sidebar').isHidden());assert(await page.locator('.topbar').isHidden());assert.equal(await page.locator('#cabFullscreenBtn').getAttribute('aria-pressed'),'true');
  await page.waitForTimeout(350);
  const fullWidth=await width();assert(fullWidth>collapsedWidth+100);assert.deepEqual(await b.evaluate('clone(state.active)'),trip);
  const visibleLayout=async()=>{
   const photo=await page.locator('.cab-stage').boundingBox(),route=await page.locator('#driverRouteMap').boundingBox();
   const viewport=page.viewportSize();assert(photo.width>100&&photo.height>50);assert(route.width>150&&route.height>80);
   for(const box of [photo,route]){assert(box.x>=0&&box.y>=0);assert(box.x+box.width<=viewport.width+1);assert(box.y+box.height<=viewport.height+1);}
   assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
   if(viewport.width>760)assert(photo.x+photo.width<=route.x);
   else assert(photo.y+photo.height<=route.y);
  };
  await visibleLayout();await page.screenshot({path:path.join(output,'fullscreen-desktop.png')});
  await page.locator('#nextStopBtn').click();assert.equal(await b.evaluate('state.active.position'),5);assert.equal(await page.locator('.cab-fullscreen-stop').innerText(),await b.evaluate('state.active.plan.stops[5].name'));assert.equal(await page.locator('#cabFullscreenBtn').getAttribute('aria-pressed'),'true');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!cabFullscreen&&!document.fullscreenElement);assert.equal(await b.evaluate('state.settings.sidebar_collapsed'),true);assert.equal(await width(),collapsedWidth);
  await page.locator('#cabFullscreenBtn').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.locator('#cabFullscreenBtn').click();await page.waitForFunction(()=>!document.fullscreenElement&&!cabFullscreen);
  // Android uses the native system bar bridge and the same complete layout.
  await b.evaluate("window.displayCalls=[];window.AndroidDisplay={setImmersive:enabled=>displayCalls.push(enabled)};document.documentElement.requestFullscreen=()=>{throw Error('Browser fullscreen must not be called on Android')}");
  await page.locator('#cabFullscreenBtn').click();assert.equal(await b.evaluate('cabFullscreen'),true);assert.deepEqual(await b.evaluate('displayCalls'),[true]);
  await b.evaluate('appBack()');assert.equal(await b.evaluate('currentView'),'driver');assert.equal(await b.evaluate('cabFullscreen'),false);assert.deepEqual(await b.evaluate('displayCalls'),[true,false]);
  await page.locator('#cabFullscreenBtn').click();await b.evaluate("showView('plans')");assert.equal(await b.evaluate('cabFullscreen'),false);assert.equal(await b.evaluate('displayCalls.at(-1)'),false);
  await b.evaluate("showView('driver')");await page.locator('#cabFullscreenBtn').click();
  for(const viewport of [{width:900,height:500},{width:390,height:844}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(100);await visibleLayout();
   assert.equal(await b.evaluate("(()=>{const m=document.getElementById('driverRouteMap'),r=m.querySelector('.current').getBoundingClientRect(),b=m.getBoundingClientRect();return r.top>=b.top-1&&r.bottom<=b.bottom+1})()"),true);
   await page.screenshot({path:path.join(output,`fullscreen-${viewport.width}.png`)});
  }
  await page.locator('#cabFullscreenBtn').tap({force:true}).catch(()=>page.locator('#cabFullscreenBtn').click());assert.equal(await b.evaluate('cabFullscreen'),false);
  // On small screens collapsing removes the navigation strip but leaves an expand control.
  await page.locator('#nav').waitFor({state:'hidden'});assert(await page.locator('#sidebarToggle').isVisible());await page.locator('#sidebarToggle').click();await page.locator('#nav').waitFor({state:'visible'});
  await page.waitForTimeout(350);
  const mobileHeight=await page.locator('#sidebar').evaluate(e=>e.getBoundingClientRect().height);
  await page.locator('#sidebarToggle').click();await page.waitForTimeout(70);
  const movingHeight=await page.locator('#sidebar').evaluate(e=>e.getBoundingClientRect().height);assert(movingHeight>60&&movingHeight<mobileHeight);
  assert.equal(await page.locator('#nav').evaluate(e=>e.inert),true);
  // Reverse an in-progress transition and leave the menu expanded.
  await page.locator('#sidebarToggle').click();await page.waitForTimeout(350);assert.equal(await page.locator('#nav').evaluate(e=>e.inert),false);assert(await page.locator('#nav').isVisible());
  await page.setViewportSize({width:1366,height:900});await b.evaluate("delete window.AndroidDisplay;document.documentElement.requestFullscreen=()=>Promise.reject(new DOMException('Fullscreen unavailable','NotAllowedError'))");
  await page.locator('#cabFullscreenBtn').click();await page.waitForTimeout(50);assert.equal(await b.evaluate('cabFullscreen'),true);assert.equal(await b.evaluate('document.fullscreenElement'),null);await visibleLayout();await page.keyboard.press('Escape');assert.equal(await b.evaluate('cabFullscreen'),false);
  await b.evaluate("window.AndroidDisplay={setImmersive:enabled=>displayCalls.push(enabled)};state.active.position=state.active.plan.stops.length-1;showView('driver')");await page.locator('#cabFullscreenBtn').click();assert(await page.locator('#nextStopBtn').isDisabled());await page.getByRole('button',{name:'Fahrt beenden',exact:true}).click();assert.equal(await b.evaluate('cabFullscreen'),false);assert.equal(await b.evaluate('state.active'),null);assert.equal(await b.evaluate('displayCalls.at(-1)'),false);
  await b.evaluate('closeModal()');await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#sidebarToggle').click();
  assert.equal(await page.locator('.shell').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
  assert.equal(await page.locator('#sidebar').evaluate(e=>e.getBoundingClientRect().width),64);
  assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,widths:{normal:normalWidth,collapsed:collapsedWidth,fullscreen:fullWidth},checks:['persistent collapsible navigation with accessible icons','animated desktop width and mobile height','rapid transition reversal','hidden mobile navigation inert','reduced motion','larger cab after collapsing','real browser fullscreen and button exit','Escape and Android Back exit','native immersive bridge','responsive portrait and landscape with visible route','active stop follows resize','denied API fallback','trip unchanged by display changes','finishing exits fullscreen']},null,2));console.log('Display checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
