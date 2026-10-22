'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const output=path.resolve(__dirname,'../build/qa-usability');
(async()=>{
 const b=await session(path.resolve(__dirname,'../web-pwa'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];page.setDefaultTimeout(6000);
  const touch=async locator=>{await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();await b.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await b.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(280);};
  await page.setViewportSize({width:1440,height:1000});await page.goto(b.origin,{waitUntil:'domcontentloaded',timeout:60000});await page.locator('#routeSearch').waitFor();
  await page.screenshot({path:path.join(output,'desktop-home.png')});
  await page.locator('#routeSearch').fill('Wiesenhügel');assert(await page.locator('#routeResults .route-card:visible').count()>0);
  await page.locator('#routeSearch').fill('Unbekannte Strecke');assert.equal(await page.locator('#routeResults .route-card:visible').count(),0);assert.match(await page.locator('#routeCount').innerText(),/Keine Treffer/);
  await page.locator('#nav [data-view=new]').click();await page.locator('#vehicleInput').fill('801');await page.getByRole('button',{name:'Fahrplan speichern',exact:true}).click();
  assert.equal(await b.evaluate('state.plans.length'),1);assert.equal(await b.evaluate('currentView'),'detail');
  await page.screenshot({path:path.join(output,'desktop-prepare.png')});
  await b.evaluate("state.plans.push({...clone(state.plans[0]),id:'plan-search-fixture',routeName:'Suchtest Nord',tram:'999'});showView('plans')");
  await page.locator('#planSearch').fill('999');assert.equal(await page.locator('#planSearchResults .data-item:visible').count(),1);
  await page.locator('#planSearch').fill('no-match');assert.equal(await page.locator('#planSearchResults .data-item:visible').count(),0);
  await page.locator('#planSearch').fill('');
  await page.locator('#planSearchResults .data-item').first().getByRole('button',{name:'Löschen',exact:true}).click();
  await page.locator('.modal').waitFor();assert.equal(await b.evaluate('document.querySelector(".shell").inert'),true);
  await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('.modal button').last().evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');assert.equal(await page.locator('.modal').count(),0);assert.equal(await b.evaluate('document.querySelector(".shell").inert'),false);
  assert.equal(await page.locator('#planSearchResults .data-item').first().getByRole('button',{name:'Löschen',exact:true}).evaluate(e=>e===document.activeElement),true);
  await b.evaluate("state.history=[{id:'h-test',type:'FAHRT',at:Date.now(),title:'Testfahrt',tram:'801'}];saveState();showView('history')");
  await page.locator('#historySearch').fill('Testfahrt');assert.equal(await page.locator('#historySearchResults .data-item:visible').count(),1);
  await b.evaluate("showView('vehicles')");await page.locator('#vehicleCatalogTab').click();assert.equal(await page.locator('#fleetSearch').count(),0);await page.locator('#vehicleTypeSearch').fill('Combino');assert(await page.locator('#vehicleTypeResults > :visible').count()>0);await page.locator('#fleetTab').click();
  await b.evaluate("state.vehicles=[{id:'vehicle-test',code:'801',typeId:'',notes:'Testwagen',createdAt:1}];showView('vehicles')");
  await page.locator('#fleetSearch').fill('801');assert.equal(await page.locator('#fleetSearchResults > :visible').count(),1);
  await page.locator('#fleetSearch').fill('no-match');assert.equal(await page.locator('#fleetSearchResults > :visible').count(),0);
  for(const width of [360,390,768,900,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const view of ['home','new','plans','vehicles','history','settings','network']){
    await b.evaluate(`showView('${view}')`);await page.waitForTimeout(60);
    assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true,view+' overflow at '+width);
   }
  }
  await page.setViewportSize({width:390,height:844});await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await b.evaluate("showView('home')");
  await page.waitForTimeout(280);
  await page.screenshot({path:path.join(output,'mobile-home.png')});
  await touch(page.locator('#mobileMore'));assert.equal(await b.evaluate('mobileMenuOpen'),true);assert.equal(await b.evaluate('document.querySelector(".main").inert'),true);
  await page.screenshot({path:path.join(output,'mobile-menu.png')});
  await touch(page.locator('#nav [data-view=settings]'));assert.equal(await b.evaluate('currentView'),'settings');assert.equal(await b.evaluate('mobileMenuOpen'),false);assert.equal(await b.evaluate('document.querySelector(".main").inert'),false);
  await touch(page.locator('.settings-row input[type=checkbox]').first());assert.equal(await b.evaluate('document.body.classList.contains("dark")'),true);
  await page.screenshot({path:path.join(output,'mobile-settings-dark.png')});
  await touch(page.locator('#mobileMore'));await b.evaluate('appBack()');assert.equal(await b.evaluate('mobileMenuOpen'),false);
  await b.evaluate("state.settings.dark_mode=false;window.AndroidAnnouncements={playSequence:()=>{},stop:()=>{}};window.AndroidAudio={playEffect:()=>{},stop:()=>{}};reallyStartTrip(state.plans[0].id,fmtTime(Date.now()))");
  await touch(page.locator('#quickNext'));assert.equal(await b.evaluate('state.active.position'),1);
  await b.evaluate('state.active.doorsOpen=true;updateShell()');assert(await page.locator('#quickNext').isDisabled());assert.equal(await page.locator('#quickDoors').innerText(),'Türen schließen');
  await b.evaluate("state.active.doorsOpen=false;state.active.pauseEndEpoch=Date.now()+60000;updateShell()");assert(await page.locator('#quickNext').isDisabled());
  await b.evaluate('state.active.pauseEndEpoch=null;updateShell()');assert(await page.locator('#quickNext').isEnabled());
  await touch(page.locator('#quickDoors'));await page.waitForTimeout(150);assert.equal(await page.locator('.drive-toolbar').count(),1);
  await page.screenshot({path:path.join(output,'mobile-driver.png')});
  await touch(page.locator('.drive-secondary summary'));
  await touch(page.locator('.drive-toolbar').getByRole('button',{name:'Notfall melden',exact:true}));await page.locator('.modal').waitFor();await b.evaluate('appBack()');assert.equal(await page.locator('.modal').count(),0);
  await touch(page.getByRole('button',{name:'Fahrpult im Vollbild öffnen'}));assert.equal(await b.evaluate('cabFullscreen'),true);assert.equal(await page.locator('#mobileNav').isVisible(),false);await page.keyboard.press('Escape');
  await b.evaluate("showView('home')");await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
  await page.context().setOffline(true);await page.reload({waitUntil:'domcontentloaded',timeout:60000});await page.locator('#routeSearch').waitFor();assert(await page.locator('.mobile-nav').isVisible());await page.context().setOffline(false);
  // Android loads the exact same GUI from local assets without HTTP.
  await page.goto('file:///'+path.resolve(__dirname,'../app/src/main/assets/index.html').replaceAll('\\','/'));await page.locator('#routeSearch').waitFor();await touch(page.locator('#mobileMore'));await touch(page.locator('#nav [data-view=plans]'));assert.equal(await b.evaluate('currentView'),'plans');
  assert.equal(b.errors.length,0,JSON.stringify(b.errors));
  fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,widths:[360,390,768,900,1024,1440],checks:['mouse plan creation','route and saved data searches','responsive pages','touch navigation','dark mode','dialog focus trap and restore','Android Back','direct driver controls and locks','fullscreen','offline PWA reload','file URL assets']},null,2));
  console.log('Usability checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
