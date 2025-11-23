import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/common/ServiceCard";
import TestimonialCard from "@/components/common/TestimonialCard";
import { Link } from "react-router-dom";
import { Eye, Heart, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { servicesAPI, testimonialsAPI } from "@/lib/api";
import heroImage from "@/assets/hero-image.jpg";

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

const Index = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // novo estado para depoimentos
  const [testimonials, setTestimonials] = useState<{ name: string; text: string; rating: number }[]>([]);

  useEffect(() => {
    loadFeaturedServices();
    loadPublishedTestimonials();
  }, []);

  const loadFeaturedServices = async () => {
    try {
      setIsLoading(true);
      const allServices = await servicesAPI.getAll();
      setFeaturedServices(allServices.slice(0, 3));
    } catch (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublishedTestimonials = async () => {
    try {
      const published = await testimonialsAPI.getPublished();
      // transformar formato do backend para o TestimonialCard props
      const publishedFormatted = (published || []).map((t: any) => ({
        name: t.clientName || "Cliente",
        text: t.text || "",
        rating: t.rating || 5
      }));

      // mocks de fallback
      const fallback = [
        { name: "Maria Silva", text: "Adorei o resultado! Profissional super atenciosa e o ambiente é maravilhoso. Super recomendo!", rating: 5 },
        { name: "Ana Costa", text: "Já fiz várias vezes e sempre impecável. Meus cílios ficam lindos e duram bastante!", rating: 5 },
        { name: "Carla Santos", text: "Melhor decisão! Acordo pronta todos os dias. O atendimento é excelente!", rating: 5 },
      ];

      // combinar: primeiro publicados, depois preencher com fallback até 3
      const combined = [...publishedFormatted];
      for (const f of fallback) {
        if (combined.length >= 3) break;
        // evitar duplicatas simples por texto
        if (!combined.find((c) => c.text === f.text)) combined.push(f);
      }
      setTestimonials(combined.slice(0, 3));
    } catch (error) {
      toast.error("Erro ao carregar depoimentos. Exibindo exemplos.");
      // fallback
      setTestimonials([
        { name: "Maria Silva", text: "Adorei o resultado! Profissional super atenciosa e o ambiente é maravilhoso. Super recomendo!", rating: 5 },
        { name: "Ana Costa", text: "Já fiz várias vezes e sempre impecável. Meus cílios ficam lindos e duram bastante!", rating: 5 },
        { name: "Carla Santos", text: "Melhor decisão! Acordo pronta todos os dias. O atendimento é excelente!", rating: 5 },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Estúdio de extensão de cílios"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-4 md:space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
              Realce sua Beleza Natural
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground px-2 md:px-0">
              Especialistas em extensão de cílios com técnicas avançadas e cuidado personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-2">
              <Button variant="hero" size="lg" asChild className="text-sm sm:text-base">
                <Link to="/agendar">Agende seu Horário</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-sm sm:text-base">
                <Link to="/servicos">Conheça nossos Serviços</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </motion.div>
      </section>

      {/* About Preview */}
      <section className="py-12 md:py-20 bg-background px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Eye,
                title: "Técnicas Avançadas",
                desc: "Profissional especializada com as melhores técnicas do mercado"
              },
              {
                icon: Heart,
                title: "Atendimento Personalizado",
                desc: "Cada cliente recebe atenção exclusiva e cuidado individualizado"
              },
              {
                icon: Star,
                title: "Resultados Incríveis",
                desc: "Cílios perfeitos que realçam sua beleza natural por semanas"
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-3 p-4 md:p-6 bg-background rounded-xl shadow-soft">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <item.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-foreground">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 bg-secondary/30 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-2 md:mb-4">
              Nossos Serviços
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Escolha a técnica perfeita para o seu estilo
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-4 text-sm md:text-base">Carregando serviços...</p>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
              {featuredServices.map((service, index) => (
                <ServiceCard key={service.id} {...service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm md:text-base">Nenhum serviço disponível no momento</p>
            </div>
          )}

          <div className="text-center mt-10 md:mt-12">
            <Button variant="outline" size="lg" asChild className="text-sm sm:text-base">
              <Link to="/servicos">Ver todos os serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-background px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-2 md:mb-4">
              O que dizem nossas clientes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Depoimentos reais de quem confia em nosso trabalho
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-hero px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4 md:space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground">
              Pronta para transformar seu olhar?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              Agende agora e descubra como cílios perfeitos podem aumentar sua autoestima
            </p>
            <Button variant="hero" size="xl" asChild className="shadow-glow text-sm sm:text-base">
              <Link to="/agendar">Quero Agendar Agora</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
