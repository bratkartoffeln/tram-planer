'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,process.env.FAHRPLAN_ASSET_ROOT||'../app/src/main/assets');
(async()=>{
 const b=await session(root,path.resolve(__dirname,'../build/qa-cab-layout'));
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});await b.navigate();
  await b.evaluate('showView("vehicles");openVehicleBundlePreview("kt4dc")');
  assert.equal(await b.evaluate('document.getElementById("cabLayoutToggle")'),null);
  await b.evaluate('closeModal();state.settings.dev_mode=true');
  const centers=`Object.fromEntries([...document.querySelectorAll('[data-cab-layout-key]')].map(n=>{const r=n.getBoundingClientRect(),s=n.closest('.cab-stage').getBoundingClientRect();return [n.dataset.cabLayoutKey,[(r.x+r.width/2-s.x)/s.width,(r.y+r.height/2-s.y)/s.height]]}))`;
  const glyphs=`Object.fromEntries([...document.querySelectorAll('.cab-label,.cab-group-mark')].filter(n=>n.textContent.trim()).map(n=>{const range=document.createRange();range.selectNodeContents(n);const r=range.getBoundingClientRect(),s=n.closest('.cab-stage').getBoundingClientRect();return [n.dataset.cabLayoutKey,[(r.x+r.width/2-s.x)/s.width,(r.y+r.height/2-s.y)/s.height]]}))`;
  const near=(actual,expected,label,tolerance=.0001)=>{assert(Math.abs(actual[0]-expected[0])<tolerance&&Math.abs(actual[1]-expected[1])<tolerance,label+': '+JSON.stringify({actual,expected}));};
  for(const type of ['combino-basic','tramlink','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate('openVehicleBundlePreview('+JSON.stringify(type)+')');
   const before=await b.evaluate(centers);
   const textBefore=await b.evaluate(glyphs);
   await b.evaluate('toggleCabLayoutEditor()');
   const editing=await b.evaluate(centers);
   for(const [key,position] of Object.entries(before))near(editing[key],position,type+' preserves '+key);
   for(const [key,position] of Object.entries(textBefore))near((await b.evaluate(glyphs))[key],position,type+' preserves actual text baseline '+key);
   if(type==='combino-basic'){
    const spareGeometry=`(()=>{const button=document.querySelector('[data-cab-reserve="spare-0"]'),s=button.closest('.cab-stage').getBoundingClientRect();return [button,...button.children].map(node=>{const r=node.getBoundingClientRect();return [(r.x-s.x)/s.width,(r.y-s.y)/s.height,r.width/s.width,r.height/s.height]})})()`;
    const resting=await b.evaluate(spareGeometry),point=await b.evaluate(`(()=>{const r=document.querySelector('[data-cab-reserve="spare-0"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...point});await b.delay(160);
    const held=await b.evaluate(spareGeometry);
    await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...point});await b.delay(160);
    const released=await b.evaluate(spareGeometry);
    for(const [state,geometry] of [['held',held],['released',released]])for(let i=0;i<resting.length;i++)for(let coordinate=0;coordinate<4;coordinate++)assert(Math.abs(geometry[i][coordinate]-resting[i][coordinate])<.0001,'reserve button and overlays stay fixed while '+state);
   }
   // An edited SVG uses panel coordinates even though its DOM container is the button face.
   await b.evaluate('selectCabLayout("icon-next");editCabLayout("x",cabLayoutEditor.panel.width*.45);editCabLayout("y",cabLayoutEditor.panel.height*.55)');
   near((await b.evaluate(centers))['icon-next'],[.45,.55],type+' edited icon');
   await b.evaluate('undoCabLayout();undoCabLayout()');
   near((await b.evaluate(centers))['icon-next'],before['icon-next'],type+' undo icon');
   await b.evaluate('toggleCabLayoutEditor()');
   const after=await b.evaluate(centers);
   for(const [key,position] of Object.entries(before))near(after[key],position,type+' exits at '+key);
   for(const [key,position] of Object.entries(textBefore))near((await b.evaluate(glyphs))[key],position,type+' exits with actual text baseline '+key);
   await b.evaluate('closeModal()');
  }
  await b.evaluate(`openVehicleBundlePreview('combino-basic');cabLayoutEditor.draft['label-next']={fontFamily:'Georgia',fontSize:32,bold:true};cabLayoutPersist();cabLayoutRefresh()`);
  const styled=await b.evaluate(glyphs);await b.evaluate('toggleCabLayoutEditor()');
  near((await b.evaluate(glyphs))['label-next'],styled['label-next'],'custom font and size keep their actual baseline');
  await b.evaluate(`selectCabLayout('label-next');editCabLayout('x',cabLayoutEntryValue(cabLayoutEditor,cabLayoutEditor.entries.find(entry=>entry.key==='label-next')).x+15);toggleCabLayoutEditor()`);
  const panelWidth=await b.evaluate('cabLayoutEditor.panel.width');near((await b.evaluate(glyphs))['label-next'],[styled['label-next'][0]+15/panelWidth,styled['label-next'][1]],'editing X preserves the natural text baseline');await b.evaluate('closeModal()');
  await b.evaluate('openVehicleBundlePreview("kt4dc");toggleCabLayoutEditor();selectCabLayout("icon-next")');
  const drag=await b.evaluate(`(()=>{const r=document.querySelector('[data-cab-layout-key="icon-next"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`),initial=await b.evaluate(centers);
  await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...drag});
  for(let i=1;i<=4;i++)await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',button:'left',buttons:1,x:drag.x+i*5,y:drag.y+i*3});
  await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,x:drag.x+20,y:drag.y+12});
  assert.equal(await b.evaluate('cabLayoutEditor.history.length'),1,'a drag is one undo step');
  assert((await b.evaluate(centers))['icon-next'][0]>initial['icon-next'][0]);
  await b.evaluate('undoCabLayout()');near((await b.evaluate(centers))['icon-next'],initial['icon-next'],'undo complete drag');
  await b.evaluate('editCabLayout("x",700);editCabLayout("y",420)');
  const exported=await b.evaluate('cabLayoutExportData()');
  assert.deepEqual(exported.cab.layout['icon-next'],{x:700,y:420});
  await b.evaluate('window.nativeLayout=null;window.AndroidBackup={saveCabLayout:json=>nativeLayout=JSON.parse(json)};exportCabLayout()');
  assert.deepEqual(await b.evaluate('nativeLayout'),exported);
  await b.evaluate('delete window.AndroidBackup');
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const dimensions=await b.evaluate('({width:cabLayoutEditor.panel.width,height:cabLayoutEditor.panel.height})');
  near((await b.evaluate(centers))['icon-next'],[700/dimensions.width,420/dimensions.height],'mobile resize');
  await b.evaluate('closeModal();openVehicleBundlePreview("kt4dc");toggleCabLayoutEditor()');
  near((await b.evaluate(centers))['icon-next'],[700/dimensions.width,420/dimensions.height],'saved layout');
  await b.screenshot('editor-mobile.png');
  assert.equal(b.errors.length,0);console.log('Cab layout: all 8 panel families retain icon/text positions, edited panel coordinates, undo, resize and saved layout passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
