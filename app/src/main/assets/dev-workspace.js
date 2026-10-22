'use strict';
// Workspace state is transient; only validated layout data is persisted.
function cabWorkspaceScope(editor=cabLayoutEditor){
 return editor.scope.vehicleId?'Fahrzeug '+editor.scope.vehicleCode+' · nur diese Bahn':'Typvorlage '+(vehicleType(editor.scope.typeId)?.name||editor.scope.typeId)+' · Ausgangslayout für diesen Typ';
}
function mountCabWorkspace(editor){
 const modal=editor.stage.closest('.modal'),console=editor.stage.closest('.cab-console'),tools=document.querySelector('.cab-layout-tools');
 modal.classList.add('cab-workspace-modal');
 editor.redo=[];editor.selection=new Set([editor.selected]);editor.zoom=1;editor.grid=false;editor.snap=false;editor.guides=false;editor.inspectorTab='appearance';editor.saved=true;
 const header=document.createElement('section');header.className='cab-workspace-header';header.innerHTML=`<div><span class="eyebrow">Dev-Modus · Fahrpult</span><strong id="cabWorkspaceScope">${esc(cabWorkspaceScope(editor))}</strong><span id="cabWorkspaceStatus" role="status">Lokal gespeichert</span></div><div class="actions"></div>`;
 header.querySelector('.actions').append(document.getElementById('cabLayoutToggle'));
 const workspace=document.createElement('div');workspace.className='cab-workspace';
 console.before(header,workspace);workspace.append(console,tools);tools.hidden=false;
 tools.insertAdjacentHTML('afterbegin',`<section id="cabPreviewHelp"><h3>Ausprobieren</h3><p>Die Tasten simulieren Funktionen und spielen die zugeordneten Sounds. Deine aktive Fahrt wird dabei nicht verändert.</p><p class="cab-export-scope">${esc(cabWorkspaceScope(editor))}</p><button type="button" class="primary" onclick="toggleCabLayoutEditor()">Layout bearbeiten</button></section>`);
 const zoom=document.createElement('div');zoom.className='cab-zoom-tools';zoom.innerHTML='<button type="button" onclick="zoomCabWorkspace(-.25)" aria-label="Pult verkleinern">−</button><output id="cabZoomValue">100 %</output><button type="button" onclick="zoomCabWorkspace(.25)" aria-label="Pult vergrößern">＋</button><button type="button" onclick="fitCabWorkspace()">Ganzes Pult anzeigen</button><span class="muted">Vergrößertes Pult über die Hauptseite verschieben.</span>';
 console.querySelector('.cab-panel-viewport').before(zoom);
 zoom.insertAdjacentHTML('beforeend','<label><input type="checkbox" onchange="cabLayoutEditor.pan=this.checked;cabLayoutEditor.stage.classList.toggle(\'cab-pan-mode\',this.checked)"> Pult verschieben</label>');
 mountCabViewportPan(console.querySelector('.cab-panel-viewport'),()=>!!cabLayoutEditor?.pan);
}
function prepareCabWorkspaceTools(){
 const editor=cabLayoutEditor,tools=document.getElementById('cabLayoutTools');if(!editor||!tools)return;
 const actions=tools.querySelector('.actions');
 actions.insertAdjacentHTML('afterbegin','<button id="cabLayoutRedo" type="button" onclick="redoCabLayout()">Wiederholen</button>');
 const reset=actions.querySelector('[onclick="resetCabLayout()"]');reset.onclick=previewCabLayoutReset;
 actions.insertAdjacentHTML('beforeend','<button type="button" onclick="document.getElementById(\'cabLayoutImport\').click()">Layout importieren</button><input hidden type="file" id="cabLayoutImport" accept="application/json,.json" onchange="importCabLayoutFile(event)">');
 const fileActions=document.createElement('details');fileActions.className='cab-file-actions';fileActions.innerHTML='<summary>Datei & Projektlayout</summary><p class="cab-export-scope">'+esc(cabWorkspaceScope(editor))+' · Einzelexport. Auch Sammelexporte lassen sich hier für dieses Ziel importieren.</p>';
 const fileRow=document.createElement('div');fileRow.className='actions';[...actions.children].filter(child=>!['cabLayoutUndo','cabLayoutRedo'].includes(child.id)).forEach(child=>fileRow.append(child));fileActions.append(fileRow);actions.after(fileActions);actions.prepend(document.getElementById('cabLayoutUndo'));
 const instructions=tools.querySelector(':scope > p');if(instructions){const help=document.createElement('details');help.className='cab-editor-help';help.innerHTML='<summary>Bedienhilfe</summary>';help.append(instructions);tools.append(help);}
 tools.insertAdjacentHTML('afterbegin',`<div class="cab-inspector-tabs" role="group" aria-label="Eigenschaften"><button type="button" id="cabAppearanceTab" onclick="setCabInspectorTab('appearance')">Position & Aussehen</button><button type="button" id="cabFunctionTab" onclick="setCabInspectorTab('function')">Funktion & Sounds</button></div><div id="cabWorkspaceNotice" role="status" hidden></div><div id="cabSharedElement"></div>`);
 document.getElementById('cabLayoutProperties').insertAdjacentHTML('afterend','<div id="cabControlInspector" hidden><p>Bedienelement am Pult oder in der Liste auswählen.</p></div><section id="cabTransferPreview" hidden></section>');
 const extra=document.createElement('details');extra.className='cab-alignment-tools';extra.innerHTML='<summary>Ausrichten & Mehrfachauswahl</summary><div class="cab-grid-options"><label><input type="checkbox" onchange="cabLayoutEditor.grid=this.checked;refreshCabWorkspace()"> Raster anzeigen</label><label><input type="checkbox" onchange="cabLayoutEditor.snap=this.checked"> Am Raster einrasten (10 px)</label><label><input type="checkbox" onchange="cabLayoutEditor.guides=this.checked;refreshCabWorkspace()"> Hilfslinien & Einrasten</label></div><p class="muted">Mit Umschalt mehrere Elemente am Pult wählen oder hier markieren. Ziehen und Pfeiltasten bewegen die ganze Auswahl.</p><div class="actions"><button type="button" onclick="alignCabSelection(\'left\')">Links</button><button type="button" onclick="alignCabSelection(\'top\')">Oben</button><button type="button" onclick="alignCabSelection(\'centerX\')">Gleiche X-Mitte</button><button type="button" onclick="alignCabSelection(\'centerY\')">Gleiche Y-Mitte</button><button type="button" onclick="alignCabSelection(\'distributeX\')">Horizontal verteilen</button><button type="button" onclick="alignCabSelection(\'distributeY\')">Vertikal verteilen</button></div><div id="cabMultiSelection"></div>';
 tools.querySelector('details').before(extra);
 const reserve=document.getElementById('cabReserveTools');if(reserve){const details=document.createElement('details');details.className='cab-element-tools';details.innerHTML='<summary>Bedienelement auswählen / Beschriftung hinzufügen</summary>';reserve.before(details);details.append(reserve);}
 refreshCabWorkspace();cabLayoutProperties();setCabInspectorTab(editor.inspectorTab);
}
function refreshCabWorkspace(){
 const editor=cabLayoutEditor;if(!editor)return;
 const modal=editor.stage.closest('.modal');modal?.classList.toggle('is-cab-editing',editor.active);
 const tools=document.querySelector('.cab-layout-tools');if(tools)tools.hidden=false;
 const help=document.getElementById('cabPreviewHelp');if(help)help.hidden=editor.active;
 const toggle=document.getElementById('cabLayoutToggle');if(toggle)toggle.textContent=editor.active?'▶ Ausprobieren':'✎ Bearbeiten';
 const status=document.getElementById('cabWorkspaceStatus');if(status)status.textContent=editor.active?(!editor.saved?'Bearbeiten · Speichern fehlgeschlagen — bitte exportieren':editor.pendingImport?'Importvorschau · noch nicht übernommen':editor.pendingControl?'Funktion & Sounds · noch nicht übernommen':'Bearbeiten · lokal gespeichert'):'Ausprobieren · Fahrfunktionen simuliert';
 const redo=document.getElementById('cabLayoutRedo');if(redo)redo.disabled=!editor.redo?.length;
 editor.selection??=new Set([editor.selected]);editor.selection=new Set([...editor.selection].filter(key=>editor.entries.some(entry=>entry.key===key)&&!cabLayoutMerge(editor.panel.layout,editor.draft)[key]?.hidden));
 for(const entry of editor.entries)entry.node.classList.toggle('cab-layout-multi-selected',editor.active&&editor.selection.has(entry.key)&&entry.key!==editor.selected);
 const list=document.getElementById('cabMultiSelection');
 if(list){const signature=JSON.stringify(editor.entries.map(e=>[e.key,e.node.textContent,editor.selection.has(e.key)]));if(list.dataset.signature!==signature){list.dataset.signature=signature;list.replaceChildren();for(const entry of editor.entries.filter(e=>!cabLayoutMerge(editor.panel.layout,editor.draft)[e.key]?.hidden)){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=editor.selection.has(entry.key);input.onchange=()=>selectCabWorkspaceElement(entry.key,true);label.append(input,document.createTextNode(entry.title));list.append(label);}}}
 editor.stage.classList.toggle('cab-show-grid',editor.active&&editor.grid);
 editor.stage.style.setProperty('--editor-grid-x',10/editor.panel.width*100+'%');editor.stage.style.setProperty('--editor-grid-y',10/editor.panel.height*100+'%');
 for(const axis of ['x','y']){let guide=editor.stage.querySelector('.cab-guide-'+axis);if(!guide){guide=document.createElement('span');guide.className='cab-guide cab-guide-'+axis;guide.setAttribute('aria-hidden','true');editor.stage.append(guide);}guide.hidden=!editor.active||!editor.guides;const entry=editor.entries.find(e=>e.key===editor.selected);if(entry){const value=cabLayoutEntryValue(editor,entry);guide.style[axis==='x'?'left':'top']=value[axis]/editor.panel[axis==='x'?'width':'height']*100+'%';}}
 const zoom=document.getElementById('cabZoomValue');if(zoom)zoom.textContent=Math.round(editor.zoom*100)+' %';
}
function cabWorkspaceSaved(ok){if(cabLayoutEditor){cabLayoutEditor.saved=ok;if(cabLayoutEditor.pendingImport)cancelCabTransfer();refreshCabWorkspace();}}
function setCabInspectorTab(tab){
 const editor=cabLayoutEditor;if(!editor)return;editor.inspectorTab=tab;
 const appearance=document.getElementById('cabLayoutProperties'),functions=document.getElementById('cabControlInspector');
 if(appearance)appearance.hidden=tab!=='appearance';if(functions)functions.hidden=tab!=='function';
 document.getElementById('cabAppearanceTab')?.setAttribute('aria-pressed',String(tab==='appearance'));document.getElementById('cabFunctionTab')?.setAttribute('aria-pressed',String(tab==='function'));
 if(tab==='function'&&!document.getElementById('cabReserveMenu')){const key=cabSelectedControlKey();if(key)openCabControlMenu(key);}
}
function dockCabControlMenu(menu,focus){
 const host=document.getElementById('cabControlInspector');if(!host||!cabLayoutAllowed())return false;
 host.replaceChildren(menu);menu.classList.add('cab-docked-menu');menu.style.left='';menu.style.top='';setCabInspectorTab('function');
 menu.scrollIntoView({block:'nearest'});if(focus)menu.querySelector('select')?.focus({preventScroll:true});return true;
}
function selectCabWorkspaceElement(key,toggle=false,openInspector=true){
 const editor=cabLayoutEditor;if(!editor)return;
 if(toggle){if(editor.selection.has(key))editor.selection.delete(key);else editor.selection.add(key);editor.selected=editor.selection.has(key)?key:[...editor.selection][0]||key;}
 else {if(!editor.selection.has(key))editor.selection=new Set([key]);editor.selected=key;}
 cabLayoutRefresh();cabLayoutProperties();
 if(openInspector&&editor.selection.size===1&&editor.inspectorTab==='function'){const controlKey=cabSelectedControlKey();if(controlKey)openCabControlMenu(controlKey);}
}
function zoomCabWorkspace(delta){
 const editor=cabLayoutEditor;if(!editor)return;editor.zoom=Math.max(.5,Math.min(3,Math.round((editor.zoom+delta)*100)/100));
 editor.stage.style.width=editor.zoom*100+'%';editor.stage.style.minWidth='0';cabLayoutRefresh();
}
function fitCabWorkspace(){if(!cabLayoutEditor)return;cabLayoutEditor.zoom=1;zoomCabWorkspace(0);const viewport=cabLayoutEditor.stage.closest('.cab-panel-viewport');viewport.scrollIntoView({block:'start',inline:'start'});}
function cabWorkspaceOrigins(){const editor=cabLayoutEditor;return Object.fromEntries(editor.entries.filter(e=>editor.selection.has(e.key)).map(e=>[e.key,cabLayoutEntryValue(editor,e)]));}
function moveCabWorkspaceSelection(x,y,origins){
 const editor=cabLayoutEditor;origins??=cabWorkspaceOrigins();const origin=origins[editor.selected];if(!origin)return;
 if(editor.snap){x=Math.round(x/10)*10;y=Math.round(y/10)*10;}
 if(editor.guides){for(const axis of ['x','y']){const target=axis==='x'?x:y,candidates=editor.entries.filter(e=>!editor.selection.has(e.key)).map(e=>cabLayoutEntryValue(editor,e)[axis]);const closest=candidates.sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0];if(Math.abs(closest-target)<=6){if(axis==='x')x=closest;else y=closest;}}}
 const values=Object.values(origins);const dx=Math.max(-Math.min(...values.map(v=>v.x)),Math.min(editor.panel.width-Math.max(...values.map(v=>v.x)),x-origin.x)),dy=Math.max(-Math.min(...values.map(v=>v.y)),Math.min(editor.panel.height-Math.max(...values.map(v=>v.y)),y-origin.y));
 for(const [key,value] of Object.entries(origins))editor.draft[key]={...editor.draft[key],x:value.x+dx,y:value.y+dy};
}
function commitCabWorkspaceDraft(draft){
 const editor=cabLayoutEditor;if(!cabLayoutAllowed()||!cabLayoutValid(draft,editor.panel)||JSON.stringify(draft)===JSON.stringify(editor.draft))return;
 cabLayoutRemember(clone(editor.draft));editor.draft=draft;cabLayoutPersist();cabLayoutRefresh();cabLayoutProperties();
}
function alignCabSelection(action){
 const editor=cabLayoutEditor;if(!cabLayoutAllowed())return;const entries=editor.entries.filter(e=>editor.selection.has(e.key));
 if(entries.length<(action.startsWith('distribute')?3:2)){showToast(action.startsWith('distribute')?'Mindestens drei Elemente auswählen.':'Mindestens zwei Elemente auswählen.');return;}
 const values=entries.map(e=>({key:e.key,...cabLayoutEntryValue(editor,e),width:e.node.getBoundingClientRect().width/editor.stage.getBoundingClientRect().width*editor.panel.width,height:e.node.getBoundingClientRect().height/editor.stage.getBoundingClientRect().height*editor.panel.height}));
 const draft=clone(editor.draft),axis=['left','centerX','distributeX'].includes(action)?'x':'y';
 values.sort((a,b)=>a[axis]-b[axis]);
 const edge=Math.min(...values.map(v=>v[axis]-(axis==='x'?v.width:v.height)/2)),mean=values.reduce((sum,v)=>sum+v[axis],0)/values.length;
 values.forEach((v,i)=>{const position=action.startsWith('distribute')?values[0][axis]+(values.at(-1)[axis]-values[0][axis])*i/(values.length-1):action.startsWith('center')?mean:edge+(axis==='x'?v.width:v.height)/2;draft[v.key]={...draft[v.key],[axis]:Math.max(0,Math.min(editor.panel[axis==='x'?'width':'height'],position))};});commitCabWorkspaceDraft(draft);
}
function addCabPropertyReset(){
 const host=document.getElementById('cabLayoutProperties');if(!host||!cabLayoutAllowed()||host.querySelector('#cabResetProperty'))return;
 const shared=document.getElementById('cabSharedElement'),selector=host.querySelector('#cabLayoutElement')?.closest('label');if(shared&&selector)shared.replaceChildren(selector);
 host.insertAdjacentHTML('beforeend','<div class="cab-property-reset"><label>Zurücksetzen<select id="cabResetProperty"><option value="all">Alle Eigenschaften dieses Elements</option><option value="x">X-Position</option><option value="y">Y-Position</option><option value="text">Beschriftung</option><option value="color">Farbe</option><option value="fontSize">Schriftgröße</option><option value="iconSize">Symbolgröße</option><option value="background">Texthintergrund</option></select></label><button type="button" onclick="resetCabSelectedProperty()">Eigenschaft zurücksetzen</button></div>');
}
function resetCabSelectedProperty(){
 if(!cabLayoutAllowed())return;const editor=cabLayoutEditor,draft=clone(editor.draft),field=document.getElementById('cabResetProperty').value;
 if(field==='all')delete draft[editor.selected];else if(draft[editor.selected]){delete draft[editor.selected][field];if(!Object.keys(draft[editor.selected]).length)delete draft[editor.selected];}commitCabWorkspaceDraft(draft);
}
function redoCabLayout(){
 const editor=cabLayoutEditor;if(!cabLayoutAllowed()||!editor.redo?.length)return;editor.history.push(clone(editor.draft));editor.draft=editor.redo.pop();cabLayoutPersist();cabLayoutRefresh();cabLayoutProperties();
}
function cabLayoutChanges(before,after){
 const changes=[];for(const key of new Set([...Object.keys(before),...Object.keys(after)]))for(const field of new Set([...Object.keys(before[key]||{}),...Object.keys(after[key]||{})]))if(JSON.stringify(before[key]?.[field])!==JSON.stringify(after[key]?.[field]))changes.push({key,field,before:before[key]?.[field],after:after[key]?.[field]});return changes;
}
function showCabTransferPreview(title,draft){
 const editor=cabLayoutEditor;if(!cabLayoutAllowed())return;const changes=cabLayoutChanges(cabLayoutMerge(editor.panel.layout,editor.draft),cabLayoutMerge(editor.panel.layout,draft));editor.pendingImport=clone(draft);
 const host=document.getElementById('cabTransferPreview');host.hidden=false;host.innerHTML=`<h3>${esc(title)}</h3><p><strong>${esc(cabWorkspaceScope(editor))}</strong></p><p>${changes.length} geänderte Eigenschaften. Die Übernahme ersetzt die lokalen Anpassungen dieses Ziels.</p><div class="cab-change-list">${changes.slice(0,150).map(c=>`<div><strong>${esc(c.key)} · ${esc(c.field)}</strong><span>${esc(JSON.stringify(c.before)??'Projektstandard')} → ${esc(JSON.stringify(c.after)??'Projektstandard')}</span></div>`).join('')||'<p>Keine sichtbaren Unterschiede.</p>'}</div><div class="actions"><button type="button" onclick="cancelCabTransfer()">Abbrechen</button><button type="button" class="primary" onclick="confirmCabTransfer()">Änderungen übernehmen</button></div>`;refreshCabWorkspace();host.scrollIntoView({block:'nearest'});
}
function previewCabLayoutReset(){showCabTransferPreview('Projektlayout laden · Vorschau',{});}
function cancelCabTransfer(){if(cabLayoutEditor)cabLayoutEditor.pendingImport=null;const host=document.getElementById('cabTransferPreview');if(host){host.hidden=true;host.replaceChildren();}refreshCabWorkspace();}
function confirmCabTransfer(){if(!cabLayoutAllowed()||!cabLayoutEditor.pendingImport)return;const draft=cabLayoutEditor.pendingImport;cancelCabTransfer();commitCabWorkspaceDraft(draft);}
function cabImportLayoutForTarget(data,editor){
 const single=data?.format==='fahrplan-manager-cab-layout',all=data?.format==='fahrplan-manager-cab-layouts';
 if(!single&&!all||data.schemaVersion!==1)throw Error('Keine unterstützte Layoutdatei (Formatversion 1).');
 const entries=single?[data]:data.layouts;if(!Array.isArray(entries)||entries.length>5000)throw Error('Ungültige Layoutsammlung.');
 const scope=editor.scope;
 const matches=entries.filter(entry=>{
  if(entry?.image!==editor.panel.image||entry.width!==editor.panel.width||entry.height!==editor.panel.height)return false;
  if(scope.vehicleId)return entry.vehicleId===scope.vehicleId&&entry.vehicleType===scope.typeId||entry.vehicles?.some(v=>v.id===scope.vehicleId&&v.typeId===scope.typeId);
  return !entry.vehicleId&&(entry.vehicleType===scope.typeId||entry.vehicleTypes?.includes(scope.typeId));
 });
 if(matches.length!==1)throw Error(matches.length?'Die Datei enthält mehrere Layouts für dieses Ziel.':'Kein passendes Layout für dieses Fahrzeug beziehungsweise diese Typvorlage. Öffne das passende Ziel.');
 const layout=matches[0].cab?.layout;if(!cabLayoutValid(layout,editor.panel))throw Error('Das Layout enthält ungültige Eigenschaften oder Bedienelemente.');return clone(layout);
}
async function importCabLayoutFile(event){
 const input=event.target,file=input.files?.[0],editor=cabLayoutEditor;if(!file||!cabLayoutAllowed())return;
 cancelCabTransfer();document.getElementById('cabWorkspaceNotice').hidden=true;
 try{if(file.size>4*1024*1024)throw Error('Die Layoutdatei darf höchstens 4 MB groß sein.');const data=JSON.parse(await file.text());if(editor!==cabLayoutEditor||!cabLayoutAllowed())return;showCabTransferPreview('Layout importieren · Vorschau',cabImportLayoutForTarget(data,editor));}
 catch(error){if(editor===cabLayoutEditor){const notice=document.getElementById('cabWorkspaceNotice');notice.hidden=false;notice.textContent=error.message;}}finally{input.value='';}
}
function annotateCabSoundTests(menu){
 if(menu.dataset.soundTestsAnnotated)return;menu.dataset.soundTestsAnnotated='true';
 const pending=()=>{if(cabLayoutEditor&&menu.isConnected){cabLayoutEditor.pendingControl=true;refreshCabWorkspace();}};menu.addEventListener('input',pending);menu.addEventListener('change',pending);
 const key=menu.dataset.actuationKey;
 menu.querySelectorAll('[data-cab-tone-phase]').forEach(field=>{const phase=field.dataset.cabTonePhase;const button=field.closest('label').nextElementSibling;if(button){button.textContent=phase==='press'?'▶ Drücken testen':'▶ Loslassen testen';button.onclick=()=>{if(key==='fullscreen'&&phase==='release'){stopVehiclePreviewSound();showToast('Vollbild: Loslassen bleibt stumm.');return;}previewCabBindingSound(field.value,phase==='release'?'up':'down');};}if(key==='fullscreen'&&phase==='release'){field.value='none';field.disabled=true;field.closest('label').insertAdjacentHTML('afterend','<small class="muted">Der Vollbildtaster bleibt beim Loslassen stumm.</small>');}});
 menu.querySelectorAll('[data-cab-sound-position]').forEach(field=>{const button=field.closest('label').nextElementSibling;if(button)button.textContent='▶ Funktion testen';});
}
document.addEventListener('keydown',event=>{
 if(!cabLayoutAllowed()||event.target.matches('input,textarea,select'))return;
 if((event.ctrlKey||event.metaKey)&&(event.key.toLowerCase()==='y'||event.shiftKey&&event.key.toLowerCase()==='z')){event.preventDefault();redoCabLayout();}
},true);
function syncDevModeBanner(){
 let banner=document.getElementById('devModeBanner');if(!banner){banner=document.createElement('aside');banner.id='devModeBanner';banner.className='dev-mode-banner';banner.setAttribute('aria-label','Entwicklerstatus');document.getElementById('view').before(banner);}
 banner.hidden=!state.settings.dev_mode||cabFullscreen;
 const text=currentView==='driver'?'Dev-Modus · Fahrbetrieb':networkEditing&&currentView==='network'?'Dev-Modus · Netzplan bearbeiten':'Dev-Modus aktiv';
 if(banner.dataset.text!==text){banner.dataset.text=text;banner.innerHTML=`<strong>${text}</strong><button type="button" onclick="showView('vehicles')">Fahrpult-Werkzeuge öffnen</button>`;}
}
function mountBulkTimes(){
 const stops=document.getElementById('stopEditor');if(!stops||document.getElementById('bulkTravel'))return;
 stops.insertAdjacentHTML('beforebegin','<details class="bulk-times"><summary>Zeiten für alle Haltestellen setzen</summary><div class="form-grid"><div class="field"><label for="bulkTravel">Fahrzeit je Abschnitt (Min.)</label><input id="bulkTravel" type="number" min="0" max="240" value="2"><label><input id="bulkApplyTravel" type="checkbox" checked> Fahrzeiten übernehmen</label></div><div class="field"><label for="bulkPause">Pause je Halt (Min.)</label><input id="bulkPause" type="number" min="0" max="240" value="0"><label><input id="bulkApplyPause" type="checkbox"> Pausen übernehmen</label></div></div><p class="muted">Gilt ab der zweiten Haltestelle. Der Start bleibt bei null Minuten.</p><div class="actions"><button type="button" onclick="applyBulkTimes()">Zeiten übernehmen</button><button type="button" onclick="document.querySelectorAll(\'#stopEditor details\').forEach(d=>d.open=true)">Alle Halte aufklappen</button><button type="button" onclick="document.querySelectorAll(\'#stopEditor details\').forEach(d=>d.open=false)">Alle zuklappen</button></div></details>');
}
function applyBulkTimes(){
 const travel=Number(document.getElementById('bulkTravel').value),pause=Number(document.getElementById('bulkPause').value),setTravel=document.getElementById('bulkApplyTravel').checked,setPause=document.getElementById('bulkApplyPause').checked;
 if(!setTravel&&!setPause){showToast('Fahrzeiten oder Pausen zum Übernehmen auswählen.');return;}
 if(setTravel&&(!document.getElementById('bulkTravel').value||!Number.isFinite(travel)||travel<0||travel>240)||setPause&&(!document.getElementById('bulkPause').value||!Number.isFinite(pause)||pause<0||pause>240)){showToast('Zeiten müssen zwischen 0 und 240 Minuten liegen.');return;}
 pullDraftValues();draftStops.forEach((stop,index)=>{if(index){if(setTravel)stop.travel=travel;if(setPause)stop.pause=pause;}});
 const open=[...document.querySelectorAll('#stopEditor details')].map(d=>d.open);document.getElementById('stopEditor').innerHTML=renderStopEditorHTML();document.querySelectorAll('#stopEditor details').forEach((d,i)=>d.open=open[i]);refreshDraftTimes();showToast('Zeiten übernommen.');
}
const liveCabViews=new Map();
function mountLiveCabZoom(root){
 const stage=root.querySelector('.cab-stage');if(!stage)return;const viewport=stage.closest('.cab-panel-viewport');
 const controls=document.createElement('div');controls.className='cab-zoom-tools live-cab-zoom';controls.innerHTML='<button type="button" data-zoom="-.25" aria-label="Fahrpult verkleinern">−</button><output>100 %</output><button type="button" data-zoom=".25" aria-label="Fahrpult vergrößern">＋</button><button type="button" data-fit>Ganzes Pult anzeigen</button>';
 const key=state.active?.id+':'+stage.closest('.cab-console').dataset.vehicleBundle;const view=liveCabViews.get(key)||{zoom:1};liveCabViews.clear();liveCabViews.set(key,view);
 let zoom=view.zoom;const apply=()=>{view.zoom=zoom;stage.style.minWidth='0';stage.style.width=zoom*100+'%';controls.querySelector('output').textContent=Math.round(zoom*100)+' %';};
 controls.querySelectorAll('[data-zoom]').forEach(button=>button.onclick=()=>{zoom=Math.max(.5,Math.min(3,zoom+Number(button.dataset.zoom)));apply();});controls.querySelector('[data-fit]').onclick=()=>{zoom=1;apply();viewport.scrollTo(0,0);};
 viewport.before(controls);mountCabViewportPan(viewport,()=>zoom>1);if(zoom!==1)apply();
}
function mountCabViewportPan(viewport,allowed){
 let drag=null;
 viewport.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0||!allowed()||event.target.closest('button,input,select,textarea,[data-cab-layout-key]')&&!cabLayoutEditor?.pan)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:window.scrollX,top:window.scrollY};viewport.setPointerCapture(event.pointerId);event.preventDefault();});
 viewport.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;window.scrollTo(drag.left+drag.x-event.clientX,drag.top+drag.y-event.clientY);});
 for(const event of ['pointerup','pointercancel'])viewport.addEventListener(event,()=>{drag=null;});
}
let pendingNetworkTransfer=null;
function previewNetworkTransfer(edits,title,message){
 if(!state.settings.dev_mode)return;pendingNetworkTransfer={edits:clone(edits),message};
 const fields=[['stops','Haltestellen'],['lineColors','Linienfarben'],['addedEdges','zusätzliche Gleise'],['removedEdges','entfernte Gleise'],['edgeStyles','Abschnittsmarkierungen']];
 const changes=fields.map(([key,label])=>{const before=state.networkEdits[key]||{},after=edits[key]||{};return {label,before:Object.keys(before).length,after:Object.keys(after).length,changed:JSON.stringify(before)!==JSON.stringify(after)};});
 showModal(title,'<p>Ziel: <strong>Lokaler Erfurter Netzplan</strong>. Fahrpläne, Fahrzeuge und Fahrt-Historie bleiben erhalten.</p><p>Die Übernahme ersetzt die lokalen Netzplan-Anpassungen und kann rückgängig gemacht werden.</p><ul>'+changes.map(c=>'<li>'+c.label+': '+c.before+' → '+c.after+(c.changed?' · geändert':' · unverändert')+'</li>').join('')+'</ul>','<button type="button" onclick="pendingNetworkTransfer=null;closeModal()">Abbrechen</button><button type="button" class="primary" onclick="confirmNetworkTransfer()">Änderungen übernehmen</button>');
}
function confirmNetworkTransfer(){if(!state.settings.dev_mode||!pendingNetworkTransfer)return;const transfer=pendingNetworkTransfer;pendingNetworkTransfer=null;closeModal();applyImportedNetworkPlan(transfer.edits);showToast(transfer.message);}
