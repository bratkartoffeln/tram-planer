'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),path.resolve(__dirname,'../build/qa-updates'));
 try{
  await b.navigate();
  await b.evaluate(`window.updateCalls=[];window.AndroidUpdates={check:id=>updateCalls.push(id),openDownload:url=>updateCalls.push(url)};window.releaseFixture={tag_name:'v6.2.8',draft:false,prerelease:false,assets:[{name:'FahrplanManager_v6.2.8_release.apk',state:'uploaded',browser_download_url:'https://github.com/bratkartoffeln/tram-planer/releases/download/v6.2.8/FahrplanManager_v6.2.8_release.apk'}]};state.settings.auto_updates=false;showView('settings');`);
  assert.deepEqual(await b.evaluate('[isNewerAppVersion("6.2.8"),isNewerAppVersion("6.10.0"),isNewerAppVersion("6.2.7"),isNewerAppVersion("6.2.6"),isNewerAppVersion("7.0.0-beta"),isNewerAppVersion("garbage")]'),[true,true,false,false,false,false]);
  assert.deepEqual(await b.evaluate(`['http://github.com/bratkartoffeln/tram-planer/releases/download/v6.2.8/a.apk','https://evil.example/a.apk','https://github.com/other/repo/releases/download/v1/a.apk','https://github.com@evil.example/bratkartoffeln/tram-planer/releases/download/v1/a.apk'].map(releaseDownloadUrl)`),[null,null,null,null]);
  assert.equal(await b.evaluate('selectAppRelease({...releaseFixture,prerelease:true})'),null);
  assert.equal(await b.evaluate('selectAppRelease({...releaseFixture,tag_name:"6.2.6"})'),null);
  assert.equal(await b.evaluate('selectAppRelease({...releaseFixture,assets:[{...releaseFixture.assets[0],name:"app-debug.apk"}]}).download'),null);
  await b.evaluate('checkForAppUpdate()');assert.equal(await b.evaluate('updateCalls.length'),0);
  await b.evaluate('checkForAppUpdate(true);checkForAppUpdate(true)');assert.equal(await b.evaluate('updateCalls.length'),1);
  await b.evaluate('onNativeAppUpdate(updateCalls[0]+1,releaseFixture,null)');assert.equal(await b.evaluate('appUpdate.status'),'checking');
  await b.evaluate('onNativeAppUpdate(updateCalls[0],releaseFixture,null)');assert.equal(await b.evaluate('appUpdate.status'),'available');
  assert.equal(await b.evaluate('document.getElementById("appUpdateNotice").hidden'),false);
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert.equal(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);await b.screenshot('settings-update-mobile.png');
  await b.evaluate('downloadAppUpdate()');assert.equal(await b.evaluate('updateCalls.at(-1)'),await b.evaluate('releaseFixture.assets[0].browser_download_url'));
  await b.evaluate('state.settings.auto_updates=true;checkForAppUpdate()');assert.equal(await b.evaluate('updateCalls.length'),2);
  // Cached notification survives an app restart even when the daily check is throttled.
  await b.evaluate('appUpdate={status:"idle",release:null,message:"",checkedAt:0};checkForAppUpdate()');assert.equal(await b.evaluate('appUpdate.release.version'),'6.2.8');
  await b.evaluate('checkForAppUpdate(true);onNativeAppUpdate(updateCalls.at(-1),null,"Offline");');assert.equal(await b.evaluate('appUpdate.status'),'error');assert.equal(await b.evaluate('appUpdate.release.version'),'6.2.8');
  await b.evaluate('checkForAppUpdate(true);onNativeAppUpdate(updateCalls.at(-1),{tag_name:"6.2.7",assets:[]},null)');assert.equal(await b.evaluate('appUpdate.status'),'current');assert.equal(await b.evaluate('document.getElementById("appUpdateNotice").hidden'),true);
  assert.equal(b.errors.length,0);console.log('Update checks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
