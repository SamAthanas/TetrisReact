import styles from "./NextBlockHud.module.scss";
import Block from "../block";

import {BLOCKS, BLOCK_SIZE} from "../../constants";

export default function NextBlockHud({nextIndex,nextColor}) {
    const offsets = [
        [0,0],
        [-BLOCK_SIZE,-BLOCK_SIZE / 2],
        [-BLOCK_SIZE / 2,BLOCK_SIZE / 2],
        [-BLOCK_SIZE / 2,BLOCK_SIZE / 2],
        [-BLOCK_SIZE / 2,-BLOCK_SIZE / 2],
        [-BLOCK_SIZE / 2,-BLOCK_SIZE / 2],
        [-BLOCK_SIZE / 2,BLOCK_SIZE / 2],
    ]

    nextIndex = nextIndex || 0;

    return (<>
        <div className = {`${styles.container} container`}>
            <div className = {styles.containerContent}>
                {
                    BLOCKS[nextIndex][0].map(elem => {
                        return (<Block
                            color = {nextColor}
                            position = {elem[0]}
                            positionY = {elem[1]}
                            offsetX = {offsets[nextIndex][0]}
                            offsetY = {offsets[nextIndex][1]}
                        />)
                    })
                }
            </div>
        </div>
    </>);
}