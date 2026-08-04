/* ============================================================
   Módulo: Infraestrutura & Higiene (Ordens de Serviço)
   Ciclo aberta → em andamento → concluída para limpeza
   terminal e manutenção de leitos/equipamentos.
   Feature: docs/features/07-infraestrutura-higiene.md
   ============================================================ */

const OS_STATUS_META = {
  aberta:       { label: "Aberta",       chip: "status-chip--alert" },
  em_andamento: { label: "Em andamento", chip: "status-chip--warn" },
  concluida:    { label: "Concluída",    chip: "status-chip--ok" },
};

const OS_TYPE_META = {
  limpeza:    { label: "Limpeza Terminal", icon: "spray" },
  manutencao: { label: "Manutenção",       icon: "wrench" },
};

let osActiveFilter = "todas";
let osEscHandler = null;

/* ---------- Helpers ---------- */
function osEsc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function osRelTime(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

function osNextCode() {
  let max = 9;
  (store.orders || []).forEach((o) => {
    const n = parseInt(String(o.code || "").replace(/\D/g, ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  });
  return `OS-${String(max + 1).padStart(4, "0")}`;
}

/* ---------- Seed inicial de OS (códigos sequenciais a partir de OS-0010) ---------- */
function osSeed() {
  if (!store.orders) store.orders = [];
  if (store.orders.length) return;
  const now = Date.now();
  const H = 3600000;
  const D = 86400000;
  store.orders.push(
    {
      id: "os-0010",
      code: "OS-0010",
      type: "limpeza",
      bedId: 104,
      bedCode: "LE0104",
      description: "Limpeza terminal após alta",
      status: "aberta",
      createdAt: now - 2 * H,
      resolvedAt: null,
    },
    {
      id: "os-0011",
      code: "OS-0011",
      type: "manutencao",
      bedId: 211,
      bedCode: "LE0211",
      description: "Bomba de infusão sem energia",
      status: "aberta",
      createdAt: now - 4 * H,
      resolvedAt: null,
    },
    {
      id: "os-0012",
      code: "OS-0012",
      type: "limpeza",
      bedId: 103,
      bedCode: "LE0103",
      description: "Limpeza terminal após alta",
      status: "em_andamento",
      createdAt: now - 3 * H,
      resolvedAt: null,
    },
    {
      id: "os-0013",
      code: "OS-0013",
      type: "manutencao",
      bedId: 118,
      bedCode: "LE0118",
      description: "Troca de suporte de soro quebrado",
      status: "concluida",
      createdAt: now - 6 * H,
      resolvedAt: now - 2 * H,
    },
    {
      id: "os-0014",
      code: "OS-0014",
      type: "limpeza",
      bedId: 207,
      bedCode: "LE0207",
      description: "Higienização de colchão com superfície danificada",
      status: "concluida",
      createdAt: now - 1 * D,
      resolvedAt: now - 18 * H,
    },
    {
      id: "os-0015",
      code: "OS-0015",
      type: "manutencao",
      bedId: 305,
      bedCode: "LE0305",
      description: "Monitor multiparâmetro com falha no módulo de SpO₂",
      status: "concluida",
      createdAt: now - 2 * D,
      resolvedAt: now - 30 * H,
    }
  );
}

/* ---------- Ícones ---------- */
function osIcon(name) {
  const paths = {
    spray: '<path d="M10 4h4m-2-2v4M4 8h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6v2m0 4v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-2.8 2.8-3-3-2.8 2.8-1.4-1.4 2.8-2.8-3-3 2.8-2.8a4.5 4.5 0 0 0-5.9 5.9L3 15.5V21h5.5l3.2-3.2a4.5 4.5 0 0 0 5.9-5.9l-2.9 2.9-3-3 2.9-2.9Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    play: '<path d="M8 5.5v13l11-6.5-11-6.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    check: '<path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none">${paths[name]}</svg>`;
}

/* ---------- Renderização ---------- */
function renderInfra(content) {
  if (typeof seedData === "function") seedData();
  osSeed();

  const orders = store.orders || [];
  const filtered = osActiveFilter === "todas" ? orders : orders.filter((o) => o.status === osActiveFilter);
  const count = (st) => orders.filter((o) => o.status === st).length;
  const total = orders.length;

  content.innerHTML = `
    <div class="sys-kpis os-kpis">
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#D93638;--cb:#FFE9E9"><svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${count("aberta")}</strong><span>Ordens abertas</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#B8820A;--cb:#FFF4D6"><svg viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-4.6-7.3M20 6v3h-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${count("em_andamento")}</strong><span>Em andamento</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#16B370;--cb:#E4F6EE"><svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${count("concluida")}</strong><span>Concluídas</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#0D2B4E;--cb:#E8EEF5"><svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg></span>
        <div><strong>${total}</strong><span>Total de ordens</span></div>
      </div>
    </div>

    <div class="os-bar">
      <div class="os-actions">
        <button class="btn btn--primary btn--sm" id="os-limpeza-btn">
          <span>Solicitar Limpeza Terminal</span>
          <span class="btn-orb">${osIcon("spray")}</span>
        </button>
        <button class="btn btn--ghost btn--sm" id="os-manutencao-btn">
          <span>Solicitar Manutenção</span>
          <span class="btn-orb">${osIcon("wrench")}</span>
        </button>
      </div>
      <div class="os-filters" role="group" aria-label="Filtrar por status">
        ${(["todas", "aberta", "em_andamento", "concluida"])
          .map((f) => {
            const label = f === "todas" ? "Todas" : OS_STATUS_META[f].label;
            const n = f === "todas" ? orders.length : count(f);
            return `<button class="os-pill ${f === osActiveFilter ? "is-active" : ""}" data-filter="${f}">${label}<b>${n}</b></button>`;
          })
          .join("")}
      </div>
    </div>

    <div class="os-list">
      ${filtered.length ? filtered.map((o) => osCardHTML(o)).join("") : osEmptyHTML()}
    </div>`;

  content.querySelectorAll(".os-pill").forEach((pill) =>
    pill.addEventListener("click", () => {
      osActiveFilter = pill.dataset.filter;
      renderInfra(content);
    })
  );
  const limpezaBtn = content.querySelector("#os-limpeza-btn");
  const manutencaoBtn = content.querySelector("#os-manutencao-btn");
  if (limpezaBtn) limpezaBtn.addEventListener("click", () => osOpenModal(content, "limpeza"));
  if (manutencaoBtn) manutencaoBtn.addEventListener("click", () => osOpenModal(content, "manutencao"));

  content.querySelectorAll("[data-os-action]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const o = (store.orders || []).find((x) => x.id === btn.dataset.osAction);
      if (!o) return;
      if (o.status === "aberta") {
        o.status = "em_andamento";
        sysToast(`OS ${o.code} iniciada — agora em andamento`, "info");
      } else if (o.status === "em_andamento") {
        o.status = "concluida";
        o.resolvedAt = Date.now();
        sysToast("OS concluída");
      }
      renderInfra(content);
    })
  );
}

function osCardHTML(o) {
  const meta = OS_STATUS_META[o.status] || OS_STATUS_META.aberta;
  const type = OS_TYPE_META[o.type] || OS_TYPE_META.manutencao;
  const action =
    o.status === "aberta"
      ? `<button class="os-act os-act--start" data-os-action="${o.id}">${osIcon("play")}<span>Iniciar</span></button>`
      : o.status === "em_andamento"
        ? `<button class="os-act os-act--done" data-os-action="${o.id}">${osIcon("check")}<span>Concluir</span></button>`
        : `<span class="os-resolved">Concluída ${osRelTime(o.resolvedAt)}</span>`;

  return `
    <article class="card os-card">
      <div class="os-card-top">
        <div class="os-id">
          <strong>${o.code}</strong>
          <span class="os-type os-type--${o.type}">${type.icon ? osIcon(o.type === "limpeza" ? "spray" : "wrench") : ""}${type.label}</span>
        </div>
        <span class="status-chip ${meta.chip}">${meta.label}</span>
      </div>
      <p class="os-desc">${osEsc(o.description)}</p>
      <div class="os-meta">
        <span>Leito ${o.bedCode}</span>
        <i></i>
        <span>${osRelTime(o.createdAt)}</span>
      </div>
      <div class="os-card-foot">
        ${action}
      </div>
    </article>`;
}

function osEmptyHTML() {
  return `
    <div class="os-empty">
      <span class="os-empty-ico">${osIcon("wrench")}</span>
      <p>Nenhuma ordem de serviço ${osActiveFilter === "todas" ? "" : OS_STATUS_META[osActiveFilter].label.toLowerCase()} encontrada.</p>
    </div>`;
}

/* ---------- Modal "Criar Chamado" ---------- */
function osOpenModal(content, type) {
  if (content.querySelector(".os-modal")) return;
  const t = OS_TYPE_META[type];
  const beds = store.beds || [];
  const options = beds
    .map((b) => `<option value="${b.id}">${b.code} · ${b.sectorLabel} — ${b.status === "ocupado" ? "Ocupado" : b.status === "higienizacao" ? "Higienização" : b.status === "isolamento" ? "Isolamento" : "Vago"}</option>`)
    .join("");
  const placeholders = {
    limpeza: "Ex: Limpeza terminal após alta do paciente",
    manutencao: "Ex: Bomba de infusão sem energia",
  };
  const hints = {
    limpeza: "Após alta ou intercorrência — leito vai para higienização",
    manutencao: "Equipamento com defeito ou infrastructure do leito",
  };

  content.style.overflow = "hidden";
  content.insertAdjacentHTML("beforeend", `
    <div class="os-modal" role="dialog" aria-modal="true" aria-label="Solicitar ${t.label}">
      <div class="os-modal-backdrop" data-os-close></div>
      <div class="os-modal-card card">
        <div class="os-modal-head">
          <div>
            <h4>Solicitar ${t.label}</h4>
            <p>${hints[type]}</p>
          </div>
          <button class="icon-btn icon-btn--sm" data-os-close aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <label class="os-field">
          <span>Leito</span>
          <select class="os-select" id="os-bed">
            <option value="">Selecione o leito...</option>
            ${options}
          </select>
        </label>
        <label class="os-field">
          <span>Descrição</span>
          <textarea class="os-textarea" id="os-desc" placeholder="${placeholders[type]}"></textarea>
        </label>
        <div class="os-modal-actions">
          <button class="btn btn--ghost" data-os-close>Cancelar</button>
          <button class="btn btn--primary" id="os-create" disabled>Criar Chamado</button>
        </div>
      </div>
    </div>`);

  const modal = content.querySelector(".os-modal");
  const sel = modal.querySelector("#os-bed");
  const txt = modal.querySelector("#os-desc");
  const create = modal.querySelector("#os-create");

  const sync = () => {
    create.disabled = !(sel.value && txt.value.trim());
  };
  sel.addEventListener("change", sync);
  txt.addEventListener("input", sync);

  modal.querySelectorAll("[data-os-close]").forEach((el) =>
    el.addEventListener("click", () => osCloseModal(content))
  );

  create.addEventListener("click", () => {
    const bed = (store.beds || []).find((b) => String(b.id) === String(sel.value));
    const now = Date.now();
    const code = osNextCode();
    (store.orders || (store.orders = [])).push({
      id: "os-" + now,
      code,
      type,
      bedId: bed ? bed.id : sel.value,
      bedCode: bed ? bed.code : "—",
      description: txt.value.trim(),
      status: "aberta",
      createdAt: now,
      resolvedAt: null,
    });
    osCloseModal(content);
    osActiveFilter = "aberta";
    renderInfra(content);
    sysToast(`Chamado criado com sucesso — ${code}`);
  });

  if (osEscHandler) document.removeEventListener("keydown", osEscHandler, true);
  osEscHandler = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      osCloseModal(content);
    }
  };
  document.addEventListener("keydown", osEscHandler, true);
  sel.focus();
}

function osCloseModal(content) {
  const modal = content.querySelector(".os-modal");
  if (!modal) return;
  modal.remove();
  content.style.overflow = "";
  if (osEscHandler) {
    document.removeEventListener("keydown", osEscHandler, true);
    osEscHandler = null;
  }
}

/* Registro no sistema (posterga até system.js carregar) */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("infra", renderInfra);
}, 0);
