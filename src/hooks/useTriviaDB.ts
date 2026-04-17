import { useState, useEffect } from "react";

export function useTriviaDB() {
  const [data, setData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let retryTimeout: ReturnType<typeof setTimeout>;

    async function fetchWithRetry(attempt: number) {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=50", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        if (err.name === "AbortError") return;

        if (attempt < 3) { // only retry 3 times
          retryTimeout = setTimeout(() => fetchWithRetry(attempt + 1), 5000); // 5 second rate limit on api
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWithRetry(0);

    return () => {
      controller.abort();
      clearTimeout(retryTimeout);
    };
  }, []);

  return { data, loading, error };
}