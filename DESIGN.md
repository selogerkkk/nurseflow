# NurseFlow — Design System & Spec

> Documento de referência completo para replicar ou estender o design da demo NurseFlow.
> Qualquer modelo de IA deve ser capaz de reconstruir um site visualmente igual (ou muito próximo) seguindo apenas este documento.

---

## 1. Conceito da marca

- **Nome**: NurseFlow
- **Slogan/tagline**: "Gestão e Cuidado em Fluidez"
- **Proposta**: app de fluxo de trabalho hospitalar — censo de leitos, medicações, registro por voz e sinais vitais.
- **Personalidade**: limpo, moderno, confiável, tecnológico, acolhedor (nunca frio/clínico demais).
- **Metáfora visual**: a "gota de soro" (cuidado) atravessada por uma linha de batimento cardíaco (dados/vida). Aparece no logo e em ECG lines decorativas no hero e footer.

### Logo (SVG inline, viewBox `0 0 48 48`)
```svg
<svg viewBox="0 0 48 48" fill="none">
  <path d="M24 5C24 5 11 20 11 29.5a13 13 0 0 0 26 0C37 20 24 5 24 5Z" stroke="currentColor" stroke-width="3.2"/>
  <path class="logo-pulse" d="M15 30h5l2.5-7 4 13 3-6h4" stroke="#16B370" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```
- O caminho da gota usa `currentColor` (muda com o contexto — petróleo no claro, branco no escuro).
- A linha do ECG é SEMPRE `#16B370`.
- Variantes de tamanho: `--xs` 26px, `--sm` 30px, `--xl` 76px.
- A linha do ECG no logo grande tem animação de "batimento": `logo-beat 3.2s` (stroke-dasharray 46 percorrendo, com fade).

---

## 2. Paleta de cores

### Cores primárias (CSS vars em `:root`)
| Token | Hex | Uso |
|---|---|---|
| `--emerald` | `#16B370` | Cor primária, ações, destaque, sucesso |
| `--emerald-deep` | `#0E8A56` | Hover/gradiente do primário, textos de destaque |
| `--emerald-soft` | `#E4F6EE` | Fundo de chips/icons de sucesso |
| `--petrol` | `#0D2B4E` | Azul-petróleo: títulos, nav, dark section |
| `--petrol-deep` | `#081E38` | Dark section / footer / sidebar |
| `--petrol-ink` | `#0B2237` | Texto do corpo |
| `--gray-50` | `#F7F9F8` | Fundo da página e painéis |
| `--gray-100` | `#F2F4F7` | Superfícies secundárias, tracks |
| `--gray-200` | `#E0E4E9` | Bordas, ECG base, tiles livres |
| `--gray-400` | `#98A2B3` | Texto fraco, placeholders |
| `--gray-500` | `#667085` | Texto secundário |
| `--amber` | `#FFD97A` | Aviso |
| `--amber-deep` | `#B8820A` | Texto de aviso |
| `--red` | `#FF4D4F` | Alerta |
| `--red-deep` | `#D93638` | Texto de alerta |

### Gradientes
- **Primário (botões/mic/FAB)**: `linear-gradient(135deg, #16B370, #0E8A56)`
- **Texto em gradiente (hero)**: `linear-gradient(100deg, #16B370 10%, #3ED598 45%, #0E8A56 90%)` com `background-clip: text`
- **Dark section**: `linear-gradient(180deg, #081E38 0%, #0D2B4E 55%, #081E38 100%)`
- **Sidebar do dashboard**: `linear-gradient(180deg, #0D2B4E, #081E38)`

### Cores em fundo escuro
| Token de uso | Hex |
|---|---|
| Texto principal escuro | `#E7F0E9` |
| Sub-texto escuro | `#9FB4C9` |
| Muted escuro (sidebar/nav) | `#8FA6BC`, `#B9CBDD` |
| Muted mais fraco | `#7289A1` |
| Verde-claro para destaque em escuro | `#5BDDA4` |
| Texto de hint-chip escuro | `#BFE8D4` |
| Texto de botão ghost escuro | `#DCE9F2` |
| Fundo de telas de celular | `#0A1626` |
| Gradiente da mini-câmera | `linear-gradient(135deg, #132F47, #0B2237)` |

