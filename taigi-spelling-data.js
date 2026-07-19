/* 例字/佈局/聲調資料層。佈局 SoT: KeyboardKit/Sources/KeyboardKit/Models/TaigiKeyboardLayout.swift（#1036 KT、M3 變形鍵）。拼法對照 lexicon-taigi-romanization.txt。 */

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
  { zh:"東", zhVal:[["ㄉ"],["ㄨ"],["ㄥ"]], zhNote:"", twRoma:"tong（臺羅）", tag:"ong→ㆲ",
    steps:[
      {key:"K2", sym:"ㄉ", r:"initial", buf:"ㄉ", label:"① 點聲母鍵 ㄉ"},
      {key:"F3e", sym:"ㆲ", r:"final", buf:"ㄉㆲ", label:"② 點 ㆲ 鍵——一顆鍵＝整個 ong 韻"},
      {commit:"東", label:"③ 送出（第一聲免調號）", rule:"台語的 <b>ong</b> 用一個專用符號 <b>ㆲ</b>，不像國語拼 ㄨ＋ㄥ 兩個符號——方音符號讓韻母收在兩個符號以內。"} ]},
  { zh:"無", zhVal:[["ㄨ"],["ˊ","t"]], zhNote:"", twRoma:"bô（臺羅）", tag:"濁音 ㆠ",
    steps:[
      {key:"K5", sym:"ㆠ", r:"initial", buf:"ㆠ", label:"① 點濁音鍵 ㆠ（＝b）"},
      {key:"F1", cell:2, sym:"ㄜ", r:"final", buf:"ㆠㄜ", label:"② 點韻母 ㄜ（台語讀 o）"},
      {key:"KT", dir:"up", sym:"ˊ", r:"tone", buf:"ㆠㄜˊ", label:"③ 聲調鍵上滑＝ˊ 第五聲（陽平）"},
      {commit:"無", label:"④ 送出「無」", rule:"<b>ㆠ</b>（b）是濁音聲母，國語沒有這個音；台語的 ㆠㆣㆡ 都是新造的濁音符號。"} ]},
  { zh:"圓", zhVal:[["ㄩ"],["ㄢ"],["ˊ","t"]], zhNote:"", twRoma:"înn（臺羅）", tag:"鼻化 ㆪ",
    steps:[
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄧ", label:"① 點 ㄧ（這個字沒有聲母）"},
      {key:"M3", morphLast:{ch:"ㆪ",r:"nasal"}, buf:"ㆪ", label:"② 點『變形鍵』：ㄧ → 鼻化 ㆪ"},
      {key:"KT", dir:"up", sym:"ˊ", r:"tone", buf:"ㆪˊ", label:"③ 聲調鍵上滑＝ˊ 第五聲"},
      {commit:"圓", label:"④ 送出「圓」", rule:"<b>ㆪ</b> 是帶鼻音的 i——台語的「鼻化」寫法，符號上畫圈出頭表示，國語完全沒有這一類。"} ]},
  { zh:"衫", zhVal:[["ㄕ"],["ㄢ"]], zhNote:"", twRoma:"sann（臺羅）", tag:"下拉 ㆩ",
    steps:[
      {key:"K6", dir:"down", sym:"ㄙ", r:"initial", buf:"ㄙ", label:"① ㄗ 鍵往下滑＝ㄙ"},
      {key:"F1", cell:0, pull:"down", sym:"ㆩ", r:"nasal", buf:"ㄙㆩ", label:"② 按住 ㄚ 往下拉＝鼻化 ㆩ"},
      {commit:"衫", label:"③ 送出「衫」（sann，衣服）", rule:"韻母格<b>往下拉</b>＝鼻化變體（ㄚ→ㆩ）。格緣的小圓點提示：有點的方向才有變體。"} ]},
  { zh:"點", zhVal:[["ㄉ"],["ㄧ"],["ㄢ"],["ˇ","t"]], zhNote:"", twRoma:"tiám（臺羅）", tag:"上拉 ㆰ",
    steps:[
      {key:"K2", sym:"ㄉ", r:"initial", buf:"ㄉ", label:"① 點聲母 ㄉ"},
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄉㄧ", label:"② 點介音 ㄧ"},
      {key:"F1", cell:0, pull:"up", sym:"ㆰ", r:"final", buf:"ㄉㄧㆰ", label:"③ 按住 ㄚ 往上拉＝-m 韻尾 ㆰ"},
      {key:"KT", dir:"down", sym:"ˋ", r:"tone", buf:"ㄉㄧㆰˋ", label:"④ 下滑＝ˋ 第二聲（同國語四聲手勢）"},
      {commit:"點", label:"⑤ 送出「點」（tiám）", rule:"ㄚ <b>往上拉</b>是 -m 收尾的 <b>ㆰ</b>（am）——跟往下拉的鼻化 ㆩ 方向相反、意思不同。"} ]},
  { zh:"對", zhVal:[["ㄉ"],["ㄨ"],["ㄟ"],["ˋ","t"]], zhNote:"", twRoma:"tuì（臺羅）", tag:"三調 ˪",
    steps:[
      {key:"K2", sym:"ㄉ", r:"initial", buf:"ㄉ", label:"① 點聲母 ㄉ"},
      {key:"M2", sym:"ㄨ", r:"medial", buf:"ㄉㄨ", label:"② 點 ㄨ"},
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄉㄨㄧ", label:"③ 再點 ㄧ——台語 ㄨㄧ 可相鄰，國語沒有"},
      {key:"KT", dir:"down", sym:"ˋ", r:"tone", buf:"ㄉㄨㄧˋ", label:"④ 下滑＝ˋ 第二聲"},
      {key:"KT", dir:"down", sym:"˪", r:"tone", morphLast:{ch:"˪",r:"tone"}, buf:"ㄉㄨㄧ˪", label:"⑤ 同方向再滑一次＝循環成 ˪ 第三聲（陰去）"},
      {commit:"對", label:"⑥ 送出「對」（tuì）", rule:"<b>˪</b>（第三聲）沒有專屬手勢——<b>ˋ 同方向再滑一次</b>就循環變 ˪。國語拼 ㄉㄨㄟˋ、台語拼 ㄉㄨㄧ˪，連韻母都不同。"} ]},
  { zh:"予", zhVal:[["ㄩ"],["ˇ","t"]], zhNote:"", twRoma:"hōo（臺羅）", tag:"七調 ˫",
    steps:[
      {key:"K3", dir:"down", sym:"ㄏ", r:"initial", buf:"ㄏ", label:"① ㄍ 鍵往下滑＝ㄏ"},
      {key:"F1", cell:1, sym:"ㆦ", r:"final", buf:"ㄏㆦ", label:"② 點 ㆦ＝oo（佔了國語 ㄛ 的位置）"},
      {key:"KT", dir:"up", sym:"ˊ", r:"tone", buf:"ㄏㆦˊ", label:"③ 上滑＝ˊ 第五聲"},
      {key:"KT", dir:"up", sym:"˫", r:"tone", morphLast:{ch:"˫",r:"tone"}, buf:"ㄏㆦ˫", label:"④ 同方向再滑一次＝循環成 ˫ 第七聲（陽去）"},
      {commit:"予", label:"⑤ 送出「予」（hōo，給）", rule:"<b>˫</b>（第七聲）＝<b>ˊ 同方向再滑一次</b>的循環。台語的 oo 用專用符號 <b>ㆦ</b>。"} ]},
  { zh:"佮", zhVal:[["ㄍ"],["ㄜ"],["ˊ","t"]], zhNote:"（國語罕用字）", twRoma:"kap（臺羅）", tag:"陰入",
    steps:[
      {key:"K3", sym:"ㄍ", r:"initial", buf:"ㄍ", label:"① 點聲母 ㄍ"},
      {key:"F1", cell:0, sym:"ㄚ", r:"final", buf:"ㄍㄚ", label:"② 點韻母 ㄚ"},
      {key:"KT", sym:"ㆴ", r:"coda", buf:"ㄍㄚㆴ", label:"③ 聲調鍵點一下＝入聲小字 ㆴ（-p 收尾）"},
      {commit:"佮", label:"④ 送出「佮」（kap，「和」）", rule:"入聲尾 <b>ㆴㆵㆻㆷ</b> 是短促收尾，國語沒有。裸寫就是第四聲（陰入），不另外加調號——聲調藏在韻尾裡。"} ]},
  { zh:"食", zhVal:[["ㄕ"],["ˊ","t"]], zhNote:"", twRoma:"tsia̍h（臺羅）", tag:"陽入＋ㄐ接ㄧ",
    steps:[
      {key:"K4", sym:"ㄐ", r:"initial", buf:"ㄐ", label:"① 點 ㄐ（接 ㄧ 用 ㄐ，其實和 ㄗ 同音）"},
      {key:"M1", sym:"ㄧ", r:"medial", buf:"ㄐㄧ", label:"② 點介音 ㄧ"},
      {key:"F1", cell:0, sym:"ㄚ", r:"final", buf:"ㄐㄧㄚ", label:"③ 點韻母 ㄚ"},
      {key:"KT", cycle:["ㆴ","ㆵ","ㆻ","ㆷ"], r:"coda", buf:"ㄐㄧㄚㆷ", label:"④ 連點循環 ㆴ→ㆵ→ㆻ→ㆷ"},
      {key:"KT", dir:"left", sym:"˙", r:"tone", morphLast:{ch:"ㆷ̇",r:"coda"}, buf:"ㄐㄧㄚㆷ̇", label:"⑤ 左滑加一點＝陽入（第八聲）"},
      {commit:"食", label:"⑥ 送出「食」（tsia̍h，吃）", rule:"陽入＝入聲尾<b>加一點</b>（ㆷ̇）。另外 <b>ㄐ 接 ㄧ</b> 和 ㄗ 是同一個音，只是相容注音的寫法習慣。"} ]},
];

