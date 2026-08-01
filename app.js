const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Toast ---------- */
const toastRoot = $("#toast-root");
const TOAST_ICON = '<span class="toast-ico"><svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = TOAST_ICON + "<span></span>";
  el.lastElementChild.textContent = msg;
  toastRoot.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-in")));
  setTimeout(() => {
    el.classList.remove("is-in");
    setTimeout(() => el.remove(), 550);
  }, 2600);
  while (toastRoot.children.length > 3) toastRoot.firstElementChild.remove();
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-toast]");
  if (t) toast(t.dataset.toast);
});

/* ---------- Reveal on scroll ---------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add("revealed");
        revealIO.unobserve(en.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
$$("[data-reveal]").forEach((el) => revealIO.observe(el));

/* ---------- Progress bar + nav behavior ---------- */
const progressBar = $("#progress-bar");
const nav = $("#nav");
let lastY = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  nav.classList.toggle("is-hidden", y > 480 && y > lastY && !navOverlay.classList.contains("is-open"));
  lastY = y;
}, { passive: true });

/* ---------- Mobile nav overlay ---------- */
const navToggle = $("#nav-toggle");
const navOverlay = $("#nav-overlay");
function setOverlay(open) {
  navToggle.classList.toggle("is-open", open);
  navOverlay.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open);
  navOverlay.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
}
navToggle.addEventListener("click", () => setOverlay(!navOverlay.classList.contains("is-open")));
$$(".ovl-link", navOverlay).forEach((a) => a.addEventListener("click", () => setOverlay(false)));

/* ---------- Animated counters ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const pad = parseInt(el.dataset.pad || "0", 10);
  const dur = 1400;
  const t0 = performance.now();
  function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    let val = Math.round(target * eased).toString();
    if (pad) val = val.padStart(pad, "0");
    el.textContent = val + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        animateCount(en.target);
        countIO.unobserve(en.target);
      }
    }
  },
  { threshold: 0.5 }
);
$$("[data-count]").forEach((el) => countIO.observe(el));

/* ---------- Donut chart ---------- */
const DONUT = [
  { pct: 82, color: 0 },
  { pct: 14, color: 1 },
  { pct: 3, color: 2 },
  { pct: 1, color: 3 },
];
const donutSegs = $$(".donut-seg");
const donutValue = $("#donut-value");
const CIRC = 2 * Math.PI * 70;
function renderDonut(progress) {
  let offset = 0;
  donutSegs.forEach((seg, i) => {
    const len = (DONUT[i].pct / 100) * CIRC * progress;
    const gap = CIRC - len;
    seg.style.strokeDasharray = `${Math.max(len - 2.5, 0)} ${gap + 2.5}`;
    seg.style.strokeDashoffset = -offset;
    offset += len;
  });
}
function animateDonut() {
  donutSegs.forEach((s) => {
    s.style.strokeDasharray = `0 ${CIRC}`;
    s.style.strokeDashoffset = 0;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => renderDonut(1)));
  const t0 = performance.now();
  const dur = 1400;
  function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    donutValue.textContent = Math.round(82 * eased) + "%";
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const donutIO = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateDonut();
      donutIO.disconnect();
    }
  },
  { threshold: 0.4 }
);
if (donutSegs.length) donutIO.observe($(".donut-wrap"));

/* ---------- Dash live clock ---------- */
const clockEl = $("#dash-clock");
function tickClock() {
  const now = new Date();
  const date = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  clockEl.textContent = `${date} · ${time}`;
}
if (clockEl) {
  tickClock();
  setInterval(tickClock, 1000);
}

/* ---------- Refresh button ---------- */
$("#dash-refresh").addEventListener("click", function () {
  this.classList.remove("is-spinning");
  void this.offsetWidth;
  this.classList.add("is-spinning");
  animateDonut();
  $$(".resumo-item strong[data-count]").forEach(animateCount);
  toast("Dados atualizados agora mesmo");
});

