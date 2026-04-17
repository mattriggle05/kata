import styles from './Question.module.css'
import commonStyles from './common.module.css'

interface QuestionProps {
  question: string;
  answers: string[];
  onNext: (ans: string | null) => void;
  currentCount: number;
  correctAnswer: string;
  revealedAnswer: string | null | undefined;
}

export default function Question({ 
  question, 
  answers, 
  onNext, 
  currentCount,
  correctAnswer,
  revealedAnswer
}: QuestionProps) {

  // Logic to determine which color outline a button should get
  const getButtonClass = (answer: string) => {
    // If the user hasn't clicked anything yet, just return the default button class
    if (revealedAnswer === undefined) return commonStyles.button;

    // If we are revealing, apply green to the correct answer, red to the rest
    if (answer === correctAnswer) {
      return `${commonStyles.button} ${styles.correct}`;
    } else {
      return `${commonStyles.button} ${styles.incorrect}`;
    }
  };

  const isRevealing = revealedAnswer !== undefined;

  return (
    <>
      <h1 className={commonStyles.header1}>Question {currentCount}</h1>
      <h2 className={commonStyles.header2}>{decodeURIComponent(question)}</h2>
      <hr />
      <div className={commonStyles["flex-container"]}>
        {answers.slice(0, 2).map((ans, i) => (
          <button 
            key={i} 
            className={getButtonClass(ans)} 
            onClick={() => onNext(ans)}
            style={{width: "48%"}}
            disabled={isRevealing} // Lock button during animation
          >
            {decodeURIComponent(ans)}
          </button>
        ))}
      </div>
      {answers.length > 2 && (
        <div className={commonStyles["flex-container"]}>
          {answers.slice(2, 4).map((ans, i) => (
            <button 
              key={i + 2} 
              className={getButtonClass(ans)} 
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