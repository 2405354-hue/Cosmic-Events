const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],DAY=864e5,HR=36e5;
const LS={g:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const EV=[
 {n:"HackSprint 24h",cat:"Tech",em:"💻",c:["#7c3aed","#ec4899"],d:3,dur:24,cap:120,seed:96,v:"Innovation Lab, Block C",o:"Dev Club",p:"2h ago",a:"Build, break and ship in 24 hours with mentors on call and prizes for the top three teams."},
 {n:"Open Mic Night",cat:"Music",em:"🎸",c:["#f97316","#e11d48"],d:5,dur:3,cap:60,seed:41,v:"Amphitheatre",o:"Music Society",p:"5h ago",a:"Share your voice, vibe with the community, and experience the power of live music!"},
 {n:"Poster Collage Jam",cat:"Art",em:"🎨",c:["#d946ef","#3b82f6"],d:7,dur:2,cap:30,seed:30,v:"Design Studio",o:"Cut and Paste Club",p:"1d ago",a:"Bring old magazines and scissors. We supply glue, boards and snacks."},
 {n:"Inter-Dept Football",cat:"Sports",em:"⚽",c:["#16a34a","#0ea5e9"],d:9,dur:4,cap:100,seed:58,v:"Main Ground",o:"Sports Council",p:"1d ago",a:"Seven-a-side knockout. Each player registers on their own."},
 {n:"Street Food Fest",cat:"Food",em:"🍜",c:["#f59e0b","#ef4444"],d:.5,dur:6,cap:400,seed:352,v:"Central Lawn",o:"Hospitality Club",p:"2d ago",a:"Twenty stalls, live music and a dessert corner. Pay per plate."},
 {n:"Founders Fireside",cat:"Talks",em:"🎤",c:["#0ea5e9","#8b5cf6"],d:13,dur:2,cap:150,seed:88,v:"Seminar Hall 2",o:"E-Cell",p:"3d ago",a:"Three alumni founders share what they would do differently, then take questions."},
 {n:"AI Study Circle",cat:"Tech",em:"🧠",c:["#6366f1","#14b8a6"],d:-.02,dur:2,cap:40,seed:22,v:"Library Room 4",o:"AI Club",p:"3d ago",a:"A relaxed weekly session: one paper, one demo, plenty of questions."},
 {n:"Sunset Jam Session",cat:"Music",em:"🥁",c:["#ec4899","#f59e0b"],d:-2,dur:3,cap:50,seed:47,v:"Rooftop Terrace",o:"Music Society",p:"4d ago",a:"Bring an instrument or just listen. Beginners welcome."}
];
EV.forEach((e,i)=>{e.id=i;e.at=Date.now()+e.d*DAY});
const CATS=[["All","#e879f9",[0,102,255,255,126,60,24,0]],["Tech","#60a5fa",[0,126,66,66,66,126,255,0]],["Music","#f472b6",[24,28,26,24,24,120,120,0]],["Art","#facc15",[16,16,124,56,56,108,68,0]],["Sports","#4ade80",[60,126,219,255,219,126,60,0]],["Food","#fb923c",[0,126,126,126,60,24,24,126]],["Talks","#a78bfa",[126,255,255,255,126,24,12,0]]];
const fmt=t=>new Date(t).toLocaleString("en-IN",{weekday:"short",day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
const sty=e=>`--c1:${e.c[0]};--c2:${e.c[1]}`;
let cat="All",term="",stf="Any",op=null,pend=null;

/* poster images + colours pulled from the image itself (swap posterURL for real files later) */
const posterURL=e=>e.img||"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${e.c[0]}"/><stop offset=".55" stop-color="${e.c[1]}"/><stop offset="1" stop-color="#6d28d9"/></linearGradient><radialGradient id="gl" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="245" cy="40" r="56" fill="#fff" fill-opacity=".1"/><circle cx="38" cy="180" r="50" fill="#fff" fill-opacity=".08"/><ellipse cx="160" cy="112" rx="90" ry="30" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2" transform="rotate(-14 160 112)"/><circle cx="82" cy="130" r="3.5" fill="#fde047"/><circle cx="238" cy="92" r="3" fill="#fff"/><path d="M160 36 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" opacity=".8"/><path d="M172 152 l1.8 4.5 4.5 1.8-4.5 1.8-1.8 4.5-1.8-4.5-4.5-1.8 4.5-1.8z" fill="#fff" opacity=".85"/><text x="108" y="84" font-size="18" fill="#fff" fill-opacity=".85" font-family="sans-serif">♫</text><text x="220" y="132" font-size="17" fill="#fff" fill-opacity=".8" font-family="sans-serif">♬</text><ellipse cx="155" cy="158" rx="46" ry="7" fill="#000" fill-opacity=".28"/><circle cx="160" cy="105" r="60" fill="url(#gl)"/><text x="160" y="126" font-size="82" text-anchor="middle" style="filter:drop-shadow(0 10px 14px rgba(0,0,0,.35))">${e.em}</text></svg>`);
const img=e=>`<img src="${posterURL(e)}" alt="">`;
const COL={};
function colors(e){return COL[e.id]||(COL[e.id]=new Promise(r=>{const im=new Image();im.onload=()=>{try{const c=document.createElement("canvas");c.width=c.height=8;const x=c.getContext("2d");x.drawImage(im,0,0,8,8);const d=x.getImageData(0,0,8,8).data,A=[0,0,0,0],B=[0,0,0,0];for(let i=0;i<64;i++){const T=(i%8)+(i>>3)<8?A:B;for(let k=0;k<3;k++)T[k]+=d[i*4+k];T[3]++}r([A,B].map(T=>`rgb(${[0,1,2].map(k=>T[k]/T[3]|0)})`))}catch(_){r(e.c)}};im.onerror=()=>r(e.c);im.src=posterURL(e)}))}

/* status + trending */
const REG=()=>LS.g("regs",[]);
const regs=e=>e.seed+REG().filter(r=>r.event===e.id).length;
function status(e){const n=Date.now(),end=e.at+e.dur*HR,k=regs(e);
 if(n>end)return["Ended","end"];if(n>=e.at)return["Live now","live"];if(k>=e.cap)return["Full","full"];if(k>=e.cap*.85)return["Filling fast","fast"];if(e.at-n<DAY)return["Starting soon","soon"];return["Upcoming","up"]}
const grp=e=>{const s=status(e)[1];return s==="end"?"Ended":s==="live"?"Live now":"Upcoming"};
const score=e=>regs(e)/e.cap*100+(status(e)[1]==="live"?25:0)+(e.at-Date.now()<3*DAY?10:0);
function cd(e){const n=Date.now(),end=e.at+e.dur*HR;if(n>end)return"Event ended";let s=((n<e.at?e.at:end)-n)/1000|0;const d=s/86400|0;s%=86400;const h=s/3600|0;s%=3600;return(n<e.at?"Starts in ":"Ends in ")+`${d?d+"d ":""}${h}h ${s/60|0}m ${s%60}s`}

/* shared SVG icons & card template matching the pictured Open Mic Night card */
const ICONS={
  calBadge:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/></svg>`,
  calMeta:`<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="4" stroke="#818cf8" stroke-width="2"/><path d="M3 9.5h18" stroke="#818cf8" stroke-width="2"/><path d="M8 2.5v3M16 2.5v3" stroke="#a5b4fc" stroke-width="2" stroke-linecap="round"/><circle cx="8.5" cy="14" r="1.2" fill="#a5b4fc"/><circle cx="12" cy="14" r="1.2" fill="#a5b4fc"/><circle cx="15.5" cy="14" r="1.2" fill="#a5b4fc"/><circle cx="8.5" cy="17.5" r="1.2" fill="#a5b4fc"/></svg>`,
  pinMeta:`<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.8 7-11.5A7 7 0 0 0 5 9.5C5 15.2 12 21 12 21Z" fill="#ec4899" stroke="#f472b6" stroke-width="1.5"/><circle cx="12" cy="9.5" r="2.5" fill="#171122"/></svg>`,
  reg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  phone:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

function cardHTML(e,isModal=false){
  const [sl,sk]=status(e);
  const pillText=sk==="end"?"Ended":sk==="live"?"Live Event":sl==="Upcoming"?"Live Event":sl;
  const dis=sk==="end"||sk==="full";
  const regLabel=sk==="end"?"Ended":sk==="full"?"Full":"Register";
  const front=`
    <div class="evc-banner">
      ${img(e)}
      <span class="evc-pill">${ICONS.calBadge}<span>${pillText}</span></span>
      <button type="button" class="evc-flip-btn" data-flip aria-pressed="false">More details <span aria-hidden="true">↗</span></button>
    </div>
    <h3 class="evc-title">${esc(e.n)}</h3>
    <p class="evc-desc">${esc(e.a)}</p>
    <div class="evc-meta">
      <div class="evc-meta-item">${ICONS.calMeta}<span>${fmt(e.at)}</span></div>
      <div class="evc-div" aria-hidden="true"></div>
      <div class="evc-meta-item">${ICONS.pinMeta}<span>${esc(e.v)}</span></div>
    </div>
    <div class="evc-actions">
      <button type="button" class="evc-btn reg" data-a="reg"${dis?" disabled":""}>${ICONS.reg}<span>${regLabel}</span></button>
      <button type="button" class="evc-btn con" data-a="con">${ICONS.phone}<span>Contact</span></button>
      <button type="button" class="evc-btn cls" ${isModal?"data-close":'data-a="cls"'}>${ICONS.close}<span>Close</span></button>
    </div>`;
  const back=`
    <p class="story-kicker">A little more about this event</p>
    <h3 class="evc-title">${esc(e.n)}</h3>
    <p class="evc-back-copy">${esc(e.a)}</p>
    <div class="evc-details">
      <div class="evc-detail"><span>Hosted by</span><b>${esc(e.o)}</b></div>
      <div class="evc-detail"><span>Category</span><b>${esc(e.cat)}</b></div>
      <div class="evc-detail"><span>When</span><b>${fmt(e.at)}</b></div>
      <div class="evc-detail"><span>Where</span><b>${esc(e.v)}</b></div>
      <div class="evc-detail"><span>Duration</span><b>${e.dur} ${e.dur===1?"hour":"hours"}</b></div>
      <div class="evc-detail"><span>Spaces</span><b>${regs(e)} / ${e.cap} registered</b></div>
    </div>
    <div class="evc-actions">
      <button type="button" class="evc-btn con" data-flip-back>Back to event</button>
      <button type="button" class="evc-btn reg" data-a="reg"${dis?" disabled":""}>${regLabel}</button>
    </div>`;
  return `
    <div class="evc-flip-inner">
      <section class="evc-face evc-front" aria-hidden="false">${front}</section>
      <section class="evc-face evc-back" aria-label="More event details" aria-hidden="true" inert>${back}</section>
    </div>`;
}

/* theme */
const root=document.documentElement;root.dataset.theme=LS.g("theme","dark");
$("#theme").onclick=()=>{const t=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=t;LS.s("theme",t)};
const motionPreference=matchMedia("(prefers-reduced-motion: reduce)");
let motionEnabled=LS.g("motion",null);
if(motionEnabled===null)motionEnabled=!motionPreference.matches;
if(matchMedia("(hover: hover) and (pointer: fine)").matches){
 let cursorX=0,cursorY=0,targetX=0,targetY=0,frame=0,hasCursorPosition=false;
 const followCursor=()=>{
   cursorX+=(targetX-cursorX)*.18;
   cursorY+=(targetY-cursorY)*.18;
   root.style.setProperty("--cursor-x",`${cursorX}px`);
   root.style.setProperty("--cursor-y",`${cursorY}px`);
   if(Math.abs(targetX-cursorX)+Math.abs(targetY-cursorY)>.5)frame=requestAnimationFrame(followCursor);
   else frame=0;
 };
 window.addEventListener("pointermove",event=>{
   targetX=event.clientX;
   targetY=event.clientY;
   if(!hasCursorPosition){
     cursorX=targetX;
     cursorY=targetY;
     root.style.setProperty("--cursor-x",`${cursorX}px`);
     root.style.setProperty("--cursor-y",`${cursorY}px`);
     hasCursorPosition=true;
     return;
   }
   if(!frame)frame=requestAnimationFrame(followCursor);
 },{passive:true});
}
function playEntrance(elements,{x=0,y=18,scale=1,duration=.65,stagger=.07}={}){
  if(!motionEnabled||!window.Motion?.animate)return;
  elements.forEach((element,i)=>{
    const keyframes={opacity:[0,1],scale:[scale,1]};
    if(x)keyframes.x=[x,0];
    if(y)keyframes.y=[y,0];
    window.Motion.animate(element,keyframes,{duration,delay:i*stagger,ease:"easeOut"});
  });
}
root.dataset.motion=motionEnabled?"on":"off";
const matrixCanvas=$(".light-matrix");
if(matrixCanvas){
 const context=matrixCanvas.getContext("2d");
 const cellSize=16;
 let matrixWidth=0,matrixHeight=0,matrixFrame=0,matrixVisible=false,cols=0,rows=0,matrixPointer=null,matrixPointerTarget=null;
 const rgbFromHex=value=>{
   const match=value.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
   if(!match)return[225,58,165];
   const hex=match[1].length===3?[...match[1]].map(c=>c+c).join(""):match[1];
   return[0,2,4].map(index=>parseInt(hex.slice(index,index+2),16));
 };
 const matrixColors=()=>({
   pink:rgbFromHex(getComputedStyle(root).getPropertyValue("--ac")),
   orange:rgbFromHex(getComputedStyle(root).getPropertyValue("--warm")),
   yellow:rgbFromHex(getComputedStyle(root).getPropertyValue("--gold"))
 });
 const matrixStart=performance.now()/1000;
 const fireworks=Array.from({length:6},(_,i)=>({
   x:.08+Math.random()*.84,y:.18+Math.random()*.64,
   interval:3.2+Math.random()*2.2,phase:-matrixStart+i*.55+Math.random()*.15,
   radius:2.4+Math.random()*1.8,color:i%3
 }));
 const resizeMatrix=()=>{
   const bounds=matrixCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
   matrixWidth=bounds.width;
   matrixHeight=bounds.height;
   cols=Math.floor(matrixWidth/cellSize);
   rows=Math.floor(matrixHeight/cellSize);
   matrixCanvas.width=Math.round(matrixWidth*dpr);
   matrixCanvas.height=Math.round(matrixHeight*dpr);
   context.setTransform(dpr,0,0,dpr,0,0);
   drawMatrix(performance.now());
 };
 const drawMatrix=now=>{
   if(!matrixWidth||!matrixHeight)return;
   const insetX=(matrixWidth-cols*cellSize)/2+cellSize/2;
   const insetY=(matrixHeight-rows*cellSize)/2+cellSize/2;
   const colors=matrixColors(),time=now/1000;
   context.clearRect(0,0,matrixWidth,matrixHeight);
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
     const x=insetX+col*cellSize,y=insetY+row*cellSize;
     const dx=matrixPointer?x-matrixPointer.x:0,dy=matrixPointer?y-matrixPointer.y:0;
     const distance=matrixPointer?Math.hypot(dx,dy):Infinity;
     const influence=matrixPointer?Math.exp(-distance/175):0;
     const ripple=matrixPointer?Math.sin(distance*.075-time*4.2)*influence*6:0;
     const dotX=x+(distance>0?dx/distance*ripple:0);
     const dotY=y+(distance>0?dy/distance*ripple:0);
     const glow=influence;
     context.beginPath();
     context.arc(dotX,dotY,1.35+glow*.8,0,Math.PI*2);
     context.fillStyle=`rgba(255,255,255,${.1+glow*.32})`;
     if(glow>.02){
       const color=x<matrixPointer.x?colors.pink:colors.orange;
       context.shadowColor=`rgba(${color.join(",")},${glow*.7})`;
       context.shadowBlur=12*glow;
     }
     context.fill();
     context.shadowBlur=0;
   }
   const lightDot=(col,row,color,intensity=1)=>{
     if(col<0||col>=cols||row<0||row>=rows)return;
     const baseX=insetX+col*cellSize,baseY=insetY+row*cellSize;
     const dx=matrixPointer?baseX-matrixPointer.x:0,dy=matrixPointer?baseY-matrixPointer.y:0;
     const distance=matrixPointer?Math.hypot(dx,dy):Infinity;
     const influence=matrixPointer?Math.exp(-distance/175):0;
     const ripple=matrixPointer?Math.sin(distance*.075-time*4.2)*influence*6:0;
     const x=baseX+(distance>0?dx/distance*ripple:0),y=baseY+(distance>0?dy/distance*ripple:0);
     context.beginPath();
     context.arc(x,y,2.1,0,Math.PI*2);
     context.fillStyle=`rgba(${color.join(",")},${Math.min(1,intensity)})`;
     context.shadowColor=`rgba(${color.join(",")},${Math.min(.9,intensity*.85)})`;
     context.shadowBlur=10*intensity;
     context.fill();
     context.shadowBlur=0;
   };
   const sparkColors=[colors.pink,colors.orange,colors.yellow];
   fireworks.forEach((firework,index)=>{
     if(!motionEnabled&&index>1)return;
     const burstAge=motionEnabled?((time+firework.phase)%firework.interval):.36;
     const duration=1.05;
     if(motionEnabled&&burstAge>duration)return;
     const progress=motionEnabled?burstAge/duration:.72;
     const fade=motionEnabled?Math.max(0,1-progress):.3;
     const centerCol=Math.round(firework.x*Math.max(0,cols-1));
     const centerRow=Math.round(firework.y*Math.max(0,rows-1));
     const color=sparkColors[firework.color];
     for(let ray=0;ray<16;ray++){
       const angle=ray*Math.PI/8+index*.17;
       for(let step=1;step<=4;step++){
         const distance=step*firework.radius*progress;
         const col=Math.round(centerCol+Math.cos(angle)*distance);
         const row=Math.round(centerRow+Math.sin(angle)*distance*.66);
         lightDot(col,row,color,fade*(step===4?.68:1));
       }
     }
     lightDot(centerCol,centerRow,colors.yellow,fade);
   });
 };
 const animateMatrix=now=>{
   matrixFrame=0;
   if(!matrixVisible||document.hidden||(!motionEnabled&&!matrixPointerTarget))return;
   if(matrixPointerTarget){
     if(!matrixPointer)matrixPointer={...matrixPointerTarget};
     else{
       matrixPointer.x+=(matrixPointerTarget.x-matrixPointer.x)*.2;
       matrixPointer.y+=(matrixPointerTarget.y-matrixPointer.y)*.2;
     }
   }
   drawMatrix(now);
   if(motionEnabled||matrixPointerTarget)matrixFrame=requestAnimationFrame(animateMatrix);
 };
 const updateMatrixAnimation=()=>{
   if(matrixVisible&&!document.hidden&&(motionEnabled||matrixPointerTarget)&&!matrixFrame)matrixFrame=requestAnimationFrame(animateMatrix);
   else if((!matrixVisible||document.hidden||(!motionEnabled&&!matrixPointerTarget))&&matrixFrame){
     cancelAnimationFrame(matrixFrame);
     matrixFrame=0;
     drawMatrix(performance.now());
   }
 };
 new ResizeObserver(resizeMatrix).observe(matrixCanvas);
 if("IntersectionObserver"in window){
   new IntersectionObserver(entries=>{
     matrixVisible=entries.some(entry=>entry.isIntersecting);
     updateMatrixAnimation();
   }).observe(matrixCanvas);
 }
 document.addEventListener("visibilitychange",updateMatrixAnimation);
 if(matchMedia("(hover: hover) and (pointer: fine)").matches){
   const footer=$(".site-footer");
   footer.addEventListener("pointermove",event=>{
     const bounds=matrixCanvas.getBoundingClientRect();
     matrixPointerTarget={x:event.clientX-bounds.left,y:event.clientY-bounds.top};
     updateMatrixAnimation();
   },{passive:true});
   footer.addEventListener("pointerleave",()=>{
     matrixPointerTarget=null;
     matrixPointer=null;
     if(!motionEnabled&&matrixFrame){
       cancelAnimationFrame(matrixFrame);
       matrixFrame=0;
     }
     drawMatrix(performance.now());
   },{passive:true});
 }
 resizeMatrix();
}
playEntrance($$(".hero-in"),{y:24,duration:.85,stagger:0});
playEntrance($$(".cat"),{y:0,scale:.96,duration:.6,stagger:.06});

/* overlays + toast */
function openOv(id){closeAll();$(id).classList.add("open");document.body.style.overflow="hidden"}
function closeAll(){$$(".ov").forEach(o=>o.classList.remove("open"));document.body.style.overflow=""}
const sheet=(html,e)=>{const b=$("#box");b.style.cssText=e?sty(e):"";b.innerHTML=`<button class="ibtn x" data-close aria-label="Close">✕</button>`+html;openOv("#ovBox");return b};
$$(".ov").forEach(o=>o.addEventListener("click",ev=>{if(ev.target===o||ev.target.closest("[data-close]"))closeAll()}));
addEventListener("keydown",ev=>{if(ev.key==="Escape")closeAll()});
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),2200)}

