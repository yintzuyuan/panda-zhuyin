/* 說明書動畫引擎（確定性時間軸）。
 *
 * 每支動畫提供一個 render(t) 函式：給定 loop 內時間 t（秒），把 DOM 設成「該瞬間的完整狀態」。
 * - 即時預覽：以 rAF 時間戳驅動 render(now % duration)。
 * - 匯出：Playwright 呼叫 window.__seek(t) 逐幀對齊（不靠自由 rAF → loop 無縫、可重現）。
 *
 * 注意：render(t) 必須「無狀態」——每次都明確設定所有會動的屬性（含歸零），不可依賴前一幀殘留。
 */
(function () {
  const E = {};

  E.clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  E.lerp = (a, b, t) => a + (b - a) * t;
  E.mix = (a, b, t) => a + (b - a) * E.clamp01(t);

  // 緩動
  E.easeOut = (t) => 1 - Math.pow(1 - E.clamp01(t), 2);
  E.easeOutCubic = (t) => 1 - Math.pow(1 - E.clamp01(t), 3);
  E.easeInOut = (t) => {
    t = E.clamp01(t);
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };
  E.easeOutBack = (t) => {
    t = E.clamp01(t);
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  // 區段進度：在 [start, start+dur] 內線性 0→1（外側 clamp）。
  E.seg = (t, start, dur) => E.clamp01((t - start) / dur);
  // 0→1→0 隆起（閃光/脈動）。
  E.bump = (t, start, dur) => {
    const p = (t - start) / dur;
    return p <= 0 || p >= 1 ? 0 : Math.sin(p * Math.PI);
  };
  E.inWin = (t, a, b) => t >= a && t < b;

  let scene = null;
  E._paused = false;

  /** 註冊一支動畫。renderFn(t秒)；duration 秒；stageSel 匯出時截圖的舞台選擇器。 */
  E.run = function (renderFn, duration, stageSel) {
    scene = { renderFn, duration };
    window.__duration = duration;
    window.__stage = stageSel || ".stage";

    function tick(now) {
      if (!E._paused && scene) {
        const t = ((now / 1000) % duration + duration) % duration;
        scene.renderFn(t);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ?t=<秒> → 靜止在該幀（poster / headless 逐幀截圖用）。
    const params = new URLSearchParams(location.search);
    const tp = params.get("t");
    const seekT = tp != null && tp !== "" ? Number(tp) : null;
    if (seekT != null && isFinite(seekT)) {
      E._paused = true;
      scene.renderFn(((seekT % duration) + duration) % duration);
    } else if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // reduced-motion：靜止首幀。
      E._paused = true;
      scene.renderFn(0);
    }
  };

  /** 匯出/逐幀：跳到指定時間並暫停自由播放。 */
  window.__seek = function (t) {
    E._paused = true;
    if (scene) {
      const d = scene.duration;
      scene.renderFn(((t % d) + d) % d);
    }
  };
  window.__play = function () { E._paused = false; };

  // —— 五邊形花瓣（移植 app PetalShapes.addRoundedPentagon：5 點、相鄰邊 clamp、quad 圓角）——
  // 命名＝本體位置、尖端朝按鍵中心：up=本體在上尖朝下、down=尖朝上、left=尖朝右、right=尖朝左。
  const PENTA = {
    up:    (w, h) => [[w / 2, h], [w, 3 * h / 4], [w, 0], [0, 0], [0, 3 * h / 4]],
    down:  (w, h) => [[w / 2, 0], [0, h / 4], [0, h], [w, h], [w, h / 4]],
    left:  (w, h) => [[0, 0], [3 * w / 4, 0], [w, h / 2], [3 * w / 4, h], [0, h]],
    right: (w, h) => [[w / 4, 0], [0, h / 2], [w / 4, h], [w, h], [w, 0]],
  };
  E.pentagonPath = function (dir, w, h, r) {
    const P = PENTA[dir](w, h);
    r = r == null ? 8 : r;
    const f = (x) => x.toFixed(2);
    let d = "";
    for (let i = 0; i < 5; i++) {
      const c = P[i], n = P[(i + 1) % 5], p = P[(i + 4) % 5];
      const pv = [c[0] - p[0], c[1] - p[1]], nv = [n[0] - c[0], n[1] - c[1]];
      const pl = Math.hypot(pv[0], pv[1]), nl = Math.hypot(nv[0], nv[1]);
      const rr = Math.min(r, Math.min(pl, nl) / 2);
      const s = [c[0] - pv[0] / pl * rr, c[1] - pv[1] / pl * rr];
      const e = [c[0] + nv[0] / nl * rr, c[1] + nv[1] / nl * rr];
      d += (i === 0 ? "M" : "L") + f(s[0]) + " " + f(s[1]) +
           " Q" + f(c[0]) + " " + f(c[1]) + " " + f(e[0]) + " " + f(e[1]) + " ";
    }
    return d + "Z";
  };
  E.applyPetalShape = function (el, dir, r) {
    el.style.clipPath = "path('" + E.pentagonPath(dir, el.offsetWidth, el.offsetHeight, r) + "')";
  };

  // 點按漣漪（Material 式：自觸點向外擴散＋淡出的空心環）。p：0→1。
  E.ripple = function (el, x, y, p) {
    const vis = p > 0 && p < 1;
    el.style.opacity = vis ? 0.42 * (1 - E.easeOut(p)) : 0;
    if (vis) {
      el.style.translate = "calc(-50% + " + x + "px) calc(-50% + " + y + "px)";
      el.style.scale = 0.3 + 1.6 * E.easeOut(p);
    }
  };
  E.shapePetals = function (root) {
    const dirs = ["up", "down", "left", "right"];
    (root || document).querySelectorAll(".petal.up,.petal.down,.petal.left,.petal.right").forEach((el) => {
      E.applyPetalShape(el, dirs.find((d) => el.classList.contains(d)), 8);
    });
  };

  // ?theme=dark → 套深色。
  try {
    const p = new URLSearchParams(location.search);
    if (p.get("theme") === "dark") document.body.classList.add("dark");
  } catch (e) {}

  window.Anim = E;
})();
