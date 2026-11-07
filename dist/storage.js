import {enc,b64,unb64,validateState,newState} from './core.js';
let db,key;
function transaction(mode,work){return new Promise((resolve,reject)=>{const tx=db.transaction('vault',mode);let result;try{result=work(tx.objectStore('vault'));}catch(e){reject(e);return;}tx.oncomplete=()=>resolve(result?.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('資料儲存已中止'));});}
export async function initStore(){
 db=await new Promise((resolve,reject)=>{const req=indexedDB.open('little-stamp-garden',1);req.onupgradeneeded=()=>req.result.createObjectStore('vault');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('請先關閉其他集點園分頁再試一次'));});
 key=await transaction('readonly',s=>s.get('integrity-key'));
 if(!key){const old=await transaction('readonly',s=>s.get('snapshot'));if(old)throw Error('完整性金鑰遺失，請匯入可信任的加密備份');key=await crypto.subtle.generateKey({name:'HMAC',hash:'SHA-256'},false,['sign','verify']);await transaction('readwrite',s=>s.put(key,'integrity-key'));}
 const record=await transaction('readonly',s=>s.get('snapshot'));
 if(!record){const state=newState();await saveState(state);return state;}
 if(!await crypto.subtle.verify('HMAC',key,unb64(record.mac),enc.encode(record.payload)))throw Error('本機資料未通過完整性驗證。為保護紀錄，已停止載入；請使用可信任的加密備份還原。');
 return validateState(JSON.parse(record.payload));
}
export async function saveState(state){validateState(state);const payload=JSON.stringify(state),mac=b64(await crypto.subtle.sign('HMAC',key,enc.encode(payload)));await transaction('readwrite',s=>s.put({payload,mac},'snapshot'));}
export async function recoverStore(state){validateState(state);if(!key){key=await crypto.subtle.generateKey({name:'HMAC',hash:'SHA-256'},false,['sign','verify']);await transaction('readwrite',s=>s.put(key,'integrity-key'));}await saveState(state);}
let lock;
export async function ownWriter(){if(!navigator.locks)return true;let decided;const ready=new Promise(r=>decided=r);navigator.locks.request('little-stamp-garden-writer',{ifAvailable:true},async l=>{if(!l){decided(false);return;}decided(true);await new Promise(r=>lock=r);});return ready;}