/* hero floating cards */
const POS=[[4,5],[40,2],[74,6],[2,32,1],[82,36,1],[4,72],[40,82],[74,70]];
function typeIt(el,s){clearInterval(el._t);el.textContent="";let i=0;el._t=setInterval(()=>{el.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(el._t)},18)}
POS.forEach(([x,y,dk],i)=>{
  const e=EV[i],f=document.createElement("button");
  const phase=i*1.73,driftX=11+(i%3)*2.5,driftY=13+(i%4)*2;
  const drift=Array.from({length:8},(_,step)=>{
    const angle=phase+step*Math.PI/4;
    return`--fx${step}:${(Math.cos(angle)*driftX).toFixed(1)}px;--fy${step}:${(Math.sin(angle)*driftY).toFixed(1)}px`;
  }).join(";");
  f.className="fc"+(dk?" dk":"");f.style.cssText=`left:${x}%;top:${y}%;--r:${(i%2?1:-1)*(4+i%3*2)}deg;--fd:${11+(i%4)*2}s;--dl:${-i*1.3}s;${drift};${sty(e)}`;
  f.innerHTML=`<div class="poster">${img(e)}<div class="fx"></div></div>`;
  const fx=f.querySelector(".fx"),txt=`${e.n}\n${fmt(e.at)}\n${e.v}`;
  f.setAttribute("aria-label",e.n);
  f.onmouseenter=()=>{f.classList.add("on");typeIt(fx,txt)};
  f.onmouseleave=()=>{f.classList.remove("on");clearInterval(fx._t);fx.textContent=""};
  f.onfocus=()=>{f.classList.add("on");typeIt(fx,txt)};
  f.onblur=()=>{f.classList.remove("on");clearInterval(fx._t);fx.textContent=""};
  f.onclick=()=>openCard(e,f);
  $("#top").append(f);
});

