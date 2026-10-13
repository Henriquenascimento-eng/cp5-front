# ÓRBITA · Vibecode

Página de scroll interativo com uma viagem pelo Sistema Solar e um minijogo.
Para ver: abra `index.html` no navegador (precisa de internet por causa dos CDNs).

## Estrutura

```text
vibecode/
├── index.html          # só a estrutura (HTML) e a ordem dos arquivos
├── css/
│   ├── base.css        # cores (variáveis), reset, fundo
│   ├── ui.css          # loader, cursor, barra de progresso, menu, rodapé
│   ├── sections.css    # hero, missão/estatísticas, viagem dos planetas
│   ├── game.css        # seção do jogo
│   └── responsive.css  # celular + "menos movimento" (sempre por último)
└── js/
    ├── config.js       # DADOS: lista de planetas e ajustes gerais
    ├── utils.js        # funções pequenas e estado compartilhado
    ├── stars.js        # estrelas do fundo (canvas)
    ├── loader.js       # tela de carregamento
    ├── cursor.js       # cursor personalizado
    ├── hero.js         # título dividido em letras + animação de entrada
    ├── scroll.js       # rolagem suave (Lenis), progresso, links do menu
    ├── reveal.js       # elementos que aparecem ao rolar + contadores
    ├── journey.js      # viagem pelos planetas (cena fixada)
    ├── audio.js        # sons sintetizados
    ├── game.js         # minijogo de asteroides
    └── main.js         # liga tudo na ordem certa
```

## "Quero mudar X... onde mexo?"

| Quero mudar...                         | Arquivo                         |
| -------------------------------------- | ------------------------------- |
| Cores do site                          | `css/base.css` (`:root`)        |
| Texto, planetas, temperaturas, tamanho | `js/config.js`                  |
| Velocidade da viagem (scroll)          | `js/config.js` (`SCROLL_POR_PLANETA`) |
| Quantidade de estrelas                 | `js/config.js` (`ESTRELAS`)     |
| Dificuldade do jogo, vidas, pontos     | `js/game.js` (objeto `CFG`)     |
| Textos das seções                      | `index.html`                    |
| Layout no celular                      | `css/responsive.css`            |
| Visual do planeta / anel               | `css/sections.css`              |
| Sons                                   | `js/audio.js` e chamadas `beep` em `game.js` |

## Como os arquivos conversam

Cada arquivo JS é um "módulo" guardado no objeto global `Orbita`
(ex.: `Orbita.game`, `Orbita.journey`). Cada módulo tem uma função `init()`
que o `main.js` chama. Se algo quebrar, abra o Console (F12) e veja em qual
arquivo está o erro.

## Dica de depuração

Se você estiver sem internet, o GSAP e o Lenis não carregam: a página ainda
abre e mostra o conteúdo, mas sem as animações de scroll.
