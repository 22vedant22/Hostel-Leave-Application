import { useEffect, useState } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (!url) return; // 🚨 bail out early if no url

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || `Error: ${response.statusText}, ${response.status}`);
        }

        setData(responseData);
        setError(undefined);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, ...dependencies]);

  return { data, loading, error };
};
