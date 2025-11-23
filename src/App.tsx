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
import ProtectedRoute from "./components/sistema/ProtectedRoute";

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
            
            {/* Placeholders for other admin routes - to be implemented */}
            <Route path="/sistema/agenda" element={<ProtectedRoute><div>Agenda - Em desenvolvimento</div></ProtectedRoute>} />
            <Route path="/sistema/clientes" element={<ProtectedRoute><div>Clientes - Em desenvolvimento</div></ProtectedRoute>} />
            <Route path="/sistema/servicos" element={<ProtectedRoute><div>Serviços - Em desenvolvimento</div></ProtectedRoute>} />
            <Route path="/sistema/configuracoes" element={<ProtectedRoute><div>Configurações - Em desenvolvimento</div></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
