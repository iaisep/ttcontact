
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ApiProvider } from "./context/ApiContext";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AgentDetailPage from "./pages/AgentDetailPage";
import AgentEditPage from "./pages/AgentEditPage";
import AgentsPage from "./pages/AgentsPage";
import AgentsListPage from "./pages/AgentsListPage";
import ChatAgentConfigPage from "./pages/ChatAgentConfigPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import CRMPage from "./pages/CRMPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <ApiProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agentes" element={<AgentsListPage />} />
                  <Route path="/agentes/:agentId" element={<AgentDetailPage />} />
                  <Route path="/agentes/:agentId/edit" element={<AgentEditPage />} />
                  <Route path="/chat-agents/:agentId/config" element={<ChatAgentConfigPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/help-center" element={<HelpCenterPage />} />
                  <Route path="/crm" element={<CRMPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ApiProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
