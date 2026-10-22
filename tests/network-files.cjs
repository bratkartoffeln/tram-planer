'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright')));}
const output=path.resolve(__dirname,'../build/qa-network-files');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];
  await page.setViewportSize({width:1440,height:1080});await page.goto(b.origin);
  await b.evaluate("showView('network')");assert.equal(await page.getByRole('button',{name:'Netzplan exportieren',exact:true}).count(),0);
  await b.evaluate("showView('settings');for(let i=0;i<10;i++)registerDevVersionClick();setDevMode(true);showView('network')");
  assert.equal(await b.evaluate('networkEditing'),false);assert.equal(await page.getByRole('button',{name:'Netzplan exportieren',exact:true}).count(),1);
  await page.locator('#networkEditToggle').click();
  // Change a label and select an actual connection for a construction marking.
  await page.locator('.network-node[data-name="Anger"] circle').click();
  await page.locator('#networkStopLabel').fill('Anger Baustelle');await page.locator('#networkStopLabel').blur();
  await b.evaluate("selectNetworkEdge(networkEdgeKey(networkConnections().find(e=>!e.inactive&&(e.from==='Anger'||e.to==='Anger'))))");
  const marked=await b.evaluate('networkEditSelection.edge');
  await page.locator('#networkEdgeStatus').selectOption('construction');
  assert.equal(await b.evaluate('selectedNetworkEdge().dashed'),true);assert.equal(await b.evaluate('selectedNetworkEdge().color'),'#d88714');
  const displayed=()=>b.evaluate(`(()=>{const e=[...document.querySelectorAll('.network-link')].find(e=>e.dataset.edge===${JSON.stringify(marked)});return {dash:e.getAttribute('stroke-dasharray'),color:e.getAttribute('stroke'),status:e.dataset.serviceStatus}})()`);
  assert.deepEqual(await displayed(),{dash:'7 7',color:'#d88714',status:'construction'});
  await page.locator('#networkEdgeColor').fill('#aa3388');await page.locator('#networkEdgeColor').dispatchEvent('change');assert.equal((await displayed()).color,'#aa3388');
  await page.locator('#networkEdgeDashed').uncheck();assert.equal((await displayed()).dash,null);
  await page.locator('#networkEdgeStatus').selectOption('not-served');assert.deepEqual(await displayed(),{dash:'7 7',color:'#83919a',status:'not-served'});
  await page.getByRole('button',{name:'Abschnittsmarkierung zurücksetzen',exact:true}).click();assert.equal(await b.evaluate('selectedNetworkEdge().serviceStatus'),'regular');
  await page.locator('#networkEdgeStatus').selectOption('construction');await page.locator('#networkEdgeColor').fill('#aa3388');await page.locator('#networkEdgeColor').dispatchEvent('change');
  // Marking one lane must not change its parallel neighbors.
  assert.equal(await b.evaluate(`(()=>{const e=selectedNetworkEdge();return networkConnections().filter(x=>networkPair(x.from,x.to)===networkPair(e.from,e.to)&&networkEdgeKey(x)!==networkEdgeKey(e)).every(x=>x.serviceStatus!=='construction')})()`),true);
  const expected=await b.evaluate('validNetworkEdits(state.networkEdits)');
  const unrelated=await b.evaluate('JSON.stringify({plans:state.plans,history:state.history,active:state.active,settings:state.settings,customRoutes:state.customRoutes})');
  // Exercise a real browser download, not a mocked Blob.
  const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Netzplan exportieren',exact:true}).click();const download=await downloadEvent;
  assert.equal(download.suggestedFilename(),'network-plan.json');const exportedPath=path.join(output,'network-plan.json');await download.saveAs(exportedPath);
  const document=JSON.parse(fs.readFileSync(exportedPath,'utf8'));assert.deepEqual(document.edits,expected);assert.equal(document.format,'fahrplan-manager-network-plan');assert.equal(Object.hasOwn(document,'plans'),false);
  await page.getByRole('button',{name:'Projektdatei laden',exact:true}).click();assert.deepEqual(await b.evaluate('state.networkEdits'),expected);await page.locator('.modal .primary').click();assert.deepEqual(await b.evaluate('state.networkEdits'),await b.evaluate('bundledNetworkEdits()'));
  await page.locator('#networkPlanImport').setInputFiles(exportedPath);await page.locator('.modal .primary').click();await page.getByText('Netzplan importiert. Die Änderung kann rückgängig gemacht werden.',{exact:true}).waitFor();assert.deepEqual(await b.evaluate('state.networkEdits'),expected);
  assert.equal(await b.evaluate('JSON.stringify({plans:state.plans,history:state.history,active:state.active,settings:state.settings,customRoutes:state.customRoutes})'),unrelated);
  await page.getByRole('button',{name:'Rückgängig',exact:true}).click();assert.deepEqual(await b.evaluate('state.networkEdits'),await b.evaluate('bundledNetworkEdits()'));
  await page.locator('#networkPlanImport').setInputFiles(exportedPath);await page.locator('.modal .primary').click();await page.getByText('Netzplan importiert. Die Änderung kann rückgängig gemacht werden.',{exact:true}).waitFor();
  // Reject malformed files atomically, including invalid geometry and styles.
  const invalid=[{...document,schemaVersion:99},{...document,edits:{...document.edits,stops:{Unknown:{x:100,y:100,dx:0,dy:0,name:'Unknown'}}}},{...document,edits:{...document.edits,stops:{Anger:{x:-1,y:100,dx:0,dy:0,name:'Anger'}}}},{...document,edits:{...document.edits,edgeStyles:{[marked]:{color:'red',pattern:'dashed',status:'construction'}}}}];
  for(const payload of ['{broken',...invalid.map(JSON.stringify)]){
   await page.locator('#networkPlanImport').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(payload)});await page.waitForFunction(()=>document.getElementById('networkPlanImport').value==='');assert.deepEqual(await b.evaluate('state.networkEdits'),expected);
  }
  // Existing plan files without edgeStyles remain importable.
  const legacy=structuredClone(document);delete legacy.edits.edgeStyles;assert.equal(await b.evaluate(`Object.keys(parseNetworkPlanDocument(${JSON.stringify(legacy)}).edgeStyles).length`),0);
  await b.evaluate('window.nativePlan=null;window.AndroidBackup={saveNetworkPlan:json=>nativePlan=JSON.parse(json)}');await page.getByRole('button',{name:'Netzplan exportieren',exact:true}).click();assert.deepEqual(await b.evaluate('nativePlan.edits'),expected);
  // Persistence and the project source also work with the network disabled.
  await page.reload();await b.evaluate("showView('network')");assert.deepEqual(await b.evaluate('state.networkEdits'),expected);
  await b.evaluate('navigator.serviceWorker.ready');await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await b.cdp('Network.enable');await b.cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await page.reload();await b.evaluate("showView('network')");
  assert.deepEqual(await b.evaluate('state.networkEdits'),expected);assert.equal(await b.evaluate("Promise.all(['network-plan.json','network-plan-data.js'].map(p=>fetch(p).then(r=>r.ok))).then(a=>a.every(Boolean))"),true);
  await page.locator('#networkEditToggle').click();await b.evaluate(`selectNetworkEdge(${JSON.stringify(marked)})`);assert.deepEqual(await displayed(),{dash:'7 7',color:'#aa3388',status:'construction'});
  await page.locator('#networkCanvasSection').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'network-desktop.png')});
  await b.evaluate('setDevMode(false)');await b.evaluate("showView('network')");assert.equal(await page.locator('#networkPlanImport').count(),0);await b.evaluate('loadProjectNetworkPlan();exportNetworkPlan()');assert.deepEqual(await b.evaluate('state.networkEdits'),expected);
  // Simulate a populated project file before the application initializes.
  await b.cdp('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await page.evaluate(async()=>{for(const worker of await navigator.serviceWorker.getRegistrations())await worker.unregister();});
  const fresh=await browser.contexts()[0].newPage();await fresh.route('**/network-plan-data.js',route=>route.fulfill({contentType:'text/javascript',body:'window.BUNDLED_NETWORK_PLAN='+JSON.stringify(document)+';'}));
  await fresh.addInitScript(()=>localStorage.removeItem('fm_tablet_state_v1'));await fresh.goto(b.origin+'/?project-fixture=1');assert.deepEqual(await fresh.evaluate(()=>state.networkEdits),expected);await fresh.close();
  assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['dev-only file controls','construction and non-service markings','custom section color and dashes','real JSON download','validated import and undo','other app data preserved','Android export bridge','reload and offline assets','populated project defaults']},null,2));
  console.log('Network file and style checks passed: '+output);
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
