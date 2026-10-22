'use strict';
let vehicleEditId=null;
let vehicleCatalogOpen=false;
const vehicleType=id=>ERFURT_VEHICLE_CATALOG.types.find(type=>type.id===id);
const vehicleCodeKey=code=>String(code||'').trim().toLocaleLowerCase('de-DE');
function vehicleForCode(code){return state.vehicles.find(vehicle=>vehicleCodeKey(vehicle.code)===vehicleCodeKey(code));}
function validVehicles(raw){
 const ids=new Set(),codes=new Set();
 return (Array.isArray(raw)?raw:[]).slice(0,2000).flatMap(source=>{
  if(!source||typeof source!=='object'||typeof source.code!=='string')return [];
  const code=source.code.trim().replace(/\s+/g,' '),key=vehicleCodeKey(code);
  if(!code||code.length>32||codes.has(key))return [];
  let id=typeof source.id==='string'&&/^vehicle-[a-zA-Z0-9-]+$/.test(source.id)?source.id:newPlanId().replace('plan-','vehicle-');
  if(ids.has(id))id=newPlanId().replace('plan-','vehicle-');
  ids.add(id);codes.add(key);
  return [{id,code,typeId:typeof source.typeId==='string'?source.typeId.slice(0,80):'',notes:typeof source.notes==='string'?source.notes.slice(0,500):'',createdAt:Number(source.createdAt)||Date.now()}];
 });
}
function vehicleAssignment(code,previous=null){
 const vehicle=vehicleForCode(code),type=vehicle&&vehicleType(vehicle.typeId);
 const unchanged=previous&&vehicleCodeKey(previous.tram)===vehicleCodeKey(code);
 return {vehicleId:vehicle?.id||null,vehicleTypeId:vehicle?.typeId||(unchanged?previous.vehicleTypeId:null)||null,vehicleTypeName:type?.name||(unchanged?previous.vehicleTypeName:'')||''};
}
function vehicleInActiveTrip(vehicle){
 return !!state.active&&state.active.status!=='finished'&&(state.active.plan.vehicleId===vehicle.id||vehicleCodeKey(state.active.plan.tram)===vehicleCodeKey(vehicle.code));
}
function vehicleTypeOptions(selected=''){
 const groups=[...new Set(ERFURT_VEHICLE_CATALOG.types.map(type=>type.group))];
 return '<option value="">Fahrzeugtyp auswählen …</option>'+groups.map(group=>`<optgroup label="${esc(group)}">${ERFURT_VEHICLE_CATALOG.types.filter(type=>type.group===group).map(type=>`<option value="${esc(type.id)}" ${selected===type.id?'selected':''}>${esc(type.name)}</option>`).join('')}</optgroup>`).join('');
}
function vehicleTypePhoto(type){
 const photo=ERFURT_VEHICLE_CATALOG.photos[type.photo];
 return `<figure class="vehicle-photo"><img src="${esc(photo.file)}" alt="${esc(type.photoCaption)}" width="960" height="640" loading="lazy"><figcaption>${esc(type.photoCaption)}<details><summary>Foto & Lizenz</summary><a href="${esc(photo.source)}" target="_blank" rel="noopener">${esc(photo.title)}</a> · ${esc(photo.author)} · <a href="${esc(photo.licenseUrl)}" target="_blank" rel="noopener">${esc(photo.license)}</a><br>${esc(photo.changes)}</details></figcaption></figure>`;
}
function vehicleTypeInfo(type,vehicle=null){
 return `<span class="vehicle-category">${esc(type.group)}</span><h3>${esc(type.name)}</h3><p class="muted">${esc(type.manufacturer)}<br>${esc(type.era)}</p><p>${esc(type.description)}</p><div class="actions">${type.features.map(feature=>`<span class="pill">${esc(feature)}</span>`).join('')}</div><details class="vehicle-sources"><summary>Fachquellen</summary>${type.sources.map(key=>{const source=ERFURT_VEHICLE_CATALOG.sources[key];return `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)}</a>`;}).join('<br>')}</details>${vehicleCabThumbnail(type,vehicle)}`;
}
function renderVehicles(el){renderVehiclesContent(el);enhanceView('vehicles',el);}
function renderVehiclesContent(el){
 const editing=state.vehicles.find(vehicle=>vehicle.id===vehicleEditId);
 if(vehicleEditId&&!editing)vehicleEditId=null;
 el.innerHTML=`<div class="vehicles-page"><section class="card"><div class="vehicle-toolbar"><div><h2>Meine Fahrzeuge <span class="pill">${state.vehicles.length}</span></h2><p class="muted">Kürzel anlegen und beim Erstellen oder Bearbeiten eines Fahrplans auswählen.</p></div><button class="primary" onclick="openVehicleEditor()">＋ Fahrzeug anlegen</button></div><div class="actions"><button id="fleetTab" aria-pressed="${!vehicleCatalogOpen}" onclick="setVehicleCatalog(false)">Meine Fahrzeuge</button><button id="vehicleCatalogTab" aria-pressed="${vehicleCatalogOpen}" onclick="setVehicleCatalog(true)">Erfurter Fahrzeugtypen · ${ERFURT_VEHICLE_CATALOG.types.length}</button></div></section><div id="vehicleEditor"></div><div id="vehicleFleet" ${vehicleCatalogOpen?'hidden':''}>${state.vehicles.length?`<div class="vehicle-grid">${state.vehicles.map(vehicle=>renderVehicleCard(vehicle)).join('')}</div>`:`<section class="card empty"><h3>Noch keine Fahrzeuge angelegt</h3><p>Lege zum Beispiel „801“ als Tramlink oder „TW 92“ als Traditionswagen an.</p><button class="primary" onclick="openVehicleEditor()">Erstes Fahrzeug anlegen</button></section>`}</div><section class="card" id="vehicleCatalog" ${vehicleCatalogOpen?'':'hidden'}><div class="vehicle-toolbar"><h2>Erfurter Fahrzeugtypen</h2>${renderCabLayoutExportButton()}</div><p class="muted">Serienfahrzeuge, Traditionswagen und frühere Bauarten. Recherche: 20.10.2026. Die Fotos zeigen Typenbeispiele; abweichende Vergleichs- und Zeitaufnahmen sind beschriftet.</p><div class="vehicle-filters"><div class="field"><label for="vehicleTypeSearch">Typ suchen</label><input id="vehicleTypeSearch" type="search" placeholder="z. B. Combino, Tatra, Gotha" oninput="filterVehicleCatalog()"></div><div class="field"><label for="vehicleTypeGroup">Bereich</label><select id="vehicleTypeGroup" onchange="filterVehicleCatalog()"><option value="">Alle Bauarten</option>${[...new Set(ERFURT_VEHICLE_CATALOG.types.map(type=>type.group))].map(group=>`<option>${esc(group)}</option>`).join('')}</select></div></div><p class="muted" id="vehicleCatalogCount" aria-live="polite"></p><div class="vehicle-grid" id="vehicleTypeResults"></div><p class="muted vehicle-catalog-note">${esc(ERFURT_VEHICLE_CATALOG.scope)} Beiwagen benötigen ein geeignetes Zugfahrzeug. Der Katalog beschreibt Bauarten und ist keine tagesaktuelle Liste einsatzbereiter Wagen.</p></section></div>`;
 if(vehicleCatalogOpen)filterVehicleCatalog();
 if(editing)openVehicleEditor(editing.id);
}
function setVehicleCatalog(open){vehicleCatalogOpen=open;vehicleEditId=null;renderVehicles(document.getElementById('view'));}
function renderVehicleCard(vehicle){
 const type=vehicleType(vehicle.typeId),active=vehicleInActiveTrip(vehicle),uses=state.plans.filter(plan=>plan.vehicleId===vehicle.id).length;
 return `<article class="card vehicle-card" data-vehicle-id="${vehicle.id}">${type?vehicleTypePhoto(type):''}<div class="vehicle-card-body"><div class="vehicle-toolbar"><h2>${esc(vehicle.code)}</h2>${active?'<span class="pill">Aktive Fahrt</span>':''}</div>${type?vehicleTypeInfo(type,vehicle):'<p class="muted">Unbekannter Fahrzeugtyp aus importierten Daten. Bitte neu zuordnen.</p>'}${vehicle.notes?`<p class="vehicle-notes">${esc(vehicle.notes)}</p>`:''}<p class="muted">${uses} verknüpfte Fahrpläne</p><div class="actions"><button class="small" onclick="openVehicleEditor('${vehicle.id}')" ${active?'disabled title="Aktive oder angehaltene Fahrt vorhanden"':''}>Bearbeiten</button><button class="small danger" onclick="deleteVehicle('${vehicle.id}')" ${active?'disabled title="Aktive oder angehaltene Fahrt vorhanden"':''}>Löschen</button></div></div></article>`;
}
function filterVehicleCatalog(){
 const query=document.getElementById('vehicleTypeSearch').value.trim().toLocaleLowerCase('de-DE'),group=document.getElementById('vehicleTypeGroup').value;
 const types=ERFURT_VEHICLE_CATALOG.types.filter(type=>(!group||type.group===group)&&[type.name,type.manufacturer,type.era,type.description].join(' ').toLocaleLowerCase('de-DE').includes(query));
 document.getElementById('vehicleCatalogCount').textContent=`${types.length} Bauarten`;
 document.getElementById('vehicleTypeResults').innerHTML=types.length?types.map(type=>`<article class="vehicle-type-card">${vehicleTypePhoto(type)}<div class="vehicle-card-body">${vehicleTypeInfo(type)}<button class="small" onclick="openVehicleEditor('', '${type.id}')">Fahrzeug dieses Typs anlegen</button></div></article>`).join(''):'<p class="empty">Keine passenden Fahrzeugtypen gefunden.</p>';
}
function openVehicleEditor(id='',preset=''){
 const vehicle=state.vehicles.find(item=>item.id===id);
 if(vehicle&&vehicleInActiveTrip(vehicle)){showToast('Dieses Fahrzeug wird in einer aktiven oder angehaltenen Fahrt verwendet.');return;}
 vehicleEditId=vehicle?.id||null;
 const root=document.getElementById('vehicleEditor');
 root.innerHTML=card(`<h2>${vehicle?'Fahrzeug bearbeiten':'Fahrzeug anlegen'}</h2><form id="vehicleForm" onsubmit="event.preventDefault();saveVehicle()"><div class="form-grid"><div class="field"><label for="vehicleCode">Fahrzeugkürzel</label><input id="vehicleCode" maxlength="32" required autocomplete="off" placeholder="z. B. 801 oder TW 92" value="${esc(vehicle?.code||'')}"></div><div class="field"><label for="vehicleTypeSelect">Fahrzeugtyp</label><select id="vehicleTypeSelect" required onchange="previewVehicleType()">${vehicleTypeOptions(vehicle?.typeId||preset)}</select></div><div class="field"><label for="vehicleNotes">Notiz (optional)</label><textarea id="vehicleNotes" rows="2" maxlength="500" placeholder="z. B. Lackierung oder Besonderheiten">${esc(vehicle?.notes||'')}</textarea></div></div><p id="vehicleFormError" class="vehicle-form-error" role="alert"></p><div id="vehicleTypePreview" class="vehicle-type-preview"></div>${vehicle?'<p class="muted">Kürzel und Typ werden in verknüpften Fahrplänen aktualisiert. Abgeschlossene Fahrten behalten ihre Angaben.</p>':''}<div class="actions"><button type="submit" class="primary">${vehicle?'Änderungen speichern':'Fahrzeug speichern'}</button><button type="button" onclick="cancelVehicleEditor()">Abbrechen</button></div></form>`);
 previewVehicleType();root.scrollIntoView({block:'start',behavior:'smooth'});document.getElementById('vehicleCode').focus({preventScroll:true});
}
function previewVehicleType(){
 const type=vehicleType(document.getElementById('vehicleTypeSelect').value);
 document.getElementById('vehicleTypePreview').innerHTML=type?`${vehicleTypePhoto(type)}<div>${vehicleTypeInfo(type)}</div>`:'';
}
function cancelVehicleEditor(){vehicleEditId=null;document.getElementById('vehicleEditor').innerHTML='';}
function saveVehicle(){
 const existing=state.vehicles.find(vehicle=>vehicle.id===vehicleEditId);
 if(existing&&vehicleInActiveTrip(existing)){showToast('Bearbeiten während einer aktiven oder angehaltenen Fahrt ist gesperrt.');return;}
 const code=document.getElementById('vehicleCode').value.trim().replace(/\s+/g,' '),typeId=document.getElementById('vehicleTypeSelect').value;
 const error=document.getElementById('vehicleFormError');
 if(!code||code.length>32||!vehicleType(typeId)){error.textContent='Bitte ein Kürzel (max. 32 Zeichen) und einen Fahrzeugtyp wählen.';return;}
 if(state.vehicles.some(vehicle=>vehicle.id!==vehicleEditId&&vehicleCodeKey(vehicle.code)===vehicleCodeKey(code))){error.textContent='Dieses Fahrzeugkürzel ist bereits vergeben.';return;}
 const vehicle={id:existing?.id||newPlanId().replace('plan-','vehicle-'),code,typeId,notes:document.getElementById('vehicleNotes').value.trim().slice(0,500),createdAt:existing?.createdAt||Date.now()};
 if(existing)state.vehicles[state.vehicles.indexOf(existing)]=vehicle;else state.vehicles.push(vehicle);
 state.plans.forEach(plan=>{if(plan.vehicleId===vehicle.id&&!planHasActiveTrip(plan.id)){plan.tram=vehicle.code;Object.assign(plan,vehicleAssignment(vehicle.code));}});
 vehicleEditId=null;vehicleCatalogOpen=false;saveState();showView('vehicles');showToast(existing?'Fahrzeug aktualisiert.':'Fahrzeug angelegt.');
}
function deleteVehicle(id){
 const vehicle=state.vehicles.find(item=>item.id===id);if(!vehicle)return;
 if(vehicleInActiveTrip(vehicle)){showToast('Dieses Fahrzeug wird in einer aktiven oder angehaltenen Fahrt verwendet.');return;}
 showModal('Fahrzeug löschen',`Fahrzeug <strong>${esc(vehicle.code)}</strong> aus deiner Liste löschen? Vorhandene Fahrpläne behalten das Kürzel und den Fahrzeugtyp als freie Angabe.`,`<button onclick="closeModal()">Abbrechen</button><button class="danger" onclick="confirmDeleteVehicle('${id}')">Fahrzeug löschen</button>`);
}
function confirmDeleteVehicle(id){
 const vehicle=state.vehicles.find(item=>item.id===id);if(!vehicle)return;
 if(vehicleInActiveTrip(vehicle)){closeModal();showToast('Das Fahrzeug wird gerade verwendet.');return;}
 state.vehicles=state.vehicles.filter(item=>item.id!==id);
 state.plans.forEach(plan=>{if(plan.vehicleId===id)plan.vehicleId=null;});
 vehicleEditId=null;saveState();showView('vehicles');showToast('Fahrzeug gelöscht.');
}
function renderPlanVehicleField(plan){
 const vehicle=state.vehicles.find(item=>item.id===plan?.vehicleId)||vehicleForCode(plan?.tram);
 return `<div class="field"><label for="vehicleInput">Tram / Fahrzeug</label>${state.vehicles.length?`<select id="savedVehicleSelect" aria-label="Gespeichertes Fahrzeug" onchange="selectPlanVehicle(this.value)"><option value="">Freie Fahrzeugangabe</option>${state.vehicles.map(item=>`<option value="${item.id}" ${item.id===vehicle?.id?'selected':''}>${esc(item.code)} · ${esc(vehicleType(item.typeId)?.name||'Unbekannter Typ')}</option>`).join('')}</select>`:''}<input id="vehicleInput" maxlength="32" placeholder="Fahrzeugkürzel oder freie Angabe" value="${esc(plan?.tram||'')}" oninput="syncPlanVehicleChoice()"><small class="muted" id="planVehicleType"></small>${state.vehicles.length?'':'<small class="muted">Eigene Fahrzeuge im Menü „Fahrzeuge“ anlegen.</small>'}</div>`;
}
function selectPlanVehicle(id){
 const vehicle=state.vehicles.find(item=>item.id===id);
 if(vehicle)document.getElementById('vehicleInput').value=vehicle.code;
 else document.getElementById('vehicleInput').value='';
 syncPlanVehicleChoice();
}
function syncPlanVehicleChoice(){
 const vehicle=vehicleForCode(document.getElementById('vehicleInput').value),select=document.getElementById('savedVehicleSelect');
 if(select)select.value=vehicle?.id||'';
 const type=vehicle&&vehicleType(vehicle.typeId);
 document.getElementById('planVehicleType').textContent=type?type.name:'Freie Fahrzeugangabe';
}
