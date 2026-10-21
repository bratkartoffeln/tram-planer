'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),session=require('../tools/browser-session.cjs');
const output=path.resolve(__dirname,'../build/qa-cab-layout-export');
(async()=>{
 const b=await session(path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets'),output);
 try{
  await b.navigate();await b.evaluate('showView("vehicles");setVehicleCatalog(true);window.exportCalls=[];window.AndroidBackup={saveCabLayouts:json=>exportCalls.push(JSON.parse(json))}');
  assert.equal(await b.evaluate('document.getElementById("exportAllCabLayoutsButton")'),null);
  await b.evaluate('exportAllCabLayouts()');assert.deepEqual(await b.evaluate('exportCalls'),[]);
  await b.evaluate(`state.settings.dev_mode=true;showView('vehicles');setVehicleCatalog(true);localStorage.setItem(CAB_LAYOUT_STORAGE,JSON.stringify({[VEHICLE_BUNDLES.default.cab.image]:{'label-next':{text:'Weiter',background:'transparent'}},[VEHICLE_BUNDLES.kt4dc.cab.image]:{'icon-next':{x:222,iconSize:80},'control-reserve-0':{action:'passenger',icon:'passenger',text:'Info'}},[VEHICLE_BUNDLES.tramlink.cab.image]:{'label-next':{text:'Nächste Station',fontFamily:'Arial'}}}));`);
  const original=await b.evaluate('JSON.stringify(state)');
  assert.equal(await b.evaluate('document.querySelector("#vehicleCatalog #exportAllCabLayoutsButton")!==null'),true);
  // Catalog filters and never opening a preview must not limit the export.
  await b.evaluate('document.getElementById("vehicleTypeSearch").value="Tramlink";filterVehicleCatalog();document.getElementById("exportAllCabLayoutsButton").click()');
  assert.equal(await b.evaluate('exportCalls.length'),1);
  const data=await b.evaluate('exportCalls[0]');assert.equal(data.format,'fahrplan-manager-cab-layouts');assert.equal(data.schemaVersion,1);
  assert.equal(new Set(data.layouts.map(item=>item.image)).size,8);
  assert.equal(new Set(data.layouts.map(item=>JSON.stringify([item.image,item.width,item.height,item.cab.layout]))).size,data.layouts.length);
  const ids=data.layouts.flatMap(item=>item.vehicleTypes);
  assert.equal(ids.length,24);assert.equal(new Set(ids).size,24);
  assert.deepEqual(new Set(ids),new Set(['default',...await b.evaluate('ERFURT_VEHICLE_CATALOG.types.map(type=>type.id)')]));
  for(const item of data.layouts){assert.equal(item.format,'fahrplan-manager-cab-layout');assert.equal(item.schemaVersion,1);assert(item.targetBundle);assert(item.cab.layout);}
  assert.equal(data.layouts.find(item=>item.targetBundle==='default').cab.layout['label-next'].text,'Weiter');
  const kt4dc=data.layouts.find(item=>item.vehicleTypes.includes('kt4dc'));
  assert.equal(kt4dc.cab.layout['icon-next'].iconSize,80);assert.equal(kt4dc.cab.layout['control-reserve-0'].action,'passenger');
  // Existing compiled overlays and local sparse edits are both retained.
  await b.evaluate(`window.VEHICLE_BUNDLES={...VEHICLE_BUNDLES,kt4dc:{...VEHICLE_BUNDLES.kt4dc,cab:{...VEHICLE_BUNDLES.kt4dc.cab,layout:{'icon-next':{color:'#112233'}}}},'combino-basic':{...VEHICLE_BUNDLES['combino-basic'],cab:{...VEHICLE_BUNDLES['combino-basic'].cab,layout:{'icon-next':{color:'#445566'}}}}}`);
  const variant=await b.evaluate('cabLayoutAllExportData()');
  assert.equal(variant.layouts.find(item=>item.vehicleTypes.includes('combino-basic')).cab.layout['icon-next'].color,'#445566');
  assert.deepEqual(variant.layouts.find(item=>item.vehicleTypes.includes('kt4dc')).cab.layout['icon-next'],{color:'#112233',x:222,iconSize:80});
  // Actual browser download follows the same JSON format as the native bridge.
  await b.cdp('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:output});
  const file=path.join(output,'cab-layouts-alle.json');if(fs.existsSync(file))fs.unlinkSync(file);
  await b.evaluate('delete window.AndroidBackup;document.getElementById("exportAllCabLayoutsButton").click()');
  for(let i=0;i<50&&!fs.existsSync(file);i++)await b.delay(100);
  assert.deepEqual(JSON.parse(fs.readFileSync(file,'utf8')),variant);
  assert.equal(await b.evaluate('JSON.stringify(state)'),original);
  await b.evaluate('state.settings.dev_mode=false;showView("vehicles")');assert.equal(await b.evaluate('document.getElementById("exportAllCabLayoutsButton")'),null);
  assert.equal(b.errors.length,0);console.log('All-layout export: Dev gate, 8 panel images/24 type mappings, distinct layouts, saved drafts, compiled variants, one native call and actual JSON download passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
