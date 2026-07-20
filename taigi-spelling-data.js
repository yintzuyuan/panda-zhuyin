/* 例字/佈局/聲調資料層。佈局 SoT: KeyboardKit/Sources/KeyboardKit/Models/TaigiKeyboardLayout.swift（#1036 KT、M3 變形鍵）。拼法對照 lexicon-taigi-romanization.txt。
   #1058：翻譯文字欄改 {zh, en}（renderer 用 L() 依 documentElement.dataset.lang 取值）；zh/buf/zhVal/key/sym 等結構/語言中性欄維持字串。 */

/* ═══ 佈局資料（SoT: TaigiKeyboardLayout.swift；#1036 KT、M3 變形鍵）═══ */
const KB = [
  [{id:"K1",m:"ㄅ",hints:["ㄆ","ㄇ"],hc:"c-rose"},
   {id:"K2",m:"ㄉ",hints:["ㄊ","ㄋ","ㄌ"],hc:"c-rose"},
   {id:"M1",m:"ㄧ"},
   {id:"F1",cells:[{s:"ㄚ",up:"ㆰ",down:"ㆩ"},{s:"ㆦ",up:"ㆱ",down:"ㆧ"},{s:"ㄜ"},{s:"ㆤ",down:"ㆥ"}]},
   {id:"KT",m:"ㆴ",hints:["ˊ","ˋ","˙"],hc:"c-amber",sub:"聲調"}],
  [{id:"K3",m:"ㄍ",hints:["ㄎ","ㄫ","ㄏ"],hc:"c-rose"},
   {id:"K4",m:"ㄐ",hints:["ㄑ","ㄒ"],hc:"c-rose"},
   {id:"M2",m:"ㄨ"},
   {id:"F2",cells:[{s:"ㄞ",down:"ㆮ"},{s:"ㄠ",down:"ㆯ"},{s:"ㆭ"},{s:"ㆬ"}]},
   {id:"KP",m:"，"}],
  [{id:"K5",m:"ㆠ",hints:["ㆣ","ㆡ","ㆢ"],hc:"c-rose"},
   {id:"K6",m:"ㄗ",hints:["ㄘ","ㄙ"],hc:"c-rose"},
   {id:"M3",m:"變"},
   {id:"F3",cells:[{s:"ㄢ"},{s:"ㄣ"},{s:"ㄤ"},{s:"ㄥ"}]},
   {id:"F3e",m:"ㆲ"}],
];

