'use strict';
const CAB_LAYOUT_FONTS=['system-ui','Arial','Verdana','Georgia','Courier New','sans-serif','serif','monospace'];
const CAB_LAYOUT_STORAGE='fahrplan-cab-layouts-v1';
const CAB_LAYOUT_ACTIONS={'':'Keine Funktion',next:'Nächster Halt',back:'Zurück',doors:'Türen öffnen / schließen',passenger:'Fahrgastanzeige',fullscreen:'Vollbild',traffic:'Stau',finish:'Fahrt beenden',emergency:'Not-Aus'};
const CAB_LAYOUT_SYMBOLS=['', 'next','back','doors','close','passenger','fullscreen','traffic','finish','emergency','route'];
const CAB_LAYOUT_SOUNDS={'':'Standard der Funktion',none:'Kein Aktivitätssound','effect:door_open':'Türen öffnen','effect:door_close':'Türen schließen','effect:door_closed':'Türen zu · Ding','effect:emergency':'Notfall','effect:traffic':'Stau','effect:passenger':'Fahrgastanzeige','effect:finish':'Fahrtende','effect:back':'Zurück','mechanical:down':'Taster drücken','mechanical:up':'Taster loslassen','mechanical:latch':'Not-Aus einrasten','mechanical:rotary':'Drehschalter','mechanical:screw':'Schraube lösen','mechanical:ratchet':'Schraube eindrehen'};
const CAB_ACTUATION_TONES={'':'Standard',none:'Kein Betätigungston','mechanical:down':'Klick · Taster','mechanical:up':'Klick · Loslassen','mechanical:latch':'Klack · Einrasten','mechanical:rotary':'Drehschalter','mechanical:screw':'Schraube lösen','mechanical:ratchet':'Ratsche'};
let cabLayoutEditor=null,cabLayoutTouch=null,cabLayoutSuppressClickUntil=0;
function cabReserveExists(panel,key){if(Object.hasOwn(panel.buttons,key))return true;const match=/^(reserve|rotary|spare)-(\d+)$/.exec(key);return !!match&&Number(match[2])<(panel[{reserve:'accessories',rotary:'rotaries',spare:'spares'}[match[1]]]?.length||0);}
function cabControlExists(panel,key){return Object.hasOwn(panel.buttons,key)||cabReserveExists(panel,key)||/^screw-\d+$/.test(key)&&Number(key.slice(6))<panel.screws.length;}
function cabControlKey(node){const button=node?.closest('.cab-button,[data-cab-reserve],.cab-screw');return button?.dataset.cabReserve||button?.dataset.cabControl||(button?.classList.contains('cab-screw')?'screw-'+button.id.replace('cabScrew',''):null);}
function cabReservePositions(panel,key){return key.startsWith('rotary-')?4:key.startsWith('reserve-')&&panel.accessories[Number(key.slice(8))]?.kind==='lever'?2:1;}
function cabLayoutMerge(base,draft){return Object.fromEntries([...new Set([...Object.keys(base||{}),...Object.keys(draft||{})])].map(key=>[key,{...base?.[key],...draft?.[key]}]));}
function cabLayoutCapGeometry(parent){
 const rect=parent.getBoundingClientRect(),css=getComputedStyle(parent);
 if(!parent.matches('.cab-face,.cab-spare-cap')||css.transform==='none')return {rect,pressed:rect,scaleX:1,scaleY:1};
 const matrix=new DOMMatrixReadOnly(css.transform),origin=css.transformOrigin.split(' ').map(parseFloat);
 // Layout coordinates belong to the resting cap. Its current animation must
 // never become a new anchor for an edited symbol.
 return {pressed:rect,scaleX:matrix.a,scaleY:matrix.d,rect:{x:rect.x-matrix.e-(1-matrix.a)*origin[0],y:rect.y-matrix.f-(1-matrix.d)*origin[1],width:rect.width/matrix.a,height:rect.height/matrix.d}};
}
function cabLayoutRestIconRect(node){
 const rect=node.getBoundingClientRect(),cap=cabLayoutCapGeometry(node.parentElement);
 return {x:cap.rect.x+(rect.x-cap.pressed.x)/cap.scaleX,y:cap.rect.y+(rect.y-cap.pressed.y)/cap.scaleY,width:rect.width/cap.scaleX,height:rect.height/cap.scaleY};
}
function cabLayoutSyncFreeLabels(stage,layout,entries){
 stage.querySelectorAll('[data-cab-free-label]').forEach(node=>{if(!Object.hasOwn(layout,node.dataset.cabFreeLabel)){const index=entries?.findIndex(entry=>entry.node===node);if(index>=0)entries.splice(index,1);node.remove();}});
 for(const key of Object.keys(layout).filter(key=>/^heading-free-[a-z0-9-]+$/.test(key))){
  if([...stage.querySelectorAll('[data-cab-free-label]')].some(node=>node.dataset.cabFreeLabel===key))continue;
  const node=document.createElement('span');node.className='cab-group-mark cab-free-label';node.dataset.cabFreeLabel=key;node.style.left='50%';node.style.top='50%';node.textContent='Neue Beschriftung';stage.appendChild(node);
 }
}
function cabLayoutEntries(stage,panel){
 const entries=[],box=stage.getBoundingClientRect();
 const add=(node,key,title,icon=false)=>{
  if(!node)return;const rect=icon?cabLayoutRestIconRect(node):node.getBoundingClientRect(),css=getComputedStyle(node);
  entries.push({node,key,title,icon,style:node.getAttribute('style'),symbol:icon?node.querySelector('path')?.getAttribute('d'):'',symbolTransform:icon?node.querySelector('path')?.getAttribute('transform'):null,text:icon?'':node.textContent,
   defaults:{x:(rect.x+rect.width/2-box.x)/box.width*panel.width,y:(rect.y+rect.height/2-box.y)/box.height*panel.height,
    iconSize:rect.width/box.width*panel.width,color:'#'+(css.color.match(/\d+/g)||['238','238','238']).slice(0,3).map(c=>Number(c).toString(16).padStart(2,'0')).join(''),fontSize:parseFloat(css.fontSize)/box.width*panel.width,fontFamily:CAB_LAYOUT_FONTS.find(font=>css.fontFamily.replaceAll('"','').split(',')[0].trim()===font)||'system-ui',bold:Number(css.fontWeight)>=600,italic:css.fontStyle==='italic',underline:css.textDecorationLine.includes('underline')}});
  node.dataset.cabLayoutKey=key;
 };
 stage.querySelectorAll('.cab-button').forEach(button=>{const key=button.dataset.cabControl;add(button.querySelector('.cab-label'),'label-'+key,'Text · '+button.querySelector('.cab-label').textContent);add(button.querySelector('svg'),'icon-'+key,'Symbol · '+button.querySelector('.cab-label').textContent,true);});
 stage.querySelectorAll('.cab-door-indicator').forEach(indicator=>{const key=indicator.dataset.doorIndicator;add(indicator.querySelector('.cab-label'),'label-'+key,'Anzeige · '+key);add(indicator.querySelector('svg'),'icon-'+key,'Anzeigesymbol · '+key,true);});
 stage.querySelectorAll('.cab-group-mark').forEach((node,i)=>add(node,node.dataset.cabFreeLabel||'heading-'+i,'Pulttext · '+node.textContent));
 stage.querySelectorAll('[data-cab-reserve]').forEach(node=>{const key=node.dataset.cabReserve;add(node.querySelector('.cab-label'),'label-'+key,'Reservetext · '+key);add(node.querySelector('svg'),'icon-'+key,'Reservesymbol · '+key,true);});
 return entries;
}
function cabLayoutValid(layout,panel){
 if(!layout||typeof layout!=='object'||Array.isArray(layout)||Object.keys(layout).length>100)return false;
 return Object.entries(layout).every(([key,value])=>/^(label|icon|heading|control|actuation)-[a-z0-9-]+$/.test(key)&&value&&typeof value==='object'&&!Array.isArray(value)&&(!key.startsWith('control-')||cabReserveExists(panel,key.slice(8)))&&(!key.startsWith('actuation-')||cabControlExists(panel,key.slice(10)))&&Object.entries(value).every(([field,v])=>{
  if(key.startsWith('actuation-'))return field==='mode'?['','momentary','latching'].includes(v):['press','release'].includes(field)&&typeof v==='string'&&Object.hasOwn(CAB_ACTUATION_TONES,v);
  if(field==='hidden')return key.startsWith('heading-')&&typeof v==='boolean';
  if(key.startsWith('control-')){
   if(field==='sound')return typeof v==='string'&&Object.hasOwn(CAB_LAYOUT_SOUNDS,v);
   if(field==='sounds')return v&&typeof v==='object'&&!Array.isArray(v)&&Object.entries(v).every(([position,sound])=>/^[0-3]$/.test(position)&&Number(position)<cabReservePositions(panel,key.slice(8))&&typeof sound==='string'&&Object.hasOwn(CAB_LAYOUT_SOUNDS,sound));
   if(field==='actions')return v&&typeof v==='object'&&!Array.isArray(v)&&Object.entries(v).every(([position,action])=>/^[0-3]$/.test(position)&&Number(position)<cabReservePositions(panel,key.slice(8))&&typeof action==='string'&&Object.hasOwn(CAB_LAYOUT_ACTIONS,action));
   return field==='action'?typeof v==='string'&&Object.hasOwn(CAB_LAYOUT_ACTIONS,v):field==='icon'?CAB_LAYOUT_SYMBOLS.includes(v):field==='text'&&typeof v==='string'&&v.length<=200;
  }
  if(field==='iconSize')return key.startsWith('icon-')&&Number.isFinite(v)&&v>=4&&v<=200;
  if(field==='background')return !key.startsWith('icon-')&&typeof v==='string'&&(v==='transparent'||/^#[0-9a-f]{6}$/i.test(v));
  if(field==='x'||field==='y'||field==='fontSize')return Number.isFinite(v)&&v>=(field==='fontSize'?4:0)&&v<=(field==='fontSize'?120:field==='x'?panel.width:panel.height);
  if(field==='text')return !key.startsWith('icon-')&&typeof v==='string'&&v.length<=200;
  if(field==='color')return typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
  if(field==='fontFamily')return CAB_LAYOUT_FONTS.includes(v);
  return ['bold','italic','underline'].includes(field)&&typeof v==='boolean';
 }));
}
function cabLayoutApply(stage,panel,entries,layout){
 const box=stage.getBoundingClientRect();if(!box.width)return;
 for(const entry of entries){
  const node=entry.node,reserve=node.closest('[data-cab-reserve],.cab-button'),binding=reserve?layout['control-'+cabControlKey(reserve)]:null;
  const value={...(!entry.icon&&binding?.text!==undefined?{text:binding.text}:{}),...layout[entry.key]};
  if(entry.style===null)node.removeAttribute('style');else node.setAttribute('style',entry.style);
  if(!entry.icon)node.textContent=value.text??entry.text;
  if(entry.key.startsWith('heading-')&&value.hidden)node.style.display='none';
  if(entry.icon&&reserve){
   const path=node.querySelector('path'),offset=binding?.icon!==undefined?CAB_ICON_OFFSETS[binding.icon]:null;
   path.setAttribute('d',binding?.icon!==undefined?(CAB_ICONS[binding.icon]||''):entry.symbol||'');
   const transform=binding?.icon!==undefined?(offset?'translate('+offset.join(' ')+')':null):entry.symbolTransform;
   if(transform)path.setAttribute('transform',transform);else path.removeAttribute('transform');
  }
  if(entry.icon&&value.iconSize!==undefined){node.style.width=value.iconSize/panel.width*100+'cqw';node.style.height=value.iconSize/panel.width*100+'cqw';}
  if(value.color)node.style.color=value.color;
  if(!entry.icon&&value.background!==undefined)node.style.backgroundColor=value.background;
  if(!entry.icon){
   if(value.fontFamily)node.style.fontFamily=value.fontFamily;
   if(value.fontSize!==undefined)node.style.fontSize=value.fontSize/panel.width*100+'cqw';
   for(const [field,property,on,off] of [['bold','fontWeight','700','400'],['italic','fontStyle','italic','normal'],['underline','textDecoration','underline','none']])if(value[field]!==undefined)node.style[property]=value[field]?on:off;
  }
  if(value.x!==undefined||value.y!==undefined){
   const natural=entry.icon?cabLayoutRestIconRect(node):node.getBoundingClientRect();
   const targetX=value.x===undefined?natural.x+natural.width/2:box.x+value.x/panel.width*box.width;
   const targetY=value.y===undefined?natural.y+natural.height/2:box.y+value.y/panel.height*box.height;
   // Root SVGs use their face as the containing block; animated caps are
   // measured in their resting pose so symbols travel with the hardware.
   node.style.position='absolute';const parent=(entry.icon?node.parentElement:node.offsetParent)||stage,p=entry.icon?cabLayoutCapGeometry(parent).rect:parent.getBoundingClientRect();
   node.style.left=(targetX-p.x)/p.width*100+'%';node.style.top=(targetY-p.y)/p.height*100+'%';
   node.style.bottom='auto';node.style.transform='translate(-50%,-50%)';
  }
 }
 applyCabButtonBindings(stage,layout);
 applyCabControlModes(stage,panel,layout);
}
function applyCabLayoutToStage(stage,bundle){
 if(!stage)return;const layout=cabLayoutMerge(bundle.cab.layout,cabLayoutSaved(bundle.cab));if(!Object.keys(layout).length)return;
 cabLayoutSyncFreeLabels(stage,layout);
 const entries=cabLayoutEntries(stage,bundle.cab);cabLayoutApply(stage,bundle.cab,entries,layout);
}
function cabLayoutScope(panel,plan){
 const preview=plan===undefined&&vehicleBundlePreview;
 const source=plan||(!preview?state.active?.plan:null);
 const vehicle=preview?state.vehicles.find(item=>item.id===vehiclePreviewVehicleId):source&&(state.vehicles.find(item=>item.id===source.vehicleId)||vehicleForCode(source.tram));
 return {typeId:preview?vehicleBundlePreview.id:source?.vehicleTypeId||vehicle?.typeId||'default',vehicleId:preview?vehicle?.id||null:source?.vehicleId||vehicle?.id||null,vehicleCode:vehicle?.code||source?.tram||''};
}
function cabLayoutStorageKey(panel,scope){return JSON.stringify([scope.vehicleId?'vehicle':'type',scope.vehicleId||scope.typeId,scope.typeId,panel.image]);}
function cabLayoutSaved(panel,scope=cabLayoutScope(panel)){
 try{
  const all=JSON.parse(localStorage.getItem(CAB_LAYOUT_STORAGE)||'{}');
  const keys=[cabLayoutStorageKey(panel,scope),...(scope.vehicleId?[cabLayoutStorageKey(panel,{typeId:scope.typeId})]:[]),panel.image];
  for(const key of keys)if(Object.hasOwn(all,key)&&cabLayoutValid(all[key],panel))return clone(all[key]);
 }catch{}return {};
}
function cabLayoutPersist(){
 const editor=cabLayoutEditor;if(!editor)return;
 try{let all={};try{all=JSON.parse(localStorage.getItem(CAB_LAYOUT_STORAGE)||'{}');}catch{}if(!all||typeof all!=='object'||Array.isArray(all))all={};all[cabLayoutStorageKey(editor.panel,editor.scope)]=editor.draft;localStorage.setItem(CAB_LAYOUT_STORAGE,JSON.stringify(all));}
 catch{cabWorkspaceSaved(false);showToast('Lokales Speichern fehlgeschlagen. Bitte das Layout exportieren.');return;}
 cabWorkspaceSaved(true);
}
function mountCabLayoutEditor(bundle){
 const stage=document.querySelector('.vehicle-bundle-modal .cab-stage');if(!stage)return;
 if(!state.settings.dev_mode){applyCabLayoutToStage(stage,bundle);return;}
 cabLayoutSyncFreeLabels(stage,cabLayoutMerge(bundle.cab.layout,cabLayoutSaved(bundle.cab)));
 const entries=cabLayoutEntries(stage,bundle.cab);
 cabLayoutEditor={bundle,panel:bundle.cab,scope:cabLayoutScope(bundle.cab),stage,entries,draft:cabLayoutSaved(bundle.cab),history:[],active:false,selected:entries[0]?.key,drag:null};
 stage.closest('.cab-console').insertAdjacentHTML('afterend','<section class="cab-layout-tools" aria-label="Fahrpult-Layouteditor"><button type="button" id="cabLayoutToggle" aria-pressed="false" onclick="toggleCabLayoutEditor()">Layout bearbeiten</button><div id="cabLayoutTools" hidden></div></section>');
 mountCabWorkspace(cabLayoutEditor);
 cabLayoutRefresh();
 const observer=new ResizeObserver(()=>cabLayoutRefresh());observer.observe(stage);cabLayoutEditor.observer=observer;
}
function closeCabLayoutEditor(){clearCabLayoutTouch();closeCabReserveMenu();if(!cabLayoutEditor)return;cabLayoutEditor.observer?.disconnect();cabLayoutEditor=null;}
function cabLayoutAllowed(){return !!cabLayoutEditor?.active&&state.settings.dev_mode===true;}
function cabLayoutForegroundOutlines(editor){
 editor.stage.querySelectorAll('.cab-emergency-editor-outline').forEach(node=>node.remove());if(!editor.active)return;
 const stage=editor.stage.getBoundingClientRect();
 const nodes=editor.entries.filter(entry=>entry.node.closest('.cab-emergency')).map(entry=>entry.node);
 nodes.push(...editor.stage.querySelectorAll('.cab-emergency.cab-layout-control-selected'));
 for(const node of nodes){
  const rect=node.getBoundingClientRect(),css=getComputedStyle(node);if(!rect.width||!rect.height)continue;
  const overlay=document.createElement('span');overlay.className='cab-emergency-editor-outline';overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{left:(rect.x-stage.x)/stage.width*100+'%',top:(rect.y-stage.y)/stage.height*100+'%',width:rect.width/stage.width*100+'%',height:rect.height/stage.height*100+'%',outline:css.outline,outlineOffset:css.outlineOffset,borderRadius:css.borderRadius});editor.stage.appendChild(overlay);
 }
}
function cabLayoutRefresh(){
 const editor=cabLayoutEditor;if(!editor)return;
 const layout=cabLayoutMerge(editor.panel.layout,editor.draft);
 cabLayoutSyncFreeLabels(editor.stage,layout,editor.entries);
 const newEntries=cabLayoutEntries(editor.stage,editor.panel).filter(entry=>!editor.entries.some(existing=>existing.key===entry.key));editor.entries.push(...newEntries);
 cabLayoutApply(editor.stage,editor.panel,editor.entries,layout);
 for(const entry of editor.entries){entry.node.classList.toggle('cab-layout-selected',editor.active&&entry.key===editor.selected);entry.node.setAttribute('tabindex',editor.active?'0':'-1');}
 editor.stage.querySelectorAll('.cab-layout-control-selected').forEach(node=>node.classList.remove('cab-layout-control-selected'));
 editor.stage.classList.remove('cab-layout-control-selected');
 const selected=editor.entries.find(entry=>entry.key===editor.selected);
 if(editor.active&&selected)(selected.node.closest('.cab-button,.cab-door-indicator,[data-cab-reserve]')||(selected.key.startsWith('heading-')?editor.stage:null))?.classList.add('cab-layout-control-selected');
 const edit=document.getElementById('cabEditSelectedControl');if(edit)edit.disabled=!cabSelectedControlKey();
 const control=document.getElementById('cabReserveElement');if(control&&cabSelectedControlKey())control.value=cabSelectedControlKey();
 cabLayoutForegroundOutlines(editor);
 const undo=document.getElementById('cabLayoutUndo');if(undo)undo.disabled=!editor.history.length;
 const json=document.getElementById('cabLayoutJson');if(json)json.value=JSON.stringify(cabLayoutExportData(),null,2);
 queuePageTextareas();
 refreshCabWorkspace();
}
function toggleCabLayoutEditor(){
 const editor=cabLayoutEditor;if(!editor||!state.settings.dev_mode)return;
 clearCabLayoutTouch();closeCabReserveMenu();releaseCabButton();stopVehiclePreviewSound();editor.active=!editor.active;editor.stage.classList.toggle('cab-layout-active',editor.active);
 document.getElementById('cabLayoutToggle').setAttribute('aria-pressed',String(editor.active));
 const tools=document.getElementById('cabLayoutTools');tools.hidden=!editor.active;
 if(editor.active){tools.innerHTML=`<p>Text anklicken zum Schreiben, ziehen zum Verschieben. Rechtsklick oder langes Berühren öffnet die Einstellungen des Bedienelements. Pfeiltasten verschieben um einen Pultpixel, mit Umschalt um zehn. Die Anpassung wird separat gespeichert für: <strong>${esc(editor.scope.vehicleId?editor.scope.vehicleCode:vehicleType(editor.scope.typeId)?.name||editor.scope.typeId)}</strong>.</p><div class="actions"><button type="button" id="cabLayoutUndo" onclick="undoCabLayout()">Rückgängig</button><button type="button" onclick="resetCabLayout()">Projektlayout laden</button><button type="button" onclick="exportCabLayout()">Layout exportieren</button></div><div id="cabLayoutProperties"></div><details><summary>JSON-Vorschau & Übernahme ins Projekt</summary><p>Der Export enthält <code>cab.layout</code> für das angegebene Fahrzeugbündel. Diesen Abschnitt in dessen <code>bundle.json</code> übernehmen und die Assets synchronisieren. Die Fahrzeugzuordnung steht im Export. Layouts verschiedener Fahrzeuge und Fahrzeugtypen bleiben unabhängig, auch bei identischem Pult.</p><textarea id="cabLayoutJson" readonly aria-label="Layout-JSON"></textarea></details>`;cabLayoutProperties();}
 if(editor.active){document.getElementById('cabLayoutProperties').insertAdjacentHTML('afterend','<div id="cabReserveTools"></div>');cabReserveTools();}
 if(editor.active)prepareCabWorkspaceTools();
 cabLayoutRefresh();
}
function cabLayoutEntryValue(editor,entry){
 const rect=entry.icon?cabLayoutRestIconRect(entry.node):entry.node.getBoundingClientRect(),stage=editor.stage.getBoundingClientRect();
 return {...entry.defaults,x:(rect.x+rect.width/2-stage.x)/stage.width*editor.panel.width,y:(rect.y+rect.height/2-stage.y)/stage.height*editor.panel.height,...editor.panel.layout?.[entry.key],...editor.draft[entry.key]};
}
function cabLayoutProperties(){
 const editor=cabLayoutEditor;if(!editor?.active)return;
 const entry=editor.entries.find(item=>item.key===editor.selected);if(!entry){document.getElementById('cabLayoutProperties').innerHTML='';return;}
 const reserve=entry.node.closest('[data-cab-reserve],.cab-button'),binding=reserve?cabLayoutMerge(editor.panel.layout,editor.draft)['control-'+cabControlKey(reserve)]:null;
 const value={...(!entry.icon&&binding?.text!==undefined?{text:binding.text}:{}),...cabLayoutEntryValue(editor,entry)};
 const color=/^#[0-9a-f]{6}$/i.test(value.color)?value.color:'#eeeeee';
 document.getElementById('cabLayoutProperties').innerHTML=`<div class="cab-layout-fields"><label>Element<select id="cabLayoutElement" onchange="selectCabLayout(this.value)">${editor.entries.filter(item=>!cabLayoutMerge(editor.panel.layout,editor.draft)[item.key]?.hidden).map(item=>`<option value="${item.key}" ${item.key===entry.key?'selected':''}>${esc(item.title)}</option>`).join('')}</select></label><label>X<input id="cabLayoutX" type="number" min="0" max="${editor.panel.width}" step="0.5" value="${Number(value.x.toFixed(1))}" onchange="editCabLayout('x',this.value)"></label><label>Y<input id="cabLayoutY" type="number" min="0" max="${editor.panel.height}" step="0.5" value="${Number(value.y.toFixed(1))}" onchange="editCabLayout('y',this.value)"></label><label>Farbe<input id="cabLayoutColor" type="color" value="${color}" onchange="editCabLayout('color',this.value)"></label>${entry.icon?'':`<label class="cab-layout-text">Text<input id="cabLayoutText" maxlength="200" value="${esc(value.text??entry.text)}" onchange="editCabLayout('text',this.value)"></label><label>Schriftart<select id="cabLayoutFont" onchange="editCabLayout('fontFamily',this.value)">${CAB_LAYOUT_FONTS.map(font=>`<option ${font===value.fontFamily?'selected':''}>${font}</option>`).join('')}</select></label><label>Schriftgröße (Pultpixel)<input id="cabLayoutFontSize" type="number" min="4" max="120" step="0.5" value="${Math.max(4,Math.min(120,Number(value.fontSize.toFixed(1))))}" onchange="editCabLayout('fontSize',this.value)"></label><div class="cab-layout-format">${[['bold','Fett'],['italic','Kursiv'],['underline','Unterstrichen']].map(([field,label])=>`<label><input type="checkbox" id="cabLayout-${field}" ${value[field]?'checked':''} onchange="editCabLayout('${field}',this.checked)">${label}</label>`).join('')}</div>`}</div>`;
 const fields=document.querySelector('#cabLayoutProperties .cab-layout-fields');
 const textField=document.getElementById('cabLayoutText');if(textField){textField.oninput=()=>editCabLayout('text',textField.value);textField.onblur=()=>{editor.typingNode=null;};}
 if(entry.key.startsWith('heading-'))fields.insertAdjacentHTML('afterend','<button type="button" class="small" onclick="deleteFreeCabLabel()">Beschriftung löschen</button>');
 if(entry.icon)fields.insertAdjacentHTML('beforeend',`<label>Symbolgröße (Pultpixel)<input id="cabLayoutIconSize" type="number" min="4" max="200" step="0.5" value="${Number(value.iconSize.toFixed(1))}" onchange="editCabLayout('iconSize',this.value)"></label>`);
 else fields.insertAdjacentHTML('beforeend',`<label>Texthintergrund<select id="cabLayoutBackgroundMode" onchange="editCabLayout('background',this.value==='transparent'?'transparent':document.getElementById('cabLayoutBackground').value);cabLayoutProperties()"><option value="transparent" ${!value.background||value.background==='transparent'?'selected':''}>Transparent</option><option value="color" ${value.background&&value.background!=='transparent'?'selected':''}>Farbe</option></select></label><label>Hintergrundfarbe<input id="cabLayoutBackground" type="color" value="${/^#[0-9a-f]{6}$/i.test(value.background||'')?value.background:'#222222'}" onchange="editCabLayout('background',this.value);cabLayoutProperties()"></label>`);
 addCabPropertyReset();
}
function selectCabLayout(key){if(!cabLayoutAllowed()||!cabLayoutEditor.entries.some(entry=>entry.key===key))return;selectCabWorkspaceElement(key);}
function cabReserveTools(){
 const host=document.getElementById('cabReserveTools');if(!host||!cabLayoutAllowed())return;
 const buttons=[...cabLayoutEditor.stage.querySelectorAll('.cab-button,[data-cab-reserve],.cab-screw')];
 host.innerHTML=buttons.length?`<p>Bedienelement per Rechtsklick oder langem Berühren bearbeiten, oder hier auswählen. Im Bearbeitungsmodus werden keine Fahrfunktionen ausgelöst.</p><label>Bedienelement<select id="cabReserveElement">${buttons.map(button=>`<option value="${cabControlKey(button)}">${esc(button.getAttribute('aria-label')||button.querySelector('.cab-label')?.textContent||cabControlKey(button))} (${cabControlKey(button)})</option>`).join('')}</select></label><button type="button" onclick="openCabControlMenu(document.getElementById('cabReserveElement').value)">Bedienelement & Betätigungston bearbeiten</button>`:'<p>Dieses Pult enthält keine Bedienelemente.</p>';
 host.querySelector('select')?.insertAdjacentHTML('afterbegin','<option value="panel">Pult / freie Beschriftungen</option>');
 host.insertAdjacentHTML('beforeend','<button type="button" id="cabEditSelectedControl" onclick="editSelectedCabControl()">Markiertes Bedienelement bearbeiten</button><button type="button" id="cabAddFreeLabel" onclick="addFreeCabLabel()">Freie Beschriftung hinzufügen</button>');
}
function cabSelectedControlKey(){const entry=cabLayoutEditor?.entries.find(item=>item.key===cabLayoutEditor.selected);return entry?(cabControlKey(entry.node)||(entry.key.startsWith('heading-')?'panel':null)):null;}
function editSelectedCabControl(){const key=cabSelectedControlKey();if(key)openCabControlMenu(key);}
function openCabPanelLabelsMenu(x,y){
 closeCabReserveMenu();const editor=cabLayoutEditor,layout=cabLayoutMerge(editor.panel.layout,editor.draft),labels=editor.entries.filter(entry=>entry.key.startsWith('heading-')&&!layout[entry.key]?.hidden);
 const menu=document.createElement('section');menu.id='cabReserveMenu';menu.className='cab-reserve-menu';menu.dataset.key='panel';menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Freie Pultbeschriftungen');
 menu.innerHTML=`<h3>Pult / freie Beschriftungen</h3><label>Beschriftung<select id="cabPanelLabel">${labels.map(entry=>`<option value="${entry.key}" ${entry.key===editor.selected?'selected':''}>${esc(layout[entry.key]?.text??entry.text)||'Leere Beschriftung'}</option>`).join('')}</select></label><div class="actions"><button type="button" onclick="chooseCabPanelLabel()" ${labels.length?'':'disabled'}>Text bearbeiten</button><button type="button" onclick="deleteFreeCabLabel(document.getElementById('cabPanelLabel').value)" ${labels.length?'':'disabled'}>Beschriftung löschen</button><button type="button" onclick="addFreeCabLabel()">Neue Beschriftung</button><button type="button" onclick="closeCabReserveMenu()">Schließen</button></div>`;
 document.body.appendChild(menu);positionCabControlMenu(menu,x,y);
}
function chooseCabPanelLabel(){const key=document.getElementById('cabPanelLabel')?.value;closeCabReserveMenu();if(key){selectCabLayout(key);document.getElementById('cabLayoutText')?.focus();}}
function addFreeCabLabel(){
 if(!cabLayoutAllowed())return;const editor=cabLayoutEditor,layout=cabLayoutMerge(editor.panel.layout,editor.draft);let index=1;while(Object.hasOwn(layout,'heading-free-'+index))index++;
 const key='heading-free-'+index,draft=clone(editor.draft);draft[key]={text:'Neue Beschriftung',x:editor.panel.width/2,y:editor.panel.height/2,fontSize:20,color:editor.panel.labelColor||'#fff8df',background:'transparent'};
 if(!cabLayoutValid(draft,editor.panel)){showToast('Es können keine weiteren Beschriftungen angelegt werden.');return;}
 cabLayoutRemember(clone(editor.draft));editor.draft=draft;editor.selected=key;cabLayoutPersist();closeCabReserveMenu();cabLayoutRefresh();cabLayoutProperties();document.getElementById('cabLayoutText')?.focus();
}
function deleteFreeCabLabel(key=cabLayoutEditor?.selected){
 if(!cabLayoutAllowed()||!key?.startsWith('heading-')||!cabLayoutEditor.entries.some(entry=>entry.key===key))return;
 const editor=cabLayoutEditor;cabLayoutRemember(clone(editor.draft));editor.draft[key]={...editor.draft[key],hidden:true};editor.selected=null;cabLayoutPersist();closeCabReserveMenu();cabLayoutRefresh();document.getElementById('cabLayoutProperties').innerHTML='';
}
function closeCabReserveMenu(){document.getElementById('cabReserveMenu')?.remove();if(cabLayoutEditor){cabLayoutEditor.pendingControl=false;refreshCabWorkspace();}}
function mountCabSymbolPicker(menu){
 const select=menu.querySelector('#cabReserveIcon');if(!select)return;select.hidden=true;select.setAttribute('aria-hidden','true');select.tabIndex=-1;
 const picker=document.createElement('div');picker.className='cab-symbol-picker';picker.setAttribute('role','group');picker.setAttribute('aria-label','Symbol auswählen');
 picker.innerHTML=[...select.options].map(option=>{const icon=option.value,offset=CAB_ICON_OFFSETS[icon];return `<button type="button" class="cab-symbol-choice" data-cab-symbol="${icon}" aria-pressed="${icon===select.value}" onclick="selectCabReserveIcon(this.dataset.cabSymbol)">${icon?`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS[icon]}"${offset?` transform="translate(${offset.join(' ')})"`:''}/></svg>`:'<span class="cab-symbol-none" aria-hidden="true">—</span>'}<span>${esc(option.textContent)}</span></button>`;}).join('');
 select.closest('label').insertAdjacentElement('afterend',picker);
}
function selectCabReserveIcon(icon){
 if(!cabLayoutAllowed()||!CAB_LAYOUT_SYMBOLS.includes(icon))return;const menu=document.getElementById('cabReserveMenu'),select=menu?.querySelector('#cabReserveIcon');if(!select)return;
 select.value=icon;menu.querySelectorAll('[data-cab-symbol]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cabSymbol===icon)));
}
function addCabActuationFields(menu,key){
 const editor=cabLayoutEditor,value=cabLayoutMerge(editor.panel.layout,editor.draft)['actuation-'+key]||{};
 menu.dataset.actuationKey=key;
 menu.querySelector('.actions').insertAdjacentHTML('beforebegin',`<label>Schaltverhalten<select id="cabControlMode"><option value="">Standard des Pults</option><option value="momentary">Tastend · springt beim Loslassen zurück</option><option value="latching">Einrastend · bleibt bis zur nächsten Betätigung eingerastet und beleuchtet</option></select></label>`);
 menu.querySelector('#cabControlMode').value=value.mode||'';
 menu.querySelector('.actions').insertAdjacentHTML('beforebegin',`<fieldset><legend>Betätigungston</legend>${[['press','Drücken / Einschalten'],['release','Loslassen / Ausschalten']].map(([phase,label])=>`<label>${label}<select data-cab-tone-phase="${phase}">${Object.entries(CAB_ACTUATION_TONES).map(([sound,name])=>`<option value="${sound}" ${sound===(value[phase]||'')?'selected':''}>${name}</option>`).join('')}</select></label><button type="button" class="small" onclick="previewCabBindingSound(this.previousElementSibling.querySelector('select').value,'${phase==='release'?'up':'down'}')">▶ Anhören</button>`).join('')}</fieldset>`);
}
function openCabControlMenu(key,x,y){
 if(key==='panel'&&cabLayoutAllowed()){openCabPanelLabelsMenu(x,y);return;}
 if(!cabLayoutAllowed()||!cabControlExists(cabLayoutEditor.panel,key))return;
 if(cabReserveExists(cabLayoutEditor.panel,key)){openCabReserveMenu(key,x,y);return;}
 closeCabReserveMenu();const menu=document.createElement('section');menu.id='cabReserveMenu';menu.className='cab-reserve-menu';menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Betätigungston einstellen');
 menu.innerHTML=`<h3>Betätigungston einstellen</h3><p>${esc(CAB_LAYOUT_ACTIONS[key]||key)}</p><div class="actions"><button type="button" onclick="closeCabReserveMenu()">Abbrechen</button><button type="button" class="primary" onclick="saveCabActuation()">Übernehmen</button></div>`;
 document.body.appendChild(menu);addCabActuationFields(menu,key);positionCabControlMenu(menu,x,y);
}
function positionCabControlMenu(menu,x,y,focus=true){
 arrangeCabControlMenu(menu);
 annotateCabSoundTests(menu);
 if(dockCabControlMenu(menu,focus))return;
 menu.style.left=Math.max(8,Math.min(x??(innerWidth-menu.offsetWidth)/2,innerWidth-menu.offsetWidth-8))+'px';menu.style.top=Math.max(8,Math.min(y??40,innerHeight-menu.offsetHeight-8))+'px';if(focus)menu.querySelector('select')?.focus();
}
function arrangeCabControlMenu(menu){
 if(!menu.dataset.actuationKey||menu.querySelector('.cab-menu-grid'))return;
 const grid=document.createElement('div');grid.className='cab-menu-grid';
 const positions=[...menu.querySelectorAll('[data-cab-position]')];
 for(const field of positions){
  const label=field.closest('label'),sound=label.nextElementSibling,audition=sound.nextElementSibling;
  const group=document.createElement('section');group.className='cab-menu-card';group.append(label,sound,audition);grid.appendChild(group);
 }
 const behavior=document.createElement('section');behavior.className='cab-menu-card cab-menu-behavior';
 behavior.append(menu.querySelector('#cabControlMode').closest('label'),menu.querySelector('fieldset'));grid.appendChild(behavior);
 const text=menu.querySelector('#cabReserveText');
 if(text){
  const appearance=document.createElement('section');appearance.className='cab-menu-card cab-menu-appearance';
  appearance.append(text.closest('label'),menu.querySelector('#cabReserveIcon').closest('label'),menu.querySelector('.cab-symbol-picker'));grid.appendChild(appearance);
 }
 if(positions.length===1)grid.classList.add('cab-menu-single');
 menu.querySelector('.actions').before(grid);
}
function cabActuationDraft(menu,draft){
 const key='actuation-'+menu.dataset.actuationKey,value=Object.fromEntries([...menu.querySelectorAll('[data-cab-tone-phase]')].map(field=>[field.dataset.cabTonePhase,field.value])),mode=menu.querySelector('#cabControlMode').value;
 if(mode||cabLayoutEditor.panel.layout?.[key]?.mode)value.mode=mode;
 draft[key]=value;
}
function saveCabActuation(){
 if(!cabLayoutAllowed())return;const menu=document.getElementById('cabReserveMenu');if(!menu)return;
 const editor=cabLayoutEditor,draft=clone(editor.draft);cabActuationDraft(menu,draft);if(!cabLayoutValid(draft,editor.panel))return;
 if(JSON.stringify(draft)!==JSON.stringify(editor.draft)){cabLayoutRemember(clone(editor.draft));editor.draft=draft;cabLayoutPersist();}
 closeCabReserveMenu();cabLayoutRefresh();
}
function openCabReserveMenu(key,x,y){
 if(!cabLayoutAllowed()||!cabReserveExists(cabLayoutEditor.panel,key))return;
 closeCabReserveMenu();const editor=cabLayoutEditor,binding=cabLayoutMerge(editor.panel.layout,editor.draft)['control-'+key]|| (Object.hasOwn(editor.panel.buttons,key)?{action:key,icon:key}:{}),count=cabReservePositions(editor.panel,key);
 const options=value=>Object.entries(CAB_LAYOUT_ACTIONS).map(([action,label])=>`<option value="${action}" ${action===value?'selected':''}>${label}</option>`).join('');
 const menu=document.createElement('section');menu.id='cabReserveMenu';menu.className='cab-reserve-menu';menu.setAttribute('role','dialog');menu.setAttribute('aria-modal','false');menu.setAttribute('aria-label','Bedienelement zuweisen');menu.dataset.key=key;
 const text=editor.draft['label-'+key]?.text??editor.panel.layout?.['label-'+key]?.text??binding.text??editor.entries.find(entry=>entry.key==='label-'+key)?.text??'';
 menu.innerHTML=`<h3>Bedienelement zuweisen</h3><p>${esc(key)} · ${count===1?'Taster':count===2?'Hebel mit zwei Stellungen':'Drehschalter mit vier Stellungen'}</p>${Array.from({length:count},(_,position)=>`<label>${count===1?'Funktion':count===2?(position?'Geschaltet (1)':'Grundstellung (0)'):'Stellung '+position+' · '+position*90+'°'}<select data-cab-position="${position}">${options(binding.actions?.[position]??binding.action??'')}</select></label>`).join('')}<label>Beschriftung<input id="cabReserveText" maxlength="200" value="${esc(text)}"></label><label>Symbol<select id="cabReserveIcon">${CAB_LAYOUT_SYMBOLS.map(icon=>`<option value="${icon}" ${icon===(binding.icon||'')?'selected':''}>${icon?(CAB_LAYOUT_ACTIONS[icon]||{close:'Türen schließen',route:'Streckenverlauf'}[icon]):'Kein Symbol'}</option>`).join('')}</select></label><div class="actions"><button type="button" onclick="closeCabReserveMenu()">Abbrechen</button><button type="button" class="primary" onclick="saveCabReserveBinding()">Übernehmen</button></div>`;
 document.body.appendChild(menu);
 menu.querySelectorAll('[data-cab-position]').forEach(field=>{
  const position=field.dataset.cabPosition,value=binding.sounds?.[position]??binding.sound??'';
  field.closest('label').insertAdjacentHTML('afterend',`<label>Aktivitätssound${count>1?' · Stellung '+position:''}<select data-cab-sound-position="${position}">${Object.entries(CAB_LAYOUT_SOUNDS).map(([sound,label])=>`<option value="${sound}" ${sound===value?'selected':''}>${label}</option>`).join('')}</select></label><button type="button" class="small" onclick="previewCabActivitySound(this.previousElementSibling.querySelector('select'))">▶ Anhören</button>`);
 });
 menu.querySelector('h3').insertAdjacentHTML('afterend','<p>Der Aktivitätssound ersetzt den Sound der Fahrfunktion. Betätigungstöne und Haltestellenansagen bleiben separat.</p>');
 mountCabSymbolPicker(menu);addCabActuationFields(menu,key);positionCabControlMenu(menu,x,y);
}
function saveCabReserveBinding(){
 if(!cabLayoutAllowed())return;const menu=document.getElementById('cabReserveMenu');if(!menu)return;
 const editor=cabLayoutEditor,key=menu.dataset.key,draft=clone(editor.draft),fields=[...menu.querySelectorAll('[data-cab-position]')];
 const binding={text:menu.querySelector('#cabReserveText').value,icon:menu.querySelector('#cabReserveIcon').value};
 const soundFields=[...menu.querySelectorAll('[data-cab-sound-position]')];
 if(soundFields.length===1)binding.sound=soundFields[0].value;
 else binding.sounds=Object.fromEntries(soundFields.map(field=>[field.dataset.cabSoundPosition,field.value]));
 if(fields.length===1)binding.action=fields[0].value;else binding.actions=Object.fromEntries(fields.map(field=>[field.dataset.cabPosition,field.value]));
 // An explicit action clears any inherited per-position assignments and vice versa.
 const base=editor.panel.layout?.['control-'+key];
 if(fields.length===1&&base?.actions)binding.actions=Object.fromEntries(Object.keys(base.actions).map(position=>[position,binding.action]));
 if(fields.length>1)binding.action='';
 if(fields.length===1&&base?.sounds)binding.sounds={'0':binding.sound};
 if(fields.length>1)binding.sound='';
 draft['control-'+key]=binding;const labelKey='label-'+key;if(draft[labelKey]?.text!==undefined||editor.panel.layout?.[labelKey]?.text!==undefined)draft[labelKey]={...draft[labelKey],text:binding.text};cabActuationDraft(menu,draft);
 if(!cabLayoutValid(draft,editor.panel))return;
 if(JSON.stringify(draft)!==JSON.stringify(editor.draft)){cabLayoutRemember(clone(editor.draft));editor.draft=draft;cabLayoutPersist();}
 closeCabReserveMenu();cabLayoutRefresh();cabLayoutProperties();
}
function previewCabActivitySound(field){
 if(!cabLayoutAllowed())return;
 const menu=field.closest('#cabReserveMenu'),position=field.dataset.cabSoundPosition,action=menu.querySelector('[data-cab-position="'+position+'"]').value;
 stopVehiclePreviewSound();
 if(field.value)return playCabReserveSound(field.value,cabLayoutEditor.bundle);
 if(action==='next')return playStopAnnouncementPreview('Anger');
 if(action&&action!=='fullscreen')return playDriverSound(action==='doors'?(vehiclePreviewDoorsOpen?'door_close':'door_open'):action,cabLayoutEditor.bundle,null);
}
function previewCabBindingSound(sound,standard='down'){
 if(!cabLayoutAllowed()||!Object.hasOwn(CAB_LAYOUT_SOUNDS,sound))return;
 stopVehiclePreviewSound();if(sound!=='none')playCabReserveSound(sound||'mechanical:'+standard,cabLayoutEditor.bundle);
}
function cabLayoutRemember(snapshot){cabLayoutEditor.redo=[];cabLayoutEditor.history.push(snapshot);if(cabLayoutEditor.history.length>100)cabLayoutEditor.history.shift();}
function editCabLayout(field,value){
 if(!cabLayoutAllowed())return;const editor=cabLayoutEditor,key=editor.selected;
 if(['x','y','fontSize','iconSize'].includes(field))value=Number(value);
 if(['x','y'].includes(field)&&editor.selection?.size>1){const before=clone(editor.draft),origins=cabWorkspaceOrigins(),origin=origins[key];if(!origin)return;moveCabWorkspaceSelection(field==='x'?value:origin.x,field==='y'?value:origin.y,origins);const after=clone(editor.draft);editor.draft=before;commitCabWorkspaceDraft(after);return;}
 const draft=clone(editor.draft);draft[key]={...draft[key],[field]:value};
 if(!cabLayoutValid(draft,editor.panel)){showToast('Ungültiger Layoutwert.');cabLayoutProperties();return;}
 if(JSON.stringify(draft)===JSON.stringify(editor.draft))return;
 const typing=field==='text'&&document.activeElement?.id==='cabLayoutText'?document.activeElement:null;
 if(!typing||editor.typingNode!==typing)cabLayoutRemember(clone(editor.draft));editor.typingNode=typing;editor.draft=draft;cabLayoutPersist();cabLayoutRefresh();
}
function undoCabLayout(){if(!cabLayoutAllowed()||!cabLayoutEditor.history.length)return;cabLayoutEditor.redo??=[];cabLayoutEditor.redo.push(clone(cabLayoutEditor.draft));cabLayoutEditor.draft=cabLayoutEditor.history.pop();cabLayoutPersist();cabLayoutRefresh();cabLayoutProperties();}
function resetCabLayout(){if(!cabLayoutAllowed())return;cabLayoutRemember(clone(cabLayoutEditor.draft));cabLayoutEditor.draft={};cabLayoutPersist();cabLayoutRefresh();cabLayoutProperties();}
function cabLayoutExportData(){
 const editor=cabLayoutEditor;if(!editor)return null;
 return cabLayoutExportFor(editor.bundle,cabLayoutMerge(editor.panel.layout,editor.draft),editor.scope);
}
function cabLayoutExportFor(bundle,layout,scope={typeId:bundle.id}){
 const panel=bundle.cab,target=panel.image.match(/^vehicle-bundles\/([^/]+)\//)?.[1]||'default';
 return {format:'fahrplan-manager-cab-layout',schemaVersion:1,targetBundle:target,vehicleType:scope.typeId,...(scope.vehicleId?{vehicleId:scope.vehicleId,vehicleCode:scope.vehicleCode}:{}),image:panel.image,width:panel.width,height:panel.height,cab:{layout}};
}
function renderCabLayoutExportButton(){return state.settings.dev_mode?'<button type="button" id="exportAllCabLayoutsButton" onclick="exportAllCabLayouts()">Alle Fahrpult-Layouts exportieren</button>':'';}
function cabLayoutAllExportData(){
 const layouts=new Map();
 const scopes=[{typeId:'default'},...ERFURT_VEHICLE_CATALOG.types.map(type=>({typeId:type.id})),...state.vehicles.map(vehicle=>({typeId:vehicle.typeId,vehicleId:vehicle.id,vehicleCode:vehicle.code}))];
 for(const scope of scopes){
  const bundle=getVehicleBundle({vehicleTypeId:scope.typeId}),panel=bundle.cab;
  const draft=cabLayoutEditor&&cabLayoutStorageKey(cabLayoutEditor.panel,cabLayoutEditor.scope)===cabLayoutStorageKey(panel,scope)?cabLayoutEditor.draft:cabLayoutSaved(panel,scope);
  const data=cabLayoutExportFor(bundle,cabLayoutMerge(panel.layout,draft),scope);
  // Identical layouts can share an export entry while retaining every owner.
  const key=JSON.stringify([data.image,data.width,data.height,data.cab.layout]);
  if(!layouts.has(key))layouts.set(key,{...data,vehicleTypes:[]});
  const entry=layouts.get(key);
  if(scope.vehicleId){entry.vehicles??=[];entry.vehicles.push({id:scope.vehicleId,code:scope.vehicleCode,typeId:scope.typeId});}
  else if(!entry.vehicleTypes.includes(scope.typeId))entry.vehicleTypes.push(scope.typeId);
 }
 return {format:'fahrplan-manager-cab-layouts',schemaVersion:1,appVersion:APP_VERSION,layouts:[...layouts.values()]};
}
function exportAllCabLayouts(){
 if(!state.settings.dev_mode)return;
 saveCabLayoutFile(cabLayoutAllExportData(),'cab-layouts-alle.json');
}
function exportCabLayout(){
 if(!cabLayoutAllowed())return;const data=cabLayoutExportData();saveCabLayoutFile(data,'cab-layout-'+(data.vehicleId||data.vehicleType)+'.json');
}
function saveCabLayoutFile(data,filename){
 const json=JSON.stringify(data,null,2),method=data.format==='fahrplan-manager-cab-layouts'?'saveCabLayouts':'saveCabLayout';
 if(typeof window.AndroidBackup?.[method]==='function'){try{window.AndroidBackup[method](json);}catch{showToast('Layout-Export konnte nicht gestartet werden.');}return;}
 const url=URL.createObjectURL(new Blob([json],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function clearCabLayoutTouch(){if(cabLayoutTouch)clearTimeout(cabLayoutTouch.timer);cabLayoutTouch=null;}
function cancelCabLayoutDrag(){
 const editor=cabLayoutEditor,drag=editor?.drag;if(!drag)return;
 editor.drag=null;editor.draft=drag.before;if(drag.node.hasPointerCapture(drag.pointer))drag.node.releasePointerCapture(drag.pointer);cabLayoutRefresh();
}
function startCabLayoutTouch(event){
 clearCabLayoutTouch();if(event.pointerType!=='touch')return;
 const key=cabControlKey(event.target)||'panel';
 const touch={pointer:event.pointerId,x:event.clientX,y:event.clientY,key,opened:false};
 touch.timer=setTimeout(()=>{
  if(!cabLayoutAllowed()||cabLayoutTouch!==touch)return;
  touch.opened=true;cancelCabLayoutDrag();openCabControlMenu(touch.key,touch.x,touch.y);
 },550);cabLayoutTouch=touch;
}
window.addEventListener('pointerdown',event=>{
 cabLayoutSuppressClickUntil=0;
 if(!event.target.closest('#cabReserveMenu'))closeCabReserveMenu();
 if(!cabLayoutAllowed()||!event.target.closest('.vehicle-bundle-modal .cab-stage')||cabLayoutEditor.pan)return;
 if(event.pointerType==='touch'&&!event.target.closest('[data-cab-layout-key],.cab-button,[data-cab-reserve],.cab-screw,.cab-rotary'))return;
 event.preventDefault();event.stopImmediatePropagation();if(event.button!==0)return;
 startCabLayoutTouch(event);
 const node=event.target.closest('[data-cab-layout-key]');if(!node)return;
 if(event.shiftKey){selectCabWorkspaceElement(node.dataset.cabLayoutKey,true);return;}
 selectCabWorkspaceElement(node.dataset.cabLayoutKey,false,false);node.focus({preventScroll:true});
 const editor=cabLayoutEditor,entry=editor.entries.find(item=>item.key===editor.selected),value=cabLayoutEntryValue(editor,entry);
 editor.drag={pointer:event.pointerId,node,clientX:event.clientX,clientY:event.clientY,x:value.x,y:value.y,origins:cabWorkspaceOrigins(),before:clone(editor.draft),moved:false};node.setPointerCapture(event.pointerId);
},true);
window.addEventListener('pointermove',event=>{
 if(cabLayoutTouch?.pointer===event.pointerId&&Math.hypot(event.clientX-cabLayoutTouch.x,event.clientY-cabLayoutTouch.y)>10)clearCabLayoutTouch();
 const editor=cabLayoutEditor,drag=editor?.drag;if(!cabLayoutAllowed()||!drag||event.pointerId!==drag.pointer)return;
 if(!drag.moved&&Math.hypot(event.clientX-drag.clientX,event.clientY-drag.clientY)<3)return;drag.moved=true;
 event.preventDefault();event.stopImmediatePropagation();const rect=editor.stage.getBoundingClientRect();
 moveCabWorkspaceSelection(drag.x+(event.clientX-drag.clientX)/rect.width*editor.panel.width,drag.y+(event.clientY-drag.clientY)/rect.height*editor.panel.height,drag.origins);cabLayoutRefresh();
},true);
function cabLayoutEndDrag(event){
 if(cabLayoutTouch?.pointer===event.pointerId){const opened=cabLayoutTouch.opened;clearCabLayoutTouch();if(opened){cabLayoutSuppressClickUntil=performance.now()+400;event.preventDefault();event.stopImmediatePropagation();return;}}
 const editor=cabLayoutEditor,drag=editor?.drag;if(!drag||event.pointerId!==drag.pointer)return;
 event.preventDefault();event.stopImmediatePropagation();editor.drag=null;
 if(event.type==='pointercancel')editor.draft=drag.before;
 else if(JSON.stringify(editor.draft)!==JSON.stringify(drag.before)){cabLayoutRemember(drag.before);cabLayoutPersist();}
 if(drag.node.hasPointerCapture(drag.pointer))drag.node.releasePointerCapture(drag.pointer);
 cabLayoutRefresh();cabLayoutProperties();
 if(event.type==='pointerup'&&!drag.moved&&!editor.entries.find(entry=>entry.key===editor.selected)?.icon){setCabInspectorTab('appearance');const field=document.getElementById('cabLayoutText');field?.focus({preventScroll:true});field?.select();}
 else if(event.type==='pointerup'&&!drag.moved&&editor.inspectorTab==='function'){const key=cabSelectedControlKey();if(key)openCabControlMenu(key);}
}
window.addEventListener('pointerup',cabLayoutEndDrag,true);window.addEventListener('pointercancel',cabLayoutEndDrag,true);
window.addEventListener('click',event=>{if(performance.now()<cabLayoutSuppressClickUntil||cabLayoutAllowed()&&event.target.closest('.vehicle-bundle-modal .cab-stage')){event.preventDefault();event.stopImmediatePropagation();}},true);
window.addEventListener('dblclick',event=>{if(cabLayoutAllowed()&&event.target.closest('.vehicle-bundle-modal .cab-stage')){event.preventDefault();event.stopImmediatePropagation();}},true);
window.addEventListener('keydown',event=>{
 if(!cabLayoutAllowed())return;
 if(event.key==='Escape'&&document.getElementById('cabReserveMenu')){event.preventDefault();event.stopImmediatePropagation();closeCabReserveMenu();return;}
 if(event.key==='Escape'&&cabLayoutEditor.pendingImport){event.preventDefault();event.stopImmediatePropagation();cancelCabTransfer();return;}
 if(event.target.closest('.vehicle-bundle-modal .cab-stage')&&['Enter',' '].includes(event.key)&&!event.target.closest('[data-cab-layout-key]')){event.preventDefault();event.stopImmediatePropagation();return;}
 if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'&&!event.target.matches('input,textarea,select')){event.preventDefault();event.stopImmediatePropagation();if(event.shiftKey)redoCabLayout();else undoCabLayout();return;}
 const node=event.target.closest('[data-cab-layout-key]');if(!node)return;
 if(['Enter',' '].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();selectCabLayout(node.dataset.cabLayoutKey);return;}
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
 event.preventDefault();event.stopImmediatePropagation();cabLayoutEditor.selected=node.dataset.cabLayoutKey;if(!cabLayoutEditor.selection?.has(cabLayoutEditor.selected))cabLayoutEditor.selection=new Set([cabLayoutEditor.selected]);
 const entry=cabLayoutEditor.entries.find(item=>item.key===cabLayoutEditor.selected),value=cabLayoutEntryValue(cabLayoutEditor,entry),field=event.key==='ArrowLeft'||event.key==='ArrowRight'?'x':'y';
 const delta=(event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1)*(event.shiftKey?10:1),limit=field==='x'?cabLayoutEditor.panel.width:cabLayoutEditor.panel.height;
 editCabLayout(field,Math.max(0,Math.min(limit,value[field]+delta)));cabLayoutProperties();
},true);
window.addEventListener('contextmenu',event=>{
 if(!cabLayoutAllowed()||!event.target.closest('.vehicle-bundle-modal .cab-stage'))return;const key=cabControlKey(event.target)||'panel';
 event.preventDefault();event.stopImmediatePropagation();if(cabLayoutTouch){clearTimeout(cabLayoutTouch.timer);cabLayoutTouch.opened=true;}cancelCabLayoutDrag();openCabControlMenu(key,event.clientX,event.clientY);
},true);
window.addEventListener('resize',()=>{const menu=document.getElementById('cabReserveMenu');if(menu)positionCabControlMenu(menu,parseFloat(menu.style.left),parseFloat(menu.style.top),false);});
