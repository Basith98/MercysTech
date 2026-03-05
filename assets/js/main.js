document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     PRELOADER
  =============================== */
  const preloaderEl = document.getElementById('preloader');
  if (preloaderEl) {
    document.body.classList.add('loading');

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('loading');
        preloaderEl.style.display = 'none';
      }
    });

    tl.to("#preloader", {
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: "power2.inOut"
    });
  }

  /* ===============================
     NAVBAR SCROLL EFFECT
  =============================== */
  let isScrolled = false;
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    const shouldBeScrolled = window.scrollY > 80;

    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;

      requestAnimationFrame(() => {
        nav.classList.toggle('nav-scrolled', isScrolled);
      });
    }
  }, { passive: true });

  /* ===============================
     GSAP STICKY SEQUENCE (Vertical slide + Liquid Glass)
  =============================== */
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector('#sequence-text-wrapper');
  if (wrapper) {
    const items = wrapper.querySelectorAll('.sequence-word');
    const itemHeight = items[0].offsetHeight;
    const totalScroll = (items.length - 1) * itemHeight;

    // Simple Y-translation with scrub + snap (matches live site)
    gsap.to(wrapper, {
      y: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: "#sticky-sequence-trigger",
        start: "top top",
        end: "bottom-=200vh bottom",
        scrub: 1.5,
        snap: 1 / (items.length - 1),
        onUpdate: (self) => {
          // Liquid glass effect: blur words during transitions
          const progress = self.progress;
          const segSize = 1 / (items.length - 1);

          items.forEach((word, i) => {
            const wordCenter = i * segSize;
            const distFromCenter = Math.abs(progress - wordCenter);
            // Normalize distance: 0 = at center (sharp), 1 = far away (blurred)
            const normalizedDist = Math.min(distFromCenter / (segSize * 0.5), 1);

            // Apply liquid glass blur effect
            const blurAmount = normalizedDist * 10;
            const opacity = 1 - (normalizedDist * 0.6);
            word.style.filter = `blur(${blurAmount}px)`;
            word.style.opacity = opacity;
          });
        }
      }
    });

    // Liquid glass fade-out of entire content when leaving the sticky section
    const panelContent = document.querySelector('#sequence-pin-panel > div');
    if (panelContent) {
      gsap.to(panelContent, {
        opacity: 0,
        filter: "blur(28px)",
        scale: 1.04,
        y: -20,
        ease: "power1.in",
        scrollTrigger: {
          trigger: "#sticky-sequence-trigger",
          start: "bottom-=200vh bottom",
          end: "bottom bottom",
          scrub: 2
        }
      });
    }
  }

  /* ===============================
     DARK MODE SECTION
  =============================== */
  ScrollTrigger.create({
    trigger: "#dark-section",
    start: "top 20%",
    end: "bottom 80%",
    onEnter: activateDarkMode,
    onEnterBack: activateDarkMode,
    onLeave: deactivateDarkMode,
    onLeaveBack: deactivateDarkMode
  });

  function activateDarkMode() {
    document.getElementById("dark-section").classList.add("dark-active");
    document.getElementById("main-nav").classList.add("nav-dark-glass");

    const logo = document.getElementById("main-logo");
    if (logo) logo.style.filter = "invert(1) brightness(10)";
  }

  function deactivateDarkMode() {
    document.getElementById("dark-section").classList.remove("dark-active");
    document.getElementById("main-nav").classList.remove("nav-dark-glass");

    const logo = document.getElementById("main-logo");
    if (logo) logo.style.filter = "none";
  }

  /* ===============================
     SWIPER
  =============================== */
  new Swiper('.heroSwiper', {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    }
  });

});