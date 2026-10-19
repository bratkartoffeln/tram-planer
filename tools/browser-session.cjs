'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
module.exports=async function browserSession(root,output){
 fs.mkdirSync(output,{recursive:true});
 const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]);if(relative==='/__blank'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><title>Audio processing</title></head><body></body></html>');return;}const file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.wav':'audio/wav','.ogg':'audio/ogg','.mp3':'audio/mpeg','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const port=10000+Math.floor(Math.random()*2000);
 const proc=spawn(process.env.FAHRPLAN_BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--in-process-gpu','--no-sandbox','--no-first-run','--no-default-browser-check','--autoplay-policy=no-user-gesture-required','--remote-debugging-port='+port,'--user-data-dir='+path.join(output,'profile-'+Date.now()),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let socket;let seq=0;const pending=new Map();const errors=[];
 const close=async()=>{if(socket?.readyState===1){try{await Promise.race([cdp('Browser.close'),delay(500)]);}catch{}socket.close();}proc.kill();server.closeAllConnections();server.close();};
 function cdp(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method));},20000);pending.set(id,{resolve:v=>{clearTimeout(timeout);resolve(v);},reject:e=>{clearTimeout(timeout);reject(e);}});socket.send(JSON.stringify({id,method,params}));});}
 try{
  let tabs;for(let i=0;i<40;i++){try{tabs=await(await fetch('http://127.0.0.1:'+port+'/json',{signal:AbortSignal.timeout(500)})).json();break;}catch{await delay(100);}}
  if(!tabs)throw Error('Browser did not start');socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  socket.onmessage=e=>{const r=JSON.parse(e.data);if(r.id){const p=pending.get(r.id);pending.delete(r.id);r.error?p?.reject(r.error):p?.resolve(r.result);}else if(r.method==='Runtime.exceptionThrown')errors.push(r.params);};
  await cdp('Page.enable');await cdp('Runtime.enable');
  const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const origin='http://127.0.0.1:'+server.address().port;
  const navigate=async(url=origin)=>{await cdp('Page.navigate',{url});for(let i=0;i<100;i++){if(await evaluate('document.readyState==="complete"'))return;await delay(50);}throw Error('Page load timed out');};
  return {cdp,evaluate,navigate,origin,debuggingUrl:'http://127.0.0.1:'+port,close,errors,delay,screenshot:async name=>{const r=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name),Buffer.from(r.data,'base64'));}};
 }catch(e){await close();throw e;}
};
