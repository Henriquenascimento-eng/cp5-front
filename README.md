# Checkpoint 5 · Front-End Design

Repositório único com as quatro atividades do checkpoint, cada uma baseada num material visto em aula:
**revisão, Bootstrap, Tailwind e vibecode**.

- **Disciplina:** Front-End Design, 1ES, 2026 (FIAP)
- **Professora:** Cyntia Sayuri
- **Aluno:** Henrique, RM ______ (desenvolvimento individual)

| Pasta | Atividade | Página | Tecnologias |
| --- | --- | --- | --- |
| [`revisao/`](revisao/) | Revisão | Patinhas Pet Shop | HTML + CSS puro |
| [`bootstrap/`](bootstrap/) | Bootstrap | FitZone Academia | Bootstrap 5.3 (CDN) |
| [`tailwind/`](tailwind/) | Tailwind | Mochila Viagens | Tailwind CSS 4 (CDN) |
| [`vibecode/`](vibecode/) | Vibecode | ÓRBITA, viagem pelo Sistema Solar | HTML, CSS, JavaScript, GSAP, Lenis |

## 1. Revisão: Patinhas Pet Shop

Landing page de um pet shop feita só com HTML e CSS, para revisar a base antes dos frameworks.

- Cabeçalho com menu de navegação e seção principal (hero) com chamada para ação.
- Seções de **Serviços** (cards), **Sobre nós**, **Depoimentos** e **Contato** com formulário, além do rodapé.
- Layout com Flexbox e um único arquivo `style.css`.

## 2. Bootstrap: FitZone Academia

Página de uma academia montada com os componentes do Bootstrap 5.

- **Navbar** responsiva com menu colapsável e fixa no topo.
- **Cards de planos** organizados com o grid do Bootstrap (`row` e `col-md-4`).
- **Carrossel** de depoimentos, **accordion** de dúvidas frequentes e **modal** com o formulário de matrícula.
- Um `style.css` curto só para as cores da marca.

## 3. Tailwind: Mochila Viagens

Página de uma agência de viagens estilizada com classes utilitárias do Tailwind CSS 4.

- Tema próprio declarado em `@theme` (cores areia, mar e sol).
- Seções de início, **como funciona em 4 passos**, **destinos em destaque** em grid e rodapé de contato.
- Responsividade com os prefixos `md:` e `lg:` e efeitos de `hover:`.

## 4. Vibecode: ÓRBITA (Sistema Solar)

Experiência de scroll interativa: você sai do Sol, passa por todos os planetas até Netuno e, no fim da página,
joga um minijogo de asteroides.

- **Viagem pelos planetas:** a seção fica fixada na tela e, conforme você rola, o planeta troca com animação.
  Cada um tem cor, tamanho, distância do Sol, temperatura, número de luas e uma curiosidade. Saturno ganha anéis.
  Há bolinhas de navegação e uma barra de distância Sol → Netuno.
- **Efeitos visuais:** campo de estrelas em `<canvas>` com parallax (scroll e mouse), rolagem suave com **Lenis**,
  animações com **GSAP ScrollTrigger**, cursor personalizado, tela de carregamento, título animado letra por letra
  e contadores que sobem quando aparecem na tela.
- **Minijogo "Campo de asteroides":** a nave segue o mouse, o dedo ou as setas ← →. São 3 vidas, cristais valem
  50 pontos e a dificuldade aumenta com o tempo. O recorde fica salvo no navegador (`localStorage`) e os sons são
  sintetizados com a Web Audio API, com botão para silenciar. O jogo pausa quando sai da tela.
- **Acessibilidade e robustez:** respeita `prefers-reduced-motion`, funciona no celular e mostra o conteúdo mesmo
  se as bibliotecas não carregarem (sem internet).

O código do vibecode é separado por responsabilidade (um arquivo CSS por área e um arquivo JS por funcionalidade).
O mapa completo e a tabela "quero mudar X, onde mexo?" estão em [`vibecode/README.md`](vibecode/README.md).

## Como rodar

Todas as páginas são **estáticas**: não precisam de Node.js, instalação ou build.

1. Abra o `index.html` de cada pasta no navegador, ou use a extensão **Live Server** do VS Code.
2. É preciso estar conectado à internet, porque Bootstrap, Tailwind, GSAP, Lenis e as fontes do Google
   são carregados por CDN.

> Sem internet, o Bootstrap e o Tailwind perdem o estilo. O vibecode continua abrindo, mas sem as animações de scroll.

## Estrutura

```text
.
├── README.md
├── revisao/
│   ├── index.html
│   └── style.css
├── bootstrap/
│   ├── index.html
│   └── style.css
├── tailwind/
│   └── index.html
└── vibecode/
    ├── index.html
    ├── README.md
    ├── css/
    │   ├── base.css        # cores, reset, fundo
    │   ├── ui.css          # loader, cursor, progresso, menu, rodapé
    │   ├── sections.css    # hero, missão, viagem dos planetas
    │   ├── game.css        # seção do jogo
    │   └── responsive.css  # celular e "menos movimento"
    └── js/
        ├── config.js       # planetas e ajustes gerais
        ├── utils.js        # funções e estado compartilhado
        ├── stars.js        # estrelas do fundo
        ├── loader.js       # tela de carregamento
        ├── cursor.js       # cursor personalizado
        ├── hero.js         # título animado
        ├── scroll.js       # Lenis, progresso, links do menu
        ├── reveal.js       # aparecer ao rolar e contadores
        ├── journey.js      # viagem pelos planetas
        ├── audio.js        # sons
        ├── game.js         # minijogo
        └── main.js         # liga tudo
```

## Publicar na internet (opcional)

Como são páginas estáticas, dá para publicar de graça:

- **GitHub Pages:** envie o repositório para o GitHub e ative o Pages nas configurações.
- **Vercel ou Netlify:** importe o repositório e use a pasta desejada (por exemplo `vibecode/`) como raiz do site.

## Uso de ferramentas e IA

> Preencha esta seção conforme as regras do checkpoint: diga quais atividades foram feitas com ajuda de IA,
> qual ferramenta foi usada e o que você mesmo escreveu, revisou ou alterou.