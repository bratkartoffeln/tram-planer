'use strict';
const CAB_ICONS={
 back:'M16 6 6 16l10 10M7 16h20',doors:'M7 5h18v22H7zM16 5v22M3 16h8m-4-4-4 4 4 4M21 16h8m-4-4 4 4-4 4',
 close:'M7 5h18v22H7zM16 5v22M2 16h9m-4-4 4 4-4 4M30 16h-9m4-4-4 4 4 4',next:'m12 6 10 10-10 10M4 16h17M27 6v20',
 traffic:'M7 21V11h18v10M5 21h22M9 25v2m14-2v2M10 7h12M9 16h2m10 0h2',emergency:'m16 3 14 25H2zM16 11v8m0 4v1',
 passenger:'M4 5h24v18H4zM10 28h12M16 23v5M8 11h16M8 17h10',finish:'M12 4H5v24h7M19 9l7 7-7 7M12 16h14',
 fullscreen:'M12 5H5v7m15-7h7v7M5 20v7h7m15-7v7h-7',
 route:'M5 5h22v22H5zM20 5v22M10 11l5 5-5 5'
};
const CAB_ICON_OFFSETS={back:[-.5,0],next:[.5,0],traffic:[0,-1],finish:[.5,0],passenger:[0,-.5],emergency:[0,.5]};
let cabFullscreen=false,cabOwnsBrowserFullscreen=false,cabFullscreenRequest=null;
let cabRouteCollapsed=false;
let cabScrewTripId=null;
const cabLooseScrews=new Set(),cabScrewTouches=new Map();
const cabRotaryTurns=[0,0];
const cabAccessoryStates=new Map();
function cabPosition(x,y,size=140,panel=cabPanel()){return `left:${x/panel.width*100}%;top:${y/panel.height*100}%;width:${size/panel.width*100}%`;}
function cabLabel(label,x,y,width,height=width,pad){
 const style=pad?` style="left:${(pad.x-x+width/2)/width*100}%;top:${(pad.y-y+height/2)/height*100}%;width:${pad.width/width*100}%;color:${pad.ink}"`:'';
 return `<span class="cab-label${pad?' cab-label-pad':''}"${style}>${esc(label)}</span>`;
}
function cabButton({id='',color,label,icon,action,disabled=false,pressed,emergency=false,x,y,size=emergency?200:140,capWidth=emergency?148:96,capHeight=capWidth,shape='round',ink='#eef1f3',labelPad,press},panel=cabPanel()){
 const crop=`--cap-inset:${(size-capWidth)/size*50}%;--cap-inset-y:${(size-capHeight)/size*50}%;--cap-size-x:${panel.width/capWidth*100}%;--cap-size-y:${panel.height/capHeight*100}%;--cap-x:${(x-capWidth/2)/(panel.width-capWidth)*100}%;--cap-y:${(y-capHeight/2)/(panel.height-capHeight)*100}%;--cap-radius:${shape==='rect'?'5%':'50%'};--cap-ink:${ink}`;
 const precision=press?`;${cabPressStyle(press,capWidth,capHeight)}`:'';
 const emergencyCrop=emergency?';'+(panel.emergencySprites?cabEmergencyPhotoLayers(panel):cabPhotoCrop('emergency-mask',x-20,y-140,220,100,panel)+';'+cabPhotoCrop('emergency-ring',x-15,y+10,230,220,panel)):'';
 const previewAction=action?.match(/^previewVehicleCabAction\('([a-z]+)'\)$/)?.[1];
 const offset=CAB_ICON_OFFSETS[icon],adjustment=offset?` transform="translate(${offset.join(' ')})"`:'';
 return `<button ${previewAction?`data-preview-action="${previewAction}"`:""} ${id?`id="${id}"`:''} ${emergency?'aria-label="Notfall"':''} ${id==='cabFullscreenBtn'?`title="${cabFullscreen?'Vollbild beenden':'Vollbild einschalten'}"`:''} data-cab-control="${emergency?'emergency':id==='doorBtn'?'doors':icon}" class="cab-button cab-${color}${press?' cab-precision-press':''}${emergency?' cab-emergency':''}" style="${cabPosition(x,y,size,panel)};${crop}${precision}${emergencyCrop}" onclick="${action}" ${disabled?'disabled':''} ${pressed===undefined?'':`aria-pressed="${pressed}"`}><span class="cab-bezel">${emergency?'<span class="cab-emergency-mask"></span><span class="cab-emergency-base"></span><span class="cab-emergency-stem"></span><span class="cab-emergency-ring"></span>':'<span class="cab-cap-socket"></span>'}<span class="cab-face"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS[icon]}"${adjustment}/></svg></span></span>${cabLabel(label,x,y,size,size,labelPad)}</button>`;
}
function cabPressStyle(press,w,h){return `--press-x:${press[0]/w*100}%;--press-y:${press[1]/h*100}%;--press-scale:${press[2]}`;}
function cabPlaceholder(x,y,panel=cabPanel(),index=0){
 const key='spare-'+index;
 return `<button type="button" class="cab-spare cab-reserve" data-cab-reserve="${key}" style="${cabPosition(x,y,140,panel)};${cabPhotoCrop('spare',x,y,96,96,panel)}" aria-label="Reserve-Taster ${index+1}" onclick="pressCabSpare(this)"><span class="cab-spare-socket"></span><span class="cab-spare-cap">${cabReserveIcon(key,panel)}</span>${cabReserveOverlay(key,panel,'',false)}</button>`;
}
function cabReserveIcon(key,panel){const binding=panel.layout?.['control-'+key]||{};return `<svg class="cab-reserve-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS[binding.icon]||''}"/></svg>`;}
function cabReserveOverlay(key,panel,label='',icon=true){
 const binding=panel.layout?.['control-'+key]||{};
 return `${icon?cabReserveIcon(key,panel):''}${label||`<span class="cab-label">${esc(binding.text||'')}</span>`}`;
}
function pressCabSpare(button){
 if(cabLayoutAllowed())return;
 activateCabReserve(button.dataset.cabReserve,button.closest('.cab-stage'));
}
function cabReserveBinding(key,stage){
 const panel=(vehicleBundlePreview||getVehicleBundle()).cab;
 const layout=cabLayoutMerge(panel.layout,cabLayoutEditor?.stage===stage?cabLayoutEditor.draft:cabLayoutSaved(panel));
 return layout?.['control-'+key]||{};
}
function cabReserveSoundSelection(key,stage,position=0){const binding=cabReserveBinding(key,stage);return binding.sounds?.[position]??binding.sound??'';}
function playCabReserveSound(sound,bundle){
 if(!sound||sound==='none'||!Object.hasOwn(CAB_LAYOUT_SOUNDS,sound))return;
 const [category,id]=sound.split(':');
 if(category==='effect')return playCabMechanicalAsset(bundle.sounds.effects[id],'down');
 return playCabMechanical(id,bundle);
}
function playCabActuation(button,phase,standard,allowDefault=true){
 if(cabLayoutAllowed())return;const bundle=vehicleBundlePreview||getVehicleBundle(),key=cabControlKey(button),stage=button.closest('.cab-stage');
 const layout=cabLayoutMerge(bundle.cab.layout,cabLayoutEditor?.stage===stage?cabLayoutEditor.draft:cabLayoutSaved(bundle.cab));
 const tone=layout['actuation-'+key]?.[phase]||'';
 if(tone)return playCabReserveSound(tone,bundle);else if(allowDefault){
  const switching=button.matches('.cab-rotary,.cab-accessory-lever');
  return playCabMechanical(switching?'rotary':standard,bundle);
 }
}
let cabActivitySound=null;
function activateCabReserve(key,stage,position=0){
 if(cabLayoutAllowed()||!stage||(!vehicleBundlePreview&&(currentView!=='driver'||!state.active)))return;
 const bundle=vehicleBundlePreview||getVehicleBundle(),binding=cabReserveBinding(key,stage),action=binding.actions?.[position]??binding.action;
 const target=action&&Object.hasOwn(CAB_LAYOUT_ACTIONS,action)?stage.querySelector('.cab-button[data-cab-control="'+action+'"]'):null;
 if(target&&(target.cabOriginalAction?target.cabDefaultDisabled:target.disabled))return;
 const sound=binding.sounds?.[position]??binding.sound,activity={sound,handled:false},previous=cabActivitySound;
 cabActivitySound=activity;
 try{if(target)(target.cabOriginalAction||target.onclick)?.call(target,new Event('click'));}finally{cabActivitySound=previous;}
 if(activity.handled)return;
 const gate=cabFollowSoundGate,preview=vehicleBundlePreview,view=currentView;
 if(gate)void gate.promise.then(completed=>{if(completed&&preview===vehicleBundlePreview&&view===currentView)playCabReserveSound(sound,bundle);});else playCabReserveSound(sound,bundle);
}
function applyCabButtonBindings(stage,layout){
 const buttons=[...stage.querySelectorAll('.cab-button')];
 for(const button of buttons)button.cabDefaultDisabled??=button.disabled;
 for(const button of buttons){
  const key=button.dataset.cabControl,binding=layout['control-'+key];
  if(binding){button.cabOriginalAction??=button.onclick;button.onclick=()=>activateCabReserve(key,stage);}
  else if(button.cabOriginalAction){button.onclick=button.cabOriginalAction;delete button.cabOriginalAction;}
  const action=binding?.actions?.['0']??binding?.action;
  const target=action?buttons.find(n=>n.dataset.cabControl===action):null;
  button.disabled=binding?(target?.cabDefaultDisabled??false):button.cabDefaultDisabled;
 }
}
function cabPhotoCrop(prefix,x,y,width,height=width,panel=cabPanel()){
 return `--${prefix}-size:${panel.width/width*100}% ${panel.height/height*100}%;--${prefix}-position:${(x-width/2)/(panel.width-width)*100}% ${(y-height/2)/(panel.height-height)*100}%`;
}
function cabEmergencyPhotoLayers(panel){
 const button=panel.buttons.emergency,{mask,ring,travel,base=ring,color}=panel.emergencySprites;
 const {x,y,size,capWidth,capHeight}=button;
 const box=(prefix,cx,cy,w,h)=>`--${prefix}-left:${(cx-w/2-x+size/2)/size*100}%;--${prefix}-top:${(cy-h/2-y+size/2)/size*100}%;--${prefix}-width:${w/size*100}%;--${prefix}-height:${h/size*100}%`;
 return [cabPhotoCrop('emergency-mask',...mask,panel),cabPhotoCrop('emergency-ring',...ring,panel),
  box('emergency-mask',x,y,capWidth+16,capHeight+16),box('emergency-ring',...ring),box('emergency-base',...base),box('emergency-stem',x+travel[0]*.6,y+travel[1]*.6,capWidth*.80,capHeight*.80),
  `--emergency-base-display:block;--emergency-mask-image:${button.kind==='push'?'none':'var(--cab-image)'};--emergency-mask-fill:${button.kind==='push'?'#27221c':'transparent'}`,
  `--emergency-socket:${color?`radial-gradient(circle at 40% 30%,#282c2e,${color} 75%,#050607)`:button.kind==='push'?'radial-gradient(circle at 40% 30%,#383029,#211c18 75%,#100e0c)':'linear-gradient(125deg,#ffe354,#efcb11 48%,#c69e06)'}`,
  ...(color?[`--emergency-mask-fill:${color}`]:[]),
  `--emergency-cut-x:${(x-ring[0]+ring[2]/2)/ring[2]*100}%;--emergency-cut-y:${(y-ring[1]+ring[3]/2)/ring[3]*100}%;--emergency-cut-w:${capWidth/2/ring[2]*100}%;--emergency-cut-h:${capHeight/2/ring[3]*100}%;--emergency-travel-x:${travel[0]/capWidth*100}%;--emergency-travel-y:${travel[1]/capHeight*100}%`].join(';');
}
function renderCabAccessory(control,index,panel,preview=false){
 const {kind,label,sprite,onSprite}=control;
 const poses=kind==='lever'?[sprite,onSprite]:[sprite];
 const left=Math.min(...poses.map(([x,y,w])=>x-w/2)),right=Math.max(...poses.map(([x,y,w])=>x+w/2));
 const top=Math.min(...poses.map(([x,y,w,h])=>y-h/2)),bottom=Math.max(...poses.map(([x,y,w,h])=>y+h/2));
 const x=(left+right)/2,y=(top+bottom)/2,w=right-left,h=bottom-top;
 const states=preview?vehiclePreviewAccessoryStates:cabAccessoryStates,key=(preview?vehicleBundlePreview.id:getVehicleBundle().id)+':'+index;
 const active=!!states.get(key),crop=kind==='button'?cabPhotoCrop('accessory',...sprite,panel):'';
 const style=`left:${x/panel.width*100}%;top:${y/panel.height*100}%;width:${w/panel.width*100}%;height:${h/panel.height*100}%;${crop};${control.press?cabPressStyle(control.press,w,h):''}`;
 const caps=kind==='lever'?poses.map(([cx,cy,pw,ph],pose)=>{
  const asset=panel.leverSprites[pose?'on':'off'];
  return `<span class="cab-accessory-cap cab-lever-${pose?'on':'off'}" style="left:${(cx-pw/2-left)/w*100}%;top:${(cy-ph/2-top)/h*100}%;width:${pw/w*100}%;height:${ph/h*100}%;${asset.flipX?'transform:scaleX(-1);':''}background-image:url('${esc(asset.image)}');${cabPhotoCrop('accessory',...asset.crop,asset)}"></span>`;
 }).join(''):'<span class="cab-accessory-cap"></span>';
 return `<button type="button" id="cabAccessory${index}" class="cab-accessory cab-accessory-${kind} cab-accessory-${control.profile||'toggle'}${active?' is-on':''}" data-accessory-index="${index}" data-cab-reserve="reserve-${index}" style="${style}" aria-pressed="${active}" aria-label="${esc(label)} · Reserve" title="${esc(label)} · Reserve" onclick="toggleCabAccessory(${index})">${caps}${cabReserveOverlay('reserve-'+index,panel,control.labelPad?cabLabel(label,x,y,w,h,control.labelPad):'')}</button>`;
}
function toggleCabAccessory(index){
 if(cabLayoutAllowed())return;
 if(!vehicleBundlePreview&&(currentView!=='driver'||!state.active))return;
 const bundle=vehicleBundlePreview||getVehicleBundle(),control=bundle.cab.accessories?.[index];
 const button=document.getElementById('cabAccessory'+index);if(!control||!button)return;
 const states=vehicleBundlePreview?vehiclePreviewAccessoryStates:cabAccessoryStates,key=bundle.id+':'+index,on=button.dataset.cabMode?cabModeIsOn(button):!states.get(key);
 states.set(key,on);button.classList.toggle('is-on',on);button.setAttribute('aria-pressed',String(on));
 const position=control.kind==='lever'&&on?1:0;
 if(control.kind==='lever')playCabActuation(button,on?'press':'release','rotary');
 activateCabReserve('reserve-'+index,button.closest('.cab-stage'),position);
}
function cabRotaryLabel(index,turns=cabRotaryTurns){return `Reserve-Drehschalter ${index===0?'Scheibe':'Betrieb'}, Stellung ${turns[index]%4*90}°`;}
function renderCabRotary(index,x,y,panel=cabPanel(),preview=false){
 const turns=preview?vehiclePreviewRotaryTurns:cabRotaryTurns;
 const isolated=!!panel.rotarySprites.image,size=isolated?140:180,grip=panel.rotarySprites.grip,ring=panel.rotarySprites.ring;
 const crop=['mask','ring','grip'].map(name=>cabPhotoCrop('rotary-'+name,...panel.rotarySprites[name],panel)).join(';')+(isolated?`;--rotary-grip-image:url('${esc(panel.rotarySprites.image)}');--grip-left:${(grip[0]-grip[2]/2-ring[0]+size/2)/size*100}%;--grip-top:${(grip[1]-grip[3]/2-ring[1]+size/2)/size*100}%;--grip-width:${grip[2]/size*100}%;--grip-height:${grip[3]/size*100}%`:'');
 return `<button type="button" id="cabRotary${index}" class="cab-rotary cab-reserve${isolated?' cab-rotary-isolated':''}" data-cab-reserve="rotary-${index}" style="${cabPosition(x,y,size,panel)};${crop};--rotary-angle:${turns[index]*90}deg" aria-label="${cabRotaryLabel(index,turns)}" title="Reserve: pro Klick 90° im Uhrzeigersinn" onclick="turnCabRotary(${index})"><span class="cab-rotary-mask"></span><span class="cab-rotary-ring"><span class="cab-rotary-disc"></span></span><span class="cab-rotary-turn"><span class="cab-rotary-grip"></span></span>${cabReserveOverlay('rotary-'+index,panel)}</button>`;
}
function turnCabRotary(index){
 if(cabLayoutAllowed())return;
 if((!vehicleBundlePreview&&(currentView!=='driver'||!state.active))||!Number.isInteger(index)||index<0||index>=cabRotaryTurns.length)return;
 const knob=document.getElementById('cabRotary'+index);if(!knob)return;
 const turns=vehicleBundlePreview?vehiclePreviewRotaryTurns:cabRotaryTurns;
 turns[index]=knob.dataset.cabMode==='latching'?(cabModeIsOn(knob)?1:0):turns[index]+1;knob.style.setProperty('--rotary-angle',turns[index]*90+'deg');knob.setAttribute('aria-label',cabRotaryLabel(index,turns));playCabActuation(knob,'press','rotary');
 activateCabReserve('rotary-'+index,knob.closest('.cab-stage'),turns[index]%4);
}
function cabDoorIndicator(x,y,color,label,active,icon,blinking=false,panel=cabPanel(),dimensions={}){
 const {size=140,capWidth=96,capHeight=capWidth,shape='round',labelPad}=dimensions;
 const crop=`--cap-inset:${(size-capWidth)/size*50}%;--cap-inset-y:${(size-capHeight)/size*50}%;--cap-size-x:${panel.width/capWidth*100}%;--cap-size-y:${panel.height/capHeight*100}%;--cap-x:${(x-capWidth/2)/(panel.width-capWidth)*100}%;--cap-y:${(y-capHeight/2)/(panel.height-capHeight)*100}%;--cap-radius:${shape==='rect'?'5%':'50%'}`;
 return `<span class="cab-door-indicator cab-indicator-${color}${active?' is-lit':''}${blinking?' is-blinking':''}" data-door-indicator="${color==='green'?'closed':'open'}" style="${cabPosition(x,y,size,panel)};${crop}" aria-hidden="true"><span class="cab-bezel"><span class="cab-face"><svg viewBox="0 0 32 32"><path d="${CAB_ICONS[icon]}"/></svg></span></span>${cabLabel(label,x,y,size,size,labelPad)}</span>`;
}
function renderCabScrew(index,x,y,label,panel=cabPanel(),preview=false,cap=panel.screwCap||54){
 const missing=preview?vehiclePreviewLooseScrews.has(index):cabLooseScrews.has(index);
 const crop=`--screw-size-x:${panel.width/cap*100}%;--screw-size-y:${panel.height/cap*100}%;--screw-x:${(x-cap/2)/(panel.width-cap)*100}%;--screw-y:${(y-cap/2)/(panel.height-cap)*100}%`;
 return `<button type="button" id="cabScrew${index}" class="cab-screw${missing?' is-missing':''}" style="${cabPosition(x,y,cap/.75,panel)};${crop}" data-screw-label="${label}" aria-label="${missing?'Schraubenloch':'Schraube'} ${label}" title="Doppelklick: Schraube ${missing?'eindrehen':'herausdrehen'}" ondblclick="toggleCabScrew(${index})" onpointerup="touchCabScrew(event,${index})" onkeydown="if(!event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();toggleCabScrew(${index})}"><span class="cab-screw-hole"></span><span class="cab-screw-face"></span></button>`;
}
function touchCabScrew(event,index){
 if(cabLayoutAllowed())return;
 if(event.pointerType==='mouse')return;
 const touches=vehicleBundlePreview?vehiclePreviewScrewTouches:cabScrewTouches;
 const now=performance.now(),previous=touches.get(index);
 if(previous&&now-previous.at<=450&&Math.hypot(event.clientX-previous.x,event.clientY-previous.y)<24){touches.delete(index);toggleCabScrew(index);}
 else touches.set(index,{at:now,x:event.clientX,y:event.clientY});
}
function toggleCabScrew(index){
 if(cabLayoutAllowed())return;
 if(!vehicleBundlePreview&&(currentView!=='driver'||!state.active))return;
 const loose=vehicleBundlePreview?vehiclePreviewLooseScrews:cabLooseScrews;
 const screw=document.getElementById('cabScrew'+index);if(!screw)return;
 if(screw.classList.contains('is-loose')||screw.classList.contains('is-tightening'))return;
 const tightening=loose.has(index);
 if(tightening)loose.delete(index);else loose.add(index);
 screw.classList.remove('is-missing');screw.classList.add(tightening?'is-tightening':'is-loose');screw.setAttribute('aria-busy','true');
 screw.setAttribute('aria-label',`${tightening?'Schraube':'Schraubenloch'} ${screw.dataset.screwLabel}`);
 screw.title=`Doppelklick: Schraube ${tightening?'herausdrehen':'eindrehen'}`;
 screw.querySelector('.cab-screw-face').addEventListener('animationend',()=>{
  screw.classList.remove('is-loose','is-tightening');screw.classList.toggle('is-missing',!tightening);screw.removeAttribute('aria-busy');
 },{once:true});
 playCabActuation(screw,tightening?'release':'press',tightening?'ratchet':'screw');
}
function renderCabControls(a,pause,previewBundle=null){
 const moving=doorMotion?.tripId===a.id;
 if(!previewBundle&&cabScrewTripId!==a.id){cabScrewTripId=a.id;cabLooseScrews.clear();cabScrewTouches.clear();cabRotaryTurns.fill(0);cabAccessoryStates.clear();}
 const bundle=previewBundle||getVehicleBundle(a.plan),panel=bundle.cab,{spares,headings}=panel;
 return `<section class="cab-console${panel.skin==='panel'?' cab-panel-front':''}" data-vehicle-bundle="${esc(bundle.id)}" style="--cab-image:url('${esc(panel.image)}');--cab-width:${panel.width};--cab-height:${panel.height};--cab-console:${panel.colors.console};--cab-panel:${panel.colors.panel};--cab-text:${panel.colors.text};--cab-label-ink:${panel.labelColor||'#fff8df'}" aria-label="Fahrpult in Frontalansicht"><div class="cab-header"><span>${esc(vehicleBundleInfo(bundle).title)} <small>LINIE ${esc(a.plan.line)} · TRAM ${esc(a.plan.tram)}</small></span></div><p class="cab-scroll-hint">Das Pult bei Bedarf seitlich verschieben.</p><div class="cab-panel-viewport" tabindex="0" role="region" aria-label="Fahrpult, auf kleinen Bildschirmen seitlich verschiebbar"><div class="cab-stage"><img class="cab-panel-photo" src="${esc(panel.image)}" width="${panel.width}" height="${panel.height}" alt="" draggable="false">${panel.screws.map(([x,y,label,cap],index)=>renderCabScrew(index,x,y,label,panel,!!previewBundle,cap)).join('')}<div class="driver-controls cab-controls">
 ${headings.map(([name,x,y])=>`<span class="cab-group-mark" style="left:${x/panel.width*100}%;top:${y/panel.height*100}%">${name}</span>`).join('')}
 ${cabButton({id:'nextStopBtn',...panel.buttons.next,color:'blue',label:'Nächster Halt',icon:'next',action:previewBundle?"previewVehicleCabAction('next')":'nextStop()',disabled:!previewBundle&&(pause>0||a.doorsOpen||a.position>=a.plan.stops.length-1)},panel)}
 ${cabButton({...panel.buttons.back,color:'white',label:'Zurück',icon:'back',action:previewBundle?"previewVehicleCabAction('back')":'driverPrevious()',disabled:!previewBundle&&(a.position===0||pause>0)},panel)}
 ${cabButton({id:'doorBtn',...panel.buttons.doors,color:'green',label:a.doorsOpen?'Türen schließen':'Türen öffnen',icon:a.doorsOpen?'close':'doors',action:previewBundle?"previewVehicleCabAction('doors')":'toggleDoors()',pressed:a.doorsOpen,disabled:moving},panel)}
 ${cabButton({...panel.buttons.passenger,color:'white',label:'Fahrgastanzeige',icon:'passenger',action:previewBundle?"previewVehicleCabAction('passenger')":'openPassengerDisplay()'},panel)}
 ${cabButton({id:'cabFullscreenBtn',...panel.buttons.fullscreen,color:'fullscreen-toggle',label:'Vollbild',icon:'fullscreen',action:previewBundle?"previewVehicleCabAction('fullscreen')":'toggleCabFullscreen()',pressed:cabFullscreen},panel)}
 ${cabButton({...panel.buttons.traffic,color:'amber',label:'Stau',icon:'traffic',action:previewBundle?"previewVehicleCabAction('traffic')":'openTrafficModal()'},panel)}
 ${cabButton({...panel.buttons.finish,color:'red',label:'Fahrt beenden',icon:'finish',action:previewBundle?"previewVehicleCabAction('finish')":'finishTrip(state.active.position>=state.active.plan.stops.length-1)'},panel)}
 ${cabButton({id:'emergencyBtn',...panel.buttons.emergency,color:'red',label:'NOT-AUS',icon:'emergency',action:previewBundle?"previewVehicleCabAction('emergency')":'pressCabEmergency()',emergency:true,pressed:a.status==='suspended'||(!previewBundle&&!!document.getElementById('emergencyLocation'))},panel)}
 <div class="cab-door-indicators" role="status" aria-label="${moving?(doorMotion.opening?'Türen öffnen':'Türen schließen'):a.doorsOpen?'Türen geöffnet':'Türen geschlossen'}">${cabDoorIndicator(panel.indicators.closed.x,panel.indicators.closed.y,'green','Türen zu',!a.doorsOpen,'close',false,panel,panel.indicators.closed)}${cabDoorIndicator(panel.indicators.open.x,panel.indicators.open.y,'amber','Türen offen',a.doorsOpen,'doors',moving,panel,panel.indicators.open)}</div>
 ${spares.map(([x,y],index)=>cabPlaceholder(x,y,panel,index)).join('')}
 ${(panel.accessories||[]).map((control,index)=>renderCabAccessory(control,index,panel,!!previewBundle)).join('')}
 ${panel.rotaries.map(([x,y],index)=>renderCabRotary(index,x,y,panel,!!previewBundle)).join('')}
 </div></div></div><div class="cab-footer"><span>${esc(vehicleBundleInfo(bundle).variant)}</span>${previewBundle?'':`<div><button class="cab-text-button" onclick="toggleCockpitSound()" aria-pressed="${!!state.settings.cockpit_muted}">${state.settings.cockpit_muted?'Tastentöne aus':'Tastentöne an'}</button><button class="cab-text-button" onclick="showCockpitSources()">Bild- & Tonquellen</button></div>`}</div></section>`;
}
function updateCabRoutePanel(){
 document.body.classList.toggle('cab-route-collapsed',cabFullscreen&&cabRouteCollapsed);
 const panel=document.querySelector('.driver-view>.grid>.col-4');
 if(panel)panel.inert=cabFullscreen&&cabRouteCollapsed;
 const button=document.getElementById('cabRouteToggle');
 if(button){
  const label=cabRouteCollapsed?'Streckenverlauf einblenden':'Streckenverlauf ausblenden';
  button.setAttribute('aria-expanded',String(!cabRouteCollapsed));button.setAttribute('aria-label',label);button.title=label;
 }
}
function toggleCabRoutePanel(){
 if(!cabFullscreen||currentView!=='driver')return;
 cabRouteCollapsed=!cabRouteCollapsed;updateCabRoutePanel();queueCabRouteLayout();
}
document.addEventListener('transitionend',event=>{
 if(event.target.matches('.driver-view>.grid')&&event.propertyName.startsWith('grid-template'))queueCabRouteLayout();
});
function toggleCabFullscreen(){if(currentView==='driver'&&state.active)setCabFullscreen(!cabFullscreen);}
function setCabFullscreen(enabled){
 cabFullscreen=enabled===true&&currentView==='driver'&&!!state.active;
 document.body.classList.toggle('cab-fullscreen',cabFullscreen);
 updateCabFullscreenStatus();
 const button=document.getElementById('cabFullscreenBtn');
 if(button){button.setAttribute('aria-pressed',String(cabFullscreen));button.title=cabFullscreen?'Vollbild beenden':'Vollbild einschalten';}
 let native=false;
 if(window.AndroidDisplay&&typeof AndroidDisplay.setImmersive==='function'){
  try{AndroidDisplay.setImmersive(cabFullscreen);native=true;}catch{/* The layout remains usable without a native display bridge. */}
 }
 if(cabFullscreen&&!native&&!document.fullscreenElement&&!cabFullscreenRequest&&document.documentElement.requestFullscreen){
  cabOwnsBrowserFullscreen=true;
  try{
   cabFullscreenRequest=Promise.resolve(document.documentElement.requestFullscreen({navigationUI:'hide'})).then(()=>{
    cabOwnsBrowserFullscreen=document.fullscreenElement===document.documentElement;
    if(!cabFullscreen&&cabOwnsBrowserFullscreen){cabOwnsBrowserFullscreen=false;return document.exitFullscreen();}
   }).catch(()=>{if(!document.fullscreenElement)cabOwnsBrowserFullscreen=false;}).finally(()=>{cabFullscreenRequest=null;});
  }catch{cabOwnsBrowserFullscreen=false;}
 }else if(!cabFullscreen&&cabOwnsBrowserFullscreen){
  cabOwnsBrowserFullscreen=false;
  if(document.fullscreenElement===document.documentElement)Promise.resolve(document.exitFullscreen()).catch(()=>{});
 }
 queueCabRouteLayout();
}
function queueCabRouteLayout(){
 requestAnimationFrame(()=>{
  const map=document.getElementById('driverRouteMap');
  if(map&&state.active&&currentView==='driver'){delete map.dataset.followedStop;followCurrentRouteStop(map,state.active);}
 });
}
window.addEventListener('resize',queueCabRouteLayout);
function updateCabFullscreenStatus(){
 updateCabRoutePanel();
 const host=document.getElementById('cabFullscreenStatus'),trip=state.active;
 if(!host||!cabFullscreen||!trip)return;
 if(!host.querySelector('#cabFullscreenLive'))host.innerHTML=`<div id="cabFullscreenLive"></div><button type="button" id="cabRouteToggle" class="cab-route-toggle" aria-controls="driverRouteMap" onclick="toggleCabRoutePanel()"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="${CAB_ICONS.route}"/></svg></button>`;
 updateCabRoutePanel();
 const live=host.querySelector('#cabFullscreenLive');
 const delay=activeDelayMin(),pause=currentPauseSeconds();
 live.innerHTML=`<div><span class="eyebrow">Aktueller Halt</span><strong class="cab-fullscreen-stop">${esc(trip.plan.stops[trip.position].name)}</strong><span class="muted">Linie ${esc(trip.plan.line)} · Tram ${esc(trip.plan.tram)} · Halt ${trip.position+1}/${trip.plan.stops.length}</span></div><div class="actions"><span class="status ${statusClass(delay)}">${esc(statusText(delay))}</span><span class="pill">${nowClock()}</span>${pause>0?`<span class="pill">Pause ${Math.floor(pause/60)}:${String(pause%60).padStart(2,'0')}</span>`:''}</div>`;
}
document.addEventListener('fullscreenchange',()=>{if(cabOwnsBrowserFullscreen&&!document.fullscreenElement){cabOwnsBrowserFullscreen=false;setCabFullscreen(false);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&cabFullscreen&&!document.getElementById('modalRoot').innerHTML){event.preventDefault();setCabFullscreen(false);}});
function pressCabEmergency(){
 if(!state.active||state.active.status!=='running')return;
 const b=document.getElementById('emergencyBtn');if(b)b.setAttribute('aria-pressed','true');
 openEmergencyModal();
}
function resetCabEmergency(){if(state.active?.status==='running')document.getElementById('emergencyBtn')?.setAttribute('aria-pressed','false');}
function toggleCockpitSound(){state.settings.cockpit_muted=!state.settings.cockpit_muted;stopCabMechanics();stopDriverSound();saveState();showView('driver');}
function showCockpitSources(){
 const bundle=getVehicleBundle();
 showModal('Fahrpult · Bild- und Tonquellen',`${vehicleBundleSources(bundle)}${bundle.id==='default'?'<p>Fotorealistische Pultgrafik mit dem integrierten Imagegen-Tool nach der vom Nutzer bereitgestellten Vorlage erzeugt. Weiße Gruppenumrandungen, elfenbeinfarbene Tasterringe und vier Schrauben sind Teil der Grafik. Acht Funktionstaster sind interaktiv, darunter Vollbild. Zwei separate Kontrollleuchten zeigen den Türzustand; zwei Reserve-Drehschalter lassen sich ohne Fahrfunktion drehen; zehn graue Reserveelemente bleiben rein grafisch. Quelle, Arbeitsdatei und Prompt sind in IMAGE_SOURCES.md dokumentiert.</p>':''}<p>Tasterdruck und Loslassen sowie Umschalter und Drehschalter: vom Nutzer bereitgestellte Aufnahmen, getrennt von Ansagen und Funktionssounds. Der Not-Aus verwendet weiterhin seinen eigenen synthetischen Einrastton. Notfallbuzzer: eigene Synthese.</p><p>Türen: „Tram doors open and close hiss and beeping“, stephan, Public Domain. <a href="https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg" target="_blank" rel="noopener">Quelle</a>. Ausschnitte, Pegel angepasst, synthetischer Vorwarnton ergänzt.</p><p>Stau: „Audio sound of a busy traffic in Porthacourt“, ElemePodcast, CC BY 4.0, und „Car Horn“, 15HPanska_Ruttner_Jan, CC0. Ausschnitte mit Hupe gemischt. Fahrtende: Windows XP Shutdown, Microsoft, aus dem Winhistory-Archiv, leiser abgemischt. Zurück: bereitgestellter Jingle aus „Back to the Future“, Alan Silvestri. Details und Quellenlinks: AUDIO_SOURCES.md.</p>`, '<button class="primary" onclick="closeModal()">Schließen</button>');
}
// A separate Web Audio channel keeps short mechanical transients independent of
// stop announcements and the Android MediaPlayer sequence. No runtime downloads.
let cabAudioContext=null;
const cabMechanicalSources=new Set();
let cabFollowSoundGate=null,cabHoldSoundGate=null,cabMechanicalRequest=0;
const cabNativeMechanicalPending=new Map();
window.onNativeCabMechanicalEnd=(id,completed)=>{const resolve=cabNativeMechanicalPending.get(id);cabNativeMechanicalPending.delete(id);resolve?.(completed===true);};
function beginCabFollowSound(){
 const gate={};gate.promise=new Promise(resolve=>gate.resolve=resolve);cabFollowSoundGate=gate;cabHoldSoundGate=gate;
 void gate.promise.then(()=>{if(cabFollowSoundGate===gate)cabFollowSoundGate=null;});
}
function stopCabMechanics(){cabMechanicalGeneration++;cabFollowSoundGate?.resolve(false);cabHoldSoundGate=null;if(window.AndroidAnnouncements?.stopMechanical)AndroidAnnouncements.stopMechanical();for(const resolve of cabNativeMechanicalPending.values())resolve(false);cabNativeMechanicalPending.clear();for(const s of cabMechanicalSources){try{s.stop();}catch{}}cabMechanicalSources.clear();}
function playCabMechanical(kind,bundle=vehicleBundlePreview){
 const sound=bundle?.sounds.mechanical[kind]||cabMechanicalSound(kind);
 if(sound&&!sound.startsWith('synth:'))return playCabMechanicalAsset(sound,kind);
 return playCabMechanicalSynth(kind);
}
function playCabMechanicalSynth(kind){
 if(kind==='screw'||kind==='ratchet'){playCabScrewSound(kind==='ratchet');return;}
 if(state.settings.cockpit_muted||document.hidden)return;
 try{
  cabAudioContext??=new (window.AudioContext||window.webkitAudioContext)();
  const ctx=cabAudioContext;void ctx.resume();
  const rotary=kind==='rotary',latch=kind==='latch',up=kind==='up',duration=rotary ? .24 : latch ? .16 : up ? .045 : .065;
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let seed=23;
  for(let i=0;i<data.length;i++){
   const t=i/ctx.sampleRate;seed=(seed*1664525+1013904223)>>>0;
   const strike=(at,decay,hz)=>{const u=t-at;return u<0?0:Math.exp(-u*decay)*Math.min(1,u/.0005)*(Math.sin(2*Math.PI*hz*u)*.48+(seed/4294967296*2-1)*.18);};
   data[i]=rotary?(strike(0,130,1150)*.025+strike(.155,95,780)*.4+strike(.172,160,1450)*.2):(strike(0,latch?65:up?180:125,up?2600:latch?420:1150)+(latch?strike(.043,90,760)*.7:0))*.32;
  }
  const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);cabMechanicalSources.add(source);
  return new Promise(resolve=>{source.onended=()=>{cabMechanicalSources.delete(source);resolve(true);};source.start();});
 }catch{/* A muted/unavailable audio device must not prevent operating the cab. */}
}
const cabMechanicalBuffers=new Map();
let cabMechanicalGeneration=0;
async function playCabMechanicalAsset(path,kind){
 if(state.settings.cockpit_muted||document.hidden)return;
 if(window.AndroidAnnouncements?.playMechanicalWithCompletion){
  const id=++cabMechanicalRequest,generation=cabMechanicalGeneration;
  const completed=await new Promise(resolve=>{cabNativeMechanicalPending.set(id,resolve);AndroidAnnouncements.playMechanicalWithCompletion(path,kind,id);});
  if(!completed&&generation===cabMechanicalGeneration)return playCabMechanicalSynth(kind);
  return completed;
 }
 if(window.AndroidAnnouncements?.playMechanical){AndroidAnnouncements.playMechanical(path,kind);return;}
 const generation=cabMechanicalGeneration;
 try{
  cabAudioContext??=new (window.AudioContext||window.webkitAudioContext)();
  await cabAudioContext.resume();
  if(!cabMechanicalBuffers.has(path))cabMechanicalBuffers.set(path,fetch(path).then(r=>{if(!r.ok)throw Error(path);return r.arrayBuffer();}).then(bytes=>cabAudioContext.decodeAudioData(bytes)).catch(error=>{cabMechanicalBuffers.delete(path);throw error;}));
  const buffer=await cabMechanicalBuffers.get(path);
  if(generation!==cabMechanicalGeneration||state.settings.cockpit_muted||document.hidden)return;
  const source=cabAudioContext.createBufferSource();source.buffer=buffer;source.connect(cabAudioContext.destination);cabMechanicalSources.add(source);
  return await new Promise(resolve=>{source.onended=()=>{cabMechanicalSources.delete(source);resolve(generation===cabMechanicalGeneration);};source.start();});
 }catch{if(generation===cabMechanicalGeneration)return playCabMechanicalSynth(kind);return false;}
}
let cabHeld=null,cabHeldLatching=false;
function playCabScrewSound(tightening=false){
 if(state.settings.cockpit_muted||document.hidden)return;
 try{
  cabAudioContext??=new (window.AudioContext||window.webkitAudioContext)();
  const ctx=cabAudioContext;void ctx.resume();
  const duration=tightening?1.25:1.65;
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let seed=71;
  for(let i=0;i<data.length;i++){
   const t=i/ctx.sampleRate;seed=(seed*1664525+1013904223)>>>0;
   const noise=seed/4294967296*2-1;
   const strike=(at,decay,level)=>{const u=t-at;return u<0?0:level*Math.exp(-u*decay)*Math.min(1,u/.0008)*(Math.sin(2*Math.PI*1850*u)+.46*Math.sin(2*Math.PI*3170*u)+.25*noise);};
   let value=0;
   if(tightening){
    // Drive strokes alternate with short, dry pawl clicks on the return stroke.
    for(let stroke=0;stroke<4;stroke++){
     value+=strike(.12+stroke*.25,100,.025);
     if(stroke<3)for(let tooth=0;tooth<7;tooth++){
      const u=t-(.28+stroke*.25+tooth*.012);
      if(u>=0)value+=Math.exp(-u*310)*Math.min(1,u/.0003)*(.09*Math.sin(2*Math.PI*2400*u)+.04*Math.sin(2*Math.PI*4100*u)+.018*noise);
     }
    }
    value+=strike(1.13,100,.095);
   }else{
    for(let turn=0;turn<10;turn++)value+=strike(turn*.062,95,.035);
    value+=strike(1.10,28,.18)+strike(1.29,40,.11)+strike(1.44,60,.065);
   }
   data[i]=Math.max(-.65,Math.min(.65,value));
  }
  const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);cabMechanicalSources.add(source);
  source.onended=()=>cabMechanicalSources.delete(source);source.start();
 }catch{/* The visual Easter egg also works without an audio device. */}
}
function releaseCabButton(){
 if(!cabHeld)return;const button=cabHeld,gate=cabHoldSoundGate;cabHoldSoundGate=null;
 button.classList.remove('is-down');
 const sound=!cabHeldLatching?playCabActuation(button,'release','up',!button.classList.contains('cab-emergency')):null;
 if(gate)void Promise.resolve(sound).then(completed=>gate.resolve(completed!==false),()=>gate.resolve(false));
 if(cabHeldLatching&&button.dataset.cabMode==='latching')syncCabModeVisual(button);cabHeld=null;cabHeldLatching=false;
}
function cabButtonLatches(button){
 if(button.dataset.cabMode)return button.dataset.cabMode==='latching';
 return button.classList.contains('cab-accessory-button');
}
function holdCabButton(button){
 if(cabLayoutAllowed())return;
 releaseCabButton();cabHeld=button;button.classList.add('is-down');
 // Keep the physical mode for this press, including layout refreshes while held.
 cabHeldLatching=cabButtonLatches(button);
 if(!cabHeldLatching&&!button.classList.contains('cab-emergency'))beginCabFollowSound();
 const on=button.dataset.cabMode?cabModeIsOn(button):button.classList.contains('is-on');
 const emergency=button.classList.contains('cab-emergency'),releasing=cabHeldLatching&&on;
 playCabActuation(button,releasing?'release':'press',releasing?'up':emergency?'latch':'down',!releasing||!emergency);
}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.cab-button,.cab-spare,.cab-accessory-button');if(!b||b.disabled||e.button!==0)return;holdCabButton(b);},true);
document.addEventListener('pointerup',releaseCabButton,true);
document.addEventListener('pointercancel',releaseCabButton,true);
document.addEventListener('keydown',e=>{const b=e.target.closest('.cab-button,.cab-spare,.cab-accessory-button');if(!b||b.disabled||e.repeat||!['Enter',' '].includes(e.key))return;holdCabButton(b);},true);
document.addEventListener('keyup',e=>{if(['Enter',' '].includes(e.key))releaseCabButton();},true);
window.addEventListener('blur',()=>{releaseCabButton();stopCabMechanics();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseCabButton();stopCabMechanics();}});

