import { useState } from 'react';
import { useTriviaDB } from '../hooks/useTriviaDB';
import Home from './Home';
import Question from './Question';
import Spinner from './Spinner';

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

export default function Controller() {
  const { data, loading, error } = useTriviaDB<TriviaResponse>();
  const [questionsSelected, setQuestionsSelected] = useState<number>(0);

  // CHANGED: Render Home if no selection has been made, OR if data is actively loading.
  if (questionsSelected === 0 || loading) {
    return <Home loading={loading} error={error} select={setQuestionsSelected} />
  }

  // Fallback just in case data is empty after loading finishes
  if (!data || !data.results || data.results.length === 0) {
    return <div style={{display: 'flex', justifyContent: 'center'}}><Spinner /></div>
  }

  return (
    <Question 
      question={data.results[0].question} 
      answers={[data.results[0].correct_answer, ...data.results[0].incorrect_answers]} 
    />
  );
}