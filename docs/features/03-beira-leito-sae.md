# Feature: Beira de Leito & SAE

> Investigado em `nurseflow-hospital-m-6tv8.bolt.host` (clone React/Vite). Referência para port.
> **Visual**: seguir o `DESIGN.md` do projeto (tela de voz `.voice`, `voice-wave`, `voice-mic`, cards, `status-chip`) — não copiar o visual do clone.

## Objetivo
Cabeceira digital do paciente com alertas clínicos, evolução clínica por voz com IA (simulada), formatação SAE (NANDA/NIC/NOC) e registro no prontuário com suporte offline.

---

## 1. Estrutura da tela

### 1.1 Seletor de leito ocupado
- Select com todos os leitos que têm paciente (`code — Nome`).
- Trocar o leito → recarrega a cabeceira.

### 1.2 Cabeceira do paciente (card)
- **Avatar**: iniciais do nome (ex.: "EA"), gradiente.
- **Nome** (h2), linha "70 anos • PRT-1001 • LE101", **diagnóstico** (ex.: "Pós-cirúrgico apendicectomia").
- **Badge do médico** (ex.: "Dr. Ronaldo Dias").
- **Alertas Clínicos da Cabeceira** (pill com ícone):
  - Severidade `vermelho` → `bg-rose`/`--red` + ring, com `animate-pulse-soft` (pulsar suave).
  - Severidade âmbar → `bg-amber`/`--amber`.
  - Tipos: alergia (ex.: "Látex"), jejum, risco de broncoaspiração, isolamento de contato.
  - Se não há alertas: "Sem alertas ativos" (verde).

### 1.3 Gravador de Voz por IA
- Card com badge "Whisper / GPT-4o" + status "Online" (botão que alterna online/offline).
- **Botão "Iniciar Gravador de Voz"** + hint "Toque para simular o ditado da evolução clínica".
- **Fluxo (simulação)**:
  1. Ao iniciar: digita o ditado **palavra por palavra** (`setInterval` ~280ms), com indicador de gravando.
  2. Transcrição completa → estado "concluído".
  3. Gera a **evolução formatada SAE**:
     - `texto`: "Paciente lúcido e orientado, sem queixas no momento. Refere dor leve na ferida operatória (EVA 2/10). Aceitou dieta prescrita sem náuseas. Diurese espontânea, urina amarelo-clara. Membros inferiores sem edema. Sinais vitais estáveis. Conduta: manter analgesia prescrita, orientar mudança de decúbito a cada 2h, observar sinais flogísticos na ferida."
     - `nanda`: "00132 — Dor aguda"
     - `nic`: "1400 — Manejo da dor; 2300 — Administração de medicação; 7110 — Cuidados com a ferida"
     - `noc`: "1605 — Controle da dor; 1102 — Tolerância à atividade"
  4. **Salvar** → `addEvolucao(patientId, {author, texto, nanda, nic, noc, source:"voz"})`:
     - Online: toast success "Evolução registrada — SAE formatada e adicionada ao prontuário."
     - Offline: toast warning "Salvo offline — Evolução será sincronizada ao reconectar."
- **Frases do ditado** (sequência): "Paciente lúcido," → "orientado em tempo e espaço," → "sem queixas neste momento." → "Refere dor leve na ferida operatória," → "avaliada em 2 na escala numérica." → "Aceitou a dieta prescrita sem náuseas ou vômitos." → "Diurese espontânea" → "com urina amarelo-clara." → "Membros inferiores sem edema." → "Sinais vitais estáveis."

### 1.4 Evoluções do Prontuário
- Lista de evoluções registradas (mais recente primeiro).
- Cada item: avatar do autor (iniciais), "Enf. Beatriz Rocha", origem "Voz IA", tempo relativo ("8h atrás").
- Corpo: texto da evolução + linhas formatadas:
  - `00132 — Dor aguda` (NANDA)
  - `1400 — Manejo da dor` (NIC)
  - `1605 — Controle da dor` (NOC)

## 2. Estados
- **Sem leito selecionado**: card vazio "Selecione um leito ocupado no Dashboard para visualizar a cabeceira digital."
- **Gravando**: texto digitando + botão de cancelar (limpa timer).
- **Offline**: badge do gravador âmbar; salvar mostra warning e enfileira.

## 3. Dados de exemplo
- Paciente padrão: Eduardo Almeida, 70 anos, PRT-1001, LE101, Pós-cirúrgico apendicectomia, alergia Látex, isolamento de contato, Dr. Ronaldo Dias.
- Evolução inicial: "Paciente lúcido, orientado, refere dor leve em ferida operatória. Aceitou dieta sem náuseas. Diurese presente." (8h atrás, Voz IA).

## 4. Checklist de port
- [ ] Seletor de leito ocupado
- [ ] Cabeceira com alertas clínicos (vermelho/âmbar, pulsante)
- [ ] Gravador de voz simulado (digitação palavra a palavra)
- [ ] Formatação SAE (NANDA/NIC/NOC)
- [ ] Salvar com online/offline
- [ ] Lista de evoluções do prontuário
