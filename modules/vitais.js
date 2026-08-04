/* ============================================================
   Módulo: Sinais Vitais & Glicemia
   6 parâmetros com steppers, validação clínica e sparklines.
   ============================================================ */

const VIT_PARAMS = [
  {
    key: "temp", label: "Temperatura", unit: "°C", step: 0.1, min: 30, max: 42, dec: 1, def: 37.2,
    color: "#B8820A", spark: "#FFD97A",
    check: (v) => v > 37.8 ? { lvl: "crit", txt: "Febre" } : v < 35 ? { lvl: "crit", txt: "Hipotermia" } : null,
  },
  {
    key: "fc", label: "Freq. Cardíaca", unit: "bpm", step: 1, min: 20, max: 220, dec: 0, def: 66,
    color: "#D93638", spark: "#FF4D4F",
    check: (v) => v > 100 ? { lvl: "crit", txt: "Taquicardia" } : v < 50 ? { lvl: "crit", txt: "Bradicardia" } : null,
  },
  {
    key: "fr", label: "Freq. Respiratória", unit: "ipm", step: 1, min: 6, max: 50, dec: 0, def: 21,
    color: "#0D2B4E", spark: "#0E8A56",
    check: (v) => v > 24 ? { lvl: "crit", txt: "Taquipneia" } : v < 12 ? { lvl: "crit", txt: "Bradipneia" } : null,
  },
  {
    key: "spo2", label: "Saturação O₂", unit: "%", step: 1, min: 50, max: 100, dec: 0, def: 93,
    color: "#0D2B4E", spark: "#3ED598",
    check: (v) => v < 92 ? { lvl: "crit", txt: "Hipoxemia" } : v < 95 ? { lvl: "warn", txt: "Atenção" } : null,
  },
  {
    key: "hgt", label: "Glicemia Capilar", unit: "mg/dL", step: 5, min: 20, max: 500, dec: 0, def: 167,
    color: "#7A5200", spark: "#FFD97A",
    check: (v) => v < 70 ? { lvl: "crit", txt: "Hipoglicemia" } : v > 180 ? { lvl: "crit", txt: "Hiperglicemia" } : null,
  },
];

let vitPatientId = null;
let vitValues = {}; // chave -> valor atual (incl. pas/pad)

function seedVitals() {
  if (!store.beds.length) seedData();
  // histórico padrão: LE101 — Eduardo Almeida (70 anos, PRT-1001)
  const p = store.patients[0];
  if (p && !store.vitalsHistory) {
    store.vitalsHistory = {};
    const base = { temp: 37.2, fc: 66, fr: 21, spo2: 93, hgt: 167, pas: 142, pad: 82 };
    const hist = [];
    for (let i = 11; i >= 0; i--) {
      const t = new Date(Date.now() - i * 4 * 3600000);
      hist.push({
        ts: t.toISOString(),
        temp: +(base.temp + Math.sin(i) * 0.3).toFixed(1),
        fc: Math.round(base.fc + Math.sin(i / 2) * 8),
        fr: Math.round(base.fr + Math.cos(i / 3) * 3),
        spo2: Math.round(base.spo2 + Math.sin(i / 1.5) * 2),
        hgt: Math.round(base.hgt + Math.cos(i / 2) * 15),
        pas: Math.round(base.pas + Math.sin(i / 2) * 10),
        pad: Math.round(base.pad + Math.cos(i / 2) * 5),
      });
    }
    store.vitalsHistory[p.id] = hist;
  }
}

function vitInitValues() {
  const hist = store.vitalsHistory[vitPatientId] || [];
  const last = hist[hist.length - 1];
  vitValues = {
    temp: last?.temp ?? 37.2, fc: last?.fc ?? 66, fr: last?.fr ?? 21,
    spo2: last?.spo2 ?? 93, hgt: last?.hgt ?? 167, pas: last?.pas ?? 142, pad: last?.pad ?? 82,
  };
}

function vitPatient() {
  return store.patients.find((p) => p.id === vitPatientId) || store.patients[0];
}

function vitBedOf(p) {
  return store.beds.find((b) => b.patientId === p?.id);
}

function vitCheckAll() {
  const res = [];
  for (const p of VIT_PARAMS) {
    const c = p.check(vitValues[p.key]);
    if (c) res.push({ key: p.key, ...c, label: p.label, val: vitValues[p.key] });
  }
  // PA: faixa sistólica 90–180, diastólica ≤110
  const { pas, pad } = vitValues;
  if (pas < 90 || pas > 180 || pad > 110) res.push({ key: "pa", lvl: "warn", txt: "PA alterada", label: "Pressão Arterial", val: `${pas}×${pad}` });
  return res;
}

function vitBadge(p) {
  const c = p.check(vitValues[p.key]);
  if (c) return `<span class="status-chip status-chip--${c.lvl === "crit" ? "alert" : "warn"}">${c.txt}</span>`;
  return `<span class="status-chip status-chip--ok">Normal</span>`;
}