/* reveal the alternating story cards as they enter the viewport */
const storyCards=$$(".story-card[data-reveal]");
let stopStoryReveal=[];
const storyList=$(".story-list");
let storyThreadPath,storyThreadGlow,storyThreadTip,storyThreadLength=0;
function ensureStoryThread(){
  if(!storyList||storyThreadPath)return;
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.classList.add("story-thread");
  svg.setAttribute("aria-hidden","true");
  svg.setAttribute("preserveAspectRatio","none");
  svg.innerHTML=`<defs><linearGradient id="storyGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e13aa5"/><stop offset=".55" stop-color="#ff7a1a"/><stop offset="1" stop-color="#f2b51b"/></linearGradient></defs><path class="story-thread-base"></path><path class="story-thread-progress"></path><circle class="story-thread-tip" r="4"></circle>`;
  storyList.prepend(svg);
  storyThreadPath=svg.querySelector(".story-thread-base");
  storyThreadGlow=svg.querySelector(".story-thread-progress");
  storyThreadTip=svg.querySelector(".story-thread-tip");
}
function updateStoryThread(rebuild=false){
  ensureStoryThread();
  if(!storyThreadPath)return;
  const width=storyList.clientWidth,height=storyList.scrollHeight;
  if(!width||!height)return;
  if(rebuild||!storyThreadLength){
    const points=storyCards.map(card=>{
      const side=card.dataset.side;
      return{x:side==="left"?card.offsetLeft+card.offsetWidth-18:card.offsetLeft+18,y:card.offsetTop+card.offsetHeight/2};
    });
    if(!points.length)return;
    let d=`M ${points[0].x} ${points[0].y}`;
    for(let i=1;i<points.length;i++){
      const from=points[i-1],to=points[i],midY=(from.y+to.y)/2;
      d+=` C ${width/2} ${midY}, ${width/2} ${midY}, ${to.x} ${to.y}`;
    }
    storyThreadPath.setAttribute("d",d);
    storyThreadGlow.setAttribute("d",d);
    storyThreadLength=storyThreadPath.getTotalLength();
  }
  const listRect=storyList.getBoundingClientRect();
  const sectionProgress=Math.max(0,Math.min(1,(innerHeight-listRect.top)/(innerHeight+listRect.height)));
  storyThreadGlow.style.strokeDasharray=String(storyThreadLength);
  storyThreadGlow.style.strokeDashoffset=String(storyThreadLength*(1-sectionProgress));
  const point=storyThreadPath.getPointAtLength(storyThreadLength*sectionProgress);
  storyThreadTip.setAttribute("cx",String(point.x));
  storyThreadTip.setAttribute("cy",String(point.y));
}
function setupStoryReveal(){
  stopStoryReveal.forEach(stop=>stop());
  stopStoryReveal=[];
  ensureStoryThread();
  storyCards.forEach((card,i)=>{
    card.dataset.side=i%2?"right":"left";
    card.classList.remove("is-visible");
  });
  updateStoryThread(true);
  if(!motionEnabled||!("IntersectionObserver"in window)){
    root.classList.remove("story-ready");
    storyCards.forEach(card=>card.classList.add("is-visible"));
    return;
  }
  root.classList.add("story-ready");
  const revealVisibleCards=()=>{
    storyCards.forEach(card=>{
      if(card.classList.contains("is-visible"))return;
      const bounds=card.getBoundingClientRect();
      const cardCenter=(bounds.top+bounds.bottom)/2;
      if(cardCenter<innerHeight*.8&&bounds.bottom>0)card.classList.add("is-visible");
    });
    updateStoryThread();
  };
  const scheduleResize=()=>{
    storyThreadLength=0;
    revealVisibleCards();
  };
  window.addEventListener("scroll",revealVisibleCards,{passive:true});
  window.addEventListener("resize",scheduleResize);
  stopStoryReveal.push(()=>{
    window.removeEventListener("scroll",revealVisibleCards);
    window.removeEventListener("resize",scheduleResize);
  });
  revealVisibleCards();
}
setupStoryReveal();

