# Feature: Sistema Global (Shell, Tema, Navegação, PWA)

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para reimplementar o "esqueleto" do NurseFlow no projeto vanilla.

## Objetivo
Infraestrutura compartilhada que sustenta todos os módulos: shell de layout, navegação por módulos, estado global, dark mode, simulação de online/offline, notificações e PWA.

---

## 1. Identidade
- **Nome/logo**: "NurseFlow — Gestão e Cuidado". Sidebar com o nome + subtítulo "GESTÃO E CUIDADO".
- **Página base**: SPA single-page. `#root` → React renderiza shell + módulo ativo.
- **Metadados**: `theme-color #0f172a`, lang pt-BR, PWA manifest.

## 2. Navegação (Sidebar)
- **Grupos de módulos**:
  - **Cuidado & Censo**: Dashboard & Censo, Sinais Vitais & Glicemia, Beira de Leito & SAE
  - **Farmácia & Medicação**: Prescrição & Farmácia, Aprazamento & Checagem
  - **Equipe & Infra**: Portal Multiprofissional, Infraestrutura & Higiene
  - **Gestão**: Marco Legal (LC 182)
- **Item ativo**: destaque azul (`bg-electric-600`) + ícone.
- **Badge vermelha** no item "Aprazamento & Checagem" com número de doses atrasadas (248).
- **Rodapé da sidebar**: seletor de idioma "BR" + perfil "Enf. Beatriz Rocha — COREN-SP 284.591" com avatar "BR".
- **Mobile** (<lg): sidebar vira **drawer** com backdrop `bg-navy-950/50 backdrop-blur-sm`; botão hamburger no header (`lg:hidden`).

## 3. Header
- Título do módulo ativo (h1) + subtítulo.
- **Botão Online/Offline** (com Wi-Fi): alterna simulação de conectividade. Título: "Online — clique para simular offline" / "Offline — clique para reconectar". Quando offline: botão fica âmbar e ações mostram toast warning ("Salvo offline — evolução será sincronizada ao reconectar").
- **Botão de tema** ("Alternar tema"): alterna `document.documentElement.classList.toggle("dark", dark)`.
- **Botão de notificações**: sino com badge vermelha (contador de doses atrasadas/alertas).

## 4. Dark mode
- Classe `dark` no `<html>`. Todas as cores têm variantes `dark:` (ex.: `bg-navy-950`, `dark:bg-navy-700`, texto `dark:text-...`).
- Paleta: fundo escuro `#0f172a`/`navy`, cards escuros `dark:bg-navy-900`, bordas `dark:border-navy-700`.
- Persistência: via estado global (não verificado se localStorage — assumir preferência em memória + `matchMedia`).

## 5. Estado global (Store — "useApp")
Centraliza dados e ações. O equivalente no bundle React é um Context Provider com:
- **Dados**: `beds` (leitos), `patients`, `prescriptions`, `doses`, `orders` (OS), `multiProfNotes`, `toasts`
- **UI**: `selectedBedId`, `online`, `dark`, `activeModule`
- **Ações**: `setDark`, `setOnline`, `setActiveModule`, `selectBed`, `updateBedStatus`, `saveVitals`, `addEvolucao`, `advancePrescriptionStatus`, `checkDose`, `addOrder`, `resolveOrder`, `addMultiProfNote`, `toast`, `dismissToast`

> Para o port vanilla: implementar como um objeto singleton + `pub/sub` ou um store simples com dispatch de eventos.

## 6. Toast system
- `toast({title, message, variant})` — variantes: `success`, `warning`, `info`.
- Renderiza empilhado, auto-dismiss em ~4.5s.
- Ícones por variante: success = check verde, warning = alerta âmbar, error = vermelho.

## 7. PWA
- `manifest.webmanifest`: name "NurseFlow — Gestão e Cuidado", short_name "NurseFlow", display standalone, background/theme `#0f172a`, ícone SVG maskable.
- Meta tags: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style black-translucent`, `theme-color`.
- ícone: `/icon.svg` (favicon + apple-touch-icon).
- **Offline-first**: arquitetura descrita no Marco Legal ("sincronização assíncrona e armazenamento local").
- Nota: o site roda em subdomínio Bolt (demo), sem service worker verificado — o PWA manifest existe e o comportamento offline é simulado por botão.

## 8. Dados globais de exemplo (núcleo compartilhado)
- **Setores (14)**: Posto 1–8 (Clínica Médica, Cirúrgica, Ortopedia, Maternidade, Pediatria, Cardiologia, Neurologia, Oncologia), UTI Adulto, UTI Neonatal, UTI Coronariana, Urologia, Pronto Atendimento.
- **Leitos**: 110 no total; códigos `LE###` (postos), `UTI###`, `URO####`, `PA####`; status: `ocupado`, `vago`, `higienizacao`, `isolamento`; criticidade: `normal`, `alta`, `critica`.
- **Pacientes**: ~80 ocupados; nome composto de listas (20 nomes × 15 sobrenomes), idade 18–89, prontuário `PRT-####`, diagnóstico (ex.: Pneumonia bilateral, Pós-cirúrgico apendicectomia, AVC isquêmico, Sepse de origem urinária), alergias, alertas, médico, `vitalsHistory` (últimos 12 registros), `evolucoes`.
- **Médicos**: Dr. Ronaldo Dias, Dr. Gustavo Lima, Dr. Felipe Andrade, Dra. Marina Reis, Dra. Carla Mendes.

## 9. Convenções de UI
> **IMPORTANTE**: o visual NÃO segue o clone. Usar o design system do projeto (`DESIGN.md`) — cores esmeralda/petróleo, tipografia Bricolage Grotesque + Plus Jakarta Sans, raios/sombras do design system.
- **Tokens**: mapear os estados para o design system:
  - "electric"/azul → `--petrol` / `--emerald` (estados primários)
  - sucesso/ocupado → `--emerald`, `--emerald-soft`
  - vago/livre → `--gray-100`/`--gray-200`
  - higienização/atenção → `--amber`, `--amber-deep`
  - isolamento → laranja de atenção (usar âmbar ou criar tom no padrão do design)
  - crítico/erro → `--red`, `--red-deep`
- **Cards**: `.card` do DESIGN.md (raio 22px, fundo branco, borda `rgba(13,43,78,.07)`, sombra de card, hover lift).
- **Badges/status**: `status-chip` do DESIGN.md (4 variantes `--ok/--warn/--alert/--idle`).
- **Tipografia**: `--font-display` (títulos), `--font-body` (texto), `font-variant-numeric: tabular-nums` para valores.
- **Acessibilidade**: `title` nos botões de ícone, aria-labels, foco visível.

## 10. Checklist de port
- [ ] Shell fixo com sidebar + header + conteúdo por módulo
- [ ] Store global com dados + ações
- [ ] Dark mode por classe `dark`
- [ ] Drawer mobile com backdrop
- [ ] Toast system
- [ ] Botão online/offline simulado
- [ ] PWA manifest + ícone
