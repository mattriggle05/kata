import { useState, useEffect } from 'react';
import { useTriviaDB } from '../hooks/useTriviaDB';
import Home from './Home';
import Question from './Question';
import Spinner from './Spinner';
import Timer from './Timer';
import Results from './Results';

type TriviaResponse = {
  response_code: number;
  results: TriviaQuestion[];
};

export type TriviaQuestion = {
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const TIMER_DURATION = 11;

export default function QuizController() {
  const { data, loading, error } = useTriviaDB<TriviaResponse>();
  const [questionsNum, setQuestionsNum] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const questionsSelected = data?.results.slice(0, questionsNum) || [];
  const currentQuestionData = questionsSelected[currentIndex];

  // Reset function to clear all states
  const resetQuiz = () => {
    setQuestionsNum(0);
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setTimeLeft(TIMER_DURATION);
    setIsFinished(false);
  };

  useEffect(() => {
    // Don't start timer if quiz isn't active or is finished
    if (questionsNum === 0 || isFinished || !currentQuestionData) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          handleNextQuestion(null);
          return TIMER_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, questionsNum, isFinished]);

  const handleNextQuestion = (selectedAnswer: string | null) => {
    setTimeLeft(TIMER_DURATION);

    // Update Score
    if (selectedAnswer && selectedAnswer === currentQuestionData.correct_answer) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Navigation logic
    if (currentIndex < questionsSelected.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // 1. Loading/Initial State
  if (questionsNum === 0 || loading) {
    return <Home loading={loading} error={error} select={setQuestionsNum} />;
  }

  // 2. Finished State
  if (isFinished) {
    return (
      <Results 
        correct={score.correct} 
        total={questionsSelected.length} 
        reset={resetQuiz} 
      />
    );
  }

  // 3. Error/Empty State
  if (!currentQuestionData) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}><Spinner /></div>;
  }

  // 4. Active Quiz State
  return (
    <div>
      <Timer timeLeft={timeLeft} timeTotal={TIMER_DURATION} />

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <strong>Time Left: {timeLeft}s</strong> | 
        <span style={{ color: 'green' }}> Correct: {score.correct}</span> | 
        <span style={{ color: 'red' }}> Incorrect: {score.incorrect}</span>
      </div>

      <Question
        question={currentQuestionData.question}
        answers={[currentQuestionData.correct_answer, ...currentQuestionData.incorrect_answers]}
        onNext={handleNextQuestion}
        currentCount={currentIndex + 1}
      />
    </div>
  );
}