(() => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    const cow = document.createElement('div');
    cow.className = 'cursor-cow';
    cow.innerHTML = '<span>🐄</span>';
    document.body.appendChild(cow);
    const emoji = cow.firstElementChild;

    let mouseX = 0, mouseY = 0, cowX = 0, cowY = 0, facing = 1;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.2;

    window.addEventListener('mousemove', (e) => {
        // Voltea la vaca según la dirección horizontal
        if (e.movementX > 1) facing = -1;
        else if (e.movementX < -1) facing = 1;
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.body.classList.add('cursor-visible');
    });

    const animate = () => {
        cowX += (mouseX - cowX) * ease;
        cowY += (mouseY - cowY) * ease;
        cow.style.transform = `translate(${cowX}px, ${cowY}px) translate(-50%, -50%) scaleX(${facing})`;
        requestAnimationFrame(animate);
    };
    animate();

    const splash = (x, y) => {
        const drops = 14;

        for (let i = 0; i < drops; i++) {
            const drop = document.createElement('div');
            drop.className = 'milk-drop';

            const size = 5 + Math.random() * 9;
            drop.style.width = size + 'px';
            drop.style.height = size + 'px';
            document.body.appendChild(drop);

            const angle = (-Math.PI * 0.95) + Math.random() * (Math.PI * 0.9);
            const distance = 40 + Math.random() * 70;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            const fall = 50 + Math.random() * 40;

            const anim = drop.animate([
                { transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`, opacity: 1 },
                { transform: `translate(${x + dx}px, ${y + dy}px) translate(-50%, -50%) scale(1)`, opacity: 1, offset: 0.45 },
                { transform: `translate(${x + dx * 1.2}px, ${y + dy + fall}px) translate(-50%, -50%) scale(0.3)`, opacity: 0 }
            ], {
                duration: 600 + Math.random() * 300,
                easing: 'ease-out'
            });

            anim.onfinish = () => drop.remove();
        }
    };

    const interactive = 'a, button, input, textarea, select, [role="button"]';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactive)) cow.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactive)) cow.classList.remove('is-hover');
    });

    window.addEventListener('mousedown', (e) => {
        cow.classList.add('is-down');
        splash(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', () => cow.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-visible'));
})();

