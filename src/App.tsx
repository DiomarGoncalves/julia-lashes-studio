import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import Login from "./pages/sistema/Login";
import Dashboard from "./pages/sistema/Dashboard";
import Agenda from "./pages/sistema/Agenda";
import Clientes from "./pages/sistema/Clientes";
import Servicos from "./pages/sistema/Servicos";
import Configuracoes from "./pages/sistema/Configuracoes";
import ProtectedRoute from "./components/sistema/ProtectedRoute";
import Testimonial from "./pages/Testimonial";
import Depoimentos from "./pages/sistema/Depoimentos";
import Galeria from "./pages/sistema/Galeria";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/agendar" element={<Booking />} />
            <Route path="/depoimento/:uniqueLink" element={<Testimonial />} />

            {/* Admin Routes */}
            <Route path="/sistema/login" element={<Login />} />
            <Route
              path="/sistema/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/sistema" element={<Navigate to="/sistema/dashboard" replace />} />
            <Route path="/sistema/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
            <Route path="/sistema/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
            <Route path="/sistema/servicos" element={<ProtectedRoute><Servicos /></ProtectedRoute>} />
            <Route path="/sistema/galeria" element={<ProtectedRoute><Galeria /></ProtectedRoute>} />
            <Route path="/sistema/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            <Route
              path="/sistema/depoimentos"
              element={
                <ProtectedRoute>
                  <Depoimentos />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
