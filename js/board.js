/**
 * Board module for the Snake game
 * Handles the game board grid and rendering
 */

const Board = {
    boardSize: 20,
    grid: [],

    /**
     * Initialize the game board
     */
    init() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';
        
        // Create a 20x20 grid
        this.grid = [];
        for (let i = 0; i < this.boardSize; i++) {
            const row = [];
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-x', j);
                cell.setAttribute('data-y', i);
                boardElement.appendChild(cell);
                row.push(cell);
            }
            this.grid.push(row);
        }
    },

    /**
     * Render the game state on the board
     */
    render(snakeBody, foodPosition) {
        // Clear all previous classes
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.grid[i][j].className = 'cell';
            }
        }
        
        // Render snake
        snakeBody.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.grid[segment.y][segment.x].classList.add('snake', 'snake-head');
            } else {
                // Body
                this.grid[segment.y][segment.x].classList.add('snake');
            }
        });
        
        // Render food
        this.grid[foodPosition.y][foodPosition.x].classList.add('food');
    },

    /**
     * Clear the board
     */
    clear() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.grid[i][j].className = 'cell';
            }
        }
    }
};