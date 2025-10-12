"use client";

import styles from "@/app/(styles)/Description.module.css";
type Props ={
    isOpen: boolean
    handleOpen: () => void
}

export default function Description({isOpen, handleOpen}:Props) {
  return (
    <>
    {isOpen?
    <div className={styles.wrapper}>
      <div className={styles.header}>
      <button className={styles.closeBtn} onClick={handleOpen}><span></span><span></span></button>
      <h1 className={styles.title}>TOEFL対策！<br/>クイズ式英単帳の使い方</h1>
      </div>
      
      <section className={styles.section}>
        <h2>基本機能</h2>
        <p>
        このアプリは、TOEFL のスコアアップを目指す人のための クイズ形式の単語アプリです。
        約４０００語のToeflに特化した単語たちをゲーム感覚で使いながら、効率よく覚えられるようになっています。
        </p>
      </section>
      <section className={styles.section}>
        <h2>レベルごとにTOEFLスコアとリンク</h2>
        <p>
        学習方法はシンプルで、4択クイズから正しい意味を選びます。<br></br>
        ログインしていただくと、あなた専用のデータが作られ、間違えた単語は自動で出やすく、逆に正解することが多い単語は出題率が下がっていき、効率よく学習することが可能です。
        またゲームモードを使用していただくと、制限時間（６０秒）が設定され、結果がランク形式で出力され、ゲーム感覚で楽しく学んでいただけます。
        </p>
      </section>

      <section className={styles.section}>
  <h2>レベルごとにTOEFLスコアとリンク</h2>
  <p>
    単語には「レベル」がついていて、TOEFL のスコア目安とつながっています。  
    <br/>レベル 1・2 → TOEFL 60〜70点前後向けの基礎単語です。  
    <br/>レベル 3 → TOEFL 80点以上を狙う人向けの中級単語です。  
    <br />レベル 4 → TOEFL 100点以上を目指す人向けの難単語です。 </p> 
    <p>filter ボタンから自分の目標に合わせてレベルを選ぶことができるので、目標に合った効率的な学習を段階的に進められます。
  </p>
</section>


      <section className={styles.section}>
        <h2>クイズで単語を覚える</h2>
        <p>
        学習方法はシンプルで、4択クイズから正しい意味を選びます。<br></br>
        ログインしていただくと、あなた専用のデータが作られ、間違えた単語は自動で出やすく、逆に正解することが多い単語は出題率が下がっていき、効率よく学習することが可能です。
        またゲームモードを使用していただくと、制限時間（６０秒）が設定され、結果がランク形式で出力され、ゲーム感覚で楽しく学んでいただけます。
        </p>
      </section>

      <section className={styles.section}>
        <h2>マーク機能</h2>
        <p>
          ログインしているユーザは、間違えた単語や重点的に覚えたい単語には「マーク」を付けられます。
          マークは一覧ページやクイズのリザルト画面でチェックボタンを押すだけで簡単に切り替え可能です。
        </p>
      </section>

      <section className={styles.section}>
        <h2>自分だけの単語帳を作れる</h2>
        <p>最初から入っている共通単語に加えて、自分で好きな単語を追加することができます。
            授業で出た単語を追加したり、苦手な熟語を登録したり。
            自由にカスタマイズして自分専用の単語帳を作れます。不要な単語は削除して非表示にすることもできます。
          </p>
      </section>

      <section className={styles.section}>
      </section>
    </div>:null}
    </>
  );
}
