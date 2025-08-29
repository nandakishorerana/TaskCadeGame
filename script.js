// Game Data Management
let gameData = {
    level: 1,
    points: 0,
    experience: 0,
    tasksCompleted: 0,
    gamesPlayed: 0,
    unlockedGames: ['snake']
};

let tasks = [];
let currentUser = null;
let currentGame = null;

// Initialize the application
function init() {
    loadUserData();
    loadGameData();
    loadTasks();
    updateUI();
    updateGameUnlocks();
    
    // Add event listeners
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

// User Management
function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        showUserInterface();
    } else {
        hideUserInterface();
    }
}

function showUserInterface() {
    if (currentUser) {
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('username').textContent = currentUser.username;
        document.getElementById('statsPanel').style.display = 'flex';
    }
}

function hideUserInterface() {
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('statsPanel').style.display = 'none';
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    hideUserInterface();
    // Reset game data for demo purposes
    gameData = {
        level: 1,
        points: 0,
        experience: 0,
        tasksCompleted: 0,
        gamesPlayed: 0,
        unlockedGames: ['snake']
    };
    tasks = [];
    updateUI();
    updateGameUnlocks();
}

// Game Data Management
function loadGameData() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        gameData = { ...gameData, ...JSON.parse(savedData) };
    }
    
    // Ensure at least Snake is unlocked
    if (!gameData.unlockedGames || gameData.unlockedGames.length === 0) {
        gameData.unlockedGames = ['snake'];
    }
}

function saveGameData() {
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function addPoints(points) {
    gameData.points += points;
    gameData.experience += points;
    
    // Check for level up
    const experienceNeeded = gameData.level * 100;
    if (gameData.experience >= experienceNeeded) {
        levelUp();
    }
    
    saveGameData();
    updateUI();
    updateGameUnlocks();
}

function levelUp() {
    gameData.level++;
    gameData.experience = 0;
    
    // Show level up celebration
    showCelebration(`Level Up! You're now level ${gameData.level}!`, 50);
    
    // Unlock new games based on level
    unlockGamesByLevel();
}

function unlockGamesByLevel() {
    const gameUnlocks = {
        1: 'snake',
        2: 'tictactoe',
        3: 'rockpaperscissors',
        4: 'flappysquare',
        5: 'memoryflip'
    };
    
    const newGame = gameUnlocks[gameData.level];
    if (newGame && !gameData.unlockedGames.includes(newGame)) {
        gameData.unlockedGames.push(newGame);
        showCelebration(`New Game Unlocked: ${getGameDisplayName(newGame)}!`, 25);
    }
}

function getGameDisplayName(gameId) {
    const names = {
        snake: 'Snake Game',
        tictactoe: 'Tic Tac Toe',
        rockpaperscissors: 'Rock Paper Scissors',
        flappysquare: 'Flappy Square',
        memoryflip: 'Memory Flip'
    };
    return names[gameId] || gameId;
}

// Task Management
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    input.value = '';
    saveTasks();
    renderTasks();
    
    // Add animation
    setTimeout(() => {
        const taskElement = document.querySelector('.task-item');
        if (taskElement) {
            taskElement.classList.add('slide-up');
        }
    }, 100);
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        
        if (task.completed) {
            // Task completed - celebrate!
            gameData.tasksCompleted++;
            addPoints(10);
            showTaskCompletionCelebration();
            triggerConfetti();
            
        }
        
        saveTasks();
        saveGameData();
        renderTasks();
        updateUI();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const completedToday = tasks.filter(t => t.completed && isToday(new Date(t.createdAt))).length;
    
    document.getElementById('completedTasks').textContent = completedToday;
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                <h3>No tasks yet!</h3>
                <p>Add your first task to start your productivity journey.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// UI Updates
function updateUI() {
    if (!currentUser) return;
    
    document.getElementById('playerLevel').textContent = gameData.level;
    document.getElementById('playerPoints').textContent = gameData.points;
    
    // Update progress bar
    const experienceNeeded = gameData.level * 100;
    const progressPercent = (gameData.experience / experienceNeeded) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressText').textContent = `${gameData.experience}/${experienceNeeded} XP`;
}

function updateGameUnlocks() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameId = card.dataset.game;
        const requiredLevel = parseInt(card.dataset.level);
        const button = card.querySelector('.btn-game');
        
        if (gameData.level >= requiredLevel || gameData.unlockedGames.includes(gameId)) {
            card.classList.remove('locked');
            card.classList.add('unlocked');
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-play"></i> Play Now';
        } else {
            card.classList.add('locked');
            card.classList.remove('unlocked');
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-lock"></i> Locked';
        }
    });
}

