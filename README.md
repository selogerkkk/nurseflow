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
├── index.html   # Estrutura completa (dashboard + telas mobile)
├── styles.css   # Design system, animações e responsividade
├── app.js       # Interações: voz, steppers, abas, menu, toasts
├── DESIGN.md    # Design system completo e reutilizável
└── docs/
    └── features/  # Specs de features investigadas (referência para port)
```

## O que tem na demo

- **Dashboard web**: visão geral de leitos, sinais vitais e tarefas
- **Registro de voz**: gravação com waveform animado e transcrição simulada
- **Gestão de leitos**: status dos leitos, admissão e alta de pacientes
- **Sinais vitais**: steppers para ajustar FC, FR, PA, SpO₂ e temperatura
- **Totalmente responsivo**: versão mobile com navegação própria

## Licença

MIT