/* modal event card (pictured style, pops out from clicked stack/element) */
let cur;
function openCard(e,srcEl){
  cur=e;
  const m=$("#cardModal");
  m.style.cssText=sty(e);
  m.classList.remove("is-flipped");
  m.innerHTML=cardHTML(e,true);
  m.querySelectorAll('[data-a="reg"]').forEach(button=>button.onclick=()=>openReg(e));
  m.querySelectorAll('[data-a="con"]').forEach(button=>button.onclick=()=>toast("Contact "+e.o));
  m.querySelectorAll("[data-flip]").forEach(button=>button.onclick=()=>{
    m.classList.add("is-flipped");
    m.querySelector(".evc-front").inert=true;
    m.querySelector(".evc-front").setAttribute("aria-hidden","true");
    m.querySelector(".evc-back").inert=false;
    m.querySelector(".evc-back").setAttribute("aria-hidden","false");
    m.querySelectorAll("[data-flip]").forEach(control=>control.setAttribute("aria-pressed","true"));
  });
  m.querySelectorAll("[data-flip-back]").forEach(button=>button.onclick=()=>{
    m.classList.remove("is-flipped");
    m.querySelector(".evc-front").inert=false;
    m.querySelector(".evc-front").setAttribute("aria-hidden","false");
    m.querySelector(".evc-back").inert=true;
    m.querySelector(".evc-back").setAttribute("aria-hidden","true");
    m.querySelectorAll("[data-flip]").forEach(control=>control.setAttribute("aria-pressed","false"));
  });
  const sr=srcEl&&srcEl.getBoundingClientRect?srcEl.getBoundingClientRect():null;
  openOv("#ovCard");
  if(sr&&motionEnabled){
    const mr=m.getBoundingClientRect();
    const dx=(sr.left+sr.width/2)-(mr.left+mr.width/2);
    const dy=(sr.top+sr.height/2)-(mr.top+mr.height/2);
    if(m.animate){
      m.animate([
        {transform:`translate(${dx}px, ${dy}px) scale(0.38)`,opacity:0},
        {transform:"translate(0px, 0px) scale(1)",opacity:1}
      ],{duration:360,easing:"cubic-bezier(0.16, 1, 0.3, 1)"});
    }else{
      m.style.setProperty("--ox",dx+"px");
      m.style.setProperty("--oy",dy+"px");
    }
  }
}

