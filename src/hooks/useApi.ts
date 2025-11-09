import { useState, useCallback } from 'react';
import api from '@/services/api';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<T>;
  reset: () => void;
}

export const useApi = <T,>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: any
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (): Promise<T> => {
    setState({ data: null, isLoading: true, error: null });

    try {
      let response;

      switch (method) {
        case 'GET':
          response = await api.get<T>(url);
          break;
        case 'POST':
          response = await api.post<T>(url, payload);
          break;
        case 'PUT':
          response = await api.put<T>(url, payload);
          break;
        case 'DELETE':
          response = await api.delete<T>(url);
          break;
      }

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao processar requisição';

      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
      });

      throw err;
    }
  }, [url, method, payload]);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
