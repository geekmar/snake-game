/**
 * Snake class for the Snake game
 * Handles snake movement, growth, and collision detection
 */

class Snake {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.reset();
    }

    /**
     * Reset the snake to its initial state
     */
    reset() {
        // Initial position in the center of the board
        const startX = Math.floor(this.boardSize / 2);
        const startY = Math.floor(this.boardSize / 2);
        
        // Initial snake with 3 segments
        this.body = [
            { x: startX, y: startY },
            { x: startX, y: startY + 1 },
            { x: startX, y: startY + 2 }
        ];
        
        // Initial direction (moving up)
        this.direction = 'up';
        this.nextDirection = 'up';
        
        // Growth flag
        this.shouldGrow = false;
    }

    /**
     * Move the snake in the current direction
     */
    move() {
        // Update direction based on nextDirection
        this.direction = this.nextDirection;
        
        // Create a new head based on current direction
        const head = { ...this.body[0] };
        
        switch (this.direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Add new head to the beginning of the body
        this.body.unshift(head);
        
        // Check if the snake should grow
        if (this.shouldGrow) {
            // Reset the growth flag
            this.shouldGrow = false;
            // Don't remove the tail segment, effectively growing the snake
            return null;
        } else {
            // Remove the last segment (tail) and return it
            return this.body.pop();
        }
    }

    /**
     * Grow the snake by keeping the last segment
     */
    grow() {
        // Set the flag to indicate the snake should grow on the next move
        this.shouldGrow = true;
    }

    /**
     * Change the snake's direction
     * Prevents 180-degree turns
     */
    changeDirection(newDirection) {
        // Prevent 180-degree turns
        switch (newDirection) {
            case 'up':
                if (this.direction !== 'down') {
                    this.nextDirection = 'up';
                }
                break;
            case 'down':
                if (this.direction !== 'up') {
                    this.nextDirection = 'down';
                }
                break;
            case 'left':
                if (this.direction !== 'right') {
                    this.nextDirection = 'left';
                }
                break;
            case 'right':
                if (this.direction !== 'left') {
                    this.nextDirection = 'right';
                }
                break;
        }
    }

    /**
     * Check if the snake has collided with the walls
     */
    checkWallCollision() {
        const head = this.body[0];
        return (
            head.x < 0 || 
            head.x >= this.boardSize || 
            head.y < 0 || 
            head.y >= this.boardSize
        );
    }

    /**
     * Check if the snake has collided with itself
     */
    checkSelfCollision() {
        const head = this.body[0];
        
        // Check if head collides with any part of the body (except the head itself)
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get the current snake body
     */
    getBody() {
        return this.body;
    }

    /**
     * Get the snake's head position
     */
    getHead() {
        return this.body[0];
    }
}