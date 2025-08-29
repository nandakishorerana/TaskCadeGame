// Memory Flip Game Implementation
function initMemoryFlipGame(container) {
    const gameArea = document.createElement('div');
    gameArea.className = 'memory-game';
    
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';
    
    container.appendChild(gameInfo);
    container.appendChild(gameArea);
    
    // Add CSS for Memory Game
    const style = document.createElement('style');
    style.textContent = `
        .memory-game {
            display: grid;
            grid-template-columns: repeat(4, 80px);
            grid-template-rows: repeat(4, 80px);
            gap: 10px;
            justify-content: center;
            margin: 20px 0;
        }
        
        .memory-card {
            background: #667eea;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .memory-card:hover {
            transform: scale(1.05);
        }
        
        .memory-card.flipped {
            background: white;
            border: 2px solid #667eea;
        }
        
        .memory-card.matched {
            background: #4ade80;
            border: 2px solid #22c55e;
            cursor: default;
        }
        
        .memory-card.disabled {
            cursor: not-allowed;
        }
        
        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            backface-visibility: hidden;
            transition: transform 0.3s ease;
        }
        
        .card-front {
            background: #667eea;
            color: white;
        }
        
        .card-back {
            background: white;
            color: #333;
            transform: rotateY(180deg);
        }
        
        .memory-card.flipped .card-front {
            transform: rotateY(180deg);
        }
        
        .memory-card.flipped .card-back {
            transform: rotateY(0deg);
        }
    `;
    document.head.appendChild(style);
    
    // Game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let gameStarted = false;
    let gameActive = true;
    let timer = 0;
    let timerInterval = null;
    
    const emojis = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎪', '🎵', '⭐'];
    const cardPairs = [...emojis, ...emojis]; // Duplicate for pairs
    
    function updateGameInfo() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        gameInfo.innerHTML = `
            <div>Time: ${timeString} | Moves: ${moves} | Pairs: ${matchedPairs}/8</div>
            <div>Click cards to flip and find matching pairs!</div>
        `;
    }
    
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    function createGame() {
        const shuffledCards = shuffleArray(cardPairs);
        gameArea.innerHTML = '';
        cards = [];
        
        shuffledCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.id = index;
            card.dataset.emoji = emoji;
            
            card.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${emoji}</div>
            `;
            
            card.addEventListener('click', () => flipCard(index));
            gameArea.appendChild(card);
            cards.push({
                element: card,
                emoji: emoji,
                flipped: false,
                matched: false
            });
        });
    }
    
    function flipCard(index) {
        if (!gameActive) return;
        
        const card = cards[index];
        
        // Can't flip if already flipped, matched, or if two cards are already flipped
        if (card.flipped || card.matched || flippedCards.length === 2) return;
        
        // Start timer on first move
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }
        
        // Flip the card
        card.flipped = true;
        card.element.classList.add('flipped');
        flippedCards.push(index);
        
        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            checkForMatch();
        }
        
        updateGameInfo();
    }
    
    function checkForMatch() {
        const [firstIndex, secondIndex] = flippedCards;
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];
        
        if (firstCard.emoji === secondCard.emoji) {
            // Match found!
            setTimeout(() => {
                firstCard.matched = true;
                secondCard.matched = true;
                firstCard.element.classList.add('matched');
                secondCard.element.classList.add('matched');
                
                matchedPairs++;
                flippedCards = [];
                
                // Check for game completion
                if (matchedPairs === 8) {
                    endGame();
                }
            }, 500);
        } else {
            // No match - flip cards back
            setTimeout(() => {
                firstCard.flipped = false;
                secondCard.flipped = false;
                firstCard.element.classList.remove('flipped');
                secondCard.element.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
    
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            updateGameInfo();
        }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    function endGame() {
        gameActive = false;
        stopTimer();
        
        setTimeout(() => {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            alert(`🎉 Congratulations! You completed the memory game!\n\nTime: ${timeString}\nMoves: ${moves}`);
            
            // Calculate score based on time and moves (lower is better)
            const baseScore = 100;
            const timeBonus = Math.max(0, 180 - timer); // Bonus for completing under 3 minutes
            const moveBonus = Math.max(0, 50 - moves); // Bonus for fewer moves
            const totalScore = baseScore + timeBonus + moveBonus;
            
            if (typeof onGameComplete === 'function') {
                onGameComplete(totalScore);
            }
        }, 1000);
    }
    
    function resetGame() {
        gameActive = true;
        gameStarted = false;
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        timer = 0;
        stopTimer();
        createGame();
        updateGameInfo();
    }
    
    // Cleanup function
    const cleanup = () => {
        stopTimer();
    };
    
    container.cleanup = cleanup;
    
    // Initialize game
    createGame();
    updateGameInfo();
    
    // Add reset functionality
    container.resetGame = resetGame;
}
