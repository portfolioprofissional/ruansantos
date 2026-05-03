document.addEventListener('DOMContentLoaded', () => {
    // 1. Animação de Entrada (Fade)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade').forEach(el => observer.observe(el));

    // 2. Lógica da Galeria / Lightbox
    const lightbox = document.getElementById('lightbox');
    const slider = document.querySelector('.lightbox-slider');
    const items = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    const openLightbox = (index) => {
        currentIndex = index;
        slider.innerHTML = ''; // Limpa e popula apenas ao abrir
        items.forEach(item => {
            const clone = item.querySelector('img').cloneNode();
            const slide = document.createElement('div');
            slide.className = 'lightbox-slide';
            slide.appendChild(clone);
            slider.appendChild(slide);
        });
        updateSlider();
        lightbox.classList.add('show');
    };

    const updateSlider = () => {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelector('.lightbox-counter').textContent = `${currentIndex + 1} / ${items.length}`;
    };

    items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));

    document.querySelector('.lightbox-close').onclick = () => lightbox.classList.remove('show');
    document.querySelector('.lightbox-next').onclick = () => { if(currentIndex < items.length - 1) { currentIndex++; updateSlider(); } };
    document.querySelector('.lightbox-prev').onclick = () => { if(currentIndex > 0) { currentIndex--; updateSlider(); } };

    // 3. Swipe Suave
    let touchStart = 0;
    slider.addEventListener('touchstart', e => touchStart = e.touches[0].clientX);
    slider.addEventListener('touchend', e => {
        const touchEnd = e.changedTouches[0].clientX;
        if (touchStart - touchEnd > 50) document.querySelector('.lightbox-next').click();
        if (touchStart - touchEnd < -50) document.querySelector('.lightbox-prev').click();
    });
});
