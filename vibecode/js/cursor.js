/* ==========================================================
   CURSOR: círculo que segue o mouse (só em computador)
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils;

  O.cursor = {
    init: function () {
      if (u.coarse) return; // celular não tem mouse

      var circulo = document.querySelector(".cursor");
      var ponto = document.querySelector(".cursor-dot");

      if (u.hasGsap) {
        // GSAP deixa o círculo "atrasado", com efeito suave
        var moveX = gsap.quickTo(circulo, "x", { duration: 0.35, ease: "power3" });
        var moveY = gsap.quickTo(circulo, "y", { duration: 0.35, ease: "power3" });
        window.addEventListener("pointermove", function (e) {
          moveX(e.clientX); moveY(e.clientY);
          ponto.style.left = e.clientX + "px";
          ponto.style.top = e.clientY + "px";
        });
      } else {
        window.addEventListener("pointermove", function (e) {
          circulo.style.left = ponto.style.left = e.clientX + "px";
          circulo.style.top = ponto.style.top = e.clientY + "px";
        });
      }

      // aumenta o círculo ao passar sobre links e botões
      document.querySelectorAll("a, button").forEach(function (el) {
        el.addEventListener("pointerenter", function () { circulo.classList.add("grow"); });
        el.addEventListener("pointerleave", function () { circulo.classList.remove("grow"); });
      });
    }
  };

})(window.Orbita);
