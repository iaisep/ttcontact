
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import AgentEditPage from './pages/AgentEditPage';
import AgentsListPage from './pages/AgentsListPage';
import AgentDetailPage from './pages/AgentDetailPage';
import ChatAgentConfigPage from './pages/ChatAgentConfigPage';
import { useLanguage } from '@/context/LanguageContext';
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HelpCenterPage from './pages/HelpCenterPage';
import DocumentationPage from './pages/DocumentationPage';
import GuidesPage from './pages/GuidesPage';
import BlogPage from './pages/BlogPage';
import ExamplesPage from './pages/ExamplesPage';
import CRMPage from './pages/CRMPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Index />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agentes" element={<AgentsListPage />} />
      <Route path="/agentes/:slug/edit" element={<AgentEditPage />} />
      <Route path="/agentes/:slug" element={<AgentDetailPage />} />
      <Route path="/agentes/new" element={<AgentEditPage />} />
      <Route path="/chat-agent/:id" element={<ChatAgentConfigPage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/docs" element={<Navigate to="/help-center" replace />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/guides" element={<GuidesPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/examples" element={<ExamplesPage />} />
      <Route path="/crm" element={<CRMPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
