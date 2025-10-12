"use client";

import styles from "@/app/(styles)/Cards.module.css";
import { WordEntry } from "@/components/types";


type WordListProps = {
  words: WordEntry[];
  onDelete: (id: number) => void;
  handleMarked: (id: number) => void;
};

const WordList = ({ words, onDelete, handleMarked }: WordListProps) => {
  
  return(
  <section className={styles.wordBank}>
    <h2 className={styles.heading}>登録済みの単語</h2>
    {words.length === 0 ? (
      <p className={styles.emptyState}>まだ単語がありません。追加してみましょう。</p>
    ) : (
      <ul className={styles.wordList}>
        {words.map((word) => (
          <li key={word.id} className={styles.wordItem}>
            <span>
              <strong>{word.en}</strong>
              <small>{word.ja}</small>
            </span>
            <div>
              <button
                type="button"
                className={word.marked?styles.markedButton:styles.markButton}
                onClick={() => handleMarked(word.id)}
              >
                ✓
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => onDelete(word.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);}

export default WordList;
