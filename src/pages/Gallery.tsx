import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const Gallery = () => {
  // Mock gallery - in production, these would come from the API or image management
  const galleryImages = [
    { id: 1, category: "Fio a Fio", alt: "Extensão fio a fio natural" },
    { id: 2, category: "Volume Russo", alt: "Volume russo dramático" },
    { id: 3, category: "Mega Volume", alt: "Mega volume impressionante" },
    { id: 4, category: "Híbrido", alt: "Volume híbrido equilibrado" },
    { id: 5, category: "Antes/Depois", alt: "Transformação antes e depois" },
    { id: 6, category: "Estúdio", alt: "Ambiente do estúdio" },
    { id: 7, category: "Fio a Fio", alt: "Resultado natural fio a fio" },
    { id: 8, category: "Volume Russo", alt: "Olhar marcante volume russo" },
    { id: 9, category: "Detalhes", alt: "Detalhes da aplicação" },
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
            <Camera className="w-12 h-12 mx-auto text-primary mb-6" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Nossa Galeria
            </h1>
            <p className="text-xl text-muted-foreground">
              Veja nossos trabalhos e inspire-se para sua próxima transformação
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                    <p className="text-foreground/60 font-medium">{image.category}</p>
                    <p className="text-sm text-muted-foreground mt-2">{image.alt}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-background font-semibold">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Acompanhe nosso Instagram para ver mais trabalhos em tempo real e ficar por dentro 
              das novidades e promoções especiais!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Seguir no Instagram
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/agendar">Agendar Horário</Link>
              </Button>
            </div>
          </motion.div>
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
            className="max-w-4xl mx-auto bg-background rounded-2xl p-8 md:p-12 shadow-soft text-center"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Quer aparecer em nossa galeria?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Todas as nossas clientes recebem autorização para fotografarmos o resultado final. 
              As melhores fotos são publicadas em nosso Instagram (com sua permissão, claro!) e 
              você ainda concorre a descontos especiais na próxima manutenção!
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/agendar">Quero Participar</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
