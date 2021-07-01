import styles from "./tetris.module.scss";
import Block from "../../components/block";

import { UseKeyPress } from "../../hooks/KeyPress.js";
import { useEffect, useRef, useState } from "react";

export default function Tetris() {
    const [activeBlocks,setActiveBlocks] = useState(null);

    const [ keysDown ] = UseKeyPress();
    const frameRef = useRef(null);

    useEffect( () => {
        const animate = () => {
            console.log("animating");

            frameRef.current = requestAnimationFrame(animate);
        }

        animate();

        setActiveBlocks(
            <Block/>
        );

        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    },[]);

    useEffect( () => {
        const movingLeft = keysDown.includes(37);
        const movingRight = keysDown.includes(39);

    },[keysDown]);

    return (
        <div className = {styles.wrapper}>
            <div className = {styles.container}>
                {activeBlocks}
            </div>
        </div>
    );
}