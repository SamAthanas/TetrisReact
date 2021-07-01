import styles from "./tetris.module.scss";
import Block from "../../components/block";

import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants";
import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useEffect, useRef, useState } from "react";

export default function Tetris() {
    const [activeBlocks,setActiveBlocks] = useState(null);
    const [container,setContainer] = useState();

    const [activeBlockPosition,setActiveBlockPosition] = useState(0);
    const [ keysDown ] = UseKeyPress();
    const frameRef = useRef(null);
    
    useEffect( () => {
        const animate = () => {
            const movingLeft = keysDown.includes(37);
            const movingRight = keysDown.includes(39);
            
            if (movingRight)
                console.log("moving right");

            // setActiveBlockPosition(50);
            //console.log("animating");
            
            setActiveBlocks(
                
            );
            
            frameRef.current = requestAnimationFrame(animate);
        }
        
        animate();
            
        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    },[keysDown]);

    const width = CANVAS_WIDTH,height = CANVAS_HEIGHT;
    return (
        <div className = {styles.wrapper}>
            <div className = {styles.container} style = {{width,height}}>
            <Block position = {activeBlockPosition}/>
            </div>
        </div>
    );
}