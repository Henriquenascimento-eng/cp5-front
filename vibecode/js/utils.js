/* ==========================================================
   UTILS: funções pequenas e estado compartilhado
   ========================================================== */

(function (O) {
  "use strict";

  /* Estado que vários módulos leem/escrevem */
  O.state = {
    scrollY: 0,   // posição do scroll (usada pelas estrelas)
    mouseX: 0,    // mouse de -0.5 a 0.5 (parallax)
    mouseY: 0,
    lenis: null   // instância do Lenis (criada em scroll.js)
  };

  O.utils = {
    /* atalho para document.getElementById */
    $: function (id) { return document.getElementById(id); },

    /* 5 -> "05" */
    pad: function (n) { return (n < 10 ? "0" : "") + n; },

    /* 1434 -> "1.434" */
    fmt: function (n) { return Math.round(n).toLocaleString("pt-BR"); },

    /* O usuário pediu menos animação? */
    reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,

    /* Dispositivo de toque (celular/tablet)? */
    coarse: window.matchMedia("(pointer: coarse)").matches,

    /* As bibliotecas GSAP carregaram? (falha se estiver sem internet) */
    hasGsap: typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined"
  };

})(window.Orbita);
