
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface ApiContextType {
  apiKey: string;
  baseURL: string;
  setApiKey: (key: string) => void;
  setBaseURL: (url: string) => void;
  fetchWithAuth: (endpoint: string, options?: RequestInit) => Promise<any>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [apiKey, setApiKey] = useState<string>('key_618d2cf39b2593b13f65725245ea');
  const [baseURL, setBaseURL] = useState<string>('https://api.retellai.com');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('auth_token') !== null
  );

  const fetchWithAuth = async (endpoint: string, options?: RequestInit) => {
    try {
      const url = `${baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      if (localStorage.getItem('auth_token')) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          ...headers,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would call your authentication API here
      // For demo purposes, we'll simulate a successful login with a mock token
      const mockToken = 'mock_auth_token_' + Math.random().toString(36).substring(2);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_email', email);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // In a real app, you would call your registration API here
      // For demo purposes, we'll simulate a successful registration
      const mockToken = 'mock_auth_token_' + Math.random().toString(36).substring(2);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_name', name);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
  };

  return (
    <ApiContext.Provider
      value={{
        apiKey,
        baseURL,
        setApiKey,
        setBaseURL,
        fetchWithAuth,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};
