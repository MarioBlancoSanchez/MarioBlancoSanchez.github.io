(() => {
'use strict';
const $=s=>document.querySelector(s);
const sections=[...document.querySelectorAll('[data-garden-section]')];
const nav=[...document.querySelectorAll('nav a')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let active=-1,locked=false,unlockTimer,queued=false;
function setActive(index){
 if(index===active)return;active=index;
 document.body.dataset.environment=index%2?'stressful':'benign';
 nav.forEach(a=>{if(a.hash==='#'+sections[index].id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 const control=$('#tg-section');if(control){control.value=sections[index].dataset.gardenSection;control.dispatchEvent(new Event('change',{bubbles:true}));}
}
function fromScroll(){
 queued=false;if(locked)return;
 const threshold=$('.site-header').getBoundingClientRect().height+Math.min(170,innerHeight*.22);
 let index=0;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<=threshold)index=i;});
 if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)index=sections.length-1;
 setActive(index);
}
function release(){clearTimeout(unlockTimer);locked=false;fromScroll();}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(fromScroll);}},{passive:true});
addEventListener('scrollend',release,{passive:true});addEventListener('wheel',release,{passive:true});addEventListener('touchstart',release,{passive:true});addEventListener('hashchange',release);
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
 if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const destination=document.getElementById(link.hash.slice(1));if(!destination)return;
 event.preventDefault();clearTimeout(unlockTimer);
 const section=destination.matches('[data-garden-section]')?destination:destination.closest('[data-garden-section]');
 if(section){locked=true;setActive(sections.indexOf(section));}
 history.pushState(null,'',link.hash);destination.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
 // Do not count intermediate sections passed during a deliberate menu jump.
 unlockTimer=setTimeout(release,1500);
}));
new ResizeObserver(()=>{document.documentElement.style.setProperty('--nav-height',$('.site-header').getBoundingClientRect().height+'px');fromScroll();}).observe($('.site-header'));
let textSize=1;try{textSize=Math.max(0.9,Math.min(1.2,Number(localStorage.getItem('mario-text-size'))||1));}catch{}
function updateSize(change=0){textSize=Math.round(Math.max(0.9,Math.min(1.2,textSize+change))*10)/10;document.documentElement.style.setProperty('--text-scale',textSize);$('#text-smaller').disabled=textSize<=0.9;$('#text-larger').disabled=textSize>=1.2;try{localStorage.setItem('mario-text-size',textSize);}catch{}if(change)$('#site-announcement').textContent='Text size '+Math.round(textSize*100)+' percent';}
$('#text-smaller').addEventListener('click',()=>updateSize(-.1));$('#text-larger').addEventListener('click',()=>updateSize(.1));updateSize();
const publications=window.marioPublications;
function element(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function external(href,label,cls){const a=element('a',cls,label);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a;}
function render(){
 const query=$('#publication-search').value.trim().toLocaleLowerCase();
 const matches=publications.filter(p=>[p.title,p.year,p.journal,...p.authors].join(' ').toLocaleLowerCase().includes(query));
 const fragment=document.createDocumentFragment();
 matches.forEach(p=>{const article=element('article','publication'),body=element('div'),h=element('h3');h.append(external('https://doi.org/'+p.doi,p.title));body.append(h,element('p','authors',p.authors.join(', ')),element('p','journal',p.journal+' · '+p.volume));const link=external('https://doi.org/'+p.doi,'Read','doi'),arrow=element('span','arrow');arrow.setAttribute('aria-hidden','true');link.append(arrow);link.setAttribute('aria-label','Read '+p.title);const actions=element('div','publication-actions'),download=element('a','download','Download ↓');download.href='download.html?paper='+encodeURIComponent(p.pdf.split('/').pop());download.target='_blank';download.rel='noopener';download.setAttribute('aria-label','Download PDF: '+p.title);actions.append(link,download);article.append(element('span','publication-year',p.year),body,actions);fragment.append(article);});
 if(!matches.length)fragment.append(element('p','no-results','No publications match this search.'));
 $('#publication-list').replaceChildren(fragment);$('#publication-count').textContent=matches.length+' of '+publications.length+' publications';
}
$('#publication-search').addEventListener('input',render);render();
const panel=$('#garden-panel'),launch=$('#garden-launch'),garden=$('#mario-violet-sage-garden');
function openGarden(open){panel.hidden=!open;document.body.classList.toggle('garden-open',open);launch.setAttribute('aria-expanded',String(open));if(open&&garden.querySelector('.tg-scene').dataset.phase==='empty')garden.querySelector('[data-plant]').click();}
launch.addEventListener('click',()=>openGarden(panel.hidden));$('#garden-close').addEventListener('click',()=>{openGarden(false);launch.focus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&!garden.querySelector('dialog[open]')){openGarden(false);launch.focus();}});
garden.querySelectorAll('[data-choose]').forEach(button=>button.addEventListener('click',()=>{$('#garden-launch-label').textContent='Your common garden';}));
$('#garden-dock').hidden=false;$('#copyright-year').textContent=new Date().getFullYear();fromScroll();
})();