### Fundos de status (chips/ícones)
| Estado | Fundo | Texto |
|---|---|---|
| OK / Em dia | `#E4F6EE` | `#0E8A56` |
| Atenção | `#FFF4D6` | `#B8820A` |
| Alerta | `#FFE9E9` | `#D93638` |
| Inativo/Livre | `#F2F4F7` | `#667085` |
| Card de alerta | `#FFFBFB` + borda `rgba(255,77,79,.3–.45)` | — |

### Regras de contraste
- Nunca colocar `--amber` ou `--red` com texto escuro direto por cima; sempre usar os `-deep` para texto.
- Texto em swatch claro usa `--ink` (petróleo); swatch escuro usa branco.

---

## 3. Tipografia

### Fontes (Google Fonts)
- **Display**: `Bricolage Grotesque` — pesos 400–800. Títulos, números grandes, logo.
- **Body**: `Plus Jakarta Sans` — pesos 400–800. Todo o resto.

### Escala
| Elemento | Fonte | Peso | Tamanho | Letter-spacing |
|---|---|---|---|---|
| Título do hero | Display | 800 | `clamp(46px, 8.4vw, 102px)` | `-.045em`, line-height `.98` |
| Título de seção | Display | 700 | `clamp(34px, 5vw, 54px)` | `-.035em`, line-height `1.05` |
| Título de card | Display | 700 | 16–23px | `-.02em` a `-.025em` |
| Números grandes (stats/donut) | Display | 700–800 | 24–37px | `-.03em` a `-.04em` |
| Texto do corpo | Body | 400–600 | 14–18px | normal, line-height `1.6–1.7` |
| Texto fraco/secundário | Body | 500–600 | 10.5–13px | normal |
| Rótulo (eyebrow/label) | Body | 700–800 | 10–12px | `UPPERCASE` + `+.12em` a `+.2em` |
| Texto de botão | Body | 700 | 13.5–15.5px | `-.01em` |

### Regras
- `body` usa `font-variant-numeric: tabular-nums` (números com largura fixa — crítico para dashboards/contadores).
- `-webkit-font-smoothing: antialiased` no body.
- Nunca usar itálico real; `<em>` em nomes de marca (`Nurse<em>Flow</em>`) é `font-style: normal` + cor `--emerald`.
- Texto sempre em pt-BR na UI (a demo usa pt-BR).

---

## 4. Espaçamento, raios e sombras

### Ritmo de seção
- Seção: `max-width: 1280px`, `padding: 110px 24px`, centralizada. Reduz para `80px 18px` em <768px.
- Cabeçalho de seção: `max-width: 720px`, centralizado, margem inferior 56px.
- Grids usam gap de 16–18px; listas internas gap 9–14px.

### Raios de borda (linguagem de cantos)
| Elemento | Raio |
|---|---|
| Botões, chips, pills, nav-pill | `999px` |
| Cards de dashboard | `22px` |
| Cards bento / brand | `26px` |
| Shell do browser | `32px` (core `23px`) |
| Shell do celular | `56px` (phone `47px`, screen `37px`) |
| Rows/itens (med-item, pleito, vital-row, tl-card) | `14–18px` |
| Stepper | `12px` (botões internos `9.5px`) |
| Ícones container | `11–15px` |

### Sombras (todas em `rgba(13,43,78,…)`)
- **Card normal**: `0 1px 2px rgba(13,43,78,.03), 0 16px 36px -24px rgba(13,43,78,.14)`
- **Card hover**: `0 2px 4px rgba(13,43,78,.04), 0 24px 48px -24px rgba(13,43,78,.2)`
- **Botão primário**: `0 1px 2px rgba(14,138,86,.35), 0 14px 30px -10px rgba(22,179,112,.55)` (hover amplia para 20px/44px)
- **Nav pill**: `0 1px 2px rgba(13,43,78,.05), 0 16px 40px -16px rgba(13,43,78,.18)`
- **Browser/med shell**: `0 1px 2px rgba(13,43,78,.04), 0 40px 80px -40px rgba(13,43,78,.26–.28)`
- **Celular**: `0 50px 100px -40px rgba(0,0,0,.6)`
- **Toast**: `0 20px 44px -14px rgba(8,30,56,.5)`
- **FAB mobile**: `0 10px 24px -6px rgba(22,179,112,.6)` + anel `0 0 0 5px var(--gray-50)`

