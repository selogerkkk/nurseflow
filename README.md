# NurseFlow — Demo

Uma demo conceitual de um **aplicativo de fluxo de trabalho para enfermeiros**: registro de voz, gestão de leitos e sinais vitais em tempo real.

Feita com **JavaScript puro** — sem frameworks, sem build, sem dependências.

## Como rodar

Basta servir a pasta localmente e abrir no navegador:

```bash
# Opção 1: Python
python3 -m http.server 8000

# Opção 2: Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## Estrutura

```
├── index.html   # Landing + shell do sistema (SPA embutido)
├── styles.css   # Design system da landing, animações e responsividade
├── system.css   # Estilos do sistema (sidebar, header, dark mode, dashboard)
├── app.js       # Interações da landing: voz, steppers, abas, menu, toasts
├── system.js    # Store global, navegação, tema, online/offline, toasts do sistema
├── modules/
│   └── dashboard.js  # Módulo Dashboard & Censo (dados + render)
├── icon.svg     # Ícone PWA (máscara)
├── manifest.webmanifest  # Manifest PWA
├── DESIGN.md    # Design system completo e reutilizável
└── docs/
    └── features/  # Specs de features investigadas (referência para port)
```

## Sistema (SPA)

Clique em **"Acessar o sistema"** no header, no hero ou no menu mobile — ou acesse direto com `?system` na URL (ex.: `?system=prescricao` abre direto o módulo). O sistema abre sobre a landing com:

- Sidebar com grupos de módulos e perfil (Enf. Beatriz Rocha)
- Dashboard & Censo funcional (KPIs, donut, mapa de leitos, setores)
- Dark mode (persiste em localStorage), simulação online/offline, notificações
- Drawer mobile com hamburger + backdrop
- Demais módulos em placeholder (specs em `docs/features/`)

## O que tem na demo

- **Dashboard web**: visão geral de leitos, sinais vitais e tarefas
- **Registro de voz**: gravação com waveform animado e transcrição simulada
- **Gestão de leitos**: status dos leitos, admissão e alta de pacientes
- **Sinais vitais**: steppers para ajustar FC, FR, PA, SpO₂ e temperatura
- **Totalmente responsivo**: versão mobile com navegação própria

## Licença

MIT
