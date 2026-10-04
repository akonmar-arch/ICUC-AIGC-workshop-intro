// Original DataRain, CountUp, Ghost, Tilt, reveal and stage-tab behavior.
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');observer.unobserve(entry.target);}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const canvas=document.querySelector('.data-rain');
if(canvas){
 const ctx=canvas.getContext('2d');let width=0,height=0,cols=[],frame;
 const words=['国际传播','AI','出海','TikTok','YouTube','跨文化','DeepSeek','豆包','Kimi','千问','即梦','可灵','海螺','Vidu','扣子','标识','投放','复盘','决策','受众','算法','工作流','真实','story','data','72h','agent','campaign','global'];
 const spawn=(random=false)=>({x:Math.random()*width,y:random?Math.random()*height:-40,speed:.4+Math.random()*1.1,word:words[Math.floor(Math.random()*words.length)],size:11+Math.random()*15,alpha:.08+Math.random()*.3});
 const resize=()=>{const r=canvas.parentElement.getBoundingClientRect();width=canvas.width=Math.floor(r.width);height=canvas.height=Math.floor(r.height);cols=Array.from({length:Math.max(14,Math.floor(width/90))},()=>spawn(true));};
 const draw=()=>{ctx.clearRect(0,0,width,height);for(const c of cols){ctx.font=`${c.size}px ui-monospace,"PingFang SC",monospace`;ctx.fillStyle=`rgba(210,255,0,${c.alpha})`;ctx.fillText(c.word,c.x,c.y);c.y+=c.speed;if(c.y>height+40)Object.assign(c,spawn());}if(!reduced)frame=requestAnimationFrame(draw);};
 resize();draw();addEventListener('resize',resize);addEventListener('pagehide',()=>cancelAnimationFrame(frame));
}
const counters=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;counters.unobserve(target);const m=target.dataset.count.match(/^([\d.]+)(.*)$/);if(!m||reduced)return;const value=Number(m[1]),suffix=m[2],start=performance.now();const tick=t=>{const p=Math.min(1,(t-start)/1200);target.textContent=Math.round(value*(1-(1-p)**3))+suffix;if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}),{threshold:.4});
document.querySelectorAll('[data-count]').forEach(el=>counters.observe(el));
let scrollFrame;
function drawScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress i').style.transform=`scaleX(${max>0?scrollY/max:0})`;if(!reduced)document.querySelectorAll('.ghost-num').forEach(el=>{const r=el.getBoundingClientRect(),p=(r.top+r.height/2-innerHeight/2)/innerHeight;el.style.transform=`translateY(${(-p*60).toFixed(1)}px)`;});}
addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(drawScroll);},{passive:true});drawScroll();
if(!reduced&&matchMedia('(hover:hover)').matches)document.querySelectorAll('.tilt').forEach(el=>{el.addEventListener('pointermove',event=>{const r=el.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;el.style.transition='transform .08s linear';el.style.transform=`perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) translateY(-4px)`;});el.addEventListener('pointerleave',()=>{el.style.transition='transform .5s cubic-bezier(.22,1,.36,1)';el.style.transform='';});});
const tabs=[...document.querySelectorAll('[data-phase]')];
function selectPhase(tab){tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',selected);item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});drawScroll();}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectPhase(tab));tab.addEventListener('keydown',event=>{let n;if(event.key==='ArrowRight')n=(i+1)%tabs.length;if(event.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(event.key==='Home')n=0;if(event.key==='End')n=tabs.length-1;if(n!==undefined){event.preventDefault();selectPhase(tabs[n]);tabs[n].focus();}});});
let dialogOpener;
function openDialog(dialog,opener){dialogOpener=opener;dialog.showModal();document.body.style.overflow='hidden';}
document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{document.body.style.overflow='';document.querySelector('.menu-trigger').setAttribute('aria-expanded','false');dialogOpener?.focus({preventScroll:true});});dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));});
document.querySelectorAll('[data-week]').forEach(button=>button.addEventListener('click',()=>openDialog(document.getElementById(`lesson-${button.dataset.week}`),button)));
document.querySelectorAll('.week-card').forEach(card=>card.addEventListener('click',event=>{if(!event.target.closest('a,button'))card.querySelector('[data-week]').click();}));
document.querySelectorAll('[data-expand]').forEach(button=>button.addEventListener('click',()=>document.querySelectorAll('details.week').forEach(el=>{el.open=button.dataset.expand==='true';})));
function linkedWeek(){const el=document.getElementById(location.hash.slice(1));if(el?.matches('details')){el.open=true;el.classList.add('is-in');requestAnimationFrame(()=>el.scrollIntoView({behavior:'instant',block:'start'}));}}
linkedWeek();addEventListener('hashchange',linkedWeek);
const menu=document.querySelector('.mobile-menu'),menuButton=document.querySelector('.menu-trigger');
menuButton.addEventListener('click',()=>{openDialog(menu,menuButton);menuButton.setAttribute('aria-expanded','true');});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.close()));
