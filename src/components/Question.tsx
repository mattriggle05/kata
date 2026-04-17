import styles from './Question.module.css'
import commonStyles from './common.module.css'

interface QuestionProps {
  question: string;
  answers: string[];
  onNext: (ans: string | null) => void;
  currentCount: number;
  correctAnswer: string;
  isRevealing: boolean;
}

export default function Question({ question, answers, onNext, currentCount, correctAnswer, isRevealing }: QuestionProps) {
  const buttonStyle = (answer: string) => {
    if (!isRevealing) return commonStyles.button;

    if (answer === correctAnswer) {
      return `${commonStyles.button} ${styles.correct}`;
    } else {
      return `${commonStyles.button} ${styles.incorrect}`;
    }
  };

  return (
    <>
      <h1 className={commonStyles.header1}>Question {currentCount}</h1>
      <h2 className={commonStyles.header2}>{decodeURIComponent(question)}</h2>
      <hr />
      <div className={commonStyles["flex-container"]}>
        {answers.slice(0, 2).map((ans, i) => (
          <button 
            key={i} 
            className={buttonStyle(ans)} 
            onClick={() => onNext(ans)}
            style={{width: "48%"}}
            disabled={isRevealing}
          >
            {decodeURIComponent(ans)}
          </button>
        ))}
      </div>
      {/* if it's true/false just do the first two button */}
      {answers.length > 2 && (
        <div className={commonStyles["flex-container"]}>
          {answers.slice(2, 4).map((ans, i) => (
            <button 
              key={i + 2} 
              className={buttonStyle(ans)} 
              onClick={() => onNext(ans)}
              style={{width: "48%"}}
              disabled={isRevealing}
            >
              {decodeURIComponent(ans)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}