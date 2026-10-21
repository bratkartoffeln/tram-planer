'use strict';
let lineDraft=null;
let lineUndo=[];
let networkSelectedRoute=null;
function checkpointLine(){if(!lineDraft)return;lineUndo.push(clone(lineDraft));if(lineUndo.length>100)lineUndo.shift();const b=document.getElementById('lineUndoButton');if(b)b.disabled=false;}
function undoLineDraft(){if(!lineDraft||!lineUndo.length)return;lineDraft=lineUndo.pop();renderLineInspector();renderNetworkMap();}
function updateLineField(field,value){if(!lineDraft||lineDraft[field]===value)return;checkpointLine();lineDraft[field]=value;lineDraft.dirty=true;if(field==='color'||field==='line')renderNetworkMap();}
function updateLineStop(i,field,value){if(!lineDraft||lineDraft.stops[i][field]===value)return;checkpointLine();if(field==='name'){const p=networkPositions()[value];if(!p)return;Object.assign(lineDraft.stops[i],{name:value,x:p.x,y:p.y});}else lineDraft.stops[i][field]=value;lineDraft.dirty=true;renderNetworkMap();}
function removeLineStop(i){checkpointLine();lineDraft.stops.splice(i,1);refreshLineDraft();}
function toggleNetworkRoute(id){if(lineDraft||networkEditing)return;networkSelectedRoute=networkSelectedRoute===id?null:id;renderNetworkMap();}
let networkZoom=null;
let networkServiceMode='current';
function resizeNetworkMap(){const svg=document.getElementById('lineMapSvg');if(!svg)return;const scale=networkZoom??svg.parentElement.clientWidth/1100;svg.style.width=1100*scale+'px';svg.style.height=1080*scale+'px';}
function zoomNetwork(factor){const svg=document.getElementById('lineMapSvg');if(!svg)return;networkZoom=factor==='fit'?null:Math.max(.2,Math.min(3,(networkZoom??svg.parentElement.clientWidth/1100)*factor));resizeNetworkMap();}
window.addEventListener('resize',()=>{if(currentView==='network')resizeNetworkMap();});
function setNetworkServiceMode(mode){networkServiceMode=mode==='regular'?'regular':'current';renderNetworkMap();renderNetworkEditorTools();}
function networkConnections(mode=networkServiceMode){
 const active=mode==='regular'?ERFURT_NETWORK.routes:ERFURT_NETWORK.serviceRoutes;
 const edges=new Map(),activePairs=new Set();
 const key=(a,b)=>JSON.stringify([a,b].sort());
 for(const r of Object.values(active))for(let i=1;i<r.stops.length;i++){
  const from=r.stops[i-1],to=r.stops[i],pair=key(from,to);activePairs.add(pair);edges.set(r.line+pair,{from,to,line:r.line,color:r.color,inactive:false});
 }
 if(mode!=='regular')for(const r of Object.values(ERFURT_NETWORK.routes))for(let i=1;i<r.stops.length;i++){
  const from=r.stops[i-1],to=r.stops[i],pair=key(from,to);if(!activePairs.has(pair))edges.set('inactive'+pair,{from,to,line:r.line,color:'#83919a',inactive:true});
 }
 return applyNetworkEdges([...edges.values()]);
}
function validCustomRoutes(value){
 const result={};
 if(!value||typeof value!=='object')return result;
 for(const [id,r] of Object.entries(value)){
  if(!/^custom-[a-zA-Z0-9-]+$/.test(id)||!r||typeof r.name!=='string'||typeof r.line!=='string'||!Array.isArray(r.stops)||r.stops.length<2||r.stops.length>150)continue;
  if(r.stops.some(n=>typeof n!=='string'||!n.trim()||n.length>100))continue;
  const points=r.stops.map((name,i)=>{
const p=r.points?.[i];
   return {x:Number.isFinite(p?.x)?Math.max(15,Math.min(1085,p.x)):100+i%8*120,y:Number.isFinite(p?.y)?Math.max(15,Math.min(1065,p.y)):100+Math.floor(i/8)*85};
  });
  result[id]={name:r.name.slice(0,100),line:r.line.slice(0,20),code:typeof r.code==='string'?r.code.trim().slice(0,14):'',stops:r.stops.map(n=>n.trim()),points,color:/^#[0-9a-f]{6}$/i.test(r.color)?r.color:'#168a95',times:r.stops.map((_,i)=>i?Math.max(0,Math.min(240,Number.isFinite(Number(r.times?.[i]))?Number(r.times[i]):2)):0)};
 }
 return result;
}
function syncCustomRoutes(){
 Object.keys(ROUTES).filter(id=>id.startsWith('custom-')).forEach(id=>delete ROUTES[id]);
 Object.assign(ROUTES,state.customRoutes);
 Object.keys(state.customRoutes).forEach(id=>{if(state.settings.route_names[id]===id)delete state.settings.route_names[id];});
 state.plans.forEach(plan=>{if(plan.routeId?.startsWith('custom-')&&plan.routeCode===plan.routeId)plan.routeCode=routeLabel(plan.routeId);});
}
function openLineEditor(id){
 networkEditing=false;networkEditSelection=null;
 if(lineDraft?.dirty){showModal('Ungespeicherte Linie','Die Änderungen zuerst speichern oder verwerfen.',`<button onclick="closeModal()">Weiter bearbeiten</button><button class="danger" onclick="lineDraft=null;closeModal();openLineEditor('${id||''}')">Änderungen verwerfen</button>`);return;}
 const r=ROUTES[id];lineUndo=[];networkSelectedRoute=null;
 lineDraft={sourceId:id,id:id?.startsWith('custom-')?id:null,name:r?.name||'Neue Linie',line:r?.line||'',code:r?.code||(id?.startsWith('custom-')?state.settings.route_names[id]||'':''),color:r?.color||'#168a95',dirty:false,stops:(r?.stops||[]).map((name,i)=>({name,travel:i?(r.times?.[i]??2):0,...(r.points?.[i]||ERFURT_NETWORK.positions[name]||{x:100+i%8*120,y:100+Math.floor(i/8)*85})}))};
 const positions=networkPositions();
 lineDraft.stops.forEach(s=>{const name=Object.hasOwn(positions,s.name)?s.name:Object.keys(positions).reduce((best,n)=>Math.hypot(positions[n].x-s.x,positions[n].y-s.y)<Math.hypot(positions[best].x-s.x,positions[best].y-s.y)?n:best);Object.assign(s,{name,x:positions[name].x,y:positions[name].y});});
 showView('network');
}
function renderNetwork(el){
 const currentIds=['EF1BH','EF1BR','EF2H','EF2R','EF3H','EF3R','EF4H','EF4R','EF5H','EF5R','EF6BH','EF6BR'];
 const option=(id,r)=>`<option value="${esc(id)}" ${id===lineDraft?.sourceId?'selected':''}>Linie ${esc(r.line)} · ${esc(r.name)}</option>`;
 const other=Object.entries(ROUTES).filter(([id])=>!currentIds.includes(id));
 el.innerHTML=`<div class="grid network-workspace">
 <div class="col-12">${card(`<h2>Linien & Netz</h2>
 <p class="muted">Erfurt · mit EVAG-Fahrplänen am 19.10.2026 abgeglichen · beide Fahrtrichtungen.</p>
 <div class="actions"><select id="networkTemplate" aria-label="Linie zum Bearbeiten wählen" style="flex:1">
 <optgroup label="Fahrplanstand 19.10.2026">${currentIds.map(id=>option(id,ROUTES[id])).join('')}</optgroup>
 <optgroup label="Weitere Vorlagen & eigene Linien">${other.map(([id,r])=>option(id,r)).join('')}</optgroup></select>
 <button onclick="openLineEditor(document.getElementById('networkTemplate').value)">Linie bearbeiten</button><button class="primary" onclick="openLineEditor()">＋ Neue Linie</button></div>
 <details style="margin-top:14px"><summary>Fahrplan, Quellen & Gültigkeit</summary>
 <p>Linie 1 fährt während der Baustelle Rieth–Thüringenhalle, Linie 6 Europaplatz–Steigerstraße. Grundlage: EVAG-Baufahrpläne F1012, gültig ab 10.10.2026, und die Haltestellenfahrpläne beider Richtungen. Die Sperrung gilt vom 09.10.2026, 21 Uhr, bis 26.10.2026, Betriebsbeginn. Die Ansicht „Regelnetz“ bleibt zusätzlich verfügbar.</p>
 <p>Die Haltestellenfolgen sind recherchiert. Fahrzeiten im Planer bleiben frei einstellbare Simulationswerte, vorbelegt mit zwei Minuten je Abschnitt. Abfahrtsminuten, Kurzläufer und Nachtlinien sind nicht vollständig importiert. Kein Live-Datenfeed.</p>
 <p><a href="https://www.evag-erfurt.de/evag/fahrplan/liniennetz" target="_blank" rel="noopener">EVAG-Netzplan</a> · <a href="https://www.evag-erfurt.de/evag/home/fahrplan/haltestellenfahrplan" target="_blank" rel="noopener">Offizielle Linienfahrpläne</a> · <a href="https://www.evag-erfurt.de/evag/warschauer%2Bstrasse" target="_blank" rel="noopener">Baustelle und Baufahrpläne 1/6</a></p></details>`)}</div>
 <div class="col-12" id="networkCanvasSection">${card(`<h2>Schematischer Netzplan</h2>
 <div class="field network-mode-field"><label for="networkServiceMode">Fahrplanstand der Karte</label><select id="networkServiceMode" onchange="setNetworkServiceMode(this.value)"><option value="current" ${networkServiceMode==='current'?'selected':''}>19.10.2026 · Baufahrplan 1 und 6</option><option value="regular" ${networkServiceMode==='regular'?'selected':''}>Regelnetz · ohne Baustelle</option></select></div>
 <div class="notice" id="networkServiceNotice"></div><div class="network-legend" id="networkLegend"></div>
 <p class="muted">${lineDraft?'Haltestelle anklicken: anhängen. Nummerierten Halt auf einen Haltestellenkreis ziehen: Halt ersetzen. Außerhalb der Kreise bleibt er unverändert.':'Linienbutton wählen: Fahrtrichtung hervorheben. Erneut wählen: Auswahl aufheben.'}</p>

 <div class="actions network-map-tools"><button class="small" onclick="zoomNetwork(1/1.25)" aria-label="Netzplan verkleinern">−</button><button class="small" onclick="zoomNetwork(1.25)" aria-label="Netzplan vergrößern">＋</button><button class="small" onclick="zoomNetwork('fit')">Ganzes Netz</button>${lineDraft?`<button id="lineUndoButton" class="small" onclick="undoLineDraft()" ${lineUndo.length?'':'disabled'}>Rückgängig</button>`:''}${state.settings.dev_mode?`<button id="networkEditToggle" class="small ${networkEditing?'is-editing':''}" aria-pressed="${networkEditing}" onclick="toggleNetworkEditor()">Netz bearbeiten</button>`:''}</div>
 <div id="networkEditorTools"></div><div class="network-map ${networkEditing?'is-editing':''}" id="networkMap"></div><div id="networkEditInspector"></div>`)}</div>
 <div class="col-12" id="lineInspector"></div></div>`;
 renderLineInspector();renderNetworkMap();renderNetworkEditorTools();
}
function renderLineInspector(){
 const undo=document.getElementById('lineUndoButton');if(undo)undo.disabled=!lineUndo.length;
 const el=document.getElementById('lineInspector');if(!el)return;
 if(!lineDraft){el.innerHTML=card('<h2>Deine Linienwerkstatt</h2><p class="muted">Verbinde vorhandene Haltestellen zu eigenen Linien. Danach kannst du die Linie unter „Neue Fahrt“ verwenden. Die bisherigen Streckenvorlagen bleiben verfügbar.</p>');return;}
 const d=lineDraft;
 el.innerHTML=card(`<h2>${d.id?'Eigene Linie bearbeiten':'Linie entwerfen'}</h2><div class="field"><label for="editorName">Name</label><input id="editorName" maxlength="100" value="${esc(d.name)}" oninput="updateLineField('name',this.value)"></div><div class="form-grid" style="margin:12px 0"><div class="field"><label for="editorLine">Linie</label><input id="editorLine" maxlength="20" value="${esc(d.line)}" oninput="updateLineField('line',this.value)"></div><div class="field"><label for="editorCode">Streckenkürzel (optional)</label><input id="editorCode" maxlength="14" value="${esc(d.code||'')}" placeholder="z. B. L7N, RING" oninput="updateLineField('code',this.value)"></div><div class="field"><label for="editorColor">Farbe</label><input id="editorColor" type="color" value="${esc(d.color)}" oninput="updateLineField('color',this.value)"></div></div><div class="actions"><button class="small" onclick="reverseLineDraft()">⇄ Reihenfolge umkehren</button><span class="pill">${d.stops.length} Halte</span></div><p class="muted">Fahrzeit ab vorherigem Halt in Minuten. Pfeile ändern die Reihenfolge.</p><div class="line-stops">${d.stops.map((s,i)=>`<div class="line-stop"><span class="stop-number">${i+1}</span><div class="field"><label for="ln_${i}">Haltestelle ${i+1}</label><select id="ln_${i}" onchange="updateLineStop(${i},'name',this.value)">${Object.entries(networkPositions()).map(([name,p])=>`<option value="${esc(name)}" ${name===s.name?'selected':''}>${esc(p.name||name)}</option>`).join('')}</select><label for="lt_${i}">Fahrzeit (Min.)</label><input id="lt_${i}" type="number" min="0" max="240" step="1" value="${s.travel}" ${i?'':'readonly'} oninput="updateLineStop(${i},'travel',Number(this.value))"></div><div class="line-stop-actions"><button class="small" aria-label="Halt ${i+1} nach oben" ${i?'':'disabled'} onclick="moveLineStop(${i},-1)">↑</button><button class="small" aria-label="Halt ${i+1} nach unten" ${i<d.stops.length-1?'':'disabled'} onclick="moveLineStop(${i},1)">↓</button><button class="small" aria-label="Halt ${i+1} entfernen" onclick="removeLineStop(${i})">×</button></div></div>`).join('')}</div><div class="actions" style="margin-top:14px"><button class="primary" onclick="saveLineDraft()">Linie speichern</button><button onclick="lineDraft=null;showView('network')">Verwerfen</button>${d.id?`<button class="danger" onclick="deleteCustomLine()">Löschen</button>`:''}</div>`);
}
function refreshLineDraft(){lineDraft.dirty=true;if(lineDraft.stops[0])lineDraft.stops[0].travel=0;renderLineInspector();renderNetworkMap();renderNetworkEditorTools();}
function moveLineStop(i,delta){const j=i+delta;if(j<0||j>=lineDraft.stops.length)return;checkpointLine();[lineDraft.stops[i],lineDraft.stops[j]]=[lineDraft.stops[j],lineDraft.stops[i]];refreshLineDraft();}
function reverseLineDraft(){checkpointLine();const times=lineDraft.stops.slice(1).map(s=>s.travel).reverse();lineDraft.stops.reverse().forEach((s,i)=>s.travel=i?times[i-1]:0);refreshLineDraft();}
// At each stop point towards the next distinct position. The terminus keeps
// the incoming direction, so selecting the return service also reverses it.
function networkStopDirections(route,positions){
 const directions=new Map();if(!route)return directions;
 route.stops.forEach((name,i)=>{
  const p=positions[name];if(!p)return;
  let target,backwards=false;
  for(let j=i+1;j<route.stops.length;j++){const q=positions[route.stops[j]];if(q&&Math.hypot(q.x-p.x,q.y-p.y)>.01){target=q;break;}}
  if(!target){backwards=true;for(let j=i-1;j>=0;j--){const q=positions[route.stops[j]];if(q&&Math.hypot(q.x-p.x,q.y-p.y)>.01){target=q;break;}}}
  directions.set(name,{angle:target?Math.atan2(backwards?p.y-target.y:target.y-p.y,backwards?p.x-target.x:target.x-p.x)*180/Math.PI:null,next:route.stops[i+1]||null});
 });
 return directions;
}
function renderNetworkMap(){
 const host=document.getElementById('networkMap');if(!host)return;
 host.classList.toggle('is-line-editing',!!lineDraft);
 const service=networkServiceMode==='regular'?ERFURT_NETWORK.routes:ERFURT_NETWORK.serviceRoutes;
 document.getElementById('networkServiceNotice').textContent=networkServiceMode==='regular'?'Regelnetz in beiden Richtungen, ohne die befristete Baustellenführung.':'Stand 19.10.2026: Linie 1 ab Rieth, Linie 6 ab Europaplatz. Grau gestrichelt: Regelverbindungen, die im Baufahrplan nicht von der Stadtbahn bedient werden; dort besteht teilweise Schienenersatzverkehr.';
 if(networkSelectedRoute&&!service[networkSelectedRoute])networkSelectedRoute=null;
 const selected=service[networkSelectedRoute];
 const lines=[...new Set(Object.values(service).map(r=>r.line))];
 document.getElementById('networkLegend').innerHTML=lines.map(line=>'<div class="network-direction-buttons">'+Object.entries(service).filter(([,r])=>r.line===line).map(([id,r])=>`<button type="button" class="pill network-route-button" data-route="${esc(id)}" aria-pressed="${networkSelectedRoute===id}" ${lineDraft||networkEditing?'disabled':''} style="--route-color:${state.networkEdits.lineColors[r.line]||r.color}" onclick="toggleNetworkRoute('${id}')">${esc(r.line)} · ${esc(r.stops[0])} → ${esc(r.stops.at(-1))}</button>`).join('')+'</div>').join('');
 const selectedPairs=new Set();if(selected)for(let i=1;i<selected.stops.length;i++)selectedPairs.add(networkPair(selected.stops[i-1],selected.stops[i]));
 const mutedEdge=edge=>!networkEditing&&(lineDraft?true:!!selected&&(edge.line!==selected.line||!selectedPairs.has(networkPair(edge.from,edge.to))));
 const pts=networkPositions();
 const stopDirections=networkStopDirections(!lineDraft&&!networkEditing?selected:null,pts);
 const selectedColor=selected&&(state.networkEdits.lineColors[selected.line]||selected.color);
 const arrowColor=selectedColor&&[1,3,5].map(i=>parseInt(selectedColor.slice(i,i+2),16)/255).reduce((sum,c,i)=>sum+(c<=.04045?c/12.92:((c+.055)/1.055)**2.4)*[.2126,.7152,.0722][i],0)>.179?'#111827':'#ffffff';
 const path=stops=>stops.map(s=>`${s.x},${s.y}`).join(' ');
 const connections=networkConnections().sort((a,b)=>Number(b.inactive)-Number(a.inactive));
 const geometry=networkLinkGeometry(connections,pts);
 host.innerHTML=`<svg id="lineMapSvg" viewBox="0 0 1100 1080" role="group" aria-label="Schematisches Erfurter Straßenbahnnetz mit bearbeitbarer Linie"><rect width="1100" height="1080" fill="var(--soft)"/>
 <g class="network-connections" pointer-events="none">${connections.map(edge=>{
  const lane=geometry.get(networkEdgeKey(edge));
  return `<path class="network-link${edge.inactive?' inactive':''}${mutedEdge(edge)?' is-muted':''}" data-from="${esc(edge.from)}" data-to="${esc(edge.to)}" data-line="${esc(edge.line)}" data-edge="${esc(networkEdgeKey(edge))}" data-lane-offset="${lane.offset}" data-service-status="${edge.serviceStatus}" d="${lane.d}" fill="none" stroke="${edge.color}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" opacity="${edge.inactive?'.6':'.95'}" ${edge.dashed?'stroke-dasharray="7 7"':''}><title>Linie ${esc(edge.line)} · ${edge.serviceStatus==='construction'?'Baustelle':edge.serviceStatus==='not-served'?'Nicht bedient':'Regulär'}</title></path>`;
 }).join('')}</g>
 ${Object.entries(pts).map(([n,p],i)=>{
  const direction=stopDirections.get(n),description=direction?`${n} · Linie ${selected.line} · ${direction.next?'weiter nach '+direction.next:'Endhaltestelle'}`:n;
  return `<g class="network-node${direction?' is-route-stop':''}" data-name="${esc(n)}" data-stop="${i}" tabindex="0" role="button" aria-label="${esc(lineDraft?n+' anhängen':description)}"><circle cx="${p.x}" cy="${p.y}" r="9" fill="${direction?selectedColor:'var(--panel)'}" stroke="${direction?selectedColor:'var(--muted)'}" stroke-width="2"/>${direction?.angle!=null?`<path class="network-stop-direction" d="M -3.5 -5 L 5 0 L -3.5 5 Z" transform="translate(${p.x} ${p.y}) rotate(${direction.angle})" fill="${arrowColor}" pointer-events="none" aria-hidden="true"/>`:''}<text class="network-stop-label" x="${p.x+12+(p.dx||0)}" y="${p.y+4+(p.dy||0)}">${esc(p.name||n)}</text><title>${esc(description)}</title></g>`;
 }).join('')}
 ${lineDraft&&!networkEditing?`<polyline pointer-events="none" id="draftPolyline" points="${path(lineDraft.stops)}" fill="none" stroke="${lineDraft.color}" stroke-width="6"/>${lineDraft.stops.map((s,i)=>`<g class="draft-node" data-index="${i}"><circle cx="${s.x}" cy="${s.y}" r="13" fill="${lineDraft.color}"/><text x="${s.x}" y="${s.y+4}" text-anchor="middle" fill="white">${i+1}</text><title>${esc(s.name)} · ziehen zum Verschieben</title></g>`).join('')}`:''}</svg>`;
 const svg=host.querySelector('svg');
 const point=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());};
 resizeNetworkMap();
 if(networkEditing&&state.settings.dev_mode){bindNetworkEditor(svg);return;}
 let dragging=null,suppressClick=false;
 const snap=p=>Object.keys(pts).filter(n=>Math.hypot(pts[n].x-p.x,pts[n].y-p.y)<=18).sort((a,b)=>Math.hypot(pts[a].x-p.x,pts[a].y-p.y)-Math.hypot(pts[b].x-p.x,pts[b].y-p.y))[0];
 const preview=s=>{const g=svg.querySelector('[data-index="'+dragging.i+'"]');g.querySelector('circle').setAttribute('cx',s.x);g.querySelector('circle').setAttribute('cy',s.y);g.querySelector('text').setAttribute('x',s.x);g.querySelector('text').setAttribute('y',s.y+4);const stops=lineDraft.stops.map((stop,i)=>i===dragging.i?s:stop);svg.querySelector('#draftPolyline').setAttribute('points',path(stops));};
 svg.onpointerdown=e=>{suppressClick=false;const g=e.target.closest('.draft-node');if(e.button!==0||!g||!lineDraft)return;dragging={i:Number(g.dataset.index),x:e.clientX,y:e.clientY,moved:false};svg.setPointerCapture(e.pointerId);e.preventDefault();};
 svg.onpointermove=e=>{if(!dragging)return;dragging.moved ||= Math.hypot(e.clientX-dragging.x,e.clientY-dragging.y)>4;if(!dragging.moved)return;const name=snap(point(e));preview(name?pts[name]:lineDraft.stops[dragging.i]);};
 const finish=e=>{if(!dragging)return;const d=dragging;suppressClick=d.moved;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);const name=e.type==='pointerup'&&d.moved?snap(point(e)):null;dragging=null;if(name){const p=pts[name],s=lineDraft.stops[d.i];if(s.name!==name||s.x!==p.x||s.y!==p.y){checkpointLine();Object.assign(s,{name,x:p.x,y:p.y});refreshLineDraft();return;}}renderNetworkMap();};
 svg.onpointerup=finish;svg.onpointercancel=finish;
 const append=n=>{if(!lineDraft||suppressClick)return;checkpointLine();const p=pts[n];lineDraft.stops.push({name:n,x:p.x,y:p.y,travel:lineDraft.stops.length?2:0});refreshLineDraft();};
 svg.querySelectorAll('.network-node').forEach(g=>{g.onclick=()=>append(g.dataset.name);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();suppressClick=false;append(g.dataset.name);}};});
 svg.onclick=()=>{suppressClick=false;};
}
function saveLineDraft(){
 const d=lineDraft;
 if(!d||!d.name.trim()||!d.line.trim()||d.stops.length<2||d.stops.length>150||d.stops.some(s=>!s.name.trim()||!Number.isFinite(s.travel)||s.travel<0||s.travel>240)){showToast('Name, Linie und 2–150 benannte Halte mit Fahrzeiten von 0–240 Minuten erforderlich.');return;}
 const id=d.id||'custom-'+newPlanId().slice(5);
 state.customRoutes[id]={name:d.name.trim(),line:d.line.trim(),code:(d.code||'').trim().slice(0,14),color:d.color,stops:d.stops.map(s=>s.name.trim()),times:d.stops.map((s,i)=>i?s.travel:0),points:d.stops.map(s=>({x:s.x,y:s.y}))};
 delete state.settings.route_names[id];
 saveState();syncCustomRoutes();lineDraft=null;openLineEditor(id);showToast('Linie gespeichert und unter „Neue Fahrt“ verfügbar.');
}
function deleteCustomLine(){const id=lineDraft.id;showModal('Eigene Linie löschen','Gespeicherte Fahrpläne und laufende Fahrten bleiben erhalten.',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="delete state.customRoutes['${id}'];if(window.draftRoute==='${id}'){window.draftRoute=null;draftStops=[];}saveState();syncCustomRoutes();lineDraft=null;closeModal();showView('network')">Linie löschen</button>`);}
