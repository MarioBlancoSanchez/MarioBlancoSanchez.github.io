// Countries are affiliation histories in the supplied papers, not nationalities.
(() => {
'use strict';
const papers=window.marioPublications;
const people=[
['M. Blanco-Sánchez','Mario Blanco-Sánchez',['Spain','Netherlands'],'URJC · NIOO-KNAW',500,320],
['S. Matesanz','Silvia Matesanz',['Spain'],'URJC · IICG-URJC',340,265],
['M. Ramos-Muñoz','Marina Ramos-Muñoz',['Spain','Netherlands'],'URJC · NIOO-KNAW',500,160],
['A. Escudero','Adrián Escudero',['Spain'],'URJC · IICG-URJC',650,275],
['B. Pías','Beatriz Pías',['Spain'],'Universidad Complutense de Madrid',600,460],
['J. A. Ramírez-Valiente','José Alberto Ramírez-Valiente',['Spain'],'INIA-CSIC · CREAF',355,455],
['S. E. Sultan','Sonia E. Sultan',['United States'],'Wesleyan University · Arnold Arboretum of Harvard University',825,110],
['K. J. F. Verhoeven','Koen J. F. Verhoeven',['Netherlands'],'NIOO-KNAW · University of Amsterdam',680,65],
['S. J. Franks','Steven J. Franks',['United States'],'Fordham University',840,350],
['M. J. Moore','Michael J. Moore',['United States'],'Oberlin College',845,510],
['M. C. Castellanos','María Clara Castellanos',['United Kingdom'],'University of Sussex',835,225],
['R. Benavides','Raquel Benavides',['Portugal','Spain'],'Universidade de Lisboa · MNCN-CSIC · Universidad Politécnica de Madrid',690,575],
['L. Díaz-Guerra','Laura Díaz-Guerra',['Spain'],'University of Girona · University of Vic–Central University of Catalonia',495,575],
['J. Pajares-Pérez','Javier Pajares-Pérez',['Spain'],'URJC · IICG-URJC',310,575],
['A. M. Sánchez','A. M. Sánchez',['Spain'],'URJC',150,510],
['M. de la Cruz','Marcelino de la Cruz',['Spain'],'URJC',150,390],
['A. García-Fernández','Alfredo García-Fernández',['Spain'],'URJC',145,265],
['M. Prieto','María Prieto',['Spain'],'URJC',150,140],
['L. Plaza','Lidia Plaza',['Spain'],'URJC',300,65],
['I. Isabel','Ignacio Isabel',['Spain'],'URJC',490,55]
].map(([id,name,countries,institutions,x,y])=>({id,name,countries,institutions,x,y,ox:x,oy:y,papers:papers.filter(p=>p.authors.includes(id))}));
const colors={'Spain':'#efca86','Netherlands':'#a7c4ed','United States':'#c4a4e3','Portugal':'#8dd6ae','United Kingdom':'#e8aaa5'};
const svg=document.getElementById('coauthor-network'),select=document.getElementById('coauthor'),result=document.getElementById('coauthor-results');
function se(tag,attrs={},text){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;return e;}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;}
const edgeLayer=se('g',{'aria-hidden':'true'}),nodeLayer=se('g');svg.append(edgeLayer,nodeLayer);
const edges=[];
people.forEach((p,i)=>people.slice(i+1).forEach(q=>{const n=p.papers.filter(a=>a.authors.includes(q.id)).length;if(n){const line=se('line',{class:'network-edge','stroke-width':Math.min(3,.6+n*.25)});edges.push({p,q,line});edgeLayer.append(line);}}));
function choose(id){
 select.value=id;people.forEach(p=>{p.node.classList.toggle('selected',p.id===id);p.node.setAttribute('aria-pressed',String(p.id===id));});
 edges.forEach(e=>{e.line.classList.toggle('highlight',!!id&&(e.p.id===id||e.q.id===id));e.line.classList.toggle('dim',!!id&&e.p.id!==id&&e.q.id!==id);});
 result.replaceChildren();const p=people.find(p=>p.id===id);if(!p){result.append(el('p','muted','Select a node or choose a name to explore the papers.'));return;}
 result.append(el('h3','selected-coauthor',p.name),el('p','affiliation-country',p.countries.join(' · ')),el('p','affiliation-institutions',p.institutions),el('p','network-count',p.papers.length+' publication'+(p.papers.length===1?'':'s')+' in this collection'));
 p.papers.forEach(a=>{const article=el('article','shared-paper'),link=el('a','shared-title',a.title),pdf=el('a','shared-download','Download PDF ↓');link.href='https://doi.org/'+a.doi;link.target='_blank';link.rel='noopener noreferrer';pdf.href='download.html?paper='+encodeURIComponent(a.pdf.split('/').pop());pdf.target='_blank';pdf.rel='noopener';article.append(el('span',null,a.year+' · '+a.journal),link,pdf);result.append(article);});
}
function position(){people.forEach(p=>p.node.setAttribute('transform',`translate(${p.x},${p.y})`));edges.forEach(({p,q,line})=>Object.entries({x1:p.x,y1:p.y,x2:q.x,y2:q.y}).forEach(([k,v])=>line.setAttribute(k,v)));}
let drag=null,moved=false;
people.forEach(p=>{
 const r=13+Math.sqrt(p.papers.length)*3.4,g=se('g',{class:'network-node'+(p.id==='M. Blanco-Sánchez'?' is-owner':''),role:'button',tabindex:0,'aria-pressed':'false','aria-label':`${p.name}. ${p.countries.join(' and ')}. ${p.papers.length} publications. Select to explore.`});p.node=g;
 g.append(se('title',{},p.name+' · '+p.countries.join(' / ')),se('circle',{r:r+5,class:'node-halo'}));
 if(p.countries.length===1)g.append(se('circle',{r,fill:colors[p.countries[0]]}));else p.countries.forEach((c,i)=>{const a=-Math.PI/2+i*Math.PI,b=a+Math.PI;g.append(se('path',{d:`M0,0 L${r*Math.cos(a)},${r*Math.sin(a)} A${r},${r} 0 0 1 ${r*Math.cos(b)},${r*Math.sin(b)} Z`,fill:colors[c]}));});
 g.append(se('text',{y:5,'text-anchor':'middle',class:'node-count','aria-hidden':'true'},String(p.papers.length)),se('text',{y:r+24,'text-anchor':'middle',class:'node-label','aria-hidden':'true'},p.id==='M. Blanco-Sánchez'?p.name:p.id));nodeLayer.append(g);
 g.addEventListener('click',()=>{if(!moved)choose(p.id);moved=false;});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(p.id);}});
 g.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;moved=false;drag={p,x:e.clientX,y:e.clientY};g.setPointerCapture(e.pointerId);});
 g.addEventListener('pointermove',e=>{if(!drag||drag.p!==p)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4)moved=true;if(!moved)return;const v=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());p.x=Math.max(125,Math.min(875,v.x));p.y=Math.max(45,Math.min(580,v.y));position();});
 g.addEventListener('pointerup',()=>drag=null);g.addEventListener('pointercancel',()=>{drag=null;moved=false;});
});
position();people.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(p=>{const o=el('option',null,p.name);o.value=p.id;select.append(o);});select.addEventListener('change',()=>choose(select.value));
document.getElementById('network-reset').addEventListener('click',()=>{people.forEach(p=>{p.x=p.ox;p.y=p.oy;});position();choose('');});
Object.entries(colors).forEach(([name,color])=>{const item=el('span','country-item'),dot=el('span','country-dot');dot.style.backgroundColor=color;item.append(dot,document.createTextNode(name));document.getElementById('country-key').append(item);});
})();
