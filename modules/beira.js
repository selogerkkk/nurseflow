/* ============================================================
   Módulo: Beira de Leito & SAE
   Cabeceira digital + evolução por voz (simulada) + SAE (NANDA/NIC/NOC)
   Spec: docs/features/03-beira-leito-sae.md
   ============================================================ */

/* ---------- Dados da feature ---------- */
/* Ditado simulado (digitação progressiva, palavra a palavra) */
const BEIRA_DICTATION =
  "Paciente lúcido, orientado em tempo e espaço, sem queixas neste momento. " +
  "Refere dor leve na ferida operatória, avaliada em 2 na escala numérica. " +
  "Aceitou a dieta prescrita sem náuseas ou vômitos. " +
  "Diurese espontânea, com urina amarelo-clara. " +
  "Membros inferiores sem edema. Sinais vitais estáveis.";

/* Estrutura SAE gerada após a transcrição */
const BEIRA_SAE = {
  texto:
    "Paciente lúcido e orientado, sem queixas no momento. Refere dor leve na ferida operatória (EVA 2/10). " +
    "Aceitou dieta prescrita sem náuseas. Diurese espontânea, urina amarelo-clara. " +
    "Membros inferiores sem edema. Sinais vitais estáveis. " +
    "Conduta: manter analgesia prescrita, orientar mudança de decúbito a cada 2h, observar sinais flogísticos na ferida.",
  nanda: "00132 — Dor aguda",
  nic: "1400 — Manejo da dor; 2300 — Administração de medicação; 7110 — Cuidados com a ferida",
  noc: "1605 — Controle da dor; 1102 — Tolerância à atividade",
};

/* Pool de medicamentos (prescrição demonstrada por paciente) */
const BEIRA_MEDS = [
  { nome: "Dipirona", dose: "1g", via: "EV", freq: "6/6h", horarios: "08h · 14h · 20h · 02h", status: "Ativa", tone: "ok" },
  { nome: "Ceftriaxona", dose: "1g", via: "EV", freq: "12/12h", horarios: "08h · 20h", status: "Ativa", tone: "ok" },
  { nome: "Omeprazol", dose: "40mg", via: "EV", freq: "24/24h", horarios: "06h", status: "Ativa", tone: "ok" },
  { nome: "Enoxaparina", dose: "40mg", via: "SC", freq: "24/24h", horarios: "18h", status: "Ativa", tone: "ok" },
  { nome: "Soro fisiológico 0,9%", dose: "500mL", via: "EV", freq: "8/8h", horarios: "06h · 14h · 22h", status: "Ativa", tone: "ok" },
  { nome: "Paracetamol", dose: "750mg", via: "VO", freq: "6/6h", horarios: "06h · 12h · 18h · 00h", status: "Ativa", tone: "ok" },
  { nome: "Losartana", dose: "50mg", via: "VO", freq: "12/12h", horarios: "08h · 20h", status: "Ativa", tone: "ok" },
  { nome: "Tramadol", dose: "100mg", via: "EV", freq: "8/8h", horarios: "10h · 18h · 02h", status: "Em revisão", tone: "warn" },
  { nome: "Insulina NPH", dose: "30UI", via: "SC", freq: "24/24h", horarios: "22h", status: "Suspensa", tone: "alert" },
  { nome: "Metoclopramida", dose: "10mg", via: "EV", freq: "8/8h", horarios: "08h · 16h · 00h", status: "Suspensa", tone: "alert" },
  { nome: "Ácido acetilsalicílico", dose: "100mg", via: "VO", freq: "24/24h", horarios: "08h", status: "Ativa", tone: "ok" },
  { nome: "Dipirona", dose: "500mg", via: "VO", freq: "6/6h", horarios: "06h · 12h · 18h · 00h", status: "Ativa", tone: "ok" },
];

