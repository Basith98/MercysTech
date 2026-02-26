document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     PRELOADER
  =============================== */
  document.body.classList.add('loading');

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('loading');
      document.getElementById('preloader').style.display = 'none';
    }
  });

  tl.to("#preloader", {
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power2.inOut"
  });

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
     GSAP STICKY SEQUENCE
  =============================== */
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector('#sequence-text-wrapper');
  if (wrapper) {
    const items = wrapper.querySelectorAll('h2');
    const itemHeight = items[0].offsetHeight;
    const totalScroll = (items.length - 1) * itemHeight;

    gsap.to(wrapper, {
      y: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: "#sticky-sequence-trigger",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        snap: 1 / (items.length - 1)
      }
    });
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