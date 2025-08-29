// Flappy Square Game Implementation
function initFlappySquareGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    canvas.className = 'game-canvas';
    
    const ctx = canvas.getContext('2d');
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';
    
    container.appendChild(gameInfo);
    container.appendChild(canvas);
    
    // Game state
    let player = {
        x: 80,
        y: 250,
        width: 20,
        height: 20,
        velocity: 0,
        gravity: 0.4,
        jumpForce: -8
    };
    
    let obstacles = [];
    let score = 0;
    let gameRunning = true;
    let gameStarted = false;
    
    const obstacleWidth = 60;
    const obstacleGap = 150;
    
    function updateGameInfo() {
        gameInfo.innerHTML = `
            <div class="game-score">Score: ${score}</div>
            <div>${gameStarted ? 'Click or press Space to jump' : 'Click or press Space to start'}</div>
        `;
    }
    
    function drawPlayer() {
        ctx.fillStyle = '#667eea';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Add simple eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(player.x + 3, player.y + 3, 4, 4);
        ctx.fillRect(player.x + 13, player.y + 3, 4, 4);
        ctx.fillStyle = 'black';
        ctx.fillRect(player.x + 5, player.y + 5, 2, 2);
        ctx.fillRect(player.x + 15, player.y + 5, 2, 2);
    }
    
    function drawObstacles() {
        ctx.fillStyle = '#4ade80';
        obstacles.forEach(obstacle => {
            // Top obstacle
            ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.topHeight);
            // Bottom obstacle
            ctx.fillRect(obstacle.x, obstacle.topHeight + obstacleGap, obstacleWidth, canvas.height - obstacle.topHeight - obstacleGap);
        });
    }
    
    function createObstacle() {
        const topHeight = Math.random() * (canvas.height - obstacleGap - 100) + 50;
        obstacles.push({
            x: canvas.width,
            topHeight: topHeight,
            scored: false
        });
    }
    
    function updatePlayer() {
        if (!gameStarted) return;
        
        player.velocity += player.gravity;
        player.y += player.velocity;
        
        // Check boundaries
        if (player.y <= 0 || player.y + player.height >= canvas.height) {
            gameOver();
        }
    }
    
    function updateObstacles() {
        if (!gameStarted) return;
        
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= 2;
            
            // Remove off-screen obstacles
            if (obstacle.x + obstacleWidth < 0) {
                obstacles.splice(index, 1);
            }
            
            // Score when passing obstacle
            if (!obstacle.scored && obstacle.x + obstacleWidth < player.x) {
                obstacle.scored = true;
                score++;
            }
            
            // Check collision
            if (checkCollision(obstacle)) {
                gameOver();
            }
        });
        
        // Create new obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
            createObstacle();
        }
    }
    
    function checkCollision(obstacle) {
        return player.x < obstacle.x + obstacleWidth &&
               player.x + player.width > obstacle.x &&
               (player.y < obstacle.topHeight || 
                player.y + player.height > obstacle.topHeight + obstacleGap);
    }
    
    function jump() {
        if (!gameRunning) return;
        
        if (!gameStarted) {
            gameStarted = true;
            createObstacle();
        }
        
        player.velocity = player.jumpForce;
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
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '18px Poppins';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText('Click to restart', canvas.width / 2, canvas.height / 2 + 20);
        
        // Award points
        if (typeof onGameComplete === 'function') {
            onGameComplete(score * 5);
        }
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        updatePlayer();
        updateObstacles();
        drawObstacles();
        drawPlayer();
        updateGameInfo();
    }
    
    function resetGame() {
        player.y = 250;
        player.velocity = 0;
        obstacles = [];
        score = 0;
        gameRunning = true;
        gameStarted = false;
        
        if (window.gameLoop) {
            clearInterval(window.gameLoop);
        }
        window.gameLoop = setInterval(gameLoop, 1000 / 60);
        updateGameInfo();
    }
    
    // Handle input
    function handleInput(e) {
        if (e.type === 'click' || e.key === ' ') {
            e.preventDefault();
            if (!gameRunning) {
                resetGame();
            } else {
                jump();
            }
        }
    }
    
    // Add event listeners
    canvas.addEventListener('click', handleInput);
    document.addEventListener('keydown', handleInput);
    
    // Cleanup function
    const cleanup = () => {
        canvas.removeEventListener('click', handleInput);
        document.removeEventListener('keydown', handleInput);
        if (window.gameLoop) {
            clearInterval(window.gameLoop);
            window.gameLoop = null;
        }
    };
    
    container.cleanup = cleanup;
    
    // Initialize game
    updateGameInfo();
    gameLoop();
    
    // Start game loop
    window.gameLoop = setInterval(gameLoop, 1000 / 60);
}
