'use strict';
// Source recordings are downloaded to build/audio-sources; see AUDIO_SOURCES.md.
// Encodes local MP3 assets for Android MediaPlayer and Web Audio; WAV exists only in memory.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const session=require('../tools/browser-session.cjs');
const root=path.resolve(__dirname,'..'),rate=22050;
function wav(samples){const b=Buffer.alloc(44+samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);samples.forEach((s,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,s))*32767),44+i*2));return b;}
const blank=duration=>new Float32Array(Math.ceil(duration*rate));
function mix(target,source,at=0,gain=1){const start=Math.round(at*rate);for(let i=0;i<source.length&&i+start<target.length;i++)target[start+i]+=source[i]*gain;}
function tone(target,hz,at,duration,gain=.25){for(let i=0;i<duration*rate&&i+Math.round(at*rate)<target.length;i++){const t=i/rate,env=Math.min(1,t/.015,(duration-t)/.06);target[i+Math.round(at*rate)]+=gain*Math.max(0,env)*(Math.sin(t*hz*2*Math.PI)+.2*Math.sin(t*hz*4*Math.PI));}}
function trim(samples,from,to,gain=1){const result=Float32Array.from(samples.slice(Math.round(from*rate),Math.round(to*rate)),s=>s*gain);for(let i=0;i<Math.min(500,result.length);i++){result[i]*=i/500;result[result.length-1-i]*=i/500;}return result;}
async function main(){
 const b=await session(root,path.join(root,'build/qa-sound-generation'));
 try{
  await b.navigate(b.origin+'/__blank');
  async function decode(file){return b.evaluate(`fetch(${JSON.stringify('/'+file)}).then(r=>r.arrayBuffer()).then(a=>new OfflineAudioContext(1,1,${rate}).decodeAudioData(a)).then(b=>Array.from(b.getChannelData(0)))`);}
  const doors=await decode('build/audio-sources/tram-doors.ogg'),traffic=await decode('build/audio-sources/traffic.ogg'),horn=await decode('build/audio-sources/car-horn.wav'),xp=await decode('build/audio-sources/xp-shutdown.wav'),gong=await decode('app/src/main/assets/audio/chimes/ding_dong.mp3');
  const sounds={};sounds.door_open=trim(doors,.15,3.1,.85);
  sounds.door_close=blank(5);for(let i=0;i<3;i++)tone(sounds.door_close,1568,i*.25,.13,.16);mix(sounds.door_close,trim(doors,10,13.9),.9,.85);
  sounds.emergency=blank(2.2);for(let i=0;i<6;i++)tone(sounds.emergency,i%2?660:880,i*.32,.26,.22);
  sounds.traffic=blank(6.5);mix(sounds.traffic,trim(traffic,2,8.5),0,.55);mix(sounds.traffic,trim(horn,0,3.5),.25,.32);mix(sounds.traffic,trim(horn,0,2.3),3.8,.25);
  sounds.passenger=Float32Array.from(gong,s=>s*.20);let previous=0;for(let i=0;i<sounds.passenger.length;i++){previous+=.32*(sounds.passenger[i]-previous);sounds.passenger[i]=previous;}
  sounds.finish=Float32Array.from(xp,s=>s*.75);
  // Nine opening attacks of Silvestri's Main Theme, transcribed from the official
  // education score, p. 13 (PDF p. 15). The tied E4 is one sustained note.
  // F4 Bb3 E4 F4 G4 | F4 D4 Bb3 E4; half-notes followed by the characteristic triplets.
  const melody=[[65,2],[58,2],[64,8/3],[65,2/3],[67,2/3],[65,2/3],[62,2/3],[58,2/3],[64,1.5]];
  const beat=60/176;let onset=.04;
  sounds.back=blank(melody.reduce((sum,[,beats])=>sum+beats*beat,0)+.3);
  for(const [midi,beats]of melody){
   const duration=beats*beat,freq=440*2**((midi-69)/12);
   for(let i=0;i<(duration+.08)*rate;i++){
    const t=i/rate,index=Math.round(onset*rate)+i;if(index>=sounds.back.length)break;
    const env=Math.min(1,t/.022)*Math.min(1,Math.max(0,(duration+.08-t)/.10))*(.85+.15*Math.exp(-t*7));
    let sample=0;for(let harmonic=1;harmonic<=6;harmonic++)sample+=Math.sin(2*Math.PI*freq*harmonic*t)/harmonic**1.35;
    sounds.back[index]+=sample*env*.14;
   }
   onset+=duration;
  }
  const dir=path.join(root,'app/src/main/assets/audio/effects');fs.mkdirSync(dir,{recursive:true});
  const suppliedBack=process.env.DRIVER_BACK_SOUND||path.join(root,'build/audio-sources/back-provided.mp3');
  let ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
  const bundled=path.join(root,'build/qa-deps/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');if(!process.env.FFMPEG_PATH&&fs.existsSync(bundled))ffmpeg=bundled;
  const catalog=[];for(const [id,data]of Object.entries(sounds)){
   const target=path.join(dir,id+'.mp3');
   if(id==='back'&&fs.existsSync(suppliedBack)){
    const bytes=fs.readFileSync(suppliedBack),decoded=spawnSync(ffmpeg,['-v','error','-i',suppliedBack,'-f','f32le','-ar','22050','-ac','1','pipe:1'],{windowsHide:true,maxBuffer:10*1024*1024});
    if(decoded.error||decoded.status!==0)throw Error('Invalid supplied Back MP3');
    fs.writeFileSync(target,bytes);catalog.push({id,file:'audio/effects/back.mp3',duration:decoded.stdout.length/4/22050,sourceType:'provided-recording',title:'Back To The Future Chimes Jingle sound - single',sha256:crypto.createHash('sha256').update(bytes).digest('hex')});continue;
   }
   const encoded=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-f','wav','-i','pipe:0','-ac','1','-ar','44100','-c:a','libmp3lame','-b:a','96k','-map_metadata','-1','-y',target],{input:wav(data),windowsHide:true});
   if(encoded.error||encoded.status!==0)throw Error(encoded.error?.message||encoded.stderr.toString());
   const bytes=fs.readFileSync(target);catalog.push({id,file:'audio/effects/'+id+'.mp3',duration:data.length/rate,...(id==='back'?{noteCount:melody.length,midiNotes:melody.map(([note])=>note),tempo:176}:{}),sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  fs.writeFileSync(path.join(dir,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');console.log(catalog.map(c=>c.id+': '+c.duration.toFixed(2)+'s').join('\n'));
 }finally{await b.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
