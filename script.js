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
    const gamesSection = document.getElementById('games-section');
    const btnReadLatest = document.getElementById('btn-read-latest');
    const navHome = document.getElementById('nav-home');
    const navGames = document.getElementById('nav-games');
    const logoTrigger = document.getElementById('logo-trigger');

    function hideAllSections() {
        heroSection.classList.add('hidden');
        articleSection.classList.add('hidden');
        gamesSection.classList.add('hidden');
        stopSnakeGame();
        stopBreakerGame();
    }

    function showArticle() {
        hideAllSections();
        articleSection.classList.remove('hidden');

        // Reset to first article when entering
        currentArticleIndex = 0;
        updateArticleDisplay();

        window.scrollTo(0, 0);
    }

    function showHome() {
        hideAllSections();
        heroSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function showGames() {
        hideAllSections();
        gamesSection.classList.remove('hidden');
        showGamesMenu();
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

    if (navGames) {
        navGames.addEventListener('click', (e) => {
            e.preventDefault();
            showGames();
        });
    }

    if (logoTrigger) {
        logoTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            showHome();
        });
    }

    // --- Games Logic ---
    const gamesMenu = document.querySelector('.games-menu');
    const snakeContainer = document.getElementById('game-container-snake');
    const breakerContainer = document.getElementById('game-container-breaker');

    // Snake Overlay Elements
    const snakeGameOverCtx = document.getElementById('snake-game-over');
    const snakeFinalScore = document.getElementById('snake-final-score');
    const btnRestartSnake = document.getElementById('btn-restart-snake');

    document.getElementById('btn-start-snake').addEventListener('click', startSnakeGame);
    document.getElementById('btn-start-breaker').addEventListener('click', startBreakerGame);
    document.getElementById('btn-back-snake').addEventListener('click', showGamesMenu);
    document.getElementById('btn-back-breaker').addEventListener('click', showGamesMenu);

    if (btnRestartSnake) {
        btnRestartSnake.addEventListener('click', startSnakeGame);
    }

    function showGamesMenu() {
        stopSnakeGame();
        stopBreakerGame();
        gamesMenu.classList.remove('hidden');
        snakeContainer.classList.add('hidden');
        breakerContainer.classList.add('hidden');
    }

    // --- NEON SNAKE ---
    let snakeInterval;
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeCtx = snakeCanvas.getContext('2d');
    const gridSize = 20;
    const tileCount = snakeCanvas.width / gridSize;
    let snake = [];
    let food = {};
    let dx = 0;
    let dy = 0;
    let snakeScore = 0;

    function startSnakeGame() {
        gamesMenu.classList.add('hidden');
        snakeContainer.classList.remove('hidden');
        if (snakeGameOverCtx) snakeGameOverCtx.classList.add('hidden'); // Hide overlay

        snake = [{ x: 10, y: 10 }];
        food = { x: 15, y: 15 };
        dx = 0;
        dy = 0;
        snakeScore = 0;
        document.getElementById('snake-score').innerText = snakeScore;
        clearInterval(snakeInterval);
        snakeInterval = setInterval(gameLoopSnake, 100);
        document.addEventListener('keydown', changeDirectionSnake);
    }

    function stopSnakeGame() {
        clearInterval(snakeInterval);
        document.removeEventListener('keydown', changeDirectionSnake);
    }

    function gameLoopSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if ((dx !== 0 || dy !== 0) && (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkCollisionSnake(head))) {
            // Game Over Logic
            stopSnakeGame();
            if (snakeGameOverCtx) {
                document.getElementById('snake-final-score').innerText = snakeScore;
                snakeGameOverCtx.classList.remove('hidden');
                if (btnRestartSnake) btnRestartSnake.focus();
            }
            return;
        }

        if (dx !== 0 || dy !== 0) {
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                snakeScore += 10;
                document.getElementById('snake-score').innerText = snakeScore;
                resetFood();
            } else {
                snake.pop();
            }
        }

        drawSnake();
    }

    function drawSnake() {
        snakeCtx.fillStyle = 'black';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        snakeCtx.fillStyle = '#00ff9d'; // Neon Green
        for (let part of snake) {
            snakeCtx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        }

        snakeCtx.fillStyle = '#ff00ff'; // Neon Pink
        snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function resetFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Don't spawn on snake
        if (checkCollisionSnake(food)) resetFood();
    }

    function checkCollisionSnake(pos) {
        for (let part of snake) {
            if (part.x === pos.x && part.y === pos.y) return true;
        }
        return false;
    }

    function changeDirectionSnake(e) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = e.keyCode;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (keyPressed === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
        if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -1; }
        if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
        if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }
    }


    // --- CYBER BREAKER ---
    let breakerReq;
    const breakerCanvas = document.getElementById('breaker-canvas');
    const ctx = breakerCanvas.getContext('2d');

    // Breaker Overlay Elements
    const breakerGameOverCtx = document.getElementById('breaker-game-over');
    const breakerStatusTitle = document.getElementById('breaker-status-title');
    const breakerFinalScore = document.getElementById('breaker-final-score');
    const btnRestartBreaker = document.getElementById('btn-restart-breaker');

    if (btnRestartBreaker) {
        btnRestartBreaker.addEventListener('click', startBreakerGame);
    }

    let ballRadius = 5;
    let x, y, dxB, dyB;
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX;
    let rightPressed = false;
    let leftPressed = false;
    let brickRowCount = 5;
    let brickColumnCount = 6;
    let brickWidth = 55;
    let brickHeight = 15;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 10;
    let bricks = [];
    let breakerScore = 0;

    function startBreakerGame() {
        gamesMenu.classList.add('hidden');
        breakerContainer.classList.remove('hidden');
        if (breakerGameOverCtx) breakerGameOverCtx.classList.add('hidden');

        // Reset state
        x = breakerCanvas.width / 2;
        y = breakerCanvas.height - 30;
        dxB = 2;
        dyB = -2;
        paddleX = (breakerCanvas.width - paddleWidth) / 2;
        breakerScore = 0;
        document.getElementById('breaker-score').innerText = breakerScore;

        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        cancelAnimationFrame(breakerReq);
        drawBreaker();

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
    }

    function stopBreakerGame() {
        cancelAnimationFrame(breakerReq);
        document.removeEventListener("keydown", keyDownHandler, false);
        document.removeEventListener("keyup", keyUpHandler, false);
    }

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dyB = -dyB;
                        b.status = 0;
                        breakerScore++;
                        document.getElementById('breaker-score').innerText = breakerScore;
                        if (breakerScore == brickRowCount * brickColumnCount) {
                            stopBreakerGame();
                            if (breakerGameOverCtx) {
                                breakerStatusTitle.innerText = "YOU WIN!";
                                breakerStatusTitle.style.color = "#00ff9d";
                                breakerFinalScore.innerText = breakerScore;
                                breakerGameOverCtx.classList.remove('hidden');
                                if (btnRestartBreaker) btnRestartBreaker.focus();
                            }
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff00ff";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, breakerCanvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#00d2ff";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#00ff9d";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawBreaker() {
        ctx.clearRect(0, 0, breakerCanvas.width, breakerCanvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (x + dxB > breakerCanvas.width - ballRadius || x + dxB < ballRadius) {
            dxB = -dxB;
        }
        if (y + dyB < ballRadius) {
            dyB = -dyB;
        } else if (y + dyB > breakerCanvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dyB = -dyB;
            }
            else {
                // Game Over
                stopBreakerGame();
                if (breakerGameOverCtx) {
                    breakerStatusTitle.innerText = "GAME OVER";
                    breakerStatusTitle.style.color = "#ff00ff";
                    breakerFinalScore.innerText = breakerScore;
                    breakerGameOverCtx.classList.remove('hidden');
                    if (btnRestartBreaker) btnRestartBreaker.focus();
                }
                return;
            }
        }

        if (rightPressed && paddleX < breakerCanvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dxB;
        y += dyB;
        breakerReq = requestAnimationFrame(drawBreaker);
    }
});
