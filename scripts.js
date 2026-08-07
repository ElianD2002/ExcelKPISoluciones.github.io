(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktopNavMq = window.matchMedia("(min-width: 1101px)");

  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var navLinks = document.querySelectorAll("[data-nav]");
  var mobileNavLinks = document.querySelectorAll("[data-nav-mobile]");
  var lastFocusBeforeMenu = null;

  /* --------------------------------------------------------------------------
     Header height → CSS var --header-height
     -------------------------------------------------------------------------- */
  function setHeaderHeight() {
    if (!header) return;
    var height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-height", height + "px");
  }

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight, { passive: true });
  if (window.ResizeObserver && header) {
    var headerRo = new ResizeObserver(setHeaderHeight);
    headerRo.observe(header);
  }

  /* Header background on scroll */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------------------------
     Mobile menu — a11y (inert, aria, focus, Escape, scroll lock, desktop close)
     -------------------------------------------------------------------------- */
  function getMenuFocusables() {
    if (!mobileMenu) return [];
    return Array.prototype.slice.call(
      mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) {
      return !el.hasAttribute("disabled") && el.offsetParent !== null;
    });
  }

  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    if (!mobileMenu.classList.contains("is-open")) return;

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if ("inert" in mobileMenu) {
      mobileMenu.inert = true;
    }
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    document.body.classList.remove("menu-open");

    if (lastFocusBeforeMenu && typeof lastFocusBeforeMenu.focus === "function") {
      lastFocusBeforeMenu.focus();
    } else {
      menuToggle.focus();
    }
    lastFocusBeforeMenu = null;
    setHeaderHeight();
  }

  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    if (desktopNavMq.matches) return;

    lastFocusBeforeMenu = document.activeElement;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if ("inert" in mobileMenu) {
      mobileMenu.inert = false;
    }
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú de navegación");
    document.body.classList.add("menu-open");
    setHeaderHeight();

    var focusables = getMenuFocusables();
    if (focusables.length) {
      focusables[0].focus();
    }
  }

  function toggleMenu() {
    if (mobileMenu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && mobileMenu) {
    // Ensure closed state on load
    mobileMenu.setAttribute("aria-hidden", "true");
    if ("inert" in mobileMenu) {
      mobileMenu.inert = true;
    }
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", function () {
      toggleMenu();
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key !== "Tab" || !mobileMenu.classList.contains("is-open")) return;

      var focusables = getMenuFocusables();
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    function onNavBreakpointChange() {
      if (desktopNavMq.matches) {
        closeMenu();
      }
      setHeaderHeight();
    }

    if (typeof desktopNavMq.addEventListener === "function") {
      desktopNavMq.addEventListener("change", onNavBreakpointChange);
    } else if (typeof desktopNavMq.addListener === "function") {
      desktopNavMq.addListener(onNavBreakpointChange);
    }
  }

  /* Active nav link based on visible section */
  var sectionIds = ["inicio", "soluciones", "desarrollo", "portafolio", "nosotros", "contacto"];
  var trackedSections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && trackedSections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + id;
              if (match) {
                link.setAttribute("aria-current", "true");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    trackedSections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();


(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  /* Opt-in: only then CSS may hide non-visible reveals */
  document.documentElement.classList.add("js-reveal");

  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* Light parallax on hero glows — desktop only, disabled on touch */
  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  var glowA = document.querySelector(".hero-glow-a");
  var glowB = document.querySelector(".hero-glow-b");

  if (!isTouch && glowA && glowB) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var y = window.scrollY;
            glowA.style.transform = "translateY(" + y * 0.06 + "px)";
            glowB.style.transform = "translateY(" + y * -0.04 + "px)";
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();


(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     Inline galleries + lightbox
     -------------------------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var lightboxCounter = document.getElementById("lightboxCounter");
  var lightboxTitle = document.getElementById("lightboxTitle");
  var lightboxDots = document.getElementById("lightboxDots");
  var lastFocusBeforeLightbox = null;
  var currentGallery = [];
  var currentIndex = 0;
  var currentTitle = "Galería de proyecto";

  function parseGalleryAttr(value) {
    if (!value) return [];
    return value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function setInlineSlide(root, index) {
    var slides = root.querySelectorAll(".gallery-slide");
    var counter = root.querySelector("[data-gallery-counter]");
    if (!slides.length) return;

    var total = slides.length;
    var safeIndex = ((index % total) + total) % total;

    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === safeIndex);
    });

    root.dataset.currentIndex = String(safeIndex);

    if (counter) {
      counter.textContent = (safeIndex + 1) + " / " + total;
    }
  }

  function initInlineGalleries() {
    document.querySelectorAll("[data-inline-gallery]").forEach(function (gallery) {
      var slides = gallery.querySelectorAll(".gallery-slide");
      if (!slides.length) return;

      gallery.dataset.currentIndex = "0";
      setInlineSlide(gallery, 0);

      var prevBtn = gallery.querySelector(".gallery-prev");
      var nextBtn = gallery.querySelector(".gallery-next");

      if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var idx = parseInt(gallery.dataset.currentIndex || "0", 10);
          setInlineSlide(gallery, idx - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var idx = parseInt(gallery.dataset.currentIndex || "0", 10);
          setInlineSlide(gallery, idx + 1);
        });
      }

      if (slides.length <= 1) {
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
      }
    });
  }

  function renderLightboxDots() {
    if (!lightboxDots) return;
    lightboxDots.innerHTML = "";
    currentGallery.forEach(function (_src, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "lightbox-dot" + (i === currentIndex ? " is-active" : "");
      dot.setAttribute("aria-label", "Ir a imagen " + (i + 1));
      dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");
      dot.addEventListener("click", function (e) {
        e.stopPropagation();
        showLightboxImage(i);
      });
      lightboxDots.appendChild(dot);
    });
  }

  function updateLightbox() {
    if (!lightboxImg || !currentGallery.length) return;
    lightboxImg.src = currentGallery[currentIndex];
    lightboxImg.alt = currentTitle + " — vista " + (currentIndex + 1) + " de " + currentGallery.length;
    if (lightboxTitle) {
      lightboxTitle.textContent = currentTitle;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + " / " + currentGallery.length;
    }
    var multi = currentGallery.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !multi;
    if (lightboxNext) lightboxNext.hidden = !multi;
    if (lightboxDots) lightboxDots.hidden = !multi;
    renderLightboxDots();
  }

  function getLightboxFocusables() {
    if (!lightbox) return [];
    return Array.prototype.slice.call(
      lightbox.querySelectorAll('button:not([hidden]):not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function openLightbox(images, startIndex, title) {
    if (!lightbox || !images.length) return;
    currentGallery = images.slice();
    currentIndex = Math.max(0, Math.min(startIndex || 0, currentGallery.length - 1));
    currentTitle = title || "Galería de proyecto";
    lastFocusBeforeLightbox = document.activeElement;
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    updateLightbox();
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lightboxImg) {
      lightboxImg.removeAttribute("src");
      lightboxImg.alt = "";
    }
    if (lightboxDots) lightboxDots.innerHTML = "";
    currentGallery = [];
    currentIndex = 0;
    if (lastFocusBeforeLightbox && typeof lastFocusBeforeLightbox.focus === "function") {
      lastFocusBeforeLightbox.focus();
    }
    lastFocusBeforeLightbox = null;
  }

  function showLightboxImage(index) {
    if (!currentGallery.length) return;
    var total = currentGallery.length;
    currentIndex = ((index % total) + total) % total;
    updateLightbox();
  }

  initInlineGalleries();

  document.querySelectorAll(".case-card[data-gallery]").forEach(function (card) {
    function openFromCard() {
      var images = parseGalleryAttr(card.getAttribute("data-gallery"));
      var inline = card.querySelector("[data-inline-gallery]");
      var start = inline ? parseInt(inline.dataset.currentIndex || "0", 10) : 0;
      var heading = card.querySelector(".case-body h3");
      var title = heading ? heading.textContent.trim() : "Galería de proyecto";
      openLightbox(images, start, title);
    }

    card.addEventListener("click", function (e) {
      if (e.target.closest(".gallery-btn") || e.target.closest("a")) return;
      openFromCard();
    });

    var stage = card.querySelector(".gallery-stage[role='button']");
    if (stage) {
      stage.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          openFromCard();
        }
      });
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      showLightboxImage(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function (e) {
      e.stopPropagation();
      showLightboxImage(currentIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightbox || lightbox.hidden) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showLightboxImage(currentIndex - 1);
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      showLightboxImage(currentIndex + 1);
      return;
    }

    if (e.key === "Tab") {
      var focusables = getLightboxFocusables();
      if (!focusables.length) {
        e.preventDefault();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!lightbox.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();


(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  var statusEl = document.getElementById("formStatus");

  var fields = {
    nombre: { input: document.getElementById("fieldName"), error: document.getElementById("errName") },
    correo: { input: document.getElementById("fieldEmail"), error: document.getElementById("errEmail") },
    mensaje: { input: document.getElementById("fieldMessage"), error: document.getElementById("errMessage") }
  };

  function setError(key, message) {
    var f = fields[key];
    if (!f || !f.input) return;
    f.input.closest(".form-row").classList.toggle("has-error", !!message);
    if (message) {
      f.input.setAttribute("aria-invalid", "true");
    } else {
      f.input.removeAttribute("aria-invalid");
    }
    if (f.error) f.error.textContent = message || "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    var valid = true;

    if (!fields.nombre.input.value.trim()) {
      setError("nombre", "Escribe tu nombre.");
      valid = false;
    } else {
      setError("nombre", "");
    }

    if (!isValidEmail(fields.correo.input.value.trim())) {
      setError("correo", "Escribe un correo válido.");
      valid = false;
    } else {
      setError("correo", "");
    }

    if (!fields.mensaje.input.value.trim()) {
      setError("mensaje", "Cuéntanos brevemente qué necesitas.");
      valid = false;
    } else {
      setError("mensaje", "");
    }

    return valid;
  }

  form.addEventListener("submit", function (e) {
    var honeypot = document.getElementById("fieldHp");
    if (honeypot && honeypot.value) {
      e.preventDefault();
      return;
    }

    if (!validate()) {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = "Revisa los campos marcados antes de enviar.";
        statusEl.className = "form-status is-error";
      }
      return;
    }

    if (statusEl) {
      statusEl.textContent = "Enviando mensaje…";
      statusEl.className = "form-status";
    }
    // Formspree handles the real submission (conservado del sitio actual).
  });

  [fields.nombre, fields.correo, fields.mensaje].forEach(function (f) {
    if (f && f.input) {
      f.input.addEventListener("blur", validate);
    }
  });
})();


(function () {
  "use strict";

  var yearEl = document.getElementById("footerYear");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
