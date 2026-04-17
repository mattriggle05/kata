import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTriviaDB } from '../hooks/useTriviaDB';
import Home from './Home';
import Question from './Question';
import Timer from './Timer';
import Results from './Results';


export default function QuizController() {
  const QUESTION_TIME = 10; // seconds

  const [sessionKey, setSessionKey] = useState(0);
  const { data, loading, error } = useTriviaDB(sessionKey);
  const [questionsNum, setQuestionsNum] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const pendingAnswer = useRef<string | null>(null);
  const revealTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // slice off only the number of questions we're using
  const questionsSelected = useMemo(() => {
    return data?.results?.slice(0, questionsNum) ?? []
  }, [data, questionsNum]);
  const currentQuestion = questionsSelected[currentIndex];

  // for the rest button on the results screen
  const resetQuiz = () => {
    if (revealTimeout.current) clearTimeout(revealTimeout.current);
    setQuestionsNum(0);
    setCurrentIndex(0);
    setCorrectCount(0);
    setTimeLeft(QUESTION_TIME);
    setIsFinished(false);
    setIsRevealing(false);
    setSessionKey(prev => prev + 1);
  };


  // handles selecting an answer (string) AND running out of time (null)
  const handleNextQuestion = useCallback((selectedAnswer: string | null) => {
    if (isRevealing) return;

    pendingAnswer.current = selectedAnswer;
    setIsRevealing(true);

    revealTimeout.current = setTimeout(() => {
      setTimeLeft(QUESTION_TIME);

      if (pendingAnswer.current !== null && pendingAnswer.current === currentQuestion?.correct_answer) {
        setCorrectCount(prev => prev + 1);
      }

      if (currentIndex < questionsNum - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }

      setIsRevealing(false);
    }, 1500);
  }, [isRevealing, currentQuestion, currentIndex, questionsNum]);



  // tick the timer down once per second
  useEffect(() => {
    if (questionsNum === 0 || isFinished || !currentQuestion || isRevealing) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, questionsNum, isFinished, currentQuestion, isRevealing]);


  // timer runs out
  useEffect(() => {
    if (timeLeft === 0 && currentQuestion && !isRevealing) {
      handleNextQuestion(null);
    }
  }, [timeLeft, currentQuestion, isRevealing, handleNextQuestion]);



  // uses the shuffle the answers so theyre not always int he same order
  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion) return [];

    const shuffled = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [currentQuestion]);



  // if the user hasnt selected a quiz, they get the welcome page
  if (questionsNum === 0) {
    return <Home loading={loading} error={error} select={setQuestionsNum} />;
  }

  // if they just finished their quiz they get results
  if (isFinished) {
    return <Results correct={correctCount} total={questionsSelected.length} reset={resetQuiz} />;
  }

  // otherwise we are in a quiz so we show the current question
  return (
    <div>
      <Timer timeLeft={timeLeft} timeTotal={QUESTION_TIME} />
      <Question
        question={currentQuestion.question}
        answers={shuffledAnswers}
        onNext={handleNextQuestion}
        currentCount={currentIndex + 1}
        correctAnswer={currentQuestion.correct_answer}
        isRevealing={isRevealing}
      />
    </div>
  );
}