"use client";

import Card from "@/components/Card";
import styles from "@/app/(styles)/Cards.module.css";
import { WordEntry } from "@/components/types";
import { useState } from "react";
import { useSession } from "next-auth/react";

type CardGridProps = {
  cards: WordEntry[];
  activeCardId: number | null;
  onSelect: (id: number) => void;
  correctCard: WordEntry | null;
  isGameActive: boolean
  timeLeft: number
  gameTime:number
  status: "idle" | "correct" | "wrong";
  score:number
  wrongWords:WordEntry[]
  handleTimer: () => void
  stopTimer:() => void
  handleMarked:(id:number) => void
};

const CardGrid = ({ stopTimer, cards, activeCardId, isGameActive, score, timeLeft, handleTimer, onSelect, handleMarked, correctCard, gameTime, status, wrongWords}: CardGridProps) => {
  
  const { data: sesstion } = useSession()


  const isLocked = activeCardId !== null;
  const statusLabel =
    status === "correct"
      ? "You got correct answer!"
      : status === "wrong"
      ? `Oops! the correct answer is ${correctCard?.ja??"no data"}`
      : "";

  const prompt = correctCard?.en ?? undefined

  const classify = (correct: number, wrong: number): string => {
     
    if (correct * 1.9 - wrong >= gameTime/2) return "Sクラス";
    if (correct * 1.9 - wrong >= gameTime/4) return "Aクラス";
    if (correct * 1.9 - wrong >= gameTime/6) return "Bクラス";
    return "Cクラス";
  }
  

  return (
    <section className={styles.cardsSection}>
      <h2 className={styles.heading}>"クイズ式！英単語帳"</h2>
      {timeLeft === 0 ?
      <div>
        <button className= {styles.btn} onClick={handleTimer}>もう一度</button>
        <button className= {styles.btn} onClick={stopTimer}>終了する</button> 
      </div>:
      isGameActive ? 
      <div>
        <button className= {styles.btn} onClick={stopTimer}>ゲーム中止</button>
        </div>:
      <div><button className= {styles.btn} onClick={handleTimer}>ゲームモード</button></div>
      }
      
      {timeLeft===0&&
      <div>
        <h2 className={styles.headingScore}>{score+wrongWords.length}門中<span>{score}</span>門正解</h2><p className={styles.scoreClass}>{classify(score,wrongWords.length)}</p>
        <h2 className={styles.headingWrong}>{wrongWords.length !== 0 ?"間違えた問題↓":"全問正解!!"}</h2>
        <ul className={styles.wordList}>
        {wrongWords.map((word, key) => {
          const firstIndex = wrongWords.findIndex(w => w.id === word.id);
          const isFirst = firstIndex === key;
          return(
          <li key={key} className={styles.wordItem}>
            <span className={styles.wrongWordList}>
              <strong>{word.en}</strong>
              <small>{word.ja}</small>
            </span>
            {isFirst&&sesstion&&<button
              type="button"
              className={word.marked?styles.markedButton:styles.markButton}
              onClick={()=>handleMarked(word.id)}
            >
              ✓
            </button>}
          </li>)}
        )}
      </ul>
        
      </div>}
      
      {prompt && timeLeft !== 0 && <p className={styles.prompt}>What is the meaning of「<b>{prompt}</b>」</p>}
      {status !== "idle" ?
        <p
          className={`${styles.status} ${
            status === "correct" ? styles.statusCorrect : styles.statusWrong
          }`}
        >
          {statusLabel}
        </p> : timeLeft !== 0 ?<p className={styles.status}>Select a card</p>:null
      }
      {isGameActive === true && timeLeft !== 0 ? 
      <div className={styles.timer}>
        <span className= {isGameActive ? `${styles.timerSpan} ${styles.startTimer}`: `${styles.timerSpan}`} 
        style={
          { "--progress":`${(gameTime - timeLeft)/ (gameTime-1) * 100}%` } as React.CSSProperties} >
          </span><p>{timeLeft}</p></div>:null}
      {cards.length !== 0 && timeLeft !== 0 ? 
        <div className={styles.cards}>
          {cards.map((word,key) => (
            <Card
              key={key}
              id={word.id}
              en={word.en}
              ja={word.ja}
              isMarked={word.marked}
              status={status}
              isCorrect = {correctCard?.id === word.id}
              isFlipped={activeCardId === word.id}
              isLocked={isLocked}
              isGameActive={isGameActive}
              onSelect={() => onSelect(word.id)}
              handleMarked = {handleMarked}
            />
          ))}
        </div>:null
      }
    </section>
  );
};

export default CardGrid;
