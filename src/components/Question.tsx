import styles from './Question.module.css'
import commonStyles from './common.module.css'

interface QuestionProps {
  question: string;
  answers: string[];
  onNext: (answer: string | null) => void;
  currentCount: number;
}

export default function Question({ question, answers, onNext, currentCount }: QuestionProps) {
  return (
    <>
      <h1 className={styles.header1}>Question {currentCount}</h1>
      <h2 className={styles.header2}>{decodeURIComponent(question)}</h2>
      <hr />
      <div className={styles["button-container"]}>
        {answers.slice(0, 2).map((answer, i) => (
          <button key={i} style={{ width: "48%", height: "64px" }} className={commonStyles.button} onClick={() => onNext(answer)}>
            {decodeURIComponent(answer)}
          </button>
        ))}
      </div>
      {answers.length > 2 && (
        <div className={styles["button-container"]}>
          {answers.slice(2, 4).map((answer, i) => (
            <button key={i} style={{ width: "48%", height: "64px" }} className={commonStyles.button} onClick={() => onNext(answer)}>
              {decodeURIComponent(answer)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}