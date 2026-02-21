/* ═══════════════════════════════════════════════
   OBRA CORP — Main JavaScript
   Navigation, animations, formulaire
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── Header Scroll Effect ─────────────── */
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ─── Mobile Menu ──────────────────────── */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ─── Active Nav Link on Scroll ────────── */
    const sections = document.querySelectorAll('section[id]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ─── Fade In on Scroll ────────────────── */
    const fadeElements = document.querySelectorAll(
        '.service-card, .stat, .projet-card, .apropos__text, .contact__form, .contact__info'
    );

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    /* ─── Counter Animation ────────────────── */
    const counters = document.querySelectorAll('.stat__number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ─── Contact Form ─────────────────────── */
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateField = (field) => {
        const group = field.closest('.form-group');
        if (!group) return true;

        let isValid = true;

        if (field.required) {
            if (field.type === 'email') {
                isValid = validateEmail(field.value);
            } else if (field.tagName === 'SELECT') {
                isValid = field.value !== '';
            } else {
                isValid = field.value.trim() !== '';
            }
        }

        group.classList.toggle('error', !isValid);
        return isValid;
    };

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            const group = field.closest('.form-group');
            if (group && group.classList.contains('error')) {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fields = form.querySelectorAll('[required]');
        let allValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        if (allValid) {
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Envoi en cours...';

            setTimeout(() => {
                form.reset();
                successMsg.classList.add('visible');
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Envoyer ma demande';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('visible');
                }, 5000);
            }, 1200);
        }
    });

});
