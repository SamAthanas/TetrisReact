import styles from "./block.module.scss";
import { BLOCK_SIZE } from "../../constants";
import { useEffect, useState } from "react";

export default function Block(props) {
    return (
        <div 
            className = {`${styles.block} ${props.color}`}
            style = {
                {
                    left:`${props.position + (props.offsetX || 0)}px`,
                    top:`${props.positionY + (props.offsetY || 0)}px`,
                    width:BLOCK_SIZE,
                    height:BLOCK_SIZE
                }
            }
        >  
        </div>
    );
}