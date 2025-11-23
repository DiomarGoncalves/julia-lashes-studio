import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/common/ServiceCard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Services = () => {
  // Mock data - in production, this would come from the API
  const services = [
    {
      id: "1",
      name: "Fio a Fio",
      description: "Técnica que aplica um fio de extensão em cada cílio natural, proporcionando um resultado discreto e elegante. Perfeito para o dia a dia.",
      duration: "2h",
      price: "150",
    },
    {
      id: "2",
      name: "Volume Russo",
      description: "Técnica que utiliza múltiplos fios finos por cílio natural, criando um volume impressionante e olhar marcante.",
      duration: "2h30",
      price: "200",
    },
    {
      id: "3",
      name: "Mega Volume",
      description: "Para quem deseja máximo impacto. Aplicação de até 10 fios ultra finos por cílio, criando dramaticidade sem peso.",
      duration: "3h",
      price: "250",
    },
    {
      id: "4",
      name: "Volume Híbrido",
      description: "Combinação perfeita entre fio a fio e volume russo, equilibrando naturalidade e volume para um resultado único.",
      duration: "2h30",
      price: "180",
    },
    {
      id: "5",
      name: "Manutenção",
      description: "Reposição dos cílios que caíram naturalmente, mantendo o volume e a beleza do seu olhar. Recomendado a cada 2-3 semanas.",
      duration: "1h30",
      price: "100",
    },
    {
      id: "6",
      name: "Remoção",
      description: "Remoção profissional e segura das extensões, com cuidado especial para preservar seus cílios naturais.",
      duration: "30min",
      price: "50",
    },
  ];

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
            <Sparkles className="w-12 h-12 mx-auto text-primary mb-6" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-muted-foreground">
              Oferecemos uma variedade de técnicas de extensão de cílios para realçar sua beleza natural. 
              Cada serviço é personalizado de acordo com seu estilo e preferências.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard key={service.id} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">
              O que você precisa saber
            </h2>
            <div className="space-y-6 bg-background rounded-2xl p-8 md:p-12 shadow-soft">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Duração</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As extensões duram de 3 a 4 semanas, dependendo do ciclo de crescimento dos seus 
                  cílios naturais. Recomendamos manutenção a cada 2-3 semanas para manter o volume perfeito.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Cuidados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use produtos oil-free e escove suavemente 
                  todos os dias. Não use curvex nem máscara nos cílios com extensão. Higienização todos os dias é essencial.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Produtos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos apenas produtos de alta qualidade, hipoalergênicos e certificados. 
                  Sua segurança e saúde ocular são nossas prioridades.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Personalização</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cada aplicação é personalizada. Analisamos o formato do seu olho, cílios naturais e 
                  seu estilo para criar o resultado perfeito para você.
                </p>
              </div>
            </div>
          </motion.div>
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
              Pronta para escolher seu estilo?
            </h2>
            <p className="text-xl text-muted-foreground">
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
