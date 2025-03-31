import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import AgentEditPage from './pages/AgentEditPage';
import { useApiContext } from './context/ApiContext';
import AgentSettingsPage from './pages/AgentSettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApiContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ApiProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agentes" 
              element={
                <ProtectedRoute>
                  <AgentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agentes/:slug" 
              element={
                <ProtectedRoute>
                  <AgentDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agentes/:slug/edit" 
              element={
                <ProtectedRoute>
                  <AgentEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agents/:agent_id/edit" 
              element={
                <ProtectedRoute>
                  <AgentSettingsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </ApiProvider>
  );
};

export default App;