/* categories (landing) */
CATS.forEach(([name,k,bits])=>{
  const a=document.createElement("a");a.className="cat";a.href="#c-"+name.toLowerCase();a.dataset.cat=name;a.style.setProperty("--k",k);
  let px="";bits.forEach(r=>{for(let c=0;c<8;c++)px+=`<i class="${r>>(7-c)&1?"o":""}"></i>`});
  const n=name==="All"?EV.length:EV.filter(e=>e.cat===name).length;
  a.innerHTML=`<div class="px">${px}</div><div><b>${name==="All"?"All events":name}</b><br><small>${n} events</small></div>`;
  a.onclick=ev=>{ev.preventDefault();openCat(name)};
  $("#catGrid").append(a);
});
const io=new IntersectionObserver((en,ob)=>en.forEach(x=>{if(x.isIntersecting&&matchMedia("(hover:none)").matches){x.target.classList.add("seen");ob.unobserve(x.target)}}),{threshold:.6});
$$(".cat").forEach(c=>io.observe(c));

/* events view */
CATS.forEach(([n])=>{
  const a=document.createElement("a");a.className="chip cc";a.href="#c-"+n.toLowerCase();a.dataset.cat=n;a.textContent=n;
  a.onclick=ev=>{ev.preventDefault();openCat(n)};
  $("#catChips").append(a);
});
["Any","Live now","Upcoming","Ended"].forEach(s=>{const b=document.createElement("button");b.className="chip sc";b.dataset.st=s;b.textContent=s==="Any"?"Any status":s;b.onclick=()=>{stf=s;render()};$("#stChips").append(b)});
$("#q").oninput=ev=>{term=ev.target.value.trim().toLowerCase();render()};

