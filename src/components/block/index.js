import styles from "./block.module.scss";
import { BLOCK_SIZE } from "../../constants";
import { useEffect, useState } from "react";

export default function Block(props) {
    return (
        <div 
            className = {styles.block}
            style = {
                {
                    left:`${props.position}px`,
                    top:`${props.positionY}px`,
                    width:BLOCK_SIZE,
                    height:BLOCK_SIZE
                }
            }
        >  
        </div>
    );
}