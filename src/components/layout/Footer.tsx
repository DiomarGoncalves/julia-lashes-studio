import { Link } from "react-router-dom";
import { Sparkles, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold text-foreground">LashStudio</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Realçando sua beleza natural com técnicas profissionais de extensão de cílios.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Links Rápidos</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Sobre Nós
              </Link>
              <Link to="/servicos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Serviços
              </Link>
              <Link to="/galeria" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Galeria
              </Link>
              <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contato
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contato</h3>
            <div className="flex flex-col gap-3">
              <a
              target="_blank"
              rel="external"
                href="https://wa.me/5562996006289?text=Ol%C3%A1%20Gost%C3%A1ria%20de%20agendar%20um%20hor%C3%A1rio"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                (62) 99600-6289
              </a>
              <div className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Rua das Flores, 123<br />São Paulo - SP</span>
              </div>
            </div>
          </div>

          {/* Social & Hours */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Siga-nos</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/juliaoliveiramartins_?igsh=ZHdua2V5Mnk3dDY0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-2">Horário de Atendimento</p>
              <p className="text-muted-foreground">Seg - Sex: 7h - 17h</p>
              <p className="text-muted-foreground">Sáb: 9h - 15h</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 LashStudio. Todos os direitos reservados.</p>
          <p>By Diomar Gonçalves</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
