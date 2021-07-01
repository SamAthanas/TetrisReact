import styles from "./tetris.module.scss";
import Block from "../../components/block";

import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants";
import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Tetris() {
    const [activeBlocks,setActiveBlocks] = useState(null);

    const [ keysDown ] = UseKeyPress();

    const frameRef = useRef(null);
    const keysRef = useRef(keysDown);
    const positionRef = useRef(0);
    const directionRef = useRef(0);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect( () => {
        keysRef.current = keysDown;
    },[keysDown]);
    
    useEffect( () => {
        const animate = () => {
            const movingLeft = keysRef.current["37"];
            const movingRight = keysRef.current["39"];
            
            if (movingRight) {
                if (positionRef.current > 90) {
                    positionRef.current = 90;
                }

                else {
                    positionRef.current += .5;
                    directionRef.current = 1;
                }
            }
            
            else if (movingLeft) {
                if (positionRef.current - .5 < 0) {
                    positionRef.current = 0;
                }

                else {
                    positionRef.current -= .5;
                    directionRef.current = -1;
                }
            }
            
            else {
                const target = Math.round(positionRef.current / 10) * 10;
                positionRef.current += (target - positionRef.current) * 0.05;
            }

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
            <Block position = {positionRef.current}/>
            </div>
        </div>
    );
}