/* ============================================================
   Módulo: Portal Multiprofissional
   Evoluções da equipe (fisioterapia, nutrição, odontologia,
   serviço social, psicologia) integradas ao prontuário único.
   Feature: docs/features/06-portal-multiprofissional.md
   ============================================================ */

const MP_SPECIALTIES = [
  { id: "fisio",  label: "Fisioterapia",        initials: "FT", color: "#0E8A56", bg: "#E4F6EE" },
  { id: "nutri",  label: "Nutrição Hospitalar", initials: "NT", color: "#0D2B4E", bg: "#E8EEF5" },
  { id: "odonto", label: "Odontologia",         initials: "OD", color: "#B8820A", bg: "#FFF4D6" },
  { id: "social", label: "Serviço Social",      initials: "SS", color: "#667085", bg: "#F2F4F7" },
  { id: "psico",  label: "Psicologia",          initials: "PS", color: "#0B6B43", bg: "#E4F6EE" },
];

let mpActiveTab = "fisio";
let mpEscHandler = null;
let mpResizeFn = null;

/* ---------- Helpers ---------- */
function mpEsc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function mpRelTime(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/* ---------- Seed de notas multiprofissionais (3-4 por especialidade) ---------- */
function mpSeed() {
  if (!store.multiProfNotes) store.multiProfNotes = [];
  if (store.multiProfNotes.length) return;
  const now = Date.now();
  const H = 3600000;
  const D = 86400000;
  const pat = (i) => (store.patients && (store.patients[i] || store.patients[0])) || { id: "P0", name: "Paciente" };
  const bedOf = (p) => (store.beds || []).find((b) => b.patientId === p.id);
  const mk = (especialidade, i, autor, texto, ago) => {
    const p = pat(i);
    const b = bedOf(p);
    store.multiProfNotes.push({
      especialidade,
      paciente: p.name,
      bedCode: b ? b.code : "",
      autor,
      texto,
      timestamp: now - ago,
    });
  };

  /* Fisioterapia */
  mk("fisio", 0, "Fisiot. Carla Menezes", "Paciente deambulando com auxílio de andador, bom padrão de marcha. Mantido plano de cinesioterapia respiratória 2x/dia.", 2 * H);
  mk("fisio", 3, "Fisiot. Carla Menezes", "Realizada mobilização precoce no leito com cicloergômetro por 15 min. Boa tolerância, sem dessaturação.", 5 * H);
  mk("fisio", 6, "Fisiot. Rafael Costa", "Paciente refere melhora da dispneia. Ausculta pulmonar com murmúrios vesiculares presentes, sem ruídos adventícios.", 26 * H);
  mk("fisio", 9, "Fisiot. Carla Menezes", "Iniciado treino de equilíbrio estático com base reduzida. Orientado uso de calçado antiderrapante.", 3 * D);

  /* Nutrição Hospitalar */
  mk("nutri", 1, "Nutr. Ricardo Alves", "Dieta hipossódica oral aceita 80%. Orientada ingestão hídrica de 1,5L/dia.", 2 * H);
  mk("nutri", 4, "Nutr. Ricardo Alves", "Avaliação nutricional: IMC 24,1 — eutrofia. Mantida dieta geral para diabetes.", 6 * H);
  mk("nutri", 7, "Nutr. Fernanda Lima", "Paciente em dieta enteral via SNE com boa aceitação, sem distensão abdominal. Mantido volume atual.", 28 * H);
  mk("nutri", 10, "Nutr. Fernanda Lima", "Orientada família sobre preparo de dieta pastosa no domicílio pós-alta.", 4 * D);

  /* Odontologia */
  mk("odonto", 2, "Odont. Paula Santos", "Realizada higiene oral com clorexidina 0,12% e avaliação de mucosa — sem lesões.", 3 * H);
  mk("odonto", 5, "Odont. Paula Santos", "Paciente com prótese total superior mal adaptada. Encaminhado para avaliação com especialista.", 7 * H);
  mk("odonto", 8, "Odont. Marcos Silva", "Orientada escovação supervisionada 3x/dia. Sem sinais de candidíase oral.", 30 * H);
  mk("odonto", 11, "Odont. Paula Santos", "Avaliação odontológica pré-operatória concluída — paciente liberado para cirurgia.", 5 * D);

  /* Serviço Social */
  mk("social", 0, "Assist. Social Mariana Lima", "Contato telefônico com familiar responsável — ciente do quadro clínico e do plano de cuidados.", 2 * H);
  mk("social", 3, "Assist. Social Mariana Lima", "Paciente sem rede de apoio próxima; acionado CRAS para acompanhamento pós-alta.", 9 * H);
  mk("social", 6, "Assist. Social Juliana Prado", "Encaminhado pedido de Benefício de Prestação Continuada (BPC) à família.", 2 * D);
  mk("social", 9, "Assist. Social Mariana Lima", "Reunião com equipe multiprofissional sobre planejamento de alta — indicado cuidador formal.", 4 * D);

  /* Psicologia */
  mk("psico", 1, "Psic. João Paulo", "Paciente apresenta ansiedade relacionada à internação. Realizada escuta ativa e orientação sobre a rotina hospitalar.", 1 * H);
  mk("psico", 4, "Psic. João Paulo", "Relata insônia e preocupação com o diagnóstico. Técnica de respiração diafragmática orientada.", 6 * H);
  mk("psico", 7, "Psic. Ana Beatriz", "Sessão familiar: acolhida a angústia dos acompanhantes; combinado encontro quinzenal.", 27 * H);
  mk("psico", 10, "Psic. João Paulo", "Bom vínculo terapêutico estabelecido. Mantido acompanhamento psicológico diário.", 3 * D);
}

/* ---------- Renderização ---------- */
function mpNotesHTML(spec) {
  const notes = (store.multiProfNotes || [])
    .filter((n) => n.especialidade === spec.id)
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!notes.length) {
    return `
      <div class="mp-empty">
        <span class="mp-empty-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <p>Nenhum registro de ${spec.label} — Clique em 'Novo Registro' para adicionar a primeira evolução.</p>
      </div>`;
  }
  return notes.map((n) => mpNoteHTML(spec, n)).join("");
}

