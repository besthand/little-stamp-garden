// PIN entry is ephemeral UI state; it is never logged or stored by this helper.
export function nextPinValue(current,key,maxLength=32){
 const limit=Math.max(4,Math.min(32,Number(maxLength)||32));
 const value=/^\d{0,32}$/.test(String(current))?String(current).slice(0,limit):'';
 if(key==='clear')return '';
 if(key==='backspace')return value.slice(0,-1);
 if(/^\d$/.test(String(key))&&value.length<limit)return value+key;
 return value;
}