/* ═══ 例字資料層（九字＝七調全覆蓋＋全部特殊手勢；選字由詞庫篩選）═══ */
const EXAMPLES = [
  { zh:"東", zhVal:[["ㄉ"],["ㄨ"],["ㄥ"]], zhNote:{zh:"",en:""}, twRoma:{zh:"tong（臺羅）",en:"tong (Tâi-lô)"}, tag:{zh:"ong→ㆲ",en:"ong→ㆲ"},
    steps:[
      {key:"K2", sym:"ㄉ", r:"initial", buf:"ㄉ", label:{zh:"① 點聲母鍵 ㄉ",en:"① Tap onset key ㄉ"}},
      {key:"F3e", sym:"ㆲ", r:"final", buf:"ㄉㆲ", label:{zh:"② 點 ㆲ 鍵——一顆鍵＝整個 ong 韻",en:"② Tap ㆲ — one key for the whole -ong rime"}},
      {commit:"東", label:{zh:"③ 送出（第一聲免調號）",en:"③ Commit (1st tone, no mark)"}, rule:{zh:"台語的 <b>ong</b> 用一個專用符號 <b>ㆲ</b>，不像國語拼 ㄨ＋ㄥ 兩個符號——方音符號讓韻母收在兩個符號以內。",en:"Taigi writes <b>ong</b> with one dedicated symbol <b>ㆲ</b>, not ㄨ＋ㄥ like Mandarin — phonetic symbols keep each rime within two symbols."}} ]},
  { zh:"無", zhVal:[["ㄨ"],["ˊ","t"]], zhNote:{zh:"",en:""}, twRoma:{zh:"bô（臺羅）",en:"bô (Tâi-lô)"}, tag:{zh:"濁音 ㆠ",en:"voiced ㆠ"},
    steps:[
      {key:"K5", sym:"ㆠ", r:"initial", buf:"ㆠ", label:{zh:"① 點濁音鍵 ㆠ（＝b）",en:"① Tap voiced onset ㆠ (= b)"}},
      {key:"F1", cell:2, sym:"ㄜ", r:"final", buf:"ㆠㄜ", label:{zh:"② 點韻母 ㄜ（台語讀 o）",en:"② Tap rime ㄜ (read o in Taigi)"}},
      {key:"KT", dir:"up", sym:"ˊ", r:"tone", buf:"ㆠㄜˊ", label:{zh:"③ 聲調鍵上滑＝ˊ 第五聲（陽平）",en:"③ Flick tone key up = ˊ 5th tone (yang-level)"}},
      {commit:"無", label:{zh:"④ 送出「無」",en:"④ Commit 無"}, rule:{zh:"<b>ㆠ</b>（b）是濁音聲母，國語沒有這個音；台語的 ㆠㆣㆡ 都是新造的濁音符號。",en:"<b>ㆠ</b> (b) is a voiced onset — absent in Mandarin. Taigi's ㆠㆣㆡ are all newly coined voiced symbols."}} ]},
  { zh:"圓", zhVal:[["ㄩ"],["ㄢ"],["ˊ","t"]], zhNote:{zh:"",en:""}, twRoma:{zh:"înn（臺羅）",en:"înn (Tâi-lô)"}, tag:{zh:"鼻化 ㆪ",en:"nasal ㆪ"},
    steps:[
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄧ", label:{zh:"① 點 ㄧ（這個字沒有聲母）",en:"① Tap ㄧ (this word has no onset)"}},
      {key:"M3", morphLast:{ch:"ㆪ",r:"nasal"}, buf:"ㆪ", label:{zh:"② 點『變形鍵』：ㄧ → 鼻化 ㆪ",en:"② Tap the morph key: ㄧ → nasal ㆪ"}},
      {key:"KT", dir:"up", sym:"ˊ", r:"tone", buf:"ㆪˊ", label:{zh:"③ 聲調鍵上滑＝ˊ 第五聲",en:"③ Flick tone key up = ˊ 5th tone"}},
      {commit:"圓", label:{zh:"④ 送出「圓」",en:"④ Commit 圓"}, rule:{zh:"<b>ㆪ</b> 是帶鼻音的 i——台語的「鼻化」寫法，符號上畫圈出頭表示，國語完全沒有這一類。",en:"<b>ㆪ</b> is a nasalized i — Taigi's nasalization, marked by a crossed loop on top; Mandarin has no such category."}} ]},
  { zh:"衫", zhVal:[["ㄕ"],["ㄢ"]], zhNote:{zh:"",en:""}, twRoma:{zh:"sann（臺羅）",en:"sann (Tâi-lô)"}, tag:{zh:"下拉 ㆩ",en:"pull-down ㆩ"},
    steps:[
      {key:"K6", dir:"down", sym:"ㄙ", r:"initial", buf:"ㄙ", label:{zh:"① ㄗ 鍵往下滑＝ㄙ",en:"① Flick ㄗ key down = ㄙ"}},
      {key:"F1", cell:0, pull:"down", sym:"ㆩ", r:"nasal", buf:"ㄙㆩ", label:{zh:"② 按住 ㄚ 往下拉＝鼻化 ㆩ",en:"② Hold ㄚ, pull down = nasal ㆩ"}},
      {commit:"衫", label:{zh:"③ 送出「衫」（sann，衣服）",en:"③ Commit 衫 (sann, 'shirt')"}, rule:{zh:"韻母格<b>往下拉</b>＝鼻化變體（ㄚ→ㆩ）。格緣的小圓點提示：有點的方向才有變體。",en:"<b>Pull a rime cell down</b> for its nasal variant (ㄚ→ㆩ). The dot on a cell's edge marks which direction has a variant."}} ]},
  { zh:"點", zhVal:[["ㄉ"],["ㄧ"],["ㄢ"],["ˇ","t"]], zhNote:{zh:"",en:""}, twRoma:{zh:"tiám（臺羅）",en:"tiám (Tâi-lô)"}, tag:{zh:"上拉 ㆰ",en:"pull-up ㆰ"},
    steps:[
      {key:"K2", sym:"ㄉ", r:"initial", buf:"ㄉ", label:{zh:"① 點聲母 ㄉ",en:"① Tap onset ㄉ"}},
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄉㄧ", label:{zh:"② 點介音 ㄧ",en:"② Tap medial ㄧ"}},
      {key:"F1", cell:0, pull:"up", sym:"ㆰ", r:"final", buf:"ㄉㄧㆰ", label:{zh:"③ 按住 ㄚ 往上拉＝-m 韻尾 ㆰ",en:"③ Hold ㄚ, pull up = -m coda ㆰ"}},
      {key:"KT", dir:"down", sym:"ˋ", r:"tone", buf:"ㄉㄧㆰˋ", label:{zh:"④ 下滑＝ˋ 第二聲（同國語四聲手勢）",en:"④ Flick down = ˋ 2nd tone (same gesture as Mandarin 4th)"}},
      {commit:"點", label:{zh:"⑤ 送出「點」（tiám）",en:"⑤ Commit 點 (tiám)"}, rule:{zh:"ㄚ <b>往上拉</b>是 -m 收尾的 <b>ㆰ</b>（am）——跟往下拉的鼻化 ㆩ 方向相反、意思不同。",en:"<b>Pulling ㄚ up</b> gives <b>ㆰ</b> (am), an -m ending — opposite direction and meaning from the pull-down nasal ㆩ."}} ]},
  { zh:"對", zhVal:[["ㄉ"],["ㄨ"],["ㄟ"],["ˋ","t"]], zhNote:{zh:"",en:""}, twRoma:{zh:"tuì（臺羅）",en:"tuì (Tâi-lô)"}, tag:{zh:"三調 ˪",en:"3rd tone ˪"},
    steps:[
      {key:"K2", sym:"ㄉ", r:"initial", buf:"ㄉ", label:{zh:"① 點聲母 ㄉ",en:"① Tap onset ㄉ"}},
      {key:"M2", sym:"ㄨ", r:"medial", buf:"ㄉㄨ", label:{zh:"② 點 ㄨ",en:"② Tap ㄨ"}},
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄉㄨㄧ", label:{zh:"③ 再點 ㄧ——台語 ㄨㄧ 可相鄰，國語沒有",en:"③ Tap ㄧ again — Taigi allows ㄨㄧ adjacent, Mandarin doesn't"}},
      {key:"KT", dir:"down", sym:"ˋ", r:"tone", buf:"ㄉㄨㄧˋ", label:{zh:"④ 下滑＝ˋ 第二聲",en:"④ Flick down = ˋ 2nd tone"}},
      {key:"KT", dir:"down", sym:"˪", r:"tone", morphLast:{ch:"˪",r:"tone"}, buf:"ㄉㄨㄧ˪", label:{zh:"⑤ 同方向再滑一次＝循環成 ˪ 第三聲（陰去）",en:"⑤ Flick the same way again = cycle to ˪ 3rd tone (yin-departing)"}},
      {commit:"對", label:{zh:"⑥ 送出「對」（tuì）",en:"⑥ Commit 對 (tuì)"}, rule:{zh:"<b>˪</b>（第三聲）沒有專屬手勢——<b>ˋ 同方向再滑一次</b>就循環變 ˪。國語拼 ㄉㄨㄟˋ、台語拼 ㄉㄨㄧ˪，連韻母都不同。",en:"<b>˪</b> (3rd tone) has no gesture of its own — <b>flick ˋ the same way again</b> to cycle into ˪. Mandarin spells ㄉㄨㄟˋ, Taigi ㄉㄨㄧ˪ — even the rime differs."}} ]},
  { zh:"予", zhVal:[["ㄩ"],["ˇ","t"]], zhNote:{zh:"",en:""}, twRoma:{zh:"hōo（臺羅）",en:"hōo (Tâi-lô)"}, tag:{zh:"七調 ˫",en:"7th tone ˫"},
    steps:[
      {key:"K3", dir:"down", sym:"ㄏ", r:"initial", buf:"ㄏ", label:{zh:"① ㄍ 鍵往下滑＝ㄏ",en:"① Flick ㄍ key down = ㄏ"}},
      {key:"F1", cell:1, sym:"ㆦ", r:"final", buf:"ㄏㆦ", label:{zh:"② 點 ㆦ＝oo（佔了國語 ㄛ 的位置）",en:"② Tap ㆦ = oo (takes Mandarin ㄛ's spot)"}},
      {key:"KT", dir:"up", sym:"ˊ", r:"tone", buf:"ㄏㆦˊ", label:{zh:"③ 上滑＝ˊ 第五聲",en:"③ Flick up = ˊ 5th tone"}},
      {key:"KT", dir:"up", sym:"˫", r:"tone", morphLast:{ch:"˫",r:"tone"}, buf:"ㄏㆦ˫", label:{zh:"④ 同方向再滑一次＝循環成 ˫ 第七聲（陽去）",en:"④ Flick the same way again = cycle to ˫ 7th tone (yang-departing)"}},
      {commit:"予", label:{zh:"⑤ 送出「予」（hōo，給）",en:"⑤ Commit 予 (hōo, 'to give')"}, rule:{zh:"<b>˫</b>（第七聲）＝<b>ˊ 同方向再滑一次</b>的循環。台語的 oo 用專用符號 <b>ㆦ</b>。",en:"<b>˫</b> (7th tone) = <b>flick ˊ the same way again</b> to cycle. Taigi writes oo with the dedicated symbol <b>ㆦ</b>."}} ]},
  { zh:"佮", zhVal:[["ㄍ"],["ㄜ"],["ˊ","t"]], zhNote:{zh:"（國語罕用字）",en:"(rare in Mandarin)"}, twRoma:{zh:"kap（臺羅）",en:"kap (Tâi-lô)"}, tag:{zh:"陰入",en:"4th tone ㆴ"},
    steps:[
      {key:"K3", sym:"ㄍ", r:"initial", buf:"ㄍ", label:{zh:"① 點聲母 ㄍ",en:"① Tap onset ㄍ"}},
      {key:"F1", cell:0, sym:"ㄚ", r:"final", buf:"ㄍㄚ", label:{zh:"② 點韻母 ㄚ",en:"② Tap rime ㄚ"}},
      {key:"KT", sym:"ㆴ", r:"coda", buf:"ㄍㄚㆴ", label:{zh:"③ 聲調鍵點一下＝入聲小字 ㆴ（-p 收尾）",en:"③ Tap tone key once = entering-tone glyph ㆴ (-p ending)"}},
      {commit:"佮", label:{zh:"④ 送出「佮」（kap，「和」）",en:"④ Commit 佮 (kap, 'and')"}, rule:{zh:"入聲尾 <b>ㆴㆵㆻㆷ</b> 是短促收尾，國語沒有。裸寫就是第四聲（陰入），不另外加調號——聲調藏在韻尾裡。",en:"The stop codas <b>ㆴㆵㆻㆷ</b> are abrupt endings absent in Mandarin. Written bare, they are the 4th tone (yin-entering) — no extra mark; the tone lives in the coda."}} ]},
  { zh:"食", zhVal:[["ㄕ"],["ˊ","t"]], zhNote:{zh:"",en:""}, twRoma:{zh:"tsia̍h（臺羅）",en:"tsia̍h (Tâi-lô)"}, tag:{zh:"陽入＋ㄐ接ㄧ",en:"8th tone ㆷ̇"},
    steps:[
      {key:"K4", sym:"ㄐ", r:"initial", buf:"ㄐ", label:{zh:"① 點 ㄐ（接 ㄧ 用 ㄐ，其實和 ㄗ 同音）",en:"① Tap ㄐ (use ㄐ before ㄧ — same sound as ㄗ)"}},
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄐㄧ", label:{zh:"② 點介音 ㄧ",en:"② Tap medial ㄧ"}},
      {key:"F1", cell:0, sym:"ㄚ", r:"final", buf:"ㄐㄧㄚ", label:{zh:"③ 點韻母 ㄚ",en:"③ Tap rime ㄚ"}},
      {key:"KT", cycle:["ㆴ","ㆵ","ㆻ","ㆷ"], r:"coda", buf:"ㄐㄧㄚㆷ", label:{zh:"④ 連點循環 ㆴ→ㆵ→ㆻ→ㆷ",en:"④ Tap repeatedly to cycle ㆴ→ㆵ→ㆻ→ㆷ"}},
      {key:"KT", dir:"left", sym:"˙", r:"tone", morphLast:{ch:"ㆷ̇",r:"coda"}, buf:"ㄐㄧㄚㆷ̇", label:{zh:"⑤ 左滑加一點＝陽入（第八聲）",en:"⑤ Flick left to add a dot = yang-entering (8th tone)"}},
      {commit:"食", label:{zh:"⑥ 送出「食」（tsia̍h，吃）",en:"⑥ Commit 食 (tsia̍h, 'to eat')"}, rule:{zh:"陽入＝入聲尾<b>加一點</b>（ㆷ̇）。另外 <b>ㄐ 接 ㄧ</b> 和 ㄗ 是同一個音，只是相容注音的寫法習慣。",en:"Yang-entering = a stop coda <b>with an added dot</b> (ㆷ̇). Also, <b>ㄐ before ㄧ</b> is the same sound as ㄗ — just a Zhuyin-compatible spelling habit."}} ]},
];

