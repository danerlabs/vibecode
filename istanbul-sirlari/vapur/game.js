(function () {
  const VAKA = window.VAKA;
  const UI = VAKA.ui;
  const KEY = "istanbul-sirlari.vapur.v1";
  const ZOOMS = [1, 1.4, 1.9, 2.5];

  const itemsById = Object.create(null);
  VAKA.items.forEach(function (item) { itemsById[item.id] = item; });
  const groupsById = Object.create(null);
  VAKA.groups.forEach(function (group) { groupsById[group.id] = group; });
  const sectionByBlank = Object.create(null);
  const blankById = Object.create(null);
  VAKA.sections.forEach(function (section) {
    section.rows.forEach(function (row) {
      row.pieces.forEach(function (piece) {
        if (piece && piece.blank) {
          sectionByBlank[piece.blank] = section.id;
          blankById[piece.blank] = piece;
        }
      });
    });
  });

  const state = {
    started: false,
    words: [],
    fills: {},
    solved: {},
    inspected: {},
    notes: {},
    selectedWord: null,
    view: "title",
    zoomIndex: 0,
    bankOpen: true,
    modal: null
  };

  const el = {};
  let toastTimer = 0;
  let lastFocus = null;

  function norm(value) {
    return String(value || "")
      .replace(/[’‘]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLocaleLowerCase("tr");
  }

  function isMobile() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || data.v !== 1) return;
      state.started = !!data.started;
      state.words = Array.isArray(data.words) ? data.words.filter(function (w) { return typeof w === "string"; }) : [];
      state.fills = {};
      if (data.fills && typeof data.fills === "object") {
        Object.keys(data.fills).forEach(function (id) {
          if (blankById[id] && typeof data.fills[id] === "string") state.fills[id] = data.fills[id];
        });
      }
      state.solved = {};
      if (data.solved && typeof data.solved === "object") {
        VAKA.sections.forEach(function (section) {
          if (data.solved[section.id]) state.solved[section.id] = true;
        });
      }
      state.inspected = {};
      if (data.inspected && typeof data.inspected === "object") {
        Object.keys(data.inspected).forEach(function (id) {
          if (itemsById[id] && data.inspected[id]) state.inspected[id] = true;
        });
      }
    } catch (err) { /* kayıt yok sayılır */ }
    VAKA.sections.forEach(function (section) {
      if (state.solved[section.id] && !sectionCorrect(section)) delete state.solved[section.id];
    });
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        v: 1,
        started: state.started,
        words: state.words,
        fills: state.fills,
        solved: state.solved,
        inspected: state.inspected
      }));
    } catch (err) { /* gizli pencerede de oyun sürer */ }
  }

  function blankCorrect(id) {
    const piece = blankById[id];
    const value = state.fills[id];
    if (!piece || !value) return false;
    const got = norm(value);
    return piece.accept.some(function (answer) { return norm(answer) === got; });
  }

  function sectionBlanks(section) {
    const ids = [];
    section.rows.forEach(function (row) {
      row.pieces.forEach(function (piece) {
        if (piece && piece.blank) ids.push(piece.blank);
      });
    });
    return ids;
  }

  function sectionCorrect(section) {
    return sectionBlanks(section).every(blankCorrect);
  }

  function allSolved() {
    return VAKA.sections.every(function (section) { return !!state.solved[section.id]; });
  }

  function solvedCount() {
    return VAKA.sections.filter(function (section) { return state.solved[section.id]; }).length;
  }

  function groupItems(group) {
    return group.items.map(function (id) { return itemsById[id]; });
  }

  function groupSeen(group) {
    return group.items.every(function (id) { return state.inspected[id]; });
  }

  function hotspotSeen(spot) {
    if (spot.item) return !!state.inspected[spot.item];
    if (spot.group) return groupSeen(groupsById[spot.group]);
    return false;
  }

  function h(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        if (key === "class") node.className = props[key];
        else if (key === "text") node.textContent = props[key];
        else if (key === "hidden") node.hidden = !!props[key];
        else if (key.indexOf("on") === 0 && typeof props[key] === "function") {
          node.addEventListener(key.slice(2).toLowerCase(), props[key]);
        } else if (props[key] !== null && props[key] !== undefined) {
          node.setAttribute(key, props[key]);
        }
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function build() {
    document.title = UI.pageTitle;
    const app = document.getElementById("app");

    el.title = h("section", { class: "title" }, [
      h("div", { class: "title-scrim" }),
      h("div", { class: "title-inner" }, [
        h("p", { class: "series", text: UI.series }),
        h("h1", { text: UI.caseTitle }),
        h("p", { class: "when", text: UI.when }),
        h("p", { class: "intro", text: UI.intro }),
        h("button", { class: "start-btn", type: "button", text: UI.start, onclick: startGame })
      ])
    ]);

    el.brandSeries = h("p", { class: "series", text: UI.series });
    el.brandTitle = h("h1", { text: UI.caseTitle });
    el.solvedFlag = h("span", { class: "solved-flag", hidden: true, text: UI.caseSolved });
    el.notebookBtn = h("button", { class: "bar-btn primary", type: "button", text: UI.notebook, onclick: function () {
      showView(state.view === "notebook" ? "scene" : "notebook");
    } });
    el.resetBtn = h("button", { class: "bar-btn", type: "button", text: UI.reset, onclick: askReset });

    el.hotspotLayer = h("div", { class: "hotspots" });
    el.sceneImg = h("img", { src: "images/00-ana-sahne.jpg", alt: UI.sceneAlt, draggable: "false" });
    el.frame = h("div", { class: "scene-frame" }, [el.sceneImg, el.hotspotLayer]);
    VAKA.hotspots.forEach(function (spot) {
      const box = spot.box;
      const btn = h("button", {
        class: "hotspot",
        type: "button",
        "data-label": spot.label,
        "aria-label": spot.label,
        onclick: function () { openHotspot(spot); }
      });
      btn.style.left = box[0] + "%";
      btn.style.top = box[1] + "%";
      btn.style.width = box[2] + "%";
      btn.style.height = box[3] + "%";
      btn._spot = spot;
      el.hotspotLayer.appendChild(btn);
    });

    el.stage = h("div", { class: "stage" }, [
      h("div", { class: "scene-sizer" }, [el.frame])
    ]);
    el.zoomOut = h("button", { class: "zoom-btn", type: "button", text: "−", "aria-label": UI.zoomOut, onclick: function () { zoomBy(-1); } });
    el.zoomIn = h("button", { class: "zoom-btn", type: "button", text: "+", "aria-label": UI.zoomIn, onclick: function () { zoomBy(1); } });

    el.notebookPage = h("div", { class: "notebook-page" });
    el.notebook = h("div", { class: "notebook", hidden: true }, [el.notebookPage]);

    el.bankHint = h("p", { class: "bank-hint" });
    el.selectHint = h("p", { class: "select-hint", hidden: true });
    el.bankWords = h("div", { class: "bank-words" });
    el.bankCount = h("span", { class: "bank-count", text: "0" });
    el.bank = h("aside", { class: "bank" }, [
      h("button", {
        class: "bank-toggle",
        type: "button",
        onclick: function () {
          state.bankOpen = !state.bankOpen;
          syncBank();
          layoutScene(false);
        }
      }, [
        h("span", { text: UI.words }),
        el.bankCount
      ]),
      h("div", { class: "bank-body" }, [el.selectHint, el.bankHint, el.bankWords])
    ]);

    el.modalTitle = h("h2", { id: "modal-title" });
    el.modalBack = h("button", { class: "text-btn", type: "button", text: UI.back, hidden: true, onclick: backModal });
    el.modalBody = h("div", { class: "modal-body" });
    el.backdrop = h("div", { class: "backdrop", hidden: true, onclick: function (event) {
      if (event.target === el.backdrop) closeModal();
    } }, [
      h("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title" }, [
        h("div", { class: "modal-bar" }, [
          el.modalBack,
          el.modalTitle,
          h("button", { class: "icon-btn", type: "button", text: "×", "aria-label": UI.close, onclick: closeModal })
        ]),
        el.modalBody
      ])
    ]);

    el.confirm = h("div", { class: "confirm-back", hidden: true }, [
      h("div", { class: "confirm", role: "dialog", "aria-modal": "true" }, [
        h("p", { text: UI.resetAsk }),
        h("div", { class: "confirm-actions" }, [
          h("button", { class: "text-btn", type: "button", text: UI.cancel, onclick: function () { el.confirm.hidden = true; } }),
          h("button", { class: "danger", type: "button", text: UI.resetYes, onclick: doReset })
        ])
      ])
    ]);

    el.toast = h("div", { class: "toast", hidden: true, role: "status" });

    el.play = h("div", { class: "play", hidden: true }, [
      h("header", { class: "topbar" }, [
        h("div", { class: "brand" }, [el.brandSeries, el.brandTitle]),
        el.solvedFlag,
        h("div", { class: "top-actions" }, [el.zoomOut, el.zoomIn, el.notebookBtn, el.resetBtn])
      ]),
      el.stage,
      el.notebook,
      el.bank
    ]);

    app.appendChild(el.title);
    app.appendChild(el.play);
    app.appendChild(el.backdrop);
    app.appendChild(el.confirm);
    app.appendChild(el.toast);

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!el.confirm.hidden) { el.confirm.hidden = true; return; }
      if (!el.backdrop.hidden) { closeModal(); return; }
      if (state.view === "notebook") showView("scene");
    });
    window.addEventListener("resize", function () { if (state.view === "scene") layoutScene(false); });

    if (new URLSearchParams(location.search).has("debug")) document.body.classList.add("debug");
  }

  function startGame() {
    state.started = true;
    save();
    showView("scene");
  }

  function showView(view) {
    state.view = view;
    const playing = view !== "title";
    el.title.hidden = playing;
    el.play.hidden = !playing;
    el.stage.hidden = view !== "scene";
    el.notebook.hidden = view !== "notebook";
    el.notebookBtn.textContent = view === "notebook" ? UI.backToScene : UI.notebook;
    el.zoomOut.hidden = view !== "scene";
    el.zoomIn.hidden = view !== "scene";
    el.solvedFlag.hidden = !allSolved();
    if (view === "notebook") {
      if (isMobile()) state.bankOpen = true;
      renderNotebook({ keepScroll: true });
    }
    syncBank();
    if (view === "scene") {
      layoutScene(true);
      requestAnimationFrame(function () { layoutScene(true); });
    }
  }

  function zoomBy(dir) {
    state.zoomIndex = Math.max(0, Math.min(ZOOMS.length - 1, state.zoomIndex + dir));
    layoutScene(true);
  }

  function layoutScene(recenter) {
    if (state.view !== "scene") return;
    const sw = el.stage.clientWidth - 16;
    const sh = el.stage.clientHeight - 16;
    if (sw < 40 || sh < 40) return;
    const fit = Math.min(sw, sh * 16 / 9);
    const zoom = ZOOMS[state.zoomIndex];
    const width = Math.max(160, fit * zoom);
    el.frame.style.width = width + "px";
    el.frame.style.height = (width * 9 / 16) + "px";
    if (recenter) {
      requestAnimationFrame(function () {
        el.stage.scrollLeft = Math.max(0, (el.stage.scrollWidth - el.stage.clientWidth) / 2);
        el.stage.scrollTop = Math.max(0, (el.stage.scrollHeight - el.stage.clientHeight) / 2);
      });
    }
  }

  function refreshHotspots() {
    Array.prototype.forEach.call(el.hotspotLayer.children, function (btn) {
      btn.classList.toggle("seen", hotspotSeen(btn._spot));
    });
  }

  function openHotspot(spot) {
    if (spot.group) openGroup(spot.group);
    else if (spot.item) openItem(spot.item, null);
  }

  function openGroup(id) {
    state.modal = { type: "group", id: id };
    renderModal();
  }

  function openItem(id, fromGroup) {
    const item = itemsById[id];
    if (!item) return;
    state.inspected[id] = true;
    const fresh = [];
    item.words.forEach(function (word) {
      if (state.words.indexOf(word) === -1) {
        state.words.push(word);
        fresh.push(word);
      }
    });
    save();
    state.modal = { type: "item", id: id, fromGroup: fromGroup || null };
    renderModal();
    refreshHotspots();
    renderBank();
    if (fresh.length) toast(fresh);
  }

  function backModal() {
    if (state.modal && state.modal.fromGroup) openGroup(state.modal.fromGroup);
    else closeModal();
  }

  function closeModal() {
    state.modal = null;
    el.backdrop.hidden = true;
    refreshHotspots();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function renderModal() {
    const modal = state.modal;
    if (!modal) { el.backdrop.hidden = true; return; }
    if (el.backdrop.hidden) lastFocus = document.activeElement;
    el.backdrop.hidden = false;
    el.modalBody.className = "modal-body";
    el.modalBody.textContent = "";
    if (modal.type === "group") {
      const group = groupsById[modal.id];
      el.modalTitle.textContent = group.title;
      el.modalBack.hidden = true;
      el.modalBody.appendChild(h("p", { class: "choose", text: UI.choose }));
      groupItems(group).forEach(function (item) {
        el.modalBody.appendChild(h("button", {
          class: "subitem" + (state.inspected[item.id] ? " seen" : ""),
          type: "button",
          onclick: function () { openItem(item.id, group.id); }
        }, [
          h("span", { text: item.title }),
          state.inspected[item.id] ? h("span", { class: "tick", text: "✓" }) : null
        ]));
      });
    } else {
      const item = itemsById[modal.id];
      el.modalTitle.textContent = item.title;
      el.modalBack.hidden = !modal.fromGroup;
      el.modalBody.classList.add(item.kind || "paper");
      if (item.image) {
        el.modalBody.appendChild(h("img", { class: "shot", src: item.image, alt: item.title }));
      }
      const prose = h("p", { class: "prose" });
      fillProse(prose, item.text, item.words);
      el.modalBody.appendChild(prose);
      const found = h("div", { class: "found" }, [
        h("p", { class: "found-label", text: UI.wordsFrom }),
        h("div", { class: "bank-words" }, item.words.map(function (word) {
          return makeChip(word, false);
        }))
      ]);
      el.modalBody.appendChild(found);
    }
    const closeBtn = el.backdrop.querySelector(".icon-btn");
    if (closeBtn) closeBtn.focus();
  }

  function isWordChar(ch) {
    return !!ch && /[\p{L}\p{N}]/u.test(ch);
  }

  function fillProse(container, text, words) {
    const lower = text.toLocaleLowerCase("tr");
    if (lower.length !== text.length) {
      container.textContent = text;
      return;
    }
    const taken = [];
    const sorted = words.slice().sort(function (a, b) { return b.length - a.length; });
    sorted.forEach(function (word) {
      const needle = word.toLocaleLowerCase("tr");
      if (!needle || needle.length !== word.length) return;
      let from = 0;
      while (from <= lower.length - needle.length) {
        const index = lower.indexOf(needle, from);
        if (index < 0) break;
        const end = index + needle.length;
        const prev = index > 0 ? lower.charAt(index - 1) : "";
        const next = end < lower.length ? lower.charAt(end) : "";
        const overlaps = taken.some(function (range) { return index < range.end && end > range.start; });
        if (!overlaps && !isWordChar(prev) && !isWordChar(next)) {
          taken.push({ start: index, end: end, word: word });
        }
        from = index + 1;
      }
    });
    taken.sort(function (a, b) { return a.start - b.start; });
    let cursor = 0;
    taken.forEach(function (range) {
      if (range.start > cursor) container.appendChild(document.createTextNode(text.slice(cursor, range.start)));
      const chip = makeChip(range.word, true);
      chip.textContent = text.slice(range.start, range.end);
      container.appendChild(chip);
      cursor = range.end;
    });
    if (cursor < text.length) container.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function makeChip(word, inline) {
    const chip = h("button", {
      class: "word-chip" + (inline ? " inline" : "") + (state.selectedWord === word ? " selected" : ""),
      type: "button",
      "data-word": word,
      text: word
    });
    chip.addEventListener("pointerdown", function (event) { onChipPointerDown(event, chip, word); });
    chip.addEventListener("click", function () {
      if (chip._suppressClick) { chip._suppressClick = false; return; }
      selectWord(word);
    });
    return chip;
  }

  function onChipPointerDown(event, chip, word) {
    if (event.pointerType === "touch" || event.button > 0) return;
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    let ghost = null;
    try { chip.setPointerCapture(event.pointerId); } catch (err) { /* yoksay */ }

    function clearOver() {
      document.querySelectorAll(".blank.over").forEach(function (node) { node.classList.remove("over"); });
    }
    function move(ev) {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
      moved = true;
      if (!ghost) {
        ghost = h("div", { class: "word-chip drag-ghost", text: word });
        document.body.appendChild(ghost);
      }
      ghost.style.left = ev.clientX + "px";
      ghost.style.top = ev.clientY + "px";
      clearOver();
      const under = document.elementFromPoint(ev.clientX, ev.clientY);
      const blank = under && under.closest ? under.closest(".blank") : null;
      if (blank) blank.classList.add("over");
    }
    function up(ev) {
      chip.removeEventListener("pointermove", move);
      chip.removeEventListener("pointerup", up);
      chip.removeEventListener("pointercancel", up);
      clearOver();
      if (ghost) ghost.remove();
      if (!moved) return;
      chip._suppressClick = true;
      const under = document.elementFromPoint(ev.clientX, ev.clientY);
      const blank = under && under.closest ? under.closest(".blank") : null;
      if (blank) placeWord(blank.getAttribute("data-blank"), word);
    }
    chip.addEventListener("pointermove", move);
    chip.addEventListener("pointerup", up);
    chip.addEventListener("pointercancel", up);
  }

  function selectWord(word) {
    state.selectedWord = state.selectedWord === word ? null : word;
    document.querySelectorAll(".word-chip").forEach(function (chip) {
      chip.classList.toggle("selected", chip.getAttribute("data-word") === state.selectedWord);
    });
    renderSelectHint();
  }

  function renderSelectHint() {
    el.selectHint.textContent = "";
    if (!state.selectedWord) { el.selectHint.hidden = true; return; }
    el.selectHint.hidden = false;
    el.selectHint.appendChild(document.createTextNode(UI.selected + ": "));
    el.selectHint.appendChild(h("strong", { text: state.selectedWord }));
    el.selectHint.appendChild(document.createTextNode(" — " + UI.tapHint));
  }

  function renderBank() {
    el.bankCount.textContent = String(state.words.length);
    el.bankWords.textContent = "";
    if (!state.words.length) {
      el.bankHint.hidden = false;
      el.bankHint.textContent = UI.wordsEmpty;
    } else {
      el.bankHint.hidden = true;
      state.words.forEach(function (word) {
        el.bankWords.appendChild(makeChip(word, false));
      });
    }
    renderSelectHint();
    syncBank();
  }

  function syncBank() {
    el.bank.classList.toggle("open", state.bankOpen);
  }

  function toast(words) {
    const label = words.length === 1 ? UI.newWord : UI.newWords;
    el.toast.textContent = label + ": " + words.join(", ");
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.hidden = true; }, 2600);
    if (!state.bankOpen) {
      state.bankOpen = true;
      syncBank();
      layoutScene(false);
    }
  }

  function placeWord(blankId, word) {
    const sectionId = sectionByBlank[blankId];
    if (!sectionId || state.solved[sectionId] || !blankById[blankId]) return;
    state.fills[blankId] = word;
    delete state.notes[sectionId];
    save();
    if (state.view === "notebook") renderNotebook({ keepScroll: true });
  }

  function clearBlank(blankId) {
    const sectionId = sectionByBlank[blankId];
    if (!sectionId || state.solved[sectionId]) return;
    delete state.fills[blankId];
    delete state.notes[sectionId];
    save();
    renderNotebook({ keepScroll: true });
  }

  function checkSection(section) {
    if (state.solved[section.id]) return;
    if (sectionCorrect(section)) {
      const wasDone = allSolved();
      state.solved[section.id] = true;
      delete state.notes[section.id];
      save();
      el.solvedFlag.hidden = !allSolved();
      renderNotebook({ scrollEnding: !wasDone && allSolved(), keepScroll: wasDone || !allSolved() });
      return;
    }
    state.notes[section.id] = UI.wrong;
    renderNotebook({ keepScroll: true });
  }

  function renderNotebook(opts) {
    opts = opts || {};
    const scroll = el.notebook.scrollTop;
    el.notebookPage.textContent = "";
    el.notebookPage.appendChild(h("p", { class: "help", text: UI.help }));
    const done = solvedCount();
    el.notebookPage.appendChild(h("p", { class: "hint", text: UI.progress + " " + done + " / " + VAKA.sections.length }));

    VAKA.sections.forEach(function (section) {
      const solved = !!state.solved[section.id];
      const card = h("section", { class: "section" + (solved ? " solved" : ""), id: "bolum-" + section.id });
      card.appendChild(h("h2", {}, [
        h("span", { class: "kicker", text: section.kicker }),
        document.createTextNode(section.title)
      ]));
      if (section.hint) card.appendChild(h("p", { class: "hint", text: section.hint }));
      section.rows.forEach(function (row) {
        const rowEl = h("div", { class: "row" });
        if (row.caption) rowEl.appendChild(h("p", { class: "cap", text: row.caption }));
        const sentence = h("p", { class: "sentence" });
        row.pieces.forEach(function (piece) {
          if (typeof piece === "string") {
            sentence.appendChild(document.createTextNode(piece));
            return;
          }
          if (solved) {
            sentence.appendChild(h("span", { class: "filled-word", text: state.fills[piece.blank] || "" }));
            return;
          }
          sentence.appendChild(renderBlank(piece.blank));
        });
        rowEl.appendChild(sentence);
        card.appendChild(rowEl);
      });
      const foot = h("div", { class: "section-foot" });
      if (!solved) {
        foot.appendChild(h("button", {
          class: "check-btn",
          type: "button",
          text: UI.check,
          onclick: function () { checkSection(section); }
        }));
      }
      if (state.notes[section.id]) foot.appendChild(h("p", { class: "note-bad", text: state.notes[section.id] }));
      if (foot.childNodes.length) card.appendChild(foot);
      if (solved) card.appendChild(h("p", { class: "tasdik", text: section.confirm }));
      el.notebookPage.appendChild(card);
    });

    if (allSolved()) {
      el.notebookPage.appendChild(h("article", { class: "ending", id: "kapanis" }, [
        h("h2", { text: UI.endingTitle }),
        h("p", { text: VAKA.ending })
      ]));
    }

    if (opts.scrollEnding) {
      const ending = document.getElementById("kapanis");
      if (ending) ending.scrollIntoView({ block: "start" });
    } else if (opts.keepScroll) {
      el.notebook.scrollTop = scroll;
    }
  }

  function renderBlank(id) {
    const value = state.fills[id];
    const blank = h("span", {
      class: "blank" + (value ? " filled" : " empty"),
      "data-blank": id
    });
    const main = h("button", {
      class: "blank-main",
      type: "button",
      "aria-label": value ? value : UI.blank,
      onclick: function () {
        if (state.selectedWord) placeWord(id, state.selectedWord);
      }
    });
    if (value) main.appendChild(h("span", { class: "blank-word", text: value }));
    else main.appendChild(h("span", { class: "ghost", text: "……" }));
    blank.appendChild(main);
    if (value) {
      blank.appendChild(h("button", {
        class: "blank-x",
        type: "button",
        "aria-label": UI.clearBlank,
        text: "×",
        onclick: function () { clearBlank(id); }
      }));
    }
    return blank;
  }

  function askReset() {
    el.confirm.hidden = false;
  }

  function doReset() {
    try { localStorage.removeItem(KEY); } catch (err) { /* yoksay */ }
    location.reload();
  }

  load();
  state.bankOpen = !isMobile();
  build();
  renderBank();
  refreshHotspots();
  showView(state.started ? "scene" : "title");
})();
