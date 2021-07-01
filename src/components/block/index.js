import styles from "./block.module.scss";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants";
import { useState } from "react";

export default function Block(props) {
    const [position,setPosition] = useState(props.position); // [0,100]

    return (
        <div 
            className = {styles.block}
            style = {
                {
                    left:`${position}%`
                }
            }
        >  
        </div>
    );
}