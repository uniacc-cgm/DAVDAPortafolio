window.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. SMOOTH SCROLL (LENIS)
    // =========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);
    gsap.registerPlugin(ScrollTrigger);

    // =========================================================================
    // 2. BOTÓN VOLVER ARRIBA Y NAVBAR SHRINK
    // =========================================================================
    const backToTop = document.getElementById('backToTop');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            if(navbar) navbar.classList.add('scrolled');
        } else {
            if(navbar) navbar.classList.remove('scrolled');
        }

        if (backToTop) {
            if (window.scrollY > window.innerHeight) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    }

    // =========================================================================
    // 3. CURSOR PERSONALIZADO SEGURO
    // =========================================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, .slider-btn, .tab-btn');

    if (cursorDot && cursorOutline && window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
            gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            target.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    // =========================================================================
    // 4. ANIMACIÓN DEL PRELOADER
    // =========================================================================
    const preloader = document.querySelector('.preloader');
    const counter = document.querySelector('.preloader-counter');
    let count = { val: 0 };

    if (preloader) {
        gsap.to('.preloader-logo', { opacity: 1, duration: 1, ease: "power2.out" });
        gsap.to('.preloader-counter', { opacity: 1, duration: 0.5 });
        
        gsap.to(count, {
            val: 100,
            duration: 2.5,
            ease: "power3.inOut",
            onUpdate: function() {
                if(counter) counter.innerHTML = Math.round(count.val) + "%";
            },
            onComplete: function() {
                gsap.to('.preloader', {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut",
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initHeroAnimations();
                    }
                });
            }
        });
    } else {
        initHeroAnimations();
    }

    // =========================================================================
    // 5. ANIMACIÓN DE ENTRADA HERO Y PARALLAX
    // =========================================================================
    function initHeroAnimations() {
        gsap.to(".progress-bar", {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 }
        });

        gsap.to('.hero-bg-parallax', {
            yPercent: 30, xPercent: 10, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });

        gsap.to('.hero-floating-img', {
            yPercent: 40, rotation: 5, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });

        if (window.innerWidth > 1024) {
            window.addEventListener('mousemove', (e) => {
                const floatImg = document.querySelector('.hero-floating-img');
                if(floatImg) {
                    const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
                    const moveY = (e.clientY - window.innerHeight / 2) * 0.05;
                    gsap.to(floatImg, { x: moveX, y: moveY, duration: 1.5, ease: "power2.out" });
                }
            });
        }

        const tlHero = gsap.timeline({ defaults: { ease: "power4.out" } });

        tlHero.fromTo(".hero-top-meta .hero-anim-meta", 
                { autoAlpha: 0, y: 20 }, 
                { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 })
            .fromTo(".hero-title .line-inner", 
                { autoAlpha: 0, y: 80 }, 
                { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.2 }, "-=0.6")
            .fromTo(".hero-desc, .hero-cta-group", 
                { autoAlpha: 0, y: 30 }, 
                { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.2 }, "-=0.8")
            .fromTo(".hero-floating-img",
                { autoAlpha: 0, y: 100, scale: 0.9 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }, "-=1.2");
    }

    // =========================================================================
    // 6. MARQUESINA DINÁMICA
    // =========================================================================
    const marqueeInner = document.querySelector('.marquee-inner');
    if (marqueeInner) {
        let marqueeTween = gsap.to(marqueeInner, {
            xPercent: -50,
            repeat: -1,
            duration: 10,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                let velocity = self.getVelocity();
                let speed = 1 + Math.abs(velocity / 800); 
                gsap.to(marqueeTween, { timeScale: self.direction * speed, duration: 0.2, overwrite: true });
                gsap.to(marqueeTween, { timeScale: self.direction, duration: 1, delay: 0.1, overwrite: "auto" });
            }
        });
    }

    // =========================================================================
    // 7. ANIMACIÓN PARA LAS TARJETAS (CARD REVEAL)
    // =========================================================================
    gsap.utils.toArray('.card-reveal').forEach((card) => {
        gsap.fromTo(card, 
            { autoAlpha: 0, y: 150 }, 
            {
                autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" }
            }
        );
    });

    // =========================================================================
    // 8. VIDEO REVEAL EN HOVER
    // =========================================================================
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const video = card.querySelector('.hover-video');
        if(video) {
            card.addEventListener('mouseenter', () => video.play());
            card.addEventListener('mouseleave', () => video.pause());
        }
    });

    // =========================================================================
    // 9. MODAL DETALLE PROYECTO
    // =========================================================================
    const modal = document.querySelector('.project-modal');
    const panelOverlay = document.querySelector('.project-modal-overlay');
    const closeBtn = document.querySelector('.close-panel');
    const modalBodyWrapper = document.querySelector('.modal-body');
    const modalScrollIndicator = document.querySelector('.modal-scroll-indicator');

    const pTitle = document.querySelector('.panel-title');
    const pBadge = document.querySelector('.panel-badge');
    const pChallenge = document.querySelector('.panel-challenge');
    const pSolution = document.querySelector('.panel-solution');
    const pImpact = document.querySelector('.panel-impact');
    const pImg = document.querySelector('.panel-img');

    if (modal) gsap.set(modal, { xPercent: -50, yPercent: -45 }); 

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            pTitle.textContent = card.dataset.title;
            pBadge.textContent = card.dataset.badge;
            pChallenge.textContent = card.dataset.challenge;
            pSolution.textContent = card.dataset.solution;
            pImpact.textContent = card.dataset.impact;
            pImg.src = card.dataset.img;

            if(modalBodyWrapper) modalBodyWrapper.scrollTop = 0; 
            if(modalScrollIndicator) modalScrollIndicator.style.width = '0%';
            
            lenis.stop();

            gsap.to(panelOverlay, { autoAlpha: 1, duration: 0.4, pointerEvents: "auto" });
            gsap.to(modal, { autoAlpha: 1, yPercent: -50, duration: 0.5, ease: "power3.out", pointerEvents: "auto" });
        });
    });

    function closeModal() {
        gsap.to(modal, { autoAlpha: 0, yPercent: -45, duration: 0.4, ease: "power3.in", pointerEvents: "none" });
        gsap.to(panelOverlay, { autoAlpha: 0, duration: 0.4, pointerEvents: "none", onComplete: () => lenis.start() });
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(panelOverlay) panelOverlay.addEventListener('click', closeModal);

    if(modalBodyWrapper && modalScrollIndicator) {
        modalBodyWrapper.addEventListener('scroll', () => {
            const scrollable = modalBodyWrapper.scrollHeight - modalBodyWrapper.clientHeight;
            const scrolled = (modalBodyWrapper.scrollTop / scrollable) * 100;
            modalScrollIndicator.style.width = `${scrolled}%`;
        });
    }

    // =========================================================================
    // 10. LÓGICA DE PESTAÑAS (TABS INTERACTIVAS)
    // =========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);

            if (!targetPane || button.classList.contains('active')) return;

            // Reset de botones
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // Transición suave entre paneles con GSAP
            tabPanes.forEach(pane => {
                if (pane.classList.contains('active')) {
                    gsap.to(pane, {
                        opacity: 0,
                        y: 10,
                        duration: 0.25,
                        ease: "power2.in",
                        onComplete: () => {
                            pane.classList.remove('active');
                            pane.style.display = 'none';

                            // Activación del nuevo panel
                            targetPane.style.display = 'block';
                            targetPane.classList.add('active');
                            gsap.fromTo(targetPane, 
                                { opacity: 0, y: 15 },
                                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                            );
                        }
                    });
                }
            });
        });
    });

    // =========================================================================
    // 11. METODOLOGÍA (SCROLL HORIZONTAL Y PANEADO DE IMAGEN BG)
    // =========================================================================
    const methodTrack = document.querySelector('.methodology-track');
    
    if(methodTrack && window.innerWidth > 1024) {
        const steps = gsap.utils.toArray('.methodology-step');
        
        gsap.to(steps, {
            xPercent: -100 * (steps.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".methodology-section",
                pin: true,
                scrub: 1,
                snap: 1 / (steps.length - 1),
                end: () => "+=" + methodTrack.offsetWidth
            }
        });

        const methodBg = document.querySelector('.methodology-bg-img');
        if(methodBg) {
            gsap.to(methodBg, {
                xPercent: -20, 
                ease: "none",
                scrollTrigger: {
                    trigger: ".methodology-section",
                    start: "top top",
                    end: () => "+=" + methodTrack.offsetWidth,
                    scrub: 1
                }
            });
        }
    }

    // =========================================================================
    // 12. CONTROLES DEL CARRUSEL DE TESTIMONIOS
    // =========================================================================
    const nextTestBtn = document.querySelector('.next-btn');
    const prevTestBtn = document.querySelector('.prev-btn');
    const testSlider = document.querySelector('.testimonials-slider');

    function scrollTestimonials(direction) {
        if (!testSlider) return;
        const cardWidth = testSlider.querySelector('.testimonial-card').offsetWidth;
        testSlider.scrollBy({ left: direction * (cardWidth + 32), behavior: 'smooth' });
    }

    if(nextTestBtn && prevTestBtn && testSlider) {
        nextTestBtn.addEventListener('click', () => scrollTestimonials(1));
        prevTestBtn.addEventListener('click', () => scrollTestimonials(-1));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); }
        if (e.key === 'ArrowRight') { scrollTestimonials(1); } 
        else if (e.key === 'ArrowLeft') { scrollTestimonials(-1); }
    });

    // =========================================================================
    // 13. ANIMACIÓN DE CASCADA PARA LOS SERVICIOS
    // =========================================================================
    gsap.fromTo('.service-card', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: '.services-grid', start: "top 80%", toggleActions: "play none none reverse" } }
    );

    // =========================================================================
    // 14. CONTADOR DINÁMICO PARA LAS MÉTRICAS
    // =========================================================================
    gsap.utils.toArray('.metric-number').forEach((elem) => {
        let target = parseInt(elem.getAttribute('data-target'));
        gsap.fromTo(elem, 
            { textContent: 0 }, 
            {
                textContent: target, duration: 2.5, ease: "power3.out", snap: { textContent: 1 }, 
                scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" }
            }
        );
    });

    // =========================================================================
    // 15. EFECTO DESVANECIMIENTO ESTÁNDAR (FADE-UP)
    // =========================================================================
    gsap.utils.toArray('.fade-up').forEach((elem) => {
        gsap.fromTo(elem, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" } }
        );
    });

    // =========================================================================
    // 16. PARALLAX DE IMÁGENES DENTRO DE TARJETAS
    // =========================================================================
    gsap.utils.toArray('.media-parallax').forEach((media) => {
        gsap.fromTo(media, { yPercent: -15 }, { yPercent: 15, ease: "none", scrollTrigger: { trigger: media.closest('.media-container'), start: "top bottom", end: "bottom top", scrub: true } });
    });

    // =========================================================================
    // 17. SCROLL SUAVE A ENLACES INTERNOS
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#' && !this.classList.contains('project-card')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) { lenis.scrollTo(targetElement, { offset: -90, duration: 1.5 }); }
            }
        });
    });
});