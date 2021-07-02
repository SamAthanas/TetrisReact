export const CANVAS_WIDTH = 560;
export const CANVAS_HEIGHT = 700;
export const BLOCK_SIZE = 35;
export const ROW_COUNT = parseInt(CANVAS_HEIGHT / BLOCK_SIZE);
export const COLUMN_COUNT = parseInt(CANVAS_WIDTH / BLOCK_SIZE);
export const GRID_SIZE = BLOCK_SIZE;
export const MOVE_SPEED = 3.5;
export const MOVE_SPEED_DOWN = 1;

export const COLORS = ["red","pink","orange","blue"];

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

export class TetrisUtility {
    static grid = [];
    
    static initTetrisArray() {
        for(let i = 0; i < ROW_COUNT;i++) {
            TetrisUtility.grid.push(Array(COLUMN_COUNT).fill(false) );
        }
    }

    static constrain(num,min,max) {
        return num < min ? min : num > max ? max : num;
    }

    static getGridPosition(posX,posY) {
        const arrayX = TetrisUtility.constrain(Math.round(posX / (CANVAS_WIDTH / COLUMN_COUNT) ),0,COLUMN_COUNT);
        const arrayY = TetrisUtility.constrain(Math.round(posY / (CANVAS_HEIGHT / ROW_COUNT) ),0,ROW_COUNT);
        
        return [arrayX,arrayY];
    }

    static setGridBlock(posX,posY) {
        TetrisUtility.grid[posX][posY] = true;
    }

    static groundCollisionCheck(posX,posY,blockArray) {
        for(const [i,pos] of blockArray.entries() ) {
            const [gridPositionX,gridPositionY] = TetrisUtility.getGridPosition(posX + pos[0],posY + pos[1]);

            if (TetrisUtility.grid[gridPositionX][gridPositionY]) {
                if (gridPositionY <= 1) {
                    console.log("game over");
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
        return (Math.round(Math.random() ) * (BLOCKS.length - 1));
    }
}