### Bordas
- Claro: `rgba(13,43,78,.06)` a `.09` (elemento) e `.12` (hover).
- Escuro: `rgba(255,255,255,.1)` a `.14`.
- Tiles/rows de status: usam fundos de status (não bordas coloridas), exceto itens de alerta (`rgba(255,77,79,.3–.45)`).

---

## 5. Motion & animação

### Curvas de easing (as mais importantes do sistema)
```css
--ease: cubic-bezier(.32,.72,0,1);        /* padrão: entradas/saídas suaves */
--ease-bounce: cubic-bezier(.34,1.4,.44,1); /* micro-interações: botões, tiles, bumps */
```

### Durações típicas
- Reveal de seção: 1s
- Transições de hover (shadow/lift): .4–.6s
- Micro-interações (scale, bump): .25–.5s
- Toasts: fade in/out .5s, visíveis 2.6s

### Padrões de motion (reusar em features novas)
1. **Reveal on scroll**: `[data-reveal]` inicia `opacity:0; translateY(34px); blur(8px)` → anima para estado natural em 1s `--ease`, com `transition-delay: var(--d, 0ms)` por elemento (80–400ms em cascata). IntersectionObserver com `threshold: .12` e `rootMargin: 0 0 -6% 0`.
2. **Hover lift**: cards sobem `translateY(-6px)` + sombra aprofundada. Tiles de leito: `translateY(-3px) scale(1.05)` com `--ease-bounce`.
3. **Botões**: `:active { transform: scale(.97) }`; hover do botão primário move o "orb" `translate(2px,-2px) scale(1.06)`.
4. **Magnetic buttons** (só em `pointer:fine`): transladam até `6px/5px` em direção ao cursor no `pointermove`, resetam no `pointerleave`.
5. **Bump de número**: ao mudar valor de stepper/counter, animação `val-bump .3s`: `40% { scale(1.18) }`.
6. **Contadores animados**: 1400ms com easing `1-(1-p)^4` (easeOutQuart), disparados por IntersectionObserver `threshold: .5`. Suporta `data-suffix` ("%") e `data-pad` (zerofill).
7. **Nav hide on scroll**: esconde ao rolar para baixo após 480px, mostra ao rolar para cima. `.6s --ease`.

### Keyframes definidos
| Nome | Uso | Spec |
|---|---|---|
| `pulse-dot` | dots "ao vivo" | `box-shadow` 0→6px ring, 2–2.4s infinite |
| `bed-blink` | leito em alerta | ring `rgba(255,77,79,.35)` 0→5px, 2.2s |
| `ecg-travel` | linha ECG animada | `stroke-dasharray: 210 2500`, percorre `-2710` em 5.5s linear |
| `logo-beat` | ECG do logo | dashoffset 46→0→-46 com fade, 3.2s |
| `wave-dance` | waveform de voz | `height` entre `calc(var(--h)*.22)` e `var(--h)`, .8s alternate, delay `var(--i) * -.075s` |
| `ring-out` | anéis do microfone | `scale(1)→scale(2)` + fade, 1.8s, segundo anel com delay .9s |
| `caret-blink` | cursor de digitação | opacity 50%, `.8s steps(1)` |
| `blink-text` | "Ouvindo…" | opacity 50%, 1.2s |
| `mini-dance` | waveform do bento | `scaleY(.35)→1`, 1.15s, delay `var(--i) * -.09s` |
| `cam-scan` | linha de scan da câmera | `top: 14%→82%`, 2.6s `--ease` |
| `panel-in` | troca de aba | `opacity 0→1; translateY(10px)→0`, .5s |
| `spin` | botão refresh | `rotate(360deg)`, .8s |
| `val-bump` | valor de stepper | `40% { scale(1.18) }`, .3s `--ease-bounce` |
| `caret` typing | (ver seção 8, JS) | — |

### Acessibilidade de motion
```css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  html { scroll-behavior: auto; }
  [data-reveal] { opacity: 1; transform: none; filter: none; }
}
```

---

## 6. Fundos

### Página (clara)
- Base `#F7F9F8` + 3 glows radiais fixos (z-index 0, pointer-events none):
  - `radial-gradient(720px 480px at 12% -4%, rgba(22,179,112,.07), transparent 65%)`
  - `radial-gradient(900px 600px at 95% 30%, rgba(13,43,78,.05), transparent 60%)`
  - `radial-gradient(700px 500px at 30% 100%, rgba(22,179,112,.045), transparent 60%)`
