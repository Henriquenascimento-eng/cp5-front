/* ==========================================================
   REVEAL: elementos que aparecem ao rolar (.reveal)
   e números que contam até o valor final ([data-count])
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils;

  function formatar(valor, casas) {
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  }

  function aparecerAoRolar() {
    if (u.reduce) return;
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }

  function contadores() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var fim = parseFloat(el.dataset.count);
      var casas = parseInt(el.dataset.dec || "0", 10);

      // sem GSAP ou sem animação: mostra o valor final direto
      if (!u.hasGsap || u.reduce) { el.textContent = formatar(fim, casas); return; }

      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: fim, duration: 1.8, ease: "power2.out",
            onUpdate: function () { el.textContent = formatar(obj.v, casas); }
          });
        }
      });
    });
  }

  O.reveal = {
    init: function () {
      if (u.hasGsap) aparecerAoRolar();
      contadores();
    }
  };

})(window.Orbita);
