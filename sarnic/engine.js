'use strict';

/*
 * Sarnıç oynatıcısı.
 * Yeni görselin ilk sayfası yalnız resimdir. Metin, alttan krem bir geçişin
 * üstünde durur. Seçim yalnızca karar sayfasında, tam üç düğmedir.
 */
(function (global) {
  const GAME = {
    title: 'Sarnıç',
    slug: 'sarnic',
    storage: 'sarnic-v2',
  };

  const STORIES = [];
  function story(def) {
    if (!def || !def.id || !def.start) {
      console.error('Sarnıç hikâyesi eksik', def && def.id);
      return;
    }
    STORIES.push(def);
  }
  function activeStory() {
    const current = STORIES.filter(function (s) { return s.current; });
    return current[current.length - 1] || STORIES[STORIES.length - 1] || null;
  }

  const $ = function (id) { return document.getElementById(id); };

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
    mode: 'cover',
    sceneId: null,
    page: -1,
    flags: {},
    image: null,
    ask: false,
  };

  let plateToken = 0;
  function showPlate(src) {
    const plate = $('plate');
    const img = $('plate-img');
    const token = ++plateToken;
    if (!plate || !img) return;
    img.onload = img.onerror = null;
    if (!src) {
      img.removeAttribute('src');
      plate.classList.remove('on');
      return;
    }
    const apply = function (ok) {
      if (token !== plateToken) return;
      plate.classList.toggle('on', ok);
      if (!ok) img.removeAttribute('src');
    };
    img.onload = function () { apply(img.naturalWidth > 0); };
    img.onerror = function () { apply(false); };
    if (img.getAttribute('src') === src && img.complete) {
      apply(img.naturalWidth > 0);
      return;
    }
    img.src = src;
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
    },
    clearTimers() {
      this.timers.forEach(function (t) { clearTimeout(t); });
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
      [146, 154].forEach(function (f) {
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
      }, this);
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
      const self = this;
      const step = function () {
        if (self.mode !== 'street') return;
        self.gull();
        self.later(step, 4000 + Math.random() * 5000);
      };
      this.later(step, 1200);
    },
    queueHorn() {
      const self = this;
      const step = function () {
        if (self.mode !== 'street') return;
        self.horn();
        self.later(step, 16000 + Math.random() * 10000);
      };
      this.later(step, 14000);
    },
    queueDrip() {
      const self = this;
      const step = function () {
        if (self.mode !== 'cistern') return;
        self.drip();
        if (Math.random() < 0.45) {
          self.later(function () { if (self.mode === 'cistern') self.drip(); }, 180 + Math.random() * 140);
        }
        self.later(step, 650 + Math.random() * 900);
      };
      this.later(step, 300);
    },
  };

  function grain() {
    const c = $('grain');
    if (!c) return;
    const g = c.getContext('2d');
    c.width = 180;
    c.height = 180;
    const img = g.createImageData(180, 180);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 150 + Math.random() * 40;
      img.data[i] = n;
      img.data[i + 1] = n - 6;
      img.data[i + 2] = n - 16;
      img.data[i + 3] = 14;
    }
    g.putImageData(img, 0, 0);
  }

  function book() { return activeStory(); }

  function persist() {
    const st = book();
    save.progress = {
      storyId: st ? st.id : null,
      mode: state.mode,
      sceneId: state.sceneId,
      page: state.page,
      flags: state.flags,
      image: state.image,
    };
    writeSave(save);
  }

  function rememberEnding() {
    const st = book();
    if (!st || !state.sceneId) return;
    const list = Array.isArray(save.found[st.id]) ? save.found[st.id].slice() : [];
    if (list.indexOf(state.sceneId) < 0) list.push(state.sceneId);
    save.found[st.id] = list;
  }

  function toast(message) {
    const node = $('toast');
    if (!node) return;
    node.textContent = message;
  }

  function showCover() {
    const st = book();
    state.mode = 'cover';
    state.sceneId = null;
    state.page = -1;
    state.flags = {};
    state.ask = false;
    state.image = st ? st.cover : null;
    Sound.setMode(st && st.coverSound ? st.coverSound : 'street');
    showPlate(state.image);
    persist();
    render();
  }

  function enter(id, via, index) {
    const st = book();
    if (!st || !id) return;
    st.arrive(id, via, index, state.flags);
    const src = st.image(id);
    const changed = src !== state.image;
    state.image = src;
    state.sceneId = id;
    state.mode = 'read';
    state.page = changed ? -1 : 0;
    state.ask = false;
    Sound.setMode(st.sound(id));
    showPlate(src);
    persist();
    render();
  }

  function advance() {
    if (state.ask) return;
    Sound.resume();
    const st = book();
    if (!st) return;
    if (state.mode === 'cover') {
      enter(st.start, null, null);
      return;
    }
    if (state.mode !== 'read') return;
    const lines = st.lines(state.sceneId, state.flags) || [];
    if (state.page < 0) {
      state.page = 0;
      persist();
      render();
      return;
    }
    if (state.page < lines.length - 1) {
      state.page += 1;
      persist();
      render();
      return;
    }
    const choices = st.choices(state.sceneId);
    if (choices && choices.length) return;
    if (st.endingName(state.sceneId)) {
      state.mode = 'end';
      rememberEnding();
      persist();
      render();
      return;
    }
    const nxt = st.next(state.sceneId, state.flags);
    if (!nxt) return;
    enter(nxt, state.sceneId, null);
  }

  function pick(index) {
    const st = book();
    if (!st || state.mode !== 'read' || state.ask) return;
    const choices = st.choices(state.sceneId);
    if (!choices || !choices[index]) return;
    const lines = st.lines(state.sceneId, state.flags) || [];
    if (state.page < lines.length - 1) return;
    Sound.resume();
    enter(choices[index].to, state.sceneId, index);
  }

  function restart() {
    state.ask = false;
    showCover();
  }

  function shareEnding() {
    const st = book();
    const name = st && state.sceneId ? st.endingName(state.sceneId) : '';
    const url = location.href.split('#')[0];
    const payload = {
      title: GAME.title,
      text: (name || 'Bu') + ' sonuna ulaştım.',
      url: url,
    };
    const copy = function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          toast('Bağlantı kopyalandı');
        }).catch(function () {
          toast(url);
        });
        return;
      }
      toast(url);
    };
    if (navigator.share) {
      navigator.share(payload).then(function () {
        toast('');
      }).catch(function (err) {
        if (err && err.name === 'AbortError') return;
        copy();
      });
      return;
    }
    copy();
  }

  function render() {
    const st = book();
    const bare = state.mode === 'cover' || (state.mode === 'read' && state.page < 0);
    document.body.classList.toggle('bare', bare);
    document.body.classList.toggle('reading', !bare);
    document.body.dataset.mode = state.mode;
    document.body.dataset.scene = state.sceneId || '';
    document.body.dataset.page = String(state.page);

    const snd = $('snd');
    if (snd) {
      snd.textContent = Sound.on ? 'ses' : 'sessiz';
      snd.setAttribute('aria-pressed', Sound.on ? 'true' : 'false');
    }

    const sheet = $('sheet');
    const prose = $('prose');
    const choices = $('choices');
    const ask = $('ask');
    const end = $('end');
    if (!sheet) return;
    if (choices) choices.innerHTML = '';
    if (prose) prose.textContent = '';
    toast('');

    if (bare || !st) {
      sheet.hidden = true;
      return;
    }
    sheet.hidden = false;
    sheet.scrollTop = 0;
    if (ask) ask.hidden = !state.ask;
    if (state.ask) {
      if (prose) prose.hidden = true;
      if (choices) choices.hidden = true;
      if (end) end.hidden = true;
      return;
    }
    if (state.mode === 'end') {
      if (prose) prose.hidden = true;
      if (choices) choices.hidden = true;
      if (end) end.hidden = false;
      const name = st.endingName(state.sceneId) || '';
      const line = $('endline');
      if (line) line.textContent = name + ' sonuna ulaştın';
      return;
    }
    if (end) end.hidden = true;
    if (prose) prose.hidden = false;
    const lines = st.lines(state.sceneId, state.flags) || [];
    if (prose) prose.textContent = lines[state.page] || '';
    const opts = st.choices(state.sceneId);
    const last = state.page >= lines.length - 1;
    if (choices) {
      choices.hidden = !(opts && last);
      if (opts && last) {
        opts.forEach(function (choice, index) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'choice';
          button.textContent = choice.t;
          button.addEventListener('click', function () { pick(index); });
          choices.appendChild(button);
        });
      }
    }
  }

  function resume(progress) {
    const st = book();
    state.flags = Object.assign({}, progress.flags || {});
    state.sceneId = progress.sceneId;
    state.page = typeof progress.page === 'number' ? progress.page : 0;
    state.mode = progress.mode || 'read';
    state.ask = false;
    if (state.mode === 'cover' || !state.sceneId) {
      showCover();
      return;
    }
    const lines = st.lines(state.sceneId, state.flags);
    if (!lines) {
      showCover();
      return;
    }
    if (state.page >= lines.length) state.page = lines.length - 1;
    state.image = st.image(state.sceneId);
    Sound.setMode(st.sound(state.sceneId));
    showPlate(state.image);
    render();
  }

  function audit() {
    const st = book();
    const issues = [];
    if (!st) return ['hikâye yok'];
    const ids = st.ids();
    const known = {};
    ids.forEach(function (id) { known[id] = true; });
    const seen = {};
    const queue = [st.start];
    while (queue.length) {
      const id = queue.shift();
      if (!id || seen[id]) continue;
      if (!known[id]) {
        issues.push('yok: ' + id);
        continue;
      }
      seen[id] = true;
      const choices = st.choices(id);
      if (choices) {
        if (choices.length !== 3) issues.push(id + ' seçim ' + choices.length);
        choices.forEach(function (choice) { queue.push(choice.to); });
      } else if (!st.endingName(id)) {
        const flagSets = [
          {},
          { fromPera: true },
          { fledWell: true },
          { goz: true },
          { goz: true, not: true },
        ];
        const nexts = {};
        flagSets.forEach(function (flags) {
          nexts[st.next(id, flags)] = true;
        });
        Object.keys(nexts).forEach(function (nxt) {
          if (!nxt || nxt === 'null' || nxt === 'undefined') issues.push(id + ' çıkmaz');
          else queue.push(nxt);
        });
      }
    }
    ids.forEach(function (id) {
      if (!seen[id]) issues.push('ulaşılamıyor: ' + id);
    });
    return issues;
  }

  function boot() {
    grain();
    const st = book();
    $('hit').addEventListener('click', advance);
    $('sheet').addEventListener('click', function (event) {
      if (event.target.closest('button')) return;
      advance();
    });
    $('snd').addEventListener('click', function () {
      Sound.toggle();
      render();
    });
    $('restart').addEventListener('click', function () {
      Sound.resume();
      if (state.mode === 'cover') return;
      state.ask = !state.ask;
      render();
    });
    $('yes').addEventListener('click', restart);
    $('no').addEventListener('click', function () {
      state.ask = false;
      render();
    });
    $('again').addEventListener('click', restart);
    $('share').addEventListener('click', shareEnding);

    const progress = save.progress;
    if (progress && st && progress.storyId === st.id) resume(progress);
    else showCover();
  }

  global.Sarnic = {
    GAME: GAME,
    story: story,
    boot: boot,
    state: state,
    save: save,
    advance: advance,
    pick: pick,
    restart: restart,
    audit: audit,
    Sound: Sound,
  };
})(window);