- Overlay de ruído (body::after, fixed, z-index 200, opacity `.028`): SVG `feTurbulence fractalNoise .9 / 2 octaves`, 160px, repetido.

### Seção escura
- Gradiente vertical `petrol-deep → petrol → petrol-deep` + glow radial emerald nos cantos (`blur(110px)`).
- Padrão de pontos: `radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)`, `background-size: 26px`, com `mask-image` vertical para esmaecer topo/base.

### Footer
- `--petrol-deep` com linha ECG decorativa no topo (`rgba(22,179,112,.35)`, mask horizontal).

---

## 7. Componentes (biblioteca)

### 7.1 Nav
- Pill flutuante fixa no topo (`top: 18px`, z-index 100), centralizada, `backdrop-filter: blur(20px)`, fundo `rgba(255,255,255,.75)`, raio 999px, sombra de pill.
- Conteúdo: logo (marca + "Nurse**Flow**"), links (13.5px, peso 600, cinza → petróleo no hover com pill `rgba(13,43,78,.05)`), botão primário "sm" e hambúrguer (escondido >900px).
- **Menu mobile (overlay)**: tela cheia `rgba(247,249,248,.85)` + `blur(32px)`, links gigantes Display `clamp(34px,8vw,54px)` com índice numérico esmeralda (`01`, `02`…), entrada escalonada `translateY(40px)` com `delay: calc(var(--i) * 70ms)`. Hambúrguer vira X (2 barras, rotate ±45°).

### 7.2 Botões
- **`btn--primary`**: gradiente esmeralda, texto branco, raio 999px, `padding: 6px 6px 6px 22px`, com **orb** circular à direita (`36px`, `rgba(255,255,255,.18)`) contendo seta. Hover move o orb.
- **`btn--ghost`**: `padding: 14px 24px`, texto petróleo, fundo `rgba(13,43,78,.05)`, borda `rgba(13,43,78,.08)`.
- **`btn--ghost-light`**: variante para fundo escuro (`rgba(255,255,255,.07)` + borda `rgba(255,255,255,.12)`, texto `#DCE9F2`), também com orb.
- **`link-btn`**: texto em `--emerald-deep` com seta que desliza (`gap: 8px→12px` no hover).
- **`icon-btn`**: 42px, raio 14px, fundo branco, borda sutil; hover `gray-100` + sombra; `:active` scale .94; variante `--sm` 34px.
- **`chip-select`**: chip com ícone + chevron (simula dropdown), hover `gray-100`.
- **`pbtn`** (mobile): largura total, raio 16px, peso 700; `--primary` gradiente; `--ghost` transparente; `:disabled` opacity .45; estado `is-done` escurece o gradiente.

### 7.3 Eyebrow (rótulo de seção)
- Pill uppercase 11px, peso 700, `letter-spacing: .18em`, texto `--emerald-deep`, fundo `rgba(22,179,112,.08)`, borda `rgba(22,179,112,.16)`, com **dot pulsante** esmeralda (6px) à esquerda.
- Variante `--dark` para seções escuras: texto `#5BDDA4`, fundo `rgba(22,179,112,.12)`, borda `rgba(22,179,112,.25)`.

### 7.4 Cards (dashboard)
- Fundo branco, raio 22px, `padding: 22px`, borda `rgba(13,43,78,.07)`, sombra de card. Hover: lift suave de sombra.
- **Card head**: título Display 16px + subtítulo 12px cinza-400 à esquerda; à direita `live-chip` ("hoje", com dot pulsante) ou `chip-select`.
- **Donut (censo)**: SVG 180x180, `r=70`, `stroke-width: 15`, `stroke-linecap: round`, rotacionado `-90deg`. Segments coloridos (`#16B370`, `#0D2B4E`, `#FFD97A`, `#FF4D4F`) calculados com `stroke-dasharray/dashoffset` por JS (82/14/3/1%), animados 1.3s. Centro: número Display 37px + legenda. Legendas com bolinha 9px `--c` e valores.
- **Mapa de leitos**: tiles por ala (label uppercase 10.5px), `grid-template-columns: repeat(8,1fr)`, gap 7px, `aspect-ratio: 1.15`, raio 11px, peso 800. Tons: `ok` esmeralda-soft, `warn` âmbar claro, `alert` vermelho + blink, `free` gray-100. Hover bounce-up; selecionado: anel petróleo `0 0 0 2.5px` + sombra. Legenda + painel de detalhe do leito (row cinza com ícone, nome, status chip).
- **Timeline**: linha vertical gradiente (esquerda `33px`), item = hora (44px, peso 800, cinza) + dot circular com ícone colorido por tom (ok/warn/alert/idle) + card com título/subtitulo/status chip. Hover: card desliza `translateX(3px)` e fica branco.
- **Resumo do dia**: grid 2 colunas; item = ícone 34px (fundo `--cb`, cor `--c`) + número Display 24px (animado) + rótulo uppercase 11px.

