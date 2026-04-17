import styles from './Home.module.css'
import commonStyles from './common.module.css'

export default function Results({ correct, total, reset }: { correct: number, total: number, reset: () => void  }) {
  return (
    <>
      <h1 className={commonStyles.header1}>Your score:</h1>
      <h2 className={commonStyles.header2}>{correct} / {total}</h2>
      <p className={commonStyles.description}>Emberassing!</p>
      <div className={commonStyles["flex-container"]}>
        <button className={commonStyles.button} onClick={reset}>Play again?</button>
      </div>
    </>
  )
}
