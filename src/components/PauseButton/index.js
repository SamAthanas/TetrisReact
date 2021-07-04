import { useState } from "react";
import styles from "./PauseButton.module.scss";

export default function TetrisHud({callback,restartCallback}) {
    const [paused,setPaused] = useState(false);
    const [pressed,setPressed] = useState(false);
    const [restartPressed,setRestartPressed] = useState(false);

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

    const toggleRestart = () => {
        if (typeof restartCallback === "function") {
            restartCallback();

            if (!restartPressed) {
                setRestartPressed(true);
                setTimeout( () => setRestartPressed(false), 500);
            }
        }
    }

    return (<div className = {styles.wrapper}>
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
        <div className = {`${styles.pauseHud} ${restartPressed && styles.pressed} container`}>
           <svg className ={ `MuiSvgIcon-root jss174 ${styles.active}`}
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                onClick = {toggleRestart}
           >
               <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
            </svg>
        </div>
    </div>);
}