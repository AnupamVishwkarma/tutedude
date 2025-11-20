import { useState, useEffect, useCallback, useRef } from "react";

export default function useFetch(url, options = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const fetchData = useCallback(
    async (overrideUrl = null, overrideOptions = null) => {
      const finalUrl = overrideUrl ?? url;
      const finalOptions = overrideOptions ?? options ?? {};

      if (!finalUrl) return;

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const resp = await fetch(finalUrl, {
          ...finalOptions,
          signal: controller.signal,
        });

        if (!resp.ok) throw new Error(`Error ${resp.status}`);

        const json = await resp.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
          setData(null);
        }
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [url, options]
  );

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const refetch = useCallback(
    (newUrl = null, newOptions = null) => fetchData(newUrl, newOptions),
    [fetchData]
  );

  return { data, loading, error, refetch };
}