/* ---------- Data: beds ---------- */
const BEDS = {
  201: { name: "Maria Silva Santos", age: 68, status: "Em dia", tone: "ok" },
  202: { name: "João Oliveira", age: 54, status: "Medicação em 30 min", tone: "warn" },
  203: { name: "Ana Carolina Lima", age: 72, status: "Dipirona atrasada há 25 min", tone: "alert" },
  204: { name: "Pedro Henrique", age: 60, status: "Em dia", tone: "ok" },
  205: { name: "Lucia Fernandes", age: 45, status: "Em dia", tone: "ok" },
  206: { name: "Carlos Andrade", age: 71, status: "Em dia", tone: "ok" },
  207: { name: "Paula R. Mendes", age: 39, status: "Em dia", tone: "ok" },
  208: { name: "Roberto Nunes", age: 66, status: "Em dia", tone: "ok" },
  209: { name: "Fernanda Costa", age: 52, status: "Em dia", tone: "ok" },
  210: { name: "Marcos Vinícius", age: 48, status: "Em dia", tone: "ok" },
  211: { name: "Beatriz Almeida", age: 75, status: "Em dia", tone: "ok" },
  212: { name: "Antônio Ribeiro", age: 63, status: "Em dia", tone: "ok" },
  213: { name: "Camila Duarte", age: 34, status: "Em dia", tone: "ok" },
  214: { name: "Eduardo Ramos", age: 58, status: "Insulina atrasada há 40 min", tone: "alert" },
  215: { name: "Sônia Pereira", age: 69, status: "Em dia", tone: "ok" },
  216: { name: "Ricardo Teles", age: 44, status: "Em dia", tone: "ok" },
  217: { name: "Helena Barros", age: 81, status: "Em dia", tone: "ok" },
  218: { name: "Gabriel Siqueira", age: 29, status: "Em dia", tone: "ok" },
  219: { name: "Teresa Moura", age: 73, status: "Curativo em 15 min", tone: "warn" },
  220: { name: "Vitor Cardoso", age: 56, status: "Em dia", tone: "ok" },
  221: { name: "Irene Lopes", age: 62, status: "Em dia", tone: "ok" },
  222: { name: "Sérgio Matos", age: 50, status: "Em dia", tone: "ok" },
  223: { name: "Nádia Freitas", age: 47, status: "Em dia", tone: "ok" },
  224: { name: null, age: null, status: "Leite livre para admissão", tone: "free" },
};
const TONE_LABEL = { ok: "Em dia", warn: "Atenção", alert: "Atrasado", free: "Livre" };

/* ---------- Bed map (dashboard) ---------- */
const bedMap = $("#bed-map");
const bedDetail = $("#bed-detail");
const ALAS = [
  { label: "Ala A", range: [201, 208] },
  { label: "Ala B", range: [209, 216] },
  { label: "Ala C", range: [217, 224] },
];
function selectBed(num) {
  $$(".bed-tile", bedMap).forEach((t) => t.classList.toggle("is-selected", t.dataset.bed == num));
  const b = BEDS[num];
  const chipClass = { ok: "status-chip--ok", warn: "status-chip--warn", alert: "status-chip--alert", free: "status-chip--idle" }[b.tone];
  bedDetail.innerHTML = `
    <div class="bed-detail-icon">
      <svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="bed-detail-text">
      <strong>Leito ${num} · ${b.name ?? "Livre"}</strong>
      <span>${b.age ? b.age + " anos · " : ""}${b.status}</span>
    </div>
    <span class="status-chip ${chipClass}">${TONE_LABEL[b.tone]}</span>`;
}
if (bedMap) {
  for (const ala of ALAS) {
    const alaEl = document.createElement("div");
    alaEl.className = "bed-ala";
    alaEl.innerHTML = `<span class="bed-ala-label">${ala.label}</span>`;
    const row = document.createElement("div");
    row.className = "bed-row";
    for (let n = ala.range[0]; n <= ala.range[1]; n++) {
      const tile = document.createElement("button");
      tile.className = `bed-tile bed-tile--${BEDS[n].tone}`;
      tile.dataset.bed = n;
      tile.textContent = n;
      tile.setAttribute("aria-label", `Leito ${n} — ${BEDS[n].name ?? "livre"}`);
      tile.addEventListener("click", () => selectBed(n));
      row.appendChild(tile);
    }
    alaEl.appendChild(row);
    bedMap.appendChild(alaEl);
  }
  selectBed(203);
}
$("#ward-select").addEventListener("click", () => toast("Demo: apenas Enfermaria 2A disponível"));
$("#hospital-select").addEventListener("click", () => toast("Demo: apenas uma unidade disponível"));
$("#filter-btn").addEventListener("click", () => toast("Demo: filtros indisponíveis"));

