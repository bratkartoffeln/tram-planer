'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const output=path.resolve(__dirname,'../build/qa-passenger-display');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];
  await page.setViewportSize({width:1440,height:1000});await page.goto(b.origin);
  await b.evaluate(`(()=>{const p={id:'passenger-test',routeId:'EF3R',routeCode:'3R',routeName:ROUTES.EF3R.name,line:'3',tram:'615',stops:allRouteStops('EF3R')};p.stops[0].pause=7;p.stops[1].travel=1;p.stops[2].travel=2;const now=Date.now();state.active={id:'passenger-run',plan:p,position:0,startedAtEpoch:now,positionReachedAt:now,pauseEndEpoch:now+420000,trafficDelayMin:0,status:'running'};window.AndroidAnnouncements={playSequence:()=>{},stop:()=>{}};showView('driver');openPassengerDisplay()})()`);
  assert.equal(await page.locator('.passenger-line').innerText(),'3');
  assert.equal(await page.locator('.passenger-current-name').innerText(),'Urbicher Kreuz');
  assert.match(await page.locator('.passenger-departure').innerText(),/Abfahrt in 7 Min/);
  assert.deepEqual(await page.locator('.passenger-minutes').allTextContents(),['8 Min.','10 Min.',await b.evaluate("(()=>{let t=7;for(let i=1;i<state.active.plan.stops.length;i++){t+=Number(state.active.plan.stops[i].travel)||0;if(i<state.active.plan.stops.length-1)t+=Number(state.active.plan.stops[i].pause)||0}return t+' Min.'})()")]);
  assert.equal(await page.locator('.passenger-stop>span').first().innerText(),'Windischholzh./X-FAB');
  assert.equal(await page.locator('.passenger-row.is-destination .passenger-stop>span').innerText(),'Europaplatz');
  assert.equal(await page.locator('.passenger-row.has-gap').count(),1);
  assert.equal(await page.locator('.passenger-transfer').count(),await b.evaluate("new Set(Object.values(ERFURT_NETWORK.serviceRoutes).filter(r=>r.line!=='3'&&r.stops.includes('Europaplatz')).map(r=>r.line)).size"));
  const fits=async()=>{
   await page.screenshot({path:path.join(output,"latest.png")});
   assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
   const monitor=await page.locator('.passenger-monitor').boundingBox();assert(monitor.x>=0&&monitor.x+monitor.width<=page.viewportSize().width+1);
   const alignment=await page.evaluate(()=>{
    const current=document.querySelector('.passenger-current'),track=document.querySelector('.passenger-track');if(!track)return 0;
    const a=getComputedStyle(current,'::before'),b=getComputedStyle(track,'::before');
    return Math.abs(current.getBoundingClientRect().left+parseFloat(a.left)+parseFloat(a.width)/2-(track.getBoundingClientRect().left+parseFloat(b.left)));
   });assert(alignment<.1,'header line must align with the route below');
   assert.equal(await b.evaluate("[...document.querySelectorAll('.passenger-current-name,.passenger-stop,.passenger-departure')].every(e=>e.scrollWidth<=e.clientWidth+1&&e.scrollHeight<=e.clientHeight+1)"),true);
   assert(await page.getByRole('button',{name:'Schließen',exact:true}).isVisible());
  };
  await fits();await page.screenshot({path:path.join(output,'reference-desktop.png')});
  await b.evaluate('state.active.positionReachedAt-=60000;state.active.pauseEndEpoch-=60000');
  await page.waitForFunction(()=>document.querySelector('.passenger-departure').textContent.includes('in 6 Min.'));
  for(const viewport of [{width:1024,height:768},{width:390,height:844},{width:844,height:390}]){
   await page.setViewportSize(viewport);await fits();await page.screenshot({path:path.join(output,`display-${viewport.width}.png`)});
  }
  // Measure the actual text, not just the clipped element: every glyph must fit
  // on one line while the departure and route keep their original positions.
  const nameLayout=()=>page.evaluate(()=>{
   const name=document.querySelector('.passenger-current-name'),range=document.createRange();range.selectNodeContents(name);
   return {width:name.getBoundingClientRect().width,textWidth:range.getBoundingClientRect().width,lines:range.getClientRects().length,font:parseFloat(getComputedStyle(name).fontSize),height:name.getBoundingClientRect().height,departure:document.querySelector('.passenger-departure').getBoundingClientRect().top,stops:document.querySelector('.passenger-stops').getBoundingClientRect().top};
  });
  for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:640},{width:844,height:390}]){
   await page.setViewportSize(viewport);
   await page.evaluate(()=>{state.active.plan.stops[0].name='Rieth';updatePassengerDisplay();});
   const baseline=await nameLayout();
   for(const text of ['Sozialversicherungszentrum','Lutherkirche / Stadtwerke Erfurt','W'.repeat(48),'SehrLangerHaltestellennameOhneLeerzeichen'.repeat(3)]){
    await page.evaluate(text=>{state.active.plan.stops[0].name=text;updatePassengerDisplay();},text);
    const layout=await nameLayout();
    assert.equal(layout.lines,1);assert(layout.textWidth<=layout.width+.1,'complete current name fits');assert(layout.font<baseline.font);
    for(const key of ['height','departure','stops'])assert(Math.abs(layout[key]-baseline[key])<.1,key+' must not shift');
   }
   await page.screenshot({path:path.join(output,`long-name-${viewport.width}.png`)});
  }
  // Resize the same live name without relying on the one-second redraw.
  await page.setViewportSize({width:1024,height:768});await page.evaluate(()=>{state.active.plan.stops[0].name='W'.repeat(32);updatePassengerDisplay();});
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(80);
  const resized=await nameLayout();assert.equal(resized.lines,1);assert(resized.textWidth<=resized.width+.1);
  // The passenger LCD stays light in night mode, and names are escaped.
  await b.evaluate("state.settings.dark_mode=true;applyTheme();state.active.plan.stops[0].name='<img src=x onerror=alert(1)> Sehr langer Haltestellenname';updatePassengerDisplay()");
  assert.equal(await page.locator('.passenger-screen img').count(),0);assert.match(await page.locator('.passenger-current-name').innerText(),/^<img/);await fits();
  assert.equal(await page.locator('.passenger-screen').evaluate(e=>getComputedStyle(e).color),'rgb(8, 12, 21)');
  await b.evaluate("state.active.status='suspended';state.active.suspendedAt=Date.now();updatePassengerDisplay()");
  assert.match(await page.locator('.passenger-departure').innerText(),/unterbrochen/);assert.deepEqual(await page.locator('.passenger-minutes').allTextContents(),['—','—','—']);
  // No duplicated destination near the end; terminus has no future stops.
  await b.evaluate("state.active.status='running';state.active.position=state.active.plan.stops.length-2;updatePassengerDisplay()");
  assert.equal(await page.locator('.passenger-row').count(),1);assert.equal(await page.locator('.passenger-row.has-gap').count(),0);
  await b.evaluate('state.active.position++;updatePassengerDisplay()');assert.equal(await page.locator('.passenger-row').count(),0);assert.match(await page.locator('.passenger-terminus').innerText(),/Bitte aussteigen/);
  await page.getByRole('button',{name:'Schließen',exact:true}).click();assert.equal(await page.locator('.passenger-screen').count(),0);await b.evaluate('tick()');
  assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['reference layout','live clock and departure countdown','relative arrival times including pauses','network transfer badges','responsive landscape and portrait','measured one-line long names','stable header and departure positions','refit on resize','night theme independent','escaped long names','suspended trip','last stops and terminus','close lifecycle']},null,2));
  console.log('Passenger display checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
