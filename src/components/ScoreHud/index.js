import { useEffect, useState } from "react";
import styles from "./ScoreHud.module.scss";
import { delay } from "../../constants/";

export default function ScoreHud({ score }) {
    const [isMounted,setIsMounted] = useState(false);
    const [scoreDiff,setScoreDiff] = useState(0);
    const [currentScore,setCurrentScore] = useState(0);
    const [animate,setAnimate] = useState(false);
    const [appendScore,setAppendScore] = useState(false);

    useEffect( () => {
        if (isMounted) {
            setScoreDiff(score - currentScore);
            addScore();
        }
        setIsMounted(true);
    },[score]);

    const addScore = async () => {
        setAppendScore(true);
        await delay(500);
        setAnimate(true);
        await delay(500);
        setCurrentScore(score);
        setAnimate(false);
        setAppendScore(false);
    }

    return (<>
        <div score = {`${scoreDiff > 0? "+" : ""}${scoreDiff}`}
        className = {`${styles.scoreHud} ${animate && styles.animate} ${appendScore && styles.appendScore} container`}>
            <p>Score: {currentScore}</p>
        </div>
    </>);
}