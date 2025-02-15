document.addEventListener("DOMContentLoaded", () => {
  /* 1. Ustaw swój user, repo i branch */
  const GITHUB_USER = "krolp0";    // <-- ZMIEŃ NA SWÓJ LOGIN
  const GITHUB_REPO = "DJDUO";     // <-- ZMIEŃ NA NAZWĘ REPO
  const BRANCH_NAME = "main";      // <-- ZMIEŃ NA NAZWĘ GAŁĘZI

  // Intersection Observer (animacja wjazdu sekcji)
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

  // Slider w tle (Hero) – zmiana obrazka co 5 sekund
  // Możesz podać 2–3 obrazki z folderów w repo, np. "foto/fotolustro1.jpg"
  const slider = document.querySelector(".slider");
  const imagesSlider = [
    "foto/fotolustro1.jpg",
    "foto/fotolustro2.jpg"
  ];
  let currentIndex = 0;
  slider.style.backgroundImage = `url(https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH_NAME}/${imagesSlider[currentIndex]})`;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % imagesSlider.length;
    slider.style.backgroundImage = `url(https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH_NAME}/${imagesSlider[currentIndex]})`;
  }, 5000);

  // Hamburger menu – obsługa kliknięcia
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Lightbox (powiększanie zdjęć po kliknięciu)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("open");
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("open");
    }
  });

  /*
    Funkcja pobiera listę plików z folderu w repo GitHub
    i wstawia miniaturki do kontenera o danym ID.
  */
  function fetchImagesFromGitHub(folderName, containerId) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${folderName}?ref=${BRANCH_NAME}`;
    // Przykład: https://api.github.com/repos/krolp0/DJDUO/contents/DJ?ref=main

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          // Szukamy plików typu obraz (jpg, jpeg, png, gif)
          if (item.type === "file" && /\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
            // Tworzymy kontener .gallery-item
            const galleryItem = document.createElement("div");
            galleryItem.classList.add("gallery-item");

            // Tworzymy <img> i ustawiamy src na download_url
            const img = document.createElement("img");
            img.src = item.download_url; // link bezpośredni do pliku
            img.alt = item.name;

            // Podpinamy do lightboxa
            img.addEventListener("click", () => {
              lightbox.classList.add("open");
              lightboxImg.src = img.src;
            });

            galleryItem.appendChild(img);
            // Wstawiamy do kontenera w HTML
            document.getElementById(containerId).appendChild(galleryItem);
          }
        });
      })
      .catch(err => console.error("Błąd pobierania plików z GitHuba:", err));
  }

  // Wczytujemy zdjęcia z folderów:
  // 1) DJ -> #galleryDJ
  fetchImagesFromGitHub("DJ", "galleryDJ");

  // 2) foto -> #galleryFoto
  fetchImagesFromGitHub("foto", "galleryFoto");

  // 3) dym -> #galleryDym
  fetchImagesFromGitHub("dym", "galleryDym");
});
