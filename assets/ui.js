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
