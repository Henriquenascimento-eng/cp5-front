/* ==========================================================
   CONFIG: dados e ajustes do site (mexa aqui primeiro!)
   Tudo fica dentro do objeto global "Orbita".
   ========================================================== */

window.Orbita = window.Orbita || {};

Orbita.config = {

  /* Quanto de scroll cada planeta "ocupa" (em % da altura da tela).
     Maior = viagem mais lenta. */
  SCROLL_POR_PLANETA: 70,

  /* Quantidade de estrelas no fundo */
  ESTRELAS: { desktop: 280, celular: 140 },

  /* Planetas: para adicionar/editar, basta mexer nesta lista.
       dist  = distância do Sol em milhões de km
       s     = escala do tamanho (1 = padrão)
       c1,c2 = cor clara e cor escura do planeta
       ring  = true desenha o anel (Saturno) */
  PLANETAS: [
    { nome: "Sol",      dist: 0,    temp: "5.500 °C", luas: "0",    s: 1.25, c1: "#fff3b0", c2: "#ff9d00", ring: false,
      fato: "Uma estrela comum que contém 99,8% de toda a massa do Sistema Solar." },
    { nome: "Mercúrio", dist: 58,   temp: "167 °C",   luas: "0",    s: 0.45, c1: "#d6d6d6", c2: "#6d6d6d", ring: false,
      fato: "O menor planeta e o mais rápido: dá a volta no Sol em apenas 88 dias." },
    { nome: "Vênus",    dist: 108,  temp: "464 °C",   luas: "0",    s: 0.70, c1: "#fbe3b0", c2: "#c98a3b", ring: false,
      fato: "É o planeta mais quente, mesmo não sendo o mais próximo do Sol. Gira ao contrário dos demais." },
    { nome: "Terra",    dist: 150,  temp: "15 °C",    luas: "1",    s: 0.75, c1: "#8fd3ff", c2: "#1f7a4d", ring: false,
      fato: "Nosso lar e o único lugar conhecido com vida. Mais de 70% da superfície é coberta por água." },
    { nome: "Marte",    dist: 228,  temp: "-65 °C",   luas: "2",    s: 0.55, c1: "#ff9d7a", c2: "#8d2f1c", ring: false,
      fato: "Abriga o Monte Olimpo, o maior vulcão do Sistema Solar, com cerca de 22 km de altura." },
    { nome: "Júpiter",  dist: 778,  temp: "-110 °C",  luas: "95+",  s: 1.20, c1: "#f1d3a8", c2: "#a5602f", ring: false,
      fato: "Gigante gasoso grande o bastante para caberem mais de mil Terras dentro dele." },
    { nome: "Saturno",  dist: 1434, temp: "-140 °C",  luas: "140+", s: 1.00, c1: "#f6e3b4", c2: "#b8924a", ring: true,
      fato: "Famoso pelos anéis de gelo e rocha. Sua densidade é menor que a da água." },
    { nome: "Urano",    dist: 2871, temp: "-195 °C",  luas: "28",   s: 0.80, c1: "#c6f7ff", c2: "#2a8fa6", ring: false,
      fato: "Gira deitado, com inclinação de cerca de 98°, como uma bola rolando em órbita." },
    { nome: "Netuno",   dist: 4495, temp: "-200 °C",  luas: "16",   s: 0.80, c1: "#7fb2ff", c2: "#1d3a9e", ring: false,
      fato: "O planeta mais distante, com os ventos mais rápidos do Sistema Solar." }
  ]
};
