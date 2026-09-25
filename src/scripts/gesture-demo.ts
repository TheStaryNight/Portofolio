import {FilesetResolver,HandLandmarker,DrawingUtils} from '@mediapipe/tasks-vision';
type Tree={left:number[];right:number[];feature:number[];threshold:number[];value:number[][]};
type Forest={classes:number[];trees:Tree[]};
const video=document.querySelector<HTMLVideoElement>('#camera')!,canvas=document.querySelector<HTMLCanvasElement>('#landmarks')!;
const start=document.querySelector<HTMLButtonElement>('#start')!,stop=document.querySelector<HTMLButtonElement>('#stop')!,sampleRun=document.querySelector<HTMLButtonElement>('#sample-run')!;
const status=document.querySelector<HTMLElement>('#status')!,result=document.querySelector<HTMLElement>('#result')!,cursor=document.querySelector<HTMLElement>('#cursor')!;
const playground=document.querySelector<HTMLElement>('#playground')!,target=document.querySelector<HTMLButtonElement>('#target')!,sampleImage=document.querySelector<HTMLImageElement>('#sample-image')!;
let detector:HandLandmarker|undefined,forest:Forest,stream:MediaStream|undefined,frame=0,lastTime=-1,lastClass=-1,hits=0,lastTick=0;
const mirrored=document.createElement('canvas');
let history:number[]=[];const labels=['Move','Click','Alternate click','Scroll'];
async function load(mode:'IMAGE'|'VIDEO'){
 if(!detector){status.textContent='Loading hand tracking and your trained classifier…';
  const files=await FilesetResolver.forVisionTasks('/demos/vision');
  detector=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'/demos/models/hand_landmarker.task'},numHands:1,runningMode:mode});
  const r=await fetch('/demos/models/gesture.json');if(!r.ok)throw Error('Classifier unavailable');forest=await r.json();
 }else await detector.setOptions({runningMode:mode});
}
function classify(hand:{x:number;y:number}[]){
 const rel=hand.map(p=>[p.x-hand[0].x,p.y-hand[0].y]);const scale=Math.max(1e-5,...rel.map(p=>Math.hypot(...p)));
 return predictFeatures(rel.flatMap(p=>p.map(v=>Math.fround(v/scale))));
}
function predictFeatures(x:number[]){
 const sums=forest.classes.map(()=>0);
 for(const t of forest.trees){let i=0;while(t.left[i]!==-1)i=x[t.feature[i]]<=t.threshold[i]?t.left[i]:t.right[i];t.value[i].forEach((v,c)=>sums[c]+=v);}
 return forest.classes[sums.indexOf(Math.max(...sums))];
}
function hit(){hits++;document.querySelector('#hits')!.textContent=`Targets hit: ${hits}`;target.style.left=`${15+Math.random()*55}%`;target.style.top=`${playground.scrollTop+35+Math.random()*150}px`;}
target.addEventListener('click',hit);
function release(){cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());stream=undefined;video.srcObject=null;stop.disabled=true;start.disabled=false;sampleRun.disabled=false;cursor.hidden=true;canvas.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height);history=[];lastClass=-1;lastTime=-1;}
stop.addEventListener('click',()=>{release();status.textContent='Camera stopped.';result.textContent='Waiting for a hand';});
function tick(now:number){
 if(!stream||!detector)return;
 try{
 if(video.readyState>=2&&video.currentTime!==lastTime&&now-lastTick>65){
  lastTick=now;lastTime=video.currentTime;canvas.width=video.videoWidth;canvas.height=video.videoHeight;
  mirrored.width=video.videoWidth;mirrored.height=video.videoHeight;const mirrorContext=mirrored.getContext('2d')!;mirrorContext.translate(mirrored.width,0);mirrorContext.scale(-1,1);mirrorContext.drawImage(video,0,0);
  const detected=detector.detectForVideo(mirrored,now);const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,canvas.width,canvas.height);
  const hand=detected.landmarks[0];
  if(hand){const draw=new DrawingUtils(ctx);draw.drawConnectors(hand,HandLandmarker.HAND_CONNECTIONS,{color:'#b4e6c4',lineWidth:3});draw.drawLandmarks(hand,{color:'#ffffff',radius:3});
   history.push(classify(hand));if(history.length>5)history.shift();const counts=[0,0,0,0];history.forEach(v=>counts[v]++);const prediction=counts.indexOf(Math.max(...counts));
   result.textContent=labels[prediction];const x=hand[8].x*playground.clientWidth,y=hand[8].y*playground.clientHeight;
   cursor.hidden=false;cursor.style.left=`${x}px`;cursor.style.top=`${y+playground.scrollTop}px`;
   const t=target.getBoundingClientRect(),p=playground.getBoundingClientRect();
   if((prediction===1||prediction===2)&&lastClass!==prediction&&x>=t.left-p.left&&x<=t.right-p.left&&y>=t.top-p.top&&y<=t.bottom-p.top)hit();
   if(prediction===3)playground.scrollTop+=(hand[8].y-.5)*18;
   lastClass=prediction;
  }else{cursor.hidden=true;result.textContent='No hand detected';history=[];lastClass=-1;}
 }
 frame=requestAnimationFrame(tick);
 }catch{release();status.textContent='Tracking stopped unexpectedly. Try starting again.';}
}
start.addEventListener('click',async()=>{start.disabled=true;sampleRun.disabled=true;
 try{if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera needs HTTPS or localhost.');await load('VIDEO');stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480},audio:false});video.srcObject=stream;await video.play();sampleImage.hidden=true;stop.disabled=false;status.textContent='Camera on. Hold your hand in view.';frame=requestAnimationFrame(tick);}
 catch(e){release();status.textContent='Camera could not start. '+(e instanceof Error?e.message:'')+' You can try a sample instead.';}
});
sampleRun.addEventListener('click',async()=>{release();start.disabled=true;sampleRun.disabled=true;
 try{status.textContent='Loading a recorded landmark sample…';
 const r=await fetch('/demos/models/gesture.json');if(!r.ok)throw Error();forest=await r.json();
 const samples=await (await fetch('/demos/models/gesture-samples.json')).json();const id=(document.querySelector('#sample') as HTMLSelectElement).value;
 sampleImage.src=`/images/gesture-${id}.png`;await sampleImage.decode();sampleImage.hidden=false;
 result.textContent=labels[predictFeatures(samples[id])];status.textContent='Classified recorded training landmarks. Photo illustrates the pose; this is not a new image evaluation. Camera remains off.';}

 catch(e){status.textContent='Could not analyze sample. Check your connection and retry.';}
 finally{start.disabled=false;sampleRun.disabled=false;}
});
addEventListener('pagehide',release);document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream){release();status.textContent='Camera stopped because the page was hidden.';}});
