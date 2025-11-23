import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Phone, Instagram } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Sobre", path: "/sobre" },
    { label: "Serviços", path: "/servicos" },
    { label: "Galeria", path: "/galeria" },
    { label: "Contato", path: "/contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-foreground">LashStudio</span>
              <span className="text-xs text-muted-foreground -mt-1">Beleza & Elegância</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.instagram.com/juliaoliveiramartins_/?igsh=ZHdua2V5Mnk3dDY0#" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://wa.me/5562996006289" target="_blank" rel="noopener noreferrer">
                <Phone className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/agendar">Agendar Horário</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://wa.me/5562996006289" target="_blank" rel="noopener noreferrer">
                    <Phone className="w-5 h-5" />
                  </a>
                </Button>
              </div>
              <Button variant="hero" size="lg" asChild className="w-full">
                <Link to="/agendar" onClick={() => setIsMenuOpen(false)}>
                  Agendar Horário
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
