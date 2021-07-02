export const CANVAS_WIDTH = 560;
export const CANVAS_HEIGHT = 700;
export const BLOCK_SIZE = 35;
export const ROW_COUNT = parseInt(CANVAS_HEIGHT / BLOCK_SIZE);
export const COLUMN_COUNT = parseInt(CANVAS_WIDTH / BLOCK_SIZE);
export const GRID_SIZE = BLOCK_SIZE;
export const MOVE_SPEED = 3.5;
export const MOVE_SPEED_DOWN = 1;

export const COLORS = ["red","pink","orange"];

export class TetrisUtility {
    static grid = [];
    
    static initTetrisArray() {
        for(let i = 0; i < ROW_COUNT;i++) {
            TetrisUtility.grid.push(Array(COLUMN_COUNT).fill(false) );
        }
    }

    static getGridPosition(posX,posY) {
        const arrayX = Math.round(posX / (CANVAS_WIDTH / COLUMN_COUNT) );
        const arrayY = Math.round(posY / (CANVAS_HEIGHT / ROW_COUNT) );
        
        return [arrayX,arrayY];
    }

    static setGridBlock(posX,posY) {
        TetrisUtility.grid[posX][posY] = true;
    }

    static groundCollisionCheck(posX,posY) {
        const [gridPositionX,gridPositionY] = TetrisUtility.getGridPosition(posX,posY);

        if (TetrisUtility.grid[gridPositionX][gridPositionY]) {
            if (gridPositionY <= 1) {
                console.log("game over");
            }
            return true;
        }

        return gridPositionY >= ROW_COUNT;
    }
}