/* ---------- Timeline ---------- */
const TIMELINE = [
  { time: "08:00", med: "Dipirona 1g EV", where: "Leito 203 — Ana C. Lima", status: "Atrasada 25 min", tone: "alert" },
  { time: "08:15", med: "Ceftriaxona 1g EV", where: "Leito 105 — Carlos A. B.", status: "Administrada", tone: "ok" },
  { time: "08:30", med: "Metoprolol 50mg VO", where: "Leito 201 — Maria S. Santos", status: "Em 10 min", tone: "warn" },
  { time: "09:00", med: "Insulina Regular 10UI SC", where: "Leito 118 — João P. Silva", status: "Agendada", tone: "idle" },
  { time: "09:30", med: "Omeprazol 40mg EV", where: "Leito 207 — Paula R. M.", status: "Agendada", tone: "idle" },
];
const tlEl = $("#timeline");
if (tlEl) {
  const icons = {
    alert: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none"><path d="m6 12.5 4 4 8-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    idle: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.4" stroke="currentColor" stroke-width="2.2"/></svg>',
  };
  const chip = { alert: "status-chip--alert", ok: "status-chip--ok", warn: "status-chip--warn", idle: "status-chip--idle" };
  for (const item of TIMELINE) {
    const li = document.createElement("li");
    li.className = `tl-item tl-item--${item.tone}`;
    li.innerHTML = `
      <span class="tl-time">${item.time}</span>
      <span class="tl-dot">${icons[item.tone]}</span>
      <div class="tl-card">
        <strong>${item.med}</strong>
        <span>${item.where}</span>
        <span class="status-chip ${chip[item.tone]}">${item.status}</span>
      </div>`;
    tlEl.appendChild(li);
  }
}

/* ---------- Phone 1: leitos list ---------- */
const pleitos = $("#pleitos");
const PHONE_BEDS = [201, 202, 203, 204, 205];
const BED_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
if (pleitos) {
  for (const n of PHONE_BEDS) {
    const b = BEDS[n];
    const chipClass = { ok: "status-chip--ok", warn: "status-chip--warn", alert: "status-chip--alert" }[b.tone];
    const [main, sub] = n === 203 ? ["Atrasada", "25 min"] : n === 202 ? ["Medicação", "30 min"] : ["Em dia", ""];
    const el = document.createElement("button");
    el.className = `pleito ${b.tone === "alert" ? "pleito--alert" : ""}`;
    el.innerHTML = `
      <span class="pleito-ico">${BED_ICON}</span>
      <span class="pleito-info">
        <strong>Leito ${n}</strong>
        <span>${b.name}, ${b.age} anos</span>
      </span>
      <span class="status-chip ${chipClass}">${main}${sub ? `<b>${sub}</b>` : ""}</span>`;
    el.addEventListener("click", () => toast(`Leito ${n} — ${b.name}`));
    pleitos.appendChild(el);
  }
}

