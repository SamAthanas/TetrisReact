import styles from "./tetris.module.scss";
import Block from "../../components/block";

import { COLORS, BLOCKS, CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_SIZE, GRID_SIZE, MOVE_SPEED, MOVE_SPEED_DOWN, MOVE_SPEED_DOWN_FAST, TetrisUtility, ROW_COUNT, COLUMN_COUNT } from "../../constants";
import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useCallback, useEffect, useRef, useState } from "react";

//TODO, fix glitch if pressing against placed blocks, shoots up to the top of it, invalid target Y!!!
//TODO,see if you can generate the rotated X,Y Coordinates for blocks rather then specifying them, could run a function to do it one time?

export default function Tetris() {
    const [activeBlocks,setActiveBlocks] = useState(null);
    const [gridBlocks,setGridBlocks] = useState([]);

    const [ keysDown ] = UseKeyPress();

    const frameRef = useRef(null);
    const keysRef = useRef(keysDown);
    const positionRef = useRef(0);
    const positionYRef = useRef(0);
    const colorRef = useRef("red");
    const currentBlockIndexRef = useRef(0);
    const currentBlockRotateRef = useRef(0);
    const currentBlockData = useRef({});
    const hardDropRef = useRef(0); // 0 = Off, 1 = On, 2 = held (wait for release)

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect( () => {
        TetrisUtility.initTetrisArray();
    },[]);

    useEffect( () => {
        keysRef.current = keysDown;

        if (keysDown["32"]) {
            const leftCollisionCheck = TetrisUtility.groundCollisionCheck(positionRef.current + currentBlockData.current.leftOffset,positionYRef.current + currentBlockData.current.topOffset,getBlockArray(1) );
            const rightCollisionCheck = TetrisUtility.groundCollisionCheck(positionRef.current + currentBlockData.current.rightOffset,positionYRef.current + + currentBlockData.current.bottomOffset,getBlockArray(1) );
            if (!leftCollisionCheck && !rightCollisionCheck) {
                currentBlockRotateRef.current = (currentBlockRotateRef.current + 1) % BLOCKS[currentBlockIndexRef.current].length;
                recalculcateBlocks();
            }
        }

        const hardDropKeyPressed = keysDown["38"] || keysDown["17"];
        if (hardDropRef.current === 0 && hardDropKeyPressed) {
            hardDropRef.current = 1;
        }
        else if (hardDropRef.current === 2 && !hardDropKeyPressed) {
            hardDropRef.current = 0;
        }
    },[keysDown]);
    
    const getBlockArray = useCallback( offset => {
        const shape = BLOCKS[currentBlockIndexRef.current];
        return shape[(currentBlockRotateRef.current + (offset || 0) ) % shape.length];
    });

    const recalculcateBlocks = useCallback( () => {
        const blockArray = getBlockArray();
        let sizes = [];

        for(let i = 0; i < 2;i++) {
            sizes.push([...blockArray].reduce( (acc,elem) => {
                if (elem[i] < acc[0]) {
                    return [elem[i],acc[1]];
                }

                if (elem[i] > acc[1]) {
                    return [acc[0],elem[i]];
                }

                return acc;
            },[0,0]));
        }

        currentBlockData.current = {
            leftOffset:sizes[0][0],
            rightOffset:sizes[0][1],
            topOffset:sizes[1][0],
            bottomOffset:sizes[1][1]
        };

        rightWallCollisionCheck();
        leftWallCollisionCheck();
    });

    const rightWallCollisionCheck = useCallback( () => {
        if (positionRef.current + currentBlockData.current.rightOffset > CANVAS_WIDTH - BLOCK_SIZE) {
            positionRef.current = CANVAS_WIDTH - BLOCK_SIZE - currentBlockData.current.rightOffset;
            return true;
        }

        return false;
    })

    const leftWallCollisionCheck = useCallback( () => {
        if (positionRef.current + currentBlockData.current.leftOffset < 0) {
            positionRef.current = 0 - currentBlockData.current.leftOffset;
            return true;
        }

        return false;
    })

    const moveBlocks = useCallback( (target,movingLeft,movingRight) => {
        if (movingRight) {
            if (!rightWallCollisionCheck() ) {
                if (!TetrisUtility.groundCollisionCheck(positionRef.current + BLOCK_SIZE,positionYRef.current,getBlockArray() )) {
                    positionRef.current += MOVE_SPEED;
                    return;
                }
            }
        }
        
        else if (movingLeft) {
            if (!leftWallCollisionCheck() ) {
                if (!TetrisUtility.groundCollisionCheck(positionRef.current - BLOCK_SIZE,positionYRef.current,getBlockArray() )) {
                    positionRef.current -= MOVE_SPEED;
                    return;
                }
            }
        }
        
        positionRef.current += (target - positionRef.current) * 0.05;
    });

    const clearRows = () => {
        const rows = TetrisUtility.getRowsToClear();
        if (rows) {
            for(const row of rows) {
                for(let i = 0; i < COLUMN_COUNT;i++) {
                    TetrisUtility.grid[i][row] = null;
                }
                document.querySelectorAll(`.y${row}`).forEach(elem => {
                    elem.classList.add("destroy");
                })
            }

            //!Need to move everything above the destroyed row down one!!!!
            
            setTimeout( () => setGridBlocks(prev => [...prev.filter(elem => !rows.includes(parseInt(elem.props.className.replace(new RegExp(/[\D]+/g),""))))]),650);
        }
    }
    
    useEffect( () => {

        const selectNextBlock = () => {
            const blockIndex = TetrisUtility.getRandomBlock();
            currentBlockIndexRef.current = blockIndex;

            recalculcateBlocks();
        }

        const animate = () => {
            const movingLeft = keysRef.current["37"] || keysRef.current["65"];
            const movingRight = keysRef.current["39"] || keysRef.current["68"];
            const movingDown = keysRef.current["40"] || keysRef.current["83"];

            const blockArray = getBlockArray();

            if (isNaN(positionRef.current) ) {
                positionRef.current = CANVAS_WIDTH / 2;
            }
            let target = Math.round(positionRef.current / GRID_SIZE) * GRID_SIZE;

            const targetY = ( () => {
                return blockArray.map(pos => {
                    const gridPosition = TetrisUtility.getGridPosition(target + pos[0],positionYRef.current + pos[1]);

                    for(let i = gridPosition[1]; i < ROW_COUNT;i++) {
                        if (TetrisUtility.grid[gridPosition[0]][i]) {
                            return i * BLOCK_SIZE - BLOCK_SIZE;
                        }
                    }

                    return ROW_COUNT * BLOCK_SIZE - BLOCK_SIZE;
                });
            })();

            const getCurrentBlocks = (evalRow = false) => {
                const arr = blockArray.map( pos => {
                    return (<Block
                        className = {evalRow ? "y" + TetrisUtility.getGridPosition(0,positionYRef.current + pos[1])[1] : ""}
                        position = {positionRef.current}
                        positionY = {positionYRef.current}
                        offsetX = {pos[0]}
                        offsetY = {pos[1]}
                        color = {colorRef.current}
                    />);
                });

                return arr;
            }

            moveBlocks(target,movingLeft,movingRight);

            let currentBlocks = getCurrentBlocks();

            let collisionOffsets;
            let dropOffset = 0;
            do {
                collisionOffsets = TetrisUtility.groundCollisionCheck(target,positionYRef.current + BLOCK_SIZE + dropOffset,blockArray);
                if (hardDropRef.current === 1) {
                    dropOffset += BLOCK_SIZE;
                }
            }
            while(hardDropRef.current === 1 && !collisionOffsets);
            
            if (!collisionOffsets) {
                positionYRef.current += movingDown ? MOVE_SPEED_DOWN_FAST : MOVE_SPEED_DOWN;
            }
            
            // On Collision Land
            else {
                hardDropRef.current = 2;

                positionRef.current = target;
                positionYRef.current = targetY[collisionOffsets[1]] - collisionOffsets[0][1];
                currentBlocks = getCurrentBlocks(true);

                // Set the grid matrix of occupied spaces
                for(const [posIndex,pos] of blockArray.entries() ) {
                    const position = TetrisUtility.getGridPosition(target + pos[0],positionYRef.current + pos[1]);
                    TetrisUtility.setGridBlock(currentBlocks[posIndex],...position);
                }
                
                setGridBlocks(prev => [...prev,...currentBlocks] );
                positionYRef.current = 0; // Reset Y Axis

                colorRef.current = COLORS[Math.round(Math.random() * (COLORS.length - 1))];

                // Check grid to clear
                clearRows();

                //TODO: Testing, pick random block after collision
                selectNextBlock();
            }

            setActiveBlocks(currentBlocks);
            forceUpdate();
            
            frameRef.current = requestAnimationFrame(animate);
        }
        
        selectNextBlock();
        animate();
            
        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    },[]);

    const width = CANVAS_WIDTH,height = CANVAS_HEIGHT;
    return (
        <div className = {styles.wrapper}>
            <div className = {styles.container} style = {{width,height}}>
                {activeBlocks}
                {gridBlocks}
            </div>
        </div>
    );
}