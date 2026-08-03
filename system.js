/* ============================================================
   NurseFlow — Sistema (SPA shell)
   Store global + navegação + tema + toasts + módulos
   ============================================================ */
const sys = {
  $: (s, c = document) => c.querySelector(s),
  $$: (s, c = document) => [...c.querySelectorAll(s)],
};

/* ---------- Estado global (store) ---------- */
const store = {
  activeModule: "dashboard",
  dark: false,
  online: true,
  selectedBedId: null,
  toasts: [],
  /* dados (compartilhados entre módulos) */
  beds: [],
  patients: [],
  prescriptions: [],
  doses: [],
  orders: [],
  multiProfNotes: [],
  listeners: {},
};

function emit(ev, payload) {
  (store.listeners[ev] || []).forEach((fn) => fn(payload));
}
function on(ev, fn) {
  (store.listeners[ev] = store.listeners[ev] || []).push(fn);
}

/* ---------- Toast (usa o toast-root da landing) ---------- */
const sysToastRoot = $("#toast-root");
const TOAST_OK = '<span class="toast-ico"><svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const TOAST_WARN = '<span class="toast-ico toast-ico--warn"><svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const TOAST_INFO = '<span class="toast-ico toast-ico--info"><svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></span>';
function sysToast(msg, variant = "success") {
  const el = document.createElement("div");
  el.className = "toast" + (variant === "warning" ? " toast--warn" : variant === "info" ? " toast--info" : "");
  el.innerHTML = (variant === "warning" ? TOAST_WARN : variant === "info" ? TOAST_INFO : TOAST_OK) + "<span></span>";
  el.lastElementChild.textContent = msg;
  sysToastRoot.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-in")));
  setTimeout(() => {
    el.classList.remove("is-in");
    setTimeout(() => el.remove(), 550);
  }, 2600);
  while (sysToastRoot.children.length > 3) sysToastRoot.firstElementChild.remove();
}

/* ---------- Navegação ---------- */
const MODULES = [
  {
    group: "Cuidado & Censo",
    items: [
      { id: "dashboard", label: "Dashboard & Censo", icon: "grid" },
      { id: "vitais", label: "Sinais Vitais & Glicemia", icon: "activity" },
      { id: "beira", label: "Beira de Leito & SAE", icon: "bed" },
    ],
  },
  {
    group: "Farmácia & Medicação",
    items: [
      { id: "prescricao", label: "Prescrição & Farmácia", icon: "rx" },
      { id: "aprazamento", label: "Aprazamento & Checagem", icon: "clock", badge: 248 },
    ],
  },
  {
    group: "Equipe & Infra",
    items: [
      { id: "multiprof", label: "Portal Multiprofissional", icon: "users" },
      { id: "infra", label: "Infraestrutura & Higiene", icon: "wrench" },
    ],
  },
  {
    group: "Gestão",
    items: [{ id: "marco", label: "Marco Legal (LC 182)", icon: "scale" }],
  },
];

const ICONS = {
  grid: '<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  activity: '<path d="M4 12h4l2.5-6 4 12 2.5-6h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  bed: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  rx: '<path d="m10.5 20.5-7-7a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7Zm-7-7 7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  users: '<path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.87M14 4.13a4 4 0 0 1 0 7.75M12.5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-2.8 2.8-3-3-2.8 2.8-1.4-1.4 2.8-2.8-3-3 2.8-2.8a4.5 4.5 0 0 0-5.9 5.9L3 15.5V21h5.5l3.2-3.2a4.5 4.5 0 0 0 5.9-5.9l-2.9 2.9-3-3 2.9-2.9Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  scale: '<path d="M12 3v18m-7-2h14M8 5h8M12 5v2m-4 4 2.5 3m3-3 2.5 3M12 8a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3h-2.5m0 0L12 8m3.5 0L12 8M8 11a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3h2.5M8 11 8 8m0 3L8 8m0 0L5.5 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
};

function renderNav() {
  const nav = $("#sys-nav");
  nav.innerHTML = MODULES.map(
    (g) => `
      <div class="sys-group">
        <span class="sys-group-label">${g.group}</span>
        ${g.items
          .map(
            (it) => `
          <button class="sys-item ${store.activeModule === it.id ? "is-active" : ""}" data-module="${it.id}">
            <span class="sys-ico"><svg viewBox="0 0 24 24" fill="none">${ICONS[it.icon]}</svg></span>
            <span class="sys-item-label">${it.label}</span>
            ${it.badge ? `<i class="sys-badge">${it.badge}</i>` : ""}
          </button>`
          )
          .join("")}
      </div>`
  ).join("");
  sys.$$(".sys-item", nav).forEach((btn) =>
    btn.addEventListener("click", () => setModule(btn.dataset.module))
  );
}

