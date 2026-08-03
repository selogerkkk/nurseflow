# Feature: Portal Multiprofissional

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.
> **Visual**: seguir o `DESIGN.md` do projeto (cards, `med-tabs`/abas, `.check-list`) — não copiar o visual do clone.

## Objetivo
Registros integrados da equipe: evolução multiprofissional (fisioterapia, nutrição, odontologia, serviço social, psicologia) no prontuário único do paciente.

---

## 1. Estrutura da tela

### 1.1 Abas de especialidades
- **Fisioterapia**
- **Nutrição Hospitalar**
- **Odontologia**
- **Serviço Social**
- **Psicologia**

- Aba ativa destacada (padrão `med-tabs` do DESIGN.md com ink indicator).
- Subtítulo: "Evolução multiprofissional integrada ao prontuário único do paciente".

### 1.2 Lista de registros (por especialidade)
- Para cada especialidade: lista de evoluções registradas.
- Estado vazio: "Nenhum registro de Fisioterapia — Clique em 'Novo Registro' para adicionar a primeira evolução."

### 1.3 Ação "Novo Registro"
- Abre formulário (modal/drawer):
  - **Seletor de paciente**: "Selecione um paciente..." (lista de leitos ocupados)
  - **Textarea**: "Descreva a conduta, avaliação e evolução..."
  - Botões: "Cancelar" e "Salvar Registro" (disabled até preencher).
- Ao salvar → `addMultiProfNote(especialidade, {paciente, texto})` → toast de sucesso "Nota multiprofissional adicionada ao prontuário."

## 2. Dados
- `multiProfNotes` no store: array de notas com especialidade, paciente, autor, texto, timestamp.
- Renderização filtrada por especialidade ativa.

## 3. Checklist de port
- [ ] 5 abas de especialidades com ink indicator
- [ ] Lista de registros por especialidade + estado vazio
- [ ] Formulário Novo Registro (paciente + texto)
- [ ] `addMultiProfNote` no store + toast
