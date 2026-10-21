'use strict';
// Dependency-free browser integration test using Edge/Chromium's DevTools protocol.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'../app/src/main/assets');
const output=path.resolve(__dirname,'../build/qa-network');fs.mkdirSync(output,{recursive:true});
const browserPath=process.env.FAHRPLAN_BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const debugPort=9500+Math.floor(Math.random()*1000);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let proc,server,socket;let seq=0;const pending=new Map();
async function cdp(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const r=await cdp('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function run(){
 server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}const ext=path.extname(file);res.setHeader('Content-Type',({'.css':'text/css','.js':'text/javascript','.html':'text/html','.json':'application/json','.mp3':'audio/mpeg','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'})[ext]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 proc=spawn(browserPath,['--headless=new','--disable-gpu','--in-process-gpu','--no-sandbox','--no-first-run','--no-default-browser-check','--remote-debugging-port='+debugPort,'--user-data-dir='+path.join(output,'profile-'+Date.now()),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let tabs;for(let i=0;i<30;i++){try{tabs=await(await fetch('http://127.0.0.1:'+debugPort+'/json',{signal:AbortSignal.timeout(1000)})).json();break;}catch{await delay(100);}}
 if(!tabs)throw new Error('Browser DevTools did not start');
 socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>socket.addEventListener('open',r,{once:true}));socket.onmessage=e=>{const r=JSON.parse(e.data);if(r.id){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(r.error):p.resolve(r.result);}};
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await cdp('Page.navigate',{url:origin});for(let i=0;i<100;i++){if(await evaluate("typeof state!=='undefined' && !!document.querySelector('#view .hero')"))break;await delay(100);}
 assert.equal(await evaluate("Object.keys(ROUTES).length"),24);
 assert.equal(await evaluate("ERFURT_NETWORK.routes.EF4R.stops.includes('Lange Brücke')"),true);
 assert.equal(await evaluate("ERFURT_NETWORK.routes.EF6R.stops[1]"),'Milchinselstraße');
 assert.equal(await evaluate("Object.values(ERFURT_NETWORK.routes).every(r=>r.stops.every(n=>ERFURT_NETWORK.positions[n]))"),true);
 await evaluate("showView('network');openLineEditor('EF4R')");
 assert.equal(await evaluate('networkServiceMode'),'current');
 assert.equal(await evaluate("ERFURT_NETWORK.constructionRoutes.EF1BH.stops[0]"),'Rieth');
 assert.equal(await evaluate("ERFURT_NETWORK.constructionRoutes.EF6BH.stops[0]"),'Europaplatz');
 assert.equal(await evaluate("ERFURT_NETWORK.constructionRoutes.EF6BH.stops.includes('Vilniuser Straße')"),false);
 assert.equal(await evaluate("Math.abs(document.getElementById('networkCanvasSection').getBoundingClientRect().width-document.getElementById('view').getBoundingClientRect().width)<2"),true);
 assert.equal(await evaluate("document.getElementById('lineInspector').getBoundingClientRect().top>=document.getElementById('networkCanvasSection').getBoundingClientRect().bottom"),true);
 // Every displayed stop must have a drawn connection, including reverse-only stops.
 for(const mode of ['current','regular']){
  await evaluate('setNetworkServiceMode('+JSON.stringify(mode)+')');
  assert.deepEqual(await evaluate("(()=>{const linked=new Set([...document.querySelectorAll('.network-link')].flatMap(e=>[e.dataset.from,e.dataset.to]));return Object.keys(ERFURT_NETWORK.positions).filter(n=>!linked.has(n));})()"),[]);
  assert.equal(await evaluate("(()=>{const edges=networkConnections(),seen=new Set(['Anger']);let changed=true;while(changed){changed=false;for(const e of edges){if(seen.has(e.from)&&!seen.has(e.to)){seen.add(e.to);changed=true}if(seen.has(e.to)&&!seen.has(e.from)){seen.add(e.from);changed=true}}}return seen.size===Object.keys(ERFURT_NETWORK.positions).length})()"),true);
  // Distinct service lines on one section have separate visible midpoints,
  // while both directions of the same line share a single lane.
  const lanes=await evaluate(`(()=>{const groups=new Map(),keys=new Set();let duplicate=false;for(const p of document.querySelectorAll('.network-link')){if(keys.has(p.dataset.edge))duplicate=true;keys.add(p.dataset.edge);const pair=networkPair(p.dataset.from,p.dataset.to);if(!groups.has(pair))groups.set(pair,[]);groups.get(pair).push(p);}let bundles=0,minGap=Infinity;for(const group of groups.values()){if(group.length<2)continue;bundles++;const points=group.map(p=>p.getPointAtLength(p.getTotalLength()/2));for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)minGap=Math.min(minGap,Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y));}return {bundles,minGap,duplicate}})()`);
  assert(lanes.bundles>0);assert(lanes.minGap>7.9);assert.equal(lanes.duplicate,false);
 }
 await evaluate("setNetworkServiceMode('current')");
 assert.ok(await evaluate("document.querySelectorAll('.network-link.inactive').length")>0);
 assert.equal(await evaluate("lineDraft.stops.length"),28);
 await evaluate("document.getElementById('editorName').value='Testlinie';document.getElementById('editorName').dispatchEvent(new Event('input'));document.getElementById('editorCode').value='R4';document.getElementById('editorCode').dispatchEvent(new Event('input'));saveLineDraft()");
 const id=await evaluate('lineDraft.id');assert.ok(id.startsWith('custom-'));
 assert.equal(await evaluate('routeLabel(lineDraft.id)'),'R4');
 assert.equal(await evaluate('ROUTES[lineDraft.id].stops.includes("Walter-Gropius-Schule")'),true);
 await evaluate("lineDraft=null;openLineEditor();lineDraft.name='Eigene Strecke';lineDraft.line='99';document.querySelector('[data-stop=\"0\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));document.querySelector('[data-stop=\"1\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));lineDraft.stops[1].travel=7;saveLineDraft()");
 const custom=await evaluate('lineDraft.id');assert.equal(await evaluate('ROUTES[lineDraft.id].times[1]'),7);
 assert.equal(await evaluate('routeLabel(lineDraft.id)'),'L99');
 await evaluate('startDraftWithRoute('+JSON.stringify(custom)+')');assert.equal(await evaluate('draftStops[1].travel'),7);
 await evaluate("document.getElementById('vehicleInput').value='615';saveNewPlan()");assert.equal(await evaluate('state.plans[0].stops[1].travel'),7);
 assert.equal(await evaluate('state.plans[0].routeCode'),'L99');
 await evaluate('openLineEditor('+JSON.stringify(custom)+');lineDraft.code="ZOO7";reverseLineDraft();saveLineDraft()');assert.equal(await evaluate('state.plans[0].stops[0].name'),'Europaplatz');
 assert.equal(await evaluate('routeLabel(lineDraft.id)'),'ZOO7');
 // Local persistence and normalization of backup routes.
 await cdp('Page.reload');await delay(500);
 assert.equal(await evaluate('Object.keys(state.customRoutes).length'),2);
 assert.equal(await evaluate('routeLabel('+JSON.stringify(custom)+')'),'ZOO7');
 assert.equal(await evaluate('Object.keys(normalizeState(JSON.parse(JSON.stringify(state))).customRoutes).length'),2);
 assert.equal(await evaluate("Object.keys(validCustomRoutes({'__proto__':{},'custom-bad':{name:'x',line:'x',stops:['x']}})).length"),0);
 await evaluate("showView('network');openLineEditor('EF1H')");
 // Dragging into empty space leaves the route and its undo history unchanged.
 const original=await evaluate('clone(lineDraft)');
 assert.equal(await evaluate('document.getElementById("lineUndoButton").disabled'),true);
 const dragTo=async(target,touch=false,cancel=false)=>{
  const coords=await evaluate(`(()=>{const svg=document.getElementById('lineMapSvg'),g=svg.querySelector('.draft-node circle');g.scrollIntoView({block:'center',inline:'center'});const r=g.getBoundingClientRect(),p=svg.createSVGPoint();p.x=${target.x};p.y=${target.y};const end=p.matrixTransform(svg.getScreenCTM());return {x:r.x+r.width/2,y:r.y+r.height/2,tx:end.x,ty:end.y}})()`);
  if(touch){await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:coords.x,y:coords.y,id:1}]});await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:coords.tx,y:coords.ty,id:1}]});await cdp('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});}
  else{await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:coords.x,y:coords.y,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:coords.tx,y:coords.ty,button:'left',buttons:1});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:coords.tx,y:coords.ty,button:'left',clickCount:1});}
 };
 await dragTo({x:900,y:100});assert.deepEqual(await evaluate('lineDraft'),original);
 assert.equal(await evaluate('lineUndo.length'),0);
 const target=await evaluate('networkPositions()[lineDraft.stops[1].name]');
 await dragTo(target);
 assert.equal(await evaluate('lineDraft.stops[0].name'),original.stops[1].name);
 assert.equal(await evaluate('lineDraft.stops[0].x'),target.x);
 assert.equal(await evaluate('lineDraft.stops.length'),original.stops.length);
 await evaluate('document.getElementById("lineUndoButton").click()');assert.deepEqual(await evaluate('lineDraft'),original);
 await dragTo(target,true,true);assert.deepEqual(await evaluate('lineDraft'),original);
 await dragTo(target,true);assert.equal(await evaluate('lineDraft.stops[0].name'),original.stops[1].name);
 await evaluate('undoLineDraft()');assert.deepEqual(await evaluate('lineDraft'),original);
 assert.equal(await evaluate("[...document.querySelectorAll('.network-link')].every(e=>getComputedStyle(e).filter==='grayscale(1)')"),true);
 for(const action of ["updateLineField('name','Changed')","updateLineField('color','#123456')","updateLineStop(1,'travel',17)","updateLineStop(1,'name','Anger')","removeLineStop(1)","moveLineStop(1,-1)","reverseLineDraft()"]){await evaluate(action);await evaluate('undoLineDraft()');assert.deepEqual(await evaluate('lineDraft'),original);}
 await evaluate("lineDraft=null;openLineEditor();lineDraft.name='Kartenlinie';lineDraft.line='88';document.getElementById('lineMapSvg').querySelector('rect').dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:900,clientY:100}))");
 assert.equal(await evaluate('lineDraft.stops.length'),0);
 await evaluate("document.querySelector('[data-stop=\"0\"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));document.querySelector('[data-stop=\"1\"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));moveLineStop(1,-1);lineDraft.stops[1].travel=0;saveLineDraft()");
 assert.equal(await evaluate('normalizeState(state).customRoutes[lineDraft.id].times[1]'),0);
 await evaluate("lineDraft=null;showView('network')");
 for(const mode of ['current','regular']){
  await evaluate('setNetworkServiceMode('+JSON.stringify(mode)+')');
  assert.equal(await evaluate("document.querySelectorAll('.network-route-button').length"),12);
  const ids=await evaluate("[...document.querySelectorAll('.network-route-button')].map(b=>b.dataset.route)");
  for(const route of ids){
   await evaluate('document.querySelector(\'[data-route="'+route+'"]\').click()');
   assert.equal(await evaluate('networkSelectedRoute'),route);
   assert.equal(await evaluate("document.querySelectorAll('.network-route-button[aria-pressed=true]').length"),1);
   assert.ok(await evaluate("document.querySelectorAll('.network-link.is-muted').length")>0);
   assert.ok(await evaluate("document.querySelectorAll('.network-link:not(.is-muted)').length")>0);
   const stopMarkers=await evaluate(`(()=>{const service=networkServiceMode==='regular'?ERFURT_NETWORK.routes:ERFURT_NETWORK.serviceRoutes,r=service[networkSelectedRoute],color=state.networkEdits.lineColors[r.line]||r.color,stops=[...document.querySelectorAll('.network-node')];return {expected:new Set(r.stops).size,selected:stops.filter(g=>g.classList.contains('is-route-stop')).length,arrows:document.querySelectorAll('.network-stop-direction').length,correct:stops.every(g=>{const chosen=r.stops.includes(g.dataset.name),c=g.querySelector('circle');return chosen?c.getAttribute('fill')===color&&c.getAttribute('stroke')===color:!g.querySelector('.network-stop-direction')&&c.getAttribute('fill')==='var(--panel)'})}})()`);
   assert.equal(stopMarkers.selected,stopMarkers.expected);assert.equal(stopMarkers.arrows,stopMarkers.expected);assert.equal(stopMarkers.correct,true);
   await evaluate('document.querySelector(\'[data-route="'+route+'"]\').click()');
   assert.equal(await evaluate('networkSelectedRoute'),null);
   assert.equal(await evaluate("document.querySelectorAll('.network-link.is-muted').length"),0);
   assert.equal(await evaluate("document.querySelectorAll('.network-stop-direction,.network-node.is-route-stop').length"),0);
  }
 }
 // A shared straight section points in opposite directions on the return trip.
 await evaluate("setNetworkServiceMode('regular');toggleNetworkRoute('EF2H')");
 const outbound=await evaluate("[...document.querySelectorAll('.network-node')].find(g=>g.dataset.name==='Anger').querySelector('.network-stop-direction').getAttribute('transform')");
 await evaluate("toggleNetworkRoute('EF2R')");
 const inbound=await evaluate("[...document.querySelectorAll('.network-node')].find(g=>g.dataset.name==='Anger').querySelector('.network-stop-direction').getAttribute('transform')");
 assert.notEqual(outbound,inbound);
 await evaluate("state.networkEdits.lineColors['2']='#ffff00';renderNetworkMap()");
 assert.equal(await evaluate("[...document.querySelectorAll('.network-node.is-route-stop circle')].every(c=>c.getAttribute('fill')==='#ffff00'&&c.getAttribute('stroke')==='#ffff00')"),true);
 assert.equal(await evaluate("document.querySelector('.network-stop-direction').getAttribute('stroke')"),'#111827');
 assert.equal(await evaluate("[...document.querySelectorAll('.network-stop-direction')].every(arrow=>arrow.getAttribute('fill')==='none'&&!/[zZ]/.test(arrow.getAttribute('d')))"),true);
 await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true}).then(r=>fs.writeFileSync(path.join(output,'selected-direction.png'),Buffer.from(r.data,'base64')));
 await evaluate("openLineEditor('EF2R')");
 assert.equal(await evaluate("document.querySelectorAll('.network-stop-direction,.network-node.is-route-stop').length"),0);
 await evaluate("lineDraft=null;networkSelectedRoute=null;delete state.networkEdits.lineColors['2'];showView('network')");

 await evaluate("zoomNetwork('fit')");assert.equal(await evaluate("Math.abs(document.getElementById('lineMapSvg').getBoundingClientRect().width-document.getElementById('networkMap').clientWidth)<1"),true);
 await evaluate("window.AndroidBackup={save:json=>window.testBackup=json};exportData();state.customRoutes={};syncCustomRoutes();importData({target:{files:[new File([window.testBackup],'backup.json',{type:'application/json'})]}})");await delay(150);
 assert.equal(await evaluate('Object.keys(state.customRoutes).length'),3);
 await evaluate('openLineEditor('+JSON.stringify(custom)+');deleteCustomLine();document.querySelector(".modal-footer .danger").click()');
 assert.equal(await evaluate('Object.keys(state.customRoutes).length'),2);
 assert.equal(await evaluate('state.plans.length'),1);
 await evaluate("openLineEditor('EF1H')");
 await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}).then(r=>fs.writeFileSync(path.join(output,'desktop.png'),Buffer.from(r.data,'base64')));
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await evaluate("showView('network')");
 assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
 await cdp('Page.captureScreenshot',{format:'png'}).then(r=>fs.writeFileSync(path.join(output,'mobile.png'),Buffer.from(r.data,'base64')));
 // Confirm service worker caches the new modules for an offline restart.
 await evaluate("navigator.serviceWorker.ready.then(()=>true)");
 await delay(1200);
 assert.equal(await evaluate("caches.open('fahrplan-manager-tablet-v6.2.9-fixed-sockets').then(async c=>!!(await c.match('./line-editor.js'))&&!!(await c.match('./erfurt-network.js')))"),true);
 await cdp('Network.enable');await cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
 await cdp('Page.reload');await delay(600);assert.equal(await evaluate('Object.keys(ROUTES).length'),26);
 await evaluate("showView('network')");assert.equal(await evaluate('!!document.getElementById("lineMapSvg")'),true);
 fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({passed:true,checks:['12 directional EVAG templates','custom route save/edit/reverse','simulation times','plan snapshots','reload and backup normalization','real pointer drag','mobile overflow','offline cache']},null,2));
 console.log('Network integration checks passed. Screenshots: '+output);
 await cdp('Browser.close');
}
run().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{socket?.close();if(proc)proc.kill();server?.closeAllConnections();server?.close();});
