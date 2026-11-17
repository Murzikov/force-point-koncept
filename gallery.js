/* Главная «Галерея»: меню, шторка, лента работ, объект при прокрутке, появление блоков, ролик. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Меню на телефоне и планшете */
  var burger = document.querySelector(".burger");
  if (burger) {
    var close = function () { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".menu a").forEach(function (link) { link.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* Шторка «эскиз – готовый объект» */
  document.querySelectorAll(".compare").forEach(function (box) {
    var range = box.querySelector(".compare-range");
    range.addEventListener("input", function () { box.style.setProperty("--pos", range.value + "%"); });
  });

  /* Лента работ: три целых слайда на десктопе, два на планшете, один на телефоне */
  if (window.Swiper) {
    document.querySelectorAll(".ribbon .swiper").forEach(function (node) {
      new window.Swiper(node, {
        speed: reduced ? 0 : 520, slidesPerView: 1, spaceBetween: 16, grabCursor: true, watchOverflow: true,
        keyboard: { enabled: true }, mousewheel: { forceToAxis: true },
        breakpoints: { 641: { slidesPerView: 2, spaceBetween: 20 }, 1025: { slidesPerView: 3, spaceBetween: 28 } },
      });
    });
  }

  /* Объект над рамкой чуть отстаёт от неё при прокрутке: так он кажется ближе к зрителю */
  var pops = document.querySelectorAll(".pop[data-lift]");
  if (pops.length && !reduced) {
    var ticking = false;
    var update = function () {
      var middle = window.innerHeight / 2;
      pops.forEach(function (pop) {
        var r = pop.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var shift = (r.top + r.height / 2 - middle) / window.innerHeight;
        pop.style.setProperty("--lift", Math.max(-1, Math.min(1, shift)) * 14);
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* Ролик играет, только пока виден */
  var clips = document.querySelectorAll("video[data-autoplay]");
  if (clips.length && "IntersectionObserver" in window && !reduced) {
    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.preload = "auto"; e.target.play().catch(function () {}); } else { e.target.pause(); } });
    }, { threshold: 0.25 });
    clips.forEach(function (clip) { player.observe(clip); });
  }

  /* Мягкое появление блоков */
  var items = document.querySelectorAll(".card, .compare, .title, .work, .faq-item, .stop, .final-pop");
  if (!("IntersectionObserver" in window) || reduced) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
})();
