import styles from "./tetris.module.scss";
import Block from "../../components/block";

import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants";
import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Tetris() {
    const [activeBlocks,setActiveBlocks] = useState(null);
    const [container,setContainer] = useState();

    const [activeBlockPosition,setActiveBlockPosition] = useState(0);
    const [ keysDown ] = UseKeyPress();

    const frameRef = useRef(null);
    const keysRef = useRef(keysDown);
    const positionRef = useRef(0);

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
                console.log("moving right");
                positionRef.current ++;
            }
            
            if (movingLeft) {
                console.log("moving left");
                positionRef.current --;
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