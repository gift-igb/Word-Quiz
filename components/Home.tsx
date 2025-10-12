"use client";

import { useEffect, useState } from "react";

import CardGrid from "@/components/CardGrid";
import { WordEntry } from "@/components/types";
import  Functions from "@/components/Functions"
import styles from "@/app/(styles)/Cards.module.css";
import ToggleButton from "@/components/ToggleButton";
import { addData, deleteWord, getAllWords, toggleMarked, getUserWords, insertUser, updateWeight } from "@/libs/supabase/supabaseFunc";
import { useSession } from "next-auth/react";

type Round = {
  cards: WordEntry[];
  correctId: number | null;
};

type RoundStatus = "idle" | "correct" | "wrong";

const PICK_COUNT = 4;


  const pickRandomWords = (pool: WordEntry[], count: number): WordEntry[] => {
      if (pool.length === 0) {
        return [];
      }
    
      const available = [...pool];
      const selection: WordEntry[] = [];
      const maxPick = Math.min(count, available.length);
    
      let totalWeight = 0;
      for (const w of available) {
        totalWeight += w.weight;
      }
      let r = Math.random() * totalWeight;
      let pickedIndex = 0;
    
      for (let i = 0; i < available.length; i++) {
        r -= available[i].weight;
        if (r <= 0) {
          pickedIndex = i;
          
          break;
        }
      }
    
      selection.push(available[pickedIndex]);
      available.splice(pickedIndex, 1);
    

      while (selection.length < maxPick) {
        const idx = Math.floor(Math.random() * available.length);
        selection.push(available[idx]);
        available.splice(idx, 1);
      }
    
      return selection;
    };
    

const createRound = (pool: WordEntry[]): Round => {
  const cards = pickRandomWords(pool, PICK_COUNT);
  if (cards.length === 0) {
    return { cards: [], correctId: null };
  }

  const correctIdx = Math.floor(Math.random() * cards.length);
  return {
    cards,
    correctId: cards[correctIdx]?.id ?? null,
  };
};



