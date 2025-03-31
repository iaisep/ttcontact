
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ApiProvider } from "@/context/ApiContext";
import LanguageProvider from "@/context/LanguageContext";

// Importamos las páginas relacionadas con agentes
import AgentsPage from "./pages/AgentsPage";
import AgentEditPage from "./pages/AgentEditPage";
import AgentDetailPage from "./pages/AgentDetailPage";

// Importamos las nuevas páginas (componentes temporales que redirigirán)
import VoiceSDKPage from "./pages/VoiceSDKPage";
import AIAgentsPage from "./pages/AIAgentsPage";
import DocumentationPage from "./pages/DocumentationPage";
import BlogPage from "./pages/BlogPage";
import GuidesPage from "./pages/GuidesPage";
import ExamplesPage from "./pages/ExamplesPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import PressPage from "./pages/PressPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import GDPRPage from "./pages/GDPRPage";
import APIPage from "./pages/APIPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <ApiProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Rutas de agentes */}
              <Route path="/agentes" element={<AgentsPage />} />
              <Route path="/agentes/:slug/edit" element={<AgentEditPage />} />
              <Route path="/agentes/:slug" element={<AgentDetailPage />} />
              
              {/* Nuevas rutas */}
              <Route path="/voice-sdk" element={<VoiceSDKPage />} />
              <Route path="/ai-agents" element={<AIAgentsPage />} />
              <Route path="/docs" element={<DocumentationPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/gdpr" element={<GDPRPage />} />
              <Route path="/api" element={<APIPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ApiProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
