import { useEffect, useRef } from "react";
import styles from "./MobileControls.module.scss";

export default function MobileControls({showControls}) {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const downRef = useRef(null);
    const rotateRef = useRef(null);

    useEffect( () => {
        const preventDefaults = evt => {
            evt.preventDefault();
            evt.stopPropagation();
        }

        let events = [];

        events.push(evt => {
            preventDefaults(evt);
            window.setKeysDown({"37":true});
        });

        events.push(evt => {
            preventDefaults(evt);
            window.setKeysDown({"39":true});
        });
        
        events.push(evt => {
            preventDefaults(evt);
            window.setKeysDown({"40":true});
        });

        events.push(evt => {
            preventDefaults(evt);
            window.setKeysDown({"32":true});
        });

        const onButtonReleased = evt => {
            preventDefaults(evt);
            window.setKeysDown({});
        }

        [leftRef,rightRef,downRef,rotateRef].forEach((ref,index) => {
            ["touchstart","mousedown"].forEach(evt => {
                ref.current.addEventListener(evt,events[index]);
            });
            ["touchend","mouseup"].forEach(evt => {
                ref.current.addEventListener(evt,onButtonReleased);
            });
        });

        return () => {
            [leftRef,rightRef,downRef,rotateRef].forEach((ref,index) => {
                ["touchstart","mousedown"].forEach(evt => {
                    ref.current.removeEventListener(evt,events[index]);
                });
                ["touchend","mouseup"].forEach(evt => {
                    ref.current.removeEventListener(evt,onButtonReleased);
                });
            });
        }
    },[leftRef,rightRef,downRef,rotateRef]);

    return (<>
        <div className = {`${styles.bottomControls} ${showControls && styles.showControls}`}>
            <span className = {styles.leftSideArea} ref = {leftRef}>
                <svg className = {styles.leftButton} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>
                </svg>
            </span>
            <span className = {styles.rightSideArea} ref = {rightRef}>
                <svg className = {styles.rightButton} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>
                </svg>
            </span>
            <span className = {styles.bottomSideArea} ref = {downRef}>
                <svg className = {styles.downButton} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path>
                </svg>
            </span>
            <svg className = {styles.rotateButton} ref = {rotateRef} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"></path>
            </svg>
        </div>
    </>);
}