/* ---------- Ícones (SVG inline, stroke currentColor) ---------- */
const BEIRA_ICONS = {
  mic: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 0 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5.5 10.5v1a6.5 6.5 0 0 0 13 0v-1M12 18.5V21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  doctor: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 0v4m0 0 2.5 2.5M12 16l-2.5 2.5M12 16v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 5 6v5c0 4.6 3 8.4 7 10 4-1.6 7-5.4 7-10V6l-7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m9.2 12 2 2 3.6-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lung: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 4v4.5M15 4v4.5M12 4v5m-6.5 4.5c0 2-1 3.5-2.5 4.5l1 4c1.8-.5 2.6-1.5 3-3.5.5-2 2-3 3-4.5V9.5M18.5 13.5c0 2 1 3.5 2.5 4.5l-1 4c-1.8-.5-2.6-1.5-3-3.5-.5-2-2-3-3-4.5V9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rx: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18m-7-2h14M8 5h8M12 5v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  drip: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  pill: '<svg viewBox="0 0 24 24" fill="none"><path d="m8 8 8 8a3.5 3.5 0 1 0-5-5l-3 3a3.5 3.5 0 1 0 5 5l5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ---------- Helpers ---------- */
const BEIRA_ORB = (svg) => '<span class="btn-orb">' + svg + "</span>";

function beiraHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function beiraInitials(name) {
  return String(name || "—").split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "—";
}
function beiraRelTime(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "agora";
  if (m < 60) return m + "min atrás";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h atrás";
  const d = Math.floor(h / 24);
  return d === 1 ? "1 dia atrás" : d + " dias atrás";
}
function beiraCritLabel(c) {
  return c === "critica" ? "Crítica" : c === "alta" ? "Alta" : "Normal";
}
function beiraCritChip(c) {
  return c === "critica" ? "status-chip--alert" : c === "alta" ? "status-chip--warn" : "status-chip--ok";
}

/* Alertas clínicos determinísticos (hash do id do paciente) */
function beiraAlerts(patient, bed) {
  const out = [];
  const h = beiraHash(patient.id);
  if (patient.alergias && patient.alergias.toLowerCase() !== "nenhuma conhecida") {
    out.push({ tone: "red", sev: "Alergia", title: "Alergia: " + patient.alergias, detail: "Evitar exposição. Conferir pulseira de identificação.", icon: "alert" });
  }
  if (bed.isolamento || h % 9 === 0) {
    out.push({ tone: "red", sev: "Isolamento", title: "Isolamento de contato", detail: "Utilizar luvas e avental ao entrar no leito.", icon: "shield" });
  }
  if (h % 4 === 0) {
    out.push({ tone: "amber", sev: "Jejum", title: "Jejum", detail: "Manter NPO conforme prescrição.", icon: "clock" });
  }
  if (h % 5 === 0) {
    out.push({ tone: "red", sev: "Risco", title: "Risco de broncoaspiração", detail: "Elevar cabeceira 30° e monitorar deglutição.", icon: "lung" });
  }
  return out;
}

/* Prescrição demonstrada por paciente (4–6 itens, sem repetição).
   Integra com store.prescriptions (seed do módulo prescricao) quando houver
   entrada para o paciente; caso contrário usa o pool demo do módulo. */
function beiraRx(patient) {
  const rx = (store.prescriptions || []).find((r) => r.patientId === patient.id);
  if (rx && rx.meds && rx.meds.length) {
    return rx.meds.map((m) => {
      const horarios = Array.isArray(m.horarios) ? m.horarios.join(" · ") : m.horarios || "—";
      return {
        nome: m.name,
        dose: m.dose,
        via: m.via,
        freq: m.freq,
        horarios: horarios,
        status: "Ativa",
        tone: "ok",
      };
    });
  }
  const h = beiraHash(patient.id);
  const n = 4 + (h % 3);
  const list = [];
  for (let i = 0; i < n; i++) list.push(BEIRA_MEDS[(h + i * 5) % BEIRA_MEDS.length]);
  return list;
}

/* Evoluções iniciais de exemplo (lazy seed por paciente) */
function seedEvolucoes(patientId) {
  store.evolucoes = store.evolucoes || [];
  if (store.evolucoes.some((e) => e.patientId === patientId)) return;
  store.evolucoes.push(
    {
      id: "beira-seed-" + patientId + "-1",
      patientId,
      author: "Enf. Beatriz Rocha",
      source: "voz",
      texto: "Paciente lúcido, orientado, refere dor leve em ferida operatória. Aceitou dieta sem náuseas. Diurese presente.",
      nanda: "00132 — Dor aguda",
      nic: "1400 — Manejo da dor",
      noc: "1605 — Controle da dor",
      ts: Date.now() - 8 * 36e5,
    },
    {
      id: "beira-seed-" + patientId + "-2",
      patientId,
      author: "Enf. Carla Nunes",
      source: "manual",
      texto: "Paciente em evolução clínica favorável. Aceitou dieta pastosa, sem intercorrências. Deambulou com auxílio até o banheiro. Ferida operatória limpa e seca, bordas aproximadas.",
      nanda: "00046 — Integridade da pele prejudicada",
      nic: "3660 — Cuidados com a ferida; 3590 — Vigilância da pele",
      noc: "1101 — Integridade tissular: pele e mucosas",
      ts: Date.now() - 26 * 36e5,
    }
  );
}

/* Linha SAE (rótulo + chips) */
function beiraSaeLine(label, value, cls) {
  if (!value) return "";
  const items = String(value).split(";").map((s) => s.trim()).filter(Boolean);
  return (
    '<div class="beira-line">' +
    '<span class="beira-line-label beira-line-label--' + cls + '">' + label + "</span>" +
    '<div class="beira-line-chips">' + items.map((i) => '<span class="beira-chip beira-chip--' + cls + '">' + i + "</span>").join("") + "</div>" +
    "</div>"
  );
}

/* Card de evolução */
function beiraEvolCard(ev) {
  const lines =
    beiraSaeLine("NANDA", ev.nanda, "nanda") +
    beiraSaeLine("NIC", ev.nic, "nic") +
    beiraSaeLine("NOC", ev.noc, "noc");
  return (
    '<div class="beira-evol">' +
    '<div class="beira-evol-head">' +
    '<span class="beira-evol-avatar">' + beiraInitials(ev.author) + "</span>" +
    '<div class="beira-evol-meta">' +
    "<strong>" + ev.author + "</strong>" +
    '<span><i class="beira-evol-source">' + (ev.source === "voz" ? "Voz IA" : "Manual") + "</i> · " + beiraRelTime(ev.ts) + "</span>" +
    "</div></div>" +
    '<p class="beira-evol-text">' + ev.texto + "</p>" +
    (lines ? '<div class="beira-evol-lines">' + lines + "</div>" : "") +
    "</div>"
  );
}

/* Preview SAE (após "Estruturar em SAE") */
function beiraSaePreview(sae) {
  return (
    '<div class="beira-sae-in">' +
    '<div class="beira-sae-head">' +
    '<span class="live-chip"><span></span>SAE estruturado</span>' +
    '<span class="beira-sae-tag">NANDA · NIC · NOC</span>' +
    "</div>" +
    '<p class="beira-sae-text">' + sae.texto + "</p>" +
    '<div class="beira-sae-lines">' +
    beiraSaeLine("NANDA", sae.nanda, "nanda") +
    beiraSaeLine("NIC", sae.nic, "nic") +
    beiraSaeLine("NOC", sae.noc, "noc") +
    "</div></div>"
  );
}

/* ---------- Estado do gravador (módulo) ---------- */
let beiraTimer = null;
let beiraVoiceState = "idle"; // idle | recording | done | structured | saved

/* ---------- Render ---------- */
function renderBeira(content) {
  if (typeof store === "undefined") return;

  /* limpa timers de um render anterior */
  if (beiraTimer) {
    clearInterval(beiraTimer);
    beiraTimer = null;
  }
  beiraVoiceState = "idle";

  /* seed se o dashboard ainda não semeou */
  if (typeof seedData === "function" && (!store.beds || !store.beds.length)) seedData();
  store.evolucoes = store.evolucoes || [];

  const beds = (store.beds || []).filter((b) => b.status === "ocupado" && b.patientId);

  content.innerHTML =
    '<div class="beira">' +
    beiraTop(beds) +
    (beds.length ? '<div id="beira-body"></div>' : beiraEmpty()) +
    "</div>";

  /* seletor de leito */
  const sel = content.querySelector("#beira-bed");
  if (sel) {
    sel.addEventListener("change", () => {
      store.selectedBedId = Number(sel.value);
      const bed = store.beds.find((b) => b.id === store.selectedBedId);
      if (bed) renderBeiraBody(content, bed);
    });
  }

  if (beds.length) {
    let bed = beds.find((b) => b.id === store.selectedBedId) || beds[0];
    store.selectedBedId = bed.id;
    renderBeiraBody(content, bed);
  }
}

function beiraTop(beds) {
  const opts = beds
    .map((b) => {
      const p = store.patients.find((x) => x.id === b.patientId);
      return '<option value="' + b.id + '"' + (store.selectedBedId === b.id ? " selected" : "") + ">" + b.code + " — " + (p ? p.name : "—") + "</option>";
    })
    .join("");
  return (
    '<div class="beira-top">' +
    '<div class="beira-select-wrap">' +
    '<label class="beira-label" for="beira-bed">Leito ocupado</label>' +
    '<div class="beira-select-box">' +
    '<select id="beira-bed" class="beira-select" aria-label="Selecionar leito ocupado">' + opts + "</select>" +
    '<span class="beira-select-caret"><svg viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
    "</div></div></div>"
  );
}

function beiraEmpty() {
  return (
    '<div class="card beira-empty">' +
    '<span class="beira-empty-ico">' + BEIRA_ICONS.bed + "</span>" +
    "<h3>Nenhum leito ocupado</h3>" +
    "<p>Selecione um leito ocupado no Dashboard para visualizar a cabeceira digital.</p>" +
    "</div>"
  );
}

function renderBeiraBody(content, bed) {
  const patient = store.patients.find((p) => p.id === bed.patientId);
  const body = content.querySelector("#beira-body");
  if (!patient || !body) return;
  body.innerHTML = beiraHeadboard(patient, bed) + beiraRecorder() + beiraTabsCard(patient, bed);
  initVoice(content, patient);
  initTabs(content);
  renderEvolucoes(content, patient.id);
}

/* ---------- Cabeceira digital ---------- */
function beiraHeadboard(patient, bed) {
  const alerts = beiraAlerts(patient, bed);
  const alertHtml = alerts.length
    ? alerts.map((a) => '<span class="beira-alert-pill beira-alert-pill--' + a.tone + '">' + BEIRA_ICONS[a.icon] + "<span>" + a.title + "</span></span>").join("")
    : '<span class="beira-alert-pill beira-alert-pill--ok">' + BEIRA_ICONS.check + "<span>Sem alertas ativos</span></span>";
  return (
    '<div class="card beira-headboard">' +
    '<div class="beira-hb-main">' +
    '<div class="beira-avatar">' + beiraInitials(patient.name) + "</div>" +
    '<div class="beira-hb-info">' +
    "<h2>" + patient.name + "</h2>" +
    '<div class="beira-meta"><span>' + patient.age + " anos</span><i></i><span>" + (patient.prontuario || "PRT—") + "</span><i></i><span>" + bed.code + "</span></div>" +
    '<p class="beira-diag">' + (patient.diag || "—") + "</p>" +
    "</div>" +
    '<span class="status-chip beira-crit ' + beiraCritChip(patient.criticidade) + '">' + beiraCritLabel(patient.criticidade) + "</span>" +
    "</div>" +
    '<div class="beira-hb-foot">' +
    '<span class="beira-doctor">' + BEIRA_ICONS.doctor + "<span>" + (patient.doctor || "Equipe médica") + "</span></span>" +
    '<div class="beira-alerts">' + alertHtml + "</div>" +
    "</div></div>"
  );
}

/* ---------- Gravador de voz (simulado) ---------- */
function beiraRecorder() {
  let bars = "";
  for (let i = 0; i < 42; i++) {
    const wave = Math.sin(i / 2.6) * 0.5 + 0.5;
    const jitter = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const h = 14 + wave * 34 + jitter * 22;
    bars += '<i style="--h:' + h.toFixed(0) + "px;--i:" + i + '"></i>';
  }
  const online = store.online;
  return (
    '<div class="card beira-rec">' +
    '<div class="card-head">' +
    "<div><h4>Evolução por voz (IA)</h4><p>Ditado clínico simulado → estrutura SAE (NANDA · NIC · NOC)</p></div>" +
    '<span class="beira-ai">' +
    '<span class="beira-ai-badge">Whisper / GPT-4o</span>' +
    '<button class="beira-ai-status' + (online ? "" : " is-offline") + '" id="beira-ai-btn" title="Alternar online/offline"><span class="beira-ai-dot"></span><span class="beira-ai-txt">' + (online ? "Online" : "Offline") + "</span></button>" +
    "</span></div>" +
    '<div class="voice beira-voice" id="beira-voice">' +
    '<div class="voice-wave" id="beira-wave">' + bars + "</div>" +
    '<div class="beira-mic-row">' +
    '<button class="voice-mic" id="beira-mic" aria-label="Iniciar gravador de voz">' + BEIRA_ICONS.mic + '<span class="voice-ring voice-ring--1"></span><span class="voice-ring voice-ring--2"></span></button>' +
    '<span class="voice-hint" id="beira-hint"><strong>Toque para gravar a evolução</strong></span>' +
    "</div>" +
    '<div class="voice-card beira-voice-card"><p class="is-placeholder" id="beira-text">A transcrição aparecerá aqui em tempo real…</p></div>' +
    '<div class="voice-status"><span class="voice-dot"></span>Transcrevendo em tempo real…</div>' +
    '<div class="beira-rec-actions">' +
    '<button class="btn beira-btn-ghost" id="beira-cancel">Cancelar</button>' +
    '<button class="btn btn--primary beira-btn-struct" id="beira-struct" disabled>Estruturar em SAE' + BEIRA_ORB(BEIRA_ICONS.arrow) + "</button>" +
    '<button class="btn beira-btn--save" id="beira-save" disabled>Salvar evolução' + BEIRA_ORB(BEIRA_ICONS.check) + "</button>" +
    "</div></div>" +
    '<div id="beira-sae" class="beira-sae"></div>' +
    "</div>"
  );
}

function initVoice(content, patient) {
  const voice = content.querySelector("#beira-voice");
  const hint = content.querySelector("#beira-hint");
  const text = content.querySelector("#beira-text");
  const mic = content.querySelector("#beira-mic");
  const cancel = content.querySelector("#beira-cancel");
  const struct = content.querySelector("#beira-struct");
  const save = content.querySelector("#beira-save");
  const sae = content.querySelector("#beira-sae");

  const setIdle = () => {
    beiraVoiceState = "idle";
    voice.classList.remove("is-live");
    hint.innerHTML = "<strong>Toque para gravar a evolução</strong>";
    text.textContent = "A transcrição aparecerá aqui em tempo real…";
    text.classList.add("is-placeholder");
    struct.disabled = true;
    struct.classList.remove("is-done");
    struct.innerHTML = "Estruturar em SAE" + BEIRA_ORB(BEIRA_ICONS.arrow);
    save.disabled = true;
    sae.innerHTML = "";
    if (beiraTimer) {
      clearInterval(beiraTimer);
      beiraTimer = null;
    }
  };

  mic.addEventListener("click", () => {
    if (beiraVoiceState === "recording") {
      sysToast("Gravando… finalize ou cancele", "info");
      return;
    }
    if (beiraVoiceState !== "idle") return;
    beiraVoiceState = "recording";
    voice.classList.add("is-live");
    hint.innerHTML = '<span class="listening">Ouvindo…</span> fale agora';
    text.textContent = "";
    text.classList.remove("is-placeholder");
    const caret = document.createElement("span");
    caret.className = "caret";
    text.appendChild(caret);
    let i = 0;
    if (beiraTimer) clearInterval(beiraTimer);
    beiraTimer = setInterval(() => {
      i += 2;
      text.textContent = BEIRA_DICTATION.slice(0, i);
      text.appendChild(caret);
      if (i >= BEIRA_DICTATION.length) {
        clearInterval(beiraTimer);
        beiraTimer = null;
        caret.remove();
        beiraVoiceState = "done";
        hint.innerHTML = "<strong>Transcrição concluída</strong>";
        struct.disabled = false;
        sysToast("Transcrição concluída — pronto para estruturar em SAE", "info");
      }
    }, 34);
  });

  cancel.addEventListener("click", () => {
    if (beiraVoiceState === "recording") {
      setIdle();
      sysToast("Gravação descartada", "info");
    } else if (beiraVoiceState !== "idle") {
      setIdle();
    } else {
      sysToast("Nada para cancelar", "info");
    }
  });

  struct.addEventListener("click", () => {
    if (beiraVoiceState !== "done") return;
    beiraVoiceState = "structured";
    struct.disabled = true;
    struct.classList.add("is-done");
    struct.innerHTML = "Estruturado em SAE" + BEIRA_ORB(BEIRA_ICONS.check);
    sae.innerHTML = beiraSaePreview(BEIRA_SAE);
    save.disabled = false;
    sysToast("Evolução estruturada em SAE (NANDA · NIC · NOC)", "info");
  });

  save.addEventListener("click", () => {
    if (beiraVoiceState !== "structured") return;
    beiraVoiceState = "saved";
    store.evolucoes.push({
      id: "ev" + Date.now(),
      patientId: patient.id,
      author: "Enf. Beatriz Rocha",
      texto: BEIRA_SAE.texto,
      nanda: BEIRA_SAE.nanda,
      nic: BEIRA_SAE.nic,
      noc: BEIRA_SAE.noc,
      source: "voz",
      ts: Date.now(),
    });
    if (store.online) {
      sysToast("Evolução registrada — SAE formatada e adicionada ao prontuário.");
    } else {
      sysToast("Salvo offline — Evolução será sincronizada ao reconectar.", "warning");
    }
    setIdle();
    renderEvolucoes(content, patient.id);
  });

  /* badge online/offline (sincroniza com o shell) */
  const aiBtn = content.querySelector("#beira-ai-btn");
  if (aiBtn) {
    aiBtn.addEventListener("click", () => {
      const next = !store.online;
      if (typeof setOnline === "function") setOnline(next);
      else store.online = next;
      aiBtn.classList.toggle("is-offline", !store.online);
      aiBtn.querySelector(".beira-ai-txt").textContent = store.online ? "Online" : "Offline";
      sysToast(
        store.online ? "Conexão restabelecida — dados sincronizados" : "Modo offline ativado — alterações serão sincronizadas ao reconectar",
        store.online ? "success" : "warning"
      );
    });
  }

  setIdle();
}

/* ---------- Abas (Evoluções / Prescrição / Alertas) ---------- */
function beiraTabsCard(patient, bed) {
  const rx = beiraRx(patient);
  const alerts = beiraAlerts(patient, bed);
  return (
    '<div class="card beira-tabs-card">' +
    '<div class="med-tabs beira-tabs" role="tablist" aria-label="Conteúdo do prontuário">' +
    '<button class="med-tab is-active" role="tab" aria-selected="true" data-tab="evol">Evoluções</button>' +
    '<button class="med-tab" role="tab" aria-selected="false" data-tab="rx">Prescrição</button>' +
    '<button class="med-tab" role="tab" aria-selected="false" data-tab="alertas">Alertas</button>' +
    '<span class="med-tab-ink" id="beira-ink"></span>' +
    "</div>" +
    '<div class="med-panel beira-panel is-active" data-panel="evol" role="tabpanel">' +
    '<div class="beira-panel-head"><span class="med-label">Evoluções do prontuário</span><span class="beira-count" id="beira-evol-count">0</span></div>' +
    '<div class="beira-evol-list" id="beira-evols"></div>' +
    "</div>" +
    '<div class="med-panel beira-panel" data-panel="rx" role="tabpanel">' +
    '<div class="beira-panel-head"><span class="med-label">Prescrição ativa</span><span class="beira-count">' + rx.length + "</span></div>" +
    '<div class="beira-rx-list">' +
    rx
      .map(
        (m) =>
          '<div class="med-item med-item--' + m.tone + '">' +
          '<span class="med-ico">' + (m.tone === "ok" ? BEIRA_ICONS.drip : m.tone === "warn" ? BEIRA_ICONS.pill : BEIRA_ICONS.rx) + "</span>" +
          '<div class="med-info">' +
          "<strong>" + m.nome + " " + m.dose + "</strong>" +
          "<span>" + m.via + " · " + m.freq + " · " + m.horarios + "</span>" +
          "</div>" +
          '<span class="status-chip status-chip--' + (m.tone === "ok" ? "ok" : m.tone === "warn" ? "warn" : "alert") + '">' + m.status + "</span>" +
          "</div>"
      )
      .join("") +
    "</div></div>" +
    '<div class="med-panel beira-panel" data-panel="alertas" role="tabpanel">' +
    '<div class="beira-panel-head"><span class="med-label">Alertas clínicos</span></div>' +
    '<div class="beira-alert-list">' +
    (alerts.length
      ? alerts
          .map(
            (a) =>
              '<div class="beira-alert-row beira-alert-row--' + a.tone + '">' +
              '<span class="beira-alert-ico">' + BEIRA_ICONS[a.icon] + "</span>" +
              '<div class="beira-alert-info"><strong>' + a.title + "</strong><span>" + a.detail + "</span></div>" +
              '<span class="status-chip status-chip--' + (a.tone === "red" ? "alert" : a.tone === "amber" ? "warn" : "ok") + '">' + a.sev + "</span>" +
              "</div>"
          )
          .join("")
      : '<div class="beira-none"><span class="beira-none-ico">' + BEIRA_ICONS.check + "</span><p>Sem alertas ativos para este paciente.</p></div>") +
    "</div></div>" +
    "</div>"
  );
}

function initTabs(content) {
  const tabs = content.querySelectorAll(".beira-tabs .med-tab");
  const panels = content.querySelectorAll(".beira-panel");
  const ink = content.querySelector("#beira-ink");
  function positionInk() {
    const act = content.querySelector(".beira-tabs .med-tab.is-active");
    if (!act || !ink) return;
    ink.style.width = act.offsetWidth + "px";
    ink.style.transform = "translateX(" + act.offsetLeft + "px)";
  }
  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      tabs.forEach((x) => {
        x.classList.toggle("is-active", x === t);
        x.setAttribute("aria-selected", x === t ? "true" : "false");
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === t.dataset.tab));
      positionInk();
    })
  );
  positionInk();
}

/* ---------- Lista de evoluções ---------- */
function renderEvolucoes(content, patientId) {
  seedEvolucoes(patientId);
  const list = store.evolucoes
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => b.ts - a.ts);
  const el = content.querySelector("#beira-evols");
  if (!el) return;
  el.innerHTML = list.length
    ? list.map(beiraEvolCard).join("")
    : '<div class="beira-none"><span class="beira-none-ico">' + BEIRA_ICONS.check + "</span><p>Nenhuma evolução registrada.</p></div>";
  const count = content.querySelector("#beira-evol-count");
  if (count) count.textContent = list.length;
}

/* ---------- Registro no sistema (posterga até system.js carregar) ---------- */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("beira", renderBeira);
}, 0);
