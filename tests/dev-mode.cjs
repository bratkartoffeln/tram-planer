'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-dev-mode');
(async()=>{
 const b=await session(root,output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];await page.setViewportSize({width:1280,height:960});await page.goto(b.origin);
  await page.clock.install({time:new Date('2026-10-20T12:00:00+02:00')});await page.clock.pauseAt(new Date('2026-10-20T12:00:01+02:00'));
  await b.evaluate("showView('settings')");assert.equal(await page.locator('#devMode').count(),0);
  await b.evaluate('setDevMode(true)');assert.equal(await b.evaluate('state.settings.dev_mode'),false);
  assert.equal(await b.evaluate('normalizeState({settings:{dev_mode:true}}).settings.dev_mode'),false);
  const clicks=async n=>{for(let i=0;i<n;i++)await page.locator('#settingsVersion').click();};
  await clicks(9);assert.equal(await page.locator('#devMode').count(),0);
  await page.clock.runFor(5001);await clicks(1);assert.equal(await page.locator('#devMode').count(),0);
  // An intervening click resets the burst even when the 5-second window is still open.
  await page.locator('#pageTitle').click();await clicks(5);await page.locator('#pageTitle').click();await clicks(5);assert.equal(await page.locator('#devMode').count(),0);
  await page.locator('#pageTitle').click();await clicks(9);await page.clock.runFor(5000);await clicks(1);
  assert.equal(await page.locator('#devMode').count(),1);assert.equal(await page.locator('#devMode').isChecked(),false);
  await page.locator('#devMode').check();assert.equal(await b.evaluate('state.settings.dev_mode'),true);
  await b.evaluate("state.networkEdits.lineColors['2']='#123456';saveState();showView('network')");assert.equal(await page.locator('#networkEditToggle').count(),1);
  await page.reload();await b.evaluate("showView('settings')");assert(await page.locator('#devMode').isChecked());assert.equal(await b.evaluate('state.settings.dev_options_unlocked'),true);
  await page.clock.install({time:new Date('2026-10-20T12:01:00+02:00')});await page.clock.pauseAt(new Date('2026-10-20T12:01:01+02:00'));
  await clicks(9);assert.equal(await page.locator('#devMode').count(),1);await clicks(1);
  assert.equal(await page.locator('#devMode').count(),0);assert.equal(await b.evaluate('state.settings.dev_mode'),false);assert.equal(await b.evaluate('state.settings.dev_options_unlocked'),false);
  assert.equal(await b.evaluate("state.networkEdits.lineColors['2']"),'#123456');
  await b.evaluate("showView('network')");assert.equal(await page.locator('#networkEditToggle').count(),0);assert.equal(await page.locator('#networkPlanImport').count(),0);
  await b.evaluate("showView('settings')");for(let i=0;i<10;i++)await page.locator('#appVersion').click();assert.equal(await page.locator('#devMode').count(),1);
  await page.screenshot({path:path.join(output,'unlocked-settings.png')});assert.equal(b.errors.length,0);
  fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['hidden by default','locked mode cannot activate','10 clicks within 5 seconds','expired burst rejected','intervening click resets','unlock retains disabled checkbox','unlock and enabled state persist','second burst disables and hides','network edits retained','both settings version displays work']},null,2));console.log('Developer unlock checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
