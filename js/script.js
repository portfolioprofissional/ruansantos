document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ANIMAÇÃO AO ROLAR (FADE IN) ---
    const faders = document.querySelectorAll('.fade');
    const appearOptions = { threshold: 0.2 };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    // --- 2. EFEITO PARALLAX SUAVE (APENAS DESKTOP) ---
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                let offset = window.scrollY;
                hero.style.backgroundPositionY = offset * 0.5 + 'px';
            }
        });
    }

    // --- 3. SCROLL SUAVE DOS LINKS ---
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 4. CONFIGURAÇÃO DA GALERIA & LIGHTBOX ---
    const galleryImages = [
        { src: 'imagens/Galeria1.jpeg', alt: 'Momento de vitória' },
        { src: 'imagens/Galeria2.jpeg', alt: 'Atleta no pódio' },
        { src: 'imagens/Galeria3.jpeg', alt: 'Jogo no tatame' },
        { src: 'imagens/Galeria4.jpeg', alt: 'Medalha de campeão' },
        { src: 'imagens/Galeria5.jpeg', alt: 'Equipe e campeão' },
        { src: 'imagens/Galeria6.jpeg', alt: 'Selfie com medalha' },
        { src: 'imagens/Galeria7.jpeg', alt: 'Entrevista pós-campeonato' },
        { src: 'imagens/Galeria9.jpeg', alt: 'Momento de disputa' },
        { src: 'imagens/Galeria10.jpeg', alt: 'Pódio' },
        { src: 'imagens/Galeria11.jpeg', alt: 'Atleta com troféu' },
        { src: 'imagens/Galeria12.jpeg', alt: 'Foto campeonato' },
        { src: 'imagens/Galeria13.jpeg', alt: 'Adicional 1' },
        { src: 'imagens/Galeria14.jpeg', alt: 'Adicional 2' },
        { src: 'imagens/Galeria16.jpeg', alt: 'Adicional 4' },
        { src: 'imagens/Galeria17.jpeg', alt: 'Adicional 5' },
        { src: 'imagens/Galeria18.jpeg', alt: 'Adicional 6' },
        { src: 'imagens/Galeria19.jpeg', alt: 'Adicional 7' },
        { src: 'imagens/Galeria20.jpeg', alt: 'Adicional 8' },
        { src: 'imagens/Galeria21.jpeg', alt: 'Adicional 9' },
        { src: 'imagens/Galeria22.jpeg', alt: 'Adicional 10' },
        { src: 'imagens/Galeria23.jpeg', alt: 'Adicional 11' }
    ];

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    const currentIndexLabel = document.querySelector('.lightbox-counter');
    
    let currentIndex = 0;
    let isAnimating = false;

    const updateLightbox = (index) => {
        if (isAnimating || !lightboxImage) return;
        isAnimating = true;

        lightboxImage.classList.remove('show');
        
        setTimeout(() => {
            currentIndex = (index + galleryImages.length) % galleryImages.length;
            const data = galleryImages[currentIndex];
            
            if (data) {
                lightboxImage.src = data.src;
                lightboxImage.alt = data.alt;
                if (lightboxCounter) {
                    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
                }
            }
            lightboxImage.classList.add('show');
            
            setTimeout(() => { isAnimating = false; }, 400);
        }, 200);
    };

    // Abrir ao clicar nos itens da galeria
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            if (lightbox) {
                lightbox.classList.add('show');
                updateLightbox(currentIndex);
            }
        });
    });

    // Fechar Lightbox
    const closeLightbox = () => { if (lightbox) lightbox.classList.remove('show'); };
    
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    
    lightbox?.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });

    // Navegação via botões
    document.querySelector('.lightbox-next')?.addEventListener('click', (e) => { 
        e.stopPropagation(); updateLightbox(currentIndex + 1); 
    });
    document.querySelector('.lightbox-prev')?.addEventListener('click', (e) => { 
        e.stopPropagation(); updateLightbox(currentIndex - 1); 
    });

    // Teclado
    window.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
        if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
    });

    // --- 5. SWIPE (ARRASAR) NO LIGHTBOX ---
    let touchstartX = 0;
    let touchendX = 0;

    lightbox?.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox?.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        const threshold = 50;
        if (touchendX < touchstartX - threshold) updateLightbox(currentIndex + 1); // Swipe esquerda
        if (touchendX > touchstartX + threshold) updateLightbox(currentIndex - 1); // Swipe direita
    }, {passive: true});
});
