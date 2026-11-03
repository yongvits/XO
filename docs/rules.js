/* Thai draughts: 8 pieces, forward-only men, flying kings, immediate landing after captures. */
(function(root){
'use strict';
const other=s=>s==='X'?'O':'X',inside=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
function initial(){return Array.from({length:64},(_,i)=>{const r=Math.floor(i/8),c=i%8;return (r+c)%2===1&&(r<2||r>5)?{side:r<2?'O':'X',king:false}:null})}
function pieceMoves(board,from,capturesOnly=false){const p=board[from];if(!p)return [];const r=Math.floor(from/8),c=from%8,result=[];const directions=p.king?[[-1,-1],[-1,1],[1,-1],[1,1]]:p.side==='X'?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
for(const [dr,dc] of directions){let nr=r+dr,nc=c+dc;while(inside(nr,nc)){const to=nr*8+nc,target=board[to];if(!target){if(!capturesOnly)result.push({from,to,capture:null});if(!p.king)break;nr+=dr;nc+=dc;continue}if(target.side!==p.side&&inside(nr+dr,nc+dc)&&!board[(nr+dr)*8+nc+dc])result.push({from,to:(nr+dr)*8+nc+dc,capture:to});break}}
return result}
function legal(board,side,chain=null){if(chain!==null)return board[chain]?.side===side?pieceMoves(board,chain,true):[];let all=[];for(let i=0;i<64;i++)if(board[i]?.side===side)all.push(...pieceMoves(board,i));const captures=all.filter(m=>m.capture!==null);return captures.length?captures:all}
function apply(state,from,to,side){if(state.result||state.turn!==side||!Number.isInteger(from)||!Number.isInteger(to))return null;const move=legal(state.board,side,state.chain??null).find(m=>m.from===from&&m.to===to);if(!move)return null;const board=state.board.map(p=>p?{...p}:null),p=board[from];board[from]=null;board[to]=p;if(move.capture!==null)board[move.capture]=null;const promoted=!p.king&&(side==='X'?Math.floor(to/8)===0:Math.floor(to/8)===7);if(promoted)p.king=true;
const continuation=move.capture!==null&&!promoted&&pieceMoves(board,to,true).length>0;const turn=continuation?side:other(side);const next={...state,board,turn,chain:continuation?to:null,drawOffer:null,lastMove:{from,to,capture:move.capture},ply:(state.ply||0)+(continuation?0:1)};
if(!continuation&&!legal(board,turn).length)next.result={winner:side,line:[]};return next}
const api={initial,pieceMoves,legal,apply,other};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ThaiDraughts=api;
})(typeof globalThis!=='undefined'?globalThis:this);
