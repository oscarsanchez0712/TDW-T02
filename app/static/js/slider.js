document.addEventListener('DOMContentLoaded', () => {
  const imgElement = document.getElementById('carousel-img');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dots = document.querySelectorAll('.dot');

  if (!imgElement) return;

  const images = [
    imgElement.getAttribute('data-img1'),
    imgElement.getAttribute('data-img2'),
    imgElement.getAttribute('data-img3'),
    imgElement.getAttribute('data-img4')
  ].filter(Boolean);

  let currentIndex = 0;
  let autoSlideTimer;

  function updateSlide(newIndex) {
    currentIndex = (newIndex + images.length) % images.length;


    imgElement.style.opacity = '0';

    setTimeout(() => {

      imgElement.src = images[currentIndex];

      imgElement.style.opacity = '0.3'; 
    }, 350);

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('w-8', 'opacity-100');
        dot.classList.remove('w-3', 'opacity-50');
      } else {
        dot.classList.add('w-3', 'opacity-50');
        dot.classList.remove('w-8', 'opacity-100');
      }
    });
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 4000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
      resetAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlide(idx);
      resetAutoSlide();
    });
  });

  // Precarga las demás fotos para que el cambio de slide no parpadee
  images.forEach((src) => { const pre = new Image(); pre.src = src; });

  // Pausa el carrusel al pasar el mouse por encima
  const hero = imgElement.parentElement;
  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    hero.addEventListener('mouseleave', resetAutoSlide);

    // Deslizar con el dedo en celulares
    let touchStartX = 0;
    hero.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        updateSlide(currentIndex + (diff < 0 ? 1 : -1));
        resetAutoSlide();
      }
    }, { passive: true });
  }

  startAutoSlide();
});