function render(){
  $$(".cc").forEach(b=>b.classList.toggle("act",b.dataset.cat===cat));
  $$(".sc").forEach(b=>b.classList.toggle("act",b.dataset.st===stf));
  $("#evTitle").textContent=cat==="All"?"All events":cat+" events";
  const base=EV.filter(e=>cat==="All"||e.cat===cat);
  const L=base.filter(e=>(stf==="Any"||grp(e)===stf)&&(e.n+e.v).toLowerCase().includes(term));
  const T=!term&&stf==="Any"?base.filter(e=>grp(e)!=="Ended").sort((a,b)=>score(b)-score(a)).slice(0,4):[];
  $("#trend").innerHTML=T.length?`<h3 class="th">Trending now</h3><div class="tr">${T.map((e,i)=>`<button class="tt" data-i="${e.id}"><b>${i+1}</b><span>${esc(e.n)}<small>${regs(e)} registered</small></span></button>`).join("")}</div>`:"";
  $$(".tt").forEach(b=>b.onclick=()=>openCard(EV[+b.dataset.i],b));
  const list=$("#list");
  if(!L.length){list.innerHTML=`<p class="empty">No events match. Try another word, category or status.</p>`;return}
  list.innerHTML=L.map((e,i)=>{const[sl,sk]=status(e);
   return`<article class="stack" data-i="${e.id}" role="button" tabindex="0" aria-haspopup="dialog" style="${sty(e)};--i:${i}">
   <div class="top"><div class="poster">${img(e)}</div><div class="mt"><h3>${esc(e.n)}</h3><p>Posted ${e.p} · ${e.v}</p></div><div class="tags"><span class="badge">${e.cat}</span><span class="st ${sk}">${sl}</span></div></div>
   </article>`}).join("");
  $$(".stack").forEach(wire);
  $$(".stack").forEach(s=>colors(EV[+s.dataset.i]).then(([a,b])=>{s.style.setProperty("--g1",a);s.style.setProperty("--g2",b)}));
}
/* clicking or pressing Enter/Space on any event stack pops up the Event Card modal from that stack */
function wire(s){
  const id=+s.dataset.i,e=EV[id];
  s.onclick=()=>openCard(e,s);
  s.onkeydown=ev=>{if(ev.target===s&&(ev.key==="Enter"||ev.key===" ")){ev.preventDefault();openCard(e,s)}};
}

