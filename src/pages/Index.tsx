import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/common/ServiceCard";
import TestimonialCard from "@/components/common/TestimonialCard";
import { Link } from "react-router-dom";
import { Eye, Heart, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  // Mock data - in production, these would come from the API
  const featuredServices = [
    {
      id: "1",
      name: "Fio a Fio",
      description: "Técnica natural para um olhar discreto e elegante",
      duration: "2h",
      price: "150",
    },
    {
      id: "2",
      name: "Volume Russo",
      description: "Cílios super volumosos para um olhar marcante",
      duration: "2h30",
      price: "200",
    },
    {
      id: "3",
      name: "Mega Volume",
      description: "Máximo volume e dramaticidade",
      duration: "3h",
      price: "250",
    },
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Adorei o resultado! Profissional super atenciosa e o ambiente é maravilhoso. Super recomendo!",
      rating: 5,
    },
    {
      name: "Ana Costa",
      text: "Já fiz várias vezes e sempre impecável. Meus cílios ficam lindos e duram bastante!",
      rating: 5,
    },
    {
      name: "Carla Santos",
      text: "Melhor decisão! Acordo pronta todos os dias. O atendimento é excelente!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
              Realce sua Beleza Natural
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Especialistas em extensão de cílios com técnicas avançadas e cuidado personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/agendar">Agende seu Horário</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="text-center space-y-3 p-6">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Técnicas Avançadas</h3>
              <p className="text-muted-foreground">
                Profissional especializada com as melhores técnicas do mercado
              </p>
            </div>
            <div className="text-center space-y-3 p-6">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Atendimento Personalizado</h3>
              <p className="text-muted-foreground">
                Cada cliente recebe atenção exclusiva e cuidado individualizado
              </p>
            </div>
            <div className="text-center space-y-3 p-6">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Resultados Incríveis</h3>
              <p className="text-muted-foreground">
                Cílios perfeitos que realçam sua beleza natural por semanas
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha a técnica perfeita para o seu estilo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredServices.map((service, index) => (
              <ServiceCard key={service.id} {...service} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/servicos">Ver todos os serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              O que dizem nossas clientes
            </h2>
            <p className="text-xl text-muted-foreground">
              Depoimentos reais de quem confia em nosso trabalho
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Pronta para transformar seu olhar?
            </h2>
            <p className="text-xl text-muted-foreground">
              Agende agora e descubra como cílios perfeitos podem aumentar sua autoestima
            </p>
            <Button variant="hero" size="xl" asChild className="shadow-glow">
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
