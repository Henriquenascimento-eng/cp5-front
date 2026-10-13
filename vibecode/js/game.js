/* ==========================================================
   GAME: campo de asteroides (<canvas id="game">)
   Organização deste arquivo:
     1. CFG        → números do jogo (ajuste aqui)
     2. Estado     → variáveis da partida
     3. Criação    → asteroides, cristais, partículas
     4. Update     → regras e colisões
     5. Draw       → desenho no canvas
     6. Controles  → mouse, toque e teclado
     7. Fluxo      → começar, terminar, pausar
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils;

  /* ---------- 1. CFG: ajuste a dificuldade aqui ---------- */
  var CFG = {
    largura: 900,
    altura: 520,
    vidas: 3,

    nave:    { raio: 16, velocidadeTeclado: 620, suavidade: 14, invulneravel: 1.4 },
    asteroide: {
      raioMin: 14, raioExtra: 30,        // raio = min + aleatório(0..extra)
      velMin: 90,  velExtra: 110,        // velocidade vertical
      deriva: 70,                        // movimento lateral máximo
      cor: "#7a6f66", borda: "#b9aca0"
    },
    cristal: { raio: 11, pontos: 50, primeiro: 2, intervaloMin: 3, intervaloExtra: 3, cor: "#7cf5ff" },

    pontosPorSegundo: 10,
    dificuldadeCadaSeg: 22,              // a cada X seg a velocidade dos asteroides sobe 1x
    spawnInicial: 0.75, spawnMinimo: 0.16, spawnReducaoPorSeg: 0.012
  };

  /* ---------- 2. Estado da partida ---------- */
  var cv, g, overlay, ovTitulo, ovTexto, btnJogar;
  var estado = "parado";            // parado | jogando | fim
  var visivel = false;              // o canvas está na tela?
  var ultimoT = 0;
  var nave, pedras, cristais, particulas;
  var pontos, vidas, tempo, timerPedra, timerCristal, tremor;
  var recorde = 0;
  var teclas = { esq: false, dir: false };

  function lerRecorde() {
    try { recorde = parseInt(localStorage.getItem("orbita-best") || "0", 10) || 0; }
    catch (e) { recorde = 0; }
  }
  function salvarRecorde() {
    try { localStorage.setItem("orbita-best", String(recorde)); } catch (e) {}
  }

  function zerarPartida() {
    nave = { x: CFG.largura / 2, alvo: CFG.largura / 2, y: CFG.altura - 70, r: CFG.nave.raio, inv: 0 };
    pedras = []; cristais = []; particulas = [];
    pontos = 0; vidas = CFG.vidas; tempo = 0;
    timerPedra = 0; timerCristal = CFG.cristal.primeiro; tremor = 0;
  }

  /* ---------- 3. Criação de objetos ---------- */
  function criarPedra() {
    var a = CFG.asteroide;
    var r = a.raioMin + Math.random() * a.raioExtra;
    var formato = [], lados = 9;
    for (var i = 0; i < lados; i++) {
      var ang = (i / lados) * 6.2832, irregular = 0.75 + Math.random() * 0.4;
      formato.push([Math.cos(ang) * r * irregular, Math.sin(ang) * r * irregular]);
    }
    var dificuldade = 1 + tempo / CFG.dificuldadeCadaSeg;
    return {
      x: Math.random() * CFG.largura, y: -r - 10, r: r * 0.9,
      vy: (a.velMin + Math.random() * a.velExtra) * dificuldade,
      vx: (Math.random() - 0.5) * a.deriva,
      rot: Math.random() * 6, giro: (Math.random() - 0.5) * 3,
      formato: formato
    };
  }

  function criarCristal() {
    return { x: 30 + Math.random() * (CFG.largura - 60), y: -20, r: CFG.cristal.raio,
             vy: 130 + Math.random() * 60, t: 0 };
  }

  function explodir(x, y, cor, quantidade) {
    for (var i = 0; i < quantidade; i++) {
      var ang = Math.random() * 6.2832, vel = 60 + Math.random() * 220;
      particulas.push({ x: x, y: y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel,
                        vida: 0.6 + Math.random() * 0.5, cor: cor });
    }
  }

  /* ---------- 4. Update: regras do jogo ---------- */
  function mover(dt) {
    // nave: teclado move o alvo, a nave desliza até ele
    if (teclas.esq) nave.alvo -= CFG.nave.velocidadeTeclado * dt;
    if (teclas.dir) nave.alvo += CFG.nave.velocidadeTeclado * dt;
    nave.alvo = Math.max(nave.r, Math.min(CFG.largura - nave.r, nave.alvo));
    nave.x += (nave.alvo - nave.x) * Math.min(1, dt * CFG.nave.suavidade);
    if (nave.inv > 0) nave.inv -= dt;

    pedras.forEach(function (o) { o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.giro * dt; });
    cristais.forEach(function (c) { c.y += c.vy * dt; c.t += dt; });
    particulas.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt; });
  }

  function gerar(dt) {
    timerPedra -= dt;
    if (timerPedra <= 0) {
      pedras.push(criarPedra());
      timerPedra = Math.max(CFG.spawnMinimo, CFG.spawnInicial - tempo * CFG.spawnReducaoPorSeg);
    }
    timerCristal -= dt;
    if (timerCristal <= 0) {
      cristais.push(criarCristal());
      timerCristal = CFG.cristal.intervaloMin + Math.random() * CFG.cristal.intervaloExtra;
    }
  }

  function colisoes() {
    pedras.forEach(function (o) {
      var dx = o.x - nave.x, dy = o.y - nave.y;
      var encostou = dx * dx + dy * dy < Math.pow(o.r + nave.r * 0.8, 2);
      if (nave.inv <= 0 && encostou) {
        vidas--; nave.inv = CFG.nave.invulneravel; tremor = 0.35;
        explodir(nave.x, nave.y, "#ff8a65", 26);
        O.audio.beep(120, 0.35, "sawtooth", 0.09, 0.4);
        o.y = CFG.altura + 200;               // tira a pedra da tela
        if (vidas <= 0) terminar();
      }
    });

    cristais.forEach(function (c) {
      var dx = c.x - nave.x, dy = c.y - nave.y;
      if (dx * dx + dy * dy < Math.pow(c.r + nave.r, 2)) {
        pontos += CFG.cristal.pontos;
        explodir(c.x, c.y, CFG.cristal.cor, 14);
        c.y = CFG.altura + 200;
        O.audio.beep(880, 0.12, "square", 0.05, 1.5);
      }
    });
  }

  function limpar() {
    pedras = pedras.filter(function (o) { return o.y < CFG.altura + 80 && o.x > -80 && o.x < CFG.largura + 80; });
    cristais = cristais.filter(function (c) { return c.y < CFG.altura + 60; });
    particulas = particulas.filter(function (p) { return p.vida > 0; });
  }

  function atualizar(dt) {
    tempo += dt;
    pontos += dt * CFG.pontosPorSegundo;
    mover(dt);
    gerar(dt);
    colisoes();
    limpar();
    if (tremor > 0) tremor -= dt;
  }

  /* ---------- 5. Draw: desenho ---------- */
  function desenharFundo() {
    g.fillStyle = "rgba(255,255,255,.35)";
    for (var i = 0; i < 40; i++) {
      var x = (i * 137.5) % CFG.largura;
      var y = (i * 91 + tempo * (60 + (i % 5) * 40)) % CFG.altura;
      g.fillRect(x, y, 1.5, 1.5 + (i % 3));
    }
  }

  function desenharCristais() {
    cristais.forEach(function (c) {
      g.save();
      g.translate(c.x, c.y); g.rotate(c.t * 2);
      g.fillStyle = CFG.cristal.cor; g.shadowColor = CFG.cristal.cor; g.shadowBlur = 18;
      g.beginPath();
      g.moveTo(0, -c.r); g.lineTo(c.r * 0.7, 0); g.lineTo(0, c.r); g.lineTo(-c.r * 0.7, 0);
      g.closePath(); g.fill();
      g.restore();
    });
  }

  function desenharPedras() {
    pedras.forEach(function (o) {
      g.save();
      g.translate(o.x, o.y); g.rotate(o.rot);
      g.fillStyle = CFG.asteroide.cor; g.strokeStyle = CFG.asteroide.borda; g.lineWidth = 2;
      g.beginPath();
      o.formato.forEach(function (p, k) { if (k === 0) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); });
      g.closePath(); g.fill(); g.stroke();
      g.restore();
    });
  }

  function desenharParticulas() {
    particulas.forEach(function (p) {
      g.globalAlpha = Math.max(0, p.vida);
      g.fillStyle = p.cor;
      g.fillRect(p.x, p.y, 3, 3);
    });
    g.globalAlpha = 1;
  }

  function desenharNave() {
    var piscando = nave.inv > 0 && Math.floor(nave.inv * 14) % 2 === 0;
    if (estado !== "jogando" || piscando) return;

    g.save();
    g.translate(nave.x, nave.y);
    var chama = 10 + Math.random() * 10;
    g.fillStyle = "#ffb347";                                   // fogo
    g.beginPath(); g.moveTo(-6, 14); g.lineTo(0, 14 + chama); g.lineTo(6, 14); g.closePath(); g.fill();
    g.fillStyle = "#eef1ff"; g.shadowColor = "#7c8cff"; g.shadowBlur = 16;   // corpo
    g.beginPath(); g.moveTo(0, -20); g.lineTo(15, 16); g.lineTo(0, 9); g.lineTo(-15, 16); g.closePath(); g.fill();
    g.restore();
  }

  function desenharHUD() {
    g.textAlign = "left";
    g.fillStyle = "#eef1ff"; g.font = "600 20px 'Space Grotesk', sans-serif";
    g.fillText("Pontos " + Math.floor(pontos || 0), 20, 34);
    g.fillStyle = "#8d93b8"; g.font = "500 14px 'Space Grotesk', sans-serif";
    g.fillText("Recorde " + recorde, 20, 56);

    var coracoes = ""; for (var i = 0; i < (vidas || 0); i++) coracoes += "♥ ";
    g.textAlign = "right"; g.fillStyle = "#ff7ad9"; g.font = "600 22px sans-serif";
    g.fillText(coracoes, CFG.largura - 20, 36);
  }

  function desenhar() {
    g.save();
    g.clearRect(0, 0, CFG.largura, CFG.altura);
    if (tremor > 0) g.translate((Math.random() - 0.5) * 36 * tremor, (Math.random() - 0.5) * 36 * tremor);

    desenharFundo();
    desenharCristais();
    desenharPedras();
    desenharParticulas();
    desenharNave();
    g.restore();

    desenharHUD();   // fora do tremor: o texto não balança
  }

  /* ---------- 6. Controles ---------- */
  function xDoPonteiro(e) {
    var rect = cv.getBoundingClientRect();
    return (e.clientX - rect.left) * (CFG.largura / rect.width);
  }

  function ligarControles() {
    cv.addEventListener("pointermove", function (e) { if (estado === "jogando") nave.alvo = xDoPonteiro(e); });
    cv.addEventListener("pointerdown", function (e) { if (estado === "jogando") nave.alvo = xDoPonteiro(e); });

    window.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "a")  { teclas.esq = true; if (estado === "jogando") e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d") { teclas.dir = true; if (estado === "jogando") e.preventDefault(); }
    });
    window.addEventListener("keyup", function (e) {
      if (e.key === "ArrowLeft" || e.key === "a")  teclas.esq = false;
      if (e.key === "ArrowRight" || e.key === "d") teclas.dir = false;
    });

    btnJogar.addEventListener("click", comecar);
  }

  /* ---------- 7. Fluxo do jogo ---------- */
  function comecar() {
    zerarPartida();
    estado = "jogando";
    overlay.classList.add("hide");
    O.audio.beep(440, 0.2, "triangle", 0.07, 2);
    ultimoT = performance.now();
    requestAnimationFrame(loop);
  }

  function terminar() {
    estado = "fim";
    var novoRecorde = Math.floor(pontos) > recorde;
    if (novoRecorde) { recorde = Math.floor(pontos); salvarRecorde(); }

    ovTitulo.textContent = novoRecorde ? "Novo recorde!" : "Missão encerrada";
    ovTexto.textContent = "Pontos: " + Math.floor(pontos) + " · Recorde: " + recorde + ". Quer tentar de novo?";
    btnJogar.textContent = "Jogar de novo";
    overlay.classList.remove("hide");

    O.audio.beep(220, 0.6, "sawtooth", 0.07, 0.4);
    if (novoRecorde) setTimeout(function () {
      O.audio.beep(660, 0.12, "square", 0.05);
      O.audio.beep(880, 0.2, "square", 0.05);
    }, 200);
  }

  /* Laço principal: só atualiza se o jogo está visível na tela */
  function loop(agora) {
    if (estado !== "jogando") { desenhar(); return; }

    var dt = Math.min(0.05, (agora - ultimoT) / 1000);
    ultimoT = agora;
    if (visivel && !document.hidden) { atualizar(dt); desenhar(); }

    if (estado === "jogando") requestAnimationFrame(loop);
    else desenhar();
  }

  function observarVisibilidade() {
    if (!("IntersectionObserver" in window)) { visivel = true; return; }
    new IntersectionObserver(function (entradas) {
      visivel = entradas[0].isIntersecting;
      ultimoT = performance.now();
    }, { threshold: 0.25 }).observe(cv);
  }

  O.game = {
    init: function () {
      cv = u.$("game");
      g = cv.getContext("2d");
      overlay = u.$("overlay");
      ovTitulo = u.$("ovTitle");
      ovTexto = u.$("ovText");
      btnJogar = u.$("play");

      lerRecorde();
      zerarPartida();
      desenhar();            // primeira imagem (tela parada)
      ligarControles();
      observarVisibilidade();
    }
  };

})(window.Orbita);