/* ---------- Shell: abrir/fechar ---------- */
const appShell = $("#app-shell");
function openSystem(moduleId) {
  appShell.classList.add("is-open");
  appShell.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setModule(moduleId || "dashboard");
  closeSide();
  window.scrollTo(0, 0);
}
function closeSystem() {
  appShell.classList.remove("is-open");
  appShell.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function openSide() {
  appShell.classList.add("side-open");
}
function closeSide() {
  appShell.classList.remove("side-open");
}

function setModule(id) {
  if (!MODULES.flatMap((g) => g.items).some((i) => i.id === id)) return;
  store.activeModule = id;
  sys.$$(".sys-item").forEach((b) => b.classList.toggle("is-active", b.dataset.module === id));
  const mod = MODULES.flatMap((g) => g.items).find((i) => i.id === id);
  $("#sys-title").textContent = mod.label;
  $("#sys-sub").textContent = SUBTITLES[id] || "";
  renderModule(id);
}

/* ---------- Tema (dark mode — escopado ao shell do sistema) ---------- */
const themeBtn = $("#sys-theme");
function applyDark(dark) {
  appShell.classList.toggle("is-dark", dark);
  themeBtn.classList.toggle("is-dark", dark);
  store.dark = dark;
}
function toggleDark() {
  applyDark(!store.dark);
  try {
    localStorage.setItem("nf-theme", store.dark ? "dark" : "light");
  } catch {}
  sysToast(store.dark ? "Tema escuro ativado" : "Tema claro ativado", "info");
}
themeBtn.addEventListener("click", toggleDark);
try {
  applyDark(localStorage.getItem("nf-theme") === "dark");
} catch {}
if (!store.dark && matchMedia("(prefers-color-scheme: dark)").matches) applyDark(true);

/* ---------- Online/offline simulado ---------- */
const onlineBtn = $("#sys-online");
function setOnline(online) {
  store.online = online;
  onlineBtn.classList.toggle("is-offline", !online);
  onlineBtn.querySelector(".sys-online-txt").textContent = online ? "Online" : "Offline";
  onlineBtn.title = online ? "Online — clique para simular offline" : "Offline — clique para reconectar";
}
onlineBtn.addEventListener("click", () => {
  setOnline(!store.online);
  sysToast(
    store.online ? "Conexão restabelecida — dados sincronizados" : "Modo offline ativado — alterações serão sincronizadas ao reconectar",
    store.online ? "success" : "warning"
  );
});

/* ---------- Notificações ---------- */
$("#sys-bell").addEventListener("click", () => {
  sysToast("248 doses atrasadas precisam de checagem", "warning");
});

/* ---------- Renderização de módulo (stub — preenchido por cada módulo) ---------- */
const SUBTITLES = {
  dashboard: "Visão geral da unidade",
  vitais: "Coleta e histórico de parâmetros",
  beira: "Prontuário e evolução à beira do leito",
  prescricao: "Circuito fechado da medicação",
  aprazamento: "Doses, horários e checagem",
  multiprof: "Evolução integrada da equipe",
  infra: "Ordens de serviço e higiene",
  marco: "Enquadramento regulatório",
};
function renderModule(id) {
  const content = $("#sys-content");
  content.innerHTML = "";
  if (id === "dashboard") renderDashboard(content);
  else renderPlaceholder(content, id);
}

function renderPlaceholder(content, id) {
  const mod = MODULES.flatMap((g) => g.items).find((i) => i.id === id);
  content.innerHTML = `
    <div class="sys-placeholder">
      <span class="sys-placeholder-ico"><svg viewBox="0 0 24 24" fill="none">${ICONS[mod.icon]}</svg></span>
      <h2>${mod.label}</h2>
      <p>Módulo em construção. A spec está em <code>docs/features/</code>.</p>
      <button class="btn btn--primary btn--sm" data-toast="Demo: módulo ainda não implementado">
        <span>Em breve</span>
        <span class="btn-orb"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </button>
    </div>`;
}

/* ---------- Init ---------- */
renderNav();
setModule("dashboard");
setOnline(true);
applyDark(store.dark);

/* Botões de acesso (landing) */
$("#open-system").addEventListener("click", () => openSystem());
$("#open-system-hero").addEventListener("click", () => openSystem());
$("#open-system-ovl").addEventListener("click", () => {
  setOverlay(false);
  openSystem();
});
if (new URLSearchParams(location.search).has("system")) {
  openSystem(new URLSearchParams(location.search).get("system") || undefined);
}
$("#sys-close").addEventListener("click", closeSystem);
$("#sys-backdrop").addEventListener("click", closeSide);
$("#sys-burger").addEventListener("click", openSide);
$("#sys-logo-btn").addEventListener("click", () => {
  closeSystem();
  document.getElementById("top").scrollIntoView({ behavior: "smooth" });
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && appShell.classList.contains("is-open")) {
    if (appShell.classList.contains("side-open")) closeSide();
    else closeSystem();
  }
});
