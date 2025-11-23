import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  MessageCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message = encodeURIComponent(
        `Olá, meu nome é ${formData.name}. Meu telefone é ${formData.phone}. ` +
          `Mensagem: ${formData.message}`
      );
      window.open(`https://wa.me/5562996006289?text=${message}`, "_blank");
      toast.success("Abrimos uma conversa no WhatsApp com sua mensagem.");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      toast.error(
        "Não foi possível abrir o WhatsApp. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre os serviços do LashStudio.`
    );
    window.open(`https://wa.me/5562996006289?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl md:max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 md:mb-6 leading-tight">
              Entre em Contato
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              Estamos aqui para responder suas dúvidas e ajudá-la a agendar seu
              horário da forma mais rápida e prática possível.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
                Envie uma Mensagem
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Preencha os campos abaixo e entraremos em contato com você o
                mais breve possível.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone/WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(62) 99600-6289"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Telefone
                      </h3>
                      <a
                        href="https://api.whatsapp.com/send/?phone=5562996006289&text=Ol%C3%A1+Gost%C3%A1ria+de+agendar+um+hor%C3%A1rio&type=phone_number&app_absent=0"
                        className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base"
                      >
                        (62) 99600-6289
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Endereço
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Centro Comercial Abrão Olinto <br /> R. Miguel Araújo da Silva,<br />
                        Santa Bárbara de Goiás - GO, 75390-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Horário de Atendimento
                      </h3>
                      <div className="text-muted-foreground text-sm md:text-base space-y-1">
                        <p>Segunda a Sexta: 9h às 19h</p>
                        <p>Sábado: 9h às 15h</p>
                        <p>Domingo: Fechado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-rose-light/20 border border-rose-light/40 rounded-2xl p-5 md:p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-lg md:text-xl">
                  Atendimento Rápido
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Prefere conversar diretamente? Fale conosco pelo WhatsApp ou
                  acompanhe nosso trabalho no Instagram.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleWhatsApp}
                    className="flex-1"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="flex-1"
                  >
                    <a
                      href="https://www.instagram.com/juliaoliveiramartins_/?igsh=ZHdua2V5Mnk3dDY0#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Instagram
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 text-center">
              Como Chegar
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Estamos localizados em uma região de fácil acesso. Use o mapa
              abaixo para traçar a melhor rota até o estúdio.
            </p>
            <div className="bg-muted rounded-2xl overflow-hidden shadow-sm">
              <div className="relative w-full h-64 md:h-80 lg:h-[420px]">
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d638.0614041479297!2d-49.694952714480344!3d-16.57410673772041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935e13b05865bc5f%3A0xf2df4cc475084405!2sCentro%20Comercial%20Abr%C3%A3o%20Olinto!5e0!3m2!1spt-BR!2sbr!4v1763932252196!5m2!1spt-BR!2sbr"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
