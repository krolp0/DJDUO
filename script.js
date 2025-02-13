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

  // Slider w sekcji Hero (zmiana zdjęć co 5 sekund)
  const slides = document.querySelectorAll(".slider .slide");
  let currentSlide = 0;
  const slideInterval = 5000; // zmiana zdjęcia co 5 sekund

  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, slideInterval);

  // Hamburger menu – obsługa kliknięcia
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});
