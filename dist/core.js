export const enc = new TextEncoder();
export const uid = () => crypto.randomUUID();
export const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
export const unb64 = str => Uint8Array.from(atob(str), c=>c.charCodeAt(0));
export const stamps = [
{id:'star',name:'閃亮星星',color:'#e8ad43'}, {id:'heart',name:'愛心鼓勵',color:'#db8386'},
{id:'clover',name:'幸運四葉草',color:'#689278'}, {id:'flower',name:'開心小花',color:'#a58bbd'},
{id:'bear',name:'暖暖小熊',color:'#bc9064'}, {id:'smile',name:'元氣笑臉',color:'#6b9eae'}];
export const themes = [
{id:'forest',name:'森林小日子',color:'#577e63',light:'#edf3e9',emoji:'🌿',caption:'像小樹一樣，每天長大一點點。'},
{id:'ocean',name:'海洋探險家',color:'#50869c',light:'#eaf3f6',emoji:'🐳',caption:'每一份努力，都是勇敢的新航程。'},
{id:'space',name:'星空夢想家',color:'#8470a2',light:'#f0edf7',emoji:'🪐',caption:'你的夢想，會像星星一樣發光。'},
{id:'peach',name:'甜甜花園',color:'#ba7f83',light:'#fbefec',emoji:'🌷',caption:'把小小努力，種成漂亮的花。'}];
export function balance(state,id){return state.events.filter(e=>e.childId===id).reduce((s,e)=>s+e.delta,0)}
export function earned(state,id){return state.events.filter(e=>e.childId===id && e.kind==='earn').reduce((s,e)=>s+e.delta,0)}
// Reconstruct available stamps from the existing ledger, without allocating every point.
// Point deductions consume the oldest available stamps; records themselves remain unchanged.
export function stampCardView(state,childId,requestedPage=null){
 const batches=[];let head=0,total=0;
 for(const event of state.events){
  if(event.childId!==childId)continue;
  if(event.kind==='earn'){batches.push({event,count:event.delta});total+=event.delta;}
  else if(event.delta<0){let remaining=-event.delta;total-=remaining;
   while(remaining&&head<batches.length){const batch=batches[head],used=Math.min(remaining,batch.count);batch.count-=used;remaining-=used;if(!batch.count)head++;}
  }
 }
 const pageCount=Math.max(1,Math.ceil(total/20));
 const page=Number.isInteger(requestedPage)?Math.min(pageCount-1,Math.max(0,requestedPage)):pageCount-1;
 const offset=page*20,points=[];let skip=offset;
 for(let i=head;i<batches.length&&points.length<20;i++){
  const batch=batches[i];if(skip>=batch.count){skip-=batch.count;continue;}
  const count=Math.min(20-points.length,batch.count-skip);skip=0;
  for(let j=0;j<count;j++)points.push({eventId:batch.event.id,stamp:batch.event.stamp,reason:batch.event.reason,at:batch.event.at});
 }
 return {total,pageCount,page,offset,points};
}
export function eligibility(state,childId,r){
 const redeems=state.events.filter(e=>e.childId===childId&&e.rewardId===r.id&&e.kind==='redeem');
 if(r.rule==='milestone') return {ready:earned(state,childId)>=r.cost&&!redeems.length,current:earned(state,childId),claimed:!!redeems.length};
 if(r.rule==='card') {const used=redeems.reduce((s,e)=>s+(e.threshold||r.cost),0);return {ready:earned(state,childId)-used>=r.cost,current:earned(state,childId)-used,claimed:false};}
 return {ready:balance(state,childId)>=r.cost,current:balance(state,childId),claimed:false};
}
export function addEvent(state,childId,kind,amount,reason,stamp='star',reward=null){
 if(!state.children.some(c=>c.id===childId))throw Error('找不到孩子的手冊');
 if(!Number.isSafeInteger(amount)||amount<1||amount>999)throw Error('點數請填寫 1～999');
 if(!['earn','spend','redeem'].includes(kind))throw Error('無效的操作');
 let delta=kind==='earn'?amount:-amount;
 if(kind==='redeem'){
  if(!reward||!eligibility(state,childId,reward).ready)throw Error('還沒有達成兌獎條件喔');
  delta=reward.rule==='spend'?-reward.cost:0;
 }
 if(balance(state,childId)+delta<0)throw Error('小星星不夠了，請調整點數');
 const event={id:uid(),childId,kind,delta,reason:String(reason||'').slice(0,120),stamp,at:new Date().toISOString()};
 if(reward)Object.assign(event,{rewardId:reward.id,rewardName:reward.name,threshold:reward.cost,rule:reward.rule});
 state.events.push(event);return event;
}
export function validateState(s){
 if(!s||s.version!==1||typeof s.demo!=='boolean'||!Array.isArray(s.children)||!Array.isArray(s.events)||!Array.isArray(s.rewards)||s.children.length>50||s.events.length>100000||s.rewards.length>200)throw Error('備份資料格式不正確');
 const str=(x,max)=>typeof x==='string'&&x.length<=max;
 const ids=new Set();
 for(const c of s.children){if(!str(c.id,100)||ids.has(c.id)||!str(c.name,20)||!c.name.trim()||!themes.some(t=>t.id===c.theme)||!['bear','bunny','cat','fox'].includes(c.avatar)||!stamps.some(t=>t.id===c.stamp))throw Error('孩子資料格式不正確');ids.add(c.id);}
 const rewards=new Set();
 for(const r of s.rewards){if(!str(r.id,100)||rewards.has(r.id)||!str(r.name,40)||!r.name.trim()||!str(r.description,120)||!['spend','milestone','card'].includes(r.rule)||!Number.isSafeInteger(r.cost)||r.cost<1||r.cost>999||!['icecream','game','gift','book','park','movie'].includes(r.image))throw Error('獎勵資料格式不正確');rewards.add(r.id);}
 const eventIds=new Set(),balances={};
 for(const e of s.events){if(!str(e.id,100)||eventIds.has(e.id)||!ids.has(e.childId)||!['earn','spend','redeem'].includes(e.kind)||!Number.isSafeInteger(e.delta)||Math.abs(e.delta)>999||!str(e.reason,120)||!stamps.some(t=>t.id===e.stamp)||!str(e.at,40)||!Number.isFinite(Date.parse(e.at))||e.kind==='earn'&&e.delta<=0||e.kind==='spend'&&e.delta>=0||e.kind==='redeem'&&(e.delta>0||!str(e.rewardId,100)||!str(e.rewardName,40)||!['spend','milestone','card'].includes(e.rule)||!Number.isSafeInteger(e.threshold)||e.threshold<1||e.threshold>999||e.delta!==(e.rule==='spend'?-e.threshold:0)))throw Error('集點紀錄格式不正確');
 eventIds.add(e.id);balances[e.childId]=(balances[e.childId]||0)+e.delta;if(balances[e.childId]<0)throw Error('集點紀錄點數不一致');}
 if(s.pin!==null&&(!s.pin||!str(s.pin.hash,200)||!str(s.pin.salt,100)||!Number.isSafeInteger(s.pin.length)||s.pin.length<4||s.pin.length>8))throw Error('家長密碼資料不正確');
 if(!Number.isSafeInteger(s.failures)||s.failures<0||!Number.isFinite(s.lockUntil)||s.lockUntil<0)throw Error('保護設定不正確');
 return s;
}
export async function derive(password,salt,usage='deriveKey'){
 const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,[usage]);
 return base;
}
export async function pinHash(pin,salt){const k=await derive(pin,salt,'deriveBits');return b64(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unb64(salt),iterations:150000,hash:'SHA-256'},k,256));}
export async function makePin(pin){if(!/^\d{4,8}$/.test(pin))throw Error('請設定 4～8 位數字密碼');const salt=b64(crypto.getRandomValues(new Uint8Array(16)));return {salt,hash:await pinHash(pin,salt),length:pin.length};}
export async function verifyPin(input,config){
 if(!/^\d{4,32}$/.test(input)||input.length<config.length)return false;
 let match=false;
 for(let i=0;i<=input.length-config.length;i++){const hash=await pinHash(input.slice(i,i+config.length),config.salt);if(hash===config.hash)match=true;}
 return match;
}
async function backupKey(pass,salt){const k=await derive(pass,salt);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function encryptBackup(state,password){
 if(password.length<8||password.length>128)throw Error('備份密碼請使用 8～128 個字元');
 validateState(state);const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const k=await backupKey(password,salt),plain=enc.encode(JSON.stringify(state));
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode('little-stamp-garden:v1')},k,plain);
 // Encode in chunks so large histories never overflow the JS argument limit.
 const bytes=new Uint8Array(encrypted);let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));
 return JSON.stringify({format:'little-stamp-garden',version:1,kdf:'PBKDF2-SHA256-310000',cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),data:btoa(binary)});
}
export async function decryptBackup(text,password){
 try{if(text.length>15000000)throw Error();const f=JSON.parse(text);if(f.format!=='little-stamp-garden'||f.version!==1||f.kdf!=='PBKDF2-SHA256-310000'||f.cipher!=='AES-256-GCM'||typeof f.data!=='string')throw Error();
 const salt=unb64(f.salt),iv=unb64(f.iv);if(salt.length!==16||iv.length!==12)throw Error();
 const k=await backupKey(password,salt),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:enc.encode('little-stamp-garden:v1')},k,unb64(f.data));
 return validateState(JSON.parse(new TextDecoder().decode(plain)));}catch{throw Error('無法開啟備份：密碼不正確、檔案損壞或內容曾被修改。');}
}
export function newState(demo=true){
 const s={version:1,demo,children:[],events:[],rewards:[],pin:null,failures:0,lockUntil:0};
 s.rewards=[{id:uid(),name:'一起吃冰淇淋',description:'挑一個最喜歡的口味，甜甜慶祝！',cost:15,rule:'spend',image:'icecream'}, {id:uid(),name:'家庭遊戲時光',description:'今天玩什麼？由你來決定！',cost:10,rule:'card',image:'game'}, {id:uid(),name:'神祕小禮物',description:'累積努力，解鎖一份特別的驚喜。',cost:30,rule:'milestone',image:'gift'}];
 if(demo){s.children=[{id:uid(),name:'小宇',theme:'forest',avatar:'bear',stamp:'star'}, {id:uid(),name:'小晴',theme:'peach',avatar:'bunny',stamp:'flower'}];
 for(let i=0;i<12;i++){const e=addEvent(s,s.children[0].id,'earn',1,['自己收好玩具','主動幫忙擺餐具','認真讀了故事書','早上自己刷牙'][i%4],['star','clover','heart'][i%3]);e.at=new Date(Date.now()-(11-i)*3600000*4).toISOString();}
 for(let i=0;i<6;i++)addEvent(s,s.children[1].id,'earn',1,'完成了自己的小任務','flower');}
 return s;
}
