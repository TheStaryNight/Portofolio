import {mkdir,copyFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const [src,dst,files] of [
 ['node_modules/onnxruntime-web/dist','public/demos/runtime',['ort-wasm-simd-threaded.wasm','ort-wasm-simd-threaded.mjs']],
 ['node_modules/@mediapipe/tasks-vision/wasm','public/demos/vision',null],
]){
 await mkdir(resolve(root,dst),{recursive:true});
 for(const file of files||await readdir(resolve(root,src)))await copyFile(resolve(root,src,file),resolve(root,dst,file));
}
