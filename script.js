document.addEventListener("DOMContentLoaded", () => {
  /* 1. Ustaw swój user, repo i branch */
  const GITHUB_USER = "krolp0";     // <-- ZMIEŃ NA SWÓJ LOGIN
  const GITHUB_REPO = "DJDUO";      // <-- ZMIEŃ NA NAZWĘ REPO
  const BRANCH_NAME = "main";       // <-- ZMIEŃ NA NAZWĘ GAŁĘZI

  // Intersection Observer (animacja wjazdu sekcji)
  const sections = document.querySelectorAll(".section");
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
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

  // Hamburger menu – obsługa kliknięcia
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  /*
    Funkcja pobiera listę plików (obrazów) z folderu w repo GitHub
    i zwraca obietnicę (Promise) z tablicą URLi do tych obrazów.
  */
  function fetchImageUrlsFromGitHub(folderName) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${folderName}?ref=${BRANCH_NAME}`;

    return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Wyłapujemy tylko pliki z rozszerzeniami .jpg, .jpeg, .png, .gif
        return data
          .filter(item => item.type === "file" && /\.(jpg|jpeg|png|gif)$/i.test(item.name))
          .map(item => item.download_url); // zwracamy link do pobrania
      })
      .catch(err => {
        console.error("Błąd pobierania plików z GitHuba:", err);
        return [];
      });
  }

  /*
    Funkcja tworzy elementy <img> w kontenerze .gallery
    (lightbox obsługiwany przez event listener).
  */
  function populateGallery(imageUrls, containerId) {
    const container = document.getElementById(containerId);
    imageUrls.forEach(url => {
      const galleryItem = document.createElement("div");
      galleryItem.classList.add("gallery-item");

      const img = document.createElement("img");
      img.src = url;
      img.alt = url.split("/").pop(); // nazwa pliku

      // Podpinamy do lightboxa
      img.addEventListener("click", () => {
        lightbox.classList.add("open");
        lightboxImg.src = img.src;
      });

      galleryItem.appendChild(img);
      container.appendChild(galleryItem);
    });
  }

  /*
    1) Pobieramy zdjęcia z folderu `tlo/`
    2) Rotujemy je w tle .slider co 5 sekund
  */
  function initHeroSlider() {
    const slider = document.querySelector(".slider");
    fetchImageUrlsFromGitHub("tlo")  // folder "tlo"
      .then(imageUrls => {
        if (!imageUrls.length) {
          console.warn("Brak zdjęć w folderze tlo/ lub błąd API");
          return;
        }
        let currentIndex = 0;
        // Ustawiamy początkowe tło
        slider.style.backgroundImage = `url(${imageUrls[currentIndex]})`;

        // Rotacja co 5s
        setInterval(() => {
          currentIndex = (currentIndex + 1) % imageUrls.length;
          slider.style.backgroundImage = `url(${imageUrls[currentIndex]})`;
        }, 5000);
      });
  }

  /*
    Funkcja do pobierania zdjęć do danej galerii
    (np. DJ -> #galleryDJ, foto -> #galleryFoto, dym -> #galleryDym)
  */
  function initGallery(folderName, containerId) {
    fetchImageUrlsFromGitHub(folderName)
      .then(urls => {
        populateGallery(urls, containerId);
      });
  }

  // Inicjujemy slider w Hero
  initHeroSlider();

  // Inicjujemy galerie
  initGallery("DJ", "galleryDJ");
  initGallery("foto", "galleryFoto");
  initGallery("dym", "galleryDym");

  // Jeśli chcesz dodać kolejną sekcję (np. "poznaj/"), wywołaj:
  // initGallery("poznaj", "galleryPoznaj");
});
