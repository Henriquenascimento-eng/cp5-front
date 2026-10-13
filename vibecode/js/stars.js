/* ==========================================================
   STARS: campo de estrelas no <canvas id="stars">
   Reage ao scroll e ao mouse (parallax).
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils, st = O.state;
  var canvas, ctx, stars = [], W = 0, H = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var total = u.coarse ? O.config.ESTRELAS.celular : O.config.ESTRELAS.desktop;
    stars = [];
    for (var i = 0; i < total; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.9 + 0.1,        // "profundidade": maior = mais perto
        tw: Math.random() * Math.PI * 2      // fase do brilho piscando
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var px = s.x + st.mouseX * s.z * 22;
      var py = ((s.y - st.scrollY * s.z * 0.35 + st.mouseY * s.z * 22) % H + H) % H;
      var brilho = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.0015 * s.z + s.tw));

      ctx.globalAlpha = u.reduce ? 0.7 : brilho;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(px, py, s.z * 1.5, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    draw(t);
    if (!u.reduce) requestAnimationFrame(loop);
  }

  O.stars = {
    init: function () {
      canvas = u.$("stars");
      ctx = canvas.getContext("2d");
      resize();

      window.addEventListener("resize", function () {
        resize();
        if (u.reduce) draw(0);
      });
      window.addEventListener("pointermove", function (e) {
        st.mouseX = e.clientX / window.innerWidth - 0.5;
        st.mouseY = e.clientY / window.innerHeight - 0.5;
      });

      requestAnimationFrame(loop);
    }
  };

})(window.Orbita);
