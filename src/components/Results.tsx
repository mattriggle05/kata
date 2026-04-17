import commonStyles from './common.module.css'

export default function Results({ correct, total, reset }: { correct: number, total: number, reset: () => void }) {
  
  let appraisal = "";
  const percent = 100*(correct / total)

  if (percent < 15) {
    appraisal = "Embarrassing!"
  } else if (percent < 30) {
    appraisal = "Needs some work."
  } else if (percent < 50 ) {
    appraisal = "Getting better..."
  } else if (percent < 65 ) {
    appraisal = "Not half bad"
  } else if (percent < 75 ) {
    appraisal = "Thats pretty good!"
  } else if (percent < 85 ) {
    appraisal = "WOW!"
  } else {
    appraisal = "Pure genius!"
  }

  return (
    <>
      <h1 className={commonStyles.header1}>Your score:</h1>
      <h2 className={commonStyles.header2}>{correct} / {total}</h2>
      
      <p className={commonStyles.description}>{ appraisal }</p>

      <div className={commonStyles["flex-container"]}>
        <button className={commonStyles.button} onClick={reset}>Play again?</button>
      </div>
    </>
  )
}
