"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@/app/(styles)/Cards.module.css";

type WordFormProps = {
  onAddWord: (input: { ja: string; en: string }) => string | null;
};

const WordForm = ({ onAddWord }: WordFormProps) => {
  const [ja, setJa] = useState("");
  const [en, setEn] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetError = () => {
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = onAddWord({ ja, en });

    if (result) {
      setError(result);
      return;
    }

    setJa("");
    setEn("");
    setError(null);
  };

  const handleJaChange = (event: ChangeEvent<HTMLInputElement>) => {
    resetError();
    setJa(event.target.value);
  };

  const handleEnChange = (event: ChangeEvent<HTMLInputElement>) => {
    resetError();
    setEn(event.target.value);
  };

  return (
    <section className={styles.controls}>
      <h2 className={styles.heading}>単語を追加</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
          英語
          <input
            type="text"
            value={en}
            onChange={handleEnChange}
            placeholder="例: thank you"
          />
        </label>
        <label className={styles.field}>
          日本語
          <input
            type="text"
            value={ja}
            onChange={handleJaChange}
            placeholder="例: ありがとう"
          />
        </label>
        
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.submitButton} type="submit">
          追加する
        </button>
      </form>
    </section>
  );
};

export default WordForm;
