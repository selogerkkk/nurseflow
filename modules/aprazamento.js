/* ============================================================
   Módulo: Aprazamento & Checagem
   Gera doses a partir das prescrições e permite checagem.
   ============================================================ */

function genDoses() {
  if (store.doses.length) return;
  if (!store.prescriptions.length) seedPrescricoes();
  const agora = Date.now();
  const doses = [];
  let id = 0;
  for (const rx of store.prescriptions) {
    for (const med of rx.meds) {
      for (const horario of med.horarios) {
        id++;
        const [h, m] = horario.split(":").map(Number);
        const d = new Date(agora);
        d.setHours(h, m, 0, 0);
        // se já passou de hoje, assume horário de hoje; senão amanhã (janela de 24h)
        let status = "pendente";
        if (d.getTime() < agora - 30 * 60000) status = "atrasado";
        else if (d.getTime() > agora + 4 * 3600000) status = "pendente";
        doses.push({
          id: `D${id}`,
          prescriptionId: rx.id,
          patientId: rx.patientId,
          patientName: rx.patientName,
          bedCode: rx.bedCode,
          medName: med.name,
          dose: med.dose,
          via: med.via,
          horario,
          at: d.toISOString(),
          status,
          checkedAt: null,
        });
      }
    }
  }
  // distribuição realista: ~75% atrasadas, ~24% pendentes, ~1% checadas
  const total = doses.length;
  const alvoAtrasadas = Math.round(total * 0.75);
  const alvoChecadas = Math.round(total * 0.01);
  const sorted = doses.slice().sort((a, b) => b.horario.localeCompare(a.horario)); // mais tarde primeiro = mais recentes ficam pendentes
  sorted.forEach((d, i) => {
    if (i < alvoChecadas) d.status = "checado";
    else if (i < alvoAtrasadas + alvoChecadas) d.status = "atrasado";
    else d.status = "pendente";
  });
  store.doses = doses;
}

function checkDose(id) {
  const d = store.doses.find((x) => x.id === id);
  if (!d) return;
  d.status = "checado";
  d.checkedAt = new Date().toISOString();
  updateDoseBadge();
  renderAprazamento($("#sys-content"));
}

function updateDoseBadge() {
  const atrasadas = store.doses.filter((d) => d.status === "atrasado").length;
  const badges = document.querySelectorAll(".sys-badge, .sys-bell-badge");
  badges.forEach((b) => {
    b.textContent = atrasadas;
    b.style.display = atrasadas > 0 ? "grid" : "none";
  });
}

const APZ_FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "atrasado", label: "Atrasado" },
  { id: "pendente", label: "Pendente" },
  { id: "checado", label: "Checado" },
];
let apzFilter = "todas";

