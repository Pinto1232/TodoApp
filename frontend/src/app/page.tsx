'use client';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Todo App</h1>
          <p>Built with Next.js, Node.js &amp; Clean Architecture</p>
        </div>

        <div className={styles.card}>
          <p>Start building your features here!</p>
        </div>
      </div>
    </main>
  );
}
