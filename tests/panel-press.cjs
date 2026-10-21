'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,'../app/src/main/assets'),output=path.resolve(__dirname,'../build/qa-panel-press');
(async()=>{
 const b=await session(root,output);
 const shot=async name=>{const {data}=await b.cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,name),Buffer.from(data,'base64'));return data;};
 try{
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});await b.navigate();await b.evaluate('showView("vehicles")');
  for(const type of ['tramlink','mgt6de','kt4d','kt4dc','g4-65','t57e','gotha-standard']){
   await b.evaluate(`openVehicleBundlePreview(${JSON.stringify(type)});Promise.all([...document.querySelectorAll('.vehicle-bundle-modal img')].map(image=>image.decode()))`);
   const before=await b.evaluate(`(()=>{const base=document.querySelector('.cab-emergency-base'),face=document.querySelector('#emergencyBtn .cab-face');return {base:base.getBoundingClientRect().toJSON(),face:face.getBoundingClientRect().toJSON(),opacity:getComputedStyle(base).opacity,yellow:vehicleBundlePreview.cab.buttons.emergency.kind!=='push'}})()`);
   assert(Math.abs(before.base.width-before.base.height)<.1,type+' circular base');assert.equal(before.opacity,'1');
   const released=await shot(type+'-emergency-raised.png');
   await b.evaluate('document.getElementById("emergencyBtn").classList.add("is-down")');await b.delay(180);
   const pressed=await shot(type+'-emergency.png');
   const geometry=await b.evaluate(`(()=>{const base=document.querySelector('.cab-emergency-base'),face=document.querySelector('#emergencyBtn .cab-face');return {base:base.getBoundingClientRect().toJSON(),face:face.getBoundingClientRect().toJSON(),opacity:getComputedStyle(base).opacity}})()`);
   assert.deepEqual(geometry.base,before.base,type+' stationary base');assert.equal(geometry.opacity,'1');
   const yellow=await b.evaluate(`(async()=>{
    const decode=async data=>{const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,image.width,image.height);};
    const image=await decode('${pressed}'),pixels=image.data,old=await decode('${released}'),raised=${JSON.stringify(before.face)},{base,face}=${JSON.stringify(geometry)};
    let exposed=0,yellow=0,unchanged=0,ring=0;for(let y=Math.ceil(base.y-base.height*.2);y<base.y+base.height*1.2;y++)for(let x=Math.ceil(base.x-base.width*.2);x<base.x+base.width*1.2;x++){
     const inside=((x-base.x-base.width/2)/(base.width/2))**2+((y-base.y-base.height/2)/(base.height/2))**2;
     const head=((x-face.x-face.width/2)/(face.width/2))**2+((y-face.y-face.height/2)/(face.height/2))**2;
     const previous=((x-raised.x-raised.width/2)/(raised.width/2))**2+((y-raised.y-raised.height/2)/(raised.height/2))**2;
     const i=(y*image.width+x)*4;
     if(inside<.97**2&&head>1.04**2){exposed++;if(pixels[i]>140&&pixels[i+1]>110&&pixels[i+2]<110)yellow++;}
     if(inside<1.35**2&&head>1.12**2&&previous>1.12**2){ring++;if([0,1,2].every(c=>Math.abs(pixels[i+c]-old.data[i+c])<=5))unchanged++;}
    }return {exposed,yellow,ring,unchanged};
   })()`);
   assert(yellow.exposed>30,type+' exposed socket');
   assert(before.yellow?yellow.yellow/yellow.exposed>.94:yellow.yellow===0,type+' original socket color: '+JSON.stringify(yellow));
   assert(yellow.ring>10&&yellow.unchanged/yellow.ring>.99,type+' ring color and silhouette stay fixed: '+JSON.stringify(yellow));
   await b.evaluate('document.getElementById("emergencyBtn").classList.remove("is-down")');await b.delay(180);
   const caps=await b.evaluate(`([...document.querySelectorAll('.cab-button:not(.cab-emergency) .cab-face')].map(face=>face.getBoundingClientRect().toJSON()))`);
   const raised=await shot(type+'-raised.png');
   await b.evaluate(`document.querySelectorAll('.cab-button:not(.cab-emergency)').forEach(button=>button.classList.add('is-down'))`);await b.delay(180);
   const down=await shot(type+'-buttons.png');
   const pixels=await b.evaluate(`(async()=>{
    const decode=async data=>{const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,image.width,image.height);};
    const a=await decode('${raised}'),b=await decode('${down}');return ${JSON.stringify(caps)}.map(rect=>{
     let cap=0,changed=0,rim=0,moved=0;for(let y=Math.floor(rect.y-rect.height*.15);y<rect.y+rect.height*1.15;y++)for(let x=Math.floor(rect.x-rect.width*.15);x<rect.x+rect.width*1.15;x++){
      const nx=Math.abs((x-rect.x-rect.width/2)/(rect.width/2)),ny=Math.abs((y-rect.y-rect.height/2)/(rect.height/2)),i=(y*a.width+x)*4;
      const difference=Math.max(...[0,1,2].map(c=>Math.abs(a.data[i+c]-b.data[i+c])))>8;
      if(nx<.95&&ny<.95){cap++;if(difference)changed++;}
      if((nx>1.12||ny>1.12)&&nx<1.25&&ny<1.25){rim++;if(difference)moved++;}
     }return {cap,changed,rim,moved};
    });
   })()`);
   for(const result of pixels){assert(result.changed/result.cap>.03,type+' complete cap responds');assert(result.moved/result.rim<.01,type+' mounting rim stays fixed: '+JSON.stringify(result));}
   await b.evaluate('closeModal()');
  }
  assert.equal(b.errors.length,0);console.log('Panel press pixel checks: seven fixed circular bases, original socket colors and stationary mounting rims passed.');
 }finally{await b.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
