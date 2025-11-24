import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { galleryAPI } from "@/lib/api";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const data = await galleryAPI.getAll();
      setGalleryImages(data || []);
    } catch (error) {
      console.error(error);
      // fallback vazio se erro
      setGalleryImages([]);
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
            <Camera className="w-10 h-10 md:w-12 md:h-12 mx-auto text-primary mb-4 md:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground mb-3 md:mb-6">
              Nossa Galeria
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 md:px-0">
              Veja nossos trabalhos e inspire-se para sua próxima transformação
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-4 text-sm md:text-base">
                Carregando galeria...
              </p>
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-muted cursor-pointer shadow-soft hover:shadow-elegant transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.alt || "Trabalho do estúdio"}
                    className="w-full h-full object-contain bg-black/5 group-hover:scale-100 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-background font-semibold text-sm md:text-base">
                      {image.alt || "Extensão de Cílios"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm md:text-base">
                Nenhuma imagem na galeria ainda
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 text-center px-4"
          >
            <p className="text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Acompanhe nosso Instagram para ver mais trabalhos em tempo real e
              ficar por dentro das novidades e promoções especiais!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                variant="hero"
                size="lg"
                asChild
                className="text-sm sm:text-base"
              >
                <a
                  href="https://www.instagram.com/juliaoliveiramartins_/?igsh=ZHdua2V5Mnk3dDY0#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Seguir no Instagram
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-sm sm:text-base"
              >
                <Link to="/agendar">Agendar Horário</Link>
              </Button>
            </div>
          </motion.div>
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
            className="max-w-4xl mx-auto bg-background rounded-2xl p-6 md:p-12 shadow-soft text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 md:mb-6">
              Quer aparecer em nossa galeria?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Todas as nossas clientes recebem autorização para fotografarmos o
              resultado final. As melhores fotos são publicadas em nosso
              Instagram (com sua permissão, claro!) e você ainda concorre a
              descontos especiais na próxima manutenção!
            </p>
            <Button
              variant="hero"
              size="lg"
              asChild
              className="text-sm sm:text-base"
            >
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
