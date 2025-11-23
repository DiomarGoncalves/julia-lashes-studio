import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Instagram, MessageCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { contactAPI } from "@/lib/api";

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
      await contactAPI.send(formData);
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato via WhatsApp.");
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
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aqui para responder suas dúvidas e ajudá-la a agendar seu horário
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Envie uma Mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(62) 99600-6289"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
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
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                      <a
                        href="https://api.whatsapp.com/send/?phone=5562996006289&text=Ol%C3%A1+Gost%C3%A1ria+de+agendar+um+hor%C3%A1rio&type=phone_number&app_absent=0"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        (62) 99600-6289
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">E-mail</h3>
                      <a
                        href="mailto:contato@lashstudio.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        contato@lashstudio.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                      <p className="text-muted-foreground">
                        Rua das Flores, 123<br />
                        Jardim Paulista<br />
                        São Paulo - SP, 01234-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Horário de Atendimento</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Segunda a Sexta: 9h - 19h</p>
                        <p>Sábado: 9h - 15h</p>
                        <p>Domingo: Fechado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-rose-light/20 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Atendimento Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Prefere conversar diretamente? Entre em contato via WhatsApp ou Instagram!
                </p>
                <div className="flex gap-3">
                  <Button variant="hero" size="lg" onClick={handleWhatsApp} className="flex-1">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="lg" asChild className="flex-1">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
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
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
              Como Chegar
            </h2>
            <div className="bg-muted rounded-2xl overflow-hidden h-96 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Mapa do Google será inserido aqui
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  (Embed do Google Maps)
                </p>
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
