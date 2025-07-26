/**
 * Food class for the Snake game
 * Handles food placement and collision detection with snake
 */

class Food {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.position = { x: 0, y: 0 };
        this.reset();
    }

    /**
     * Reset food to a random position
     */
    reset() {
        this.position = {
            x: Math.floor(Math.random() * this.boardSize),
            y: Math.floor(Math.random() * this.boardSize)
        };
    }

    /**
     * Place food at a random position that doesn't collide with the snake
     */
    place(snakeBody) {
        let newPosition;
        let collision;
        
        do {
            collision = false;
            newPosition = {
                x: Math.floor(Math.random() * this.boardSize),
                y: Math.floor(Math.random() * this.boardSize)
            };
            
            // Check if new position collides with any part of the snake
            for (const segment of snakeBody) {
                if (segment.x === newPosition.x && segment.y === newPosition.y) {
                    collision = true;
                    break;
                }
            }
        } while (collision);
        
        this.position = newPosition;
    }

    /**
     * Get the current food position
     */
    getPosition() {
        return this.position;
    }
}