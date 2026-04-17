import styles from './Home.module.css'

export default function Home(
  {
    loading,
    error,
    select
  }: {
    loading: boolean,
    error: string | null,
    select: (arg0: number) => void
  }) {
  return (
    <>
      <h1 className={styles.header1}>Welcome to Kata Trivia!</h1>
      <p className={styles.description}>
        Test your skills against trvia questions of varying difficulties
        across a range of categories! You will have 10 seconds to answer
        each question, and after you have answered all of them you will
        get your score!
      </p>
      <hr />
      <h2 className={styles.header2}>Choose your quiz:</h2>
      
      <div className={styles["button-container"]}>
        {
          loading ?
            <div className={styles.spinner} />
          : error ?
            <div className={styles.error}>
              <p className={styles.errorText}>An error occured. Please reload the page.</p>
              <code className={styles.errorCode}>{error}</code>
            </div>
          :
            <>
              <button className={styles.button} onClick={() => select(10)}>10 questions</button>
              <button className={styles.button} onClick={() => select(25)}>25 questions</button>
              <button className={styles.button} onClick={() => select(50)}>50 questions</button>
            </>
        }
      </div>
    </>
  )
}
