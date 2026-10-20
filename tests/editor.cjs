'use strict';
// Real pointer/touch UI checks for plan editing and the developer map overlay.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs');
let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright')));}
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-editor');
(async()=>{
 const b=await session(root,output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];
  await page.setViewportSize({width:1280,height:1000});await page.goto(b.origin);
  assert.equal(await b.evaluate('state.settings.dev_mode'),false);
  await b.evaluate(`(()=>{const p={id:'plan-edit-test',routeId:'W2D',routeCode:'W2D',routeName:ROUTES.W2D.name,line:'2',tram:'615',stops:allRouteStops('W2D'),createdAt:123};state.plans=[p];saveState();showView('plans')})()`);
  await page.getByRole('button',{name:'Bearbeiten',exact:true}).click();
  await page.locator('#lineInput').fill('8');await page.locator('#vehicleInput').fill('777');
  await page.locator('.travel-input').nth(1).fill('7');await page.locator('.pause-input').nth(1).fill('3');
  await page.getByRole('button',{name:'Änderungen speichern'}).click();
  const saved=await b.evaluate('state.plans[0]');assert.equal(saved.line,'8');assert.equal(saved.tram,'777');assert.equal(saved.stops[1].travel,7);assert.equal(saved.stops[1].pause,3);assert.equal(saved.createdAt,123);assert.equal(saved.id,'plan-edit-test');assert.equal(await b.evaluate('state.plans.length'),1);
  await page.locator('#departureFiveButton').click();assert.equal(await page.locator('#tripDepartureInput').inputValue(),await b.evaluate('fmtTime(Date.now()+5*60000)'));
  const midnight=await b.evaluate("(()=>{const original=Date.now;Date.now=()=>new Date(2026,9,19,23,58).getTime();try{setDepartureNow('plan-edit-test',5);return {value:document.getElementById('tripDepartureInput').value,day:new Date(departureEpoch('00:03')).getDate()}}finally{Date.now=original}})()");assert.equal(midnight.value,'00:03');assert.equal(midnight.day,20);
  await page.locator('#departureNowButton').click();
  await page.locator('#startTripButton').click();await b.evaluate("showView('plans')");assert.equal(await page.getByRole('button',{name:'Bearbeiten',exact:true}).isDisabled(),true);
  await b.evaluate("editPlan('plan-edit-test')");assert.equal(await b.evaluate('currentView'),'plans');
  await b.evaluate("state.active.status='suspended';showView('plans')");assert.equal(await page.getByRole('button',{name:'Bearbeiten',exact:true}).isDisabled(),true);
  await b.evaluate("state.active=null;showView('settings');for(let i=0;i<10;i++)registerDevVersionClick()");assert.equal(await page.locator('#devMode').isChecked(),false);
  await b.evaluate("showView('network')");assert.equal(await page.locator('#networkEditToggle').count(),0);
  await b.evaluate("showView('settings')");await page.locator('#devMode').check();await b.evaluate("showView('network')");
  await page.locator('#networkEditToggle').click();assert.equal(await page.locator('#networkEditToggle').getAttribute('aria-pressed'),'true');
  const before=await b.evaluate("networkPositions().Anger");
  const node=page.locator('.network-node[data-name="Anger"] circle');await node.scrollIntoViewIfNeeded();
  let box=await node.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+35,box.y+box.height/2+25,{steps:6});await page.mouse.up();
  const moved=await b.evaluate("networkPositions().Anger");assert(moved.x>before.x+15);assert(moved.y>before.y+10);
  assert.equal(await b.evaluate(`(()=>{const p=networkPositions().Anger;return [...document.querySelectorAll('.network-link')].filter(e=>e.dataset.from==='Anger'||e.dataset.to==='Anger').every(e=>{const point=e.getPointAtLength(e.dataset.from==='Anger'?0:e.getTotalLength());return Math.hypot(point.x-p.x,point.y-p.y)<.002})})()`),true);
  await page.locator('#networkStopLabel').fill('Anger Zentrum');await page.locator('#networkStopLabel').blur();
  assert.equal(await page.locator('.network-node[data-name="Anger"] text').textContent(),'Anger Zentrum');
  const label=page.locator('.network-node[data-name="Anger"] text');await label.scrollIntoViewIfNeeded();box=await label.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+22,box.y+box.height/2-18,{steps:5});await page.mouse.up();
  const labelMoved=await b.evaluate('networkPositions().Anger');assert(labelMoved.dx>10);assert(labelMoved.dy< -5);assert.equal(labelMoved.x,moved.x);
  await page.getByRole('button',{name:'Gleis verbinden',exact:true}).click();
  await page.locator('.network-node[data-name="Anger"] circle').click();await page.locator('.network-node[data-name="Zoopark"] circle').click();
  assert.equal(await b.evaluate('state.networkEdits.addedEdges.length'),1);
  await page.locator('#networkLineColor').fill('#1122aa');await page.locator('#networkLineColor').dispatchEvent('change');
  assert.equal(await b.evaluate('networkConnections().find(e=>e.line.startsWith("Eigenes Gleis")).color'),'#1122aa');
  await page.getByRole('button',{name:'Dieses Gleis entfernen',exact:true}).click();assert.equal(await b.evaluate('state.networkEdits.addedEdges.length'),0);
  await page.getByRole('button',{name:'Rückgängig',exact:true}).click();assert.equal(await b.evaluate('state.networkEdits.addedEdges.length'),1);
  // A built-in edge can be recolored and removed, including from the other map mode.
  await b.evaluate("selectNetworkEdge(networkEdgeKey(networkConnections().find(e=>e.from==='Anger'||e.to==='Anger')))");
  const line=await b.evaluate('networkConnections().find(e=>networkEdgeKey(e)===networkEditSelection.edge).line');
  await page.locator('.color-swatch').nth(3).click();assert.equal(await b.evaluate(`networkConnections().filter(e=>e.line===${JSON.stringify(line)}).every(e=>e.color===state.networkEdits.lineColors[e.line])`),true);
  const removedKey=await b.evaluate('networkEditSelection.edge');await page.getByRole('button',{name:'Dieses Gleis entfernen',exact:true}).click();assert.equal(await b.evaluate(`networkConnections().some(e=>networkEdgeKey(e)===${JSON.stringify(removedKey)})`),false);
  await page.locator('#networkServiceMode').selectOption('regular');assert.equal(await b.evaluate(`networkConnections().some(e=>networkEdgeKey(e)===${JSON.stringify(removedKey)})`),false);
  const overlay=await b.evaluate('clone(state.networkEdits)');await page.reload();await b.evaluate("showView('network')");
  assert.equal(await page.locator('#networkEditToggle').getAttribute('aria-pressed'),'false');assert.deepEqual(await b.evaluate('state.networkEdits'),overlay);
  assert.equal(await page.locator('.network-node[data-name="Anger"] text').textContent(),'Anger Zentrum');
  // Real touch dragging uses pointer capture and updates all connected segments.
  await page.locator('#networkEditToggle').click();await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await page.locator('.network-node[data-name="Anger"] circle').scrollIntoViewIfNeeded();box=await page.locator('.network-node[data-name="Anger"] circle').boundingBox();
  const x=box.x+box.width/2,y=box.y+box.height/2,touchBefore=await b.evaluate('networkPositions().Anger');
  await b.cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await b.cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+24,y:y+30,id:1}]});await b.cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert((await b.evaluate('networkPositions().Anger')).x>touchBefore.x+10);await b.cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  // JSON export/import keeps the map overlay; disabling dev mode retains its drawing.
  await b.evaluate("window.exported=null;window.AndroidBackup={save:s=>exported=JSON.parse(s)};exportData()");assert.deepEqual(await b.evaluate('exported.networkEdits'),await b.evaluate('state.networkEdits'));
  await b.evaluate("showView('settings')");await page.locator('#importFile').setInputFiles({name:'map-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(await b.evaluate('exported')))});
  await page.getByText('Daten importiert.',{exact:true}).waitFor();await b.evaluate("showView('settings')");await page.locator('#devMode').uncheck();await b.evaluate("showView('network')");assert.equal(await page.locator('#networkEditToggle').count(),0);
  await b.evaluate("toggleNetworkEditor();updateNetworkStop('name','Forbidden')");assert.equal(await b.evaluate('networkPositions().Anger.name'),'Anger Zentrum');
  // Cab layout and mechanical feedback through actual mouse and keyboard input.
  await b.evaluate(`state.active={id:'run-editor-test',plan:clone(state.plans[0]),departure:'10:00',position:1,startedAtEpoch:Date.now(),positionReachedAt:Date.now(),doorsOpen:false,status:'running'};showView('driver');window.mechanical=[];window.actualMechanical=[];const original=playCabMechanical;playCabMechanical=kind=>{mechanical.push(kind);original(kind)};const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){if(this.context===cabAudioContext)actualMechanical.push(this.buffer.duration);return start.apply(this,args)};`);
  assert.equal(await page.locator('.cab-screw').count(),4);assert.equal(await page.locator('.cab-placeholder').count(),10);
  await page.locator('#doorBtn').click();assert.deepEqual(await b.evaluate('mechanical'),['down','up']);
  await page.locator('#emergencyBtn').click();assert.equal(await page.locator('#emergencyBtn').getAttribute('aria-pressed'),'true');assert.deepEqual(await b.evaluate('mechanical'),['down','up','latch']);await page.getByRole('button',{name:'Abbrechen',exact:true}).click();assert.equal(await page.locator('#emergencyBtn').getAttribute('aria-pressed'),'false');
  await page.locator('#doorBtn').focus();await page.keyboard.press('Space');assert.deepEqual((await b.evaluate('mechanical')).slice(-2),['down','up']);
  assert.deepEqual((await b.evaluate('actualMechanical')).map(d=>Math.round(d*1000)),[65,45,160,65,45]);assert.equal(await b.evaluate('cabAudioContext.state'),'running');
  await b.evaluate('state.settings.cockpit_muted=true');const soundCount=await b.evaluate('actualMechanical.length');await page.locator('#doorBtn').click();assert.equal(await b.evaluate('actualMechanical.length'),soundCount);await b.evaluate('state.settings.cockpit_muted=false');
  await page.locator('.cab-console').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'cab-desktop.png')});
  for(const width of [390,768]){await page.setViewportSize({width,height:900});await b.evaluate("showView('driver')");assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);await page.locator('.cab-console').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'cab-'+width+'.png')});}
  await page.setViewportSize({width:1280,height:1000});await b.evaluate("setDevMode(true);showView('network');toggleNetworkEditor()");await page.locator('#networkCanvasSection').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'map-desktop.png')});
  // Offline reload must include the new editor and browser icon, and preserve edits.
  await b.evaluate('navigator.serviceWorker.ready');await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const offlineOverlay=await b.evaluate('clone(state.networkEdits)');
  await b.cdp('Network.enable');await b.cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await page.reload();
  assert.deepEqual(await b.evaluate('state.networkEdits'),offlineOverlay);assert.equal(await b.evaluate('typeof bindNetworkEditor'),'function');
  assert.equal(await b.evaluate("Promise.all(['network-editor.js','favicon-32.png','images/cab-panel-photoreal.webp'].map(p=>fetch(p).then(r=>r.ok))).then(a=>a.every(Boolean))"),true);
  await b.evaluate("showView('network')");await page.locator('#networkEditToggle').click();assert.equal(await b.evaluate('networkEditing'),true);
  assert.equal(b.errors.length,0);fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['edit existing plan without duplicating','active and suspended guards','departure plus five minutes','default dev mode disabled','real mouse and touch dragging','connected geometry follows','independent names and label offsets','add remove undo tracks','line palette and custom color','persist reload and JSON backup','editing disabled outside dev mode','real mechanical press release latch input','responsive cab']},null,2));
  console.log('Editor checks passed: '+output);
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
