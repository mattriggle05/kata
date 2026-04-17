import styles from './Timer.module.css'

export default function Timer({ timeLeft, timeTotal }: { timeLeft: number, timeTotal: number }) {
  return (
    <div className={styles['bar-container']}>
      <div className={styles['bar-background']}>
        <div className={styles['bar-fill']} style={{ 
          width: `${(timeLeft / timeTotal) * 100}%`, 
        }} />
      </div>
    </div>
  );
}

