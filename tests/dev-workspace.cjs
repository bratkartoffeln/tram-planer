'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const session=require('../tools/browser-session.cjs'),{chromium}=require('../build/qa-deps/node_modules/playwright');
(async()=>{
 const output=path.resolve(__dirname,'../build/qa-dev-workspace'),b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];page.setDefaultTimeout(8000);
  await page.setViewportSize({width:1440,height:1000});await page.goto(b.origin,{timeout:60000,waitUntil:'domcontentloaded'});
  await b.evaluate("state.settings.dev_options_unlocked=true;state.settings.dev_mode=true;state.vehicles=[{id:'vehicle-workspace',code:'801',typeId:'tramlink',createdAt:1}];showView('vehicles');openVehicleBundlePreview('tramlink','vehicle-workspace')");
  assert.match(await page.locator('#cabWorkspaceScope').innerText(),/Fahrzeug 801.*nur diese Bahn/);
  await page.locator('#cabLayoutToggle').click();assert.equal(await b.evaluate('cabLayoutAllowed()'),true);
  const boxes=await b.evaluate("[document.querySelector('.cab-console'),document.querySelector('.cab-layout-tools')].map(e=>e.getBoundingClientRect().toJSON())");assert(boxes[0].bottom<=boxes[1].top,'canvas and properties share one page flow');
  await b.evaluate("selectCabLayout('icon-next');editCabLayout('x',600)");assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),600);
  await page.locator('#cabLayoutUndo').click();assert.notEqual(await b.evaluate("cabLayoutEditor.draft['icon-next']?.x"),600);await page.locator('#cabLayoutRedo').click();assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),600);
  // New edits invalidate redo; a group move and alignment remain one history action.
  await b.evaluate("selectCabWorkspaceElement('icon-back',true);window.groupBefore=cabWorkspaceOrigins();editCabLayout('x',groupBefore[cabLayoutEditor.selected].x+20)");
  const group=await b.evaluate('cabWorkspaceOrigins()'),before=await b.evaluate('groupBefore');for(const key of Object.keys(before))assert(Math.abs(group[key].x-before[key].x-20)<.01);
  // Real Shift-click selection followed by a mouse drag moves the complete group.
  await b.evaluate("cabLayoutEditor.selection=new Set(['icon-next']);selectCabLayout('icon-next')");await page.keyboard.down('Shift');await page.locator('[data-cab-layout-key="icon-back"]').click();await page.keyboard.up('Shift');assert.equal(await b.evaluate('cabLayoutEditor.selection.size'),2);
  const mouseBefore=await b.evaluate('cabWorkspaceOrigins()'),dragBox=await page.locator('[data-cab-layout-key="icon-next"]').boundingBox(),historyBefore=await b.evaluate('cabLayoutEditor.history.length');
  await page.mouse.move(dragBox.x+dragBox.width/2,dragBox.y+dragBox.height/2);await page.mouse.down();await page.mouse.move(dragBox.x+dragBox.width/2+12,dragBox.y+dragBox.height/2+6,{steps:3});await page.mouse.up();
  const mouseAfter=await b.evaluate('cabWorkspaceOrigins()');assert(mouseAfter['icon-next'].x>mouseBefore['icon-next'].x);assert(Math.abs((mouseAfter['icon-next'].x-mouseBefore['icon-next'].x)-(mouseAfter['icon-back'].x-mouseBefore['icon-back'].x))<.01);assert.equal(await b.evaluate('cabLayoutEditor.history.length'),historyBefore+1);
  await b.evaluate("alignCabSelection('centerY')");const aligned=await b.evaluate('Object.values(cabWorkspaceOrigins()).map(v=>v.y)');assert(Math.abs(aligned[0]-aligned[1])<.01);
  await b.evaluate('undoCabLayout();redoCabLayout()');assert.equal(await b.evaluate('cabLayoutEditor.redo.length'),0);
  await b.evaluate("cabLayoutEditor.selection=new Set(['icon-next']);selectCabLayout('icon-next');cabLayoutEditor.snap=true;window.snapBefore=clone(cabLayoutEditor.draft);moveCabWorkspaceSelection(603,403);cabLayoutPersist();cabLayoutRefresh()");assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),600);assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].y"),400);
  await page.getByRole('button',{name:'Pult vergrößern',exact:true}).click();assert.equal(await page.locator('#cabZoomValue').innerText(),'125 %');await page.getByRole('button',{name:'Ganzes Pult anzeigen',exact:true}).click();assert.equal(await page.locator('#cabZoomValue').innerText(),'100 %');
  await b.evaluate("cabLayoutEditor.grid=true;cabLayoutEditor.guides=true;refreshCabWorkspace()");assert(await page.locator('.cab-show-grid').count());assert(await page.locator('.cab-guide-x').isVisible());
  await page.locator('#cabFunctionTab').click();assert(await page.locator('#cabControlInspector #cabReserveMenu').count());
  assert(await page.getByRole('button',{name:'Drücken testen',exact:false}).isVisible());
  // Isolated auditions, with fullscreen release kept silent.
  await b.evaluate("window.soundChecks=[];playCabReserveSound=(sound)=>soundChecks.push(sound);openCabControlMenu('doors')");
  await page.locator('[data-cab-tone-phase=press]').selectOption('mechanical:down');await page.getByRole('button',{name:'Drücken testen',exact:false}).click();
  await page.locator('[data-cab-tone-phase=release]').selectOption('none');await page.getByRole('button',{name:'Loslassen testen',exact:false}).click();assert.deepEqual(await b.evaluate('soundChecks'),['mechanical:down']);
  await b.evaluate("openCabControlMenu('fullscreen')");assert(await page.locator('[data-cab-tone-phase=release]').isDisabled());await page.getByRole('button',{name:'Loslassen testen',exact:false}).click();assert.deepEqual(await b.evaluate('soundChecks'),['mechanical:down']);
  await b.evaluate('appBack()');assert.equal(await page.locator('#cabReserveMenu').count(),0);assert.equal(await b.evaluate('cabLayoutAllowed()'),true);
  const exported=await b.evaluate('cabLayoutExportData()');exported.cab.layout['icon-next']={x:750,y:450};
  await page.locator('#cabLayoutImport').setInputFiles({name:'cab.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.locator('#cabTransferPreview').waitFor();assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),600);
  await page.locator('#cabTransferPreview .primary').click();assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),750);
  const invalid={...exported,vehicleId:'vehicle-someone-else'};await page.locator('#cabLayoutImport').setInputFiles({name:'other.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});await page.locator('#cabWorkspaceNotice').waitFor();assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),750);
  await b.evaluate('previewCabLayoutReset()');assert(await page.locator('#cabTransferPreview').isVisible());await page.locator('#cabTransferPreview').getByRole('button',{name:'Abbrechen',exact:true}).click();assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),750);
  await b.evaluate('previewCabLayoutReset();confirmCabTransfer()');assert.deepEqual(await b.evaluate('cabLayoutEditor.draft'),{});await page.locator('#cabLayoutUndo').click();assert.equal(await b.evaluate("cabLayoutEditor.draft['icon-next'].x"),750);
  await b.evaluate("window.workspaceSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key===CAB_LAYOUT_STORAGE)throw Error('Quota exceeded');return workspaceSetItem.call(this,key,value)};editCabLayout('x',751)");assert.match(await page.locator('#cabWorkspaceStatus').innerText(),/Speichern fehlgeschlagen/);await b.evaluate('Storage.prototype.setItem=workspaceSetItem;cabLayoutPersist()');assert.match(await page.locator('#cabWorkspaceStatus').innerText(),/lokal gespeichert/);
  await page.screenshot({path:path.join(output,'editor-desktop.png')});
  for(const viewport of [{width:390,height:844},{width:768,height:900},{width:844,height:390}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(150);await b.evaluate("openCabControlMenu('doors')");assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);assert.equal(await page.locator('#cabReserveMenu').evaluate(e=>e.scrollWidth<=e.clientWidth),true);await page.screenshot({path:path.join(output,'editor-'+viewport.width+'.png')});
  }
  await page.setViewportSize({width:390,height:844});await b.evaluate("closeModal();showView('new')");assert.equal(await page.locator('#stopEditor details[open]').count(),1);
  await page.locator('.bulk-times summary').click();await page.locator('#bulkTravel').fill('3');await page.locator('#bulkPause').fill('1');await page.locator('#bulkApplyPause').check();await page.getByRole('button',{name:'Zeiten übernehmen',exact:true}).click();
  assert.equal(await b.evaluate('draftStops[0].travel+draftStops[0].pause'),0);assert.equal(await b.evaluate('draftStops.slice(1).every(s=>s.travel===3&&s.pause===1)'),true);
  await page.locator('#bulkTravel').fill('241');await page.getByRole('button',{name:'Zeiten übernehmen',exact:true}).click();assert.equal(await b.evaluate('draftStops[1].travel'),3);
  await b.evaluate("window.AndroidAnnouncements={stop:()=>{}};reallyStartTrip((state.plans=[{id:'plan-workspace',routeId:'W2D',routeName:'Test',line:'2',tram:'801',vehicleTypeId:'tramlink',stops:allRouteStops('W2D')}])[0].id,fmtTime(Date.now()))");
  await page.locator('.live-cab-zoom [data-zoom=".25"]').click();assert.equal(await page.locator('.live-cab-zoom output').innerText(),'125 %');await b.evaluate('nextStop()');assert.equal(await page.locator('.live-cab-zoom output').innerText(),'125 %');await page.locator('.live-cab-zoom [data-fit]').click();
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));const toolbar=await page.locator('.drive-toolbar').boundingBox();assert(toolbar.y>=0&&toolbar.y<20);assert(await page.locator('#quickDoors').isVisible());
  await page.screenshot({path:path.join(output,'sticky-driver-mobile.png')});
  await b.evaluate("showView('network');toggleNetworkEditor();networkEditSelection={stop:'Anger'};updateNetworkStop('name','Anger Test')");const edited=await b.evaluate('clone(state.networkEdits)');await b.evaluate('undoNetworkEdit();redoNetworkEdit()');assert.deepEqual(await b.evaluate('state.networkEdits'),edited);
  await b.evaluate('loadProjectNetworkPlan()');assert.deepEqual(await b.evaluate('state.networkEdits'),edited);await page.locator('.modal .primary').click();assert.deepEqual(await b.evaluate('state.networkEdits'),await b.evaluate('bundledNetworkEdits()'));await b.evaluate('undoNetworkEdit()');assert.deepEqual(await b.evaluate('state.networkEdits'),edited);
  assert.equal(b.errors.length,0,JSON.stringify(b.errors));fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['scoped editor','desktop inspector','mobile portrait and landscape','undo redo','group transforms','grid snap and guides','zoom and fit','isolated sound tests','silent fullscreen release','validated import preview and owner guard','reset preview','bulk stop times and bounds','sticky driver controls','network transfer preview and redo']},null,2));console.log('Dev workspace checks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
