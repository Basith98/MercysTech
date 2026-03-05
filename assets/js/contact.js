
/* =========================================================
   🚀 NAVBAR SCROLL LOGIC
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 80) {
            nav.classList.add("nav-scrolled");
        } else {
            nav.classList.remove("nav-scrolled");
        }
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
});

/* =========================================================
   🧈 LENIS SMOOTH SCROLL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
});

/* =========================================================
   ✨ SCROLL-TRIGGERED REVEAL ANIMATIONS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Trigger all .reveal-up elements
    document.querySelectorAll(".reveal-up").forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            onEnter: () => el.classList.add("revealed"),
        });
    });

    // Trigger all .reveal-stagger elements
    document.querySelectorAll(".reveal-stagger").forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 82%",
            onEnter: () => el.classList.add("revealed"),
        });
    });

    // Trigger hero immediately
    setTimeout(() => {
        document.querySelectorAll(".contact-hero .reveal-up").forEach(el => el.classList.add("revealed"));
    }, 120);
});

/* =========================================================
   🎛 ENQUIRY TABS
========================================================= */
function selectTab(btn) {
    document.querySelectorAll(".enquiry-tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
}

/* =========================================================
   💰 BUDGET CHIPS
========================================================= */
function selectBudget(btn) {
    document.querySelectorAll(".budget-chip").forEach(c => c.classList.remove("selected"));
    btn.classList.add("selected");
}
