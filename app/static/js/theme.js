const btnTheme = document.getElementById('btn-theme');
const btnThemeMobile = document.getElementById('btn-theme-mobile');

const updateThemeUI = (isDark) => {
    const icon = isDark ? '☀️' : '🌙';

    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.textContent = icon;

    if (btnThemeMobile) {
        const mobileIconSpan = btnThemeMobile.querySelector('span:first-child');
        if (mobileIconSpan) mobileIconSpan.textContent = icon;
    }
};

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    updateThemeUI(true);
}

const handleThemeToggle = (e) => {
    const toggleTheme = () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeUI(isDark);
    };

    if (!document.startViewTransition) {
        toggleTheme();
        return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
        toggleTheme();
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
            { clipPath: clipPath },
            {
                duration: 500,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)'
            }
        );
    });
};

if (btnTheme) btnTheme.addEventListener('click', handleThemeToggle);
if (btnThemeMobile) btnThemeMobile.addEventListener('click', handleThemeToggle);