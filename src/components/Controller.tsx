import { useState } from 'react';
import { useTriviaDB } from '../hooks/useTriviaDB';
import Home from './Home';

export default function Controller() {
  const { data, loading, error } = useTriviaDB();
  const [questionsSelected, setquestionsSelected] = useState<number>(0)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {
        questionsSelected == 0 ?
          <Home loading={loading} error={error} select={setquestionsSelected}></Home>
        :
          <p>{questionsSelected}</p>
      }
    </>
  )
}
