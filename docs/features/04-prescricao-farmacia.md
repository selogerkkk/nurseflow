# Feature: Prescrição & Farmácia (Circuito Fechado)

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.
> **Visual**: seguir o `DESIGN.md` do projeto (cards, `status-chip`, abas `med-tabs`, `.link-btn`) — não copiar o visual do clone.

## Objetivo
Circuito fechado da medicação: prescrição eletrônica gerada pelo médico, dispensação pela farmácia e aplicação à beira do leito, com status avançando por etapas.

---

## 1. Pipeline de status (4 etapas)
| Etapa | Chave | Contagem exemplo | Descrição |
|---|---|---|---|
| Emitida / Aguardando | `emitida` | 6 | Prescrição médica gerada e enviada à farmácia |
| Em Separação | `separacao` | 13 | Farmácia central iniciou a separação dos medicamentos |
| Pronta para Coleta | `pronta` | 12 | Kit separado — notificação enviada ao posto |
| Checada & Aplicada | `aplicada` | 9 | Medicação aplicada e checada à beira do leito |

- **Head da tela**: 4 KPIs/pills mostrando contagem por etapa (como colunas de kanban).
- Filtros por status (Todos / por etapa).

## 2. Lista de prescrições (cards)
Cada card:
- **Código** `RX-0001` + **status** (pill colorido).
- Paciente: "Eduardo Almeida • 70 anos".
- Meta: "Leito LE101 • Dr. Ronaldo Dias • 01/08, 20:55".
- Badge extra quando há **interação medicamentosa**: "Interação" (âmbar/vermelho).
- Ações:
  - **"Detalhes"** → abre modal da prescrição.
  - **"Avançar"** (se não aplicada) → `advancePrescriptionStatus(id)` avança para a próxima etapa (array `["emitida","separacao","pronta","aplicada"]`, mantém na última).
  - **"Concluído"** (se aplicada) → botão desabilitado/label.

## 3. Modal de prescrição (`RX-####`)
- **Header**: "Prescrição RX-0001" + "Eduardo Almeida • Leito LE101".
- **MEDICAMENTOS PRESCRITOS** — lista de medicamentos, cada um com:
  - Nome + dosagem (ex.: "Dipirona 500mg")
  - **Via**: SC / VO / IM / IV (pill)
  - **Frequência**: 6/6h, 8/8h, 12/12h, 1x/dia, 24/24h, SN
  - **Dose**: "2 ml" + "Horários: 06:00, 12:00, 18:00, 00:00"
- **Rodapé**: "Emitida em 01/08, 20:55 por Dr. Ronaldo Dias".
- Botão fechar (X).

### Tabela de frequências → horários
| Frequência | Horários |
|---|---|
| 6/6h | 06:00, 12:00, 18:00, 00:00 |
| 8/8h | 08:00, 16:00, 00:00 |
| 12/12h | 08:00, 20:00 |
| 1x/dia | 08:00 |
| 24/24h | 09:00 |
| SN | 12:00 |

## 4. Geração de dados (exemplo)
- Medicamentos (lista): Dipirona 500mg, Paracetamol 750mg, Omeprazol 40mg, Enoxaparina 40mg, Metformina 850mg, Amlodipino 5mg, Ceftriaxona 1g, Soro Fisiológico 500ml, Varfarina 5mg, Furosemida 40mg, Clonazepam 2mg, Amoxicilina 500mg.
- Vias: VO, IV, IM, SC. Dose: "1-2 {comprimido/ampola/frasco/ml}".
- Interação: ~78% das prescrições têm interação na 1ª medicação → "Risco de sangramento com uso concomitante de AAS".
- Status inicial aleatório entre as 4 etapas; data criada 1–48h atrás.

## 5. Checklist de port
- [ ] 4 KPIs do pipeline com contagens
- [ ] Cards de prescrição com status + ação Avançar/Concluído
- [ ] Badge de interação medicamentosa
- [ ] Modal de detalhes com medicamentos (via/frequência/horários)
- [ ] `advancePrescriptionStatus` no store
