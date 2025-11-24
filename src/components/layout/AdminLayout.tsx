import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Package,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Camera,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/sistema/dashboard" },
    { icon: Calendar, label: "Agenda", path: "/sistema/agenda" },
    { icon: Users, label: "Clientes", path: "/sistema/clientes" },
    { icon: Package, label: "Serviços", path: "/sistema/servicos" },
    { icon: Camera, label: "Galeria", path: "/sistema/galeria" }, // novo
    { icon: MessageCircle, label: "Depoimentos", path: "/sistema/depoimentos" },
    { icon: Settings, label: "Configurações", path: "/sistema/configuracoes" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/sistema/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-secondary/30 border-r border-border">
        <div className="p-6 border-b border-border">
          <Link to="/sistema/dashboard" className="flex items-center gap-2">
             <img
              src="/icon-192.png"
              alt="Logo LashStudio"
              className="w-10 h-10 rounded-md object-contain"
            />
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">LashStudio</h1>
              <p className="text-xs text-muted-foreground">Sistema</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <Link to="/sistema/dashboard" className="flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <div>
                    <h1 className="font-serif text-xl font-bold text-foreground">LashStudio</h1>
                    <p className="text-xs text-muted-foreground">Sistema</p>
                  </div>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sair
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-background flex items-center px-4 md:px-6">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank">
              Ver Site
            </a>
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
