import { useState } from "react";
import styles from "./PauseButton.module.scss";

export default function TetrisHud({callback}) {
    const [paused,setPaused] = useState(false);
    const [pressed,setPressed] = useState(false);

    const togglePause = () => {
        setPaused(prev => {
            if (typeof callback === "function") {
                callback(!prev);
            }
            
            return !prev;
        });

        if (!pressed) {
            setPressed(true);
            setTimeout( () => setPressed(false), 500);
        }
    }

    return (
        <div className = {`${styles.pauseHud} container ${pressed && styles.pressed}`}>
            <svg className = {`${!paused && styles.active} MuiSvgIcon-root jss174`}
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                onClick = {togglePause}>
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
            </svg>
            <svg className = {`${paused && styles.active} MuiSvgIcon-root jss174`}
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                onClick = {togglePause}>
                    <path d="M8 5v14l11-7z"></path>
            </svg>
        </div>
    );
}