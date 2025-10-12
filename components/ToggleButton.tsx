"use client";

import { useState } from "react";

import styles from "@/app/(styles)/ToggleButton.module.css";
import WordForm from "./WordForm";
import WordList from "./WordList";
import { WordEntry } from "./types";

type ToggleButtonProps = {
  onAddWord: (input: { ja: string; en: string }) => string | null;
  words: WordEntry[];
  onDelete: (id: number) => void;
  handleMarked: (id:number) => void;
};

const ToggleButton = ({ onAddWord, words, onDelete, handleMarked }: ToggleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.toggleButton} ${isOpen ? styles.toggleButtonActive : ""}`}
        aria-expanded={isOpen}
        aria-controls="word-tools"
        onClick={ handleToggle }
      >
        <span />
        <span />
        <span />
      </button>
      <div
        id="word-tools"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
      >
        <WordForm onAddWord={onAddWord} />
        <WordList words={words} onDelete={onDelete} handleMarked={handleMarked} />
      </div>
    </div>
  );
};

export default ToggleButton;