function renderAprazamento(content) {
  const doses = store.doses;
  const total = doses.length;
  const checadas = doses.filter((d) => d.status === "checado").length;
  const pendentes = doses.filter((d) => d.status === "pendente").length;
  const atrasadas = doses.filter((d) => d.status === "atrasado").length;

  // agrupa por paciente
  const porPaciente = {};
  for (const d of doses) {
    (porPaciente[d.patientId] = porPaciente[d.patientId] || []).push(d);
  }
  const pacientes = Object.values(porPaciente)
    .map((ds) => ({ patientId: ds[0].patientId, name: ds[0].patientName, bedCode: ds[0].bedCode, doses: ds }))
    .filter((p) => {
      if (apzFilter === "todas") return true;
      return p.doses.some((d) => d.status === apzFilter);
    })
    .sort((a, b) => b.doses.filter((d) => d.status === "atrasado").length - a.doses.filter((d) => d.status === "atrasado").length);

  content.innerHTML = `
    <div class="sys-kpis">
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#0D2B4E;--cb:#E8EEF5"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18m-7-2h14M8 5h8M12 5v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${total}</strong><span>Total de doses</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#16B370;--cb:#E4F6EE"><svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${checadas}</strong><span>Checadas</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#B8820A;--cb:#FFF4D6"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${pendentes}</strong><span>Pendentes</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#D93638;--cb:#FFE9E9"><svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${atrasadas}</strong><span>Atrasadas</span></div>
      </div>
    </div>

    <div class="sys-filters">
      ${APZ_FILTERS.map(
        (f) => `<button class="sys-filter ${apzFilter === f.id ? "is-active" : ""}" data-filter="${f.id}">${f.label}</button>`
      ).join("")}
    </div>

    <div class="sys-apz-list">
      ${pacientes
        .map((p) => {
          const atr = p.doses.filter((d) => d.status === "atrasado").length;
          const ini = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
          return `
        <div class="card sys-apz-card">
          <div class="sys-apz-head">
            <span class="sys-avatar sys-avatar--mini">${ini}</span>
            <div class="sys-apz-info">
              <strong>${p.name}</strong>
              <span>${p.bedCode} • ${p.doses.length} doses</span>
            </div>
            <span class="status-chip ${atr > 0 ? "status-chip--alert" : "status-chip--ok"}">${atr > 0 ? `${atr} atrasada(s)` : "em dia"}</span>
          </div>
          <div class="sys-apz-doses">
            ${p.doses
              .sort((a, b) => a.horario.localeCompare(b.horario))
              .map((d) => {
                const chip = d.status === "checado" ? "status-chip--ok" : d.status === "atrasado" ? "status-chip--alert" : "status-chip--warn";
                const label = d.status === "checado" ? "Checado" : d.status === "atrasado" ? "Atrasada" : "Pendente";
                return `
              <div class="sys-apz-dose" data-id="${d.id}">
                <span class="sys-apz-time">${d.horario}</span>
                <div class="sys-apz-med">
                  <strong>${d.medName}</strong>
                  <span>${d.dose} • ${d.via}</span>
                </div>
                <span class="status-chip ${chip}">${label}</span>
              </div>`;
              })
              .join("")}
          </div>
        </div>`;
        })
        .join("")}
    </div>`;

  content.querySelectorAll(".sys-filter").forEach((b) =>
    b.addEventListener("click", () => {
      apzFilter = b.dataset.filter;
      renderAprazamento(content);
    })
  );
  content.querySelectorAll(".sys-apz-dose[data-id]").forEach((el) => {
    const d = store.doses.find((x) => x.id === el.dataset.id);
    if (!d || d.status === "checado") return;
    el.classList.add("is-clickable");
    el.addEventListener("click", () => openCheckModal(d));
  });
}

function openCheckModal(d) {
  const overlay = document.createElement("div");
  overlay.className = "sys-modal-backdrop";
  overlay.innerHTML = `
    <div class="sys-modal sys-modal--check" role="dialog" aria-modal="true">
      <button class="icon-btn sys-modal-close" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="sys-check-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <h3 class="sys-modal-title">Confirmar Aplicação</h3>
      <p class="sys-modal-sub">Valide o kit de medicação antes da aplicação</p>
      <div class="sys-check-info">
        <div><span>Paciente</span><strong>${d.patientName}</strong></div>
        <div><span>Leito</span><strong>${d.bedCode}</strong></div>
        <div><span>Medicamento</span><strong>${d.medName} • ${d.dose} • ${d.via}</strong></div>
        <div><span>Horário</span><strong>${d.horario}</strong></div>
      </div>
      <div class="sys-check-code">
        <input id="sys-check-input" placeholder="Código de barras do kit (ex.: 789123456)" aria-label="Código de barras do kit" autocomplete="off"/>
        <button class="btn btn--primary" id="sys-check-confirm">
          <span>Confirmar</span>
          <span class="btn-orb"><svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
      </div>
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
  const confirm = () => {
    checkDose(d.id);
    sysToast("Medicação aplicada e checada à beira do leito.", "success");
    close();
  };
  overlay.querySelector("#sys-check-confirm").addEventListener("click", confirm);
  overlay.querySelector("#sys-check-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirm();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  }, { once: true });
  setTimeout(() => overlay.querySelector("#sys-check-input").focus(), 100);
}

function renderAprazamentoWrapper(content) {
  genDoses();
  updateDoseBadge();
  renderAprazamento(content);
}

/* Registro no sistema */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("aprazamento", renderAprazamentoWrapper);
}, 0);
