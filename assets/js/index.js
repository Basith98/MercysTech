// Skeleton loader: reveal real content after page is ready
window.addEventListener('load', () => {
    const skeleton = document.getElementById('skeleton-screen');

    // Small delay so the skeleton feels natural (not instant flash)
    setTimeout(() => {
        // Fade out skeleton
        skeleton.classList.add('hidden');

        // Reveal real content
        document.body.classList.remove('skeleton-loading');

        // Clean up skeleton from DOM after transition
        setTimeout(() => {
            skeleton.remove();
        }, 500);
    }, 400);
});


/* =========================================================
🚀 NAVBAR SCROLL LOGIC (Optimized + Direction Aware)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        // Morph to pill when scrolled past threshold
        // Never hides — always visible like Wolff Olins
        if (currentScrollY > 80) {
            nav.classList.add("nav-scrolled");
        } else {
            nav.classList.remove("nav-scrolled");
        }

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        },
        { passive: true }
    );
});

/* =========================================================
   🎬 GSAP STICKY SEQUENCE + DARK MODE (FIXED - SMOOTH FLOW)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

    const pinPanel = document.getElementById('sequence-pin-panel');
    if (!pinPanel) return;

    const desktopWords = gsap.utils.toArray("#sequence-text-wrapper .sequence-word");
    const mobileWords = gsap.utils.toArray(".sequence-word-mobile");

    // Set initial state
    desktopWords.forEach((word, i) => {
        gsap.set(word, { opacity: i === 0 ? 1 : 0, filter: i === 0 ? 'blur(0px)' : 'blur(6px)' });
    });
    mobileWords.forEach((word, i) => {
        gsap.set(word, { opacity: i === 0 ? 1 : 0, filter: i === 0 ? 'blur(0px)' : 'blur(6px)' });
    });

    function animateWordSet(words, progress) {
        if (!words.length) return;
        const N = words.length;
        // halfZone = how far either side of center the transition spans
        // With N=6 words mapped 0→1, centers are at 0, 0.2, 0.4, 0.6, 0.8, 1.0
        const halfZone = 0.5 / (N - 1);   // 0.10
        const trans = halfZone * 0.55;  // 0.055 — blend width

        words.forEach((word, i) => {
            const center = N === 1 ? 0.5 : i / (N - 1);
            let opacity, blur;

            if (i === 0) {
                // First word: fully visible at start, fades out as we pass its center
                if (progress < center + trans) {
                    opacity = 1; blur = 0;
                } else if (progress < center + halfZone) {
                    const t = (progress - (center + trans)) / (halfZone - trans);
                    opacity = 1 - t; blur = 8 * t;
                } else {
                    opacity = 0; blur = 8;
                }
            } else if (i === N - 1) {
                // Last word (Optimize): fades in from bottom, then stays fully visible
                if (progress < center - halfZone) {
                    opacity = 0; blur = 8;
                } else if (progress < center - trans) {
                    const t = (progress - (center - halfZone)) / (halfZone - trans);
                    opacity = t; blur = 8 * (1 - t);
                } else {
                    // Holds at full visibility — no fade-out (section unpins naturally)
                    opacity = 1; blur = 0;
                }
            } else {
                // Middle words: fade in → hold → fade out
                if (progress < center - halfZone) {
                    opacity = 0; blur = 8;
                } else if (progress < center - trans) {
                    const t = (progress - (center - halfZone)) / (halfZone - trans);
                    opacity = t; blur = 8 * (1 - t);
                } else if (progress < center + trans) {
                    opacity = 1; blur = 0;
                } else if (progress < center + halfZone) {
                    const t = (progress - (center + trans)) / (halfZone - trans);
                    opacity = 1 - t; blur = 8 * t;
                } else {
                    opacity = 0; blur = 8;
                }
            }

            gsap.set(word, { opacity, filter: `blur(${blur}px)`, immediateRender: true });
        });
    }

    const triggerEl = document.getElementById('sticky-sequence-trigger');
    const desktopWrapper = document.getElementById('sequence-text-wrapper');

    ScrollTrigger.create({
        trigger: triggerEl || pinPanel,
        start: "top top",
        end: "bottom top",
        pin: pinPanel,
        pinSpacing: false,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
            // Map all word animations to the first 80% of scroll.
            // The last 20% (~120vh) is a hold where Optimize stays visible
            // before the section unpins and Happy Spotlights appears.
            const wordProg = Math.min(self.progress / 0.80, 1.0);

            // Desktop: slide wrapper UP through the mask
            if (desktopWrapper && desktopWords.length) {
                const itemH = desktopWords[0].offsetHeight;
                gsap.set(desktopWrapper, {
                    y: -wordProg * (desktopWords.length - 1) * itemH,
                    immediateRender: true
                });
            }
            animateWordSet(desktopWords, wordProg);

            // Mobile: absolutely-positioned words, opacity/blur only
            animateWordSet(mobileWords, wordProg);
        }
    });

    // Dark section — tied to the full pinned scroll range
    const darkSection = document.getElementById("dark-section");
    const nav = document.getElementById("main-nav");
    const logo = document.getElementById("main-logo");

    if (darkSection && nav) {
        ScrollTrigger.create({
            trigger: darkSection,
            start: "top top",
            end: "bottom top",
            onEnter: () => {
                darkSection.classList.add("dark-active");
                nav.classList.add("nav-dark-glass");
                logo?.classList.add("logo-invert");
            },
            onLeave: () => {
                darkSection.classList.remove("dark-active");
                nav.classList.remove("nav-dark-glass");
                logo?.classList.remove("logo-invert");
            },
            onEnterBack: () => {
                darkSection.classList.add("dark-active");
                nav.classList.add("nav-dark-glass");
                logo?.classList.add("logo-invert");
            },
            onLeaveBack: () => {
                darkSection.classList.remove("dark-active");
                nav.classList.remove("nav-dark-glass");
                logo?.classList.remove("logo-invert");
            }
        });
    }
});

/* =========================================================
       🎞 HERO SWIPER (Safe Init)
    ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof Swiper === "undefined") return;

    const swiperEl = document.querySelector(".heroSwiper");
    if (!swiperEl) return;

    new Swiper(swiperEl, {
        loop: true,
        speed: 1000,
        effect: "fade",
        fadeEffect: { crossFade: true },

        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
});

/* =========================================================
   🧈 LENIS SMOOTH SCROLL + GSAP INTEGRATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,           // Scroll duration (higher = smoother)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easeOut
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,    // Slightly slower wheel = more premium
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Connect Lenis scroll to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis animation frame
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Store globally so other scripts can access
    window.__lenis = lenis;
});

/* =========================================================
   ✨ SCROLL-TRIGGERED REVEAL ANIMATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Value Proposition ---
    const valueProp = document.querySelector('[data-purpose="value-prop"]');
    if (valueProp) {
        valueProp.classList.add('reveal-up');
        ScrollTrigger.create({
            trigger: valueProp,
            start: 'top 85%',
            onEnter: () => valueProp.classList.add('revealed'),
        });
    }

    // --- Showreel ---
    const showreel = document.querySelector('[data-purpose="showreel"]');
    if (showreel) {
        showreel.classList.add('reveal-scale');
        ScrollTrigger.create({
            trigger: showreel,
            start: 'top 80%',
            onEnter: () => showreel.classList.add('revealed'),
        });
    }

    // --- Core Framework cards (staggered) ---
    const coreCards = document.querySelector('[data-purpose="value-prop"]')?.nextElementSibling;
    const coreGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-3');
    if (coreGrid) {
        coreGrid.classList.add('reveal-stagger');
        ScrollTrigger.create({
            trigger: coreGrid,
            start: 'top 80%',
            onEnter: () => coreGrid.classList.add('revealed'),
        });
    }

    // --- Happy Spotlights cards (staggered) ---
    const spotlightGrid = document.querySelector('#happy-spotlights .grid');
    if (spotlightGrid) {
        spotlightGrid.classList.add('reveal-stagger');
        ScrollTrigger.create({
            trigger: spotlightGrid,
            start: 'top 80%',
            onEnter: () => spotlightGrid.classList.add('revealed'),
        });
    }

    // --- Blogs section ---
    const blogsSection = document.querySelector('[data-purpose="blogs-insights"]');
    if (blogsSection) {
        const blogGrid = blogsSection.querySelector('.grid');
        if (blogGrid) {
            blogGrid.classList.add('reveal-stagger');
            ScrollTrigger.create({
                trigger: blogGrid,
                start: 'top 80%',
                onEnter: () => blogGrid.classList.add('revealed'),
            });
        }
    }

    // --- CTA Banner ---
    const ctaBanner = document.querySelector('[data-purpose="cta-banner"]');
    if (ctaBanner) {
        ctaBanner.classList.add('reveal-up');
        ScrollTrigger.create({
            trigger: ctaBanner,
            start: 'top 85%',
            onEnter: () => ctaBanner.classList.add('revealed'),
        });
    }

    // --- Footer ---
    const footer = document.querySelector('[data-purpose="footer"]');
    if (footer) {
        footer.classList.add('reveal-fade');
        ScrollTrigger.create({
            trigger: footer,
            start: 'top 90%',
            onEnter: () => footer.classList.add('revealed'),
        });
    }

    // --- Section titles reveal ---
    document.querySelectorAll('section h3').forEach(title => {
        title.classList.add('reveal-up');
        ScrollTrigger.create({
            trigger: title,
            start: 'top 88%',
            onEnter: () => title.classList.add('revealed'),
        });
    });
});

/* =========================================================
   📱 MOBILE MENU TOGGLE (mobile-only, Wolff Olins card style)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const btn       = document.getElementById("mobile-menu-btn");
    const menu      = document.getElementById("mobile-menu");
    const backdrop  = document.getElementById("mobile-backdrop");
    const nav       = document.getElementById("main-nav");
    const iconHam   = document.getElementById("icon-hamburger");
    const iconClose = document.getElementById("icon-close");
    const navLinks  = document.querySelectorAll(".mobile-nav-link");

    if (!btn || !menu) return;

    let isOpen = false;

    function openMenu() {
        isOpen = true;
        menu.classList.add("is-open");
        backdrop?.classList.add("is-open");
        nav?.classList.add("menu-open");
        iconHam.style.display   = "none";
        iconClose.style.display = "block";
        document.body.style.overflow = "hidden";
        if (window.__lenis) window.__lenis.stop();
        navLinks.forEach((link, i) => {
            setTimeout(() => link.classList.add("link-visible"), 220 + i * 80);
        });
    }

    function closeMenu() {
        isOpen = false;
        menu.classList.remove("is-open");
        backdrop?.classList.remove("is-open");
        nav?.classList.remove("menu-open");
        iconHam.style.display   = "block";
        iconClose.style.display = "none";
        document.body.style.overflow = "";
        if (window.__lenis) window.__lenis.start();
        navLinks.forEach(link => link.classList.remove("link-visible"));
    }

    btn.addEventListener("click", () => isOpen ? closeMenu() : openMenu());
    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    backdrop?.addEventListener("click", closeMenu);
});

/* =========================================================
   🎬 SHOWREEL — smooth cursor-follow image (always visible)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector('[data-purpose="showreel"]');
    const cursor  = document.getElementById("showreel-cursor");
    if (!section || !cursor) return;

    // Target = mouse offset from centre; returns to 0,0 when not hovering
    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let isHovering = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        // When not hovering, lerp back to centre (0,0)
        const tx = isHovering ? mx : 0;
        const ty = isHovering ? my : 0;
        cx = lerp(cx, tx, 0.09);
        cy = lerp(cy, ty, 0.09);
        // CSS sets top:50% left:50%, JS offsets from there
        cursor.style.transform = `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;
        requestAnimationFrame(tick);
    }

    section.addEventListener("mouseenter", () => { isHovering = true; });
    section.addEventListener("mouseleave", () => { isHovering = false; });

    section.addEventListener("mousemove", (e) => {
        const rect = section.getBoundingClientRect();
        mx = e.clientX - rect.left - rect.width  / 2;
        my = e.clientY - rect.top  - rect.height / 2;
    });

    // Start the animation loop once
    tick();
});
