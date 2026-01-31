document.addEventListener('DOMContentLoaded', () => {
    // --- Logo Interaction ---
    const logo = document.getElementById('interactive-logo');
    if (logo) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const xOffset = (x - centerX) / 50;
            const yOffset = (y - centerY) / 50;

            logo.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

            // Dynamic text shadow based on mouse position
            const shadowX = xOffset * -2;
            const shadowY = yOffset * -2;
            logo.style.textShadow = `${shadowX}px ${shadowY}px 0px rgba(255, 0, 255, 0.7)`;
        });

        logo.addEventListener('mouseover', () => {
            logo.innerText = '< T E C H / O S >';
            logo.style.color = '#ff00ff';
        });

        logo.addEventListener('mouseout', () => {
            logo.innerText = 'T E C H // P U L S E';
            logo.style.color = '#00ff9d';
        });
    }

    // --- Navigation Logic ---
    const heroSection = document.getElementById('hero-section');
    const articleSection = document.getElementById('article-section');
    const btnReadLatest = document.getElementById('btn-read-latest');
    const navHome = document.getElementById('nav-home');
    const logoTrigger = document.getElementById('logo-trigger');

    function showArticle() {
        heroSection.classList.add('hidden');
        articleSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function showHome() {
        articleSection.classList.add('hidden');
        heroSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    if (btnReadLatest) {
        btnReadLatest.addEventListener('click', (e) => {
            e.preventDefault();
            showArticle();
        });
    }

    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            showHome();
        });
    }

    if (logoTrigger) {
        logoTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            showHome();
        });
    }
});
