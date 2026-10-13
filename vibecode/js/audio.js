/* ==========================================================
   AUDIO: sons sintetizados (Web Audio API, sem arquivos)
   Uso: Orbita.audio.beep(frequência, duração, tipo, volume, slide)
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils;
  var ctx = null;      // AudioContext (criado no primeiro som)
  var mudo = false;

  O.audio = {
    init: function () {
      var botao = u.$("mute");
      botao.addEventListener("click", function () {
        mudo = !mudo;
        botao.textContent = "Som: " + (mudo ? "desligado" : "ligado");
        botao.setAttribute("aria-pressed", String(mudo));
      });
    },

    /* freq: Hz | dur: segundos | tipo: sine, square, triangle, sawtooth
       vol: 0 a 1 | slide: multiplica a frequência até o fim (ex.: 0.4 = som que desce) */
    beep: function (freq, dur, tipo, vol, slide) {
      if (mudo) return;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator(), ganho = ctx.createGain();

        osc.type = tipo || "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), ctx.currentTime + dur);

        ganho.gain.setValueAtTime(vol || 0.08, ctx.currentTime);
        ganho.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

        osc.connect(ganho); ganho.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + dur);
      } catch (erro) {
        /* sem áudio disponível: o jogo continua normalmente */
      }
    }
  };

})(window.Orbita);
