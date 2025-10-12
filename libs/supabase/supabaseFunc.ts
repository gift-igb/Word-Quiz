import { WordEntry } from "@/components/types";
import { createClient } from "./supabase"

const supabase = createClient()

export const deleteWord = async (wordId: number, userId: string) => {

  const { data: word, error: fetchError } = await supabase
    .from("WordData")
    .select("wordId, userID")
    .eq("wordId", wordId)
    .single();

  if (fetchError) {
    console.error("Fetch error:", fetchError.message);
    throw fetchError;
  }

  if (word.userID === userId) { //If a word is what user added
    const { error: deleteError } = await supabase
      .from("WordData")
      .delete()
      .eq("wordId", wordId);

    if (deleteError) {
      console.error("Delete error:", deleteError.message);
      throw deleteError;
    }

  } else {

    const { error: updateError } = await supabase
      .from("Word_progress")
      .upsert({
        word_id: wordId,
        user_id: userId,
        deleted: true
      }, { onConflict: "word_id,user_id" });

    if (updateError) {
      console.error("Word_progress update error:", updateError.message);
      throw updateError;
    }
  }
};
  

  export const addData = async (ob: WordEntry, userId: string) => {
    const { data, error } = await supabase
      .from("WordData")
      .insert([{
        en: ob.en,
        ja: ob.ja,
        difficulty: ob.difficulty,
        userID: userId  
      }])
      .select()
  
    if (error) {
      console.error("Insert error:", error.message)
      throw error
    }
  
    return data
  }
  
  export const getAllWords = async () => {
    const { data, error } = await supabase
      .from("WordData")
      .select("*")
      .order("wordId", { ascending: true });
  
    if (error) throw error;
  
    return (data ?? []).map(w => ({
      id: w.wordId,        
      en: w.en,
      ja: w.ja,
      difficulty: w.difficulty,
      weight: w.weight ?? 1,
      marked: w.marked ?? false
    })) as WordEntry[];
  };

export const toggleMarked = async (wordId: number, userId: string) => {

  const { data: current, error: fetchError } = await supabase
    .from("Word_progress")
    .select("marked")
    .eq("word_id", wordId)
    .eq("user_id", userId)
    .single()


  const newValue = !current?.marked 

  const { data, error } = await supabase
    .from("Word_progress")
    .upsert({
      word_id: wordId,
      user_id: userId,
      marked: newValue
    }, { onConflict: "word_id,user_id" })
    .select()

  if (error) {
    console.error("Update error:", error.message)
    throw error
  }

  return data
}

export async function insertUser(user_email: string, user_name: string) {
  const { error } = await supabase
    .from("Profiles")
    .upsert(
      { user_email, user_name },
      { ignoreDuplicates: true } // user_email を一意キーとして扱ってます
    )

  if (error) {
    console.error("Error inserting profile:", error)
    throw error
  }
}

export const getUserWords = async (userId: string) => {
  const { data, error } = await supabase
    .from("WordData")
    .select(`
      wordId,
      en,
      ja,
      difficulty,
      userID,
      Word_progress!left (
        user_id,
        weight,
        marked,
        deleted
      )
    `)
    .or(`userID.is.null,userID.eq.${userId}`)  

  if (error) throw error

  return data.map((word) => {
    const progress = word.Word_progress?.[0]
    return(
    {
    id: word.wordId,
    en: word.en,
    ja: word.ja,
    difficulty: word.difficulty,
    weight: progress?.weight ?? 1,
    marked: progress?.marked ?? false,
    deleted: progress?.deleted ?? false,
    } 
  )}).filter(word => !word.deleted) as WordEntry[]
}


export const updateWeight = async (wordId: number, userId: string, newWeight: number) => {


  const { data, error } = await supabase
    .from("Word_progress")
    .upsert(
      {
        word_id: wordId,
        user_id: userId,
        weight: newWeight,
      },
      { onConflict: "word_id,user_id" }
    )
    .select()

  if (error) {
    console.error("Update weight error:", error.message)
    throw error
  }

  return data
}