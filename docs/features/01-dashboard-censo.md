# Feature: Dashboard & Censo Digital

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.

## Objetivo
Visão executiva hospitalar: KPIs, mapa de calor dos leitos com filtros, distribuição de leitos (donut) e resumo do censo. CTA para coleta rápida.

---

## 1. Estrutura da tela (cima → baixo)

### 1.1 KPIs (4 cards, grid `2 cols` mobile / `4 cols` desktop)
| Card | Valor | Detalhe |
|---|---|---|
| Taxa de Ocupação | `73.6 %` | `+2.4% vs. ontem` (verde ↑) + barra de progresso |
| Tempo Médio de Checagem | `3.2 min` | `-0.8min vs. meta` (verde ↓) + barra |
| Alertas de Intercorrências | `46` | `Requer atenção` (vermelho) + subtexto "Pacientes com alertas críticos ativos" |
| Economia de Papel (Papel Zero) | `94.2 %` | `+1.1% este mês` (verde ↑) + barra |

- Cada KPI: label uppercase 11px, valor Display grande, trend com seta (verde = bom, vermelho = ruim), mini-barra de progresso no rodapé.
- Ícones: cama (ocupação), relógio (checagem), escudo/alerta (intercorrências), folha (papel zero).

### 1.2 Filtros
- **Título "Filtros"** com ícone de funil.
- **Busca**: input "Buscar leito ou paciente..." — filtra por código do leito OU nome do paciente.
- **Setor**: dropdown "Todos os setores" com os 14 setores.
- **Status (pills)**: `Todos` (azul ativo), `Ocupado`, `Vago`, `Higienização`, `Isolamento`, `Criticidade Alta`. Cada pill com ponto colorido (slate/azul/verde/âmbar/laranja/rosa). Estado ativo = fundo `bg-electric-600 text-white`.

### 1.3 Mapa de Calor dos Leitos
- Cabeçalho: "Mapa de Calor dos Leitos" + subtítulo "110 leitos • Clique para abrir o leito do paciente" + badge "Tempo real" (azul).
- **14 setores**, cada um com label uppercase + contagem `(8)`. Grid de tiles.
- **Tile de leito** (botão):
  - Código em `font-mono` 9px (ex.: `101`), ponto de criticidade, badges `LIMP` (higienização, âmbar) e `ISO` (isolamento, laranja).
  - **Cores por status** (seguir o DESIGN.md, NÃO o clone):
    - `ocupado`: fundo `--emerald-soft`, texto `--emerald-deep`, borda sutil esmeralda
    - `critico`: fundo `#FFE9E9`, texto `--red-deep` + **ponto vermelho pulsante** (`animation: pulse-dot`/`bed-blink`)
    - `vago`: fundo `--gray-100`, texto `--gray-400`
    - `higienizacao`: fundo `#FFF4D6`, texto `--amber-deep`, badge `LIMP`
    - `isolamento`: fundo `#FFF4D6`/âmbar-claro com borda laranja, badge `ISO`
  - Hover: `translateY(-3px) scale(1.05)` com `--ease-bounce` (padrão do DESIGN.md).
  - `title` = "LE102 — Ocupado • Eduardo Ribeiro".
  - Clique → `selectBed(id)` (marca leito selecionado; o drawer/detalhe do paciente é aberto nos módulos Beira de Leito/SAE).

### 1.4 Distribuição de Leitos (donut)
- Donut no padrão do DESIGN.md (segmentos `--emerald` Ocupado, `--petrol` Vago, `--amber` Higienização, `--red` Isolamento/crítico). Números: Ocupado 81, Vago 16, Higienização 13, Isolamento 7.
- Centro: "117 TOTAL" (soma 81+16+13+7).

### 1.5 Resumo do Censo
Lista com valores coloridos (cores do DESIGN.md):
- Total de leitos: 110
- Leitos ocupados: 81 (esmeralda)
- Leitos vagos: 16 (`--gray-400`)
- Em higienização: 13 (âmbar)
- Isolamento: 7 (âmbar/laranja)
- Criticidade alta/crítica: 24 (vermelho)

### 1.6 CTA
Card "Iniciar coleta de sinais vitais — Ir para o módulo de aferição rápida" → `setActiveModule("sinais-vitais")`.

---

## 2. Dados & lógica
- `occRate = ocupados/total*100`; `avgMin = 3.2 + random*0.4` (varia a cada render).
- Alertas = pacientes com alerta severidade `vermelho`.
- Filtros combinam: status (pill) + setor (select) + busca (leito/paciente).
- Agrupamento por setor em mapa (Map key → array de leitos).

## 3. Visual
- Usar o design system do projeto (`DESIGN.md`): tema claro com glows, `--petrol`/`--emerald`, cards do design system. O clone usa fundo escuro navy — **NÃO portar o visual do clone**; portar apenas estrutura, dados e comportamento.
- Badge "Made in Bolt" sobreposto no canto (da plataforma — não portar).

## 4. Checklist de port
- [ ] 4 KPIs com trend + barra
- [ ] Filtros (busca, setor, status pills)
- [ ] Mapa de calor com 14 setores e tiles coloridos
- [ ] Donut de distribuição
- [ ] Resumo do censo
- [ ] CTA para sinais vitais