function vitSparkline(p) {
  const hist = store.vitalsHistory[vitPatientId] || [];
  const vals = hist.map((h) => h[p.key]).filter((v) => v !== undefined).slice(-10);
  if (!vals.length) return `<svg class="vit-spark" viewBox="0 0 100 32" preserveAspectRatio="none"><line x1="0" y1="16" x2="100" y2="16" stroke="var(--gray-200)" stroke-width="1.5"/></svg>`;
  const min = Math.min(...vals, p.min), max = Math.max(...vals, p.max);
  const span = max - min || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${30 - ((v - min) / span) * 26}`).join(" ");
  return `<svg class="vit-spark" viewBox="0 0 100 32" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="${p.spark}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderVitais(content) {
  if (!store.beds.length) seedData();
  if (!store.vitalsHistory) seedVitals();
  if (!vitPatientId) {
    vitPatientId = store.patients[0]?.id;
    vitInitValues();
  }
  const p = vitPatient();
  const bed = vitBedOf(p);
  const alerts = vitCheckAll();
  const crits = alerts.filter((a) => a.lvl === "crit").length;
  const warns = alerts.filter((a) => a.lvl === "warn").length;
  const lastHist = (store.vitalsHistory[p.id] || []).slice(-1)[0];
  const ini = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const statusCls = crits > 0 ? "vit-status vit-status--crit" : warns > 0 ? "vit-status vit-status--warn" : "vit-status vit-status--ok";
  const statusTxt = crits > 0 ? `${crits} alerta(s) crítico(s) detectado(s)` : warns > 0 ? `${warns} parâmetro(s) em atenção` : "Todos os parâmetros dentro da normalidade";

  content.innerHTML = `
    <div class="vit-head">
      <div class="vit-selector">
        <label>Leito / Paciente</label>
        <select id="vit-patient" class="vit-select">
          ${store.patients.map((p) => {
            const b = vitBedOf(p);
            return `<option value="${p.id}" ${p.id === vitPatientId ? "selected" : ""}>${b ? b.code : "LE---"} — ${p.name} • ${b?.sectorLabel || ""}</option>`;
          }).join("")}
        </select>
      </div>
      <div class="vit-avatar-wrap">
        <span class="sys-avatar">${ini}</span>
        <div>
          <strong>${p.name}</strong>
          <span>${p.age} anos • ${p.prontuario} • ${bed ? bed.code : ""}</span>
        </div>
      </div>
    </div>

    <div class="${statusCls}">${statusTxt}</div>

    <div class="vit-grid">
      ${VIT_PARAMS.map(
        (p) => `
        <div class="card vit-card" data-key="${p.key}">
          <div class="vit-card-head">
            <span class="vit-label">${p.label} <em>(${p.unit})</em></span>
            ${vitBadge(p)}
          </div>
          <div class="vit-value-row">
            <div class="stepper" data-key="${p.key}" data-min="${p.min}" data-max="${p.max}" data-step="${p.step}" data-comma="${p.dec ? "1" : ""}">
              <button class="step-btn" data-dir="-1" aria-label="Diminuir ${p.label}">−</button>
              <input class="step-val vit-stepval" type="text" inputmode="decimal" aria-label="${p.label} em ${p.unit}" value="${p.dec ? vitValues[p.key].toFixed(1).replace(".", ",") : vitValues[p.key]}">
              <button class="step-btn" data-dir="1" aria-label="Aumentar ${p.label}">+</button>
            </div>
          </div>
          ${vitSparkline(p)}
        </div>`
      ).join("")}

      <div class="card vit-card vit-card--bp">
        <div class="vit-card-head">
          <span class="vit-label">Pressão Arterial <em>(mmHg)</em></span>
          <span class="status-chip status-chip--${vitValues.pas < 90 || vitValues.pas > 180 || vitValues.pad > 110 ? "warn" : "ok"}">${vitValues.pas < 90 || vitValues.pas > 180 || vitValues.pad > 110 ? "PA alterada" : "Normal"}</span>
        </div>
        <div class="bp-inputs">
          <div class="stepper stepper--sm" data-min="60" data-max="220" data-step="1" data-key="pas">
            <button class="step-btn" data-dir="-1" aria-label="Diminuir sistólica">−</button>
            <input class="step-val vit-stepval" type="text" inputmode="numeric" aria-label="Pressão sistólica em mmHg" value="${vitValues.pas}">
            <button class="step-btn" data-dir="1" aria-label="Aumentar sistólica">+</button>
          </div>
          <span class="bp-sep">/</span>
          <div class="stepper stepper--sm" data-min="30" data-max="140" data-step="1" data-key="pad">
            <button class="step-btn" data-dir="-1" aria-label="Diminuir diastólica">−</button>
            <input class="step-val vit-stepval" type="text" inputmode="numeric" aria-label="Pressão diastólica em mmHg" value="${vitValues.pad}">
            <button class="step-btn" data-dir="1" aria-label="Aumentar diastólica">+</button>
          </div>
        </div>
        <svg class="vit-spark vit-spark--bp" viewBox="0 0 100 32" preserveAspectRatio="none"><line x1="0" y1="16" x2="100" y2="16" stroke="var(--gray-200)" stroke-width="1.5"/></svg>
      </div>
    </div>

    <div class="vit-actions">
      <p class="vit-last">Última aferição: ${lastHist ? new Date(lastHist.ts).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}</p>
      <button class="btn btn--primary btn--sm" id="vit-save" ${store.online ? "" : "disabled"}>
        <span>Salvar e Sincronizar Sinais Vitais</span>
        <span class="btn-orb"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </button>
    </div>`;

  // re-bind steppers
  bindVitSteppers(content);
  // seletor de paciente
  content.querySelector("#vit-patient").addEventListener("change", (e) => {
    vitPatientId = e.target.value;
    vitInitValues();
    renderVitais(content);
  });
  // salvar
  content.querySelector("#vit-save").addEventListener("click", () => {
    const p = vitPatient();
    if (!store.vitalsHistory[p.id]) store.vitalsHistory[p.id] = [];
    store.vitalsHistory[p.id].push({ ts: new Date().toISOString(), ...vitValues });
    store.vitalsHistory[p.id] = store.vitalsHistory[p.id].slice(-12);
    sysToast(`Sinais vitais de ${p.name.split(" ")[0]} sincronizados`, "success");
    renderVitais(content);
  });
}

