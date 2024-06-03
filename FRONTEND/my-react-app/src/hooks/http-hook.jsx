import { useState, useCallback, useRef, useEffect } from "react";
import Finder from "../api/Finder";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET' , body = null, headers = {}  ) => {
    setIsLoading(true);
    const httpAbortControl = new AbortController();
    activeHttpRequest.current.push(httpAbortControl);

    try {
      const response = await Finder({
        method,
        url,
        data: body,
        headers,
          signal: httpAbortControl.signal
      });

      activeHttpRequest.current = activeHttpRequest.current.filter(
        reqContorl => reqContorl !== httpAbortControl 
      );
  
      return response; // Return the response
    } catch (err) {
      setError(
          err.response.data.message || "Something went wrong, try again later"
        );
         throw err;
    } finally {
      setIsLoading(false); // Always set isLoading to false
    }
  
  }, []);

  const clearError = () => {
    setError(null);
  }

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortController => abortController.abort());
    }
  }, [])

  return {isLoading, error, sendRequest, clearError};
}