/* ---------- Phone bottom nav ---------- */
$$(".pnav-item").forEach((item) => {
  item.addEventListener("click", () => {
    $$(".pnav-item").forEach((i) => i.classList.remove("is-active"));
    item.classList.add("is-active");
    if (item.dataset.pnav !== "Início") toast(`Demo: aba "${item.dataset.pnav}" indisponível`);
  });
});

/* ---------- Voice recording simulation ---------- */
const voice = $("#voice");
const voiceMic = $("#voice-mic");
const voiceHint = $("#voice-hint");
const voiceText = $("#voice-text");
const voiceFinish = $("#voice-finish");
const voiceCancel = $("#voice-cancel");
const voiceWave = $("#voice-wave");
const TRANSCRIPTION =
  "Paciente relata dor leve em hipogástrio. Administrado dipirona 1g EV às 08h. Sinais vitais estáveis. Sem intercorrências.";

const BAR_COUNT = 42;
const bars = [];
for (let i = 0; i < BAR_COUNT; i++) {
  const bar = document.createElement("i");
  const wave = Math.sin(i / 2.6) * 0.5 + 0.5;
  const jitter = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const h = 14 + wave * 34 + jitter * 22;
  bar.style.setProperty("--h", h.toFixed(0) + "px");
  bar.style.setProperty("--i", i);
  voiceWave.appendChild(bar);
  bars.push(bar);
}

let typingTimer = null;
let voiceState = "idle";

function setVoiceIdle() {
  voiceState = "idle";
  voice.classList.remove("is-live");
  voiceHint.innerHTML = "<strong>Toque para gravar</strong>";
  voiceText.textContent = "A transcrição aparecerá aqui em tempo real…";
  voiceText.classList.add("is-placeholder");
  voiceFinish.disabled = true;
  voiceFinish.textContent = "Finalizar e Salvar";
  voiceFinish.classList.remove("is-done");
  clearInterval(typingTimer);
}

function startVoice() {
  if (voiceState === "recording") return;
  voiceState = "recording";
  voice.classList.add("is-live");
  voiceHint.innerHTML = '<span class="listening">Ouvindo…</span> fale agora';
  voiceText.textContent = "";
  voiceText.classList.remove("is-placeholder");
  const caret = document.createElement("span");
  caret.className = "caret";
  voiceText.appendChild(caret);
  let i = 0;
  clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    i += 2;
    voiceText.firstChild ? (voiceText.textContent = TRANSCRIPTION.slice(0, i)) : null;
    voiceText.appendChild(caret);
    if (i >= TRANSCRIPTION.length) {
      clearInterval(typingTimer);
      caret.remove();
      voiceFinish.disabled = false;
      voiceHint.innerHTML = "<strong>Transcrição concluída</strong>";
    }
  }, 34);
}

function finishVoice() {
  if (voiceState !== "recording" || voiceFinish.disabled) return;
  voiceState = "done";
  clearInterval(typingTimer);
  voice.classList.remove("is-live");
  voiceFinish.textContent = "✓ Registro salvo";
  voiceFinish.classList.add("is-done");
  voiceFinish.disabled = true;
  voiceHint.innerHTML = "<strong>Evolução anexada ao leito 203</strong>";
  toast("Registro de voz salvo no prontuário");
  setTimeout(setVoiceIdle, 2600);
}

voiceMic.addEventListener("click", () => {
  if (voiceState === "idle") startVoice();
  else if (voiceState === "recording") toast("Gravando… finalize ou cancele");
});
voiceFinish.addEventListener("click", finishVoice);
voiceCancel.addEventListener("click", () => {
  if (voiceState === "idle") {
    toast("Nada para cancelar");
    return;
  }
  setVoiceIdle();
  toast("Gravação descartada");
});
setVoiceIdle();

const fab = $("#pnav-fab");
fab.addEventListener("click", () => {
  const phoneCol = voiceMic.closest(".phone-col");
  phoneCol.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  setTimeout(startVoice, 500);
});

