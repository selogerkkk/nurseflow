# Feature: Aprazamento & Checagem

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.
> **Visual**: seguir o `DESIGN.md` do projeto (cards, `status-chip`, `resumo-item`/contadores) — não copiar o visual do clone.

## Objetivo
Quadro de aprazamento de doses por paciente: total de doses, checadas, pendentes e atrasadas; checagem digital de medicamentos (validação por código de barras à beira do leito).

---

## 1. Estrutura da tela

### 1.1 Contadores gerais (KPIs)
| KPI | Valor exemplo |
|---|---|
| Total de doses | 323 |
| Checadas | 0 |
| Pendentes | 75 |
| Atrasadas | 248 |

- **Badge da sidebar** "248" = número de doses atrasadas (mesmo valor).

### 1.2 Filtros por status
- Pills: `Todas` / `Atrasado` / `Pendente` / `Checado` — filtram a lista de pacientes/doses.

### 1.3 Lista de pacientes (com doses)
- Cada item/card:
  - **Avatar** com iniciais (ex.: "EA")
  - **Nome**: "Eduardo Almeida"
  - **Meta**: "LE101 • 9 doses"
  - **Status**: "7 atrasada(s)" (vermelho se >0)
- Agrupados e ordenados; serve como visão rápida de quem tem doses atrasadas.

## 2. Lógica de geração de doses
- Para cada paciente (até 40), gera 3–6 medicamentos.
- Para cada medicamento + frequência → horários (`Km`):
  - Ex.: 6/6h → 06:00, 12:00, 18:00, 00:00.
- **Status da dose** calculado por horário:
  - `atrasado`: horário passou há >30 min
  - `pendente`: dentro da janela
  - `checado`: marcado manualmente (`checkDose`) com `checkedAt`
- Cada dose: `{id, prescriptionId, patientId, bedCode, medName, dose, via, horario, status, checkedAt}`.

## 3. Checagem (validação por código de barras)
- **Conceito**: "Confirme o kit de medicação antes da aplicação" — checagem à beira do leito.
- Ação `checkDose(id)` marca a dose como `checado` + registra `checkedAt` (ISO).
- Idealmente com **leitor de código de barras** (validação do kit: paciente + medicamento + via + horário) — no clone é simulado; no port usar input de código/digitação.
- Mensagens de sucesso do fluxo: "Dose checada e validada à beira do leito." / "Medicação aplicada e checada à beira do leito."

## 4. Interações
- Clique numa dose pendente → confirma checagem (modal de confirmação "Confirmar Aplicação").
- Após checar, contadores atualizam (checadas +1, pendentes −1).
- Filtro por status atualiza a lista.

## 5. Checklist de port
- [ ] KPIs de doses (total/checadas/pendentes/atrasadas)
- [ ] Geração de doses com horários a partir de prescrições
- [ ] Filtros por status
- [ ] Lista de pacientes com avatares e doses atrasadas
- [ ] Checagem de dose (com confirmação e código de barras)
- [ ] Badge de atrasadas na sidebar