function mpNoteHTML(spec, n) {
  const time = mpRelTime(n.timestamp ?? n.ts);
  const meta = [n.bedCode ? `Leito ${n.bedCode}` : "", n.autor].filter(Boolean).join(" · ");
  return `
    <article class="mp-note">
      <span class="mp-note-avatar" style="--c:${spec.color};--cb:${spec.bg}">${spec.initials}</span>
      <div class="mp-note-main">
        <div class="mp-note-top">
          <strong>${mpEsc(n.paciente)}</strong>
          <span class="mp-note-time">${time}</span>
        </div>
        <span class="mp-note-meta">${mpEsc(meta)}</span>
        <p>${mpEsc(n.texto)}</p>
      </div>
    </article>`;
}

function renderMultiprof(content) {
  if (typeof seedData === "function") seedData();
  mpSeed();

  const tabsHtml = MP_SPECIALTIES.map(
    (s) => `<button class="med-tab ${s.id === mpActiveTab ? "is-active" : ""}" data-tab="${s.id}" role="tab" aria-selected="${s.id === mpActiveTab}">${s.label}</button>`
  ).join("");
  const panelsHtml = MP_SPECIALTIES.map(
    (s) => `
      <div class="med-panel ${s.id === mpActiveTab ? "is-active" : ""}" id="mp-panel-${s.id}" role="tabpanel" aria-label="${s.label}">
        ${mpNotesHTML(s)}
      </div>`
  ).join("");

  content.innerHTML = `
    <div class="mp-head">
      <div>
        <h4>Portal Multiprofissional</h4>
        <p>Evolução multiprofissional integrada ao prontuário único do paciente</p>
      </div>
      <button class="btn btn--primary btn--sm" id="mp-new-btn">
        <span>Novo Registro</span>
        <span class="btn-orb"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
      </button>
    </div>

    <div class="card mp-card">
      <div class="med-tabs" id="mp-tabs" role="tablist" aria-label="Especialidades">
        ${tabsHtml}
        <span class="med-tab-ink" id="mp-tab-ink"></span>
      </div>
      ${panelsHtml}
    </div>`;

  /* Abas com ink indicator (offsetWidth/offsetLeft, como na landing) */
  const tabs = sys.$$(".med-tab", content);
  const ink = content.querySelector("#mp-tab-ink");
  const active = tabs.find((t) => t.dataset.tab === mpActiveTab) || tabs[0];
  const moveInk = (tab) => {
    if (!ink || !tab) return;
    ink.style.width = tab.offsetWidth + "px";
    ink.style.transform = `translateX(${tab.offsetLeft}px)`;
  };
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      mpActiveTab = tab.dataset.tab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on);
      });
      sys.$$(".med-panel", content).forEach((p) => p.classList.toggle("is-active", p.id === "mp-panel-" + mpActiveTab));
      moveInk(tab);
    })
  );
  const bindInk = () => {
    if (active && active.isConnected) moveInk(active);
  };
  if (mpResizeFn) removeEventListener("resize", mpResizeFn);
  mpResizeFn = bindInk;
  addEventListener("resize", mpResizeFn);
  requestAnimationFrame(bindInk);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(bindInk);

  const newBtn = content.querySelector("#mp-new-btn");
  if (newBtn) newBtn.addEventListener("click", () => mpOpenModal(content, mpActiveTab));
}