// Physical switch states are scoped to the current trip or preview, independent
// of a function's semantic state (doors, fullscreen, emergency dialog, ...).
const cabModeStates=new Map(),cabModeClickSuppression=new WeakMap();
let cabModeHeld=null,cabModeDispatching=false,cabModeContext='';
const CAB_MODE_SELECTOR='.cab-button,.cab-spare,.cab-accessory,.cab-rotary,.cab-screw';
function cabModeStateKey(button){return button.closest('.cab-stage').dataset.cabModeContext+':'+cabControlKey(button);}
function cabModeIsOn(button){return !!cabModeStates.get(cabModeStateKey(button));}
function syncCabModeVisual(button){
 const on=!cabLayoutAllowed()&&cabModeIsOn(button);
 button.classList.toggle('cab-mode-on',on);
 if(button.matches('.cab-button,.cab-spare'))button.classList.toggle('is-down',on);
 if(button.matches('.cab-accessory'))button.classList.toggle('is-on',on);
 if(button.matches('.cab-rotary'))button.style.setProperty('--rotary-angle',on?'90deg':'0deg');
}
function applyCabControlModes(stage,panel,layout){
 const context=(vehicleBundlePreview?'preview:'+vehicleBundlePreview.id+':'+(vehiclePreviewVehicleId||'type'):'trip:'+state.active?.id)+':'+cabLayoutStorageKey(panel,cabLayoutScope(panel));
 if(cabModeContext!==context){cabModeStates.clear();cabModeContext=context;}
 stage.dataset.cabModeContext=context;
 stage.querySelectorAll(CAB_MODE_SELECTOR).forEach(button=>{
  const mode=layout['actuation-'+cabControlKey(button)]?.mode||'';
  if(mode){button.dataset.cabMode=mode;syncCabModeVisual(button);}
  else {delete button.dataset.cabMode;button.classList.remove('cab-mode-on');}
 });
}
function cabModeSet(button,on){cabModeStates.set(cabModeStateKey(button),on);syncCabModeVisual(button);}
function releaseCabMode(cancelled=false){
 if(!cabModeHeld)return;const button=cabModeHeld;cabModeHeld=null;
 cabModeSet(button,false);
 const key=cabControlKey(button),bundle=vehicleBundlePreview||getVehicleBundle();
 if(key.startsWith('reserve-')){
  const states=vehicleBundlePreview?vehiclePreviewAccessoryStates:cabAccessoryStates;
  states.set(bundle.id+':'+key.slice(8),false);
  if(!cancelled&&cabReservePositions(bundle.cab,key)>1)activateCabReserve(key,button.closest('.cab-stage'),0);
 }else if(key.startsWith('rotary-')){
  (vehicleBundlePreview?vehiclePreviewRotaryTurns:cabRotaryTurns)[Number(key.slice(7))]=0;
  if(!cancelled)activateCabReserve(key,button.closest('.cab-stage'),0);
 }
 if(!button.matches('.cab-button,.cab-spare,.cab-accessory-button')){
  const gate=cabHoldSoundGate;cabHoldSoundGate=null;
  const sound=playCabActuation(button,'release','up');
  if(gate)void Promise.resolve(sound).then(completed=>gate.resolve(!cancelled&&completed!==false),()=>gate.resolve(false));
 }
 cabModeClickSuppression.set(button,performance.now()+700);
}
function holdCabMode(button){
 if(cabLayoutAllowed()||button.disabled||button.dataset.cabMode!=='momentary')return;
 releaseCabMode(true);cabModeHeld=button;cabModeSet(button,true);
 if(button.matches('.cab-accessory-lever,.cab-rotary'))beginCabFollowSound();
 if(button.matches('.cab-accessory,.cab-rotary')){
  cabModeDispatching=true;try{button.click();}finally{cabModeDispatching=false;}
  syncCabModeVisual(button);
 }
}
document.addEventListener('pointerdown',event=>{
 const button=event.target.closest(CAB_MODE_SELECTOR);if(event.button===0&&button)holdCabMode(button);
},true);
document.addEventListener('pointerup',()=>releaseCabMode(),true);
document.addEventListener('pointercancel',()=>releaseCabMode(true),true);
document.addEventListener('keydown',event=>{
 const button=event.target.closest(CAB_MODE_SELECTOR);
 if(button&&!event.repeat&&['Enter',' '].includes(event.key)&&button.dataset.cabMode==='momentary'){
  holdCabMode(button);if(button.matches('.cab-accessory,.cab-rotary'))event.preventDefault();
 }
},true);
document.addEventListener('keyup',event=>{if(['Enter',' '].includes(event.key))releaseCabMode();},true);
document.addEventListener('click',event=>{
 const button=event.target.closest(CAB_MODE_SELECTOR);
 if(!button||!button.dataset.cabMode||cabLayoutAllowed()||cabModeDispatching||button.disabled)return;
 if(event.detail>0&&(cabModeClickSuppression.get(button)||0)>performance.now()&&button.matches('.cab-accessory,.cab-rotary')){
  event.preventDefault();event.stopImmediatePropagation();return;
 }
 if(button.dataset.cabMode==='latching')cabModeSet(button,!cabModeIsOn(button));
 else if(!cabModeHeld)cabModeSet(button,true);
 // The normal click still invokes the existing function and its safety guards.
 queueMicrotask(()=>{
  if(button.dataset.cabMode==='momentary'&&!cabModeHeld){
   cabModeHeld=button;releaseCabMode();
  }else syncCabModeVisual(button);
 });
},true);
window.addEventListener('blur',()=>releaseCabMode(true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseCabMode(true);});
