import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { testimonialsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone } from "lucide-react";
import { Copy, Trash2, Send, MessageCircle } from "lucide-react";

interface Testimonial {
  id: string;
  appointmentId: string;
  clientName: string;
  clientPhone: string;
  rating: number;
  text: string;
  status: string;
  uniqueLink: string;
  createdAt: string;
}

const Depoimentos = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"pending" | "published">("pending");

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await testimonialsAPI.getAll();
      setTestimonials(data);
    } catch (error) {
      toast.error("Erro ao carregar depoimentos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (uniqueLink: string, clientName: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/depoimento/${uniqueLink}`;
    navigator.clipboard.writeText(link);
    toast.success(`Link copiado para ${clientName}!`);
  };

  // Alterado: se link não existir, gerar e obter info
  const handleSendWhatsApp = async (appointmentId: string, clientPhone: string) => {
    try {
      // tenta obter info do link
      let linkInfo;
      try {
        linkInfo = await testimonialsAPI.getLinkInfo(appointmentId);
      } catch (err: any) {
        // se 404 (link não gerado), gera
        const status = err?.response?.status;
        if (status === 404) {
          await testimonialsAPI.generateLink(appointmentId);
          linkInfo = await testimonialsAPI.getLinkInfo(appointmentId);
        } else {
          throw err;
        }
      }

      const whatsappUrl = `https://wa.me/${clientPhone.replace(/\D/g, "")}?text=${linkInfo.whatsappMessage}`;
      window.open(whatsappUrl, "_blank");
      toast.success("Abrindo WhatsApp...");
    } catch (error) {
      toast.error("Erro ao preparar link do WhatsApp");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este depoimento?")) return;

    try {
      await testimonialsAPI.delete(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast.success("Depoimento deletado");
    } catch (error) {
      toast.error("Erro ao deletar depoimento");
      console.error(error);
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) => t.status === (selectedTab === "pending" ? "pending" : "published")
  );

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${i < rating ? "text-gold" : "text-muted-foreground"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 15.27L16.18 19 14.54 12.97 20 8.64l-6.91-.59L10 2 8.91 8.05 2 8.64l5.46 4.33L7.82 19z" />
        </svg>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Depoimentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie os depoimentos das suas clientes
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 border-b border-border"
        >
          <button
            onClick={() => setSelectedTab("pending")}
            className={`pb-3 px-4 font-medium transition-colors ${
              selectedTab === "pending"
                ? "text-primary border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pendentes ({testimonials.filter((t) => t.status === "pending").length})
          </button>
          <button
            onClick={() => setSelectedTab("published")}
            className={`pb-3 px-4 font-medium transition-colors ${
              selectedTab === "published"
                ? "text-primary border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Publicados ({testimonials.filter((t) => t.status === "published").length})
          </button>
        </motion.div>

        {/* Conteúdo */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Carregando depoimentos...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {selectedTab === "pending"
                  ? "Nenhum depoimento pendente no momento"
                  : "Nenhum depoimento publicado ainda"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">
                          {testimonial.clientName}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {renderStars(testimonial.rating)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {testimonial.rating}/5
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          testimonial.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {testimonial.status === "published" ? "Publicado" : "Pendente"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{testimonial.text}"
                    </p>

                    <div className="text-xs text-muted-foreground">
                      Enviado em{" "}
                      {new Date(testimonial.createdAt).toLocaleDateString("pt-BR")}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {testimonial.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleCopyLink(testimonial.uniqueLink, testimonial.clientName)
                            }
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Link
                          </Button>

                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() =>
                              handleSendWhatsApp(
                                testimonial.appointmentId,
                                testimonial.clientPhone
                              )
                            }
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Enviar WhatsApp
                          </Button>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Depoimentos;
