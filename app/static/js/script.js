document.addEventListener('DOMContentLoaded', () => {
    
    const menuBtn = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const btnVolverArriba = document.getElementById('btnVolverArriba');
    const progresoScroll = document.getElementById('progresoScroll');

    if (btnVolverArriba) {
        window.addEventListener('scroll', () => {
            
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollActual = window.scrollY;
            const porcentaje = totalHeight > 0 ? (scrollActual / totalHeight) * 100 : 0;

            if (progresoScroll) {
                progresoScroll.setAttribute('stroke-dasharray', `${porcentaje}, 100`);
            }

            if (scrollActual > 200) {
                btnVolverArriba.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10', 'scale-90');
                btnVolverArriba.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            } else {
                btnVolverArriba.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10', 'scale-90');
                btnVolverArriba.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
            }
        });

        btnVolverArriba.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});