import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/common/ServiceCard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { servicesAPI } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-gradient-accent px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto text-primary mb-4 md:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground mb-3 md:mb-6">
              Nossos Serviços
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 md:px-0">
              Oferecemos uma variedade de técnicas de extensão de cílios para realçar sua beleza natural.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-4 text-sm md:text-base">Carregando serviços...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <ServiceCard key={service.id} {...service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm md:text-base">Nenhum serviço disponível no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-20 bg-secondary/30 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-background rounded-2xl p-6 md:p-12 shadow-soft text-center space-y-6 md:space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground">
              O que você precisa saber
            </h2>
            <div className="space-y-4 md:space-y-6 text-left">
              {[
                {
                  title: "Duração",
                  text: "As extensões duram de 3 a 4 semanas. Recomendamos manutenção a cada 2-3 semanas."
                },
                {
                  title: "Cuidados",
                  text: "Use produtos oil-free e escove suavemente todos os dias. Higienização todos os dias é essencial."
                },
                {
                  title: "Produtos",
                  text: "Utilizamos apenas produtos de alta qualidade, hipoalergênicos e certificados."
                },
                {
                  title: "Personalização",
                  text: "Cada aplicação é personalizada analisando o formato do seu olho e cílios naturais."
                }
              ].map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
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
              Pronta para escolher seu estilo?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              Agende agora e transforme seu olhar com nossas técnicas profissionais
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
