'use strict';

const UPDATE_REPOSITORY='bratkartoffeln/tram-planer';
let appUpdate={status:'idle',release:null,message:'Noch nicht geprüft.',checkedAt:0};
let updateRequest=0,updateTimer=null;
const androidUpdatesAvailable=()=>typeof window.AndroidUpdates?.check==='function';

function parseAppVersion(value){
 const match=/^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(value));
 return match?match.slice(1).map(Number):null;
}
function isNewerAppVersion(candidate,current=APP_VERSION){
 const next=parseAppVersion(candidate),installed=parseAppVersion(current);
 if(!next||!installed)return false;
 for(let i=0;i<3;i++){if(next[i]!==installed[i])return next[i]>installed[i];}
 return false;
}
function releaseDownloadUrl(value){
 try{
  const url=new URL(value);
  return url.protocol==='https:'&&url.hostname==='github.com'&&!url.username&&!url.password&&!url.port
   &&url.pathname.startsWith('/'+UPDATE_REPOSITORY+'/releases/download/')&&url.pathname.endsWith('.apk')
   &&/^[a-zA-Z0-9/_.-]+$/.test(url.pathname)&&!url.search&&!url.hash?url.href:null;
 }catch{return null;}
}
function selectAppRelease(data){
 if(!data||data.draft||data.prerelease||!isNewerAppVersion(data.tag_name))return null;
 const version=String(data.tag_name).replace(/^v/,'');
 // Only the signed release naming convention; never install a debug/parallel APK.
 const asset=(Array.isArray(data.assets)?data.assets:[]).find(item=>
  (item.name===`FahrplanManager_v${version}_release.apk`||item.name===`FahrplanManager_Tablet_v${version}.apk`)
  &&item.state==='uploaded'&&releaseDownloadUrl(item.browser_download_url));
 return {version,download:asset?releaseDownloadUrl(asset.browser_download_url):null};
}
function renderUpdateSettings(){
 if(!androidUpdatesAvailable())return '';
 return card(`<h2>App-Updates</h2><p class="muted">Installiert: v${APP_VERSION}. Neue Versionen werden beim Start höchstens einmal täglich über GitHub geprüft. Die Fahrplansimulation funktioniert weiter offline.</p><label class="settings-row"><span>Automatisch nach Updates suchen</span><input type="checkbox" ${state.settings.auto_updates!==false?'checked':''} onchange="state.settings.auto_updates=this.checked;saveState();if(this.checked)checkForAppUpdate()"></label><div id="appUpdateStatus" role="status">${updateStatusContent()}</div><p class="muted">Der Download öffnet sich im Systembrowser. Danach die APK öffnen und das Update in Android bestätigen. Gegebenenfalls muss dort die Installation aus dieser Quelle erlaubt werden.</p>`);
}
function updateStatusContent(){
 const release=appUpdate.release;
 return `<p>${esc(appUpdate.message)}</p>${appUpdate.checkedAt?`<p class="muted">Letzte Prüfung: ${esc(new Date(appUpdate.checkedAt).toLocaleString('de-DE'))}</p>`:''}<div class="actions"><button onclick="checkForAppUpdate(true)" ${appUpdate.status==='checking'?'disabled':''}>${appUpdate.status==='checking'?'Wird geprüft …':'Jetzt nach Updates suchen'}</button>${release?.download?'<button class="primary" onclick="downloadAppUpdate()">Update herunterladen</button>':''}</div>`;
}
function refreshUpdateNotice(){
 const status=document.getElementById('appUpdateStatus');if(status)status.innerHTML=updateStatusContent();
 let notice=document.getElementById('appUpdateNotice');
 if(!notice){notice=document.createElement('aside');notice.id='appUpdateNotice';notice.className='notice';notice.setAttribute('role','status');document.querySelector('.main').prepend(notice);}
 notice.hidden=!appUpdate.release;
 if(appUpdate.release)notice.innerHTML=`<strong>Neue Version ${esc(appUpdate.release.version)} verfügbar.</strong> <button onclick="showView('settings')">Update ansehen</button>`;
}
function checkForAppUpdate(manual=false){
 if(!androidUpdatesAvailable()||appUpdate.status==='checking')return;
 if(!appUpdate.release){
  try{
   const cached=JSON.parse(localStorage.getItem('fm_update_release')||'null');
   if(cached&&isNewerAppVersion(cached.version)){
    appUpdate={...appUpdate,status:'available',release:{version:cached.version,download:releaseDownloadUrl(cached.download)},message:`Version ${cached.version} ist verfügbar.`,checkedAt:Number(localStorage.getItem('fm_update_checked_at'))||0};
    refreshUpdateNotice();
   }
  }catch{/* An invalid cached notice is replaced by the next successful check. */}
 }
 if(!manual&&(state.settings.auto_updates===false||Date.now()-(Number(localStorage.getItem('fm_update_checked_at'))||0)<86400000))return;
 const request=++updateRequest;
 const checkedAt=Date.now();localStorage.setItem('fm_update_checked_at',String(checkedAt));
 appUpdate={...appUpdate,status:'checking',checkedAt,message:'Suche nach einer neueren Version …'};refreshUpdateNotice();
 updateTimer=setTimeout(()=>onNativeAppUpdate(request,null,'Die Updateprüfung hat zu lange gedauert. Bitte später erneut versuchen.'),20000);
 try{AndroidUpdates.check(request);}catch{onNativeAppUpdate(request,null,'Die Updateprüfung konnte nicht gestartet werden.');}
}
function onNativeAppUpdate(request,data,error){
 if(request!==updateRequest||appUpdate.status!=='checking')return;
 clearTimeout(updateTimer);
 if(error){appUpdate={...appUpdate,status:'error',message:error};}
 else{
  const release=selectAppRelease(data),checkedAt=Date.now();
  localStorage.setItem('fm_update_checked_at',String(checkedAt));
  localStorage.setItem('fm_update_release',JSON.stringify(release));
  appUpdate={status:release?'available':'current',release,checkedAt,message:release?`Version ${release.version} ist verfügbar.${release.download?'':' Eine passende Release-APK wurde noch nicht veröffentlicht.'}`:data?'Du verwendest die aktuelle Version.':'Es wurde noch keine öffentliche Release-Version veröffentlicht.'};
 }
 refreshUpdateNotice();
}
function downloadAppUpdate(){
 const url=releaseDownloadUrl(appUpdate.release?.download);
 if(!url||!androidUpdatesAvailable())return;
 saveState();AndroidUpdates.openDownload(url);
}
