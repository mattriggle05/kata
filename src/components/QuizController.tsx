import { useState, useEffect, useMemo } from 'react';
import { useTriviaDB } from '../hooks/useTriviaDB';
import Home from './Home';
import Question from './Question';
import Spinner from './Spinner';
import Timer from './Timer';
import Results from './Results';

const TIMER_DURATION = 11;

export default function QuizController() {
  const [sessionKey, setSessionKey] = useState(0);
  const { data, loading, error } = useTriviaDB<any>(sessionKey);
  
  const [questionsNum, setQuestionsNum] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const questionsSelected = data?.results?.slice(0, questionsNum) || [];
  const currentQuestionData = questionsSelected[currentIndex];

  const resetQuiz = () => {
    setQuestionsNum(0);
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setTimeLeft(TIMER_DURATION);
    setIsFinished(false);
    setSessionKey(prev => prev + 1); 
  };

  // 1. Timer ONLY counts down. No other side effects.
  useEffect(() => {
    if (questionsNum === 0 || isFinished || !currentQuestionData) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, questionsNum, isFinished, currentQuestionData]);

  // 2. Watcher Effect: Triggers the next question cleanly when time hits 0
  useEffect(() => {
    if (timeLeft === 0 && currentQuestionData) {
      handleNextQuestion(null);
    }
  }, [timeLeft]);

  const handleNextQuestion = (selectedAnswer: string | null) => {
    // Reset timer immediately
    setTimeLeft(TIMER_DURATION);

    // Score logic
    if (selectedAnswer && selectedAnswer === currentQuestionData.correct_answer) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Move forward
    if (currentIndex < questionsSelected.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Safely shuffles answers once per question
  const shuffledAnswers = useMemo(() => {
    if (!currentQuestionData) return [];
    return [currentQuestionData.correct_answer, ...currentQuestionData.incorrect_answers]
      .sort(() => Math.random() - 0.5);
  }, [currentQuestionData]);

  // Logic Priority
  if (questionsNum === 0) {
    return <Home loading={loading} error={error} select={setQuestionsNum} />;
  }

  if (isFinished) {
    return <Results correct={score.correct} total={questionsSelected.length} reset={resetQuiz} />;
  }

  if (loading || !currentQuestionData) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><Spinner /></div>;
  }

  return (
    <div>
      <Timer timeLeft={timeLeft} timeTotal={TIMER_DURATION} />
      <Question
        question={currentQuestionData.question}
        answers={shuffledAnswers}
        onNext={handleNextQuestion}
        currentCount={currentIndex + 1}
      />
    </div>
  );
}