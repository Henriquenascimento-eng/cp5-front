/* ==========================================================
   SCROLL: rolagem suave (Lenis), barra de progresso e
   links do menu. Também registra o ScrollTrigger.
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils, st = O.state;

  /* Rola até uma posição (px) usando Lenis se existir */
  function rolarPara(y) {
    if (st.lenis) st.lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: u.reduce ? "auto" : "smooth" });
  }

  /* Rola até um elemento */
  function rolarAteElemento(el) {
    if (st.lenis) st.lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: u.reduce ? "auto" : "smooth" });
  }

  /* Links do menu (#missao, #viagem, #jogo...) */
  function ligarLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var alvo = document.querySelector(a.getAttribute("href"));
        if (!alvo) return;
        e.preventDefault();
        rolarAteElemento(alvo);
      });
    });
  }

  O.scroll = {
    rolarPara: rolarPara,

    init: function () {
      // Sempre guarda o scroll para as estrelas (com ou sem Lenis)
      window.addEventListener("scroll", function () { st.scrollY = window.scrollY; }, { passive: true });

      if (u.hasGsap) {
        gsap.registerPlugin(ScrollTrigger);

        // Lenis = rolagem "macia". Desligado para quem prefere menos movimento.
        if (!u.reduce && typeof Lenis !== "undefined") {
          st.lenis = new Lenis({ lerp: 0.09 });
          st.lenis.on("scroll", function (e) {
            st.scrollY = e.scroll;
            ScrollTrigger.update();
          });
          gsap.ticker.add(function (t) { st.lenis.raf(t * 1000); });
          gsap.ticker.lagSmoothing(0);
        }

        // Barra de progresso do topo
        gsap.to("#progress", {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.2 }
        });
      }

      ligarLinks();
    }
  };

})(window.Orbita);
