"use client"
import Card from "@/components/Card";
import word_data from "@/word_data.json";
import { useEffect, useState } from "react";
import styles from "@/app/Cards.module.css"

type WordData = {
  [key: string]: {
    En: string;
    Ja: string;
  };
};

const Cards = () => {
  const wordData: WordData = word_data;

  function getRandomKey(): string {
    const keys = Object.keys(wordData); 
    const idx = Math.floor(Math.random() * keys.length);
    return keys[idx];
  }
  function getRandomSet(pickCount:number){
    const keySet = new Set<string>();


  // To avoid infinite loop
  const maxPick = Math.min(pickCount, Object.keys(wordData).length);

  while (keySet.size < maxPick) {
    keySet.add(getRandomKey());
  }
  return keySet

  }
  const pickCount = 3

  const [randomSet, setRandomSet] = useState(getRandomSet(pickCount))

  const items = Array.from(randomSet); 
  if (items.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  const correctCard = items[randomIndex];



  const [numPicked, setNumPicked] = useState(-1)
  const handleNumPicked = (num:number)=>{
    setNumPicked(num);
}




       useEffect(()=>{
        if (numPicked === -1) return;
        if(randomIndex === numPicked){
            console.log("right answer")
            console.log("next")
            
        }
        else if(randomIndex !== numPicked && numPicked !== -1){
            console.log("wrong answer")
          }
          const timer = setTimeout(() => {
            handleNumPicked(-1);
          }, 1000);
        
          return () => clearTimeout(timer);

       },[numPicked])


  return (
    <div className={styles.cards}>
      {[...randomSet].map((k, index) => (
        <Card key={k} En={wordData[k].En} Ja={wordData[k].Ja} numPicked={numPicked} index = {index} handleNumPicked={() => handleNumPicked(index)}/>
      ))}
    </div>
  );
};

export default Cards;
