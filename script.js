(() => {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".slide-dots button")];
  const carousel = document.querySelector(".hero-slideshow");
  let active = 0;
  let timer;
  let touchStart = null;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === active);
      slide.setAttribute("aria-hidden", i === active ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === active);
      if (i === active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setInterval(() => show(active + 1), 5500);
    }
  };

  document.querySelector(".slide-arrow-prev").addEventListener("click", () => show(active - 1));
  document.querySelector(".slide-arrow-next").addEventListener("click", () => show(active + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);
  carousel.addEventListener("touchstart", (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 48) show(active + (distance > 0 ? -1 : 1));
    touchStart = null;
  }, { passive: true });

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach((input) => input.min = localToday);
  show(0);
  start();
})();
