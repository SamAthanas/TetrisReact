import styles from "./block.module.scss";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants";
import { useEffect, useState } from "react";

export default function Block(props) {
    return (
        <div 
            className = {styles.block}
            style = {
                {
                    left:`${props.position}%`
                }
            }
        >  
        </div>
    );
}