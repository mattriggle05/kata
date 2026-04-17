import styles from './Home.module.css'
import { useTriviaDB } from '../hooks/useTriviaDB';

export default function Home() {
  const { data, loading, error } = useTriviaDB();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <p className={styles.quiz}>{JSON.stringify(data, null, 2)}</p>;
}