### 7.5 Status chips
- Pill 10px peso 800, padding `5px 9px`. 4 variantes: `--ok`, `--warn`, `--alert`, `--idle` (cores na seção 2, "Fundos de status").
- Em listas mobile: chip pode exibir 2 linhas (título + subtítulo 8.5px).

### 7.6 Mockups de celular (seção escura)
- **Shell**: `background: rgba(255,255,255,.06)`, borda `rgba(255,255,255,.1)`, raio 56px, `padding: 9px`, sombra pesada. Hover na coluna: shell sobe `translateY(-8px)`.
- **Phone**: 292px largura, fundo `#0A1626`, raio 47px, `padding: 11px`, borda interna `inset 0 0 0 1.5px rgba(255,255,255,.14)`. **Dynamic island** (88x25px, raio 99px, `#0A1626`) centralizada no topo.
- **Screen**: fundo `--gray-50`, raio 37px, `height: 600px`, `overflow: hidden`, flex column.
- **Status bar**: "9:41" + ícones de sinal/bateria (SVG, `currentColor`).
- **Header**: "Olá, Juliana" + seletor de enfermaria (com chevron) + sino com badge vermelha.
- **Rótulo uppercase** ("Leitos") seguido de lista.
- **Tab bar**: fundo branco, 5 itens — 4 abas (ícone 20px + label 9.5px) + **FAB central** (54px, gradiente esmeralda, sobressai `margin-top: -30px`, anel `0 0 0 5px` na cor do fundo). Aba ativa fica `--emerald-deep`.
- Cada coluna tem **legenda** abaixo: título Display 15.5px branco + descrição 12.5px `#8FA6BC`. Colunas em cascata (2ª sobe `-24px`).
- **Mobile real (<768px)**: carrossel com `overflow-x: auto` + `scroll-snap-type: x mandatory`, colunas com `min-width: calc(100vw - 90px)` e `scroll-snap-align: center`.

### 7.7 Tela de voz
- Waveform: 42 barras de 3.5px, gradiente `#3ED598→#16B370`, altura base `calc(var(--h) * .28)` (JS define `--h` por barra). Em gravação: animação `wave-dance` com delay por `--i`.
- Mic 64px circular, gradiente esmeralda; em gravação vira **vermelho** + 2 anéis `ring-out`. Estados: "Toque para gravar" → "**Ouvindo…** fale agora" → "Transcrição concluída".
- Card de transcrição: fundo branco, texto 13px; placeholder cinza; **caret** esmeralda piscando durante a digitação; status "Transcrevendo em tempo real…" com dot pulsante.
- Ações: "Finalizar e Salvar" (disabled até transcrição completa; ao salvar vira "✓ Registro salvo") + "Cancelar".

### 7.8 Steppers de sinais vitais
- Row: ícone 36px (fundo `--emerald-soft`, cor `--emerald-deep`) + label (título + unidade `em`) + stepper.
- Stepper: pill `gray-100` (raio 12px, padding 3px); botões 30px brancos com sombra (hover esmeralda, `:active` scale .88); valor central Display 16px `min-width: 44px` com `val-bump`.
- Dados via atributos: `data-min`, `data-max`, `data-step`, `data-comma` (decimais com vírgula). JS clampa e arredonda.
- Variante `--sm` (26px) usada no par de pressão arterial (sistólica/diastólica com "/" entre).
- `:focus-within` na row: borda esmeralda + ring `rgba(22,179,112,.1)`.

