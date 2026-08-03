/* ============================================================
   Módulo: Dashboard & Censo Digital
   ============================================================ */

/* ---------- Dados geradores ---------- */
const NAMES = ["Eduardo", "Maria", "João", "Ana", "Pedro", "Lucia", "Carlos", "Paula", "Roberto", "Fernanda", "Marcos", "Beatriz", "Antônio", "Camila", "Sônia", "Ricardo", "Helena", "Gabriel", "Teresa", "Vitor"];
const LAST = ["Almeida", "Silva", "Oliveira", "Lima", "Santos", "Costa", "Pereira", "Ribeiro", "Duarte", "Ramos", "Fernandes", "Andrade", "Nunes", "Mendes", "Barros", "Siqueira", "Moura", "Cardoso", "Lopes", "Matos"];
const DIAGS = ["Pneumonia bilateral", "Pós-cirúrgico apendicectomia", "AVC isquêmico", "Sepse de origem urinária", "ICC descompensada", "Fraturas múltiplas", "Diabetes Mellitus tipo 2", "Insuficiência renal aguda", "Crise asmática", "Pós-operatório de colecistectomia"];
const DOCTORS = ["Dr. Ronaldo Dias", "Dr. Gustavo Lima", "Dr. Felipe Andrade", "Dra. Marina Reis", "Dra. Carla Mendes"];

const SECTORS = [
  { id: "posto1", label: "Posto 1", ala: "Clínica Médica", prefix: "LE", n: 10 },
  { id: "posto2", label: "Posto 2", ala: "Clínica Cirúrgica", prefix: "LE", n: 10 },
  { id: "posto3", label: "Posto 3", ala: "Ortopedia", prefix: "LE", n: 10 },
  { id: "posto4", label: "Posto 4", ala: "Maternidade", prefix: "LE", n: 10 },
  { id: "posto5", label: "Posto 5", ala: "Pediatria", prefix: "LE", n: 10 },
  { id: "posto6", label: "Posto 6", ala: "Cardiologia", prefix: "LE", n: 10 },
  { id: "posto7", label: "Posto 7", ala: "Neurologia", prefix: "LE", n: 10 },
  { id: "posto8", label: "Posto 8", ala: "Oncologia", prefix: "LE", n: 10 },
  { id: "utiAdulto", label: "UTI Adulto", ala: "Terapia Intensiva", prefix: "UTI", n: 10 },
  { id: "utiNeo", label: "UTI Neonatal", ala: "Terapia Intensiva", prefix: "UTI", n: 10 },
  { id: "utiCor", label: "UTI Coronariana", ala: "Terapia Intensiva", prefix: "UTI", n: 10 },
  { id: "urologia", label: "Urologia", ala: "Especialidades", prefix: "URO", n: 10 },
  { id: "pa", label: "Pronto Atendimento", ala: "Emergência", prefix: "PA", n: 10 },
];

const STATUSES = ["ocupado", "vago", "higienizacao", "isolamento"];
const CRITIC = ["normal", "alta", "critica"];

function seedData() {
  if (store.beds.length) return; // já semeado
  let bedId = 0;
  const beds = [];
  const patients = [];
  const patientCount = 80;

  for (let s = 0; s < SECTORS.length; s++) {
    const sector = SECTORS[s];
    for (let i = 1; i <= sector.n; i++) {
      bedId++;
      const isUTI = sector.prefix === "UTI";
      const code = `${sector.prefix}${String(sector.n * s + i).padStart(3, "0")}`;
      const status = i <= 6 ? "ocupado" : i === 7 ? "vago" : i === 8 ? "higienizacao" : "vago";
      const patient = status === "ocupado" && patients.length < patientCount
        ? {
            id: `P${bedId}`,
            name: `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${LAST[Math.floor(Math.random() * LAST.length)]}`,
            age: 18 + Math.floor(Math.random() * 72),
            prontuario: `PRT-${1000 + bedId}`,
            diag: DIAGS[Math.floor(Math.random() * DIAGS.length)],
            doctor: DOCTORS[Math.floor(Math.random() * DOCTORS.length)],
            alergias: Math.random() < 0.2 ? "Penicilina" : "Nenhuma conhecida",
            criticidade: isUTI ? (Math.random() < 0.5 ? "critica" : "alta") : CRITIC[Math.floor(Math.random() * 3)],
          }
        : null;
      if (patient) patients.push(patient);
      beds.push({
        id: bedId,
        code,
        sector: sector.id,
        sectorLabel: sector.label,
        status,
        patientId: patient ? patient.id : null,
        isolamento: status === "isolamento",
      });
    }
  }

  store.beds = beds;
  store.patients = patients;
  emit("seeded", { beds, patients });
}

