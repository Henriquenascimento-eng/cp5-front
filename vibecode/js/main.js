/* ==========================================================
   MAIN: liga tudo na ordem certa
   A ordem importa: o scroll registra o ScrollTrigger antes
   de journey e reveal o usarem.
   ========================================================== */

(function (O) {
  "use strict";

  O.stars.init();     // fundo de estrelas
  O.hero.init();      // divide o título em letras
  O.loader.init(function () { O.hero.intro(); });  // some e anima o título
  O.cursor.init();    // cursor personalizado
  O.scroll.init();    // Lenis, barra de progresso, links
  O.reveal.init();    // aparecer ao rolar + contadores
  O.journey.init();   // planetas
  O.audio.init();     // botão de som
  O.game.init();      // jogo

})(window.Orbita);
