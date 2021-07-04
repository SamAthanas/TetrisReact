import styles from "./tetris.module.scss";
import Block from "../../components/block";
import PauseButton from "../../components/PauseButton";
import ScoreHud from "../../components/ScoreHud";
import NextBlockHud from "../../components/NextBlockHud";
import MobileControls from "../../components/MobileControls";

import { delay, COLORS, BLOCKS, CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_SIZE, GRID_SIZE, MOVE_SPEED, MOVE_SPEED_DOWN, MOVE_SPEED_DOWN_FAST, TetrisUtility, ROW_COUNT, COLUMN_COUNT } from "../../constants";
import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Tetris() {
    const [activeBlocks,setActiveBlocks] = useState(null);
    const [deleteRows,setDeleteRows] = useState([]);
    
    const [ keysDown ] = UseKeyPress();
    
    const tetrisLevelRef = useRef(1);
    const gameOverRef = useRef(false);
    const scoreRef = useRef(0);
    const pauseRef = useRef(false);
    const frameRef = useRef(null);
    const keysRef = useRef(keysDown);
    const positionRef = useRef(0);
    const positionYRef = useRef(0);
    const colorRef = useRef("red");
    const currentBlockIndexRef = useRef(0);
    const currentBlockRotateRef = useRef(0);
    const currentBlockData = useRef({});
    const hardDropRef = useRef(0); // 0 = Off, 1 = On, 2 = held (wait for release)
    const nextBlockRef = useRef([0,"red"]);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const restartGame = () => {
        scoreRef.current = 0;
        positionYRef.current = 0;
        scoreRef.current = 0;
        gameOverRef.current = false;
        TetrisUtility.initTetrisArray();
        selectNextBlock();
        selectNextBlock();
        window.hideControls = false;
        tetrisLevelRef.current = 1;
    }

    useEffect( () => {
        TetrisUtility.initTetrisArray();
    },[]);

    useEffect( () => {
        keysRef.current = keysDown;

        if (keysDown["32"]) {
            const leftCollisionCheck = TetrisUtility.groundCollisionCheck(positionRef.current + currentBlockData.current.leftOffset,positionYRef.current + currentBlockData.current.topOffset,getBlockArray(1) );
            const rightCollisionCheck = TetrisUtility.groundCollisionCheck(positionRef.current + currentBlockData.current.rightOffset,positionYRef.current + currentBlockData.current.bottomOffset,getBlockArray(1) );
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
                if (!TetrisUtility.groundCollisionCheck(positionRef.current + BLOCK_SIZE,positionYRef.current + 12,getBlockArray() )) {
                    positionRef.current += MOVE_SPEED;
                    return;
                }
            }
        }
        
        else if (movingLeft) {
            if (!leftWallCollisionCheck() ) {
                if (!TetrisUtility.groundCollisionCheck(positionRef.current - BLOCK_SIZE,positionYRef.current + 12,getBlockArray() )) {
                    positionRef.current -= MOVE_SPEED;
                    return;
                }
            }
        }
        
        positionRef.current += (target - positionRef.current) * 0.05;
    });

    const clearRows = async () => {
        const rows = TetrisUtility.getRowsToClear();

        if (!rows || rows.length <= 0) {
            return;
        }

        while(deleteRows.length > 0) {
            await delay(1);
        }

        scoreRef.current += TetrisUtility.getPointsForClearing(rows.length);
        tetrisLevelRef.current = parseInt(TetrisUtility.constrain(scoreRef.current,0,150 * 10).map(0,150 * 20,1,10) );

        setDeleteRows([...deleteRows,...rows]);

        await delay(300);

        setDeleteRows([]);

        if (rows) {
            for(const row of rows) {
                for(let i = 0; i < COLUMN_COUNT;i++) {
                    for(let j = row;j > 0;j--) {
                        const topBlock =TetrisUtility.grid[i][j-1];
                        if (topBlock) {
                            topBlock.positionY += BLOCK_SIZE;
                            topBlock.offsetY2 =  -BLOCK_SIZE;

                            topBlock.resetOffset = (function*() {
                                for(let i = 0; i < BLOCK_SIZE;i++) {
                                    topBlock.offsetY2 ++;
                                    yield;
                                }

                                return;
                            })();
                        }

                        TetrisUtility.grid[i][j] = TetrisUtility.grid[i][j-1];
                    }
                }
            }
        }
    }
    
    const selectNextBlock = () => {
        //currentBlockIndexRef.current = blockIndex;
        currentBlockIndexRef.current = nextBlockRef.current[0];
        colorRef.current = nextBlockRef.current[1];
        const blockIndex = TetrisUtility.getRandomBlock();
        const nextColor = COLORS[Math.round(Math.random() * (COLORS.length - 1))];
        nextBlockRef.current = [blockIndex,nextColor];
        
        recalculcateBlocks();
    }

    useEffect( () => {
        
        const animate = async () => {
            if (!pauseRef.current && !gameOverRef.current) {
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
                    collisionOffsets = TetrisUtility.groundCollisionCheck(target,positionYRef.current + BLOCK_SIZE + dropOffset - 10,blockArray);
                    if (hardDropRef.current === 1) {
                        dropOffset += BLOCK_SIZE;
                    }
                }
                while(hardDropRef.current === 1 && !collisionOffsets);
                
                if (!collisionOffsets) {
                    positionYRef.current += movingDown ? MOVE_SPEED_DOWN_FAST : tetrisLevelRef.current.map(1,10,MOVE_SPEED_DOWN,MOVE_SPEED_DOWN_FAST * 0.68);
                }

                else if (collisionOffsets[0] === -1) {
                    gameOverRef.current = true;
                }
                
                // On Collision Land
                else {
                    hardDropRef.current = 2;

                    positionRef.current = target;
                    positionYRef.current = targetY[collisionOffsets[1]] - collisionOffsets[0][1];
                    currentBlocks = getCurrentBlocks(true);

                    const displayBlocks = currentBlocks.map(elem => {
                        return {
                            position:elem.props.position,
                            positionY:elem.props.positionY,
                            offsetX:elem.props.offsetX,
                            offsetY:elem.props.offsetY,
                            offsetY2:elem.props.offsetY2,
                            resetOffset:elem.props.resetOffset,
                            color:elem.props.color
                        };
                    });

                    // Set the grid matrix of occupied spaces
                    for(const [posIndex,pos] of blockArray.entries() ) {
                        const position = TetrisUtility.getGridPosition(target + pos[0],positionYRef.current + pos[1]);
                        TetrisUtility.setGridBlock(displayBlocks[posIndex],...position);
                    }
                    
                    // Check grid to clear
                    await clearRows();

                    positionYRef.current = 0; // Reset Y Axis
                    selectNextBlock();
                }

                setActiveBlocks(currentBlocks);
                forceUpdate();
            }
            
            frameRef.current = requestAnimationFrame(animate);
        }
        
        selectNextBlock();
        selectNextBlock();
        animate();
            
        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    },[]);

    const width = CANVAS_WIDTH,height = CANVAS_HEIGHT;
    const scale = TetrisUtility.constrain(window.innerWidth,350,700).map(350,700,0.5,1);

    return (<>
        <div className = {styles.wrapper}>
            
            <div className = {`${styles.container} ${gameOverRef.current && styles.gameover} container`} style = {{width:width,height:height,minWidth:width,minHeight:height,transform:`translateY(25px) scale(${scale})`}}>
                <div className = {styles.pauseContainer}>
                    <PauseButton
                        callback = { paused => pauseRef.current = paused }
                        restartCallback = { () => restartGame() }
                    />
                </div>
                <div className = {styles.scoreContainer}>
                    <ScoreHud score = {scoreRef.current}/>
                </div>
                <div className = {styles.blockContainer}>
                    <NextBlockHud nextIndex = {nextBlockRef.current[0]} nextColor = {nextBlockRef.current[1]}/>
                </div>
                <MobileControls showControls = {!window.hideControls}/>

                <div className = {styles.gameContainer}>
                    {activeBlocks}
                    {
                        TetrisUtility.grid.filter(elem => elem).flat().map(elem => {
                            if (!elem) {
                                return <></>;
                            }

                            if (elem.resetOffset) {
                                if (elem.resetOffset.next().done) {
                                    elem.resetOffset = undefined;
                                }
                            }

                            return (<Block
                                position = {elem.position + elem.offsetX}
                                positionY = {elem.positionY + elem.offsetY + (elem.offsetY2 || 0)}
                                color = {elem.color}
                                className = {`${elem.className} ${deleteRows.includes(TetrisUtility.getGridPosition(0,elem.positionY + elem.offsetY)[1]) ? "destroy" : ""}`}
                            />)
                        })
                    }
                </div>
            </div>
        </div>
    </>);
}