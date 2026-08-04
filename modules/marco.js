/* ============================================================
   Módulo: Marco Legal (LC 182/2021 · CPSIP)
   Página institucional — roadmap de 12 meses.
   ============================================================ */

const MARCO_FASES = [
  { n: 1, titulo: "Desenvolvimento & Infraestrutura", periodo: "Meses 1-4", progresso: 100, status: "Concluída", chip: "status-chip--ok" },
  { n: 2, titulo: "Piloto Controlado", periodo: "Meses 5-8", progresso: 55, status: "Em curso", chip: "status-chip--warn" },
  { n: 3, titulo: "Expansão 100%", periodo: "Meses 9-12", progresso: 0, status: "Planejada", chip: "status-chip--idle" },
];

const MARCO_ENTREGAS = [
  { titulo: "Levantamento de requisitos clínicos", desc: "Imersão com enfermeiros, farmacêuticos e gestão" },
  { titulo: "Arquitetura PWA offline-first", desc: "Sincronização assíncrona e armazenamento local" },
  { titulo: "MVP dos módulos core", desc: "Censo digital, sinais vitais e prescrição" },
  { titulo: "Infraestrutura cloud e segurança", desc: "LGPD, criptografia em repouso e trânsito" },
];

const MARCO_CARDS = [
  { ico: "scale", titulo: "Enquadramento Legal", texto: "Empresa Receptora de Tecnologia Inovadora (ERTI) junto ao CPSIP, ambiente de testes regulado pela ANVISA" },
  { ico: "shield", titulo: "Conformidade Regulatória", texto: "LGPD, Resolução CFM 1.821/2007 (prontuário digital), normas SBIS" },
  { ico: "doc", titulo: "Contratação Pública", texto: "Regime diferenciado via CPSIP sem licitação tradicional" },
  { ico: "flask", titulo: "Ambiente de Testes", texto: "Sandbox regulatório com supervisão de comitê de ética" },
  { ico: "chart", titulo: "Métricas de Piloto", texto: "Adoção >80%, redução de 60% no tempo de checagem, papel zero em 90% dos leitos" },
  { ico: "devices", titulo: "Escalabilidade", texto: "PWA permite expansão multiunidade sem instalação local" },
];

const MARCO_ICONS = {
  scale: '<path d="M12 3v18m-7-2h14M8 5h8M12 5v2m-4 4 2.5 3m3-3 2.5 3M12 8a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3h-2.5m0 0L12 8m3.5 0L12 8M8 11a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3h2.5M8 11 8 8m0 3L8 8m0 0L5.5 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  shield: '<path d="M12 3 4.5 6v5c0 5 3.4 8.4 7.5 10 4.1-1.6 7.5-5 7.5-10V6L12 3Zm-3 9 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  flask: '<path d="M9 3h6M10 3v5.5L4.8 17a2.4 2.4 0 0 0 2.1 3.5h10.2a2.4 2.4 0 0 0 2.1-3.5L14 8.5V3M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  chart: '<path d="M4 20v-6m5.5 6V8M15 20v-9m5 9V5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  devices: '<path d="M4 8h2.5l2-2.5h7L17.5 8H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Zm8 2v6m-3-3h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
};

function renderMarco(content) {
  content.innerHTML = `
    <div class="marco-hero">
      <span class="eyebrow eyebrow--dark"><span class="eyebrow-dot"></span>Lei Complementar 182/2021 · CPSIP</span>
      <h2>Marco Legal das Startups</h2>
      <p>Centro Público de Simulação e Inovação em Produtos para a Saúde — enquadramento como startup de base tecnológica, regime especial de contratação e ambiente de testes supervisionado.</p>
    </div>

    <div class="card sys-card sys-card--full">
      <div class="card-head">
        <div><h4>Cronograma — 12 meses</h4><p>Mês 7 de 12</p></div>
        <span class="live-chip"><span></span>em curso</span>
      </div>
      <div class="marco-timeline">
        <div class="marco-track">
          <span class="marco-track-fill" style="width:58%"></span>
          ${[1, 3, 5, 7, 9, 11, 12].map((m) => `<i class="marco-marker ${m <= 7 ? "is-done" : ""}" style="left:${(m / 12) * 100}%">${m}</i>`).join("")}
        </div>
      </div>
      <div class="marco-fases">
        ${MARCO_FASES.map(
          (f) => `
        <div class="marco-fase">
          <div class="marco-fase-head">
            <strong>FASE ${f.n} — ${f.titulo}</strong>
            <span class="status-chip ${f.chip}">${f.status}</span>
          </div>
          <p class="marco-fase-periodo">${f.periodo}</p>
          <div class="sys-setor-bar"><i style="width:${f.progresso}%"></i></div>
          <span class="marco-fase-pct">${f.progresso}%</span>
        </div>`
        ).join("")}
      </div>
    </div>

    <div class="card sys-card sys-card--full">
      <div class="card-head">
        <div><h4>Entregas da Fase 1</h4><p>4 de 4 concluídas</p></div>
      </div>
      <div class="marco-entregas">
        ${MARCO_ENTREGAS.map(
          (e) => `
        <div class="marco-entrega">
          <span class="check-ico"><svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <div><strong>${e.titulo}</strong><span>${e.desc}</span></div>
        </div>`
        ).join("")}
      </div>
    </div>

    <div class="marco-cards">
      ${MARCO_CARDS.map(
        (c, i) => `
      <div class="card sys-card" style="--d:${i * 60}ms">
        <span class="sys-kpi-ico" style="--c:#0E8A56;--cb:#E4F6EE"><svg viewBox="0 0 24 24" fill="none">${MARCO_ICONS[c.ico]}</svg></span>
        <h4>${c.titulo}</h4>
        <p>${c.texto}</p>
      </div>`
      ).join("")}
    </div>

    <div class="card sys-card sys-card--full marco-docs">
      <p>Documentação completa do enquadramento — Protocolo, termo de cooperação e relatórios de piloto disponíveis para o gestor.</p>
      <button class="btn btn--primary btn--sm" data-toast="Demo: documentação indisponível">
        <span>Acessar Documentos</span>
        <span class="btn-orb"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </button>
    </div>`;
}

/* Registro no sistema */
setTimeout(() => {
  if (typeof registerModule === "function") registerModule("marco", renderMarco);
}, 0);
