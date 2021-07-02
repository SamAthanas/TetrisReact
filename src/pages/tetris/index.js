import styles from "./tetris.module.scss";
import Block from "../../components/block";

import { COLORS, BLOCKS, CANVAS_WIDTH, CANVAS_HEIGHT, BLOCK_SIZE, GRID_SIZE, MOVE_SPEED, MOVE_SPEED_DOWN, TetrisUtility, ROW_COUNT } from "../../constants";
import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useCallback, useEffect, useRef, useState } from "react";

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

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect( () => {
        TetrisUtility.initTetrisArray();
    },[]);

    useEffect( () => {
        keysRef.current = keysDown;

        if (keysDown["32"]) {
            currentBlockRotateRef.current = (currentBlockRotateRef.current + 1) % BLOCKS[currentBlockIndexRef.current].length;
        }
    },[keysDown]);
    
    useEffect( () => {
        const animate = () => {
            const movingLeft = keysRef.current["37"];
            const movingRight = keysRef.current["39"];
            const movingDown = keysRef.current["40"];

            const blockArray = BLOCKS[currentBlockIndexRef.current][currentBlockRotateRef.current];

            const target = Math.round(positionRef.current / GRID_SIZE) * GRID_SIZE;
            const targetY = ( () => {
                return blockArray.map(pos => {
                    const gridPosition = TetrisUtility.getGridPosition(target + pos[0],positionYRef.current + pos[1]);
                    for(let i = 0; i < ROW_COUNT;i++) {
                        if (TetrisUtility.grid[gridPosition[0]][i]) {
                            return i * BLOCK_SIZE - BLOCK_SIZE;
                        }
                    }

                    return ROW_COUNT * BLOCK_SIZE - BLOCK_SIZE;
                });
            })();

            const getCurrentBlocks = () => {
                const arr = blockArray.map( pos => {
                    return (<Block position = {positionRef.current}
                        positionY = {positionYRef.current}
                        offsetX = {pos[0]}
                        offsetY = {pos[1]}
                        color = {colorRef.current}
                    />);
                });

                return arr;
            }

            const setCurrentBlocks = () => {
                const blockIndex = TetrisUtility.getRandomBlock();
                currentBlockIndexRef.current = blockIndex;
            }
            
            if (movingRight) {
                if (positionRef.current > CANVAS_WIDTH - BLOCK_SIZE) {
                    positionRef.current = CANVAS_WIDTH - BLOCK_SIZE;
                }

                else {
                    positionRef.current += MOVE_SPEED;
                }
            }
            
            else if (movingLeft) {
                if (positionRef.current - .5 < 0) {
                    positionRef.current = 0;
                }

                else {
                    positionRef.current -= MOVE_SPEED;
                }
            }
            
            else {
                positionRef.current += (target - positionRef.current) * 0.05;
            }

            let currentBlocks = getCurrentBlocks();
            const collisionOffsets = TetrisUtility.groundCollisionCheck(target,positionYRef.current + BLOCK_SIZE,blockArray);

            if (!collisionOffsets) {
                positionYRef.current += movingDown ? MOVE_SPEED_DOWN * 4 : MOVE_SPEED_DOWN;
            }
            else {
                positionRef.current = target;
                positionYRef.current = targetY[collisionOffsets[1]] - collisionOffsets[0][1];
                currentBlocks = getCurrentBlocks();

                for(const pos of blockArray) {
                    const position = TetrisUtility.getGridPosition(target + pos[0],positionYRef.current + pos[1]);
                    TetrisUtility.setGridBlock(...position);
                }
                
                setGridBlocks(prev => [...prev,...currentBlocks] );
                positionYRef.current = 0;

                colorRef.current = COLORS[Math.round(Math.random() * (COLORS.length - 1))];
            }

            setActiveBlocks(currentBlocks);
            forceUpdate();
            
            frameRef.current = requestAnimationFrame(animate);
        }
        
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