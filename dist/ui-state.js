// View-only state. No family data or authorization decisions belong in this module.
export function createViewState(doc,win={}){
 let dialogOrigin=null,bodyStyles=null,lastTrigger=null,generation=0;
 const pages=new Map(),bodyKeys=['position','top','left','right','width','overflow'];
 const attr=(key,value)=>`[${key}=${JSON.stringify(String(value))}]`;
 const position=()=>({x:win.scrollX||0,y:win.scrollY||0});
 function target(node){
  if(!node||node===doc.body)return null;
  const allowed=['id','data-action','data-id','data-stamp','data-theme','data-index','data-page','data-rule','data-stamp-number','name'];
  const values=allowed.map(name=>[name,node.getAttribute?.(name)]).filter(([,v])=>v!=null);
  let selector=values.map(([k,v])=>attr(k,v)).join('');
  const form=node.closest?.('form');if(form?.id&&values.some(([k])=>k==='name'))selector=attr('id',form.id)+' '+selector;
  const number=node.getAttribute?.('data-stamp-number');
  return {node,selector:selector||null,fallbackSelector:number!=null?attr('data-stamp-number',number):null};
 }
 function resolve(t){if(!t)return null;if(t.node?.isConnected!==false&&t.node?.focus)return t.node;return (t.selector?doc.querySelector(t.selector):null)||(t.fallbackSelector?doc.querySelector(t.fallbackSelector):null);}
 function focusNoScroll(node){if(node?.focus&&!node.disabled)node.focus({preventScroll:true});}
 function capture(){return {...(dialogOrigin?{x:dialogOrigin.x,y:dialogOrigin.y}:position()),target:target(doc.activeElement),scrollers:[...(doc.querySelectorAll?.('[data-scroll-key]')||[])].map(n=>({key:n.getAttribute('data-scroll-key'),left:n.scrollLeft,top:n.scrollTop}))};}
 function restore(snapshot,{focus=true}={}){
  if(!snapshot)return;
  for(const s of snapshot.scrollers||[]){const n=doc.querySelector(attr('data-scroll-key',s.key));if(n){n.scrollLeft=s.left;n.scrollTop=s.top;}}
  const node=resolve(snapshot.target);
  if(focus&&(!dialogOrigin||node?.closest?.('#modal-root')))focusNoScroll(node);
  if(!dialogOrigin&&((win.scrollY||0)!==snapshot.y||(win.scrollX||0)!==snapshot.x))win.scrollTo?.({left:snapshot.x,top:snapshot.y,behavior:'instant'});
 }
 function rememberTrigger(node){if(!dialogOrigin&&!node?.closest?.('#modal-root'))lastTrigger=target(node);}
 function openDialog(){
  generation++;if(dialogOrigin)return;
  dialogOrigin=capture();dialogOrigin.target=lastTrigger||dialogOrigin.target;
  bodyStyles=Object.fromEntries(bodyKeys.map(k=>[k,doc.body.style[k]||'']));
  Object.assign(doc.body.style,{position:'fixed',top:`-${dialogOrigin.y}px`,left:`-${dialogOrigin.x}px`,right:'0',width:'100%',overflow:'hidden'});
 }
 function closeDialog(){
  if(!dialogOrigin)return;const origin=dialogOrigin;dialogOrigin=null;const token=++generation;
  Object.assign(doc.body.style,bodyStyles);bodyStyles=null;lastTrigger=null;restore(origin);
  // Mobile keyboards may release their viewport one animation frame after blur.
  win.requestAnimationFrame?.(()=>{if(token===generation&&!dialogOrigin)restore(origin);});
 }
 function savePage(key){pages.set(key,capture());}
 function restorePage(key){generation++;restore(pages.get(key)||{x:0,y:0,target:null,scrollers:[]},{focus:false});}
 return {capture,restore,rememberTrigger,openDialog,closeDialog,focusNoScroll,savePage,restorePage,isDialogOpen:()=>!!dialogOrigin};
}
