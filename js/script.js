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
    // --- 4. CONFIGURAÇÃO DA GALERIA ESTILO INSTAGRAM ---
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
    const counter = document.querySelector('.lightbox-counter');
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    // Criar os slides dinamicamente para o trilho
    const createSlides = () => {
        slider.innerHTML = ''; // Limpa o slider
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
        if (counter) counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    };
    // Abrir Lightbox
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            lightbox.classList.add('show');
            slider.style.transition = 'none'; // Sem transição ao abrir
            updateSlider();
            setTimeout(() => { slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'; }, 10);
        });
    });
    // Fechar Lightbox
    const closeLightbox = () => lightbox.classList.remove('show');
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-slide') || e.target.id === 'lightbox') closeLightbox();
    });
    // Navegação via Botões e Teclado
    document.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < galleryImages.length - 1) { currentIndex++; updateSlider(); }
    });
    document.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) { currentIndex--; updateSlider(); }
    });
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) { currentIndex++; updateSlider(); }
        if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; updateSlider(); }
    });
    // --- 5. LÓGICA DE ARRASTE (SWIPE) IGUAL AO INSTAGRAM ---
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('touchmove', touchMove);
    function touchStart(e) {
        startPos = e.touches[0].clientX;
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        slider.style.transition = 'none'; // Segue o dedo em tempo real
    }
    function touchMove(e) {
        if (isDragging) {
            const currentPosition = e.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
        const movedBy = currentTranslate - prevTranslate;
        // Se arrastar mais que 100px, muda de foto
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
    // Ajustar slider caso a tela mude de tamanho (rotação do celular)
    window.addEventListener('resize', updateSlider);
});