/* ---------- Renderização do Dashboard ---------- */
function renderDashboard(content) {
  seedData();
  const beds = store.beds;
  const total = beds.length;
  const ocupados = beds.filter((b) => b.status === "ocupado").length;
  const livres = beds.filter((b) => b.status === "vago").length;
  const higienizacao = beds.filter((b) => b.status === "higienizacao").length;
  const isolamento = beds.filter((b) => b.status === "isolamento").length;
  const pct = Math.round((ocupados / total) * 100);

  content.innerHTML = `
    <div class="sys-kpis">
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#16B370;--cb:#E4F6EE"><svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${ocupados}</strong><span>Ocupados</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#0D2B4E;--cb:#E8EEF5"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18m-7-2h14M8 5h8M12 5v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${livres}</strong><span>Livres</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#B8820A;--cb:#FFF4D6"><svg viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-4.6-7.3M20 6v3h-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${higienizacao}</strong><span>Em higienização</span></div>
      </div>
      <div class="sys-kpi">
        <span class="sys-kpi-ico" style="--c:#D93638;--cb:#FFE9E9"><svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><strong>${isolamento}</strong><span>Isolamentos</span></div>
      </div>
    </div>

    <div class="sys-grid">
      <div class="card sys-card sys-card--donut">
        <div class="card-head">
          <div><h4>Censo Diário</h4><p>Ocupação dos ${total} leitos</p></div>
          <span class="live-chip"><span></span>hoje</span>
        </div>
        <div class="censo-body">
          <div class="donut-wrap">
            <svg class="donut" viewBox="0 0 180 180">
              <circle class="donut-track" cx="90" cy="90" r="70"/>
              <circle class="donut-seg" data-seg="0" cx="90" cy="90" r="70"/>
              <circle class="donut-seg" data-seg="1" cx="90" cy="90" r="70"/>
              <circle class="donut-seg" data-seg="2" cx="90" cy="90" r="70"/>
              <circle class="donut-seg" data-seg="3" cx="90" cy="90" r="70"/>
            </svg>
            <div class="donut-center">
              <strong id="donut-value">0%</strong>
              <span>${ocupados} de ${total} leitos</span>
            </div>
          </div>
          <ul class="censo-legend">
            <li><i style="--c:#16B370"></i>Ocupados<strong>${ocupados}<b>${Math.round((ocupados / total) * 100)}%</b></strong></li>
            <li><i style="--c:#0D2B4E"></i>Livres<strong>${livres}<b>${Math.round((livres / total) * 100)}%</b></strong></li>
            <li><i style="--c:#FFD97A"></i>Higienização<strong>${higienizacao}<b>${Math.round((higienizacao / total) * 100)}%</b></strong></li>
            <li><i style="--c:#FF4D4F"></i>Isolamento<strong>${isolamento}<b>${Math.round((isolamento / total) * 100)}%</b></strong></li>
          </ul>
        </div>
      </div>

      <div class="card sys-card sys-card--mapa">
        <div class="card-head">
          <div><h4>Mapa de Leitos</h4><p>${ocupados} ocupados · clique num leito</p></div>
        </div>
        <div id="sys-bedmap" class="sys-bedmap"></div>
        <div class="bed-legend">
          <span><i style="--c:#16B370"></i>Ocupado</span>
          <span><i style="--c:#E0E4E9"></i>Vago</span>
          <span><i style="--c:#FFD97A"></i>Higienização</span>
          <span><i style="--c:#FF4D4F"></i>Isolamento</span>
        </div>
      </div>

      <div class="card sys-card sys-card--setores">
        <div class="card-head">
          <div><h4>Leitos por Setor</h4><p>${SECTORS.length} setores monitorados</p></div>
        </div>
        <div class="sys-setores" id="sys-setores"></div>
      </div>

      <div class="card sys-card sys-card--resumo">
        <div class="card-head">
          <div><h4>Resumo do Dia</h4><p>Movimentação de pacientes</p></div>
        </div>
        <div class="resumo-grid">
          <div class="resumo-item">
            <span class="resumo-ico" style="--c:#16B370;--cb:#E4F6EE"><svg viewBox="0 0 24 24" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4 5-5-5-5m5 5H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <strong data-count="32">0</strong><span>Altas</span>
          </div>
          <div class="resumo-item">
            <span class="resumo-ico" style="--c:#0D2B4E;--cb:#E8EEF5"><svg viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <strong data-count="18">0</strong><span>Internações</span>
          </div>
          <div class="resumo-item">
            <span class="resumo-ico" style="--c:#B8820A;--cb:#FFF4D6"><svg viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4m6 12v-12m0 12 4-4m-4 4-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <strong data-count="7" data-pad="2">00</strong><span>Transferências</span>
          </div>
          <div class="resumo-item">
            <span class="resumo-ico" style="--c:#D93638;--cb:#FFE9E9"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.3 5.2 5.2 0 0 1 21.3 11c-1.8 4.4-9.3 9-9.3 9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>
            <strong data-count="5" data-pad="2">00</strong><span>Óbitos</span>
          </div>
        </div>
      </div>
    </div>`;

  renderBedMap(content, { total, ocupados });
  renderSetores(content, beds);
  initDonut(content, ocupados, total);
  initCounts(content);
}