/* 聲調資料（調值：教育部通行腔；zh＝國語對應）。#1058：name/markSym/val/gest/zh.name 改 {zh,en}；n/hanzi/glyph/curve/short 維持字串。 */
const TONES = [
  { n:1, name:{zh:"陰平",en:"Yin-level"}, hanzi:"東", glyph:"ㄉㆲ",   markSym:{zh:"無標",en:"none"},       val:{zh:"55 高平",en:"55 high-level"}, curve:[5,5], short:false, zh:{name:{zh:"一聲",en:"1st"},curve:[5,5]}, gest:{zh:"直接送出，不用加調號",en:"Commit directly, no tone mark"} },
  { n:2, name:{zh:"陰上",en:"Yin-rising"}, hanzi:"黨", glyph:"ㄉㆲˋ",  markSym:{zh:"ˋ",en:"ˋ"},             val:{zh:"51 高降",en:"51 high-falling"}, curve:[5,1], short:false, zh:{name:{zh:"四聲",en:"4th"},curve:[5,1]}, gest:{zh:"聲調鍵往下滑——跟國語四聲同一個動作",en:"Flick the tone key down — same move as Mandarin 4th tone"} },
  { n:3, name:{zh:"陰去",en:"Yin-departing"}, hanzi:"棟", glyph:"ㄉㆲ˪",  markSym:{zh:"˪",en:"˪"},             val:{zh:"31 中降",en:"31 mid-falling"}, curve:[3,1], short:false, zh:null, gest:{zh:"下滑 ˋ 之後，同方向再滑一次（循環成 ˪）",en:"After ˋ (down), flick the same way again (cycles to ˪)"} },
  { n:4, name:{zh:"陰入",en:"Yin-entering"}, hanzi:"督", glyph:"ㄉㆦㆻ",  markSym:{zh:"入聲尾",en:"stop coda"}, val:{zh:"短促",en:"abrupt"},           curve:[3,3], short:true,  zh:null, gest:{zh:"聲調鍵點一下出入聲小字（連點換部位）",en:"Tap the tone key for a stop-coda glyph (tap again to change place)"} },
  { n:5, name:{zh:"陽平",en:"Yang-level"}, hanzi:"同", glyph:"ㄉㆲˊ",  markSym:{zh:"ˊ",en:"ˊ"},             val:{zh:"24 低升",en:"24 low-rising"}, curve:[2,4], short:false, zh:{name:{zh:"二聲",en:"2nd"},curve:[3,5]}, gest:{zh:"聲調鍵往上滑——跟國語二聲同一個動作",en:"Flick the tone key up — same move as Mandarin 2nd tone"} },
  { n:7, name:{zh:"陽去",en:"Yang-departing"}, hanzi:"洞", glyph:"ㄉㆲ˫",  markSym:{zh:"˫",en:"˫"},             val:{zh:"33 中平",en:"33 mid-level"}, curve:[3,3], short:false, zh:null, gest:{zh:"上滑 ˊ 之後，同方向再滑一次（循環成 ˫）",en:"After ˊ (up), flick the same way again (cycles to ˫)"} },
  { n:8, name:{zh:"陽入",en:"Yang-entering"}, hanzi:"毒", glyph:"ㄉㆦㆻ̇", markSym:{zh:"入聲尾＋點",en:"stop coda + dot"}, val:{zh:"高短",en:"high & abrupt"}, curve:[5,5], short:true,  zh:null, gest:{zh:"入聲小字之後往左滑加一點",en:"After the stop-coda glyph, flick left to add a dot"} },
];

window.TAIGI_SPELLING = { KB, EXAMPLES, TONES };
