/* Integration checks against the real app assets; no Android device required.
 * Run with Node and Playwright installed. Optional environment variables:
 * FAHRPLAN_BROWSER_PATH, FAHRPLAN_QA_OUTPUT, CODEX_PRIMARY_RUNTIME_NODE_MODULES.
 * Android playback is mocked only in timing/flow tests. The final smoke test
 * uses real Web Audio decoding/playback and the real service worker offline.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
let playwright;
try { playwright = require('playwright'); }
catch {
  playwright = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules', 'playwright'));
}
const ASSETS = path.resolve(__dirname, '../app/src/main/assets');
const OUTPUT = process.env.FAHRPLAN_QA_OUTPUT || path.resolve(__dirname, '../build/qa-integration');
const BROWSER = process.env.FAHRPLAN_BROWSER_PATH || '/tmp/fahrplanmanager-playwright/chrome-headless-shell-linux64/chrome-headless-shell';
const BASE = Date.parse('2026-10-18T10:00:00+02:00');
const KEY = 'fm_tablet_state_v1';
const stopNames = ['Wiesenhügel', 'Färberwaidweg', 'Abzweig Wiesenhügel', 'Blücherstraße', 'Sozialversicherungszentrum', 'Am Schwemmbach', 'Stadion Ost', 'Tschaikowskistraße', 'Robert-Koch-Straße', 'Hauptbahnhof', 'Anger', 'Fischmarkt/Rathaus', 'Domplatz'];
const announcementMap = JSON.parse(fs.readFileSync(path.join(ASSETS, 'audio/announcements.json'), 'utf8'));
const results = [];
const browserErrors = [];
let browser, server, origin;

function planFixture() {
  return {id:'plan-integration-fixture',routeId:'W2D',routeCode:'W2D',routeName:'Wiesenhügel → Domplatz',line:'2',tram:'615',createdAt:BASE-86400000,stops:stopNames.map((name,index)=>({name,travel:index?2:0,pause:0}))};
}
function stateFixture({active=false, now=BASE}={}) {
  const plan = planFixture();
  return {schemaVersion:2,plans:[plan],history:[],selectedPlanId:plan.id,settings:{dark_mode:false,show_eta:true,route_names:{}},active:active?{id:'run-integration-fixture',plan:structuredClone(plan),departure:'10:00',position:0,startedAtEpoch:now,actualStartEpoch:now,positionReachedAt:now,pauseEndEpoch:null,doorsOpen:false,trafficDelayMin:0,status:'running',suspendedAt:null,lastEmergencyId:null}:null};
}
function legacyFixture() {
  const legacyPlan = {...planFixture(),code:'FM-OLD-615',departure:'09:15'};
  delete legacyPlan.id;
  const active = {id:'run-legacy-615',plan:structuredClone(legacyPlan),position:1,startedAtEpoch:BASE-45*60000,actualStartEpoch:BASE-40*60000,positionReachedAt:BASE-30000,pauseEndEpoch:BASE+90000,doorsOpen:true,trafficDelayMin:3,status:'running',suspendedAt:null,lastEmergencyId:'h-legacy-emergency'};
  const resumeTrip = {...structuredClone(active),id:'run-legacy-resume',status:'suspended',suspendedAt:BASE-5*60000};
  return {plans:[legacyPlan],selectedCode:legacyPlan.code,active,settings:{dark_mode:true,show_eta:true,route_names:{W2D:'Meine Strecke'}},history:[
    {id:'h-legacy-drive',type:'FAHRT',at:BASE-86400000,title:'Ziel erreicht · Wiesenhügel → Domplatz',duration:'28:12',delta:2,line:'2',tram:'615',stop:'Domplatz'},
    {id:'h-legacy-emergency',type:'NOTFALL',at:BASE-5*60000,title:'Notfall · Färberwaidweg',note:'Testnotiz bleibt erhalten',stop:'Färberwaidweg',resumeTrip}
  ]};
}
async function openPage({seed=null,native=true,frozen=true,now=BASE,viewport={width:1280,height:960},traceAudio=false}={}) {
  const context = await browser.newContext({locale:'de-DE',timezoneId:'Europe/Berlin',viewport,serviceWorkers:'allow'});
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  page.on('pageerror',error=>browserErrors.push({url:page.url(),type:'pageerror',message:error.message}));
  page.on('console',message=>{if(message.type()==='error')browserErrors.push({url:page.url(),type:'console',message:message.text()});});
  await page.addInitScript(({seed,native,key,traceAudio})=>{
    if(seed && !localStorage.getItem('__integration_seeded')) {
      localStorage.setItem(key,JSON.stringify(seed));
      localStorage.setItem('__integration_seeded','1');
    }
    window.__qaAudio=[];
    window.__qaExport=null;
    window.AndroidBackup={save:json=>{window.__qaExport=JSON.parse(json);}};
    if(native) window.AndroidAnnouncements={
      play:(name,path)=>window.__qaAudio.push({event:'play',name,path,at:Date.now()}),
      stop:()=>window.__qaAudio.push({event:'stop',at:Date.now()})
    };
    if(traceAudio) {
      window.__qaSources=[];
      const start=AudioBufferSourceNode.prototype.start;
      const stop=AudioBufferSourceNode.prototype.stop;
      let nextId=1;
      const ids=new WeakMap();
      AudioBufferSourceNode.prototype.start=function(...args) {
        const id=nextId++;ids.set(this,id);
        window.__qaSources.push({event:'start',id,at:performance.now(),duration:this.buffer?.duration,sampleRate:this.buffer?.sampleRate});
        this.addEventListener('ended',()=>window.__qaSources.push({event:'ended',id,at:performance.now()}),{once:true});
        return start.apply(this,args);
      };
      AudioBufferSourceNode.prototype.stop=function(...args) {
        window.__qaSources.push({event:'stop',id:ids.get(this),at:performance.now()});
        return stop.apply(this,args);
      };
    }
  },{seed,native,key:KEY,traceAudio});
  if(frozen) {
    await page.clock.install({time:new Date(now-1000)});
    await page.clock.pauseAt(new Date(now));
  }
  await page.goto(origin+'/index.html',{waitUntil:'load'});
  await page.locator('#appVersion').filter({hasText:'v6.2.0 Android'}).waitFor();
  return {context,page};
}
const readState = page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
const audioEvents = (page,event='play')=>page.evaluate(event=>window.__qaAudio.filter(item=>item.event===event),event);
async function noPersonalCode(page) {
  assert.equal(await page.getByRole('button',{name:/Code kopieren/i}).count(),0);
  const visible = await page.locator('body').innerText();
  assert(!/persönliche[rn]?\s+Code|Code\s+kopieren|FM-OLD-615/i.test(visible));
}
async function screenshot(page,name) {
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:path.join(OUTPUT,name+'.png'),fullPage:false});
}
async function run(name,task) {
  const start=Date.now();
  try {
    const evidence=await task();
    results.push({name,status:'passed',milliseconds:Date.now()-start,evidence});
    console.log(JSON.stringify({name,status:'passed'}));
  } catch(error) {
    results.push({name,status:'failed',milliseconds:Date.now()-start,error:error.stack||String(error)});
    console.error(JSON.stringify({name,status:'failed',error:error.message}));
  }
  fs.writeFileSync(path.join(OUTPUT,'results.json'),JSON.stringify({results,browserErrors},null,2));
}
async function driverPage() {
  const opened=await openPage({seed:stateFixture({active:true})});
  await opened.page.locator('#nav button[data-view="driver"]').click();
  await opened.page.evaluate(()=>window.__qaAudio=[]);
  return opened;
}
async function testCancellation(label,action,verify) {
  await run('Ansage abbrechen: '+label,async()=>{
    const {context,page}=await driverPage();
    try {
      await page.locator('#nextStopBtn').click();
      await page.clock.runFor(400);
      await action(page);
      await page.clock.runFor(700);
      assert.deepEqual(await audioEvents(page),[]);
      assert((await audioEvents(page,'stop')).some(event=>event.at===BASE+400));
      if(verify)await verify(page);
      return {noPlaybackAfter1100ms:true};
    } finally { await context.close(); }
  });
}

(async()=>{
  fs.mkdirSync(OUTPUT,{recursive:true});
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.wav':'audio/wav'};
  server=http.createServer((request,response)=>{
    try {
      const requestPath=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      if(requestPath==='/favicon.ico'){response.writeHead(204);response.end();return;}
      const file=path.resolve(ASSETS,'.'+(requestPath==='/'?'/index.html':requestPath));
      if(!file.startsWith(ASSETS+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end('Not found');return;}
      response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':fs.statSync(file).size,'Cache-Control':'no-store'});
      fs.createReadStream(file).pipe(response);
    }catch(error){response.writeHead(400);response.end('Invalid request');}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  origin='http://127.0.0.1:'+server.address().port;
  browser=await playwright.chromium.launch({headless:true,executablePath:BROWSER,args:['--no-sandbox']});

  await run('Fahrplan erstellen, Abfahrt verpflichtend vorbereiten, Start und Ansage exakt nach 1 Sekunde',async()=>{
    const {context,page}=await openPage();
    try {
      const statusVersion=await page.locator('.settings-row').filter({has:page.getByText('Versionsnummer',{exact:true})}).locator('strong').innerText();
      assert.equal(await page.locator('#appVersion').innerText(),statusVersion);
      await noPersonalCode(page);
      await page.locator('#nav button[data-view="new"]').click();
      assert.equal(await page.locator('input[type="time"]').count(),0);
      await page.locator('#lineInput').fill('2');
      await page.locator('#vehicleInput').fill('615');
      await page.locator('.travel-input[data-index="1"]').fill('3');
      await page.locator('.pause-input[data-index="1"]').fill('2');
      assert.equal(await page.locator('#arr_1').innerText(),'+3 Min.');
      assert.equal(await page.locator('#arr_2').innerText(),'+7 Min.');
      await page.getByRole('button',{name:'Fahrplan speichern',exact:true}).click();
      let saved=await readState(page);
      assert.equal(saved.plans.length,1);
      assert.match(saved.plans[0].id,/^plan-[a-zA-Z0-9-]+$/);
      assert(!Object.hasOwn(saved.plans[0],'code'));
      assert(!Object.hasOwn(saved.plans[0],'departure'));
      assert.equal(await page.locator('#tripDepartureInput').inputValue(),'');
      assert(await page.locator('#startTripButton').isDisabled());
      await page.locator('#tripDepartureInput').fill('14:35');
      assert(!(await page.locator('#startTripButton').isDisabled()));
      assert.deepEqual((await page.locator('[data-plan-stop-index]').allTextContents()).slice(0,3),['14:35','14:38','14:42']);
      await noPersonalCode(page);
      await screenshot(page,'detail-light');
      await page.locator('#tripDepartureInput').fill('');
      assert(await page.locator('#startTripButton').isDisabled());
      await page.evaluate(()=>startTrip(state.plans[0].id));
      assert.equal((await readState(page)).active,null);
      assert.match(await page.locator('#toastRoot').innerText(),/Abfahrtszeit/);
      await page.locator('#nav button[data-view="settings"]').click();
      await page.locator('input[type="checkbox"]').first().check();
      await noPersonalCode(page);
      await page.locator('#nav button[data-view="plans"]').click();
      await noPersonalCode(page);
      await page.getByRole('button',{name:'Öffnen',exact:true}).click();
      assert.equal(await page.locator('#tripDepartureInput').inputValue(),'');
      await page.locator('#tripDepartureInput').fill('14:35');
      await screenshot(page,'detail-dark');
      await page.locator('#startTripButton').click();
      saved=await readState(page);
      assert.equal(saved.active.departure,'14:35');
      assert.equal(saved.active.startedAtEpoch,Date.parse('2026-10-18T14:35:00+02:00'));
      assert.equal(saved.active.actualStartEpoch,BASE);
      assert.equal(await page.locator('#currentStop').innerText(),'Wiesenhügel');
      await page.evaluate(()=>window.__qaAudio=[]);
      await page.locator('#nextStopBtn').click();
      assert.equal(await page.locator('#currentStop').innerText(),'Färberwaidweg');
      assert.deepEqual(await audioEvents(page),[]);
      await page.clock.runFor(999);
      assert.deepEqual(await audioEvents(page),[]);
      await page.clock.runFor(1);
      assert.deepEqual(await audioEvents(page),[{event:'play',name:'Färberwaidweg',path:announcementMap['Färberwaidweg'],at:BASE+1000}]);
      assert(await page.locator('#nextStopBtn').isDisabled());
      await page.evaluate(()=>{nextStop();driverPrevious();});
      assert.equal((await readState(page)).active.position,1);
      await page.clock.runFor(119000);
      assert(!(await page.locator('#nextStopBtn').isDisabled()));
      await page.getByRole('button',{name:/Türen öffnen/}).click();
      assert(await page.locator('#nextStopBtn').isDisabled());
      await page.evaluate(()=>nextStop());
      assert.equal((await readState(page)).active.position,1);
      await page.getByRole('button',{name:/Türen schließen/}).click();
      assert(!(await page.locator('#nextStopBtn').isDisabled()));
      await screenshot(page,'driver-tablet');
      await page.setViewportSize({width:390,height:844});
      await screenshot(page,'driver-mobile');
      assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
      await noPersonalCode(page);
      return {version:statusVersion,departure:'14:35',firstThreeArrivals:['14:35','14:38','14:42'],announcementDelayMs:1000,pauseAndDoorGuards:true,planId:saved.plans[0].id};
    } finally { await context.close(); }
  });

  await run('Schnelle Haltewechsel ersetzen wartende Ansagen und stoppen vorherige Wiedergabe',async()=>{
    const {context,page}=await driverPage();
    try {
      await page.locator('#nextStopBtn').click();
      await page.clock.runFor(300);
      await page.locator('#nextStopBtn').click();
      await page.clock.runFor(300);
      await page.locator('#nextStopBtn').click();
      assert.equal(await page.locator('#currentStop').innerText(),'Blücherstraße');
      await page.clock.runFor(999);
      assert.deepEqual(await audioEvents(page),[]);
      await page.clock.runFor(1);
      assert.deepEqual(await audioEvents(page),[{event:'play',name:'Blücherstraße',path:announcementMap['Blücherstraße'],at:BASE+1600}]);
      await page.locator('#nextStopBtn').click();
      assert((await audioEvents(page,'stop')).some(event=>event.at===BASE+1600));
      await page.clock.runFor(1000);
      const played=await audioEvents(page);
      assert.equal(played.length,2);
      assert.equal(played[1].name,'Sozialversicherungszentrum');
      assert.equal(played[1].at,BASE+2600);
      return {firstThreeClicksProduceOneAnnouncement:true,playingAnnouncementStoppedOnNextClick:true};
    } finally { await context.close(); }
  });

  await testCancellation('vorheriger Halt',page=>page.getByRole('button',{name:'← Zurück',exact:true}).click(),async page=>assert.equal((await readState(page)).active.position,0));
  await testCancellation('andere Ansicht',page=>page.locator('#nav button[data-view="home"]').click());
  await testCancellation('Android-Zurücktaste',page=>page.evaluate(()=>window.appBack()));
  await testCancellation('Fahrt beenden',page=>page.getByRole('button',{name:'Fahrt beenden',exact:true}).click(),async page=>assert.equal((await readState(page)).active,null));
  await testCancellation('Notfall speichern',async page=>{
    await page.getByRole('button',{name:/Notfall$/}).click();
    await page.getByRole('button',{name:'Notfall speichern',exact:true}).click();
  },async page=>assert.equal((await readState(page)).active.status,'suspended'));
  await testCancellation('native Activity-Pause',page=>page.evaluate(()=>window.onNativeAnnouncementPause()));

  await run('Bestandsdaten v6.1.5 migrieren verlustfrei und entfernen persönliche Codes',async()=>{
    const legacy=legacyFixture();
    const {context,page}=await openPage({seed:legacy});
    try {
      const migrated=await readState(page);
      assert.equal(migrated.schemaVersion,2);
      assert.equal(migrated.plans.length,legacy.plans.length);
      assert.deepEqual(migrated.plans[0].stops,legacy.plans[0].stops);
      assert.equal(migrated.plans[0].createdAt,legacy.plans[0].createdAt);
      assert.equal(migrated.selectedPlanId,migrated.plans[0].id);
      assert(!Object.hasOwn(migrated,'selectedCode'));
      assert(!/"code"\s*:/.test(JSON.stringify(migrated)));
      assert(!Object.hasOwn(migrated.plans[0],'departure'));
      assert.equal(migrated.active.plan.id,migrated.plans[0].id);
      assert.equal(migrated.active.departure,'09:15');
      assert(!Object.hasOwn(migrated.active.plan,'departure'));
      for(const key of ['id','startedAtEpoch','actualStartEpoch','positionReachedAt','pauseEndEpoch','position','doorsOpen','trafficDelayMin','status'])assert.equal(migrated.active[key],legacy.active[key]);
      assert.deepEqual(migrated.history[0],legacy.history[0]);
      assert.equal(migrated.history[1].at,legacy.history[1].at);
      assert.equal(migrated.history[1].note,legacy.history[1].note);
      assert.equal(migrated.history[1].resumeTrip.departure,'09:15');
      assert.equal(migrated.history[1].resumeTrip.plan.id,migrated.plans[0].id);
      assert.equal(migrated.history[1].resumeTrip.suspendedAt,legacy.history[1].resumeTrip.suspendedAt);
      await page.locator('#nav button[data-view="driver"]').click();
      assert.equal(await page.locator('#currentStop').innerText(),'Färberwaidweg');
      await noPersonalCode(page);
      await page.locator('#nav button[data-view="plans"]').click();
      await page.getByRole('button',{name:'Öffnen',exact:true}).click();
      assert.equal(await page.locator('#tripDepartureInput').inputValue(),'');
      assert(await page.locator('#startTripButton').isDisabled());
      await page.locator('#nav button[data-view="history"]').click();
      await noPersonalCode(page);
      await page.reload({waitUntil:'load'});
      const reloaded=await readState(page);
      assert.equal(reloaded.plans[0].id,migrated.plans[0].id);
      assert.equal(reloaded.active.startedAtEpoch,legacy.active.startedAtEpoch);
      return {plansPreserved:true,historyPreserved:true,activeDeparturePreserved:'09:15',idsStableAcrossReload:true};
    } finally { await context.close(); }
  });

  await run('Altes Backup importieren und migrierte Daten über Android exportieren',async()=>{
    const legacy=legacyFixture();
    const {context,page}=await openPage();
    try {
      await page.locator('#nav button[data-view="settings"]').click();
      await page.locator('#importFile').setInputFiles({name:'fahrplan-v6.1.5.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(legacy))});
      await page.locator('#toastRoot').getByText('Daten importiert.',{exact:true}).waitFor();
      const imported=await readState(page);
      assert.equal(imported.plans.length,1);
      assert.equal(imported.active.departure,'09:15');
      assert(!/"code"\s*:|"selectedCode"\s*:/.test(JSON.stringify(imported)));
      assert(!Object.hasOwn(imported.plans[0],'departure'));
      await page.locator('#nav button[data-view="settings"]').click();
      await page.getByRole('button',{name:'Daten exportieren',exact:true}).click();
      assert.deepEqual(await page.evaluate(()=>window.__qaExport),imported);
      await page.evaluate(()=>window.onNativeBackupResult(true,'Datensicherung gespeichert.'));
      assert.equal(await page.locator('#toastRoot').innerText(),'Datensicherung gespeichert.');
      return {legacyImport:true,exportMatchesMigratedState:true};
    } finally { await context.close(); }
  });

  await run('Fahrt über Mitternacht behält den Startanker und identische Ankunftszeiten',async()=>{
    const now=Date.parse('2026-10-18T23:58:00+02:00');
    const {context,page}=await openPage({seed:stateFixture(),now});
    try {
      await page.locator('#nav button[data-view="plans"]').click();
      await page.getByRole('button',{name:'Öffnen',exact:true}).click();
      await page.locator('#tripDepartureInput').fill('23:58');
      assert.deepEqual((await page.locator('[data-plan-stop-index]').allTextContents()).slice(0,3),['23:58','00:00','00:02']);
      await page.locator('#startTripButton').click();
      const anchor=(await readState(page)).active.startedAtEpoch;
      assert.equal(anchor,now);
      await page.locator('#nextStopBtn').click();
      const before=await page.locator('#driverRouteMap .route-stop-time').evaluateAll(nodes=>nodes.map(node=>node.firstChild.textContent));
      await page.clock.runFor(180000);
      assert.equal(await page.evaluate(()=>new Date().getDate()),19);
      assert.equal((await readState(page)).active.startedAtEpoch,anchor);
      const after=await page.locator('#driverRouteMap .route-stop-time').evaluateAll(nodes=>nodes.map(node=>node.firstChild.textContent));
      assert.deepEqual(after,before);
      await page.reload({waitUntil:'load'});
      await page.locator('#nav button[data-view="driver"]').click();
      assert.equal((await readState(page)).active.startedAtEpoch,anchor);
      assert.deepEqual(await page.locator('#driverRouteMap .route-stop-time').evaluateAll(nodes=>nodes.map(node=>node.firstChild.textContent)),before);
      return {firstArrivals:before.slice(0,3),anchorPreservedAfterMidnightAndReload:true};
    } finally { await context.close(); }
  });
  for(const scenario of [
    {name:'00:05 mit Abfahrt 23:59 verwendet den Vortag',now:'2026-10-19T00:05:00+02:00',departure:'23:59',expected:'2026-10-18T23:59:00+02:00'},
    {name:'23:58 mit Abfahrt 00:02 verwendet den Folgetag',now:'2026-10-18T23:58:00+02:00',departure:'00:02',expected:'2026-10-19T00:02:00+02:00'}
  ])await run(scenario.name,async()=>{
    const {context,page}=await openPage({seed:stateFixture(),now:Date.parse(scenario.now)});
    try {
      await page.locator('#nav button[data-view="plans"]').click();
      await page.getByRole('button',{name:'Öffnen',exact:true}).click();
      await page.locator('#tripDepartureInput').fill(scenario.departure);
      await page.locator('#startTripButton').click();
      assert.equal((await readState(page)).active.startedAtEpoch,Date.parse(scenario.expected));
      return {departureEpoch:Date.parse(scenario.expected)};
    } finally { await context.close(); }
  });

  await run('Echte Audiodateien decodieren, Gong vor Stimme, WebAudio-Abbruch und vollständiger Offlinebetrieb',async()=>{
    const {context,page}=await openPage({seed:stateFixture({active:true}),native:false,frozen:false,traceAudio:true});
    try {
      const decoded=await page.evaluate(async()=>{
        const ctx=new AudioContext();
        try {
          return await Promise.all(['audio/ding-dong.wav',...Object.values(window.STOP_ANNOUNCEMENTS)].map(async path=>{
            const response=await fetch(path);
            if(!response.ok)throw new Error(path+': HTTP '+response.status);
            const data=await response.arrayBuffer();
            const bytes=data.byteLength;
            const audio=await ctx.decodeAudioData(data);
            return {path,bytes,duration:audio.duration,channels:audio.numberOfChannels,sampleRate:audio.sampleRate};
          }));
        } finally { await ctx.close(); }
      });
      assert.equal(decoded.length,16);
      assert(decoded.every(file=>file.bytes>44&&file.duration>0.2&&file.channels>=1));
      const missingNames=await page.evaluate(()=>[...new Set(Object.values(ROUTES).flatMap(route=>route.stops))].filter(name=>!window.STOP_ANNOUNCEMENTS[name]));
      assert.deepEqual(missingNames,[]);
      await page.locator('#nav button[data-view="driver"]').click();
      await page.locator('#nextStopBtn').click();
      await page.waitForFunction(()=>window.__qaSources.filter(event=>event.event==='start').length>=2,null,{timeout:15000});
      const firstChain=await page.evaluate(()=>window.__qaSources.filter(event=>event.event==='start').slice(0,2));
      const gong=decoded.find(file=>file.path==='audio/ding-dong.wav');
      const voice=decoded.find(file=>file.path===announcementMap['Färberwaidweg']);
      assert(Math.abs(firstChain[0].duration-gong.duration)<0.005);
      assert(Math.abs(firstChain[1].duration-voice.duration)<0.005);
      assert(firstChain[1].at-firstChain[0].at>=gong.duration*1000-80);
      await page.locator('#nextStopBtn').click();
      assert((await page.evaluate(()=>window.__qaSources)).some(event=>event.event==='stop'&&event.id===firstChain[1].id));
      await page.waitForFunction(()=>window.__qaSources.filter(event=>event.event==='start').length>=3,null,{timeout:10000});
      const secondGong=await page.evaluate(()=>window.__qaSources.filter(event=>event.event==='start')[2]);
      await page.locator('#nav button[data-view="home"]').click();
      await page.waitForTimeout(Math.ceil(gong.duration*1000)+250);
      const allSources=await page.evaluate(()=>window.__qaSources);
      assert(allSources.some(event=>event.event==='stop'&&event.id===secondGong.id));
      assert.equal(allSources.filter(event=>event.event==='start').length,3,'cancelled gong must not continue with a spoken announcement');
      await page.evaluate(()=>navigator.serviceWorker.ready);
      await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
      const cached=await page.evaluate(async()=>{
        const names=await caches.keys();
        const cache=await caches.open(names.find(name=>name==='fahrplan-manager-tablet-v6.2.0'));
        return (await cache.keys()).map(request=>new URL(request.url).pathname);
      });
      const required=['/','/index.html','/app.js','/announcements.js','/manifest.webmanifest','/icon-192.png','/icon-512.png','/audio/announcements-data.js','/audio/announcements.json','/audio/ding-dong.wav',...Object.values(announcementMap).map(file=>'/'+file)];
      assert.equal(required.length,25);
      assert(required.every(file=>cached.includes(file)),'all shell and audio assets must be cached');
      await context.setOffline(true);
      await page.reload({waitUntil:'load'});
      await page.locator('#appVersion').filter({hasText:'v6.2.0 Android'}).waitFor();
      assert.equal(await page.evaluate(()=>Object.keys(window.STOP_ANNOUNCEMENTS).length),15);
      const offlineAudio=await page.evaluate(async()=>Promise.all(['audio/ding-dong.wav',...Object.values(window.STOP_ANNOUNCEMENTS)].map(async path=>{
        const response=await fetch(path);
        return {path,status:response.status,bytes:(await response.arrayBuffer()).byteLength};
      })));
      assert(offlineAudio.every(file=>file.status===200&&file.bytes>44));
      await page.locator('#nav button[data-view="driver"]').click();
      assert.equal(await page.locator('#currentStop').innerText(),'Abzweig Wiesenhügel');
      await screenshot(page,'offline-driver');
      fs.writeFileSync(path.join(OUTPUT,'audio-smoke.json'),JSON.stringify({decoded,sources:allSources,cached,offlineAudio},null,2));
      return {decodedFiles:16,stopNamesCovered:15,gongThenVoice:true,cancelStopsVoiceChain:true,requiredCachedAssets:25,offlineReloadAndAudio:true};
    } finally { await context.close(); }
  });

  await run('Keine JavaScript- oder Browserkonsolenfehler',async()=>{assert.deepEqual(browserErrors,[]);return {errors:0};});
  console.log(JSON.stringify({passed:results.filter(result=>result.status==='passed').length,failed:results.filter(result=>result.status==='failed').length,output:OUTPUT}));
  if(results.some(result=>result.status==='failed'))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close();
  if(server)await new Promise(resolve=>server.close(resolve));
});
