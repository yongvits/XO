'use strict';
/* Animate between rendered positions, including locally predicted moves awaiting server confirmation. */
const BoardMotion=(()=>{
let previous=null,busy=false,animations=[],epoch=0,rerender=null,root=null;
const token=p=>p&&typeof p==='object'?p.side+(p.king?'K':'M'):p||'';
function reset(){epoch++;if(root){root.removeAttribute('aria-busy');root.querySelectorAll('.in-motion').forEach(n=>n.classList.remove('in-motion'))}busy=false;rerender=null;for(const a of animations)a.cancel();animations=[];previous=null;document.querySelectorAll('.capture-ghost').forEach(n=>n.remove())}
function mount(board,meta,paint,onFinish){
 root=board;const values=meta.board.map(token),key=meta.key;
 if(previous&&previous.key!==key)reset();
 if(busy){rerender=onFinish;return}
 const old=previous;
 const cells=new Map([...board.querySelectorAll('[data-square]')].map(n=>[Number(n.dataset.square),n]));
 const boxes=new Map([...cells].map(([i,n])=>[i,n.getBoundingClientRect()]));
 const capture=meta.lastMove?.capture;
 const ghost=capture!==null&&capture!==undefined?cells.get(capture)?.querySelector('.piece')?.cloneNode(true):null;
 paint();previous={key,values};
 if(!old||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||typeof board.animate!=='function')return;
 const changed=values.flatMap((v,i)=>v!==old.values[i]?[i]:[]);
 if(!changed.length)return;
 const targets=new Map([...board.querySelectorAll('[data-square]')].map(n=>[Number(n.dataset.square),n]));
 const work=[];let duration=300;
 if(meta.kind==='checkers'){
  const m=meta.lastMove;
  if(!m||!old.values[m.from]||values[m.from]||old.values[m.from][0]!==values[m.to]?.[0]||!changed.includes(m.from)||!changed.includes(m.to)||changed.some(i=>i!==m.from&&i!==m.to&&i!==m.capture))return;
  const piece=targets.get(m.to)?.querySelector('.piece'),from=boxes.get(m.from),to=targets.get(m.to)?.getBoundingClientRect();
  if(!piece||!from||!to)return;
  const dx=from.left+from.width/2-to.left-to.width/2,dy=from.top+from.height/2-to.top-to.height/2;
  const squares=Math.max(Math.abs(dx)/to.width,Math.abs(dy)/to.height);
  duration=Math.min(480,300+squares*24);
  targets.get(m.to).classList.add('in-motion');
  const frames=m.capture!==null?[{transform:`translate(${dx}px,${dy}px) scale(1)`,offset:0},{transform:`translate(${dx*.5}px,${dy*.5-8}px) scale(1.06)`,offset:.5},{transform:'translate(0,0) scale(1)',offset:1}]:[{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}];
  work.push(piece.animate(frames,{duration,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'}));
  if(ghost&&m.capture!==null){ghost.classList.add('capture-ghost');targets.get(m.capture)?.append(ghost);work.push(ghost.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.35)'}],{duration:230,delay:duration*.3,easing:'ease-out',fill:'both'}))}
  if(old.values[m.from].endsWith('M')&&values[m.to].endsWith('K'))work.push(piece.animate([{filter:'brightness(1)'},{filter:'brightness(1.7)'},{filter:'brightness(1)'}],{duration:400,delay:duration-50,fill:'both'}));
 }else if(changed.length===1&&!old.values[changed[0]]&&values[changed[0]]){
  const mark=targets.get(changed[0])?.querySelector('.xo-mark');if(!mark)return;
  work.push(mark.animate([{opacity:0,transform:'translateY(7px) scale(.7)'},{opacity:1,transform:'translateY(-1px) scale(1.045)',offset:.75},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'}));
 }
 if(!work.length)return;
 busy=true;animations=work;board.setAttribute('aria-busy','true');const current=++epoch;
 Promise.allSettled(work.map(a=>a.finished)).then(()=>{if(current!==epoch)return;busy=false;animations=[];board.removeAttribute('aria-busy');board.querySelectorAll('.capture-ghost').forEach(n=>n.remove());board.querySelectorAll('.in-motion').forEach(n=>n.classList.remove('in-motion'));for(const a of work)a.cancel();const next=rerender;rerender=null;(next||onFinish)()});
}
return {mount,reset,get busy(){return busy}};
})();

