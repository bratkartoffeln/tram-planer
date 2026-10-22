'use strict';
// Edits use stable stop keys: moving/renaming a label never breaks routes,
// stored trips or their recordings. The overlay is included in JSON backups.
let networkEditing=false,networkEditTool='move',networkEditSelection=null,networkConnectFrom=null;
let networkUndo=[],networkRedo=[];
const networkPair=(a,b)=>JSON.stringify([a,b].sort());
const networkEdgeKey=e=>JSON.stringify([e.line,...[e.from,e.to].sort()]);
const networkColor=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
const networkLimit=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):fallback;
const NETWORK_PLAN_FORMAT='fahrplan-manager-network-plan';
const NETWORK_PLAN_MAX_BYTES=2*1024*1024;
function bundledNetworkEdits(){return validNetworkEdits(window.BUNDLED_NETWORK_PLAN?.edits);}
function validNetworkEdits(raw){
 const out={stops:{},removedEdges:[],addedEdges:[],lineColors:{},edgeStyles:{}};
 if(!raw||typeof raw!=='object')return out;
 for(const [id,p] of Object.entries(raw.stops||{})){
  if(!Object.hasOwn(ERFURT_NETWORK.positions,id)||!p||typeof p!=='object')continue;
  const base=ERFURT_NETWORK.positions[id];
  out.stops[id]={x:networkLimit(p.x,15,1085,base.x),y:networkLimit(p.y,15,1065,base.y),dx:networkLimit(p.dx,-300,300,0),dy:networkLimit(p.dy,-150,150,0),name:typeof p.name==='string'&&p.name.trim()?p.name.trim().slice(0,100):id};
 }
 const hasStop=id=>Object.hasOwn(ERFURT_NETWORK.positions,id);
 if(Array.isArray(raw.removedEdges))out.removedEdges=[...new Set(raw.removedEdges.filter(k=>{
  try{const a=JSON.parse(k);return Array.isArray(a)&&a.length===3&&typeof a[0]==='string'&&hasStop(a[1])&&hasStop(a[2]);}catch{return false;}
 }))].slice(0,1000);
 if(Array.isArray(raw.addedEdges))for(const edge of raw.addedEdges.slice(0,500)){
  if(!edge||!hasStop(edge.from)||!hasStop(edge.to)||edge.from===edge.to)continue;
  const e={from:edge.from,to:edge.to,line:typeof edge.line==='string'?edge.line.slice(0,50):'Gleis',color:networkColor(edge.color)?edge.color:'#168a95',inactive:false};
  if(!out.addedEdges.some(x=>networkEdgeKey(x)===networkEdgeKey(e)))out.addedEdges.push(e);
 }
 for(const [id,color] of Object.entries(raw.lineColors||{}))if(id.length<=50&&networkColor(color))out.lineColors[id]=color;
 for(const [key,style] of Object.entries(raw.edgeStyles||{}).slice(0,1000)){
  let edge;try{edge=JSON.parse(key);}catch{continue;}
  if(!Array.isArray(edge)||edge.length!==3||typeof edge[0]!=='string'||!edge[0].trim()||edge[0].length>50||!hasStop(edge[1])||!hasStop(edge[2])||edge[1]===edge[2]||!style||!networkColor(style.color)||!['solid','dashed'].includes(style.pattern)||!['regular','construction','not-served'].includes(style.status))continue;
  out.edgeStyles[key]={color:style.color,pattern:style.pattern,status:style.status};
 }
 return out;
}
function networkPositions(){
 return Object.fromEntries(Object.entries(ERFURT_NETWORK.positions).map(([key,p])=>[key,{...p,...state.networkEdits.stops[key]}]));
}
function applyNetworkEdges(edges){
 const edits=state.networkEdits,removed=new Set(edits.removedEdges),result=new Map();
 for(const e of [...edges,...edits.addedEdges])if(!removed.has(networkEdgeKey(e))){
  const style=edits.edgeStyles?.[networkEdgeKey(e)],baseColor=edits.lineColors[e.line]||e.color;
  result.set(networkEdgeKey(e),{...e,baseColor,color:style?.color||baseColor,inactive:style?style.status==='not-served':e.inactive,dashed:style?style.pattern==='dashed':e.inactive,serviceStatus:style?.status||(e.inactive?'not-served':'regular')});
 }
 return [...result.values()];
}
function checkpointNetwork(){networkRedo=[];networkUndo.push(clone(state.networkEdits));if(networkUndo.length>80)networkUndo.shift();}
// One lane per line, independent of travel direction. Short approaches meet
// under the station marker; the middle sections of each bundle stay parallel.
function networkLinkGeometry(edges,positions=networkPositions()){
 const groups=new Map(),geometry=new Map(),gap=8;
 for(const edge of edges){const pair=networkPair(edge.from,edge.to);if(!groups.has(pair))groups.set(pair,[]);groups.get(pair).push(edge);}
 const round=value=>Number(value.toFixed(3));
 for(const group of groups.values()){
  group.sort((a,b)=>a.line.localeCompare(b.line,'de',{numeric:true}));
  let a=positions[group[0].from],b=positions[group[0].to];
  if(b.y<a.y||(b.y===a.y&&b.x<a.x))[a,b]=[b,a];
  const length=Math.hypot(b.x-a.x,b.y-a.y),normal=length>0?{x:-(b.y-a.y)/length,y:(b.x-a.x)/length}:{x:0,y:0};
  group.forEach((edge,index)=>{
   const from=positions[edge.from],to=positions[edge.to],offset=(index-(group.length-1)/2)*gap;
   const lead=length>0?Math.min(20,length*.2)/length:0;
   const points=offset&&length>0?[from,{x:from.x+(to.x-from.x)*lead+normal.x*offset,y:from.y+(to.y-from.y)*lead+normal.y*offset},{x:to.x-(to.x-from.x)*lead+normal.x*offset,y:to.y-(to.y-from.y)*lead+normal.y*offset},to]:[from,to];
   geometry.set(networkEdgeKey(edge),{offset,count:group.length,d:points.map((p,i)=>(i?'L':'M')+round(p.x)+','+round(p.y)).join(' ')});
  });
 }
 return geometry;
}
function updateNetworkLinkPaths(svg){
 const geometry=networkLinkGeometry(networkConnections());
 for(const path of svg.querySelectorAll('.network-link')){const lane=geometry.get(path.dataset.edge);if(lane){path.setAttribute('d',lane.d);path.dataset.laneOffset=lane.offset;}}
}
function networkPlanDocument(){return {format:NETWORK_PLAN_FORMAT,schemaVersion:1,network:'erfurt',edits:validNetworkEdits(state.networkEdits)};}
function parseNetworkPlanDocument(value){
 const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 if(!object(value)||value.format!==NETWORK_PLAN_FORMAT||value.schemaVersion!==1||value.network!=='erfurt'||!object(value.edits))throw Error('Kein unterstützter Erfurter Netzplan (Formatversion 1).');
 const edits=value.edits,hasStop=id=>typeof id==='string'&&Object.hasOwn(ERFURT_NETWORK.positions,id),line=id=>typeof id==='string'&&id.trim().length>0&&id.length<=50;
 if(!object(edits.stops)||!object(edits.lineColors)||!Array.isArray(edits.removedEdges)||!Array.isArray(edits.addedEdges)||edits.removedEdges.length>1000||edits.addedEdges.length>500)throw Error('Die Netzplanstruktur ist ungültig.');
 for(const [id,p] of Object.entries(edits.stops)){
  if(!hasStop(id)||!object(p)||typeof p.name!=='string'||!p.name.trim()||p.name.length>100)throw Error('Unbekannte oder ungültige Haltestelle im Netzplan.');
  for(const [field,min,max] of [['x',15,1085],['y',15,1065],['dx',-300,300],['dy',-150,150]])if(typeof p[field]!=='number'||!Number.isFinite(p[field])||p[field]<min||p[field]>max)throw Error('Ungültige Haltestellen- oder Textposition.');
 }
 for(const key of edits.removedEdges){let edge;try{edge=typeof key==='string'?JSON.parse(key):null;}catch{throw Error('Ungültige entfernte Gleisverbindung.');}if(!Array.isArray(edge)||edge.length!==3||!line(edge[0])||!hasStop(edge[1])||!hasStop(edge[2])||edge[1]===edge[2])throw Error('Ungültige entfernte Gleisverbindung.');}
 for(const edge of edits.addedEdges)if(!object(edge)||!hasStop(edge.from)||!hasStop(edge.to)||edge.from===edge.to||!line(edge.line)||!networkColor(edge.color))throw Error('Ungültige zusätzliche Gleisverbindung.');
 for(const [id,color] of Object.entries(edits.lineColors))if(!line(id)||!networkColor(color))throw Error('Ungültige Linienfarbe.');
 if(edits.edgeStyles!==undefined){
  if(!object(edits.edgeStyles)||Object.keys(edits.edgeStyles).length>1000)throw Error('Ungültige Abschnittsmarkierungen.');
  for(const [key,style] of Object.entries(edits.edgeStyles)){
   let edge;try{edge=JSON.parse(key);}catch{throw Error('Ungültige Abschnittskennung.');}
   if(!Array.isArray(edge)||edge.length!==3||!line(edge[0])||!hasStop(edge[1])||!hasStop(edge[2])||edge[1]===edge[2]||!object(style)||!networkColor(style.color)||!['solid','dashed'].includes(style.pattern)||!['regular','construction','not-served'].includes(style.status))throw Error('Ungültige Abschnittsmarkierung.');
  }
 }
 return validNetworkEdits(edits);
}
function exportNetworkPlan(){
 if(!state.settings.dev_mode)return;
 const json=JSON.stringify(networkPlanDocument(),null,2)+'\n';
 if(window.AndroidBackup&&typeof AndroidBackup.saveNetworkPlan==='function'){
  try{AndroidBackup.saveNetworkPlan(json);}catch{showToast('Der Netzplan-Export konnte nicht gestartet werden.');}return;
 }
 const url=URL.createObjectURL(new Blob([json],{type:'application/json'})),link=document.createElement('a');
 link.href=url;link.download='network-plan.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function applyImportedNetworkPlan(edits){
 if(!state.settings.dev_mode)return;
 checkpointNetwork();state.networkEdits=edits;networkEditSelection=null;networkConnectFrom=null;saveState();refreshNetworkEditor();
}
async function importNetworkPlan(event){
 if(!state.settings.dev_mode)return;
 const input=event.target,file=input.files?.[0];if(!file)return;
 try{
  if(file.size>NETWORK_PLAN_MAX_BYTES)throw Error('Die Netzplandatei darf höchstens 2 MB groß sein.');
  const edits=parseNetworkPlanDocument(JSON.parse(await file.text()));
  if(!state.settings.dev_mode)return;
  previewNetworkTransfer(edits,'Netzplan importieren · Vorschau','Netzplan importiert. Die Änderung kann rückgängig gemacht werden.');
 }catch(error){showToast(error instanceof SyntaxError?'Die Datei enthält kein gültiges JSON.':error.message||'Die Netzplandatei konnte nicht gelesen werden.');}
 finally{input.value='';}
}
function loadProjectNetworkPlan(){
 if(!state.settings.dev_mode)return;
 try{previewNetworkTransfer(parseNetworkPlanDocument(window.BUNDLED_NETWORK_PLAN),'Projekt-Netzplan laden · Vorschau','Netzplan aus der Projektdatei geladen.');}catch(error){showToast(error.message);}
}
function networkEditAllowed(){return state.settings.dev_mode===true&&networkEditing;}
function toggleNetworkEditor(){
 if(!state.settings.dev_mode)return;
 if(!networkEditing&&lineDraft?.dirty){showToast('Bitte den Linienentwurf zuerst speichern oder verwerfen.');return;}
 networkEditing=!networkEditing;networkEditSelection=null;networkConnectFrom=null;
 if(networkEditing)lineDraft=null;
 showView('network');
}
function setNetworkEditTool(tool){
 if(!networkEditAllowed()||!['move','connect','remove'].includes(tool))return;
 networkEditTool=tool;networkConnectFrom=null;networkEditSelection=null;renderNetworkEditorTools();renderNetworkMap();
}
function renderNetworkEditorTools(){
 const host=document.getElementById('networkEditorTools');if(!host)return;
 host.innerHTML=networkEditAllowed()?`<div class="network-editor-tools"><div class="actions" role="group" aria-label="Netzplan-Werkzeuge">${[['move','Punkte & Namen'],['connect','Gleis verbinden'],['remove','Gleis entfernen']].map(([id,label])=>`<button class="small" aria-pressed="${networkEditTool===id}" onclick="setNetworkEditTool('${id}')">${label}</button>`).join('')}<button class="small" onclick="undoNetworkEdit()" ${networkUndo.length?'':'disabled'}>Rückgängig</button><button class="small" onclick="redoNetworkEdit()" ${networkRedo.length?'':'disabled'}>Wiederholen</button><button class="small" onclick="resetNetworkEdits()">Original wiederherstellen</button></div><p role="status">${networkEditTool==='connect'?(networkConnectFrom?'Zweiten Haltestellenpunkt wählen.':'Zwei Haltestellenpunkte nacheinander wählen, um ein Gleis anzulegen.'):networkEditTool==='remove'?'Verbindung auswählen und unten entfernen. Bei überlappenden Linien die gewünschte Verbindung in der Liste wählen.':'Punkte mit Maus oder Touch ziehen. Zum Verschieben eines Namens direkt den Text ziehen. Anklicken öffnet genaue Werte und die Beschriftung.'} Änderungen werden automatisch lokal gespeichert.</p></div>`:'';
 if(state.settings.dev_mode)host.innerHTML+=`<div class="network-editor-tools network-plan-files"><div class="actions"><button class="small" onclick="exportNetworkPlan()">Netzplan exportieren</button><button class="small" onclick="document.getElementById('networkPlanImport').click()">Netzplan importieren</button><button class="small" onclick="loadProjectNetworkPlan()">Projektdatei laden</button><input id="networkPlanImport" type="file" accept="application/json,.json" class="hidden" onchange="importNetworkPlan(event)"></div><p>Positionen, Beschriftungen, Gleise, Farben und Abschnittsmarkierungen als Datei speichern oder laden.</p><details><summary>Netzplan im Projekt hinterlegen</summary><p>Die exportierte Datei als <code>app/src/main/assets/network-plan.json</code> ablegen und <code>python tools/sync-assets.py</code> ausführen. Danach die App neu laden und bei vorhandenen lokalen Anpassungen „Projektdatei laden“ wählen. Die PWA-Kopie liegt unter <code>web-pwa/network-plan.json</code>.</p></details></div>`;
 renderNetworkEditInspector();
}
function refreshNetworkEditor(){renderNetworkMap();renderNetworkEditorTools();}
function undoNetworkEdit(){
 if(!networkEditAllowed()||!networkUndo.length)return;
 networkRedo.push(clone(state.networkEdits));
 state.networkEdits=networkUndo.pop();networkEditSelection=null;networkConnectFrom=null;saveState();refreshNetworkEditor();
}
function redoNetworkEdit(){if(!networkEditAllowed()||!networkRedo.length)return;networkUndo.push(clone(state.networkEdits));state.networkEdits=networkRedo.pop();networkEditSelection=null;networkConnectFrom=null;saveState();refreshNetworkEditor();}
function resetNetworkEdits(){
 if(!networkEditAllowed())return;
 showModal('Originalnetz wiederherstellen','Alle eigenen Positionen, Namen, Gleise und Farben des Netzplans zurücksetzen?',`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="confirmResetNetwork()">Zurücksetzen</button>`);
}
function confirmResetNetwork(){if(!networkEditAllowed())return;checkpointNetwork();state.networkEdits=bundledNetworkEdits();networkEditSelection=null;saveState();closeModal();refreshNetworkEditor();}
function networkPalette(){return [...new Set(['#d83b48','#bb7620','#168a95','#385fac','#8c4fa5','#398749','#d88714','#83919a',...Object.values(ERFURT_NETWORK.routes).map(r=>r.color),...Object.values(state.customRoutes).map(r=>r.color),...Object.values(state.networkEdits.lineColors),...state.networkEdits.addedEdges.map(e=>e.color),...Object.values(state.networkEdits.edgeStyles).map(e=>e.color)])].filter(networkColor);}
function networkColorControls(color,handler='setNetworkLineColor',inputId='networkLineColor',label='Eigene Farbe'){
 return `<div class="color-swatches" role="group" aria-label="Vorhandene und vorgefertigte Linienfarben">${networkPalette().map(c=>`<button class="color-swatch" style="--swatch:${c}" aria-label="Farbe ${c}" aria-pressed="${color.toLowerCase()===c.toLowerCase()}" onclick="${handler}('${c}')"></button>`).join('')}</div><div class="field"><label for="${inputId}">${label}</label><input id="${inputId}" type="color" value="${color}" onchange="${handler}(this.value)"></div>`;
}
function renderNetworkEditInspector(){
 const host=document.getElementById('networkEditInspector');if(!host)return;
 if(!networkEditAllowed()){host.innerHTML='';return;}
 const selection=networkEditSelection;
 if(selection?.stop){
  const key=selection.stop,p=networkPositions()[key];
  const edges=networkConnections().filter(e=>e.from===key||e.to===key);
  host.innerHTML=`<section class="network-edit-inspector"><h3>Haltestelle bearbeiten</h3><div class="field"><label for="networkStopLabel">Haltestellenname im Netzplan</label><input id="networkStopLabel" maxlength="100" value="${esc(p.name||key)}" onchange="updateNetworkStop('name',this.value)"></div><div class="form-grid" style="margin-top:12px">${[['x','Punkt X',15,1085],['y','Punkt Y',15,1065],['dx','Textversatz X',-300,300],['dy','Textversatz Y',-150,150]].map(([id,label,min,max])=>`<div class="field"><label for="networkStop_${id}">${label}</label><input id="networkStop_${id}" type="number" min="${min}" max="${max}" step="1" value="${Math.round(p[id]||0)}" onchange="updateNetworkStop('${id}',this.value)"></div>`).join('')}</div><p class="muted">Punkt und Text können unabhängig verschoben werden. Fahrpläne und Ansagezuordnungen behalten ihre Haltestellenkennung.</p><div class="actions">${edges.map((e,i)=>`<button class="small" data-connected-edge="${i}">${esc(e.line)} · ${esc(networkPositions()[e.from===key?e.to:e.from].name||(e.from===key?e.to:e.from))}</button>`).join('')}</div></section>`;
  host.querySelectorAll('[data-connected-edge]').forEach(b=>b.onclick=()=>selectNetworkEdge(networkEdgeKey(edges[Number(b.dataset.connectedEdge)])));
 }else if(selection?.edge){
  const edges=networkConnections(),edge=edges.find(e=>networkEdgeKey(e)===selection.edge);if(!edge){host.innerHTML='';return;}
  const parallel=edges.filter(e=>networkPair(e.from,e.to)===networkPair(edge.from,edge.to));
  host.innerHTML=`<section class="network-edit-inspector"><h3>Gleis / Linie ${esc(edge.line)}</h3><p>${esc(networkPositions()[edge.from].name||edge.from)} ↔ ${esc(networkPositions()[edge.to].name||edge.to)}</p>${parallel.length>1?`<div class="field"><label for="networkParallelEdge">Verbindung auf diesem Abschnitt</label><select id="networkParallelEdge">${parallel.map(e=>`<option value="${esc(networkEdgeKey(e))}" ${networkEdgeKey(e)===selection.edge?'selected':''}>Linie ${esc(e.line)}</option>`).join('')}</select></div>`:''}<p class="muted">Die Grundfarbe gilt für diese Linie. Eigene Abschnittsmarkierungen haben Vorrang.</p>${networkColorControls(edge.baseColor)}<button class="danger small" style="margin-top:14px" onclick="removeSelectedNetworkEdge()">Dieses Gleis entfernen</button></section>`;
  host.querySelector('section').insertAdjacentHTML('beforeend',`<div class="network-edge-style"><h4>Darstellung dieses Abschnitts</h4><div class="form-grid"><div class="field"><label for="networkEdgeStatus">Bedienung</label><select id="networkEdgeStatus" onchange="setNetworkEdgeStatus(this.value)">${[['regular','Regulär'],['construction','Baustelle'],['not-served','Nicht bedient']].map(([value,label])=>`<option value="${value}" ${value===edge.serviceStatus?'selected':''}>${label}</option>`).join('')}</select></div><label class="network-dash-field" for="networkEdgeDashed"><input id="networkEdgeDashed" type="checkbox" ${edge.dashed?'checked':''} onchange="setNetworkEdgeDashed(this.checked)"> Gestrichelt darstellen</label></div><p class="muted">Baustellen werden orange, nicht bediente Abschnitte grau gestrichelt vorbelegt. Farbe und Strichelung sind frei anpassbar und gelten für diese Verbindung.</p>${networkColorControls(edge.color,'setNetworkEdgeColor','networkEdgeColor','Abschnittsfarbe')}<button class="small" style="margin-top:12px" onclick="resetNetworkEdgeStyle()" ${state.networkEdits.edgeStyles[selection.edge]?'':'disabled'}>Abschnittsmarkierung zurücksetzen</button></div>`);
  const select=host.querySelector('#networkParallelEdge');if(select)select.onchange=()=>selectNetworkEdge(select.value);
 }else host.innerHTML='<div class="network-edit-inspector muted">Haltestelle oder Gleis auswählen, um Namen, Positionen und Farben zu bearbeiten.</div>';
}
function selectNetworkEdge(key){if(!networkEditAllowed())return;networkEditSelection={edge:key};refreshNetworkEditor();}
function updateNetworkStop(field,value){
 if(!networkEditAllowed()||!networkEditSelection?.stop)return;
 const key=networkEditSelection.stop,p=networkPositions()[key];
 if(field==='name'){value=String(value).trim().slice(0,100);if(!value){showToast('Bitte einen Haltestellennamen eingeben.');renderNetworkEditInspector();return;}}
 else if(!['x','y','dx','dy'].includes(field)||value===''||!Number.isFinite(Number(value))){renderNetworkEditInspector();return;}
 checkpointNetwork();state.networkEdits=validNetworkEdits({...state.networkEdits,stops:{...state.networkEdits.stops,[key]:{...p,[field]:field==='name'?value:Number(value)}}});saveState();refreshNetworkEditor();
}
function setNetworkLineColor(color){
 if(!networkEditAllowed()||!networkColor(color)||!networkEditSelection?.edge)return;
 const edge=networkConnections().find(e=>networkEdgeKey(e)===networkEditSelection.edge);if(!edge)return;
 checkpointNetwork();state.networkEdits.lineColors[edge.line]=color;saveState();refreshNetworkEditor();
}
function selectedNetworkEdge(){return networkEditAllowed()&&networkEditSelection?.edge?networkConnections().find(e=>networkEdgeKey(e)===networkEditSelection.edge):null;}
function setNetworkEdgeStyle(update){
 const edge=selectedNetworkEdge();if(!edge)return;
 checkpointNetwork();state.networkEdits.edgeStyles[networkEdgeKey(edge)]={color:edge.color,pattern:edge.dashed?'dashed':'solid',status:edge.serviceStatus,...update};saveState();refreshNetworkEditor();
}
function setNetworkEdgeStatus(status){
 if(!['regular','construction','not-served'].includes(status))return;
 const edge=selectedNetworkEdge();if(!edge)return;
 const regularColor=state.networkEdits.lineColors[edge.line]||Object.values(ERFURT_NETWORK.routes).find(r=>r.line===edge.line)?.color||edge.baseColor;
 setNetworkEdgeStyle({status,pattern:status==='regular'?'solid':'dashed',color:status==='construction'?'#d88714':status==='not-served'?'#83919a':regularColor});
}
function setNetworkEdgeDashed(dashed){setNetworkEdgeStyle({pattern:dashed?'dashed':'solid'});}
function setNetworkEdgeColor(color){if(networkColor(color))setNetworkEdgeStyle({color});}
function resetNetworkEdgeStyle(){
 const edge=selectedNetworkEdge();if(!edge||!state.networkEdits.edgeStyles[networkEdgeKey(edge)])return;
 checkpointNetwork();delete state.networkEdits.edgeStyles[networkEdgeKey(edge)];saveState();refreshNetworkEditor();
}
function removeSelectedNetworkEdge(){
 if(!networkEditAllowed()||!networkEditSelection?.edge)return;
 const key=networkEditSelection.edge;checkpointNetwork();
 state.networkEdits.addedEdges=state.networkEdits.addedEdges.filter(e=>networkEdgeKey(e)!==key);
 if(!state.networkEdits.removedEdges.includes(key))state.networkEdits.removedEdges.push(key);
 networkEditSelection=null;saveState();refreshNetworkEditor();
}
function connectNetworkStop(key){
 if(!networkEditAllowed()||!Object.hasOwn(ERFURT_NETWORK.positions,key))return;
 if(!networkConnectFrom){networkConnectFrom=key;networkEditSelection={stop:key};refreshNetworkEditor();return;}
 if(networkConnectFrom===key){showToast('Bitte einen anderen Halt wählen.');return;}
 const from=networkConnectFrom,to=key;networkConnectFrom=null;
 let index=1;const used=new Set([...networkConnections().map(e=>e.line),...Object.keys(state.networkEdits.lineColors)]);while(used.has('Eigenes Gleis '+index))index++;
 const line='Eigenes Gleis '+index,edge={from,to,line,color:'#168a95',inactive:false};
 checkpointNetwork();state.networkEdits.addedEdges.push(edge);networkEditSelection={edge:networkEdgeKey(edge)};saveState();refreshNetworkEditor();
}
function bindNetworkEditor(svg){
 const point=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());};
 let drag=null,suppressClick=false;
 for(const g of svg.querySelectorAll('.network-node'))if(g.dataset.name===networkEditSelection?.stop)g.classList.add('selected');
 for(const line of svg.querySelectorAll('.network-link'))if(line.dataset.edge===networkEditSelection?.edge)line.classList.add('selected');
 const updateGeometry=key=>{
  const p=networkPositions()[key],g=[...svg.querySelectorAll('.network-node')].find(g=>g.dataset.name===key);
  g.querySelector('circle').setAttribute('cx',p.x);g.querySelector('circle').setAttribute('cy',p.y);
  g.querySelector('text').setAttribute('x',p.x+12+(p.dx||0));g.querySelector('text').setAttribute('y',p.y+4+(p.dy||0));
  updateNetworkLinkPaths(svg);
 };
 svg.onpointerdown=e=>{
  if(!networkEditAllowed()||networkEditTool!=='move'||e.button!==0)return;
  const g=e.target.closest('.network-node');if(!g)return;
  drag={key:g.dataset.name,label:e.target.matches('text'),start:point(e),initial:{...networkPositions()[g.dataset.name]},moved:false,capture:g};
  g.setPointerCapture(e.pointerId);e.preventDefault();
 };
 svg.onpointermove=e=>{
  if(!drag||!networkEditAllowed())return;
  const p=point(e),dx=p.x-drag.start.x,dy=p.y-drag.start.y;
  if(!drag.moved&&Math.hypot(dx,dy)<3)return;
  if(!drag.moved){checkpointNetwork();drag.moved=true;}
  const v={...drag.initial};
  if(drag.label){v.dx=networkLimit((v.dx||0)+dx,-300,300,0);v.dy=networkLimit((v.dy||0)+dy,-150,150,0);}
  else{v.x=networkLimit(v.x+dx,15,1085,v.x);v.y=networkLimit(v.y+dy,15,1065,v.y);}
  state.networkEdits.stops[drag.key]=v;networkEditSelection={stop:drag.key};updateGeometry(drag.key);
 };
 const finish=e=>{
  if(!drag)return;const {moved,key,capture}=drag;drag=null;
  if(capture.hasPointerCapture(e.pointerId))capture.releasePointerCapture(e.pointerId);
  if(moved){suppressClick=e.type==='pointerup';saveState();renderNetworkEditorTools();}
  else if(e.type==='pointerup'&&networkEditAllowed()){
   // Pointer capture retargets the following click to the SVG. Select the
   // originally pressed node here so a tap also opens its inspector.
   networkEditSelection={stop:key};refreshNetworkEditor();
  }
 };
 svg.onpointerup=finish;svg.onpointercancel=finish;
 const select=e=>{
  if(!networkEditAllowed())return;
  if(suppressClick){suppressClick=false;return;}
  const g=e.target.closest('.network-node');
  if(g){if(networkEditTool==='connect'){connectNetworkStop(g.dataset.name);return;}networkEditSelection={stop:g.dataset.name};refreshNetworkEditor();return;}
  const line=e.target.closest('.network-link');if(line){selectNetworkEdge(line.dataset.edge);return;}
  networkEditSelection=null;networkConnectFrom=null;refreshNetworkEditor();
 };
 svg.onclick=select;
 svg.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(e);}};
}
