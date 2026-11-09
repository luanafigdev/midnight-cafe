let context;
let musicTimer;
let step=0;
const getContext=()=>{context ||= new (window.AudioContext||window.webkitAudioContext)();return context;};
function note(frequency, start, duration=.22, volume=.045, wave='sine') {
 const ctx=getContext(),osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type=wave;osc.frequency.value=frequency;
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.exponentialRampToValueAtTime(volume,start+.018);
 gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.02);
}
export function playTone(kind='tap', enabled=true){
 if(!enabled)return;
 try{
   const ctx=getContext();if(ctx.state==='suspended')ctx.resume();
   const now=ctx.currentTime;
   const notes={tap:[530],serve:[523,659,784],achievement:[587,740,880,1175],bad:[210,176],bell:[392,523,659],pet:[440,587],pour:[325,410]};
   (notes[kind]||notes.tap).forEach((frequency,i)=>note(frequency,now+i*.095,.24,.054,kind==='bad'?'triangle':'sine'));
 }catch { }
}
export function syncMusic(enabled){
 if(!enabled){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}return;}
 if(musicTimer)return;
 try { const ctx=getContext(); if(ctx.state==='suspended')ctx.resume(); } catch { return; }
 const melody=[329.63,392,440,392,329.63,293.66,261.63,293.66,329.63,440,493.88,440,392,329.63,293.66,261.63];
 musicTimer=setInterval(()=>{
  try{
   const ctx=getContext();if(ctx.state==='suspended')return;
   const now=ctx.currentTime;
   note(melody[step%melody.length],now,.75,.019,'sine');
   if(step%4===0)note([130.81,174.61,196,146.83][Math.floor(step/4)%4],now,2.4,.012,'triangle');
   step++;
  }catch {}
 },580);
}
