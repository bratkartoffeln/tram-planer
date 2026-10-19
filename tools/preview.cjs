'use strict';
// Local-only PWA preview: node tools/preview.cjs [port]
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../web-pwa');
const port=Number(process.argv[2]||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.mp3':'audio/mpeg','.jpg':'image/jpeg','.png':'image/png','.ogg':'audio/ogg'};
const server=http.createServer((req,res)=>{
 try{
  const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(relative==='/favicon.ico'){res.writeHead(204).end();return;}
  const file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end('Not found');return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');res.end(data);});
 }catch{res.writeHead(400).end('Invalid request');}
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log('Browsertest: http://127.0.0.1:'+port));
