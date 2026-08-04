/* ============================================================
   Módulo: Prescrição & Farmácia (Circuito Fechado)
   Pipeline: emitida → separacao → pronta → aplicada
   ============================================================ */

const MEDS = [
  { name: "Dipirona 500mg", via: "EV", dose: "2 ml" },
  { name: "Paracetamol 750mg", via: "VO", dose: "1 comprimido" },
  { name: "Omeprazol 40mg", via: "EV", dose: "1 ampola" },
  { name: "Enoxaparina 40mg", via: "SC", dose: "1 ampola" },
  { name: "Metformina 850mg", via: "VO", dose: "1 comprimido" },
  { name: "Amlodipino 5mg", via: "VO", dose: "1 comprimido" },
  { name: "Ceftriaxona 1g", via: "EV", dose: "1 frasco" },
  { name: "Soro Fisiológico 500ml", via: "IV", dose: "1 bolsa" },
  { name: "Varfarina 5mg", via: "VO", dose: "1 comprimido" },
  { name: "Furosemida 40mg", via: "EV", dose: "2 ml" },
  { name: "Clonazepam 2mg", via: "VO", dose: "1 comprimido" },
  { name: "Amoxicilina 500mg", via: "VO", dose: "1 comprimido" },
];

const FREQS = ["6/6h", "8/8h", "12/12h", "1x/dia", "24/24h", "SN"];
const FREQ_HORARIOS = {
  "6/6h": ["06:00", "12:00", "18:00", "00:00"],
  "8/8h": ["08:00", "16:00", "00:00"],
  "12/12h": ["08:00", "20:00"],
  "1x/dia": ["08:00"],
  "24/24h": ["09:00"],
  SN: ["12:00"],
};
const STATUS_FLOW = ["emitida", "separacao", "pronta", "aplicada"];
const STATUS_LABEL = {
  emitida: "Emitida",
  separacao: "Em Separação",
  pronta: "Pronta p/ Coleta",
  aplicada: "Checada & Aplicada",
};
const STATUS_CHIP = {
  emitida: "status-chip--idle",
  separacao: "status-chip--warn",
  pronta: "status-chip--ok",
  aplicada: "status-chip--ok",
};

function seedPrescricoes() {
  if (store.prescriptions.length) return;
  if (!store.beds.length) seedData();
  const pacientes = store.patients.slice(0, 40);
  const agora = Date.now();
  store.prescriptions = pacientes.map((p, i) => {
    const nMed = 2 + (i % 3); // 2–4 medicamentos
    const meds = [];
    for (let m = 0; m < nMed; m++) {
      const med = MEDS[(i + m * 3) % MEDS.length];
      const freq = FREQS[(i + m) % FREQS.length];
      meds.push({ ...med, freq, horarios: FREQ_HORARIOS[freq] });
    }
    return {
      id: `RX-${String(1000 + i).slice(1)}`,
      patientId: p.id,
      patientName: p.name,
      age: p.age,
      bedCode: store.beds.find((b) => b.patientId === p.id)?.code || "LE---",
      doctor: p.doctor,
      createdAt: new Date(agora - (1 + (i % 48)) * 3600000),
      status: STATUS_FLOW[i % 4],
      interacao: i % 5 !== 3, // ~78% com interação
      meds,
    };
  });
}

function advancePrescriptionStatus(id) {
  const rx = store.prescriptions.find((r) => r.id === id);
  if (!rx) return;
  const idx = STATUS_FLOW.indexOf(rx.status);
  if (idx < STATUS_FLOW.length - 1) rx.status = STATUS_FLOW[idx + 1];
  renderPrescricoes();
}

const STATUS_FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "emitida", label: "Emitida" },
  { id: "separacao", label: "Em Separação" },
  { id: "pronta", label: "Pronta p/ Coleta" },
  { id: "aplicada", label: "Checada & Aplicada" },
];
let prescFilter = "todas";

