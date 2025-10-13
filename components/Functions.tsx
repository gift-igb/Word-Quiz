import React, { useState } from 'react'
import styles from "@/app/(styles)/Functions.module.css"
import { useSession } from 'next-auth/react';
type Props = {
    difficulty: number[]
    handleNext: () => void,
    handleDifficulty: (id:number, func:"add" | "remove") => void;
}
function Functions({handleNext, handleDifficulty,difficulty}:Props) {
    const [isPopUp, setIsPopUp] = useState<boolean>(false)
    const { data: sesstion } = useSession()
    

    const handlePopUp = () =>{
        setIsPopUp(prev => !prev)
    }

    let array = [1,2,3,4,5]
    if(!sesstion){
      array = array.filter( (i)=>i !==5 )
    }
  return (
    <div className={styles.functions}>
      {isPopUp&&<div className={styles.popUpBg} onClick={handlePopUp}></div>}
        <div 
        role="button"
        className={styles.filterBtn}
        onClick={handlePopUp}>
          <p>filter</p>
          <div className= {`${styles.difficulties} ${isPopUp ? styles.popUp : ""}`}>
            {array.map((i,key)=>{
                return(
                <div role="button" key = {key} className={`${styles.difficulty} ${difficulty.includes(i) ? styles.selecting: ""}`} onClick={(e) => {
                    e.stopPropagation()
                    if(difficulty.includes(i)){
                        handleDifficulty(i, "remove")
                    }
                    if(!difficulty.includes(i)){
                        handleDifficulty(i, "add")
                    }
                }}>
                    <p>{i === 5 ? "✓" : i}</p>
                </div>
                

            )})}
        

            
            </div>

      </div>
    
      
      <div 
        role="button"
        className={styles.nextBtn}
        onClick={handleNext}>
          <p>next quiz</p>

      </div>
    </div>
  )
}

export default Functions