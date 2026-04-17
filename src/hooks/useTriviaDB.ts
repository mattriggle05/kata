import { useState, useEffect, useRef } from "react";

export type TriviaResponse = {
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

// Global rate-limit tracker to survive React unmounts/Strict Mode
let lastFetchTime = 0;

export function useTriviaDB(trigger: number) {
  const [data, setData] = useState<TriviaResponse | null>(null);
  const[error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionToken = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrivia() {
      setLoading(true);
      setError(null);

      try {
        // get token if needed
        if (!sessionToken.current) {
          const tokenRes = await fetch("https://opentdb.com/api_token.php?command=request");
          const tokenData = await tokenRes.json();
          if (tokenData.response_code === 0) {
            sessionToken.current = tokenData.token;
          }
        }

        // there is a 5 second rate limit so we have to obey that by waiting
        const timeSinceLastFetch = Date.now() - lastFetchTime;
        if (timeSinceLastFetch < 5000) {
          await new Promise(resolve => setTimeout(resolve, 5000 - timeSinceLastFetch));
        }

        lastFetchTime = Date.now();
        let url = sessionToken.current 
          ? `https://opentdb.com/api.php?amount=50&encode=url3986&token=${sessionToken.current}`
          : `https://opentdb.com/api.php?amount=50&encode=url3986`;

        let res = await fetch(url);
        
        if (res.status === 429) throw new Error("Rate limited by server");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        
        let json: TriviaResponse = await res.json();

        // 3 = token not found, 4 = token exaughted
        if (json.response_code === 3 || json.response_code === 4) {
          if (json.response_code === 3) {
            // Token expired or dropped by server, get a new one
            const tokenRes = await fetch("https://opentdb.com/api_token.php?command=request");
            const tokenData = await tokenRes.json();
            sessionToken.current = tokenData.token;
          } else if (json.response_code === 4) {
            await fetch(`https://opentdb.com/api_token.php?command=reset&token=${sessionToken.current}`);
          }

          // we have to wait again because those count as ai calls too
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          lastFetchTime = Date.now();
          res = await fetch(`https://opentdb.com/api.php?amount=50&encode=url3986&token=${sessionToken.current}`);
          json = await res.json();
        }

        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchTrivia();

    return () => {
      isMounted = false;
    };
  }, [trigger]);

  return { data, loading, error };
}