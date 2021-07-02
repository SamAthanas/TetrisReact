export const CANVAS_WIDTH = 560;
export const CANVAS_HEIGHT = 750;
export const BLOCK_SIZE = 35;
export const ROW_COUNT = parseInt(CANVAS_HEIGHT / BLOCK_SIZE);
export const COLUMN_COUNT = parseInt(CANVAS_WIDTH / BLOCK_SIZE);
export const GRID_SIZE = BLOCK_SIZE;
export const MOVE_SPEED = 3.5;

export class TetrisUtility {
    static grid = [];
    
    static initTetrisArray() {
        for(let i = 0; i < ROW_COUNT;i++) {
            TetrisUtility.grid.push(Array(COLUMN_COUNT).fill(false) );
        }
    }

    static getGridPosition(posX,posY) {
        const arrayX = Math.floor(posX / (CANVAS_WIDTH / COLUMN_COUNT) );
        const arrayY = Math.floor(posY / (CANVAS_HEIGHT / ROW_COUNT) );
        
        return [arrayX,arrayY];
    }

    static groundCollisionCheck(posY) {
        const [,gridPositionY] = TetrisUtility.getGridPosition(0,posY + 10);

        return gridPositionY >= ROW_COUNT;
    }
}