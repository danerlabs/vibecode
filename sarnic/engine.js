'use strict';

/*
 * Sarnıç motoru.
 * Kâğıt, yazı, düğmeler, paylaşım kartı ve ses burada durur.
 * Sahne resmi dosyadır. Haftalık hikâye bu dosyaya sahne metni koymaz.
 * Yeni hikâye: README içindeki «Sarnıç'a hikâye eklemek».
 */
(function (global) {
  const GAME = {
    title: 'Sarnıç',
    slug: 'sarnic',
    storage: 'sarnic-v1',
  };
  GAME.url = 'https://danerlabs.github.io/vibecode/' + GAME.slug + '/';

  const STORIES = [];

  const INK = '#2c241c';
  const PAPER = '#f3ecdf';
  const RED = '#7a342c';

  function story(def) {
    if (!def || !def.id || !def.start || !def.scenes) {
      console.error('Sarnıç hikâyesi eksik', def && def.id);
      return;
    }
    STORIES.push(def);
  }

  /* stories/<id>/img/<sahne>.webp — yoksa kâğıt. image: false kâğıdı zorlar. */
  function imageSrc(st, sceneId, scene) {
    if (scene && scene.image === false) return null;
    if (scene && typeof scene.image === 'string') return scene.image;
    if (!st || !sceneId) return null;
    return 'stories/' + st.id + '/img/' + sceneId + '.webp';
  }
  function coverSrc(st) {
    if (!st || st.image === false) return null;
    if (typeof st.image === 'string') return st.image;
    return 'stories/' + st.id + '/img/cover.webp';
  }

  let plateToken = 0;
  function showPlate(src) {
    const plate = $('plate');
    const img = $('plate-img');
    const token = ++plateToken;
    document.body.classList.remove('photo');
    if (plate) plate.classList.remove('on');
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = '#e6d5b8';
    if (!plate || !img) return;
    img.onload = img.onerror = null;
    if (!src) {
      img.removeAttribute('src');
      return;
    }
    const apply = (ok) => {
      if (token !== plateToken) return;
      plate.classList.toggle('on', ok);
      document.body.classList.toggle('photo', ok);
      if (theme) theme.content = ok ? '#1a120c' : '#e6d5b8';
    };
    img.onload = () => apply(img.naturalWidth > 0);
    img.onerror = () => apply(false);
    if (img.getAttribute('src') === src && img.complete) {
      apply(img.naturalWidth > 0);
      return;
    }
    img.src = src;
  }

  const $ = id => document.getElementById(id);
  let app = null;

  function loadSave() {
    try {
      const raw = JSON.parse(localStorage.getItem(GAME.storage) || '{}');
      return {
        mute: !!raw.mute,
        progress: raw.progress || null,
        found: raw.found && typeof raw.found === 'object' ? raw.found : {},
      };
    } catch (e) {
      return { mute: false, progress: null, found: {} };
    }
  }
  function writeSave(data) {
    try { localStorage.setItem(GAME.storage, JSON.stringify(data)); } catch (e) {}
  }

  const save = loadSave();
  const state = {
    mode: 'shelf',
    storyId: null,
    sceneId: null,
    flags: {},
    ask: false,
  };

  let typeTimer = 0;
  let fullText = '';
  const prefersStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function storyById(id) { return STORIES.filter(s => s.id === id)[0] || null; }
  function currentStory() {
    const tagged = STORIES.filter(s => s.current);
    return tagged[tagged.length - 1] || STORIES[STORIES.length - 1] || null;
  }
  function sceneOf() {
    const st = storyById(state.storyId);
    return st && st.scenes[state.sceneId];
  }
  function foundList(id) {
    const arr = save.found[id];
    return Array.isArray(arr) ? arr : [];
  }
  function endingTotal(st) {
    return Object.keys(st.scenes).filter(k => st.scenes[k].ending).length;
  }
  function rememberEnding(st, endingId) {
    const list = foundList(st.id).slice();
    if (list.indexOf(endingId) < 0) list.push(endingId);
    save.found[st.id] = list;
    save.progress = { storyId: st.id, sceneId: state.sceneId, flags: state.flags };
    writeSave(save);
  }
  function persistProgress() {
    save.progress = { storyId: state.storyId, sceneId: state.sceneId, flags: state.flags };
    writeSave(save);
  }

  const Sound = {
    ac: null, master: null, on: !save.mute, mode: 'off', timers: [],
    rain: null, wind: null, noise: null,
    ensure() {
      if (this.ac) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ac = new AC();
      this.master = this.ac.createGain();
      this.master.gain.value = this.on ? 0.9 : 0;
      this.master.connect(this.ac.destination);
      const len = this.ac.sampleRate * 2;
      this.noise = this.ac.createBuffer(1, len, this.ac.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.rain = this.loopNoise(900, 5000, 0);
      this.wind = this.loopNoise(80, 420, 0);
    },
    loopNoise(hpF, lpF, gain) {
      const src = this.ac.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const hp = this.ac.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = hpF;
      const lp = this.ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = lpF;
      const g = this.ac.createGain();
      g.gain.value = gain;
      src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(this.master);
      src.start();
      return g;
    },
    resume() {
      this.ensure();
      if (!this.ac) return;
      if (this.ac.state === 'suspended') this.ac.resume();
      this.apply();
    },
    toggle() {
      this.resume();
      this.on = !this.on;
      save.mute = !this.on;
      writeSave(save);
      if (this.master) this.master.gain.value = this.on ? 0.9 : 0;
      paint();
    },
    clearTimers() {
      this.timers.forEach(t => clearTimeout(t));
      this.timers = [];
    },
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    setMode(mode) {
      this.mode = mode || 'off';
      if (this.ac) this.apply();
    },
    apply() {
      this.clearTimers();
      if (!this.rain) return;
      const m = this.mode;
      this.rain.gain.value = m === 'street' ? 0.05 : m === 'room' ? 0.02 : m === 'cistern' ? 0.008 : 0;
      this.wind.gain.value = m === 'street' ? 0.03 : 0;
      if (m === 'street') {
        this.horn();
        this.queueGull();
        this.queueHorn();
      }
      if (m === 'cistern') this.queueDrip();
    },
    horn() {
      if (!this.ac || !this.on) return;
      const t = this.ac.currentTime;
      [146, 154].forEach(f => {
        const o = this.ac.createOscillator();
        const g = this.ac.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(f + 30, t);
        o.frequency.exponentialRampToValueAtTime(f, t + 0.35);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.045, t + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
        o.connect(g); g.connect(this.master);
        o.start(t); o.stop(t + 1.4);
      });
    },
    gull() {
      if (!this.ac || !this.on) return;
      const t = this.ac.currentTime;
      const o = this.ac.createOscillator();
      const g = this.ac.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(780, t);
      o.frequency.exponentialRampToValueAtTime(1500, t + 0.12);
      o.frequency.exponentialRampToValueAtTime(900, t + 0.28);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.04, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + 0.34);
    },
    drip() {
      if (!this.ac || !this.on) return;
      const t = this.ac.currentTime;
      const o = this.ac.createOscillator();
      const g = this.ac.createGain();
      o.type = 'sine';
      const f0 = 620 + Math.random() * 380;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(180, t + 0.16);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.07, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + 0.22);
    },
    queueGull() {
      const step = () => {
        if (this.mode !== 'street') return;
        this.gull();
        this.later(step, 4000 + Math.random() * 5000);
      };
      this.later(step, 1200);
    },
    queueHorn() {
      const step = () => {
        if (this.mode !== 'street') return;
        this.horn();
        this.later(step, 16000 + Math.random() * 10000);
      };
      this.later(step, 14000);
    },
    queueDrip() {
      const step = () => {
        if (this.mode !== 'cistern') return;
        this.drip();
        if (Math.random() < 0.45) {
          this.later(() => { if (this.mode === 'cistern') this.drip(); }, 180 + Math.random() * 140);
        }
        this.later(step, 650 + Math.random() * 900);
      };
      this.later(step, 300);
    },
  };

  function grain() {
    const c = $('grain');
    if (!c) return;
    const g = c.getContext('2d');
    c.width = 200;
    c.height = 200;
    const img = g.createImageData(200, 200);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 120 + Math.random() * 50;
      img.data[i] = n;
      img.data[i + 1] = n - 8;
      img.data[i + 2] = n - 20;
      img.data[i + 3] = 18;
    }
    g.putImageData(img, 0, 0);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function header() {
    const h = el('header');
    const home = el('button', 'title', GAME.title);
    home.type = 'button';
    home.addEventListener('click', () => { Sound.resume(); goShelf(); });
    h.appendChild(home);
    h.appendChild(el('div', 'spacer'));
    const snd = el('button', null, Sound.on ? 'ses' : 'sessiz');
    snd.type = 'button';
    snd.setAttribute('aria-pressed', Sound.on ? 'true' : 'false');
    snd.addEventListener('click', () => Sound.toggle());
    h.appendChild(snd);
    if (state.mode === 'play') {
      const rs = el('button', null, 'baştan');
      rs.type = 'button';
      rs.addEventListener('click', () => { state.ask = !state.ask; paint(); });
      h.appendChild(rs);
    }
    return h;
  }

  function stopType() {
    if (typeTimer) { clearInterval(typeTimer); typeTimer = 0; }
  }

  function goShelf() {
    stopType();
    state.mode = 'shelf';
    state.ask = false;
    Sound.setMode('room');
    paint();
  }

  function begin(st, fresh) {
    stopType();
    state.mode = 'play';
    state.storyId = st.id;
    state.ask = false;
    if (!fresh && save.progress && save.progress.storyId === st.id && st.scenes[save.progress.sceneId]) {
      state.sceneId = save.progress.sceneId;
      state.flags = Object.assign({}, save.progress.flags || {});
    } else {
      state.sceneId = st.start;
      state.flags = {};
      persistProgress();
    }
    Sound.resume();
    paint();
  }

  /* when, o anki bayraklara bakılır. set ancak tutunca yazılır. */
  function enterChoice(choice) {
    const flags = state.flags;
    const pass = !choice.when || choice.when(flags);
    const patch = pass ? (choice.set || null) : (choice.setElse || null);
    if (patch) Object.assign(flags, patch);
    const to = pass ? choice.to : choice.else;
    state.sceneId = to;
    state.ask = false;
    const st = storyById(state.storyId);
    const sc = st.scenes[to];
    if (sc && sc.ending) rememberEnding(st, sc.ending);
    else persistProgress();
    stopType();
    paint();
  }

  function restartStory() {
    const st = storyById(state.storyId) || currentStory();
    state.ask = false;
    state.flags = {};
    state.sceneId = st.start;
    state.storyId = st.id;
    state.mode = 'play';
    persistProgress();
    stopType();
    Sound.resume();
    paint();
  }

  function paint() {
    app.textContent = '';
    app.appendChild(header());
    if (state.ask && state.mode === 'play') {
      const ask = el('div', 'ask');
      ask.appendChild(el('span', null, 'Bu gece silinsin mi? Sonlar durur.'));
      const yes = el('button', null, 'Evet');
      yes.type = 'button';
      yes.addEventListener('click', () => { Sound.resume(); restartStory(); });
      const no = el('button', null, 'Vazgeç');
      no.type = 'button';
      no.addEventListener('click', () => { state.ask = false; paint(); });
      ask.appendChild(yes);
      ask.appendChild(no);
      app.appendChild(ask);
    }
    if (state.mode === 'shelf') paintShelf();
    else paintScene();
  }

  function paintShelf() {
    const st = currentStory();
    if (!st) {
      app.appendChild(el('p', 'empty', 'Raf boş.'));
      return;
    }
    showPlate(coverSrc(st));
    const card = el('article', 'card');
    card.appendChild(el('p', 'kicker', 'Bu haftanın hikayesi'));
    card.appendChild(el('h1', null, GAME.title));
    card.appendChild(el('h2', null, st.title));
    card.appendChild(el('p', 'prose', st.blurb || ''));
    const n = foundList(st.id).length;
    const total = endingTotal(st);
    card.appendChild(el('p', 'found', n + '/' + total + ' son bulundu'));
    const prog = save.progress && save.progress.storyId === st.id && st.scenes[save.progress.sceneId];
    const go = el('button', 'primary', prog ? 'Kaldığın yerden' : 'Hikâyeye gir');
    go.type = 'button';
    go.addEventListener('click', () => begin(st, !prog));
    card.appendChild(go);
    if (prog) {
      const fresh = el('button', 'choice', 'Baştan başla');
      fresh.type = 'button';
      fresh.style.marginTop = '8px';
      fresh.addEventListener('click', () => { state.storyId = st.id; restartStory(); });
      card.appendChild(fresh);
    }
    app.appendChild(card);

    const shelf = el('section', 'shelf');
    shelf.appendChild(el('h2', null, 'Geçmiş hikâyeler'));
    const past = STORIES.filter(s => s !== st);
    if (!past.length) shelf.appendChild(el('p', 'empty', 'Raf boş. Yeni hikâye gelince burada durur.'));
    past.forEach(s => {
      const b = el('button', 'past', s.title);
      b.type = 'button';
      b.addEventListener('click', () => begin(s, true));
      shelf.appendChild(b);
    });
    app.appendChild(shelf);
    Sound.setMode('room');
  }

  function paintScene() {
    const st = storyById(state.storyId);
    const sc = sceneOf();
    if (!st || !sc) { goShelf(); return; }
    Sound.setMode(sc.sound || 'room');
    showPlate(imageSrc(st, state.sceneId, sc));
    const card = el('article', 'card');
    card.appendChild(el('p', 'kicker', st.title));
    if (sc.ending) card.appendChild(el('h2', 'endname', sc.endName));
    else card.appendChild(el('h2', null, sc.title));
    const prose = el('p', 'prose caret');
    card.appendChild(prose);
    const hint = el('p', 'hint', 'Dokun, yazı bitsin');
    card.appendChild(hint);
    const box = el('div', 'choices');
    card.appendChild(box);
    app.appendChild(card);

    fullText = typeof sc.text === 'function' ? sc.text(state.flags) : sc.text;
    let shown = 0;
    const done = () => {
      stopType();
      prose.classList.remove('caret');
      prose.textContent = fullText;
      hint.remove();
      if (sc.ending) paintEnding(st, sc, box);
      else (sc.choices || []).forEach(c => {
        const b = el('button', 'choice', c.t);
        b.type = 'button';
        b.addEventListener('click', () => { Sound.resume(); enterChoice(c); });
        box.appendChild(b);
      });
    };
    prose.addEventListener('click', () => { if (typeTimer) done(); });
    if (prefersStill || global.__instant) { done(); return; }
    typeTimer = setInterval(() => {
      shown += 1;
      prose.textContent = fullText.slice(0, shown);
      if (shown >= fullText.length) done();
    }, 12);
  }

  function paintEnding(st, sc, box) {
    const n = foundList(st.id).length;
    const total = endingTotal(st);
    box.appendChild(el('p', 'found', n + '/' + total + ' son bulundu' + (n >= total ? ' · bütün sonlar sende' : '')));
    const share = el('button', 'primary', 'Sonumu paylaş');
    share.type = 'button';
    share.addEventListener('click', () => { Sound.resume(); shareEnding(st, sc); });
    box.appendChild(share);
    const x = el('a', 'xl', 'X\'te paylaş');
    x.href = xIntent(shareText(st, sc));
    x.target = '_blank';
    x.rel = 'noopener';
    box.appendChild(x);
  }

  function shareText(st, sc) {
    const n = foundList(st.id).length;
    const total = endingTotal(st);
    return GAME.title + ': ' + st.title + ' — sonum «' + sc.endName + '». ' + n + '/' + total + ' son. ' + GAME.url;
  }
  function xIntent(text) {
    return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
  }
  function wrapText(g, text, x, y, max, lh) {
    const words = String(text || '').split(' ');
    let line = '';
    let yy = y;
    words.forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (g.measureText(test).width > max && line) {
        g.fillText(line, x, yy);
        line = word;
        yy += lh;
      } else line = test;
    });
    if (line) g.fillText(line, x, yy);
    return yy;
  }
  function trackText(g, text, x, y, spacing) {
    const chars = Array.from(text);
    const widths = chars.map(ch => g.measureText(ch).width);
    const total = widths.reduce((sum, n) => sum + n, 0) + spacing * Math.max(0, chars.length - 1);
    let cx = x - total / 2;
    chars.forEach((ch, i) => {
      g.fillText(ch, cx + widths[i] / 2, y);
      cx += widths[i] + spacing;
    });
  }
  function buildCard(st, sc) {
    const W = 1080, H = 1350;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = PAPER;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = INK;
    g.lineWidth = 2;
    g.strokeRect(56, 56, W - 112, H - 112);
    g.strokeRect(70, 70, W - 140, H - 140);
    g.fillStyle = INK;
    g.textAlign = 'center';
    g.font = '500 34px "Iowan Old Style", Palatino, Georgia, "Liberation Serif", "Noto Serif", "Times New Roman", serif';
    trackText(g, GAME.title.toLocaleUpperCase('tr'), W / 2, 220, 10);
    g.strokeStyle = INK;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(180, 300);
    g.lineTo(900, 300);
    g.stroke();
    g.fillStyle = INK;
    g.font = 'italic 500 48px "Iowan Old Style", Palatino, Georgia, "Liberation Serif", "Noto Serif", "Times New Roman", serif';
    wrapText(g, st.title, W / 2, 420, 780, 60);
    g.fillStyle = RED;
    g.font = 'italic 500 84px "Iowan Old Style", Palatino, Georgia, "Liberation Serif", "Noto Serif", "Times New Roman", serif';
    g.fillText(sc.endName, W / 2, 640);
    g.fillStyle = INK;
    g.font = 'italic 400 36px "Iowan Old Style", Palatino, Georgia, "Liberation Serif", "Noto Serif", "Times New Roman", serif';
    wrapText(g, sc.endBlurb || '', W / 2, 730, 760, 48);
    g.strokeStyle = INK;
    g.beginPath();
    g.moveTo(180, 900);
    g.lineTo(900, 900);
    g.stroke();
    const n = foundList(st.id).length;
    const total = endingTotal(st);
    g.font = '400 32px "Iowan Old Style", Palatino, Georgia, "Liberation Serif", "Noto Serif", "Times New Roman", serif';
    g.fillText(n + '/' + total + ' son bulundu', W / 2, 990);
    g.font = '400 26px "Iowan Old Style", Palatino, Georgia, "Liberation Serif", "Noto Serif", "Times New Roman", serif';
    g.fillText(GAME.url.replace('https://', ''), W / 2, 1160);
    return { url: c.toDataURL('image/png'), text: shareText(st, sc), canvas: c };
  }
  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const bin = atob(parts[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: 'image/png' });
  }
  function shareEnding(st, sc) {
    const pack = buildCard(st, sc);
    const file = new File([dataURLToBlob(pack.url)], 'sarnic-son.png', { type: 'image/png' });
    const payload = { files: [file], text: pack.text, title: GAME.title };
    let can = false;
    try { can = !!(navigator.share && navigator.canShare && navigator.canShare(payload)); }
    catch (e) { can = false; }
    if (can) {
      navigator.share(payload).catch(err => {
        if (err && err.name === 'AbortError') return;
        downloadCard(pack);
      });
      return;
    }
    downloadCard(pack);
  }
  function downloadCard(pack) {
    const a = document.createElement('a');
    a.href = pack.url;
    a.download = 'sarnic-son.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function audit(st) {
    st = st || currentStory();
    const scenes = st.scenes;
    const errors = [];
    const seen = new Set();
    const endingsHit = new Set();
    const explored = new Set();
    function keyOf(id, flags) {
      return id + '@' + Object.keys(flags).sort().map(k => k + '=' + flags[k]).join('|');
    }
    function walk(id, flags, stack) {
      if (!scenes[id]) { errors.push('missing ' + id); return; }
      if (stack.indexOf(id) >= 0) { errors.push('cycle ' + stack.concat(id).join('>')); return; }
      const sk = keyOf(id, flags);
      if (explored.has(sk)) return;
      explored.add(sk);
      seen.add(id);
      const sc = scenes[id];
      const mode = sc.sound || 'room';
      if (['room', 'street', 'cistern', 'off'].indexOf(mode) < 0) errors.push('sound ' + id);
      if (sc.ending) { endingsHit.add(sc.ending); return; }
      if (!sc.choices || sc.choices.length !== 3) errors.push('choices ' + id);
      (sc.choices || []).forEach(c => {
        if (!c.t) errors.push('empty choice ' + id);
        const pass = !c.when || c.when(flags);
        const next = Object.assign({}, flags);
        Object.assign(next, pass ? (c.set || {}) : (c.setElse || {}));
        const dest = pass ? c.to : c.else;
        if (!dest) errors.push('no dest ' + id + ' / ' + c.t);
        else walk(dest, next, stack.concat(id));
      });
    }
    walk(st.start, {}, []);
    Object.keys(scenes).forEach(id => { if (!seen.has(id)) errors.push('unreachable ' + id); });
    Object.keys(scenes).forEach(id => {
      const sc = scenes[id];
      if (sc.ending && !endingsHit.has(sc.ending)) errors.push('ending not reached ' + sc.ending);
      if (!sc.ending && (!sc.text || (typeof sc.text === 'string' && sc.text.length < 40))) errors.push('short ' + id);
      if (sc.ending && (!sc.endName || !sc.endBlurb)) errors.push('end card ' + id);
    });
    const endings = Object.keys(scenes).filter(id => scenes[id].ending).map(id => ({
      id: scenes[id].ending,
      name: scenes[id].endName,
      scene: id,
    }));
    return {
      ok: errors.length === 0,
      errors: errors.slice(0, 30),
      choiceScenes: Object.keys(scenes).filter(id => !scenes[id].ending).length,
      endings: endings,
      seen: seen.size,
      scenes: Object.keys(scenes),
    };
  }

  function boot() {
    document.title = GAME.title;
    app = $('app');
    grain();
    document.addEventListener('pointerdown', () => { Sound.resume(); }, { passive: true });
    paint();
  }

  global.Sarnic = {
    GAME: GAME,
    story: story,
    imageSrc: imageSrc,
    coverSrc: coverSrc,
    boot: boot,
    audit: audit,
    Sound: Sound,
    state: state,
    save: save,
    stories() { return STORIES.slice(); },
    buildCard: buildCard,
    shareText: shareText,
    xIntent: xIntent,
    setInstant(v) { global.__instant = !!v; },
    pick(i) {
      const sc = sceneOf();
      if (!sc || sc.ending || !sc.choices || !sc.choices[i]) return null;
      enterChoice(sc.choices[i]);
      return state.sceneId;
    },
    startFresh() { begin(currentStory(), true); },
    goShelf: goShelf,
    currentStory: currentStory,
  };
})(window);