const Home = () => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [round, setRound] = useState<Round>({ cards: [], correctId: null });
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [status, setStatus] = useState<RoundStatus>("idle");
  const [difficulty, setDifficulty] = useState<number[]>([1,2,3,4,5])
  const [timeLeft, setTimeLeft] = useState<number>(-1);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [preCountdown, setPreCountdown] = useState<number | null>(null);
  const [wrongWords, setWrongWords] = useState<WordEntry[]>([])
  const { data:session } = useSession()



  const gameTime:number = 60 //in second




  

  useEffect(()=>{
    const setFirst = async()=>{
      if (session === undefined) return
      else if(session){
        await insertUser(session.user?.email as string, session.user?.name as string)
        const userWordData = await getUserWords(session.user?.email as string)
        console.log(userWordData)
        setWords(userWordData)
        setRound(createRound(userWordData))
      }
      
      else if(!session){
      
      const wordDb = await getAllWords();
      setWords(wordDb)
      setRound(createRound(wordDb))
      }
      
    }
    setFirst();

  }, [session]);

  const resetRound = (pool: WordEntry[]) => {
    const preFilteredWords = pool.filter(i => difficulty.includes(i.difficulty))
    const markFileredWords = pool.filter((i) => {
      if(difficulty.includes(5))
        return i.marked
      return false;

  })
    const filteredWords = Array.from(new Set([...preFilteredWords, ...markFileredWords]));
    setRound(createRound(filteredWords));
    setActiveCardId(null);
    setStatus("idle");
  };

  const handleSelect = (cardId: number) => {
    if (activeCardId !== null || round.correctId === null) {
      return;
    }

    setActiveCardId(cardId);
    setStatus(cardId === round.correctId ? "correct" : "wrong");
  };

  

  useEffect(() => {
    if(isGameActive && activeCardId !== null){

      if (status === "correct"){
        setScore(prev=> prev +1)
      }
      if (status === "wrong"){
        if (correctCard?.id) {
          setWrongWords([...wrongWords, correctCard]);
        }
        
      }
      const timer = setTimeout(() => {
        handleNext();
      }, 1000);
      return () => clearTimeout(timer);
    }

  }, [activeCardId]);



  const handleNext = () =>{
    if (!session?.user?.email || !round.correctId) {
      resetRound(words);
      return;
    }
    const correctId = round.correctId;
    const userId = session.user.email;
    if (status === "correct") {
      const current = words.find(w => w.id === correctId);
      const newWeight = Math.max(0.2, (current?.weight ?? 1) / 2);

      
  
      const NewWeight = async() => await updateWeight(correctId, userId, newWeight);
      NewWeight();

      setWords(prev =>
        prev.map(w =>
          w.id === correctId ? { ...w, weight: newWeight } : w
        )
      );
    }
    if (status === "wrong") {
    
    const current = words.find(w => w.id === correctId);
    const newWeight = Math.min(100, (current?.weight ?? 1) * 2);


    const NewWeight = async() => await updateWeight(correctId, userId, newWeight);
      NewWeight();

    setWords(prev =>
      prev.map(w =>
        w.id === correctId ? { ...w, weight: newWeight } : w
      )
    );
  }
    resetRound(words)
  }

  const handleDifficulty = (id:number, string: "add" | "remove") =>{
    if(string === "add"){
      setDifficulty(prev => [...prev, id])

    }
    if(string === "remove"){
      setDifficulty(prev => prev.filter((i) => i !== id));
      
    }
  }
  useEffect(() => {
    handleNext();
  }, [difficulty]);



  const handleTimer = () => {
    setScore(0);
    setWrongWords([])
    setPreCountdown(3);
    let count = 3;
  
    const preId = setInterval(() => {
      count -= 1;
      setPreCountdown(count);
  
      if (count === 0) {
        handleNext();
        clearInterval(preId);
        setPreCountdown(null);
  
        setIsGameActive(true);
        setTimeLeft(gameTime);
  
        const id = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(id);
              setIsGameActive(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
  
        setIntervalId(id);
      }
    }, 1000);
  };
  
  

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsGameActive(false);
    setTimeLeft(-1);
    setWrongWords([])
  };






  const handleAddWord = ({ ja, en }: { ja: string; en: string }): string | null => {
    const trimmedJa = ja.trim();
    const trimmedEn = en.trim();

    if (!trimmedJa || !trimmedEn) {
      return "日本語と英語の両方を入力してください。";
    }

    const isDuplicate = words.some(
      (word) => word.ja === trimmedJa && word.en.toLowerCase() === trimmedEn.toLowerCase(),
    );

    if (isDuplicate) {
      return "同じ単語が既に登録されています。";
    }

    const nextWord:WordEntry = {
      id: 0,
      ja: trimmedJa,
      en: trimmedEn,
      weight: 1,
      difficulty:1,
      marked:false
    };
    
    (async() => {
      if (!session?.user?.email) {
        throw new Error("User email is required to toggle marked state");
      }
      await addData(nextWord, session?.user?.email);
      const newData = await getAllWords();
      setWords(newData)
      resetRound(newData);
    })();
  

    return null;
  };

  const handleDelete = (id: number) => {
    (async() => {
      if (!session?.user?.email) {
        throw new Error("User email is required to toggle marked state");
      }
      await deleteWord(id, session?.user?.email);
      const newData = await getUserWords(session?.user?.email);
      setWords(newData)
      resetRound(newData);
    })();

  }
  const handleMarked = async (id: number) => {
    setWords(prev =>
      prev.map(word =>
        word.id === id ? { ...word, marked: !word.marked } : word
      )
    );
    setRound(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === id ? { ...card, marked: !card.marked } : card
      )
    }));

    if(timeLeft === 0){
      setWrongWords(prev =>
        prev.map(word =>
          word.id === id ? { ...word, marked: !word.marked } : word
        )
      );
    }
  
    try {
      if (!session?.user?.email) {
        throw new Error("User email is required to toggle marked state");
      }
      await toggleMarked(id, session?.user?.email);
    } catch (e) {
      console.error("Update failed:", e);
      setWords(prev =>
        prev.map(word =>
          word.id === id ? { ...word, marked: !word.marked } : word
        )
      );
    }
  };


  
  const correctCard = round.cards.find((word) => word.id === round.correctId) ?? null

  return (
    <div className={styles.wrapper}>
      {preCountdown !== null?<div className={styles.countDown}><p>{preCountdown}</p></div>:null}

      <CardGrid
        score ={score}
        gameTime={gameTime}
        stopTimer={handleStop}
        handleTimer={handleTimer}
        isGameActive ={isGameActive}
        cards={round.cards}
        timeLeft={timeLeft}
        activeCardId={activeCardId}
        onSelect={handleSelect}
        correctCard={correctCard}
        status={status}
        wrongWords ={wrongWords}
        handleMarked={handleMarked}
      />
      {timeLeft !== 0 && !isGameActive &&<Functions handleDifficulty = {handleDifficulty} handleNext = {handleNext} difficulty={difficulty}/>}
      {timeLeft !== 0 && !isGameActive && session &&<ToggleButton onAddWord={handleAddWord} words={words} onDelete={handleDelete} handleMarked={handleMarked}/>}
     </div>
  );
};

export default Home;
