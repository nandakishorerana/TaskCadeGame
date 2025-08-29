// Tic Tac Toe Game Implementation
function initTicTacToeGame(container) {
    const gameBoard = document.createElement('div');
    gameBoard.className = 'tictactoe-board';
    
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';
    
    container.appendChild(gameInfo);
    container.appendChild(gameBoard);
    
    // Add CSS for Tic Tac Toe
    const style = document.createElement('style');
    style.textContent = `
        .tictactoe-board {
            display: grid;
            grid-template-columns: repeat(3, 80px);
            grid-template-rows: repeat(3, 80px);
            gap: 5px;
            justify-content: center;
            margin: 20px 0;
        }
        
        .tictactoe-cell {
            background: #f7fafc;
            border: 2px solid #667eea;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .tictactoe-cell:hover {
            background: #e2e8f0;
            transform: scale(1.05);
        }
        
        .tictactoe-cell.disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        .tictactoe-cell.x {
            color: #667eea;
        }
        
        .tictactoe-cell.o {
            color: #f56565;
        }
    `;
    document.head.appendChild(style);
    
    // Game state
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameActive = true;
    let playerScore = 0;
    let computerScore = 0;
    let isPlayerTurn = true;
    
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    
    function updateGameInfo() {
        const status = gameActive ? 
            (isPlayerTurn ? "Your turn (X)" : "Computer's turn (O)") :
            "Game Over";
        
        gameInfo.innerHTML = `
            <div class="game-score">Player: ${playerScore} | Computer: ${computerScore}</div>
            <div>${status}</div>
        `;
    }
    
    function createBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'tictactoe-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => makeMove(i));
            gameBoard.appendChild(cell);
        }
    }
    
    function makeMove(index) {
        if (!gameActive || board[index] !== '' || !isPlayerTurn) return;
        
        board[index] = 'X';
        updateBoard();
        
        if (checkWinner('X')) {
            endGame('Player wins!');
            playerScore++;
            return;
        }
        
        if (board.every(cell => cell !== '')) {
            endGame("It's a tie!");
            return;
        }
        
        isPlayerTurn = false;
        updateGameInfo();
        
        // Computer move after delay
        setTimeout(computerMove, 500);
    }
    
    function computerMove() {
        if (!gameActive) return;
        
        // Simple AI: Try to win, block player, or take center/corner
        let move = findBestMove();
        
        board[move] = 'O';
        updateBoard();
        
        if (checkWinner('O')) {
            endGame('Computer wins!');
            computerScore++;
            return;
        }
        
        if (board.every(cell => cell !== '')) {
            endGame("It's a tie!");
            return;
        }
        
        isPlayerTurn = true;
        updateGameInfo();
    }
    
    function findBestMove() {
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (checkWinner('O')) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        // Block player from winning
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (checkWinner('X')) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        // Take center if available
        if (board[4] === '') return 4;
        
        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available space
        const available = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return available[Math.floor(Math.random() * available.length)];
    }
    
    function updateBoard() {
        const cells = gameBoard.querySelectorAll('.tictactoe-cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.className = 'tictactoe-cell';
            if (board[index] !== '') {
                cell.classList.add(board[index].toLowerCase());
                cell.classList.add('disabled');
            }
        });
    }
    
    function checkWinner(player) {
        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === player)
        );
    }
    
    function endGame(message) {
        gameActive = false;
        updateGameInfo();
        
        setTimeout(() => {
            alert(message);
            
            // Award points based on result
            let points = 0;
            if (message.includes('Player wins')) {
                points = 25;
            } else if (message.includes('tie')) {
                points = 10;
            } else {
                points = 5; // Participation points
            }
            
            if (typeof onGameComplete === 'function') {
                onGameComplete(points);
            }
        }, 500);
    }
    
    function resetGame() {
        board = Array(9).fill('');
        gameActive = true;
        isPlayerTurn = true;
        createBoard();
        updateGameInfo();
    }
    
    // Initialize game
    createBoard();
    updateGameInfo();
    
    // Add reset button functionality
    container.resetGame = resetGame;
}
