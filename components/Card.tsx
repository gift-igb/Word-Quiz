"use client";
import styles from "@/app/(styles)/Card.module.css";
import { useSession } from "next-auth/react";

type Props = {
  id:number;
  en: string;
  ja: string;
  status: string;
  isCorrect: boolean
  isFlipped: boolean;
  isLocked: boolean;
  isMarked: boolean;
  isGameActive: boolean;
  onSelect: () => void;
  handleMarked: (id:number) => void
};

const Card = ({id, en, ja, status, isCorrect, isFlipped, isLocked, isGameActive, isMarked, onSelect, handleMarked }: Props) => {
  const { data: sesstion} = useSession()




  const classNames = [styles.card]

  if (isLocked && !isFlipped) {
    classNames.push(styles.cardLocked);
  }

  const handleClick = () => {
    if (!isLocked) {
      onSelect();
    }
  };
  const classNames2 = [styles.card, styles.clicked]

  if(isCorrect&&status==="correct"){
    classNames2.push(styles.correct)
  }
  if(isCorrect&&status==="wrong"){
    classNames2.push(styles.wrong)
  }

  return (
    <div className={styles.cardWrapper}>
    <button
      type="button"
      className={
        status === "idle"
          ? classNames.join(" ")
          : classNames2.join(" ")
      }
      onClick={handleClick}
      disabled={isLocked}
    >
      <span className={styles.japanese}>{ja}</span><br/>
      <span className={`${styles.english} ${isCorrect&&isLocked? styles.englishVisible : ""}`}>
        {en}
      </span>
    </button>
    {isCorrect&&status !=="idle" && !isGameActive && sesstion &&<span onClick={()=>{
      handleMarked(id)
      }} className={isMarked?styles.checked:styles.check}>✓</span>}
    </div>
  );
};

export default Card;
