export type WordEntry = {
    id: number;
    en: string;
    ja: string;
    weight:number;
    difficulty:number;
    marked:boolean
};



export type WordRecord = {
    id: string
    en: string
    ja: string
    difficulty: number
    Word_progress: {
      user_id: string
      weight: number
      marked: boolean
      deleted: boolean
    } | null
  }
export type Word = {
    id: string
    en: string
    ja: string
    difficulty: number
    user_id: string
    weight: number
    marked: boolean
    deleted: boolean
  }
