
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ApiContextType {
  isAuthenticated: boolean;
  user: any | null;
  apiKey: string | null;
  isLoading: boolean;
  baseURL: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setApiKey: (key: string) => void;
  setBaseURL: (url: string) => void;  // Nuevo método para cambiar base URL
  fetchWithAuth: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('retell_api_key'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [baseURL, setBaseURL] = useState<string>('https://api.retellai.com');
  const navigate = useNavigate();

  // Check if user is authenticated on load
  useEffect(() => {
    const storedApiKey = localStorage.getItem('retell_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsAuthenticated(true);
      // Fetch user info
      fetchUserInfo(storedApiKey);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (key: string) => {
    try {
      const response = await fetch(`${baseURL}/workspace`, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If error, clear stored key
        localStorage.removeItem('retell_api_key');
        setApiKey(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      localStorage.removeItem('retell_api_key');
      setApiKey(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock login - in a real app, this would be a proper API call
      // For this example, we're just storing the API key provided in the password field
      localStorage.setItem('retell_api_key', password);
      setApiKey(password);
      setIsAuthenticated(true);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('retell_api_key');
    setApiKey(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    if (!apiKey) {
      throw new Error('No API key available');
    }

    const url = `${baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in API call to ${endpoint}:`, error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    apiKey,
    isLoading,
    baseURL,
    login,
    logout,
    setApiKey: (key: string) => {
      localStorage.setItem('retell_api_key', key);
      setApiKey(key);
      setIsAuthenticated(true);
    },
    setBaseURL: (url: string) => {
      setBaseURL(url);
      toast.info(`Base URL updated to: ${url}`);
    },
    fetchWithAuth,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};
