import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {networkInterfaces} from 'node:os';
import {randomUUID} from 'node:crypto';
const rooms=new Map(), sessions=new Map();
const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const view=r=>({id:r.id,name:r.name,board:r.board,turn:r.turn,result:r.result,players:r.players.map(p=>({name:p.name,mark:p.mark})),round:r.round});
function clean(){const now=Date.now();for(const [id,r] of rooms)if(now-r.active>30*60*1000){rooms.delete(id);for(const p of r.players)sessions.delete(p.token)}}
const server=http.createServer(async(req,res)=>{res.setHeader('Cache-Control','no-store');try{
const url=new URL(req.url,'http://localhost');
const send=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data))};
if(url.pathname.startsWith('/api/')){
clean();if(req.method==='GET'&&url.pathname==='/api/rooms')return send(200,[...rooms.values()].filter(r=>r.players.length===1).map(view));
const token=req.headers.authorization?.replace('Bearer ','');const session=sessions.get(token);
if(req.method==='GET'&&url.pathname==='/api/game'){if(!session||!rooms.has(session.room))return send(401,{error:'ไม่พบห้อง กรุณาเข้าห้องใหม่'});const r=rooms.get(session.room);r.active=Date.now();return send(200,{...view(r),you:session.mark})}
if(req.method!=='POST')return send(404,{error:'ไม่พบคำสั่ง'});
let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>4096)return send(413,{error:'ข้อมูลใหญ่เกินไป'})}const data=JSON.parse(raw||'{}');
const name=String(data.name||'ผู้เล่น').trim().slice(0,24)||'ผู้เล่น';
if(url.pathname==='/api/create'||url.pathname==='/api/join'){
let r;if(url.pathname==='/api/create'){r={id:randomUUID().slice(0,8),name:String(data.roomName||'ห้องของ '+name).slice(0,40),players:[],board:Array(9).fill(''),turn:'X',result:null,round:1,active:Date.now()};rooms.set(r.id,r)}else{r=rooms.get(data.id);if(!r||r.players.length!==1)return send(409,{error:'ห้องนี้เต็มหรือปิดแล้ว'})}
const mark=r.players.length?'O':'X',token=randomUUID();r.players.push({name,mark,token});sessions.set(token,{room:r.id,mark});r.active=Date.now();return send(200,{token,...view(r),you:mark})}
if(!session)return send(401,{error:'กรุณาเข้าห้องก่อน'});const r=rooms.get(session.room);if(!r)return send(404,{error:'ห้องปิดแล้ว'});r.active=Date.now();
if(url.pathname==='/api/move'){const i=data.index;if(r.players.length!==2||r.result||r.turn!==session.mark||!Number.isInteger(i)||i<0||i>8||r.board[i])return send(409,{error:'ยังวางช่องนี้ไม่ได้'});r.board[i]=session.mark;const win=lines.find(l=>l.every(i=>r.board[i]===session.mark));r.result=win?{winner:session.mark,line:win}:r.board.every(Boolean)?{winner:'draw',line:[]}:null;r.turn=r.turn==='X'?'O':'X'}
else if(url.pathname==='/api/rematch'){if(!r.result)return send(409,{error:'รอให้จบเกมก่อน'});r.board=Array(9).fill('');r.result=null;r.round++;r.turn=r.round%2?'X':'O'}
else if(url.pathname==='/api/leave'){for(const p of r.players)sessions.delete(p.token);rooms.delete(r.id);return send(200,{ok:true})}
else return send(404,{error:'ไม่พบคำสั่ง'});return send(200,{...view(r),you:session.mark});
}
if(req.method!=='GET'||!['/','/app.js','/style.css'].includes(url.pathname)){res.writeHead(404);return res.end()}
const file=url.pathname==='/'?'index.html':url.pathname.slice(1);res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8');res.end(await readFile(new URL('./public/'+file,import.meta.url)));
}catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'คำขอไม่ถูกต้อง'}))}});
const port=Number(process.env.PORT||3000);server.listen(port,'0.0.0.0',()=>{console.log(`OX ready: http://localhost:${port}`);for(const entries of Object.values(networkInterfaces()))for(const n of entries||[])if(n.family==='IPv4'&&!n.internal)console.log(`Wi-Fi link: http://${n.address}:${port}`)});
