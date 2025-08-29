// Rock Paper Scissors Game Implementation
function initRockPaperScissorsGame(container) {
    const gameArea = document.createElement('div');
    gameArea.className = 'rps-game';
    
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';
    
    container.appendChild(gameInfo);
    container.appendChild(gameArea);
    
    // Add CSS for Rock Paper Scissors
    const style = document.createElement('style');
    style.textContent = `
        .rps-game {
            text-align: center;
            padding: 20px;
        }
        
        .rps-choices {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }
        
        .rps-choice {
            width: 80px;
            height: 80px;
            border: 3px solid #667eea;
            border-radius: 50%;
            background: #f7fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .rps-choice:hover {
            background: #667eea;
            color: white;
            transform: scale(1.1);
        }
        
        .rps-choice.selected {
            background: #667eea;
            color: white;
        }
        
        .rps-result {
            margin: 20px 0;
            padding: 20px;
            background: #f7fafc;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
        }
        
        .rps-battle {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 20px 0;
            font-size: 3rem;
        }
        
        .rps-vs {
            font-size: 1.5rem;
            color: #666;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    
    // Game state
    let playerScore = 0;
    let computerScore = 0;
    let rounds = 0;
    let gameHistory = [];
    
    const choices = [
        { name: 'rock', emoji: '🪨', beats: 'scissors' },
        { name: 'paper', emoji: '📄', beats: 'rock' },
        { name: 'scissors', emoji: '✂️', beats: 'paper' }
    ];
    
    function updateGameInfo() {
        gameInfo.innerHTML = `
            <div class="game-score">Player: ${playerScore} | Computer: ${computerScore}</div>
            <div>Choose your weapon!</div>
        `;
    }
    
    function createGame() {
        gameArea.innerHTML = `
            <div class="rps-choices">
                ${choices.map(choice => `
                    <div class="rps-choice" data-choice="${choice.name}" title="${choice.name}">
                        ${choice.emoji}
                    </div>
                `).join('')}
            </div>
            <div class="rps-result" id="rpsResult" style="display: none;">
                <div class="rps-battle">
                    <div id="playerChoice"></div>
                    <div class="rps-vs">VS</div>
                    <div id="computerChoice"></div>
                </div>
                <div id="roundResult"></div>
            </div>
        `;
        
        // Add click listeners
        gameArea.querySelectorAll('.rps-choice').forEach(choice => {
            choice.addEventListener('click', () => playRound(choice.dataset.choice));
        });
    }
    
    function playRound(playerChoice) {
        const computerChoice = choices[Math.floor(Math.random() * choices.length)].name;
        rounds++;
        
        // Show choices
        const playerChoiceObj = choices.find(c => c.name === playerChoice);
        const computerChoiceObj = choices.find(c => c.name === computerChoice);
        
        document.getElementById('playerChoice').textContent = playerChoiceObj.emoji;
        document.getElementById('computerChoice').textContent = computerChoiceObj.emoji;
        
        // Determine winner
        let result = '';
        let resultClass = '';
        
        if (playerChoice === computerChoice) {
            result = "It's a tie!";
            resultClass = 'tie';
        } else if (playerChoiceObj.beats === computerChoice) {
            result = "You win this round!";
            resultClass = 'win';
            playerScore++;
        } else {
            result = "Computer wins this round!";
            resultClass = 'lose';
            computerScore++;
        }
        
        document.getElementById('roundResult').innerHTML = `
            <div class="result-${resultClass}">${result}</div>
        `;
        
        document.getElementById('rpsResult').style.display = 'block';
        
        // Update game history
        gameHistory.push({
            round: rounds,
            playerChoice,
            computerChoice,
            result: resultClass
        });
        
        updateGameInfo();
        
        // Check for game end (best of 5)
        if (rounds >= 5) {
            setTimeout(endGame, 1500);
        } else {
            // Reset for next round
            setTimeout(() => {
                document.getElementById('rpsResult').style.display = 'none';
            }, 2000);
        }
    }
    
    function endGame() {
        let finalResult = '';
        let points = 0;
        
        if (playerScore > computerScore) {
            finalResult = `🎉 You won the match! (${playerScore}-${computerScore})`;
            points = 30;
        } else if (computerScore > playerScore) {
            finalResult = `💻 Computer won the match! (${computerScore}-${playerScore})`;
            points = 10;
        } else {
            finalResult = `🤝 It's a tie match! (${playerScore}-${computerScore})`;
            points = 15;
        }
        
        alert(finalResult);
        
        if (typeof onGameComplete === 'function') {
            onGameComplete(points);
        }
    }
    
    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        rounds = 0;
        gameHistory = [];
        createGame();
        updateGameInfo();
    }
    
    // Initialize game
    createGame();
    updateGameInfo();
    
    // Add reset functionality
    container.resetGame = resetGame;
}