/* navigation & router: works both via hashchange and direct clicks in sandboxed iframes */
function openCat(name){
  cat=(CATS.find(c=>c[0].toLowerCase()===String(name).toLowerCase())||["All"])[0];
  $("#land").hidden=true;
  $("#evw").hidden=false;
  op=null;stf="Any";term="";$("#q").value="";
  try{history.replaceState(null,"","#c-"+cat.toLowerCase())}catch(_){}
  render();
  scrollTo(0,0);
}
function goHome(scrollTarget){
  $("#land").hidden=false;
  $("#evw").hidden=true;
  try{history.replaceState(null,"",scrollTarget?"#"+scrollTarget:"#home")}catch(_){}
  if(scrollTarget){const el=document.getElementById(scrollTarget);if(el)el.scrollIntoView({behavior:"smooth"})}
  else scrollTo(0,0);
}
document.addEventListener("click",ev=>{
  const a=ev.target.closest("a[href^='#']");
  if(!a)return;
  const h=a.getAttribute("href").slice(1);
  if(h==="home"){ev.preventDefault();goHome()}
  else if(h==="cats"){ev.preventDefault();goHome("cats")}
  else if(/^c-(.+)$/.test(h)){ev.preventDefault();openCat(h.slice(2))}
});
function route(){
  const h=location.hash.slice(1),m=/^c-(.+)$/.exec(h);
  if(m)openCat(m[1]);
  else goHome(h==="cats"?"cats":null);
}
addEventListener("hashchange",route);

