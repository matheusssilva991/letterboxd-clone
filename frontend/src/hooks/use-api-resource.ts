"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/services/api-client";

interface ApiResource<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

export function useApiResource<T>(
  path: string | null,
  reloadKey = 0,
): ApiResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(path));
  const [requestVersion, setRequestVersion] = useState(0);

  const reload = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    if (!path) return;

    const controller = new AbortController();
    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return null;
        setIsLoading(true);
        setError(null);
        return apiFetch<T>(path, { signal: controller.signal });
      })
      .then((result) => {
        if (result) setData(result);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar os dados.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [path, reloadKey, requestVersion]);

  return {
    data: path ? data : null,
    error: path ? error : null,
    isLoading: path ? isLoading : false,
    reload,
  };
}