/* ---------- Modal "Novo Registro" ---------- */
function mpOpenModal(content, specId) {
  if (content.querySelector(".mp-modal")) return;
  const spec = MP_SPECIALTIES.find((s) => s.id === specId) || MP_SPECIALTIES[0];
  const options = (store.beds || [])
    .filter((b) => b.status === "ocupado" && b.patientId)
    .map((b) => {
      const p = (store.patients || []).find((x) => x.id === b.patientId);
      return `<option value="${p ? p.id : ""}">${b.code} — ${p ? mpEsc(p.name) : "Paciente"}</option>`;
    })
    .join("");

  content.style.overflow = "hidden";
  content.insertAdjacentHTML("beforeend", `
    <div class="mp-modal" role="dialog" aria-modal="true" aria-label="Novo Registro — ${spec.label}">
      <div class="mp-modal-backdrop" data-mp-close></div>
      <div class="mp-modal-card card">
        <div class="mp-modal-head">
          <div>
            <h4>Novo Registro</h4>
            <p>Evolução multiprofissional · ${spec.label}</p>
          </div>
          <button class="icon-btn icon-btn--sm" data-mp-close aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <label class="mp-field">
          <span>Paciente</span>
          <select class="mp-select" id="mp-patient">
            <option value="">Selecione um paciente...</option>
            ${options}
          </select>
        </label>
        <label class="mp-field">
          <span>Evolução</span>
          <textarea class="mp-textarea" id="mp-text" placeholder="Descreva a conduta, avaliação e evolução..."></textarea>
        </label>
        <div class="mp-modal-actions">
          <button class="btn btn--ghost" data-mp-close>Cancelar</button>
          <button class="btn btn--primary" id="mp-save" disabled>Salvar Registro</button>
        </div>
      </div>
    </div>`);

  const modal = content.querySelector(".mp-modal");
  const sel = modal.querySelector("#mp-patient");
  const txt = modal.querySelector("#mp-text");
  const save = modal.querySelector("#mp-save");

  const sync = () => {
    save.disabled = !(sel.value && txt.value.trim());
  };
  sel.addEventListener("change", sync);
  txt.addEventListener("input", sync);

  modal.querySelectorAll("[data-mp-close]").forEach((el) =>
    el.addEventListener("click", () => mpCloseModal(content))
  );

  save.addEventListener("click", () => {
    const p = (store.patients || []).find((x) => x.id === sel.value);
    const bed = (store.beds || []).find((b) => b.patientId === (p && p.id));
    (store.multiProfNotes || (store.multiProfNotes = [])).push({
      especialidade: spec.id,
      paciente: p ? p.name : "Paciente",
      bedCode: bed ? bed.code : "",
      autor: "Enf. Beatriz Rocha",
      texto: txt.value.trim(),
      timestamp: Date.now(),
    });
    mpCloseModal(content);
    renderMultiprof(content);
    sysToast("Nota multiprofissional adicionada ao prontuário.");
  });

  /* Intercepta Esc na fase de captura antes do handler global do shell */
  if (mpEscHandler) document.removeEventListener("keydown", mpEscHandler, true);
  mpEscHandler = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      mpCloseModal(content);
    }
  };
  document.addEventListener("keydown", mpEscHandler, true);
  sel.focus();
}

function mpCloseModal(content) {
  const modal = content.querySelector(".mp-modal");
  if (!modal) return;
  modal.remove();
  content.style.overflow = "";
  if (mpEscHandler) {
    document.removeEventListener("keydown", mpEscHandler, true);
    mpEscHandler = null;
  }
}

/* Registro no sistema (posterga até system.js carregar) */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("multiprof", renderMultiprof);
}, 0);
