import { useState, useEffect } from "react";

export function useTriviaDB<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let retryTimeout: ReturnType<typeof setTimeout>;

    async function fetchWithRetry(attempt: number) {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=50&encode=url3986", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        
        setData(json);
        setLoading(false);
      } catch (err: any) {
        if (err.name === "AbortError") return;

        if (attempt < 3) {
          retryTimeout = setTimeout(() => fetchWithRetry(attempt + 1), 5000);
        } else {
          setError(err.message);
          setLoading(false);
        }
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