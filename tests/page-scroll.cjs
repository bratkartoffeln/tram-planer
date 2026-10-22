'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs'),{chromium}=require('../build/qa-deps/node_modules/playwright');
(async()=>{
 const output=path.resolve(__dirname,'../build/qa-page-scroll'),b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];page.setDefaultTimeout(10000);
  await page.goto(b.origin,{waitUntil:'domcontentloaded',timeout:60000});
  const noInnerScroll=async label=>{await page.waitForTimeout(60);const inner=await b.evaluate(`([...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(!e.getClientRects().length||s.visibility==='hidden'||s.display==='none')return false;return ['auto','scroll','overlay'].includes(s.overflowY)&&e.scrollHeight>e.clientHeight+2||['auto','scroll','overlay'].includes(s.overflowX)&&e.scrollWidth>e.clientWidth+2;}).map(e=>({tag:e.tagName,id:e.id,class:e.className})))`);assert.deepEqual(inner,[],label);};
  await b.evaluate("state.settings.dev_options_unlocked=true;state.settings.dev_mode=true;state.vehicles=[{id:'vehicle-scroll',code:'801',typeId:'tramlink',createdAt:1}];state.plans=[{id:'plan-scroll',routeId:'W2D',routeName:'Wiesenhügel → Domplatz',line:'2',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('W2D')}];saveState()");
  for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){
   await page.setViewportSize(viewport);
   for(const view of ['home','plans','new','vehicles','history','settings','network']){await b.evaluate(`showView('${view}')`);await noInnerScroll(view+' '+viewport.width);assert(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),view+' default width');}
   await b.evaluate("showView('vehicles');openVehicleBundlePreview('tramlink','vehicle-scroll');toggleCabLayoutEditor();openCabControlMenu('doors')");
   await noInnerScroll('editor functions '+viewport.width);
   const modalRoot=await page.locator('.modal').evaluate(e=>({height:e.scrollHeight,client:e.clientHeight}));assert(modalRoot.height<=modalRoot.client+2);
   await b.evaluate("setCabInspectorTab('appearance');document.querySelector('.cab-alignment-tools').open=true;document.getElementById('cabLayoutJson').closest('details').open=true;cabLayoutRefresh();queuePageTextareas()");await noInnerScroll('editor lists/json '+viewport.width);assert(await page.locator('#cabLayoutJson').evaluate(e=>e.scrollHeight<=e.clientHeight+2),'JSON is fully expanded');
   await b.evaluate('previewCabLayoutReset()');await noInnerScroll('reset preview '+viewport.width);await b.evaluate('cancelCabTransfer()');
   await b.evaluate('zoomCabWorkspace(.5)');await noInnerScroll('zoom '+viewport.width);assert(await b.evaluate('document.documentElement.scrollHeight>innerHeight'));
   await page.screenshot({path:path.join(output,'editor-'+viewport.width+'.png')});
   await b.evaluate('fitCabWorkspace();closeModal()');
   await b.evaluate("reallyStartTrip('plan-scroll',fmtTime(Date.now()))");await noInnerScroll('driver '+viewport.width);
   await b.evaluate("window.AndroidDisplay={setImmersive:()=>{}};setCabFullscreen(true)");await noInnerScroll('fullscreen '+viewport.width);
   assert(await b.evaluate('document.documentElement.scrollHeight>innerHeight'));
   const position=await b.evaluate('scrollTo(0,300);scrollY');await b.evaluate('updateDriverLive()');assert.equal(await b.evaluate('scrollY'),position,'live status must not move the main page');
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.screenshot({path:path.join(output,'fullscreen-bottom-'+viewport.width+'.png')});
   await b.evaluate("setCabFullscreen(false);showView('home')");
   await page.evaluate(()=>scrollTo(0,Math.min(400,document.documentElement.scrollHeight-innerHeight)));const scroll=await b.evaluate('scrollY');
   await b.evaluate("showModal('Langer Dialog','<p>Inhalt</p>'.repeat(100)+'<textarea id=\"scrollText\" rows=\"2\"></textarea>')");await page.locator('#scrollText').fill(Array.from({length:60},(_,i)=>'Zeile '+i).join('\n'));await noInnerScroll('long dialog and textarea '+viewport.width);assert(await page.locator('#scrollText').evaluate(e=>e.scrollHeight<=e.clientHeight+2),'textarea content is fully expanded');assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".shell")).display'),'none');
   await b.evaluate('closeModal()');assert(Math.abs(await b.evaluate('scrollY')-scroll)<2,'restore page position');
   if(viewport.width<=900){await b.evaluate('setMobileMenu(true)');await noInnerScroll('mobile navigation '+viewport.width);assert.equal(await b.evaluate('getComputedStyle(document.querySelector(".main")).display'),'none');await page.getByRole('button',{name:'Menü schließen',exact:true}).click();assert(Math.abs(await b.evaluate('scrollY')-scroll)<2);}
  }
  // Touch on blank space in an editing map pans the main page, not a map viewport.
  await page.setViewportSize({width:390,height:844});await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await b.evaluate("showView('network');openLineEditor('EF1H');document.getElementById('lineMapSvg').scrollIntoView({block:'center'})");await page.waitForTimeout(100);
  const blank=await b.evaluate(`(()=>{for(let y=160;y<innerHeight-80;y+=20)for(let x=40;x<innerWidth-30;x+=20){const node=document.elementFromPoint(x,y);if(node?.tagName==='rect'&&node.closest('#lineMapSvg'))return {x,y};}return null;})()`);assert(blank,'blank map point');const beforePan=await b.evaluate('scrollY');
  await b.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...blank,id:1}]});for(const delta of [20,40,60])await b.cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:blank.x,y:blank.y-delta,id:1}]});await b.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert(await b.evaluate('scrollY')>beforePan+30,'map pan moves main document');await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});await noInnerScroll('editing map pan');
  // End-of-page content is reachable through real wheel input, not a nested panel.
  await page.setViewportSize({width:390,height:844});await b.evaluate("showView('vehicles');openVehicleBundlePreview('tramlink');toggleCabLayoutEditor()");await page.mouse.move(200,500);await page.mouse.wheel(0,3000);await page.waitForTimeout(120);assert(await b.evaluate('scrollY>500'));await noInnerScroll('wheel on editor');
  assert.equal(b.errors.length,0,JSON.stringify(b.errors));fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['no inner scrollers on every page','desktop portrait landscape','editor functions lists JSON and transfer preview','zoom uses document','fullscreen complete route','stable live updates','dialog and menu restore main scroll','autogrowing textarea','real wheel moves document']},null,2));console.log('Single page scroll checks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
