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
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 4. CONFIGURAÇÃO DA GALERIA ---
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
    const slider = document.querySelector('.lightbox-slider');
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Criar os slides dinamicamente
    const createSlides = () => {
        slider.innerHTML = '';
        galleryImages.forEach(img => {
            const slide = document.createElement('div');
            slide.classList.add('lightbox-slide');
            slide.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
            slider.appendChild(slide);
        });
    };
    createSlides();

    const updateSlider = () => {
        currentTranslate = currentIndex * -window.innerWidth;
        prevTranslate = currentTranslate;
        slider.style.transform = `translateX(${currentTranslate}px)`;
    };

    // Abrir Lightbox
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            lightbox.classList.add('show');
            slider.style.transition = 'none';
            updateSlider();
            setTimeout(() => { 
                slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'; 
            }, 10);
        });
    });

    // Fechar Lightbox
    const closeLightbox = () => lightbox.classList.remove('show');
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    
    // Fechar ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-slide')) closeLightbox();
    });

    // Navegação via Botões
    document.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < galleryImages.length - 1) { currentIndex++; updateSlider(); }
    });
    document.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) { currentIndex--; updateSlider(); }
    });

    // --- 5. LÓGICA DE ARRASTE (MOUSE E TOUCH) ---
    
    // Eventos de Mouse (Desktop)
    slider.addEventListener('mousedown', dragStart);
    slider.addEventListener('mouseup', dragEnd);
    slider.addEventListener('mousemove', dragMove);
    slider.addEventListener('mouseleave', dragEnd);

    // Eventos de Touch (Mobile)
    slider.addEventListener('touchstart', dragStart);
    slider.addEventListener('touchend', dragEnd);
    slider.addEventListener('touchmove', dragMove);

    function dragStart(e) {
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        animationID = requestAnimationFrame(animation);
        slider.style.transition = 'none';
        slider.style.cursor = 'grabbing';
    }

    function dragMove(e) {
        if (!isDragging) return;
        const currentPosition = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.cursor = 'grab';
        slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < galleryImages.length - 1) currentIndex += 1;
        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

        updateSlider();
    }

    function animation() {
        if (isDragging) {
            slider.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    // Teclado
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) { currentIndex++; updateSlider(); }
        if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; updateSlider(); }
    });

    window.addEventListener('resize', updateSlider);
});
