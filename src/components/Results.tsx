import styles from './Home.module.css'
import commonStyles from './common.module.css'

export default function Results({ correct, total, reset }: { correct: number, total: number, reset: () => void  }) {
  return (
    <>
      <h1 className={styles.header1}>Your score:</h1>
      <h2 className={styles.header2}>{correct} / {total}</h2>
      <p>Emberassing!</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className={commonStyles.button} onClick={reset}>Play again?</button>
      </div>
    </>
  )
}
