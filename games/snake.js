// Snake Game Implementation
function initSnakeGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvas.className = 'game-canvas';
    
    const ctx = canvas.getContext('2d');
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';
    
    container.appendChild(gameInfo);
    container.appendChild(canvas);
    
    // Game state
    let snake = [{x: 200, y: 200}];
    let food = {x: 160, y: 160};
    let direction = {x: 0, y: 0};
    let score = 0;
    let gameRunning = true;
    
    const gridSize = 20;
    
    function updateGameInfo() {
        gameInfo.innerHTML = `
            <div class="game-score">Score: ${score}</div>
            <div>Use arrow keys to move the snake</div>
        `;
    }
    
    function drawSnake() {
        ctx.fillStyle = '#667eea';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                ctx.fillStyle = '#4c51bf';
            } else {
                ctx.fillStyle = '#667eea';
            }
            ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
        });
    }
    
    function drawFood() {
        ctx.fillStyle = '#f56565';
        ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
    }
    
    function moveSnake() {
        if (direction.x === 0 && direction.y === 0) return;
        
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        
        // Check wall collision
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
        } else {
            snake.pop();
        }
    }
    
    function generateFood() {
        do {
            food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
            food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }
    
    function gameOver() {
        gameRunning = false;
        clearInterval(window.gameLoop);
        window.gameLoop = null;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '18px Poppins';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        
        // Award points
        if (typeof onGameComplete === 'function') {
            onGameComplete(score);
        }
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.fillStyle = '#f7fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        moveSnake();
        drawFood();
        drawSnake();
        updateGameInfo();
    }
    
    // Handle keyboard input
    function handleKeyPress(e) {
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (direction.y === 0) {
                    direction = {x: 0, y: -gridSize};
                }
                break;
            case 'ArrowDown':
                if (direction.y === 0) {
                    direction = {x: 0, y: gridSize};
                }
                break;
            case 'ArrowLeft':
                if (direction.x === 0) {
                    direction = {x: -gridSize, y: 0};
                }
                break;
            case 'ArrowRight':
                if (direction.x === 0) {
                    direction = {x: gridSize, y: 0};
                }
                break;
        }
        e.preventDefault();
    }
    
    // Add event listener
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup function for when modal closes
    const cleanup = () => {
        document.removeEventListener('keydown', handleKeyPress);
        if (window.gameLoop) {
            clearInterval(window.gameLoop);
            window.gameLoop = null;
        }
    };
    
    // Store cleanup function for modal close
    container.cleanup = cleanup;
    
    // Initialize game
    updateGameInfo();
    generateFood();
    drawFood();
    drawSnake();
    
    // Start game loop
    window.gameLoop = setInterval(gameLoop, 150);
}