/* ---------- Mapa de leitos ---------- */
function renderBedMap(content, { total, ocupados }) {
  const map = content.querySelector("#sys-bedmap");
  const groups = {};
  for (const b of store.beds) {
    (groups[b.sector] = groups[b.sector] || []).push(b);
  }
  let html = "";
  for (const s of SECTORS) {
    const list = groups[s.id] || [];
    const tone = (st) => (st === "ocupado" ? "ok" : st === "higienizacao" ? "warn" : st === "isolamento" ? "alert" : "free");
    html += `
      <div class="sys-bmap-ala">
        <span class="sys-bmap-label">${s.label}</span>
        <div class="sys-bmap-row">
          ${list
            .map(
              (b) => `<button class="sys-bmap-tile sys-bmap-tile--${tone(b.status)}" data-bed="${b.id}" title="${b.code} · ${b.patientId ? store.patients.find((p) => p.id === b.patientId)?.name : "Livre"}">${b.code.replace(/^[A-Z]+/, "")}</button>`
            )
            .join("")}
        </div>
      </div>`;
  }
  map.innerHTML = html;
  sys.$$(".sys-bmap-tile", map).forEach((tile) =>
    tile.addEventListener("click", () => {
      const b = store.beds.find((x) => x.id == tile.dataset.bed);
      store.selectedBedId = b.id;
      sys.$$(".sys-bmap-tile", map).forEach((t) => t.classList.remove("is-selected"));
      tile.classList.add("is-selected");
      if (!store.online) {
        sysToast("Offline — seleção salva localmente", "warning");
        return;
      }
      const p = b.patientId ? store.patients.find((x) => x.id === b.patientId) : null;
      sysToast(p ? `Leito ${b.code} — ${p.name}` : `Leito ${b.code} — livre`);
    })
  );
}

/* ---------- Setores ---------- */
function renderSetores(content, beds) {
  const el = content.querySelector("#sys-setores");
  const groups = {};
  for (const b of beds) (groups[b.sector] = groups[b.sector] || []).push(b);
  el.innerHTML = SECTORS.map((s) => {
    const list = groups[s.id] || [];
    const occ = list.filter((b) => b.status === "ocupado").length;
    const pct = Math.round((occ / list.length) * 100);
    return `
      <div class="sys-setor">
        <div class="sys-setor-head">
          <strong>${s.label}</strong>
          <span>${s.ala}</span>
        </div>
        <div class="sys-setor-bar"><i style="width:${pct}%"></i></div>
        <div class="sys-setor-meta"><span>${occ}/${list.length} ocupados</span><em>${pct}%</em></div>
      </div>`;
  }).join("");
}

/* ---------- Donut ---------- */
function initDonut(content, ocupados, total) {
  const segs = content.querySelectorAll(".donut-seg");
  const val = content.querySelector("#donut-value");
  const livres = total - ocupados;
  const higi = store.beds.filter((b) => b.status === "higienizacao").length;
  const isol = store.beds.filter((b) => b.status === "isolamento").length;
  const DONUT = [
    { pct: (ocupados / total) * 100, color: 0 },
    { pct: (livres / total) * 100, color: 1 },
    { pct: (higi / total) * 100, color: 2 },
    { pct: (isol / total) * 100, color: 3 },
  ];
  const CIRC = 2 * Math.PI * 70;
  segs.forEach((seg, i) => (seg.style.stroke = ["#16B370", "#0D2B4E", "#FFD97A", "#FF4D4F"][i]));
  function render(progress) {
    let offset = 0;
    segs.forEach((seg, i) => {
      const len = (DONUT[i].pct / 100) * CIRC * progress;
      const gap = CIRC - len;
      seg.style.strokeDasharray = `${Math.max(len - 2.5, 0)} ${gap + 2.5}`;
      seg.style.strokeDashoffset = -offset;
      offset += len;
    });
  }
  segs.forEach((s) => (s.style.strokeDasharray = `0 ${CIRC}`));
  const t0 = performance.now();
  const dur = 1200;
  const tick = () => {
    const p = Math.min((performance.now() - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 4);
    render(e);
    val.textContent = Math.round(((ocupados / total) * 100) * e) + "%";
    if (p < 1) setTimeout(tick, 16);
  };
  tick();
}

/* ---------- Contadores ---------- */
function initCounts(content) {
  const els = content.querySelectorAll("[data-count]");
  els.forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const pad = parseInt(el.dataset.pad || "0", 10);
    const t0 = performance.now();
    const dur = 1200;
    const tick = () => {
      const p = Math.min((performance.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      let v = Math.round(target * e).toString();
      if (pad) v = v.padStart(pad, "0");
      el.textContent = v + suffix;
      if (p < 1) setTimeout(tick, 16);
    };
    tick();
  });
}
