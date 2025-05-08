
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import AgentEditPage from './pages/AgentEditPage';
import AgentsListPage from './pages/AgentsListPage';
import AgentDetailPage from './pages/AgentDetailPage';
import { useLanguage } from '@/context/LanguageContext';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agentes" element={<AgentsListPage />} />
      <Route path="/agentes/:slug/edit" element={<AgentEditPage />} />
      <Route path="/agentes/new" element={<AgentEditPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
