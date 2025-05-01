import apiClient from '@/lib/api/client';
import { tokenAtom } from '@/lib/store/auth';
import { useAtom } from 'jotai';
import { createContext, useContext, useEffect, ReactNode, JSX } from 'react';
import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create a context for the API interceptor
const ApiInterceptorContext = createContext<boolean | null>(null);

interface ApiInterceptorProviderProps {
  children: ReactNode;
}

// Provider component to setup the interceptors
export function ApiInterceptorProvider({ children }: ApiInterceptorProviderProps): JSX.Element {
  const [token, setToken] = useAtom(tokenAtom);
  
  useEffect(() => {
    // Response interceptor
    const interceptor = apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        // Type assertion for config
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        // If error is 401 Unauthorized and not already retrying 
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Clear token using the provider's atom
          setToken(null);
          
          // You can handle redirection to login here, or let the auth guard handle it
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up the interceptor when the component unmounts
    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [setToken]); // Only re-run if setToken changes
  
  return (
    <ApiInterceptorContext.Provider value={true}>
      {children}
    </ApiInterceptorContext.Provider>
  );
}

// Hook to use in components that need to ensure interceptors are set up
export function useApiInterceptor(): boolean | null {
  return useContext(ApiInterceptorContext);
}