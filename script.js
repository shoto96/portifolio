/* ============================================================
   Portfólio — Scripts & Interatividade
   ============================================================ */

(function () {
    'use strict';

    /* ─────────────── UTILS ─────────────── */
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

    /* ─────────────── PRELOADER ─────────────── */
    const preloader = $('#preloader');
    if (preloader) {
        window.addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 2200));
    }

    /* ─────────────── LIVE CLOCK & DATE (Minimalist) ─────────────── */
    function initLiveClock() {
        const clockEl = $('#liveClock');
        const dateEl = $('#liveDate');
        if (!clockEl && !dateEl) return;

        const fmt = (n) => String(n).padStart(2, '0');
        function tick() {
            const now = new Date();
            const h = fmt(now.getHours());
            const m = fmt(now.getMinutes());
            const s = fmt(now.getSeconds());
            const timeHTML = `${h}<span class="clock-sep">:</span>${m}<span class="clock-sep">:</span>${s}`;
            const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            if (clockEl) clockEl.innerHTML = timeHTML;
            if (dateEl) dateEl.textContent = dateStr;
        }
        tick();
        setInterval(tick, 1000);
    }
    initLiveClock();

    /* ─────────────── CUSTOM CURSOR ─────────────── */
    const cursor = $('#cursor');
    const cursorDot = $('#cursor-dot');
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        $$('a, button, .gallery-card, .skill-card, .service-card, .tech-item, .contact-link, .filter-btn, .social-card, .project-intro-card')
            .forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            });
    }

    /* ─────────────── SCROLL PROGRESS BAR ─────────────── */
    const scrollProgress = $('#scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
        });
    }

    /* ─────────────── NAVBAR SCROLL EFFECT ─────────────── */
    const navbar = $('#navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ─────────────── HERO PARTICLES CANVAS ─────────────── */
    const heroCanvas = $('#heroCanvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 45;
        const CONNECTION_DISTANCE = 120;
        const MAX_CONNECTIONS = 3;

        function resizeCanvas() {
            heroCanvas.width = window.innerWidth;
            heroCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * heroCanvas.width;
                this.y = Math.random() * heroCanvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        let mouseParticleX = null, mouseParticleY = null;
        heroCanvas.addEventListener('mousemove', (e) => {
            const rect = heroCanvas.getBoundingClientRect();
            mouseParticleX = e.clientX - rect.left;
            mouseParticleY = e.clientY - rect.top;
        });
        heroCanvas.addEventListener('mouseleave', () => { mouseParticleX = null; mouseParticleY = null; });

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                let connections = 0;
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DISTANCE && connections < MAX_CONNECTIONS) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / CONNECTION_DISTANCE)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        connections++;
                    }
                }
                if (mouseParticleX !== null && mouseParticleY !== null) {
                    const dx = particles[i].x - mouseParticleX;
                    const dy = particles[i].y - mouseParticleY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseParticleX, mouseParticleY);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - dist / 200)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        let frameCount = 0;
        function animateHero() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            if (frameCount % 2 === 0) drawConnections();
            frameCount++;
            requestAnimationFrame(animateHero);
        }
        animateHero();
    }

    /* ─────────────── TYPEWRITER EFFECT ─────────────── */
    const typewriterEl = $('#typewriter');
    const typingRoleEl = $('#typingRole');
    const fullName = 'Jean Vieira';
    const roles = ['Analista de Sistemas', 'Desenvolvedor Back-End', 'Especialista em APIs REST'];
    let nameIndex = 0, nameDeleting = false;
    let roleIndex = 0, roleCharIndex = 0, roleDeleting = false;

    function typeName() {
        if (!typewriterEl) return;
        const speed = nameDeleting ? 50 : 120;
        if (!nameDeleting) {
            typewriterEl.textContent = fullName.slice(0, nameIndex + 1);
            nameIndex++;
            if (nameIndex === fullName.length) { nameDeleting = true; setTimeout(typeName, 2000); return; }
        } else {
            typewriterEl.textContent = fullName.slice(0, nameIndex - 1);
            nameIndex--;
            if (nameIndex === 0) nameDeleting = false;
        }
        setTimeout(typeName, speed);
    }
    typeName();

    function typeRole() {
        if (!typingRoleEl) return;
        const currentRole = roles[roleIndex];
        const speed = roleDeleting ? 40 : 80;
        if (!roleDeleting) {
            typingRoleEl.textContent = currentRole.slice(0, roleCharIndex + 1);
            roleCharIndex++;
            if (roleCharIndex === currentRole.length) { roleDeleting = true; setTimeout(typeRole, 2000); return; }
        } else {
            typingRoleEl.textContent = currentRole.slice(0, roleCharIndex - 1);
            roleCharIndex--;
            if (roleCharIndex === 0) { roleDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
        }
        setTimeout(typeRole, speed);
    }
    typeRole();

    /* ─────────────── REVEAL ON SCROLL ─────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.dataset.delay) {
                    entry.target.style.transitionDelay = entry.target.dataset.delay + 'ms';
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));

    /* ─────────────── SECTION TRANSITIONS ─────────────── */
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

    $$('.section').forEach(el => sectionObserver.observe(el));

    /* ─────────────── HERO PARALLAX FADE ─────────────── */
    const hero = $('.hero-section');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;
                hero.style.opacity = 1 - (progress * 0.7);
                hero.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ─────────────── ANIMATED COUNTERS ─────────────── */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    entry.target.textContent = Math.floor(start + (target - start) * eased);
                    if (progress < 1) requestAnimationFrame(updateCounter);
                }
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    $$('.stat-number').forEach(el => counterObserver.observe(el));

    /* ─────────────── ABOUT STATS COUNTER ANIMATION ─────────────── */
    const aboutStatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                const duration = 1800;
                const start = 0;
                const startTime = performance.now();
                function updateAboutStat(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    entry.target.textContent = Math.floor(start + (target - start) * eased);
                    if (progress < 1) requestAnimationFrame(updateAboutStat);
                }
                requestAnimationFrame(updateAboutStat);
                aboutStatObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    $$('.about-stat-value').forEach(el => aboutStatObserver.observe(el));

    /* ─────────────── SKILL BARS ANIMATION ─────────────── */
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.skill-progress');
                if (progress && progress.dataset.width) {
                    setTimeout(() => { progress.style.width = progress.dataset.width + '%'; }, 300);
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    $$('.skill-card').forEach(el => skillObserver.observe(el));

    /* ─────────────── GALLERY FILTER ─────────────── */
    const filterBtns = $$('.filter-btn');
    const galleryItems = $$('.gallery-item');

    function updateFilterCounts() {
        filterBtns.forEach(btn => {
            const filter = btn.dataset.filter;
            let count = 0;
            if (filter === 'all') {
                count = galleryItems.length;
            } else {
                count = galleryItems.filter(item => item.dataset.category === filter).length;
            }
            let badge = btn.querySelector('.filter-count');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'filter-count';
                btn.appendChild(badge);
            }
            badge.textContent = count;
        });
    }
    updateFilterCounts();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));

            galleryItems.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ─────────────── LIGHTBOX ─────────────── */
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCaption = $('#lightboxCaption');
    let currentLightboxIndex = 0;
    const lightboxItems = [];

    function openLightbox(index) {
        lightboxItems.length = 0;
        $$('.gallery-item:not(.hidden)').forEach(item => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption p')?.textContent || '';
            if (img) lightboxItems.push({ src: img.src, alt: img.alt, caption });
        });
        currentLightboxIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
        if (lightboxItems[currentLightboxIndex]) {
            lightboxImg.src = lightboxItems[currentLightboxIndex].src;
            lightboxImg.alt = lightboxItems[currentLightboxIndex].alt;
            lightboxCaption.textContent = lightboxItems[currentLightboxIndex].caption;
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextLightbox() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
        updateLightbox();
    }

    function prevLightbox() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
        updateLightbox();
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    $('.lightbox-close')?.addEventListener('click', closeLightbox);
    $('.lightbox-next')?.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });
    $('.lightbox-prev')?.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
    $('.lightbox-overlay')?.addEventListener('click', closeLightbox);

    /* ─────────────── CONTACT FORM ─────────────── */
    const contactForm = $('#contactForm');
    const alertResponse = $('#alertResponse');
    const btnSubmit = $('#btnSubmit');
    const btnText = $('#btnText');
    const btnSpinner = $('#btnSpinner');
    const API_URL = 'http://localhost:5000/api/contato';

    function showToast(message, type = 'success') {
        const container = $('#toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}-fill toast-icon"></i><span class="toast-message">${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('in'));
        setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = $('#name').value.trim();
            const email = $('#email').value.trim();
            const message = $('#message').value.trim();

            if (!name || !email || !message) {
                showToast('Preencha todos os campos.', 'error');
                return;
            }

            btnSubmit.disabled = true;
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
            alertResponse.classList.add('d-none');

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    alertResponse.className = 'form-alert success';
                    alertResponse.textContent = 'Mensagem enviada com sucesso!';
                    contactForm.reset();
                    showToast('Mensagem enviada com sucesso! 🚀');
                } else {
                    throw new Error(data.message || 'Erro ao enviar mensagem.');
                }
            } catch (error) {
                alertResponse.className = 'form-alert error';
                alertResponse.textContent = 'Ops! Não foi possível enviar via API agora. Tente e-mail direto.';
                showToast('Erro ao enviar. Tente e-mail direto.', 'error');
            } finally {
                btnSubmit.disabled = false;
                btnText.classList.remove('d-none');
                btnSpinner.classList.add('d-none');
                alertResponse.classList.remove('d-none');
            }
        });
    }

    /* ─────────────── SMOOTH SCROLL ─────────────── */
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navbar) {
                    const toggler = navbar.querySelector('.navbar-collapse');
                    if (toggler && toggler.classList.contains('show')) toggler.classList.remove('show');
                }
            }
        });
    });

    /* ─────────────── ACTIVE NAV LINK ON SCROLL ─────────────── */
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    });

    /* ─────────────── PARALLAX EFFECT ON HERO ─────────────── */
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = $('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });

    /* ─────────────── GLITCH EFFECT ON HERO NAME ─────────────── */
    const heroName = $('.hero-name');
    if (heroName) {
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        let glitchInterval;
        function glitchText() {
            const original = 'Jean Vieira';
            let iterations = 0;
            clearInterval(glitchInterval);
            glitchInterval = setInterval(() => {
                heroName.textContent = original.split('').map((char, idx) => {
                    if (idx < iterations) return original[idx];
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }).join('');
                if (iterations >= original.length) clearInterval(glitchInterval);
                iterations += 1 / 3;
            }, 30);
        }
        setInterval(glitchText, 8000);
        setTimeout(glitchText, 3000);
    }

    /* ─────────────── SOCIAL API INTEGRATION ─────────────── */
    function animateCounter(el, start, end, duration) {
        if (!el) return;
        const range = end - start;
        const startTime = performance.now();
        el.classList.add('animated');
        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(start + range * easeOut);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = end;
        }
        requestAnimationFrame(step);
        setTimeout(() => el.classList.remove('animated'), duration + 200);
    }

    /* Cache simples em sessionStorage */
    const apiCache = {
        get: (key) => { try { const d = sessionStorage.getItem(key); return d ? JSON.parse(d) : null; } catch(e){ return null; } },
        set: (key, val, ttl = 300000) => { try { sessionStorage.setItem(key, JSON.stringify({ data: val, expiry: Date.now() + ttl })); } catch(e){} },
        isValid: (key) => { const d = apiCache.get(key); return d && d.expiry > Date.now(); }
    };

    /* Retry com backoff exponencial */
    async function fetchWithRetry(url, opts = {}, maxRetries = 2) {
        for (let i = 0; i <= maxRetries; i++) {
            try {
                const res = await fetch(url, opts);
                if (res.ok) return res;
                if (res.status === 403 || res.status === 429) throw new Error('Rate limited');
            } catch (err) {
                if (i === maxRetries) throw err;
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
            }
        }
        throw new Error('Max retries reached');
    }

    /* Skeleton para grids de repos */
    function showRepoSkeleton(gridId, count = 6) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        const skel = Array.from({ length: count }, () =>
            `<div class="github-repo" style="pointer-events:none;opacity:0.7;"><div class="repo-name"><span class="skeleton skeleton-text short" style="width:40%;"></span></div><div class="repo-desc"><span class="skeleton skeleton-text"></span><span class="skeleton skeleton-text medium"></span></div><div class="repo-meta"><span class="skeleton skeleton-text" style="width:60px;"></span><span class="skeleton skeleton-text" style="width:60px;"></span></div></div>`
        ).join('');
        grid.innerHTML = skel;
    }

    async function fetchGitHubData() {
        const username = 'shoto96';
        const cacheKey = 'gh_' + username;

        /* Mostra skeleton */
        showRepoSkeleton('githubReposGrid', 6);

        /* Tenta cache primeiro */
        if (apiCache.isValid(cacheKey)) {
            const cached = apiCache.get(cacheKey).data;
            updateGitHubStats(cached.user);
            renderGitHubRepos(cached.repos);
            updateApiStatus('githubApiStatus', true);
            return;
        }

        try {
            const [userRes, reposRes] = await Promise.all([
                fetchWithRetry(`https://api.github.com/users/${username}`),
                fetchWithRetry(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
            ]);

            const userData = await userRes.json();
            const repos = await reposRes.json();

            heroStatsData.githubRepos = userData.public_repos || repos.length || 0;
            collectLanguagesFromRepos(repos);
            updateGitHubStats(userData);
            renderGitHubRepos(repos);
            updateHeroStats();
            updateApiStatus('githubApiStatus', true);
            apiCache.set(cacheKey, { user: userData, repos });
        } catch (err) {
            console.warn('GitHub API Error:', err);
            updateApiStatus('githubApiStatus', false);
            const reposEl = $('[data-api="github-repos"]');
            const followersEl = $('[data-api="github-followers"]');
            if (reposEl) { reposEl.textContent = '10+'; reposEl.classList.add('animated'); setTimeout(() => reposEl.classList.remove('animated'), 1200); }
            if (followersEl) { followersEl.textContent = '5+'; followersEl.classList.add('animated'); setTimeout(() => followersEl.classList.remove('animated'), 1200); }
            const grid = $('#githubReposGrid');
            if (grid) grid.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:2rem;"><i class="bi bi-wifi-off" style="margin-right:0.4rem;"></i>GitHub temporariamente indisponível. Tente recarregar.</p>';
        }
    }

    function updateGitHubStats(userData) {
        const reposEl = $('[data-api="github-repos"]');
        const followersEl = $('[data-api="github-followers"]');
        const followingEl = $('[data-api="github-following"]');
        if (reposEl) animateCounter(reposEl, 0, userData.public_repos || 0, 1000);
        if (followersEl) animateCounter(followersEl, 0, userData.followers || 0, 1000);
        if (followingEl) animateCounter(followingEl, 0, userData.following || 0, 1000);
    }

    function updateApiStatus(id, online) {
        const el = document.getElementById(id);
        if (!el) return;
        if (online) {
            el.innerHTML = '<span class="api-dot"></span> API Conectada';
            el.style.color = 'var(--success)';
        } else {
            el.innerHTML = '<span class="api-dot" style="background:var(--error)"></span> API Offline';
            el.style.color = 'var(--error)';
        }
    }

    function renderGitHubRepos(repos) {
        const grid = $('#githubReposGrid');
        if (!grid) return;
        const langColors = {
            JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
            Java: '#b07219', 'C#': '#178600', 'C++': '#f34b7d', C: '#555555',
            Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
            Swift: '#ffac45', Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c',
            Vue: '#41b883', React: '#61dafb', Shell: '#89e051', Dart: '#00B4AB'
        };
        grid.innerHTML = repos.map((repo, i) => {
            const lang = repo.language || 'Outro';
            const langColor = langColors[lang] || '#888';
            const updated = new Date(repo.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
            return `<a href="${repo.html_url}" target="_blank" class="github-repo reveal-up" data-delay="${Math.min(i * 80, 400)}"><div class="repo-name"><i class="bi bi-folder-fill" style="color:var(--primary);font-size:0.85rem;"></i> ${repo.name}</div><div class="repo-desc">${repo.description || 'Sem descrição disponível.'}</div><div class="repo-meta"><span><span class="repo-lang-dot" style="background:${langColor};box-shadow:0 0 6px ${langColor};"></span> ${lang}</span><span><i class="bi bi-star-fill" style="color:var(--warning);font-size:0.7rem;"></i> ${repo.stargazers_count}</span><span><i class="bi bi-diagram-2-fill" style="color:var(--accent);font-size:0.7rem;"></i> ${repo.forks_count}</span><span><i class="bi bi-clock" style="font-size:0.7rem;"></i> ${updated}</span></div></a>`;
        }).join('');
        /* Trigger reveal observer nos novos elementos */
        requestAnimationFrame(() => {
            $$('#githubReposGrid .reveal-up').forEach(el => {
                el.classList.add('visible');
                if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
            });
        });
    }

    async function fetchGitLabData() {
        const username = 'jeanvieiradossantos2096';
        const cacheKey = 'gl_' + username;
        showRepoSkeleton('gitlabReposGrid', 6);

        if (apiCache.isValid(cacheKey)) {
            const cached = apiCache.get(cacheKey).data;
            updateGitLabStats(cached.projects, cached.user);
            renderGitLabRepos(cached.projects);
            updateApiStatus('gitlabApiStatus', true);
            return;
        }

        try {
            const userRes = await fetchWithRetry(`https://gitlab.com/api/v4/users?username=${username}`);
            const users = await userRes.json();
            let userId = null, userData = null;
            if (users.length > 0) { userId = users[0].id; userData = users[0]; }

            let projectsUrl = `https://gitlab.com/api/v4/users/${encodeURIComponent(username)}/projects?per_page=6&order_by=last_activity_at`;
            if (userId) projectsUrl = `https://gitlab.com/api/v4/users/${userId}/projects?per_page=6&order_by=last_activity_at`;
            const projRes = await fetchWithRetry(projectsUrl);
            const projects = await projRes.json();

            heroStatsData.gitlabRepos = userData ? (userData.projects_count || projects.length || 0) : (projects.length || 0);
            updateGitLabStats(projects, userData);
            renderGitLabRepos(projects);
            updateHeroStats();
            updateApiStatus('gitlabApiStatus', true);
            apiCache.set(cacheKey, { projects, user: userData });
        } catch (err) {
            console.warn('GitLab API Error:', err);
            updateApiStatus('gitlabApiStatus', false);
            const reposEl = $('[data-api="gitlab-repos"]');
            const starsEl = $('[data-api="gitlab-stars"]');
            if (reposEl) { reposEl.textContent = '5+'; reposEl.classList.add('animated'); setTimeout(() => reposEl.classList.remove('animated'), 1200); }
            if (starsEl) { starsEl.textContent = '10+'; starsEl.classList.add('animated'); setTimeout(() => starsEl.classList.remove('animated'), 1200); }
            const grid = $('#gitlabReposGrid');
            if (grid) grid.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:2rem;"><i class="bi bi-wifi-off" style="margin-right:0.4rem;"></i>GitLab temporariamente indisponível. Tente recarregar.</p>';
        }
    }

    function updateGitLabStats(projects, userData) {
        const reposEl = $('[data-api="gitlab-repos"]');
        const starsEl = $('[data-api="gitlab-stars"]');
        if (reposEl && userData) animateCounter(reposEl, 0, userData.projects_count || projects.length || 0, 1000);
        else if (reposEl) animateCounter(reposEl, 0, projects.length || 0, 1000);
        if (starsEl) animateCounter(starsEl, 0, projects.reduce((sum, p) => sum + (p.star_count || 0), 0), 1000);
    }

    /* ─────────────── HERO DYNAMIC STATS ─────────────── */
    let heroStatsData = { githubRepos: 0, gitlabRepos: 0, languages: new Set() };

    function updateHeroStats() {
        const projectsEl = $('#heroStatProjects');
        const langsEl = $('#heroStatLangs');
        const yearsEl = $('#heroStatYears');
        if (!projectsEl && !langsEl && !yearsEl) return;

        const totalProjects = heroStatsData.githubRepos + heroStatsData.gitlabRepos;
        const totalLangs = heroStatsData.languages.size;
        const yearsStudy = new Date().getFullYear() - 2017; // Started SENAI in 2017

        if (projectsEl) {
            const target = Math.max(totalProjects, parseInt(projectsEl.dataset.target) || 0);
            animateCounter(projectsEl, 0, target, 1500);
            projectsEl.dataset.target = target;
        }
        if (langsEl) {
            const target = Math.max(totalLangs, parseInt(langsEl.dataset.target) || 0);
            animateCounter(langsEl, 0, target, 1500);
            langsEl.dataset.target = target;
        }
        if (yearsEl) {
            animateCounter(yearsEl, 0, yearsStudy, 1500);
            yearsEl.dataset.target = yearsStudy;
        }
    }

    function collectLanguagesFromRepos(repos) {
        if (!repos || !Array.isArray(repos)) return;
        repos.forEach(repo => {
            if (repo.language) heroStatsData.languages.add(repo.language);
        });
    }

    function renderGitLabRepos(projects) {
        const grid = $('#gitlabReposGrid');
        if (!grid) return;
        if (!projects || projects.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:1rem;">Nenhum repositório público encontrado.</p>';
            return;
        }
        grid.innerHTML = projects.map((proj, i) => {
            const updated = new Date(proj.last_activity_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
            return `<a href="${proj.web_url}" target="_blank" class="gitlab-repo reveal-up" data-delay="${Math.min(i * 80, 400)}"><div class="repo-name"><i class="bi bi-folder-fill" style="color:#e24329;font-size:0.85rem;"></i> ${proj.name}</div><div class="repo-desc">${proj.description || 'Sem descrição disponível.'}</div><div class="repo-meta"><span><i class="bi bi-star-fill" style="color:var(--warning);font-size:0.7rem;"></i> ${proj.star_count || 0}</span><span><i class="bi bi-diagram-2-fill" style="color:var(--accent);font-size:0.7rem;"></i> ${proj.forks_count || 0}</span><span><i class="bi bi-clock" style="font-size:0.7rem;"></i> ${updated}</span></div></a>`;
        }).join('');
        requestAnimationFrame(() => {
            $$('#gitlabReposGrid .reveal-up').forEach(el => {
                el.classList.add('visible');
                if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
            });
        });
    }

    /* Inicia APIs com pequeno delay para não bloquear render */
    setTimeout(() => { fetchGitHubData(); fetchGitLabData(); }, 300);

    /* LinkedIn - valores mock com animação */
    function updateLinkedInCard() {
        const connEl = $('[data-api="linkedin-connections"]');
        const viewsEl = $('[data-api="linkedin-views"]');
        const postsEl = $('[data-api="linkedin-posts"]');
        if (connEl) animateCounter(connEl, 0, 500, 1200);
        if (viewsEl) animateCounter(viewsEl, 0, 1200, 1200);
        if (postsEl) animateCounter(postsEl, 0, 15, 800);
    }
    setTimeout(updateLinkedInCard, 600);

    /* Social cards - animação de entrada staggered */
    const socialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, idx * 100);
                socialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    $$('.social-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
        socialObserver.observe(card);
    });

    /* Animação de contagem nos social stats estáticos quando visíveis */
    const socialStatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const finalText = el.dataset.finalValue || el.textContent;
                const num = parseInt(finalText.replace(/\D/g, ''));
                if (!isNaN(num) && num > 0) {
                    animateCounter(el, 0, num, 1000);
                } else {
                    el.textContent = finalText;
                }
                socialStatObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    $$('.social-stat-value:not([data-api])').forEach(el => {
        if (!el.classList.contains('online')) {
            if (!el.dataset.finalValue) el.dataset.finalValue = el.textContent;
            el.textContent = '0';
            socialStatObserver.observe(el);
        }
    });

    /* ─────────────── TILT EFFECT ON CARDS ─────────────── */
    $$('.skill-card, .project-intro-card, .education-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* Social cards - tilt mais sutil que preserva o hover translateY */
    $$('.social-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 14;
            const rotateY = (centerX - x) / 14;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.01)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ─────────────── THEME TOGGLE ─────────────── */
    const themeToggle = $('#themeToggle');
    const themeIcon = $('#themeIcon');
    const htmlEl = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

    function setTheme(theme, save = true) {
        htmlEl.setAttribute('data-bs-theme', theme);
        if (save) localStorage.setItem('portfolio-theme', theme);
        if (themeIcon) themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        if (metaThemeColor) metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0f' : '#f5f7fa');
        if (metaColorScheme) metaColorScheme.setAttribute('content', theme === 'light' ? 'light' : 'dark');
        if (themeToggle) themeToggle.setAttribute('title', theme === 'dark' ? 'Alternar para claro' : 'Alternar para escuro');
    }

    // Detectar preferência do sistema operacional
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark.matches ? 'dark' : 'light', false);
    }

    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const current = htmlEl.getAttribute('data-bs-theme') || 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    /* ─────────────── BACK TO TOP & UTILITY BUTTONS VISIBILITY ─────────────── */
    const backToTop = $('#backToTop');
    const btnScrollProjectsEl = $('#btnScrollProjects');
    const btnPrintEl = $('#btnPrint');
    if (backToTop || btnScrollProjectsEl || btnPrintEl) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 600;
            if (backToTop) backToTop.classList.toggle('visible', show);
            if (btnScrollProjectsEl) btnScrollProjectsEl.classList.toggle('visible', show);
            if (btnPrintEl) btnPrintEl.classList.toggle('visible', show);
        });
        if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ─────────────── DYNAMIC YEAR FOOTER ─────────────── */
    const footerYear = $('#footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    /* ─────────────── CV UPLOAD / DOWNLOAD ─────────────── */
    const btnDownloadCv = $('#btnDownloadCv');
    const cvDropZone = $('#cvDropZone');
    const editCvFile = $('#editCvFile');
    const cvFileName = $('#cvFileName');
    const btnRemoveCv = $('#btnRemoveCv');
    let currentCvBase64 = localStorage.getItem('portfolio-cv-base64') || '';
    let currentCvName = localStorage.getItem('portfolio-cv-name') || '';

    function updateCvUI() {
        if (currentCvBase64 && cvFileName) {
            cvFileName.textContent = currentCvName || 'CV carregado';
            cvFileName.style.color = 'var(--primary)';
            if (btnRemoveCv) btnRemoveCv.classList.add('active');
        } else {
            if (cvFileName) { cvFileName.textContent = 'Nenhum arquivo selecionado'; cvFileName.style.color = ''; }
            if (btnRemoveCv) btnRemoveCv.classList.remove('active');
        }
    }
    updateCvUI();

    function handleCvFile(file) {
        if (!file || file.type !== 'application/pdf') { showToast('Por favor, selecione um arquivo PDF.', 'error'); return; }
        if (file.size > 5 * 1024 * 1024) { showToast('O arquivo deve ter no máximo 5MB.', 'error'); return; }
        const reader = new FileReader();
        reader.onload = (e) => { currentCvBase64 = e.target.result; currentCvName = file.name; updateCvUI(); showToast('CV carregado! Salve as alterações.', 'success'); };
        reader.readAsDataURL(file);
    }

    if (cvDropZone) {
        cvDropZone.addEventListener('click', () => editCvFile?.click());
        cvDropZone.addEventListener('dragover', (e) => { e.preventDefault(); cvDropZone.classList.add('dragover'); });
        cvDropZone.addEventListener('dragleave', () => cvDropZone.classList.remove('dragover'));
        cvDropZone.addEventListener('drop', (e) => { e.preventDefault(); cvDropZone.classList.remove('dragover'); handleCvFile(e.dataTransfer.files[0]); });
    }

    if (editCvFile) editCvFile.addEventListener('change', () => handleCvFile(editCvFile.files[0]));

    if (btnRemoveCv) {
        btnRemoveCv.addEventListener('click', (e) => {
            e.stopPropagation();
            currentCvBase64 = ''; currentCvName = '';
            if (editCvFile) editCvFile.value = '';
            updateCvUI();
            showToast('CV removido. Salve as alterações.', 'success');
        });
    }

    /* Botão CV agora é um link estático <a> no HTML.
       O upload/download via localStorage continua disponível no modo edição (Ctrl+Shift+E).
       O link estático aponta para cv.pdf como fallback padrão. */

    /* ─────────────── GALLERY ADMIN ─────────────── */
    let editMode = false;
    const btnToggleEdit = $('#btnToggleEdit');
    const btnAddPhoto = $('#btnAddPhoto');
    const projectModal = $('#projectModal');
    const editInfoModal = $('#editInfoModal');
    const galleryGrid = $('#galleryGrid');
    let editingItem = null;

    // Image upload elements
    const imageDropZone = $('#imageDropZone');
    const modalImageFile = $('#modalImageFile');
    const modalImagePreview = $('#modalImagePreview');
    const btnRemovePreview = $('#btnRemovePreview');
    const modalImageUrl = $('#modalImageUrl');
    let uploadedImageBase64 = '';

    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) { showToast('Selecione uma imagem válida (JPG, PNG, WEBP, GIF).', 'error'); return; }
        if (file.size > 5 * 1024 * 1024) { showToast('A imagem deve ter no máximo 5MB.', 'error'); return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImageBase64 = e.target.result;
            if (modalImagePreview) { modalImagePreview.src = uploadedImageBase64; modalImagePreview.classList.add('active'); }
            if (btnRemovePreview) btnRemovePreview.classList.add('active');
            if (modalImageUrl) modalImageUrl.value = '';
            showToast('Imagem carregada com sucesso!', 'success');
        };
        reader.readAsDataURL(file);
    }

    // Drag & Drop for image upload (enhanced)
    if (imageDropZone) {
        imageDropZone.addEventListener('click', (e) => { if (!e.target.closest('.btn-remove-preview')) modalImageFile?.click(); });
        imageDropZone.addEventListener('dragover', (e) => { e.preventDefault(); imageDropZone.classList.add('dragover'); });
        imageDropZone.addEventListener('dragleave', () => imageDropZone.classList.remove('dragover'));
        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('dragover');
            const dt = e.dataTransfer;
            if (dt.files && dt.files[0]) handleImageFile(dt.files[0]);
        });
        // Paste from clipboard
        imageDropZone.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleImageFile(file);
                    break;
                }
            }
        });
    }

    if (modalImageFile) modalImageFile.addEventListener('change', () => handleImageFile(modalImageFile.files[0]));

    if (btnRemovePreview) {
        btnRemovePreview.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadedImageBase64 = '';
            if (modalImagePreview) { modalImagePreview.src = ''; modalImagePreview.classList.remove('active'); }
            if (modalImageFile) modalImageFile.value = '';
            if (modalImageUrl) modalImageUrl.value = '';
            btnRemovePreview.classList.remove('active');
        });
    }

    if (modalImageUrl) {
        modalImageUrl.addEventListener('input', () => {
            if (modalImageUrl.value.trim()) {
                uploadedImageBase64 = '';
                if (modalImagePreview) { modalImagePreview.src = ''; modalImagePreview.classList.remove('active'); }
                if (btnRemovePreview) btnRemovePreview.classList.remove('active');
                if (modalImageFile) modalImageFile.value = '';
            }
        });
    }

    /* ─────────────── CLOUD UPLOAD SELECTOR ─────────────── */
    const btnDrivePicker = $('#btnDrivePicker');
    const btnOneDrivePicker = $('#btnOneDrivePicker');

    /* ── OAuth Configuration ── */
    const OAUTH_CONFIG = {
        google: {
            clientId: '', // Configure seu Client ID do Google Cloud Console
            apiKey: '',   // Configure sua API Key do Google Cloud Console
            scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        },
        onedrive: {
            clientId: '', // Configure seu Client ID do Azure App Registration
            scope: 'files.read openid profile'
        }
    };

    function convertDriveLinkToDirect(url) {
        const match = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
        const openMatch = url.match(/[?&]id=([^&]+)/);
        if (openMatch && openMatch[1]) {
            return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w1000`;
        }
        return url;
    }

    /* ── Google Drive Picker (OAuth 2.0) ── */
    let gapiLoaded = false;
    let gisLoaded = false;
    let tokenClient = null;

    function loadGoogleApis() {
        return new Promise((resolve, reject) => {
            if (window.gapi && window.google) { resolve(); return; }
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('client:picker', () => {
                    gapiLoaded = true;
                    resolve();
                });
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadGoogleIdentityServices() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.accounts) { resolve(); return; }
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => { gisLoaded = true; resolve(); };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initGooglePicker() {
        if (!OAUTH_CONFIG.google.clientId) {
            showToast('Configure o Client ID do Google no script.js (OAUTH_CONFIG.google.clientId)', 'error');
            return false;
        }
        await loadGoogleApis();
        await loadGoogleIdentityServices();
        await gapi.client.init({
            apiKey: OAUTH_CONFIG.google.apiKey,
            discoveryDocs: OAUTH_CONFIG.google.discoveryDocs
        });
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: OAUTH_CONFIG.google.clientId,
            scope: OAUTH_CONFIG.google.scope,
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    createDrivePicker(tokenResponse.access_token);
                }
            }
        });
        return true;
    }

    function createDrivePicker(accessToken) {
        const view = new google.picker.View(google.picker.ViewId.DOCS_IMAGES);
        const picker = new google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(accessToken)
            .setDeveloperKey(OAUTH_CONFIG.google.apiKey)
            .setCallback((data) => {
                if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
                    const doc = data[google.picker.Response.DOCUMENTS][0];
                    const fileId = doc[google.picker.Document.ID];
                    const directUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                    if (modalImageUrl) modalImageUrl.value = directUrl;
                    if (modalImagePreview) { modalImagePreview.src = directUrl; modalImagePreview.classList.add('active'); }
                    if (btnRemovePreview) btnRemovePreview.classList.add('active');
                    uploadedImageBase64 = '';
                    if (modalImageFile) modalImageFile.value = '';
                    showToast(`Imagem selecionada: ${doc.name}`, 'success');
                }
            })
            .build();
        picker.setVisible(true);
    }

    /* ── OneDrive File Picker (OAuth 2.0 / MSAL) ── */
    let msalInstance = null;

    function loadMsal() {
        return new Promise((resolve, reject) => {
            if (window.msal) { resolve(); return; }
            const script = document.createElement('script');
            script.src = 'https://alcdn.msauth.net/browser/2.37.0/js/msal-browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initOneDrivePicker() {
        if (!OAUTH_CONFIG.onedrive.clientId) {
            showToast('Configure o Client ID do OneDrive no script.js (OAUTH_CONFIG.onedrive.clientId)', 'error');
            return false;
        }
        await loadMsal();
        msalInstance = new msal.PublicClientApplication({
            auth: {
                clientId: OAUTH_CONFIG.onedrive.clientId,
                authority: 'https://login.microsoftonline.com/common',
                redirectUri: window.location.origin + window.location.pathname
            },
            cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false }
        });
        try {
            const response = await msalInstance.loginPopup({ scopes: OAUTH_CONFIG.onedrive.scope.split(' ') });
            const token = response.accessToken;
            pickOneDriveViaGraph(token);
            return true;
        } catch (err) {
            console.error('OneDrive auth error:', err);
            showToast('Erro na autenticação do OneDrive. Verifique o Client ID.', 'error');
            return false;
        }
    }

    async function pickOneDriveViaGraph(accessToken) {
        try {
            const resp = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children?$select=id,name,file,webUrl&$filter=file ne null', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await resp.json();
            if (data.value && data.value.length > 0) {
                const imageFiles = data.value.filter(f => f.file && /\.(png|jpe?g|gif|webp)$/i.test(f.name));
                if (imageFiles.length === 0) {
                    showToast('Nenhuma imagem encontrada no OneDrive.', 'warning');
                    return;
                }
                const list = imageFiles.map((f, i) => `${i + 1}. ${f.name}`).join('\n');
                const choice = window.prompt(`Escolha uma imagem do OneDrive (digite o número):\n\n${list}`);
                const idx = parseInt(choice, 10) - 1;
                if (idx >= 0 && idx < imageFiles.length) {
                    const file = imageFiles[idx];
                    const detail = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${file.id}?$select=@microsoft.graph.downloadUrl,thumbnails`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    const detailData = await detail.json();
                    const url = detailData['@microsoft.graph.downloadUrl'] || (detailData.thumbnails && detailData.thumbnails[0] && detailData.thumbnails[0].large && detailData.thumbnails[0].large.url) || file.webUrl;
                    if (modalImageUrl) modalImageUrl.value = url;
                    if (modalImagePreview) { modalImagePreview.src = url; modalImagePreview.classList.add('active'); }
                    if (btnRemovePreview) btnRemovePreview.classList.add('active');
                    uploadedImageBase64 = '';
                    if (modalImageFile) modalImageFile.value = '';
                    showToast(`Imagem selecionada: ${file.name}`, 'success');
                }
            } else {
                showToast('Nenhum arquivo encontrado no OneDrive.', 'warning');
            }
        } catch (err) {
            console.error(err);
            showToast('Erro ao acessar o OneDrive.', 'error');
        }
    }

    /* ── Event Bindings ── */
    if (btnDrivePicker) {
        btnDrivePicker.addEventListener('click', async () => {
            if (!OAUTH_CONFIG.google.clientId) {
                const link = window.prompt('Cole o link de compartilhamento do Google Drive:\n\nEx: https://drive.google.com/file/d/FILE_ID/view\n\nOu configure OAUTH_CONFIG.google.clientId no script.js para usar o seletor automático.');
                if (!link) return;
                const direct = convertDriveLinkToDirect(link.trim());
                if (modalImageUrl) modalImageUrl.value = direct;
                if (modalImagePreview) { modalImagePreview.src = direct; modalImagePreview.classList.add('active'); }
                if (btnRemovePreview) btnRemovePreview.classList.add('active');
                uploadedImageBase64 = '';
                if (modalImageFile) modalImageFile.value = '';
                showToast('Link do Google Drive adicionado!', 'success');
                return;
            }
            const ready = await initGooglePicker();
            if (ready && tokenClient) tokenClient.requestAccessToken();
        });
    }

    if (btnOneDrivePicker) {
        btnOneDrivePicker.addEventListener('click', async () => {
            if (!OAUTH_CONFIG.onedrive.clientId) {
                const link = window.prompt('Cole o link de compartilhamento do OneDrive:\n\nDica: no OneDrive, clique em "Incorporar" ou copie o link direto da imagem.\n\nConfigure OAUTH_CONFIG.onedrive.clientId no script.js para usar o seletor automático.');
                if (!link) return;
                if (modalImageUrl) modalImageUrl.value = link.trim();
                if (modalImagePreview) { modalImagePreview.src = link.trim(); modalImagePreview.classList.add('active'); }
                if (btnRemovePreview) btnRemovePreview.classList.add('active');
                uploadedImageBase64 = '';
                if (modalImageFile) modalImageFile.value = '';
                showToast('Link do OneDrive adicionado!', 'success');
                return;
            }
            await initOneDrivePicker();
        });
    }

    function resetProjectModal() {
        $('#modalCaption').value = '';
        $('#modalCategory').value = 'web';
        $('#modalImageUrl').value = '';
        uploadedImageBase64 = '';
        if (modalImagePreview) { modalImagePreview.src = ''; modalImagePreview.classList.remove('active'); }
        if (btnRemovePreview) btnRemovePreview.classList.remove('active');
        if (modalImageFile) modalImageFile.value = '';
        editingItem = null;
    }

    function loadSavedGallery() {
        const saved = localStorage.getItem('portfolio-gallery');
        if (saved && galleryGrid) {
            const items = JSON.parse(saved);
            galleryGrid.innerHTML = items.map((item, idx) => createGalleryItemHTML(item, idx)).join('');
            bindGalleryEvents();
            initDragAndDrop();
        }
    }

    function saveGallery() {
        if (!galleryGrid) return;
        const items = [];
        galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption p')?.textContent || '';
            const category = item.dataset.category || 'web';
            items.push({ src: img?.src || '', alt: img?.alt || '', caption, category });
        });
        localStorage.setItem('portfolio-gallery', JSON.stringify(items));
    }

    function createGalleryItemHTML(item, idx) {
        const tagLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        return `<div class="gallery-item reveal-up visible" data-category="${item.category}" data-index="${idx}"><div class="gallery-card"><img src="${item.src}" alt="${item.alt}" loading="lazy"><div class="gallery-overlay"><div class="gallery-actions"><button class="gallery-btn zoom" title="Ampliar"><i class="bi bi-zoom-in"></i></button><button class="gallery-btn edit" title="Editar"><i class="bi bi-pencil"></i></button><button class="gallery-btn remove" title="Remover"><i class="bi bi-trash"></i></button></div></div></div><div class="gallery-caption"><span class="gallery-tag">${tagLabel}</span><p>${item.caption}</p></div></div>`;
    }

    /* ─────────────── DRAG & DROP REORDER (ENHANCED) ─────────────── */
    function initDragAndDrop() {
        if (!galleryGrid) return;
        let draggedItem = null;

        galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
            item.setAttribute('draggable', 'true');

            item.addEventListener('dragstart', (e) => {
                if (!editMode) { e.preventDefault(); return; }
                draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.dataset.index || '');
                // Ghost image
                if (e.dataTransfer.setDragImage) {
                    const rect = item.getBoundingClientRect();
                    e.dataTransfer.setDragImage(item, rect.width / 2, rect.height / 2);
                }
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                galleryGrid.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('drag-over', 'drag-before', 'drag-after'));
                draggedItem = null;
                saveGallery();
                galleryGrid.querySelectorAll('.gallery-item').forEach((i, idx) => i.dataset.index = idx);
            });

            item.addEventListener('dragover', (e) => {
                if (!editMode || !draggedItem || draggedItem === item) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                galleryGrid.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('drag-over', 'drag-before', 'drag-after'));
                item.classList.add('drag-over');
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                item.classList.toggle('drag-before', e.clientY < midpoint);
                item.classList.toggle('drag-after', e.clientY >= midpoint);
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over', 'drag-before', 'drag-after');
            });

            item.addEventListener('drop', (e) => {
                if (!editMode || !draggedItem || draggedItem === item) return;
                e.preventDefault();
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if (e.clientY < midpoint) {
                    galleryGrid.insertBefore(draggedItem, item);
                } else {
                    galleryGrid.insertBefore(draggedItem, item.nextSibling);
                }
            });
        });
    }

    function bindGalleryEvents() {
        $$('.gallery-btn.zoom').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.gallery-item');
                const allItems = $$('.gallery-item:not(.hidden)');
                openLightbox(allItems.indexOf(item));
            });
        });

        $$('.gallery-btn.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.gallery-item');
                item.style.transform = 'scale(0)';
                item.style.opacity = '0';
                setTimeout(() => { item.remove(); saveGallery(); }, 300);
            });
        });

        $$('.gallery-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editingItem = btn.closest('.gallery-item');
                const img = editingItem.querySelector('img');
                const caption = editingItem.querySelector('.gallery-caption p')?.textContent || '';
                const category = editingItem.dataset.category || 'web';
                const src = img?.src || '';
                resetProjectModal();
                $('#modalCaption').value = caption;
                $('#modalCategory').value = category;
                $('#modalTitle').textContent = 'Editar Projeto';
                if (src.startsWith('data:image')) {
                    uploadedImageBase64 = src;
                    if (modalImagePreview) { modalImagePreview.src = src; modalImagePreview.classList.add('active'); }
                    if (btnRemovePreview) btnRemovePreview.classList.add('active');
                } else {
                    $('#modalImageUrl').value = src;
                }
                openModal(projectModal);
            });
        });
    }

    function openModal(modal) {
        if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }

    function closeModal(modal) {
        if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    }

    if (btnToggleEdit) {
        btnToggleEdit.addEventListener('click', () => {
            editMode = !editMode;
            btnToggleEdit.innerHTML = editMode
                ? '<i class="bi bi-check-lg"></i> Concluir Edição'
                : '<i class="bi bi-pencil-square"></i> Modo Edição';
            $$('.gallery-item').forEach(item => item.classList.toggle('admin', editMode));

            let editModeHint = $('.edit-mode-hint');
            if (!editModeHint && galleryGrid) {
                editModeHint = document.createElement('div');
                editModeHint.className = 'edit-mode-hint';
                editModeHint.innerHTML = '<i class="bi bi-arrows-move"></i> Arraste os cards para reordenar. Clique nos botões para editar ou remover.';
                galleryGrid.parentNode.insertBefore(editModeHint, galleryGrid);
            }
            if (editModeHint) editModeHint.classList.toggle('active', editMode);

            showToast(editMode ? 'Modo edição ativado. Use os botões nos cards.' : 'Modo edição desativado.', 'success');
        });
    }

    if (btnAddPhoto) {
        btnAddPhoto.addEventListener('click', () => {
            resetProjectModal();
            $('#modalTitle').textContent = 'Adicionar Projeto';
            openModal(projectModal);
        });
    }

    $$('.modal-custom .modal-close, .modal-custom .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || e.target.closest('.modal-close')) {
                closeModal(el.closest('.modal-custom'));
            }
        });
    });

    // ESC to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $$('.modal-custom.active').forEach(m => closeModal(m));
        }
    });

    const modalSave = $('#modalSave');
    if (modalSave) {
        modalSave.addEventListener('click', () => {
            const urlVal = $('#modalImageUrl').value.trim();
            const src = uploadedImageBase64 || urlVal || 'https://via.placeholder.com/600x400?text=Projeto';
            const caption = $('#modalCaption').value.trim() || 'Novo Projeto';
            const category = $('#modalCategory').value;

            if (editingItem) {
                const img = editingItem.querySelector('img');
                if (img) { img.src = src; img.alt = caption; }
                editingItem.dataset.category = category;
                const tag = editingItem.querySelector('.gallery-tag');
                if (tag) tag.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                const p = editingItem.querySelector('.gallery-caption p');
                if (p) p.textContent = caption;
            } else {
                const newItem = { src, alt: caption, caption, category };
                const div = document.createElement('div');
                div.innerHTML = createGalleryItemHTML(newItem, Date.now());
                const el = div.firstElementChild;
                if (galleryGrid) galleryGrid.appendChild(el);
                setTimeout(() => { bindGalleryEvents(); initDragAndDrop(); }, 0);
            }
            saveGallery();
            resetProjectModal();
            closeModal(projectModal);
            showToast('Projeto salvo com sucesso!', 'success');
        });
    }

    // Keyboard shortcuts for modal save
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter' && projectModal && projectModal.classList.contains('active')) {
            modalSave?.click();
        }
    });

    loadSavedGallery();
    bindGalleryEvents();

    /* ─────────────── EDIT PORTFOLIO INFO ─────────────── */
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            const name = $('.hero-name')?.textContent || '';
            const role = $('.typing-role')?.textContent || '';
            const location = $('.hero-badge')?.textContent?.replace('📍', '').trim() || '';
            const bio = $('.hero-desc')?.textContent || '';
            $('#editName').value = name;
            $('#editRole').value = role;
            $('#editLocation').value = location;
            $('#editBio').value = bio;
            currentCvBase64 = localStorage.getItem('portfolio-cv-base64') || '';
            currentCvName = localStorage.getItem('portfolio-cv-name') || '';
            updateCvUI();
            openModal(editInfoModal);
        }
    });

    const editSave = $('#editSave');
    if (editSave) {
        editSave.addEventListener('click', () => {
            const newName = $('#editName').value.trim();
            const newRole = $('#editRole').value.trim();
            const newLocation = $('#editLocation').value.trim();
            const newBio = $('#editBio').value.trim();

            const heroNameEl = $('.hero-name');
            const typingRoleEl2 = $('.typing-role');
            const heroBadge = $('.hero-badge');
            const heroDesc = $('.hero-desc');

            if (heroNameEl && newName) heroNameEl.textContent = newName;
            if (typingRoleEl2 && newRole) typingRoleEl2.textContent = newRole;
            if (heroBadge && newLocation) heroBadge.innerHTML = `<span class="badge-pulse"></span><i class="bi bi-geo-alt-fill"></i> ${newLocation}`;
            if (heroDesc && newBio) heroDesc.textContent = newBio;

            localStorage.setItem('portfolio-info', JSON.stringify({ name: newName, role: newRole, location: newLocation, bio: newBio }));

            if (currentCvBase64) {
                localStorage.setItem('portfolio-cv-base64', currentCvBase64);
                localStorage.setItem('portfolio-cv-name', currentCvName);
            } else {
                localStorage.removeItem('portfolio-cv-base64');
                localStorage.removeItem('portfolio-cv-name');
            }

            closeModal(editInfoModal);
            showToast('Informações atualizadas!', 'success');
        });
    }

    const editReset = $('#editReset');
    if (editReset) {
        editReset.addEventListener('click', () => {
            localStorage.removeItem('portfolio-info');
            localStorage.removeItem('portfolio-gallery');
            localStorage.removeItem('portfolio-cv-base64');
            localStorage.removeItem('portfolio-cv-name');
            currentCvBase64 = ''; currentCvName = '';
            updateCvUI();
            showToast('Padrão restaurado. Recarregue a página.', 'success');
            closeModal(editInfoModal);
        });
    }

    const savedInfo = localStorage.getItem('portfolio-info');
    if (savedInfo) {
        try {
            const info = JSON.parse(savedInfo);
            if ($('.hero-name') && info.name) $('.hero-name').textContent = info.name;
            if ($('.typing-role') && info.role) $('.typing-role').textContent = info.role;
            if ($('.hero-badge') && info.location) $('.hero-badge').innerHTML = `<span class="badge-pulse"></span><i class="bi bi-geo-alt-fill"></i> ${info.location}`;
            if ($('.hero-desc') && info.bio) $('.hero-desc').textContent = info.bio;
        } catch (e) { /* noop */ }
    }

    /* ─────────────── SCROLL TO SECTION BUTTONS ─────────────── */
    const btnScrollProjects = $('#btnScrollProjects');
    if (btnScrollProjects) {
        btnScrollProjects.addEventListener('click', () => {
            const target = $('#projetos');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* ─────────────── PRINT / PDF BUTTON ─────────────── */
    const btnPrint = $('#btnPrint');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    /* ─────────────── CONSOLE EASTER EGG ─────────────── */
    // Mensagens de boas-vindas removidas para manter o console limpo

    /* ─────────────── ANIMATE ALGORITHM BADGE ON SCROLL ─────────────── */
    const algoBadge = $('.algorithm-badge, .badge-algorithm, [data-badge="algorithm"], .algo-badge');
    if (algoBadge) {
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; /* trigger reflow */
                    entry.target.style.animation = 'badgePulse 2.5s ease-in-out infinite';
                    badgeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        badgeObserver.observe(algoBadge);
    }

})();

/* ─────────────── TECH STACK ENTRANCE ANIMATION ─────────────── */
document.querySelectorAll('.tech-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    setTimeout(() => {
        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 2000 + i * 80);
});

/* ─────────────── SERVICE CARD STAGGER ANIMATION ─────────────── */
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length > 0) {
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        serviceObserver.observe(card);
    });
}

/* ============================================================
   SONIC CAROUSEL
   ============================================================ */
(function () {
    const track = document.querySelector('.sonic-carousel-track');
    if (!track) return;

    const slides = Array.from(document.querySelectorAll('.sonic-slide'));
    const prevBtn = document.querySelector('.sonic-prev');
    const nextBtn = document.querySelector('.sonic-next');
    const dots = Array.from(document.querySelectorAll('.sonic-dot'));
    let current = 0;
    const total = slides.length;

    function goToSlide(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    // Auto-play every 4 seconds
    let interval = setInterval(() => goToSlide(current + 1), 4000);

    // Pause on hover
    const carousel = document.querySelector('.sonic-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(interval));
        carousel.addEventListener('mouseleave', () => {
            interval = setInterval(() => goToSlide(current + 1), 4000);
        });
    }
})();
