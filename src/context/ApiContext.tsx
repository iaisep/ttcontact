import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Extend the function type to include baseURL property
interface FetchWithAuthFunction extends Function {
  (endpoint: string, options?: RequestInit): Promise<any>;
  baseURL?: string;
}

interface ApiContextType {
  apiKey: string;
  baseURL: string;
  setApiKey: (key: string) => void;
  setBaseURL: (url: string) => void;
  fetchWithAuth: FetchWithAuthFunction;
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
  // Read from environment variables with fallback values
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_RETELL_API_KEY || 'key_3e56474d09efbd04003f891fae5c'
  );
  const [baseURL, setBaseURL] = useState<string>(
    import.meta.env.VITE_RETELL_BASE_URL || 'https://api.retellai.com'
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('auth_token') !== null
  );

  // Define fetchWithAuth as a FetchWithAuthFunction
  const fetchWithAuth: FetchWithAuthFunction = async (endpoint: string, options?: RequestInit) => {
    try {
      // Ensure the endpoint starts with a slash if it doesn't already
      const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      // Make sure we don't duplicate the baseURL
      const url = endpoint.includes('http') ? endpoint : `${baseURL}${formattedEndpoint}`;
      
      // Get auth token from localStorage or use the apiKey as fallback
      const authToken = localStorage.getItem('auth_token') || apiKey;
      console.log('Using auth token:', authToken ? 'Token exists' : 'No token available');
      
      // Only set default headers if they're not already set in options
      // This allows custom handling of multipart/form-data
      const defaultHeaders = {
        'Authorization': `Bearer ${authToken}`,
      };
      
      // If Content-Type is not set in options and body is not FormData, set default Content-Type
      if (options?.body && 
          !(options.body instanceof FormData) && 
          !options.headers?.['Content-Type'] &&
          !options.headers?.['content-type']) {
        defaultHeaders['Content-Type'] = 'application/json';
      }
      
      // Create fetch options - CRITICAL: Ensure we include the method from options
      const fetchOptions: RequestInit = {
        method: options?.method || 'GET', // Default to GET if not specified
        ...options, // Spread all other options
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
        // Don't include credentials mode by default
      };
      
      console.log('Making API request to:', url);
      console.log('HTTP Method:', fetchOptions.method);
      console.log('Request body:', options?.body ? 'Body exists' : 'No body');
      console.log('Headers:', JSON.stringify(fetchOptions.headers, null, 2));
      
      // For this demo app, let's use 'same-origin' instead of 'include' to avoid CORS issues
      // In a real-world app, the backend would need to be properly configured for CORS
      if (!fetchOptions.credentials) {
        fetchOptions.credentials = 'same-origin';
      }
      
      const response = await fetch(url, fetchOptions);

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
  
  // Add baseURL property to fetchWithAuth
  fetchWithAuth.baseURL = baseURL;

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