function renderPrescricoes() {
  const content = $("#sys-content");
  const list = prescFilter === "todas" ? store.prescriptions : store.prescriptions.filter((r) => r.status === prescFilter);
  const qtd = (st) => store.prescriptions.filter((r) => r.status === st).length;

  content.innerHTML = `
    <div class="sys-kpis">
      ${STATUS_FLOW.map(
        (st, i) => `
        <div class="sys-kpi">
          <span class="sys-kpi-ico" style="--c:${["#0D2B4E", "#B8820A", "#16B370", "#16B370"][i]};--cb:${["#E8EEF5", "#FFF4D6", "#E4F6EE", "#E4F6EE"][i]}">
            <svg viewBox="0 0 24 24" fill="none">${["<path d='M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M9 13h6M9 17h4' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>", "<path d='M4 8h2.5l2-2.5h7L17.5 8H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Zm8 2v6m-3-3h6' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>", "<path d='m5 13 4 4L19 7' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>", "<path d='m5 13 4 4L19 7' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>"][i]}
            </svg>
          </span>
          <div><strong>${qtd(st)}</strong><span>${STATUS_LABEL[st]}</span></div>
        </div>`
      ).join("")}
    </div>

    <div class="sys-filters">
      ${STATUS_FILTERS.map(
        (f) => `<button class="sys-filter ${prescFilter === f.id ? "is-active" : ""}" data-filter="${f.id}">${f.label}</button>`
      ).join("")}
    </div>

    <div class="sys-grid sys-grid--presc">
      ${list
        .map((r) => {
          const chip = STATUS_CHIP[r.status];
          const interacao = r.interacao ? `<span class="status-chip status-chip--alert">Interação</span>` : "";
          return `
        <div class="card sys-rx">
          <div class="sys-rx-head">
            <strong>${r.id}</strong>
            <span class="status-chip ${chip}">${STATUS_LABEL[r.status]}</span>
          </div>
          <p class="sys-rx-patient">${r.patientName} • ${r.age} anos</p>
          <p class="sys-rx-meta">Leito ${r.bedCode} • ${r.doctor} • ${new Date(r.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
          <div class="sys-rx-meds">
            ${r.meds.map((m) => `<span class="sys-rx-med">${m.name}</span>`).join("")}
          </div>
          <div class="sys-rx-actions">
            ${interacao}
            <span class="sys-rx-spacer"></span>
            <button class="btn btn--ghost btn--xs sys-rx-details" data-id="${r.id}">Detalhes</button>
            ${r.status === "aplicada" ? `<button class="btn btn--ghost btn--xs" disabled>Concluído</button>` : `<button class="btn btn--primary btn--xs sys-rx-next" data-id="${r.id}">Avançar</button>`}
          </div>
        </div>`;
        })
        .join("")}
    </div>`;

  content.querySelectorAll(".sys-filter").forEach((b) =>
    b.addEventListener("click", () => {
      prescFilter = b.dataset.filter;
      renderPrescricoes();
    })
  );
  content.querySelectorAll(".sys-rx-next").forEach((b) =>
    b.addEventListener("click", () => {
      advancePrescriptionStatus(b.dataset.id);
      sysToast(`Prescrição ${b.dataset.id} avançada no circuito`, "success");
    })
  );
  content.querySelectorAll(".sys-rx-details").forEach((b) =>
    b.addEventListener("click", () => openRxModal(b.dataset.id))
  );
}

function openRxModal(id) {
  const rx = store.prescriptions.find((r) => r.id === id);
  if (!rx) return;
  const overlay = document.createElement("div");
  overlay.className = "sys-modal-backdrop";
  overlay.innerHTML = `
    <div class="sys-modal" role="dialog" aria-modal="true">
      <button class="icon-btn sys-modal-close" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h3 class="sys-modal-title">Prescrição ${rx.id}</h3>
      <p class="sys-modal-sub">${rx.patientName} • Leito ${rx.bedCode}</p>
      <span class="sys-modal-label">Medicamentos prescritos</span>
      <div class="sys-modal-meds">
        ${rx.meds
          .map(
            (m) => `
          <div class="sys-rx-medrow">
            <div class="sys-rx-medrow-main">
              <strong>${m.name}</strong>
              <span class="sys-rx-medrow-via">${m.via}</span>
              <span class="sys-rx-medrow-freq">${m.freq}</span>
            </div>
            <p>${m.dose} • Horários: ${m.horarios.join(", ")}</p>
          </div>`
          )
          .join("")}
      </div>
      <p class="sys-modal-foot">Emitida em ${new Date(rx.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} por ${rx.doctor}</p>
      ${rx.interacao ? `<p class="sys-modal-warn"><svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Risco de sangramento com uso concomitante de AAS</p>` : ""}
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("is-in"));
  const close = () => {
    overlay.classList.remove("is-in");
    setTimeout(() => overlay.remove(), 350);
  };
  overlay.querySelector(".sys-modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  }, { once: true });
}

function renderPrescricao(content) {
  seedPrescricoes();
  renderPrescricoes();
}

/* Registro no sistema (posterga até system.js carregar) */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("prescricao", renderPrescricao);
}, 0);