### 7.9 Bento (3 formas de registro)
- Grid `1.35fr 1fr 1fr`, gap 18px. Card: raio 26px, padding 30px, hover `translateY(-6px)`.
- Topo: ícone 46px (`--cb`/`--c`) + tag uppercase (`--emerald-soft`, variantes `--alt` cinza `#E8EEF5`/petróleo e `--amber`).
- Card 1 (Voz): **mini-wave** — 34 barras, gradiente esmeralda, `height: calc(var(--h) * 1%)`, animação `mini-dance` com delay `--i`.
- Card 2 (Toque): **mini-stepper** — pill gray-100 com 2 botões + valor Display 21px, `min-width: 56px` (temperatura, mesmo bump).
- Card 3 (Câmera): **mini-cam** — retângulo 120px com gradiente escuro, cantoneiras brancas (raios 6px, estilo "finder"), linha de scan esmeralda com glow (`cam-scan`), chip "IA processando…" (`#5BDDA4` em `rgba(8,30,56,.8)`).

### 7.10 Seção dividida + medicações
- Grid `1fr 1.1fr`, gap 64px; coluna de texto com check-list (26px bolinhas esmeralda com check branco, itens 14.5px peso 600).
- **Med card**: shell como o browser, core branco com `padding: 24px`. Header: back button + paciente (nome 15px + meta 11.5px) + `icon-btn--sm`.
- **Tabs**: barra com border-bottom `gray-100`; 3 abas iguais (13px, peso 700, cinza; ativa `--emerald-deep`); **ink indicator** (2.5px esmeralda, largura/posição via JS `offsetWidth/offsetLeft`, transição `transform .5s`).
- **Panels**: troca com fade/slide (`panel-in`). Items: row cinza raio 17px, ícone 38px com cor por tom, título + meta, status chip à direita. Hover: `translateX(4px)` + fundo branco.
- **Anexos**: grid 3 colunas; thumb 100% largura `aspect-ratio: 1.55` raio 12px (foto = gradiente escuro + ícone; documento = branco), nome 12px + meta 10px.

### 7.11 Seção de marca
- **Card logo**: gradiente petróleo, logo 76px + wordmark Display 38px + tagline `#9FB4C9` + chips de valores (pill `rgba(255,255,255,.07)`, ícones `#5BDDA4`). Glow radial esmeralda no canto.
- **Paleta**: grid 2 colunas; swatch com `background: var(--c)`, texto `var(--ink, #fff)`, `min-height: 96px`, alinhado embaixo (nome 12.5px peso 800 + hex 10.5px). Botão de copiar no canto (aparece no hover). Hover: sobe + scale 1.02.
- **Tipografia**: 2 stages (Display e Body) com "Aa" gigante (54px) + nome + descrição, em pill `gray-50`. Chips de personalidade com hover esmeralda.

### 7.12 Footer
- `petrol-deep`, padding `120px 24px 46px`, linha ECG decorativa no topo.
- Flex entre: marca (logo + nome + tagline) · nota ("Demo conceitual · HTML, CSS e JavaScript puros · 2026") · botão "Voltar ao topo" (`btn--ghost-light`).
- <768px: coluna centralizada.

### 7.13 Toast
- Container fixo bottom-center (z-index 150, `pointer-events: none`, pilha vertical, máx. 3).
- Item: pill `rgba(8,30,56,.92)` + `blur(16px)`, ícone 26px esmeralda, texto 13.5px. Entrada: `translateY(18px) scale(.94)` → normal. Some após 2.6s. `aria-live="polite"`.

---

## 8. Interações (JS) — contrato de comportamento

Padrões: helpers `$`/`$$`; hooks `data-*` para tudo que é dinâmico; conteúdo repetitivo gerado de objetos de dados.

