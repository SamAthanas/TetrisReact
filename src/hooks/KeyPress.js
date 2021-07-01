import { useState, useEffect } from "react";

export const UseKeyPress = () => {
    const [keysDown,setKeysDown] = useState([]);

    const handleKeyDown = evt => {
        const code = evt.keyCode;

        if (!keysDown.includes(code) ) {
            setKeysDown([...keysDown,code])
        }
    }

    const handleKeyUp = evt => {
        const code = evt.keyCode;

        if (keysDown.includes(code) ) {
            const arr = [...keysDown];
            arr.splice(arr.indexOf(code,1) );

            setKeysDown(arr);
        }
    }

    useEffect( () => {
        window.addEventListener("keydown",handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    });

    return [ keysDown ];
}