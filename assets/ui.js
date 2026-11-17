const dialog=document.getElementById('evidence-viewer');if(dialog){dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));document.querySelectorAll('[data-open-image]').forEach(b=>b.addEventListener('click',()=>document.body.classList.add('dialog-open')));}
document.querySelectorAll('[data-research-filter]').forEach(button=>button.addEventListener('click',()=>{const type=button.dataset.researchFilter;document.querySelectorAll('[data-research-filter]').forEach(b=>b.setAttribute('aria-pressed',b===button?'true':'false'));let count=0;document.querySelectorAll('[data-research-type]').forEach(item=>{item.hidden=type!=='all'&&item.dataset.researchType!==type;if(!item.hidden)count++});document.querySelector('.research-count').textContent='Показано работ: '+count}));
(() => {
 const bar=document.createElement('div');bar.className='reading-progress';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Прогресс чтения');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow','0');
 const fill=document.createElement('span');fill.className='reading-progress-fill';bar.append(fill);document.body.append(bar);
 let queued=false;
 function update(){queued=false;const distance=document.documentElement.scrollHeight-window.innerHeight;const value=distance>0?Math.max(0,Math.min(1,window.scrollY/distance)):0;fill.style.transform='scaleX('+value+')';bar.setAttribute('aria-valuenow',String(Math.round(value*100)))}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('load',schedule);document.addEventListener('click',schedule);update();
})();

(() => {
 const reduced=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const enter=el=>{if(reduced()||typeof el.animate!=='function')return;el.animate([{opacity:.7,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'})};
 if(typeof IntersectionObserver==='function'){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){enter(entry.target);observer.unobserve(entry.target)}}),{threshold:.12});
  document.querySelectorAll('.evidence-image,.work-cards>div,.finding,.research-item').forEach(el=>observer.observe(el));
 }
 function animateChart(){if(reduced())return;document.querySelectorAll('#public-chart polyline').forEach((line,i)=>{if(typeof line.getTotalLength!=='function'||typeof line.animate!=='function')return;const length=line.getTotalLength();line.getAnimations().forEach(a=>a.cancel());line.animate([{strokeDasharray:length+' '+length,strokeDashoffset:length,opacity:.5},{strokeDasharray:length+' '+length,strokeDashoffset:0,opacity:1}],{duration:500,delay:i*50,easing:'ease-out'})})}
 document.addEventListener('forecast:draw',animateChart);animateChart();
 document.querySelectorAll('[data-research-filter]').forEach(button=>button.addEventListener('click',()=>document.querySelectorAll('.research-item:not([hidden])').forEach(enter)));
})();

// Vector arrows render consistently across desktop and mobile browsers.
(() => {
 const paths={
  '\u2197':'M5 19 19 5M5 5h14v14',
  '\u2198':'M5 5 19 19M5 19h14V5',
  '\u2192':'M4 12h16M13 5l7 7-7 7',
  '\u2190':'M20 12H4m7-7-7 7 7 7',
  '\u2191':'M12 20V4m-7 7 7-7 7 7',
  '\u2193':'M12 4v16m-7-7 7 7 7-7'
 };
 const pattern=/[\u2197\u2198\u2192\u2190\u2191\u2193]/;
 const ignored='script,style,svg,textarea,select,option,code,pre';
 function replaceText(node){
  if(!node.parentElement||node.parentElement.closest(ignored)||!pattern.test(node.data))return;
  const fragment=document.createDocumentFragment();
  for(const part of node.data.split(/([\u2197\u2198\u2192\u2190\u2191\u2193])/)){
   if(!paths[part]){if(part)fragment.append(document.createTextNode(part));continue}
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width','16');svg.setAttribute('height','16');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('class','vector-arrow');
   svg.style.cssText='display:inline-block;vertical-align:-0.15em;flex-shrink:0;overflow:visible';
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',paths[part]);svg.append(path);fragment.append(svg);
  }
  node.replaceWith(fragment);
 }
 function scan(root){
  if(root.nodeType===Node.TEXT_NODE){replaceText(root);return}
  if(root.nodeType!==Node.ELEMENT_NODE||root.closest(ignored))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let node;while((node=walker.nextNode()))if(pattern.test(node.data))nodes.push(node);nodes.forEach(replaceText);
 }
 scan(document.body);
 const observer=new MutationObserver(records=>records.forEach(record=>{if(record.type==='characterData')replaceText(record.target);else record.addedNodes.forEach(scan)}));
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
