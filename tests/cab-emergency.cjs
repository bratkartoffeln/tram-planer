'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const session=require('../tools/browser-session.cjs');
const {chromium}=require(path.resolve(__dirname,'../build/qa-deps/node_modules/playwright'));
const output=path.resolve(__dirname,'../build/qa-cab-emergency');
(async()=>{
 const b=await session(path.resolve(__dirname,'../app/src/main/assets'),output);
 try{
  const browser=await chromium.connectOverCDP(b.debuggingUrl),page=browser.contexts()[0].pages()[0];await page.setViewportSize({width:1680,height:1100});await page.goto(b.origin);
  await b.evaluate(`(()=>{const plan={id:'plan-emergency',line:'3',tram:'801',routeId:'EF3H',stops:allRouteStops('EF3H')};state.active={id:'emergency-trip',plan,position:1,status:'running',doorsOpen:false,startedAtEpoch:Date.now(),positionReachedAt:Date.now()};window.AndroidDisplay={setImmersive:()=>{}};window.AndroidAnnouncements={playSequence:()=>{},playEffect:(id,ticket)=>queueMicrotask(()=>onNativeDriverSoundEnd(ticket,true)),stop:()=>{}};showView('driver');setCabFullscreen(true)})()`);
  const button=page.locator('#emergencyBtn'),face=button.locator('.cab-face'),base=button.locator('.cab-emergency-base');
  await page.waitForTimeout(400);
  const faceBefore=await face.boundingBox(),buttonBefore=await button.boundingBox(),baseBefore=await base.boundingBox();
  const clip={x:Math.floor(buttonBefore.x-45),y:Math.floor(buttonBefore.y-30),width:Math.ceil(buttonBefore.width+80),height:Math.ceil(buttonBefore.height+65)};
  const shot=file=>page.screenshot({path:path.join(output,file),clip});
  const raised=await shot('raised.png');
  await page.mouse.move(buttonBefore.x+buttonBefore.width/2,buttonBefore.y+buttonBefore.height/2);await page.mouse.down();await page.waitForTimeout(180);
  const pressed=await shot('pressed.png');
  const faceDown=await face.boundingBox();assert(faceDown.x<faceBefore.x);assert(faceDown.y>faceBefore.y);assert(faceDown.width<faceBefore.width);
  assert.deepEqual(await button.boundingBox(),buttonBefore);assert.deepEqual(await base.boundingBox(),baseBefore);assert.equal(await base.evaluate(e=>getComputedStyle(e).opacity),'1');
  // Comparing bounds alone misses a replacement ring with a different shape.
  // Original yellow pixels outside the moving cap must keep their appearance.
  const ringPixels=await page.evaluate(async({raised,pressed,clip,face})=>{
   const decode=async data=>{const img=new Image();img.src='data:image/png;base64,'+data;await img.decode();const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,img.width,img.height);};
   const a=await decode(raised),b=await decode(pressed);let total=0,changed=0;
   for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){
    if(x+clip.x>=face.x-2&&x+clip.x<=face.x+face.width+2&&y+clip.y>=face.y-2&&y+clip.y<=face.y+face.height+2)continue;
    const i=(y*a.width+x)*4;
    if(a.data[i]>150&&a.data[i+1]>120&&a.data[i+2]<90){total++;if(!(b.data[i]>150&&b.data[i+1]>120&&b.data[i+2]<90))changed++;}
   }
   return {total,changed};
  },{raised:raised.toString('base64'),pressed:pressed.toString('base64'),clip,face:faceDown});
  assert(ringPixels.total>100);assert(ringPixels.changed/ringPixels.total<.05,'photographed yellow ring must retain its shape and position: '+JSON.stringify(ringPixels));
  await shot('pressed.png');await page.mouse.up();assert(await page.getByRole('dialog').isVisible());assert.equal(await button.getAttribute('aria-pressed'),'true');
  await b.evaluate('closeModal()');await page.waitForTimeout(180);assert.equal(await button.getAttribute('aria-pressed'),'false');
  assert(Math.abs((await face.boundingBox()).x-faceBefore.x)<.1);assert.equal(await base.evaluate(e=>getComputedStyle(e).opacity),'0');
  // Keyboard activation and reduced motion retain the same pressed geometry.
  await page.emulateMedia({reducedMotion:'reduce'});await button.focus();await page.keyboard.down(' ');assert.equal(await button.evaluate(e=>e.classList.contains('is-down')),true);
  assert.equal(await face.evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert((await face.boundingBox()).x<faceBefore.x);
  await page.keyboard.up(' ');await b.evaluate('closeModal()');assert.equal(b.errors.length,0);console.log('Emergency button perspective checks passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
