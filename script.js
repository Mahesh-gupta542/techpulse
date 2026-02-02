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


    // --- Article Pagination ---
    const articles = document.querySelectorAll('#article-section .article-container');
    const btnNext = document.getElementById('btn-next-article');
    const btnPrev = document.getElementById('btn-prev-article');
    let currentArticleIndex = 0;

    function updateArticleDisplay() {
        articles.forEach((article, index) => {
            if (index === currentArticleIndex) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });

        // Update buttons
        if (btnPrev) {
            btnPrev.disabled = currentArticleIndex === 0;
            btnPrev.style.visibility = 'visible'; // Ensure it's visible but disabled
        }
        if (btnNext) {
            btnNext.disabled = currentArticleIndex === articles.length - 1;
            btnNext.style.visibility = 'visible'; // Ensure it's visible but disabled
        }

        // Scroll to top of article section if needed, or just top of page
        window.scrollTo(0, 0);
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentArticleIndex < articles.length - 1) {
                currentArticleIndex++;
                updateArticleDisplay();
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentArticleIndex > 0) {
                currentArticleIndex--;
                updateArticleDisplay();
            }
        });
    }

    // Initialize display
    updateArticleDisplay();

    // --- Navigation Logic ---
    const heroSection = document.getElementById('hero-section');
    const articleSection = document.getElementById('article-section');
    const btnReadLatest = document.getElementById('btn-read-latest');
    const navHome = document.getElementById('nav-home');
    const logoTrigger = document.getElementById('logo-trigger');

    function showArticle() {
        heroSection.classList.add('hidden');
        articleSection.classList.remove('hidden');

        // Reset to first article when entering
        currentArticleIndex = 0;
        updateArticleDisplay();

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
