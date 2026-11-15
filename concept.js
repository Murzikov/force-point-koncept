/* Концепт: шторка «эскиз – готовый объект», лента работ и мягкое появление блоков. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".compare").forEach(function (box) {
    var range = box.querySelector(".compare-range");
    range.addEventListener("input", function () { box.style.setProperty("--pos", range.value + "%"); });
  });

  /* Лента как во всём прототипе: три целых слайда на десктопе, два на планшете, один на телефоне */
  if (window.Swiper) {
    document.querySelectorAll(".ribbon .swiper").forEach(function (node) {
      new window.Swiper(node, {
        speed: reduced ? 0 : 520,
        slidesPerView: 1,
        spaceBetween: 16,
        grabCursor: true,
        watchOverflow: true,
        keyboard: { enabled: true },
        mousewheel: { forceToAxis: true },
        breakpoints: { 761: { slidesPerView: 2, spaceBetween: 20 }, 1025: { slidesPerView: 3, spaceBetween: 24 } },
      });
    });
  }

  /* Ролики без звука играют, только пока видны; при «меньше движения» остаётся обложка */
  var clips = document.querySelectorAll("video[data-autoplay]");
  if (clips.length && "IntersectionObserver" in window && !reduced) {
    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.preload = "auto"; e.target.play().catch(function () {}); } else { e.target.pause(); }
      });
    }, { threshold: 0.25 });
    clips.forEach(function (clip) { player.observe(clip); });
  }

  var items = document.querySelectorAll(".door, .compare, .two-tone, .stop, .faq-item, .ribbon");
  if (!("IntersectionObserver" in window) || reduced) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
})();
