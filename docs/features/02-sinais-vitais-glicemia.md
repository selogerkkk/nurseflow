# Feature: Sinais Vitais & Glicemia

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.
> **Visual**: seguir o `DESIGN.md` do projeto (steppers `.stepper`, status chips, cores esmeralda/petróleo) — não copiar o visual do clone.

## Objetivo
Coleta rápida à beira do leito de 6 parâmetros vitais, com steppers, validação clínica em tempo real, sparklines de tendência e sincronização (online/offline).

---

## 1. Estrutura da tela

### 1.1 Seleção de paciente
- Label "LEITO / PACIENTE" + dropdown/select com todos os leitos ocupados:
  `LE101 — Eduardo Almeida • Posto 1 — Clínica Médica`
- Ao lado: avatar do paciente (iniciais) + nome + idade + prontuário.

### 1.2 Barra de status clínico
- Resumo calculado dos parâmetros:
  - `N` alerta(s) crítico(s) detectado(s) → vermelho (`--red`)
  - `N` parâmetro(s) em atenção → âmbar (`--amber-deep`)
  - "Todos os parâmetros dentro da normalidade" → verde (`--emerald-deep`)
- Card colorido conforme o pior estado (borda + fundo suave do status).

### 1.3 Grid de parâmetros (6 cards)
Cada card: label, unidade, valor grande central, botões − / + (steppers), badge de status quando alterado, sparkline de tendência (histórico).

| Parâmetro | Chave | Unidade | Passo | Min | Max | Decimais | Validação |
|---|---|---|---|---|---|---|---|
| Temperatura | `temp` | °C | 0.1 | 30 | 42 | 1 | >37.8 → "Febre" (crítico); <35 → "Hipotermia" (crítico) |
| Freq. Cardíaca | `fc` | bpm | 1 | 20 | 220 | 0 | >100 → "Taquicardia"; <50 → "Bradicardia" |
| Freq. Respiratória | `fr` | ipm | 1 | 6 | 50 | 0 | >24 → "Taquipneia"; <12 → "Bradipneia" |
| Saturação O₂ | `spo2` | % | 1 | 50 | 100 | 0 | <92 → "Hipoxemia" (crítico); <95 → "Atenção" |
| Glicemia Capilar | `hgt` | mg/dL | 5 | 20 | 500 | 0 | <70 → "Hipoglicemia"; >180 → "Hiperglicemia" |
| Pressão Arterial | `pas`/`pad` | mmHg | 1 | — | — | 0 | PA alterada quando fora da faixa |

- **Badges por card** quando fora do normal: "Atenção" (âmbar), "Febre"/"Taquicardia"/etc. (vermelho), "PA alterada" (âmbar).
- **Cores dos sparklines** (no padrão DESIGN.md): temperatura âmbar, FC vermelho, FR teal/petróleo, SpO₂ azul-petróleo, glicemia roxo-âmbar (usar tons do design; ex.: `--amber`, `--red`, `--petrol`, `--emerald`).

### 1.4 Ações
- "Última aferição: {data/hora}" (do histórico mais recente).
- Botão "Salvar e Sincronizar Sinais Vitais" — disabled se offline; ao salvar: adiciona registro ao `vitalsHistory` do paciente (mantém últimos 12), toast de sucesso.

## 2. Interações
- **Steppers**: botões − / + ajustam valor (clamp min/max, passo, decimais). Reutilizar `.stepper`/`.step-btn`/`.step-val` do DESIGN.md com `val-bump`.
- **Input direto**: também permite digitar o valor no campo.
- **Validação em tempo real**: cada mudança recalcula status do card e da barra geral.
- **Histórico**: `vitalsHistory` com até 12 registros por paciente; sparkline usa os valores por chave.
- **Offline**: salvar sem conexão acumula e sincroniza depois (ver sistema global).

## 3. Dados de exemplo
- Valores iniciais exibidos: Temp 37,2 · FC 66 · FR 21 · SpO₂ 93 (atenção) · Glicemia 167 · PA 142×82 (PA alterada).
- O paciente padrão é LE101 — Eduardo Almeida, 70 anos, PRT-1001.

## 4. Checklist de port
- [ ] Select de leitos ocupados com avatar do paciente
- [ ] 6 cards de parâmetros com steppers + input direto
- [ ] Validação clínica (tabela acima) com badges por card
- [ ] Barra de status geral (crítico/atenção/normal)
- [ ] Sparklines com histórico (12 pontos)
- [ ] Salvar + sync online/offline
