document.addEventListener("DOMContentLoaded", function () {
  // --- Gestion du menu mobile ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () =>
      mobileMenu.classList.toggle("hidden")
    );
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  // --- Défilement fluide pour les ancres ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // 80px pour la hauteur du nav
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    });
  });

  // --- Animation d'apparition au défilement ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // --- Accordéon pour la FAQ ---
  document.querySelectorAll(".faq-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const icon = this.querySelector("i");
      if (content && icon) {
        const isHidden = content.classList.contains("hidden");
        document.querySelectorAll(".faq-content").forEach((item) => {
          item.classList.add("hidden");
          const otherIcon = item.previousElementSibling?.querySelector("i");
          if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        });
        if (isHidden) {
          content.classList.remove("hidden");
          icon.style.transform = "rotate(180deg)";
        }
      }
    });
  });

  // ===================================================================
  // CORRECTION DÉFINITIVE : CARROUSEL DES AVIS (AVEC GRID)
  // ===================================================================
  const reviewsSlider = document.getElementById("reviews-slider");
  const prevBtn = document.getElementById("prev-review");
  const nextBtn = document.getElementById("next-review");
  const indicatorsContainer = document.getElementById("review-indicators");

  if (reviewsSlider && prevBtn && nextBtn && indicatorsContainer) {
    let currentPage = 0;
    let totalPages = 0;

    const setupCarousel = () => {
      const itemsPerView =
        window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      totalPages = Math.ceil(reviewsSlider.children.length / itemsPerView);

      indicatorsContainer.innerHTML = "";
      if (totalPages > 1) {
        for (let i = 0; i < totalPages; i++) {
          const indicator = document.createElement("div");
          indicator.className =
            "w-2 h-2 rounded-full transition-all cursor-pointer";
          indicator.addEventListener("click", () => goToPage(i));
          indicatorsContainer.appendChild(indicator);
        }
      }

      if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
      }

      updateSlider();
    };

    const updateSlider = () => {
      const sliderWrapper = reviewsSlider.parentElement;
      if (!sliderWrapper) return;

      const itemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      const itemWidth = sliderWrapper.offsetWidth / itemsPerView;
      const transformValue = -currentPage * itemWidth * itemsPerView;
      reviewsSlider.style.transform = `translateX(${transformValue}px)`;

      const indicators = indicatorsContainer.children;
      Array.from(indicators).forEach((indicator, index) => {
        indicator.classList.toggle("bg-primary", index === currentPage);
        indicator.classList.toggle("bg-gray-300", index !== currentPage);
      });

      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage >= totalPages - 1;
    };

    const goToPage = (pageIndex) => {
      currentPage = pageIndex;
      updateSlider();
    };

    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        updateSlider();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        updateSlider();
      }
    });

    window.addEventListener("resize", setupCarousel);
    setupCarousel();
  }

  // ===================================================================
  // MODALE DE PRISE DE RENDEZ-VOUS
  // ===================================================================
  const appointmentModal = document.getElementById("appointment-modal");
  const appointmentSelection = document.getElementById("appointment-selection");
  const calendarContainer = document.getElementById("calendar-container");
  const calEmbed = document.getElementById("cal-embed");
  const closeModalBtn = document.getElementById("close-modal");
  const backToSelectionBtn = document.getElementById("back-to-selection");

  if (
    appointmentModal &&
    appointmentSelection &&
    calendarContainer &&
    calEmbed &&
    closeModalBtn &&
    backToSelectionBtn
  ) {
    const openModal = () => {
      appointmentModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      appointmentModal.classList.add("hidden");
      document.body.style.overflow = "";
      calEmbed.innerHTML = "";
    };

    const showSelectionView = () => {
      appointmentSelection.classList.remove("hidden");
      calendarContainer.classList.add("hidden");
    };

    const showCalendarView = (calUser) => {
      if (!calUser) return;
      calEmbed.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = `https://cal.com/${calUser}?embed=true`;
      iframe.className = "w-full h-full border-0";
      calEmbed.appendChild(iframe);
      appointmentSelection.classList.add("hidden");
      calendarContainer.classList.remove("hidden");
    };

    document.querySelectorAll('a[href="#contact"]').forEach((link) => {
      if (link.textContent.includes("Prendre")) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showSelectionView();
          openModal();
        });
      }
    });

    document.querySelectorAll('a[href*="cal.com"]').forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const calUrl = this.getAttribute("href");
        if (calUrl) {
          const calUser = calUrl.replace("https://cal.com/", "");
          showCalendarView(calUser);
          openModal();
        }
      });
    });

    appointmentSelection
      .querySelectorAll(".appointment-type")
      .forEach((button) => {
        button.addEventListener("click", function () {
          const calUser = this.dataset.cal;
          showCalendarView(calUser);
        });
      });

    closeModalBtn.addEventListener("click", closeModal);
    backToSelectionBtn.addEventListener("click", showSelectionView);
    appointmentModal.addEventListener("click", (e) => {
      if (e.target === appointmentModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !appointmentModal.classList.contains("hidden"))
        closeModal();
    });
  }

  // --- Modales Vidéo ---
  const setupVideoModal = (
    modalId,
    openBtnId,
    closeBtnId,
    iframeId,
    videoId
  ) => {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const iframe = document.getElementById(iframeId);
    if (
      !modal ||
      !openBtn ||
      !closeBtn ||
      !(iframe instanceof HTMLIFrameElement)
    )
      return;

    const openModal = () => {
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
      modal.classList.add("hidden");
      iframe.src = "";
      document.body.style.overflow = "";
    };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden"))
        closeModal();
    });
  };

  setupVideoModal(
    "video-modal",
    "play-video-btn",
    "close-video-modal",
    "youtube-iframe",
    "AU7iFHLDZjg"
  );
  setupVideoModal(
    "app-video-modal",
    "play-app-video-btn",
    "close-app-video-modal",
    "app-youtube-iframe",
    "KE5woKG04LM"
  );

  // --- Gestion du formulaire Netlify ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : '';
      
      // Indiquer que l'envoi est en cours
      if (submitButton) {
        submitButton.textContent = "Envoi en cours...";
        submitButton.disabled = true;
      }
      
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        // Succès - afficher le message de confirmation
        const successMessage = document.createElement("div");
        successMessage.innerHTML = `
          <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-600 text-xl mr-3"></i>
              <div>
                <h3 class="font-medium text-green-800">Message envoyé avec succès !</h3>
                <p class="text-green-700 text-sm mt-1">Mélina vous répondra dans les plus brefs délais.</p>
              </div>
            </div>
          </div>
        `;
        contactForm.parentNode.insertBefore(successMessage, contactForm);
        contactForm.reset();
        
        // Masquer le message après 10 secondes
        setTimeout(() => {
          successMessage.remove();
        }, 10000);
      })
      .catch((error) => {
        // Erreur - afficher le message d'erreur
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = `
          <div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-600 text-xl mr-3"></i>
              <div>
                <h3 class="font-medium text-red-800">Erreur lors de l'envoi</h3>
                <p class="text-red-700 text-sm mt-1">Veuillez réessayer ou contacter directement au 06 95 85 21 02</p>
              </div>
            </div>
          </div>
        `;
        contactForm.parentNode.insertBefore(errorMessage, contactForm);
        
        setTimeout(() => {
          errorMessage.remove();
        }, 10000);
      })
      .finally(() => {
        // Remettre le bouton à son état initial
        if (submitButton) {
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }
      });
    });
  }
});