function bindVitSteppers(content) {
  content.querySelectorAll(".stepper").forEach((stepper) => {
    const key = stepper.dataset.key;
    const val = stepper.querySelector(".step-val");
    const min = parseFloat(stepper.dataset.min);
    const max = parseFloat(stepper.dataset.max);
    const step = parseFloat(stepper.dataset.step);
    const comma = stepper.dataset.comma === "1";
    const fmt = (v) => (comma ? v.toFixed(1).replace(".", ",") : String(v));
    const parse = (txt) => {
      const n = parseFloat(String(txt).replace(",", "."));
      return isNaN(n) ? NaN : n;
    };
    const setVal = (v, opts = {}) => {
      if (isNaN(v)) v = min;
      v = Math.min(Math.max(v, min), max);
      v = Math.round(v * 10) / 10;
      if (key) vitValues[key] = v;
      val.value = fmt(v);
      val.classList.remove("is-bumping");
      void val.offsetWidth;
      val.classList.add("is-bumping");
      // re-render badges/status
      const card = stepper.closest(".vit-card");
      if (card) {
        const p = VIT_PARAMS.find((x) => x.key === card.dataset.key);
        if (p) {
          const c = p.check(vitValues[p.key]);
          const badge = card.querySelector(".status-chip");
          badge.className = `status-chip status-chip--${c ? (c.lvl === "crit" ? "alert" : "warn") : "ok"}`;
          badge.textContent = c ? c.txt : "Normal";
        }
      }
      updateVitStatus(content);
    };
    stepper.querySelectorAll(".step-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        setVal(parse(val.value) + parseInt(btn.dataset.dir, 10) * step);
      })
    );
    // entrada manual
    val.addEventListener("input", () => {
      const n = parse(val.value);
      if (!isNaN(n)) {
        const clamped = Math.min(Math.max(n, min), max);
        if (key) vitValues[key] = clamped;
        const card = stepper.closest(".vit-card");
        if (card) {
          const p = VIT_PARAMS.find((x) => x.key === card.dataset.key);
          if (p) {
            const c = p.check(clamped);
            const badge = card.querySelector(".status-chip");
            badge.className = `status-chip status-chip--${c ? (c.lvl === "crit" ? "alert" : "warn") : "ok"}`;
            badge.textContent = c ? c.txt : "Normal";
          }
        }
        updateVitStatus(content);
      }
    });
    val.addEventListener("change", () => setVal(parse(val.value)));
    val.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setVal(parse(val.value));
        val.blur();
      }
    });
  });
}

function updateVitStatus(content) {
  const alerts = vitCheckAll();
  const crits = alerts.filter((a) => a.lvl === "crit").length;
  const warns = alerts.filter((a) => a.lvl === "warn").length;
  const el = content.querySelector(".vit-status");
  el.className = crits > 0 ? "vit-status vit-status--crit" : warns > 0 ? "vit-status vit-status--warn" : "vit-status vit-status--ok";
  el.textContent = crits > 0 ? `${crits} alerta(s) crítico(s) detectado(s)` : warns > 0 ? `${warns} parâmetro(s) em atenção` : "Todos os parâmetros dentro da normalidade";
  // badge da PA
  const bpBadge = content.querySelector(".vit-card--bp .status-chip");
  if (bpBadge) {
    const { pas, pad } = vitValues;
    bpBadge.className = `status-chip status-chip--${pas < 90 || pas > 180 || pad > 110 ? "warn" : "ok"}`;
    bpBadge.textContent = pas < 90 || pas > 180 || pad > 110 ? "PA alterada" : "Normal";
  }
}

function renderVitaisWrapper(content) {
  renderVitais(content);
}

/* Registro no sistema */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("vitais", renderVitaisWrapper);
}, 0);
