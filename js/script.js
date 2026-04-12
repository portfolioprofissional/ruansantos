document.addEventListener('DOMContentLoaded', () => {
    // animação ao rolar
    const faders = document.querySelectorAll('.fade');

    const appearOptions = {
        threshold: 0.2
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // efeito parallax mais suave (apenas em desktop)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                let offset = window.scrollY;
                hero.style.backgroundPositionY = offset * 0.5 + 'px';
            }
        });
    }

    // scroll suave
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // galeria lightbox
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    const galleryImages = [
        { src: 'imagens/Galeria1.jpeg', alt: 'Momento de vitória' },
        { src: 'imagens/Galeria2.jpeg', alt: 'Atleta no pódio' },
        { src: 'imagens/Galeria3.jpeg', alt: 'Jogo no tatame' },
        { src: 'imagens/Galeria4.jpeg', alt: 'Medalha de campeão' },
        { src: 'imagens/Galeria5.jpeg', alt: 'Equipe e campeão' },
        { src: 'imagens/Galeria6.jpeg', alt: 'Selfie com medalha' },
        { src: 'imagens/Galeria7.jpeg', alt: 'Entrevista pós-campeonato' },
        { src: 'imagens/Galeria9.jpeg', alt: 'Momento de disputa em campeonato' },
        { src: 'imagens/Galeria10.jpeg', alt: 'Pódio de campeonato' },
        { src: 'imagens/Galeria11.jpeg', alt: 'Atleta com troféu' },
        { src: 'imagens/Galeria12.jpeg', alt: 'Foto de campeonato oficial' },
        { src: 'imagens/Galeria13.jpeg', alt: 'Foto adicional 1' },
        { src: 'imagens/Galeria14.jpeg', alt: 'Foto adicional 2' },
        { src: 'imagens/Galeria16.jpeg', alt: 'Foto adicional 4' },
        { src: 'imagens/Galeria17.jpeg', alt: 'Foto adicional 5' },
        { src: 'imagens/Galeria18.jpeg', alt: 'Foto adicional 6' },
        { src: 'imagens/Galeria19.jpeg', alt: 'Foto adicional 7' },
        { src: 'imagens/Galeria20.jpeg', alt: 'Foto adicional 8' },
        { src: 'imagens/Galeria21.jpeg', alt: 'Foto adicional 9' },
        { src: 'imagens/Galeria22.jpeg', alt: 'Foto adicional 10' },
        { src: 'imagens/Galeria23.jpeg', alt: 'Foto adicional 11' }
    ];

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    const closeButton = document.querySelector('.lightbox-close');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');
    let currentIndex = 0;
    let isAnimating = false;

    const updateLightbox = (index, direction) => {
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
            
            setTimeout(() => {
                isAnimating = false;
            }, 400);
        }, 200);
    };

    const openLightbox = (index) => {
        if (lightbox) {
            lightbox.classList.add('show');
            updateLightbox(index);
        }
    };

    const closeLightbox = () => {
        if (lightbox) lightbox.classList.remove('show');
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = Number(item.dataset.index);
            if (!isNaN(index)) {
                openLightbox(index);
            }
        });
    });

    if (closeButton) closeButton.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target.classList.contains('lightbox-backdrop')) {
                closeLightbox();
            }
        });
    }

    if (nextButton) nextButton.addEventListener('click', (e) => { e.stopPropagation(); updateLightbox(currentIndex + 1, 'next'); });
    if (prevButton) prevButton.addEventListener('click', (e) => { e.stopPropagation(); updateLightbox(currentIndex - 1, 'prev'); });

    window.addEventListener('keydown', (event) => {
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowRight') updateLightbox(currentIndex + 1, 'next');
        if (event.key === 'ArrowLeft') updateLightbox(currentIndex - 1, 'prev');
    });
});
/* ==================== ATIVAR ARRASTE (SWIPE) NA GALERIA MOBILE ==================== */
const galleryContainer = document.querySelector('.gallery');

if (galleryContainer && window.innerWidth <= 768) {
  let isDown = false;
  let startX;
  let scrollLeft;

  // Quando o usuário toca na tela
  galleryContainer.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - galleryContainer.offsetLeft;
    scrollLeft = galleryContainer.scrollLeft;
  });

  // Quando o usuário para de tocar
  galleryContainer.addEventListener('touchend', () => {
    isDown = false;
  });

  // Quando o usuário move o dedo (arrasta)
  galleryContainer.addEventListener('touchmove', (e) => {
    if (!isDown) return; // Se não estiver tocando, não faz nada
    const x = e.touches[0].pageX - galleryContainer.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador de velocidade do arraste
    galleryContainer.scrollLeft = scrollLeft - walk;
  });
}
// === FUNÇÃO DE ARRASTAR (SWIPE) NO LIGHTBOX ===
let touchstartX = 0;
let touchendX = 0;

const lbContainer = document.getElementById('lightbox');

lbContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, false);

lbContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleLightboxSwipe();
}, false);

function handleLightboxSwipe() {
    const threshold = 50; // Sensibilidade do arrasto
    if (touchendX < touchstartX - threshold) {
        // Deslizou para a esquerda -> Próxima foto
        document.querySelector('.lightbox-next').click();
    }
    if (touchendX > touchstartX + threshold) {
        // Deslizou para a direita -> Foto anterior
        document.querySelector('.lightbox-prev').click();
    }
}
