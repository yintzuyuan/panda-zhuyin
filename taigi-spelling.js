/* #1054 方音符號拼寫規則頁——互動引擎
   T3：跟著打（鍵盤渲染 + 播放器 + buffer）
   T4：聲調五度圖 + 摺疊
   讀取資料層 window.TAIGI_SPELLING（taigi-spelling-data.js） */
(function () {
  'use strict';
  const { KB, EXAMPLES } = window.TAIGI_SPELLING;
  const $ = id => document.getElementById(id);

  /* ═══ 五邊形花瓣（照抄 anim-engine.js pentagonPath：5 點、相鄰邊 clamp、quad 圓角）═══ */
  const PENTA = {
    up:    (w,h)=>[[w/2,h],[w,3*h/4],[w,0],[0,0],[0,3*h/4]],
    down:  (w,h)=>[[w/2,0],[0,h/4],[0,h],[w,h],[w,h/4]],
    left:  (w,h)=>[[0,0],[3*w/4,0],[w,h/2],[3*w/4,h],[0,h]],
    right: (w,h)=>[[w/4,0],[0,h/2],[w/4,h],[w,h],[w,0]],
  };
  function pentagonPath(dir,w,h,r){
    const P=PENTA[dir](w,h);
    r=r==null?8:r;
    const f=x=>x.toFixed(2);
    let d="";
    for(let i=0;i<5;i++){
      const c=P[i],n=P[(i+1)%5],p=P[(i+4)%5];
      const pv=[c[0]-p[0],c[1]-p[1]],nv=[n[0]-c[0],n[1]-c[1]];
      const pl=Math.hypot(pv[0],pv[1]),nl=Math.hypot(nv[0],nv[1]);
      const rr=Math.min(r,Math.min(pl,nl)/2);
      const s=[c[0]-pv[0]/pl*rr,c[1]-pv[1]/pl*rr];
      const e=[c[0]+nv[0]/nl*rr,c[1]+nv[1]/nl*rr];
      d+=(i===0?"M":"L")+f(s[0])+" "+f(s[1])+" Q"+f(c[0])+" "+f(c[1])+" "+f(e[0])+" "+f(e[1])+" ";
    }
    return d+"Z";
  }

  /* ═══ 鍵盤渲染 ═══ */
  const kb=$("kb"), stage=$("stage"), finger=$("finger"), ripple=$("ripple"), bubble=$("bubble"), picker=$("picker");
  const keyEls={};
  KB.forEach(row=>row.forEach(k=>{
    const el=document.createElement("div");
    el.className="key"+(k.cells?" strip":""); el.dataset.id=k.id;
    if(k.cells){
      const cells=document.createElement("div"); cells.className="cells";
      k.cells.forEach((c,ci)=>{
        const cell=document.createElement("div"); cell.className="cell"; cell.dataset.idx=ci;
        cell.innerHTML=
          (c.up?'<i class="dot up"></i>':"")+
          (c.down?'<i class="dot down"></i>':"")+
          `<span class="face"><span class="base">${c.s}</span><span class="variant"></span></span>`;
        cells.appendChild(cell);
      });
      el.appendChild(cells);
    } else {
      let html=`<span class="main">${k.m}</span>`;
      if(k.hints) html+=`<span class="hints">`+k.hints.map(h=>`<span class="kh ${k.hc}" data-h="${h}">${h}</span>`).join("")+`</span>`;
      if(k.sub) html+=`<span class="sub">${k.sub}</span>`;
      el.innerHTML=html;
    }
    kb.appendChild(el); keyEls[k.id]=el;
  }));

  /* ═══ 字選單 ═══ */
  EXAMPLES.forEach((ex,i)=>{
    const b=document.createElement("button");
    b.className="chip"+(i?"":" active"); b.setAttribute("role","tab");
    b.innerHTML=ex.zh+`<span class="tag">${ex.tag}</span>`;
    b.onclick=()=>select(i); picker.appendChild(b);
  });

  /* ═══ 動畫原語 ═══ */
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function rectIn(el){ const s=stage.getBoundingClientRect(), r=el.getBoundingClientRect(); return {x:r.left-s.left, y:r.top-s.top, w:r.width, h:r.height, cx:r.left-s.left+r.width/2, cy:r.top-s.top+r.height/2}; }
  function targetEl(st){
    const key=keyEls[st.key];
    if(st.cell!=null) return key.querySelector(`.cell[data-idx="${st.cell}"]`);
    return key;
  }
  async function moveFinger(el){ const c=rectIn(el); finger.style.opacity=1; finger.style.left=c.cx+"px"; finger.style.top=c.cy+"px"; await sleep(420); }
  function fireRipple(x,y){ ripple.style.left=x+"px"; ripple.style.top=y+"px"; ripple.classList.remove("go"); void ripple.offsetWidth; ripple.classList.add("go"); }

  /* 泡泡：光譜色填色五邊形（尖端朝下貼目標上緣），照 keyboard.css .bubble */
  const BW=64, BH=62;
  bubble.style.clipPath="path('"+pentagonPath("up",BW,BH,7)+"')";
  function showBubble(anchor, sym, role){
    const c=rectIn(anchor);
    bubble.className="bubble bb-"+(role||"final");
    bubble.textContent=sym;
    bubble.style.left=c.cx+"px";
    bubble.style.top=(c.y-2)+"px";
    bubble.style.transform="translate(-50%,-100%) scale(.75)";
    void bubble.offsetWidth;
    bubble.classList.add("show");
    bubble.style.transform="translate(-50%,-100%) scale(1)";
  }
  function hideBubble(){ bubble.classList.remove("show"); }

  /* 底排提示點亮（照 keyboard.css .kh.lit） */
  function litHint(key, sym, on){
    const h=key.querySelector(`.kh[data-h="${sym}"]`);
    if(h) h.classList.toggle("lit", on);
  }
  function clearHints(){ document.querySelectorAll(".kh.lit").forEach(h=>h.classList.remove("lit")); }

  /* 韻母格 morph（對齊 VowelSliderView cellContent） */
  function cellMorph(cell, variant, dirUp){
    const base=cell.querySelector(".base"), vv=cell.querySelector(".variant");
    const slide=dirUp?-14:14;
    vv.textContent=variant;
    vv.style.transform=`translateY(${-slide}px)`; vv.style.opacity=0;
    void vv.offsetWidth;
    cell.classList.add("variant-showing");
    base.style.transform=`translateY(${slide}px)`; base.style.opacity=0;
    vv.style.transform="translateY(0)"; vv.style.opacity=1;
  }
  function cellReset(cell){
    cell.classList.remove("variant-showing");
    const base=cell.querySelector(".base"), vv=cell.querySelector(".variant");
    base.style.transform=""; base.style.opacity=1;
    vv.style.opacity=0; vv.style.transform="";
  }

  /* ═══ buffer（逐符號 span＋角色染色）═══ */
  const twVal=$("twVal"), caret=$("caret");
  let bufItems=[];
  const TONE_MARKS=new Set(["ˊ","ˋ","˪","˫","˙"]);
  function renderBuf(){
    twVal.querySelectorAll(".bch,.commit").forEach(e=>e.remove());
    bufItems.forEach(it=>{
      const sp=document.createElement("span");
      sp.className="bch r-"+it.r+(TONE_MARKS.has(it.ch)?" tone-mark":"")+(it.morph?" morph":"");
      sp.textContent=it.ch;
      twVal.insertBefore(sp,caret);
      delete it.morph;
    });
  }
  function bufAppend(ch,r){ bufItems.push({ch,r}); renderBuf(); }
  function bufMorphLast(ch,r){ bufItems[bufItems.length-1]={ch,r,morph:true}; renderBuf(); }
  function bufCommit(hanzi){
    bufItems=[]; twVal.querySelectorAll(".bch,.commit").forEach(e=>e.remove());
    caret.style.display="none";
    const sp=document.createElement("span"); sp.className="commit"; sp.textContent=hanzi;
    twVal.insertBefore(sp,caret);
  }

  /* ═══ 播放器 ═══ */
  let cur=0, token=0;
  function select(i){ cur=i; document.querySelectorAll(".chip").forEach((c,j)=>{c.classList.toggle("active",j===i);c.setAttribute("aria-selected",j===i);}); play(); }

  function renderZh(ex){
    const el=$("zhVal"); el.innerHTML="";
    ex.zhVal.forEach(([ch,t])=>{
      const sp=document.createElement("span");
      if(t==="t") sp.className="bch tone-mark";
      sp.textContent=ch; el.appendChild(sp);
    });
    $("zhNote").textContent=ex.zhNote;
  }

  async function play(){
    const my=++token; const ex=EXAMPLES[cur];
    // reset
    Object.values(keyEls).forEach(e=>e.querySelectorAll(".cell").forEach(cellReset));
    clearHints(); hideBubble();
    finger.style.opacity=0; finger.classList.remove("press");
    bufItems=[]; renderBuf(); caret.style.display="inline-block";
    renderZh(ex); $("twRoma").textContent=ex.twRoma;
    $("rule").classList.remove("show"); $("stepLabel").textContent="";
    await sleep(430); if(my!==token) return;

    for(const st of ex.steps){
      if(my!==token) return;
      $("stepLabel").innerHTML=st.label;

      if(st.commit){
        finger.style.opacity=0; hideBubble();
        bufCommit(st.commit);
        $("ruleText").innerHTML=st.rule; $("rule").classList.add("show");
        continue;
      }

      const key=keyEls[st.key];
      const tgt=targetEl(st);
      await moveFinger(tgt); if(my!==token) return;

      if(st.cycle){
        /* KT 連點循環：每點一下 buffer 末字換部位 */
        for(let ci=0; ci<st.cycle.length; ci++){
          if(my!==token) return;
          const c=rectIn(tgt);
          finger.classList.add("press");
          fireRipple(c.cx,c.cy);
          showBubble(key, st.cycle[ci], st.r);
          if(ci===0) bufAppend(st.cycle[0], st.r); else bufMorphLast(st.cycle[ci], st.r);
          await sleep(150); finger.classList.remove("press");
          await sleep(230);
        }
        hideBubble();
        await sleep(320);
        continue;
      }

      const c=rectIn(tgt);
      finger.classList.add("press");
      fireRipple(c.cx,c.cy);

      if(st.pull){
        /* 韻母格按住 → 泡泡出 base → 拉 → 格面 morph＋泡泡換變體 */
        const baseSym=KB.flat().find(k=>k.id===st.key).cells[st.cell].s;
        showBubble(tgt, baseSym, "final");
        await sleep(300); if(my!==token) return;
        const dy=st.pull==="up"?-20:20;
        finger.style.top=(c.cy+dy)+"px";
        await sleep(180);
        cellMorph(tgt, st.sym, st.pull==="up");
        showBubble(tgt, st.sym, st.r);
        await sleep(430); if(my!==token) return;
      } else if(st.dir){
        /* flick：按住 → 指尖往方向 → 泡泡顯示目標符號＋底排提示點亮 */
        await sleep(140);
        const d={up:[0,-22],down:[0,22],left:[-22,0]}[st.dir];
        finger.style.left=(c.cx+d[0])+"px"; finger.style.top=(c.cy+d[1])+"px";
        showBubble(key, st.sym, st.r);
        litHint(key, st.sym, true);
        await sleep(360); if(my!==token) return;
      } else {
        /* 點按：泡泡短暫顯示輸出符號 */
        if(st.sym) showBubble(tgt.classList.contains("cell")?tgt:key, st.sym, st.r);
        await sleep(300); if(my!==token) return;
      }

      /* 放開＝輸入 */
      finger.classList.remove("press");
      if(st.morphLast) bufMorphLast(st.morphLast.ch, st.morphLast.r);
      else if(st.sym) bufAppend(st.sym, st.r);
      await sleep(240);
      hideBubble();
      if(st.dir) litHint(key, st.sym, false);
      if(st.pull){ await sleep(120); cellReset(tgt); }
      await sleep(280);
    }
  }
  $("replayBtn").onclick=()=>play();

  window.addEventListener("load",()=>setTimeout(play,450));

  /* ═══ 聲調圖表 ═══ */
  const { TONES } = window.TAIGI_SPELLING;
  const chart=$("toneChart");
  const TC={padL:52,padR:16,padT:16,padB:52,W:640,H:210};
  TC.gw=TC.W-TC.padL-TC.padR; TC.gh=TC.H-TC.padT-TC.padB;
  const yOf=d=>TC.padT+(5-d)/4*TC.gh;
  const xOf=i=>TC.padL+(i+0.5)/TONES.length*TC.gw;
  function curveD(c,short,cx,dy){dy=dy||0;const half=short?14:34;return "M "+(cx-half).toFixed(1)+" "+(yOf(c[0])+dy).toFixed(1)+" L "+(cx+half).toFixed(1)+" "+(yOf(c[1])+dy).toFixed(1);}
  function buildToneChart(){
    let s="";
    for(let d=1;d<=5;d++){const y=yOf(d);s+=`<line class="grid-line" x1="${TC.padL}" y1="${y}" x2="${TC.W-TC.padR}" y2="${y}"/><text class="grid-label" x="${TC.padL-10}" y="${y+3.5}" text-anchor="end">${d}</text>`;}
    s+=`<text class="axis-cap" x="${TC.padL-10}" y="${yOf(5)-7}" text-anchor="end">高</text><text class="axis-cap" x="${TC.padL-10}" y="${yOf(1)+15}" text-anchor="end">低</text>`;
    const colW=TC.gw/TONES.length, by=TC.H-TC.padB;
    TONES.forEach((t,i)=>{const cx=xOf(i);
      s+=`<g class="tone-col" data-i="${i}"><rect class="col-bg" x="${cx-colW/2}" y="${TC.padT}" width="${colW}" height="${TC.gh}" rx="6"/>`;
      if(t.zh) s+=`<path class="zh-curve" d="${curveD(t.zh.curve,false,cx,-3.5)}"/>`;
      s+=`<path class="tw-curve" d="${curveD(t.curve,t.short,cx,0)}"/>`;
      s+=`<text class="t-hanzi" x="${cx}" y="${by+22}">${t.hanzi}</text><text class="t-name" x="${cx}" y="${by+36}">${t.name}</text>`;
      if(t.zh) s+=`<text class="t-badge" x="${cx}" y="${by+49}">≈國語${t.zh.name}</text>`;
      s+=`<rect class="hitbox" x="${cx-colW/2}" y="0" width="${colW}" height="${TC.H}"/></g>`;
    });
    chart.innerHTML=s;
    chart.querySelectorAll(".tone-col").forEach(g=>{g.querySelector(".hitbox").onclick=()=>selTone(+g.dataset.i);});
  }
  function selTone(i){
    chart.querySelectorAll(".tone-col").forEach((g,j)=>g.classList.toggle("active",j===i));
    const t=TONES[i];
    const bridge=t.zh?` · <span class="td-bridge">≈ 國語${t.zh.name}（同符號同方向）</span>`:` · <span style="color:var(--text-secondary)">國語沒有這個調</span>`;
    $("toneDetail").innerHTML=`<span class="td-glyph">${t.glyph}</span><b>第 ${t.n} 調 ${t.name}</b>　調值 ${t.val}${bridge}<span class="td-gest">怎麼打：${t.gest}</span>`;
  }

  /* ═══ 摺疊 ═══ */
  document.querySelectorAll(".fold-head").forEach(h=>h.onclick=()=>h.parentElement.toggleAttribute("data-open"));

  buildToneChart(); selTone(1);
})();