/* auth (demo only: data lives in this browser; a real site needs a backend such as Firebase or Supabase) */
async function H(s){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(_){return btoa(s)}}
const ME=()=>LS.g("users",[]).find(u=>u.email===LS.g("sess",""));
const V={name:s=>/^[A-Za-z][A-Za-z .'’-]{1,}$/.test(s)?"":"Enter your full name using letters only.",email:s=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)?"":"Enter a valid email, like name@college.edu.",phone:s=>/^(\+91)?[6-9]\d{9}$/.test(s)?"":"Enter a 10-digit mobile number starting with 6 to 9.",pass:s=>/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(s)?"":"Use 8 or more characters with a letter and a number."};
const fld=(id,l,t="text",x="")=>`<label>${l}<input id="${id}" type="${t}" ${x}><span class="err" data-for="${id}"></span></label>`;
function mark(i,m){i.classList.toggle("bad",!!m);const s=document.querySelector(`.err[data-for="${i.id}"]`);if(s)s.textContent=m}
const live=f=>f.querySelectorAll("input,select").forEach(i=>i.addEventListener("input",()=>mark(i,"")));
function updNav(){const u=ME(),b=$("#auth");b.className=u?"ibtn nav-auth":"btn sm nav-auth";b.textContent=u?u.name[0].toUpperCase():"Log in";b.setAttribute("aria-label",u?"Account":"Log in")}
$("#auth").onclick=()=>ME()?openAcct():openAuth("login");
function openAuth(mode,msg=""){
  const up=mode==="signup",b=sheet(`<h2>${up?"Create account":"Welcome back"}</h2><p class="sub" style="margin:0">${msg||(up?"Sign up to register for events.":"Log in to register and see your events.")}</p>
  <div class="tabs"><button class="chip ${up?"":"act"}" data-m="login">Log in</button><button class="chip ${up?"act":""}" data-m="signup">Sign up</button></div>
  <form id="af" novalidate>${up?fld("an","Full name","text",'autocomplete="name"'):""}${fld("ae","Email","email",'autocomplete="email"')}${fld("ap","Password","password",`autocomplete="${up?"new":"current"}-password"`)}<button class="btn" type="submit">${up?"Create account":"Log in"}</button></form>`);
  b.querySelectorAll("[data-m]").forEach(t=>t.onclick=()=>openAuth(t.dataset.m,msg));
  const f=$("#af");live(f);
  f.onsubmit=async ev=>{ev.preventDefault();
    const nm=up?$("#an").value.trim():"",em=$("#ae").value.trim().toLowerCase(),pw=$("#ap").value;
    const R={ae:V.email(em),ap:up?V.pass(pw):(pw?"":"Enter your password.")};if(up)R.an=V.name(nm);
    Object.entries(R).forEach(([k,m])=>mark($("#"+k),m));if(Object.values(R).some(Boolean))return;
    const users=LS.g("users",[]),h=await H(em+pw);
    if(up){if(users.some(u=>u.email===em))return mark($("#ae"),"An account with this email already exists. Log in instead.");users.push({name:nm,email:em,h});LS.s("users",users)}
    else if(!users.some(u=>u.email===em&&u.h===h))return mark($("#ap"),"Email or password is incorrect.");
    LS.s("sess",em);updNav();closeAll();toast("Welcome, "+(ME().name.split(" ")[0]));
    if(pend){const p=pend;pend=null;p()}};
}
function openAcct(){
  const u=ME(),mine=REG().filter(r=>r.email===u.email);
  const b=sheet(`<h2>${esc(u.name)}</h2><p class="sub" style="margin:0">${esc(u.email)}</p><h3 class="th">My registrations</h3>
  ${mine.length?mine.map(r=>`<div class="reg"><span>${esc(EV[r.event].n)}<br><small style="color:var(--mut)">${status(EV[r.event])[0]} · ${fmt(EV[r.event].at)}</small></span><button data-c="${r.at}">Cancel</button></div>`).join(""):`<p class="empty">Nothing yet. Open an event and tap Register.</p>`}
  <div class="acts"><button class="btn alt" id="lo">Log out</button></div>`);
  b.querySelectorAll("[data-c]").forEach(c=>c.onclick=()=>{LS.s("regs",REG().filter(r=>String(r.at)!==c.dataset.c));toast("Registration cancelled");openAcct();render()});
  $("#lo").onclick=()=>{LS.s("sess","");updNav();closeAll();toast("Logged out")};
}

/* registration (needs login) */
function openReg(e){
  const u=ME();
  if(!u){pend=()=>openReg(e);return openAuth("login","Log in to register for "+e.n+".")}
  if(["end","full"].includes(status(e)[1]))return toast("Registration is closed for this event.");
  const open=EV.filter(x=>!["end","full"].includes(status(x)[1]));
  const b=sheet(`<h2>Register</h2><p class="sub" style="margin:4px 0 0">Takes under a minute.</p><form id="rf" novalidate>
  ${fld("fn","Full name","text",`autocomplete="name" value="${esc(u.name)}"`)}${fld("fe","Email","email",`autocomplete="email" value="${esc(u.email)}"`)}${fld("fp","Phone","tel",'autocomplete="tel" placeholder="10-digit mobile number"')}
  <label>Event<select id="fv">${open.map(x=>`<option value="${x.id}"${x.id===e.id?" selected":""}>${esc(x.n)}</option>`).join("")}</select><span class="err" data-for="fv"></span></label>
  <button class="btn" type="submit">Confirm registration</button></form>`,e);
  const f=$("#rf");live(f);
  f.onsubmit=ev=>{ev.preventDefault();
    const name=$("#fn").value.trim(),mail=$("#fe").value.trim().toLowerCase(),ph=$("#fp").value.replace(/[\s-]/g,""),id=+$("#fv").value;
    const R={fn:V.name(name),fe:V.email(mail),fp:V.phone(ph),fv:isNaN(id)?"Choose an event.":""};
    Object.entries(R).forEach(([k,m])=>mark($("#"+k),m));if(Object.values(R).some(Boolean))return;
    const all=REG();
    if(all.some(r=>r.email===mail&&r.event===id))return mark($("#fe"),"This email is already registered for that event.");
    all.push({name,email:mail,phone:ph,event:id,at:Date.now()});LS.s("regs",all);
    b.innerHTML=`<div class="ok"><div class="tick">🎉</div><h2>You are in, ${esc(name.split(" ")[0])}!</h2><p>Your spot for <b>${esc(EV[id].n)}</b> is saved. Find it under your account.</p><button class="btn" data-close>Done</button></div>`;
    render();
  };
}

updNav();route();
