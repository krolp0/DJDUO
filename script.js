document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer dla animacji wjazdu sekcji
  const sections = document.querySelectorAll(".section");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // Slider tła – zmiana obrazka co 5 sekund
  const slider = document.querySelector(".slider");
  const images = ["fotolustro1.jpg", "fotolustro2.jpg"];
  let currentIndex = 0;
  slider.style.backgroundImage = `url(${images[currentIndex]})`;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    slider.style.backgroundImage = `url(${images[currentIndex]})`;
  }, 5000);

  // Hamburger menu – obsługa kliknięcia
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});
