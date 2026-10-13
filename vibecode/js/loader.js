/* ==========================================================
   LOADER: tela de carregamento com porcentagem
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils;

  O.loader = {
    /* aoTerminar: função chamada quando o loader some */
    init: function (aoTerminar) {
      var el = u.$("loader"), pctEl = u.$("loader-pct");
      var pct = 0;

      var timer = setInterval(function () {
        pct += Math.random() * 14 + 6;   // sobe de forma irregular

        if (pct >= 100) {
          clearInterval(timer);
          pctEl.textContent = "100%";
          setTimeout(function () {
            el.classList.add("hide");
            if (aoTerminar) aoTerminar();
          }, 250);
        } else {
          pctEl.textContent = Math.floor(pct) + "%";
        }
      }, 90);
    }
  };

})(window.Orbita);