/* 聲調資料（調值：教育部通行腔；zh＝國語對應） */
const TONES = [
  { n:1, name:"陰平", hanzi:"東", glyph:"ㄉㆲ",   markSym:"無標",       val:"55 高平", curve:[5,5], short:false, zh:{name:"一聲",curve:[5,5]}, gest:"直接送出，不用加調號" },
  { n:2, name:"陰上", hanzi:"黨", glyph:"ㄉㆲˋ",  markSym:"ˋ",         val:"51 高降", curve:[5,1], short:false, zh:{name:"四聲",curve:[5,1]}, gest:"聲調鍵往下滑——跟國語四聲同一個動作" },
  { n:3, name:"陰去", hanzi:"棟", glyph:"ㄉㆲ˪",  markSym:"˪",         val:"31 中降", curve:[3,1], short:false, zh:null, gest:"下滑 ˋ 之後，同方向再滑一次（循環成 ˪）" },
  { n:4, name:"陰入", hanzi:"督", glyph:"ㄉㆦㆻ",  markSym:"入聲尾",     val:"短促",   curve:[3,3], short:true,  zh:null, gest:"聲調鍵點一下出入聲小字（連點換部位）" },
  { n:5, name:"陽平", hanzi:"同", glyph:"ㄉㆲˊ",  markSym:"ˊ",         val:"24 低升", curve:[2,4], short:false, zh:{name:"二聲",curve:[3,5]}, gest:"聲調鍵往上滑——跟國語二聲同一個動作" },
  { n:7, name:"陽去", hanzi:"洞", glyph:"ㄉㆲ˫",  markSym:"˫",         val:"33 中平", curve:[3,3], short:false, zh:null, gest:"上滑 ˊ 之後，同方向再滑一次（循環成 ˫）" },
  { n:8, name:"陽入", hanzi:"毒", glyph:"ㄉㆦㆻ̇", markSym:"入聲尾＋點", val:"高短",   curve:[5,5], short:true,  zh:null, gest:"入聲小字之後往左滑加一點" },
];

window.TAIGI_SPELLING = { KB, EXAMPLES, TONES };
