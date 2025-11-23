import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import aboutImage from "@/assets/about-image.jpg";

const About = () => {
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
              Sobre Nós
            </h1>
            <p className="text-xl text-muted-foreground">
              Conheça nossa história, valores e o que nos torna especiais
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={aboutImage}
                alt="Nossa profissional"
                className="rounded-2xl shadow-elegant w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-serif font-bold text-foreground">
                Nossa História
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O LashStudio nasceu da paixão por realçar a beleza natural de cada mulher. Com mais de 
                5 anos de experiência no mercado de estética, nossa fundadora decidiu criar um espaço 
                dedicado exclusivamente à arte da extensão de cílios.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nosso compromisso é oferecer um atendimento diferenciado, utilizando apenas produtos 
                de alta qualidade e técnicas atualizadas. Cada cliente recebe atenção personalizada, 
                garantindo resultados que superam expectativas.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Acreditamos que cílios perfeitos não apenas transformam o olhar, mas também elevam 
                a autoestima e confiança de cada mulher. É isso que nos motiva todos os dias.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/agendar">Agende sua Visita</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-muted-foreground">
              O que guia nosso trabalho diariamente
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center space-y-4 p-6 bg-background rounded-xl shadow-soft"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Excelência</h3>
              <p className="text-muted-foreground">
                Buscamos sempre a perfeição em cada atendimento
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center space-y-4 p-6 bg-background rounded-xl shadow-soft"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Cuidado</h3>
              <p className="text-muted-foreground">
                Tratamos cada cliente com carinho e atenção especial
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center space-y-4 p-6 bg-background rounded-xl shadow-soft"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Confiança</h3>
              <p className="text-muted-foreground">
                Construímos relacionamentos duradouros com nossas clientes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center space-y-4 p-6 bg-background rounded-xl shadow-soft"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Resultados</h3>
              <p className="text-muted-foreground">
                Focamos em entregar resultados que superam expectativas
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-rose-light/20 rounded-2xl p-8 md:p-12"
            >
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Missão</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Proporcionar experiências transformadoras através de serviços de extensão de cílios 
                de excelência, valorizando a beleza única de cada cliente e contribuindo para sua 
                autoestima e bem-estar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-rose-light/20 rounded-2xl p-8 md:p-12"
            >
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Visão</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Ser referência em extensão de cílios, reconhecida pela excelência técnica, 
                atendimento humanizado e resultados que transformam vidas.
              </p>
            </motion.div>
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
              Venha nos conhecer!
            </h2>
            <p className="text-xl text-muted-foreground">
              Agende uma visita e descubra como podemos transformar seu olhar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/agendar">Agendar Horário</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/contato">Entrar em Contato</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
