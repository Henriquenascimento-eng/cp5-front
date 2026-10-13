/* ==========================================================
   HERO: título dividido em letras + animação de entrada
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils;

  O.hero = {
    /* Transforma "ÓRBITA" em <span>Ó</span><span>R</span>... */
    init: function () {
      var titulo = u.$("titulo");
      var letras = titulo.textContent.split("");
      titulo.innerHTML = "";

      letras.forEach(function (letra) {
        var span = document.createElement("span");
        span.className = "ch";
        span.textContent = letra;
        span.setAttribute("aria-hidden", "true"); // o aria-label do h1 já lê a palavra
        titulo.appendChild(span);
      });
    },

    /* Chamada pelo loader quando ele termina */
    intro: function () {
      if (!u.hasGsap || u.reduce) return;

      gsap.from(".ch", {
        yPercent: 120, rotate: 8, opacity: 0,
        duration: 1.1, ease: "power4.out", stagger: 0.07
      });
      gsap.from(".eyebrow, .sub", {
        y: 24, opacity: 0, duration: 1, delay: 0.5, stagger: 0.15, ease: "power3.out"
      });
    }
  };

})(window.Orbita);
