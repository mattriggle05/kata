import { useState, useEffect, useMemo, useRef } from 'react';
import { useTriviaDB } from '../hooks/useTriviaDB';
import Home from './Home';
import Question from './Question';
import Spinner from './Spinner';
import Timer from './Timer';
import Results from './Results';

const TIMER_DURATION = 11;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizController() {
  const [sessionKey, setSessionKey] = useState(0);
  const { data, loading, error } = useTriviaDB<any>(sessionKey);
  
  const [questionsNum, setQuestionsNum] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [revealedAnswer, setRevealedAnswer] = useState<string | null | undefined>(undefined);
  
  const revealTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questionsSelected = data?.results?.slice(0, questionsNum) || [];
  const currentQuestionData = questionsSelected[currentIndex];

  const resetQuiz = () => {
    if (revealTimeout.current) clearTimeout(revealTimeout.current);
    setQuestionsNum(0);
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setTimeLeft(TIMER_DURATION);
    setIsFinished(false);
    setRevealedAnswer(undefined);
    setSessionKey(prev => prev + 1); 
  };

  useEffect(() => {
    if (questionsNum === 0 || isFinished || !currentQuestionData || revealedAnswer !== undefined) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, questionsNum, isFinished, currentQuestionData, revealedAnswer]);

  useEffect(() => {
    if (timeLeft === 0 && currentQuestionData && revealedAnswer === undefined) {
      handleNextQuestion(null);
    }
  }, [timeLeft, currentQuestionData, revealedAnswer]);

  const handleNextQuestion = (selectedAnswer: string | null) => {
    if (revealedAnswer !== undefined) return;

    setRevealedAnswer(selectedAnswer);

    revealTimeout.current = setTimeout(() => {
      setTimeLeft(TIMER_DURATION);

      if (selectedAnswer && selectedAnswer === currentQuestionData.correct_answer) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }

      if (currentIndex < questionsSelected.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
      
      setRevealedAnswer(undefined);
    }, 1500);
  };

  const shuffledAnswers = useMemo(() => {
    if (!currentQuestionData) return [];
    
    const allAnswers = [
      currentQuestionData.correct_answer,
      ...currentQuestionData.incorrect_answers
    ];

    return shuffleArray(allAnswers);
  }, [currentQuestionData]);

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
        correctAnswer={currentQuestionData.correct_answer}
        revealedAnswer={revealedAnswer}
      />
    </div>
  );
}