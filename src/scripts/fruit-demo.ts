import * as ort from 'onnxruntime-web/wasm';
ort.env.wasm.wasmPaths='/demos/runtime/';
ort.env.wasm.numThreads=1;
const input=document.querySelector<HTMLInputElement>('#photo')!;
const img=document.querySelector<HTMLImageElement>('#preview')!;
const button=document.querySelector<HTMLButtonElement>('#classify')!;
const status=document.querySelector<HTMLElement>('#status')!;
const result=document.querySelector<HTMLElement>('#result')!;
const scores=document.querySelector<HTMLElement>('#scores')!;
let session:ort.InferenceSession|undefined;let objectURL='';let loaded=false;
input.addEventListener('change',()=>{
 button.disabled=true;loaded=false;scores.replaceChildren();result.textContent='Waiting for a photo';
 if(objectURL)URL.revokeObjectURL(objectURL);img.hidden=true;
 const file=input.files?.[0];if(!file)return;
 if(file.size>10*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type)){status.textContent='Choose a JPEG, PNG, or WebP smaller than 10 MB.';return;}
 img.onload=()=>{loaded=true;img.hidden=false;button.disabled=false;status.textContent='Photo ready. Click Classify photo.';};
 img.onerror=()=>{status.textContent='This image could not be decoded. Try another photo.';};
 objectURL=URL.createObjectURL(file);img.src=objectURL;
});
button.addEventListener('click',async()=>{
 if(!loaded)return;button.disabled=true;input.disabled=true;
 try{
  status.textContent=session?'Analyzing photo…':'Downloading and loading the trained model…';
  session??=await ort.InferenceSession.create('/demos/models/fruit.onnx',{executionProviders:['wasm']});
  const response=await fetch('/demos/models/fruit-classes.json');if(!response.ok)throw Error('Class labels unavailable');const classes:string[]=await response.json();
  const canvas=document.createElement('canvas');canvas.width=canvas.height=224;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='white';ctx.fillRect(0,0,224,224);ctx.drawImage(img,0,0,224,224);
  const pixels=ctx.getImageData(0,0,224,224).data;const data=new Float32Array(3*224*224);
  const mean=[.485,.456,.406],std=[.229,.224,.225];
  for(let i=0;i<224*224;i++)for(let c=0;c<3;c++)data[c*224*224+i]=(pixels[i*4+c]/255-mean[c])/std[c];
  const output=await session.run({image:new ort.Tensor('float32',data,[1,3,224,224])});
  const values=Array.from(output.logits.data as Float32Array);const max=Math.max(...values);const exp=values.map(v=>Math.exp(v-max));const sum=exp.reduce((a,b)=>a+b,0);const probabilities=exp.map(v=>v/sum);
  const best=probabilities.indexOf(Math.max(...probabilities));result.textContent=`${classes[best]} · ${(probabilities[best]*100).toFixed(1)}%`;
  scores.replaceChildren();classes.forEach((label,i)=>{const p=document.createElement('p');p.textContent=`${label}: ${(probabilities[i]*100).toFixed(1)}%`;const bar=document.createElement('progress');bar.max=1;bar.value=probabilities[i];bar.setAttribute('aria-label',label);scores.append(p,bar);});
  status.textContent='Prediction complete. Try another photo to compare.';
 }catch(e){status.textContent='Could not run the model. Check your connection and retry. '+(e instanceof Error?e.message:'');}
 finally{button.disabled=false;input.disabled=false;}
});
