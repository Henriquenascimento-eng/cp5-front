/* ==========================================================
   JOURNEY: a viagem pelos planetas
   A seção #viagem fica "fixada" na tela; conforme você rola,
   o planeta troca (dados vêm de config.js → PLANETAS).
   ========================================================== */

(function (O) {
  "use strict";

  var u = O.utils, st = O.state, PLANETAS = O.config.PLANETAS;

  var el = {};            // elementos da página (preenchido no init)
  var atual = -1;         // índice do planeta mostrado agora
  var distObj = { v: 0 }; // valor animado do contador de distância
  var trocaTl = null;     // animação de troca em andamento
  var gatilho = null;     // ScrollTrigger da seção

  /* ---------- Escreve os dados do planeta na tela ---------- */
  function mostrarPlaneta(i) {
    var p = PLANETAS[i];
    var raiz = document.documentElement.style;

    raiz.setProperty("--c1", p.c1);
    raiz.setProperty("--c2", p.c2);
    el.planeta.style.setProperty("--s", p.s);
    el.anel.style.setProperty("--s", p.s);
    el.anel.classList.toggle("on", p.ring);

    el.nome.textContent = p.nome;
    el.fato.textContent = p.fato;
    el.idx.textContent = u.pad(i + 1) + " / " + u.pad(PLANETAS.length);
    el.temp.textContent = p.temp;
    el.luas.textContent = p.luas;

    el.bolinhas.forEach(function (b, k) { b.classList.toggle("on", k === i); });
  }

  /* ---------- Troca de planeta (com animação) ---------- */
  function trocarPlaneta(i) {
    if (i === atual) return;
    var primeira = atual === -1;
    atual = i;
    var p = PLANETAS[i];

    // sem animação (primeira vez, sem GSAP ou "menos movimento")
    if (!u.hasGsap || u.reduce || primeira) {
      mostrarPlaneta(i);
      el.dist.textContent = u.fmt(p.dist) + " mi km";
      return;
    }

    if (trocaTl) trocaTl.kill();
    trocaTl = gsap.timeline();
    trocaTl
      .to(el.wrap, { scale: 0.55, opacity: 0, duration: 0.25, ease: "power2.in" })   // some
      .to(el.info, { opacity: 0, y: 14, duration: 0.2 }, 0)
      .add(function () { mostrarPlaneta(i); })                                         // troca os dados
      .to(el.wrap, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" })    // volta
      .to(el.info, { opacity: 1, y: 0, duration: 0.4 }, "<0.1")
      .to(distObj, {                                                                   // contador de distância
        v: p.dist, duration: 0.9, ease: "power2.out",
        onUpdate: function () { el.dist.textContent = u.fmt(distObj.v) + " mi km"; }
      }, 0);
  }

  /* ---------- Clique nas bolinhas: rola até o planeta ---------- */
  function irParaPlaneta(i) {
    if (!gatilho) return;
    var y = gatilho.start + ((i + 0.5) / PLANETAS.length) * (gatilho.end - gatilho.start);
    O.scroll.rolarPara(y);
  }

  function criarBolinhas() {
    PLANETAS.forEach(function (p, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", p.nome);
      b.addEventListener("click", function () { irParaPlaneta(i); });
      el.caixaBolinhas.appendChild(b);
    });
    el.bolinhas = el.caixaBolinhas.querySelectorAll("button");
  }

  /* ---------- Ligação com o scroll ---------- */
  function criarScrollTrigger() {
    gatilho = ScrollTrigger.create({
      trigger: "#viagem",
      start: "top top",
      end: "+=" + (PLANETAS.length * O.config.SCROLL_POR_PLANETA) + "%",
      pin: true,
      scrub: true,
      onUpdate: function (self) {
        var i = Math.min(PLANETAS.length - 1, Math.floor(self.progress * PLANETAS.length));
        trocarPlaneta(i);
        el.barra.style.transform = "scaleX(" + self.progress.toFixed(4) + ")";

        // o planeta gira um pouco enquanto você rola
        if (!u.reduce) gsap.to(el.planeta, { rotate: self.progress * 120, duration: 0.6, overwrite: "auto" });
      }
    });
  }

  /* Plano B: sem GSAP, calcula o planeta pelo scroll da janela */
  function ligarSemGsap() {
    window.addEventListener("scroll", function () {
      var r = u.$("viagem").getBoundingClientRect();
      var prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      trocarPlaneta(Math.min(PLANETAS.length - 1, Math.floor(prog * PLANETAS.length)));
    }, { passive: true });
  }

  O.journey = {
    init: function () {
      el.planeta = u.$("planet");
      el.anel = u.$("ring");
      el.wrap = u.$("planetWrap");
      el.info = u.$("info");
      el.nome = u.$("nome");
      el.fato = u.$("fato");
      el.idx = u.$("idx");
      el.dist = u.$("dDist");
      el.temp = u.$("dTemp");
      el.luas = u.$("dLuas");
      el.barra = u.$("distFill");
      el.caixaBolinhas = u.$("dots");

      criarBolinhas();
      trocarPlaneta(0);
      el.dist.textContent = "0 mi km";

      if (u.hasGsap) criarScrollTrigger();
      else ligarSemGsap();
    }
  };

})(window.Orbita);