// Celebration and Confetti
function showTaskCompletionCelebration() {
    showCelebration('Task Completed! 🎉', 10);
}

function showCelebration(message, points) {
    const modal = document.getElementById('celebrationModal');
    document.getElementById('celebrationMessage').textContent = message;
    document.getElementById('rewardPoints').textContent = points;
    
    modal.classList.add('show');
    modal.querySelector('.modal-content').classList.add('bounce');
}

function closeCelebrationModal() {
    const modal = document.getElementById('celebrationModal');
    modal.classList.remove('show');
    modal.querySelector('.modal-content').classList.remove('bounce');
}

// Game Management
function playGame(gameId) {
    if (!currentUser) {
        alert('Please sign in to play games!');
        return;
    }
    
    if (!gameData.unlockedGames.includes(gameId) && gameData.level < getRequiredLevel(gameId)) {
        alert('This game is not unlocked yet!');
        return;
    }
    
    currentGame = gameId;
    const modal = document.getElementById('gameModal');
    const gameContainer = document.getElementById('gameContainer');
    const gameTitle = document.getElementById('gameTitle');
    
    gameTitle.textContent = getGameDisplayName(gameId);
    gameContainer.innerHTML = '';
    
    // Load the specific game
    switch (gameId) {
        case 'snake':
            initSnakeGame(gameContainer);
            break;
        case 'tictactoe':
            initTicTacToeGame(gameContainer);
            break;
        case 'rockpaperscissors':
            initRockPaperScissorsGame(gameContainer);
            break;
        case 'flappysquare':
            initFlappySquareGame(gameContainer);
            break;
        case 'memoryflip':
            initMemoryFlipGame(gameContainer);
            break;
        default:
            gameContainer.innerHTML = '<p>Game not found!</p>';
    }
    
    modal.classList.add('show');
    gameData.gamesPlayed++;
    saveGameData();
}

function getRequiredLevel(gameId) {
    const levels = {
        snake: 1,
        tictactoe: 2,
        rockpaperscissors: 3,
        flappysquare: 4,
        memoryflip: 5
    };
    return levels[gameId] || 1;
}

function restartGame() {
    if (currentGame) {
        playGame(currentGame);
    }
}

function closeGameModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('show');
    currentGame = null;
    
    // Stop any running games
    if (window.gameLoop) {
        clearInterval(window.gameLoop);
        window.gameLoop = null;
    }
}

// Profile Management
function showProfile() {
    const modal = document.getElementById('profileModal');
    
    // Update profile information
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileLevel').textContent = gameData.level;
    document.getElementById('profilePoints').textContent = gameData.points;
    document.getElementById('profileTasksCompleted').textContent = gameData.tasksCompleted;
    document.getElementById('profileGamesPlayed').textContent = gameData.gamesPlayed;
    
    modal.classList.add('show');
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('show');
}

// Game completion callback
function onGameComplete(score) {
    const points = Math.max(5, Math.floor(score / 10));
    addPoints(points);
    showCelebration(`Game Complete! Score: ${score}`, points);
}

// Utility Functions
function triggerConfetti() {
    if (typeof createConfetti === 'function') {
        createConfetti();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', init);

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'gameModal') {
            closeGameModal();
        } else if (e.target.id === 'celebrationModal') {
            closeCelebrationModal();
        } else if (e.target.id === 'profileModal') {
            closeProfileModal();
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.getElementById('gameModal').classList.contains('show')) {
            closeGameModal();
        } else if (document.getElementById('celebrationModal').classList.contains('show')) {
            closeCelebrationModal();
        } else if (document.getElementById('profileModal').classList.contains('show')) {
            closeProfileModal();
        }
    }
});
