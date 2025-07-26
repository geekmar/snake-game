/**
 * Main Game controller for the Snake game
 * Handles game loop, state management, and user interactions
 */

class Game {
    constructor() {
        this.boardSize = 20;
        this.snake = new Snake(this.boardSize);
        this.food = new Food(this.boardSize);
        this.score = 0;
        this.speed = 150; // milliseconds between moves
        this.gameState = 'start'; // 'start', 'playing', 'paused', 'game-over'
        this.gameLoop = null;
        
        this.initializeElements();
        this.initializeBoard();
        this.attachEventListeners();
        this.updateUI();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
       this.boardElement = document.getElementById('game-board');
       this.scoreElement = document.getElementById('score-value');
       this.gameOverScreen = document.getElementById('game-over');
       this.finalScoreElement = document.getElementById('final-score');
       this.startButton = document.getElementById('start-btn');
       this.pauseButton = document.getElementById('pause-btn');
       this.restartButton = document.getElementById('restart-btn');
       this.playAgainButton = document.getElementById('play-again-btn');
   }

    /**
     * Initialize the game board
     */
    initializeBoard() {
        Board.init();
    }

    /**
     * Attach event listeners for buttons and keyboard
     */
    attachEventListeners() {
       // Button event listeners
       this.startButton.addEventListener('click', () => this.start());
       this.pauseButton.addEventListener('click', () => this.togglePause());
       this.restartButton.addEventListener('click', () => this.restart());
       this.playAgainButton.addEventListener('click', () => this.restart());
       
       // Keyboard event listener
       document.addEventListener('keydown', (e) => this.handleKeyPress(e));
       
       // Touch event listeners for mobile
       this.addTouchControls();
   }

    /**
     * Start the game
     */
    start() {
        if (this.gameState === 'start' || this.gameState === 'game-over') {
            this.reset();
        }
        this.gameState = 'playing';
        this.updateUI();
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            clearInterval(this.gameLoop);
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.gameLoop = setInterval(() => this.update(), this.speed);
        }
        this.updateUI();
    }

    /**
     * Restart the game
     */
    restart() {
        clearInterval(this.gameLoop);
        this.reset();
        this.start();
    }

    /**
     * Reset the game to initial state
     */
    reset() {
        this.snake.reset();
        this.food.reset();
        this.score = 0;
        this.speed = 150;
        this.gameState = 'playing';
        this.updateScore();
    }

    /**
     * Main game update function
     */
    update() {
        if (this.gameState !== 'playing') return;
        
        // Move the snake
        const removedSegment = this.snake.move();
        
        // Check if snake ate food
        const head = this.snake.getHead();
        const foodPosition = this.food.getPosition();
        
        if (head.x === foodPosition.x && head.y === foodPosition.y) {
            // Snake ate food
            this.snake.grow();
            this.food.place(this.snake.getBody());
            this.score += 10;
            this.updateScore();
            
            // Increase speed every 50 points
            if (this.score % 50 === 0 && this.speed > 50) {
                this.speed -= 10;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        }
        
        // Check for collisions
        if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
            this.gameOver();
            return;
        }
        
        // Render the game state
        Board.render(this.snake.getBody(), this.food.getPosition());
    }

    /**
     * Handle game over state
     */
    gameOver() {
        this.gameState = 'game-over';
        clearInterval(this.gameLoop);
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.style.display = 'flex';
        this.updateUI();
    }

    /**
     * Handle keyboard input
     */
    handleKeyPress(e) {
        // Prevent default behavior for arrow keys to avoid page scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Handle pause/resume keys
        if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            this.togglePause();
            return;
        }
        
        // Only handle direction keys when game is playing
        if (this.gameState !== 'playing') return;
        
        switch (e.key) {
            case 'ArrowUp':
                this.snake.changeDirection('up');
                break;
            case 'ArrowDown':
                this.snake.changeDirection('down');
                break;
            case 'ArrowLeft':
                this.snake.changeDirection('left');
                break;
            case 'ArrowRight':
                this.snake.changeDirection('right');
                break;
        }
   }

   /**
    * Add touch controls for mobile devices
    */
   addTouchControls() {
       let touchStartX = 0;
       let touchStartY = 0;

       // Add touch event listeners
       this.boardElement.addEventListener('touchstart', (e) => {
           touchStartX = e.touches[0].clientX;
           touchStartY = e.touches[0].clientY;
           e.preventDefault();
       }, { passive: false });

       this.boardElement.addEventListener('touchmove', (e) => {
           e.preventDefault();
       }, { passive: false });

       this.boardElement.addEventListener('touchend', (e) => {
           if (this.gameState !== 'playing') return;
           
           const touchEndX = e.changedTouches[0].clientX;
           const touchEndY = e.changedTouches[0].clientY;
           
           const dx = touchEndX - touchStartX;
           const dy = touchEndY - touchStartY;
           
           // Determine swipe direction based on greatest distance
           if (Math.abs(dx) > Math.abs(dy)) {
               // Horizontal swipe
               if (dx > 0) {
                   this.snake.changeDirection('right');
               } else {
                   this.snake.changeDirection('left');
               }
           } else {
               // Vertical swipe
               if (dy > 0) {
                   this.snake.changeDirection('down');
               } else {
                   this.snake.changeDirection('up');
               }
           }
           
           e.preventDefault();
       }, { passive: false });
   }

   /**
    * Update the score display
     */
    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    /**
     * Update UI elements based on game state
     */
    updateUI() {
        // Update button states
        if (this.gameState === 'playing') {
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
            this.restartButton.disabled = false;
            this.pauseButton.textContent = 'Pause';
        } else if (this.gameState === 'paused') {
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
            this.restartButton.disabled = false;
            this.pauseButton.textContent = 'Resume';
        } else if (this.gameState === 'start' || this.gameState === 'game-over') {
            this.startButton.disabled = false;
            this.pauseButton.disabled = true;
            this.restartButton.disabled = false;
        }
        
        // Update game over screen
        if (this.gameState === 'game-over') {
            this.gameOverScreen.style.display = 'flex';
        } else {
            this.gameOverScreen.style.display = 'none';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});