"use client"

import styles from "@/app/Card.module.css"
import { useState } from "react"
type Props = {
    En:String
    Ja:String
    numPicked:number
    index:number
    handleNumPicked: ()=> void
}
const Card = ({En, Ja, numPicked, index, handleNumPicked}:Props) => {

    
    
    return (
        
        <div className={`${styles.card} ${numPicked === index ? styles.flipped : ""}`} onClick={numPicked === -1 ? handleNumPicked:()=>{}}>
            <div className={`${styles.upside} ${numPicked === index ? styles.flippedUp : ""}`}></div>
            <div className={`${styles.downside} ${numPicked === index ? styles.flippedDown : ""}`}></div>
        </div>
    )
}
export default Card;
