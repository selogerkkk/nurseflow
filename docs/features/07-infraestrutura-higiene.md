# Feature: Infraestrutura & Higiene (Ordens de Serviço)

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.
> **Visual**: seguir o `DESIGN.md` do projeto (cards, `status-chip`, `.btn`/`.pbtn`) — não copiar o visual do clone.

## Objetivo
Gestão de ordens de serviço (OS): limpeza terminal e manutenção de leitos/equipamentos, com ciclo aberta → em andamento → concluída.

---

## 1. Estrutura da tela

### 1.1 KPIs de OS
| Estado | Valor exemplo |
|---|---|
| Abertas | 1 |
| Em andamento | 1 |
| Concluídas | 1 |

### 1.2 Ações de criação
- **"Solicitar Limpeza Terminal"** — "Após alta ou intercorrência — leito vai para higienização".
- **"Solicitar Manutenção"** — "Equipamento com defeito ou infrastructure do leito".
- Ambas abrem modal de criação:
  - **Select "Selecione o leito..."** (lista de todos os leitos)
  - **Textarea** "Ex: Limpeza terminal após alta do paciente" / "Ex: Bomba de infusão sem energia"
  - Botões "Cancelar" / "Criar Chamado" (disabled até preencher).
- Ao criar → `addOrder(type, bedId, description)` → OS nova com status `aberta`, código sequencial (`OS-0014`...), toast.

### 1.3 Filtros
- Pills: `Todas` / `Aberta` / `Em andamento` / `Concluída`.

### 1.4 Lista de OS (cards)
Cada card:
- **Código** `OS-0012` + **tipo** (Limpeza Terminal / Manutenção) + **status** (pill).
- Descrição: "Limpeza terminal após alta".
- Meta: "Leito LE0103" + tempo relativo ("1h atrás").
- Ação contextual:
  - `aberta` → botão **"Iniciar"** (→ em andamento)
  - `em_andamento` → botão **"Concluir"** (→ concluída, registra `resolvedAt`)

## 2. Dados
- `orders` no store: `{id, code, type (limpeza|manutencao), bedId, bedCode, description, status (aberta|em_andamento|concluida), createdAt, resolvedAt}`.
- Código: `OS-` + sequência de 4 dígitos.
- Ao concluir: toast "OS concluída".

## 3. Checklist de port
- [ ] KPIs de OS
- [ ] Modais de solicitação (limpeza/manutenção) com select de leito + descrição
- [ ] Filtros por status
- [ ] Cards de OS com ações Iniciar/Concluir
- [ ] `addOrder`/`resolveOrder` no store
