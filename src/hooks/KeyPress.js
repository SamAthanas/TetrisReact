import { useState, useEffect } from "react";

export const UseKeyPress = () => {
    const [keysDown,setKeysDown] = useState({});

    const validKeyCode = code => {
        return ["37","39","40"].includes(code);
    }

    const handleKeyDown = evt => {
        const code = "" + evt.keyCode;

        if (validKeyCode(code) && !keysDown[code]) {
            setKeysDown(prev => {
                return {...prev,[code]:true};
            });
        }
    }
    
    const handleKeyUp = evt => {
        const code = "" + evt.keyCode;
        
        if (validKeyCode(code) && keysDown[code]) {
            setKeysDown(prev => {
                return {...prev,[code]:false};
            });
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