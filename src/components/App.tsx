import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { useTriviaDB } from '../hooks/useTriviaDB';

function App() {
  const { data, loading, error } = useTriviaDB();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <p className={styles.quiz}>{JSON.stringify(data, null, 2)}</p>;
}

export default App
