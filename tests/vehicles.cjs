'use strict';
// End-to-end vehicle CRUD, plan assignments, backups, offline photos and terminal interlock.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-vehicles');
(async()=>{
 const b=await session(root,output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];page.setDefaultTimeout(6000);page.setDefaultNavigationTimeout(20000);
  await page.setViewportSize({width:1366,height:1000});await page.goto(b.origin);
  await page.locator('#nav [data-view="vehicles"]').click();
  assert.equal(await page.locator('#pageTitle').innerText(),'Fahrzeuge');
  const add=async(code,type)=>{await page.getByRole('button',{name:'＋ Fahrzeug anlegen',exact:true}).click();await page.locator('#vehicleCode').fill(code);await page.locator('#vehicleTypeSelect').selectOption(type);await page.getByRole('button',{name:'Fahrzeug speichern',exact:true}).click();};
  await add('801','tramlink');await add('TW 92','gotha-standard');
  assert.equal(await page.locator('#vehicleFleet .vehicle-card').count(),2);
  await add('tw 92','kt4d');assert.match(await page.locator('#vehicleFormError').innerText(),/bereits vergeben/);await page.getByRole('button',{name:'Abbrechen',exact:true}).click();
  await page.reload();await page.locator('#nav [data-view="vehicles"]').click();assert.equal(await page.locator('#vehicleFleet .vehicle-card').count(),2);
  await b.evaluate("startDraftWithRoute('W2D')");await page.locator('#savedVehicleSelect').selectOption({label:'801 · Stadler Tramlink'});assert.equal(await page.locator('#vehicleInput').inputValue(),'801');
  await page.getByRole('button',{name:'Fahrplan speichern',exact:true}).click();
  const original=await b.evaluate('clone(state.plans[0])');assert.equal(original.tram,'801');assert.equal(original.vehicleTypeId,'tramlink');assert(original.vehicleId.startsWith('vehicle-'));
  await b.evaluate("showView('vehicles')");const first=page.locator(`[data-vehicle-id="${original.vehicleId}"]`);
  await first.getByRole('button',{name:'Bearbeiten',exact:true}).click();await page.locator('#vehicleCode').fill('TL 803');await page.locator('#vehicleNotes').fill('Eigene Lackierung');await page.getByRole('button',{name:'Änderungen speichern',exact:true}).click();
  assert.equal(await b.evaluate('state.plans[0].tram'),'TL 803');assert.equal(await b.evaluate('state.plans[0].createdAt'),original.createdAt);
  await b.evaluate('editPlan(state.plans[0].id)');assert.equal(await page.locator('#vehicleInput').inputValue(),'TL 803');assert.equal(await page.locator('#savedVehicleSelect').inputValue(),original.vehicleId);
  await page.getByRole('button',{name:'Änderungen speichern',exact:true}).click();await page.locator('#departureNowButton').click();await page.locator('#startTripButton').click();
  await b.evaluate("showView('vehicles')");assert(await first.getByRole('button',{name:'Bearbeiten',exact:true}).isDisabled());assert(await first.getByRole('button',{name:'Löschen',exact:true}).isDisabled());
  await b.evaluate(`openVehicleEditor('${original.vehicleId}');confirmDeleteVehicle('${original.vehicleId}')`);assert.equal(await b.evaluate('state.vehicles.length'),2);assert.equal(await b.evaluate('state.active.plan.tram'),'TL 803');
  // At the terminus both rendering and the live clock must retain the disabled state.
  await b.evaluate("state.active.position=state.active.plan.stops.length-2;showView('driver')");await page.locator('#nextStopBtn').click();
  assert.equal(await page.locator('#nextStopBtn').innerText(),'Nächster Halt');assert(await page.locator('#nextStopBtn').isDisabled());
  const terminal=await b.evaluate('clone(state.active)');await b.evaluate('nextStop();nextStop();updateDriverLive()');assert.deepEqual(await b.evaluate('clone(state.active)'),terminal);assert(await page.locator('#nextStopBtn').isDisabled());assert.equal(await b.evaluate('state.history.length'),0);
  await b.evaluate('toggleDoors();toggleDoors();updateDriverLive()');assert(await page.locator('#nextStopBtn').isDisabled());
  await b.evaluate('saveState()');await page.reload();await b.evaluate("showView('driver')");assert(await page.locator('#nextStopBtn').isDisabled());
  await page.getByRole('button',{name:'Zurück',exact:true}).click();assert(!(await page.locator('#nextStopBtn').isDisabled()));await page.locator('#nextStopBtn').click();
  await page.getByRole('button',{name:'Fahrt beenden',exact:true}).click();assert.equal(await b.evaluate('state.active'),null);assert.equal(await b.evaluate('state.history[0].status'),'Ziel erreicht');await b.evaluate('closeModal()');
  // Export/import includes the fleet; old backups still load without inventing vehicles.
  await b.evaluate('window.exported=null;window.AndroidBackup={save:json=>exported=JSON.parse(json)};exportData()');
  const backup=await b.evaluate('exported');assert.equal(backup.vehicles.length,2);
  await b.evaluate("showView('settings')");await page.locator('#importFile').setInputFiles({name:'fleet.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.getByText('Daten importiert.',{exact:true}).waitFor();assert.equal(await b.evaluate('state.vehicles.length'),2);
  assert.equal(await b.evaluate('(()=>{const old=clone(state);delete old.vehicles;return normalizeState(old).vehicles.length})()'),0);
  await b.evaluate("showView('vehicles')");await first.getByRole('button',{name:'Löschen',exact:true}).click();await page.getByRole('button',{name:'Fahrzeug löschen',exact:true}).click();
  assert.equal(await b.evaluate('state.plans[0].vehicleId'),null);assert.equal(await b.evaluate('state.plans[0].tram'),'TL 803');assert.equal(await b.evaluate('state.history[0].tram'),'TL 803');
  await b.evaluate('editPlan(state.plans[0].id)');await page.getByRole('button',{name:'Änderungen speichern',exact:true}).click();assert.equal(await b.evaluate('state.plans[0].vehicleTypeName'),'Stadler Tramlink');
  await b.evaluate("showView('vehicles')");await page.locator('#vehicleCatalogTab').click();await page.locator('#vehicleTypeSearch').fill('Combino');assert.equal(await page.locator('#vehicleTypeResults article').count(),4);await b.screenshot('catalogue-desktop.png');
  await page.locator('#vehicleTypeSearch').fill('');await page.locator('#vehicleTypeGroup').selectOption('Tatra & Tradition');assert.equal(await page.locator('#vehicleTypeResults article').count(),6);
  await page.setViewportSize({width:390,height:844});assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);await b.screenshot('catalogue-mobile.png');
  await page.locator('#fleetTab').click();await page.getByRole('button',{name:'＋ Fahrzeug anlegen',exact:true}).click();await page.locator('#vehicleCode').fill('TW <"92\'>');await page.locator('#vehicleTypeSelect').selectOption('t2d');await page.getByRole('button',{name:'Fahrzeug speichern',exact:true}).click();assert.equal(await page.locator('.vehicle-card h2').last().innerText(),'TW <"92\'>');
  await page.setViewportSize({width:1366,height:1000});await b.screenshot('fleet-desktop.png');
  await b.evaluate('navigator.serviceWorker.ready.then(()=>true)');await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await b.cdp('Network.enable');await b.cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await page.reload();
  await b.evaluate("showView('vehicles')");const offline=await b.evaluate("Promise.all(Object.values(ERFURT_VEHICLE_CATALOG.photos).map(photo=>fetch(photo.file).then(r=>r.ok)))");assert(offline.every(Boolean));
  assert.equal(await b.evaluate('state.vehicles.length'),2);assert.equal(b.errors.length,0);
  fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,types:await b.evaluate('ERFURT_VEHICLE_CATALOG.types.length'),photos:offline.length,checks:['CRUD and duplicate codes','plan assignment and rename','active vehicle guard','legacy and backup round trip','deletion preserves plans and history','terminal disabled with stable label','manual successful finish','search and mobile layout','offline photos']},null,2));
  console.log('Vehicle and terminal checks passed: '+output);
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