| Hook | Comportamento |
|---|---|
| `data-toast` | Delegado global: clique exibe toast com o texto do atributo |
| `data-reveal` (+ `style="--d:80ms"`) | Reveal on scroll (ver motion #1) |
| `data-count` / `data-suffix` / `data-pad` | Contador animado ao entrar na viewport |
| `data-beds` (tiles) | Mapa de leitos renderizado de `BEDS` (id, nome, idade, status, tom) + `selectBed()` atualiza painel de detalhe |
| `.stepper` + `data-min/max/step/comma` | Botões `data-dir="±1"` ajustam `.step-val[data-value]` com clamp, arredondamento e bump |
| `data-mini` | Stepper do bento (temperatura, passo 0.1) |
| `data-tab` | Abas de medicações: troca `.med-panel` ativo + move `#med-tab-ink` |
| `.swatch` + `data-hex` | Copia hex para clipboard + feedback (classe `is-copied` + toast) |
| `.dnav-item` / `.pnav-item` | Ativação exclusiva (`is-active`); itens não-demo mostram toast |
| `#voice-mic` | Simulação de gravação: state machine `idle → recording → done → idle`; digitação da transcrição via `setInterval` de 34ms (+2 chars/tick) com caret; wave animada via classe `is-live` |
| `#pnav-fab` | Rola até a tela de voz (`scrollIntoView` inline center) e dispara gravação após 500ms |
| `#dash-refresh` | Spin no ícone + reanima donut e contadores + toast |
| `.magnetic` | Efeito magnético (só `pointer:fine`) |
| `#dash-clock` | Relógio ao vivo pt-BR (1s) |

### Estado e dados de exemplo (demo)
- **Censo**: 164/200 ocupados (82%), 28 livres, 6 manutenção, 2 bloqueados.
- **Leitos**: 24 leitos (201–224) com 3 alas de 8; alertas em 203 ("Dipirona atrasada há 25 min") e 214 ("Insulina atrasada há 40 min"); avisos em 202 e 219; 224 livre.
- **Timeline**: 5 eventos (08:00–09:30) com tons alert/ok/warn/idle.
- **Resumo**: 32 altas, 18 internações, 07 transferências, 05 óbitos.
- **Transcrição**: "Paciente relata dor leve em hipogástrio. Administrado dipirona 1g EV às 08h. Sinais vitais estáveis. Sem intercorrências."
- **Paciente destaque**: Leito 203 — Ana Carolina Lima, 72 anos, Enfermaria 2A, Dr. R. Mendes.

### Convenções de código
- CSS: custom properties no `:root`; nomes flat descritivos (`.nav-pill`, `.voice-mic`, `.med-tab-ink`); estados com prefixo `is-`; tamanhos com variantes (`--sm`, `--lg`, `--alt`, `--amber`).
- JS: sem framework; helpers `$`/`$$`; dados em consts; toasts para feedback de demo.
- Ícones: SVGs inline `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width: 1.5–1.6` (até 2.6 para ênfase), `stroke-linecap/linejoin: round`.
- Acessibilidade: `aria-label` em botões de ícone, `role="tablist/tab"`, `aria-live="polite"` no toast, `aria-expanded` no menu.

---

## 9. Responsividade (breakpoints)

| Breakpoint | Mudanças |
|---|---|
| `≤1120px` | Dashboard: censo span 5, mapa span 7, timeline vira grid 2 col full-width, resumo span 7. Bento: 2 colunas (voz span 2) |
| `≤900px` | Sidebar some; split vira 1 coluna; brand vira 1 coluna; nav: links somem e hambúrguer aparece; botão da nav some |
| `≤768px` | Seções `80px 18px`; cards do dashboard todos full-width (span 12); timeline 1 coluna; leitos `repeat(4,1fr)`; celulares viram carrossel com snap; bento 1 coluna; palette 2 colunas; anexos 2 colunas; footer centralizado |
| `≤480px` | CTAs do hero full-width; stats compactas; anexos 1 coluna |

Regras gerais: navegação desktop vira overlay mobile; dashboard de 4 cards vira pilha; 3 celulares viram carrossel; tudo que era 2–3 colunas colapsa para 1.

---

## 10. Checklist para novas features

Ao adicionar uma tela/componente novo, verificar:
1. Usa tokens de cor/tipografia das seções 2–3 (sem hex soltos).
2. Raios e sombras da seção 4 (consistência de linguagem).
3. Micro-interações com `--ease`/`--ease-bounce` + `:active { scale(.97) }`.
4. Entrada com `data-reveal` + delay em cascata `--d`.
5. Estados com prefixo `is-` e animação própria na tabela da seção 5.
6. `data-toast` para ações de demo; `aria-label` para botões de ícone.
7. Testar nos 4 breakpoints (seção 9) e com `prefers-reduced-motion`.
8. pt-BR na UI; números tabulares; ícones stroke 1.5–1.6 com cantos redondos.
