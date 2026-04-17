import styles from './Question.module.css'

export default function Question({ question, answers }: { question: string, answers: string[]}) {
  return (
    <>
      <h1 className={styles.header1}>Question 1</h1>
      <h2 className={styles.header2}>{ decodeURIComponent(question) }</h2>
      <hr />
      <div className={styles["button-container"]}>
        <button className={styles.button}>{ decodeURIComponent(answers[0]) }</button>
        <button className={styles.button}>{ decodeURIComponent(answers[1]) }</button>
      </div>
      {answers.length > 2 ?<div className={styles["button-container"]}>
        <button className={styles.button}>{decodeURIComponent(answers[2])}</button>
        <button className={styles.button}>{decodeURIComponent(answers[3])}</button>
      </div> : <></>}
    </>
  )
}