/* ---------- Steppers ---------- */
$$(".stepper").forEach((stepper) => {
  const val = $(".step-val", stepper);
  const min = parseFloat(stepper.dataset.min);
  const max = parseFloat(stepper.dataset.max);
  const step = parseFloat(stepper.dataset.step);
  const comma = stepper.dataset.comma === "1";
  function apply(dir) {
    let v = parseFloat(val.dataset.value) + dir * step;
    v = Math.min(Math.max(v, min), max);
    v = Math.round(v * 10) / 10;
    val.dataset.value = v;
    val.textContent = comma ? v.toFixed(1).replace(".", ",") : v;
    val.classList.remove("is-bumping");
    void val.offsetWidth;
    val.classList.add("is-bumping");
  }
  $$(".step-btn", stepper).forEach((btn) =>
    btn.addEventListener("click", () => apply(parseInt(btn.dataset.dir, 10)))
  );
});

$("#vitals-save").addEventListener("click", () => toast("Sinais vitais salvos — Leito 203"));

const miniTemp = $("#mini-temp");
let miniVal = 36.7;
$$("[data-mini]").forEach((btn) =>
  btn.addEventListener("click", () => {
    miniVal = Math.min(Math.max(miniVal + parseInt(btn.dataset.mini, 10) * 0.1, 32), 43);
    miniVal = Math.round(miniVal * 10) / 10;
    miniTemp.textContent = miniVal.toFixed(1).replace(".", ",");
    miniTemp.classList.remove("is-bumping");
    void miniTemp.offsetWidth;
    miniTemp.classList.add("is-bumping");
  })
);

/* ---------- Mini wave (bento) ---------- */
const miniWave = $(".mini-wave");
if (miniWave) {
  for (let i = 0; i < 34; i++) {
    const bar = document.createElement("i");
    const wave = Math.sin(i / 2.2) * 0.5 + 0.5;
    const jitter = Math.abs(Math.sin(i * 7.13) * 913.7) % 1;
    bar.style.setProperty("--h", (18 + wave * 55 + jitter * 27).toFixed(0));
    bar.style.setProperty("--i", i);
    miniWave.appendChild(bar);
  }
}

/* ---------- Med tabs ---------- */
const medTabs = $$(".med-tab");
const medInk = $("#med-tab-ink");
function moveInk(tab) {
  medInk.style.width = tab.offsetWidth + "px";
  medInk.style.transform = `translateX(${tab.offsetLeft}px)`;
}
medTabs.forEach((tab, idx) => {
  tab.addEventListener("click", () => {
    medTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    $$(".med-panel").forEach((p) => p.classList.remove("is-active"));
    $("#tab-" + tab.dataset.tab).classList.add("is-active");
    moveInk(tab);
  });
});
if (medTabs.length) {
  moveInk(medTabs[0]);
  addEventListener("resize", () => moveInk($(".med-tab.is-active")));
}

/* ---------- Palette copy ---------- */
$$(".swatch").forEach((sw) => {
  sw.addEventListener("click", async () => {
    const hex = sw.dataset.hex;
    try {
      await navigator.clipboard.writeText(hex);
      toast(`${hex} copiado para a área de transferência`);
    } catch {
      toast(`Cor ${hex}`);
    }
    sw.classList.add("is-copied");
    setTimeout(() => sw.classList.remove("is-copied"), 1200);
  });
});

/* ---------- Dash nav active state ---------- */
$$(".dnav-item").forEach((item) => {
  item.addEventListener("click", () => {
    $$(".dnav-item").forEach((i) => i.classList.remove("is-active"));
    item.classList.add("is-active");
  });
});

/* ---------- Magnetic buttons ---------- */
if (matchMedia("(pointer:fine)").matches) {
  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.transform = `translate(${x * 6}px, ${y * 5}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}
