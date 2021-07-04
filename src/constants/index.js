export const CANVAS_WIDTH = 560;
export const CANVAS_HEIGHT = 700;
export const BLOCK_SIZE = 35;
export const ROW_COUNT = parseInt(CANVAS_HEIGHT / BLOCK_SIZE);
export const COLUMN_COUNT = parseInt(CANVAS_WIDTH / BLOCK_SIZE);
export const GRID_SIZE = BLOCK_SIZE;
export const MOVE_SPEED = 3.5;
export const MOVE_SPEED_DOWN = 0.2;
export const MOVE_SPEED_DOWN_FAST = 3;

export const COLORS = ["red","pink","orange","blue","green","purple"];

export const BLOCKS = [
    [
        [
            [0,0],
            [-BLOCK_SIZE,0],
            [-BLOCK_SIZE * 2,0],
            [BLOCK_SIZE,0]
        ],
        [
            [0,0],
            [0,-BLOCK_SIZE],
            [0,BLOCK_SIZE],
            [0,-BLOCK_SIZE * 2],
        ]
    ],
    [
        [
            [0,0],
            [BLOCK_SIZE,0],
            [0,BLOCK_SIZE],
            [BLOCK_SIZE,BLOCK_SIZE]
        ]
    ],
    [
        [
            [0,0],
            [-BLOCK_SIZE,0],
            [BLOCK_SIZE,-BLOCK_SIZE],
            [BLOCK_SIZE,0]
        ],
        [
            [0,0],
            [0,-BLOCK_SIZE],
            [0,BLOCK_SIZE],
            [BLOCK_SIZE,BLOCK_SIZE]
        ],
        [
            [0,0],
            [BLOCK_SIZE,0],
            [-BLOCK_SIZE,0],
            [-BLOCK_SIZE,BLOCK_SIZE]
        ],
        [
            [0,0],
            [0,-BLOCK_SIZE],
            [-BLOCK_SIZE,-BLOCK_SIZE],
            [0,BLOCK_SIZE]
        ]
    ],
    [
        [
            [0,0],
            [-BLOCK_SIZE,0],
            [-BLOCK_SIZE,-BLOCK_SIZE],
            [BLOCK_SIZE,0]
        ],
        [
            [0,0],
            [BLOCK_SIZE,0],
            [0,-BLOCK_SIZE],
            [0,-BLOCK_SIZE * 2]
        ],
        [
            [0,-BLOCK_SIZE],
            [-BLOCK_SIZE,-BLOCK_SIZE],
            [BLOCK_SIZE,-BLOCK_SIZE],
            [-BLOCK_SIZE,0]
        ],
        [
            [0,0],
            [0,-BLOCK_SIZE],
            [-BLOCK_SIZE,-BLOCK_SIZE],
            [0,BLOCK_SIZE]
        ]
    ],
    [
        [
            [0,0],
            [-BLOCK_SIZE,0],
            [0,BLOCK_SIZE],
            [BLOCK_SIZE,BLOCK_SIZE]
        ],
        [
            [0,0],
            [-BLOCK_SIZE,0],
            [-BLOCK_SIZE,BLOCK_SIZE],
            [0,-BLOCK_SIZE]
        ]
    ],
    [
        [
            [0,0],
            [BLOCK_SIZE,0],
            [0,BLOCK_SIZE],
            [-BLOCK_SIZE,BLOCK_SIZE]
        ],
        [
            [0,0],
            [0,BLOCK_SIZE],
            [-BLOCK_SIZE,0],
            [-BLOCK_SIZE,-BLOCK_SIZE]
        ]
    ],
    [
        [
            [0,0],
            [BLOCK_SIZE,0],
            [-BLOCK_SIZE,0],
            [0,-BLOCK_SIZE]
        ],
        [
            [0,0],
            [0,BLOCK_SIZE],
            [0,-BLOCK_SIZE],
            [BLOCK_SIZE,0]
        ],
        [
            [0,0],
            [0,-BLOCK_SIZE],
            [BLOCK_SIZE,-BLOCK_SIZE],
            [-BLOCK_SIZE,-BLOCK_SIZE]
        ],
        [
            [0,0],
            [0,BLOCK_SIZE],
            [0,-BLOCK_SIZE],
            [-BLOCK_SIZE,0]
        ]
    ]
];

export const delay = time => new Promise(resolve => setTimeout(resolve,time));

export class TetrisUtility {
    static grid = [];
    
    static initTetrisArray() {
        TetrisUtility.grid = [];
        for(let i = 0; i < ROW_COUNT;i++) {
            TetrisUtility.grid.push(Array(COLUMN_COUNT).fill(null) );
        }
    }

    static constrain(num,min,max) {
        return num < min ? min : num > max ? max : num;
    }

    static convertToInteger(num) {
        return parseInt(num.replace(new RegExp(/[\D]+/g),"") );
    }

    static getGridPosition(posX,posY) {
        const arrayX = TetrisUtility.constrain(Math.round(posX / (CANVAS_WIDTH / COLUMN_COUNT) ),0,COLUMN_COUNT);
        const arrayY = TetrisUtility.constrain(Math.round(posY / (CANVAS_HEIGHT / ROW_COUNT) ),0,ROW_COUNT);
        
        return [arrayX,arrayY];
    }

    static setGridBlock(block,posX,posY) {
        TetrisUtility.grid[posX][posY] = block;
    }

    static groundCollisionCheck(posX,posY,blockArray) {
        for(const [i,pos] of blockArray.entries() ) {
            const [gridPositionX,gridPositionY] = TetrisUtility.getGridPosition(posX + pos[0],posY + pos[1]);

            if (TetrisUtility.grid[gridPositionX][gridPositionY]) {
                if (gridPositionY <= 1) {
                    //Game Over
                    return [-1,-1];
                }
                return [pos,i,gridPositionX];
            }

            if (gridPositionY >= ROW_COUNT) {
                return [pos,i];
            }
        }

        return null;
    }

    static getRandomBlock() {
        return (Math.round(Math.random() * (BLOCKS.length - 1)));
    }

    static getRowsToClear() {
        let rows = [];
        for(let i = 0; i < ROW_COUNT;i++) {
            let count = 0;
            for(let j = 0; j < COLUMN_COUNT;j++) {
                if (TetrisUtility.grid[j][i]) {
                    count++;
                }
            }

            if (count >= COLUMN_COUNT) {
                rows.push(i);
            }
        }

        return rows;
    }

    static getPointsForClearing(count) {
        return [40,100,300,1200][TetrisUtility.constrain(count - 1,0,4)];
    }
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}