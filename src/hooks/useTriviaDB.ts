import { useState, useEffect, useRef } from "react";

export function useTriviaDB<T = unknown>(trigger: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionToken = useRef<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let retryTimeout: ReturnType<typeof setTimeout>;

    async function fetchWithRetry(attempt: number) {
      setLoading(true);
      try {
        // Request session token if missing
        if (!sessionToken.current) {
          const tokenRes = await fetch("https://opentdb.com/api_token.php?command=request");
          const tokenData = await tokenRes.json();
          if (tokenData.response_code === 0) {
            sessionToken.current = tokenData.token;
          }
        }

        const baseUrl = "https://opentdb.com/api.php?amount=50&encode=url3986";
        const url = sessionToken.current ? `${baseUrl}&token=${sessionToken.current}` : baseUrl;

        const res = await fetch(url, { signal: controller.signal });
        
        if (res.status === 429) throw new Error("Rate limited");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        
        const json = await res.json();

        // Code 4 means the token has seen all questions; reset it
        if (json.response_code === 4) {
          sessionToken.current = null;
          fetchWithRetry(attempt);
          return;
        }

        setData(json);
        setError(null);
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
  }, [trigger]);

  return { data, loading, error };
}