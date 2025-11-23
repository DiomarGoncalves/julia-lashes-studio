import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { testimonialsAPI } from "@/lib/api";

const Testimonial = () => {
  const { uniqueLink } = useParams<{ uniqueLink: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"loading" | "form" | "success" | "error">("loading");
  const [testimonialInfo, setTestimonialInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    rating: 0,
    text: ""
  });

  useEffect(() => {
    loadTestimonialInfo();
  }, [uniqueLink]);

  const loadTestimonialInfo = async () => {
    try {
      setIsLoading(true);
      if (!uniqueLink) throw new Error("Link inválido");
      
      const data = await testimonialsAPI.getPublic(uniqueLink);
      setTestimonialInfo(data);
      
      if (data.status === "published") {
        setStep("success");
      } else {
        setStep("form");
      }
    } catch (error) {
      console.error(error);
      toast.error("Link de depoimento inválido ou expirado");
      setStep("error");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error("Por favor, selecione uma avaliação");
      return;
    }
    
    if (formData.text.trim().length < 10) {
      toast.error("O depoimento deve ter pelo menos 10 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!uniqueLink) throw new Error("Link inválido");
      
      await testimonialsAPI.submit(uniqueLink, {
        rating: formData.rating,
        text: formData.text
      });
      
      setStep("success");
      toast.success("Depoimento enviado com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao enviar depoimento");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-accent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando depoimento...</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-accent p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-background rounded-2xl p-8 shadow-elegant"
        >
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-3">
            Link Inválido
          </h1>
          <p className="text-muted-foreground mb-6">
            O link de depoimento não é válido ou já expirou. Redirecionando para a página inicial...
          </p>
        </motion.div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-accent p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md bg-background rounded-2xl p-8 md:p-12 shadow-elegant"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            Obrigada!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Seu depoimento foi recebido com sucesso e será em breve publicado em nosso site e Instagram.
          </p>
          
          <p className="text-sm text-muted-foreground mb-8">
            Adoramos saber sua opinião e poder compartilhar sua experiência com outras clientes!
          </p>
          
          <Button variant="hero" size="lg" asChild className="w-full">
            <a href="/">Voltar para Home</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-accent p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-background rounded-2xl p-6 md:p-12 shadow-elegant"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Deixe seu Depoimento
          </h1>
          <p className="text-muted-foreground">
            Adoramos saber sua opinião sobre o atendimento no {testimonialInfo?.serviceName}
          </p>
        </div>

        {/* Card de informações */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-rose-light/20 border border-rose-light/40 rounded-lg p-4 md:p-6 mb-8 text-center"
        >
          <p className="text-foreground font-semibold text-lg">
            {testimonialInfo?.clientName}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {testimonialInfo?.serviceName}
          </p>
        </motion.div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Label className="block text-center text-foreground font-semibold">
              Qual foi sua experiência?
            </Label>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className="transition-transform"
                >
                  <Star
                    size={48}
                    className={`${
                      star <= formData.rating
                        ? "fill-gold text-gold"
                        : "text-muted-foreground/30 hover:text-muted-foreground/60"
                    } transition-colors`}
                  />
                </motion.button>
              ))}
            </div>
            {formData.rating > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-primary font-medium"
              >
                {formData.rating} estrela{formData.rating > 1 ? "s" : ""}
              </motion.p>
            )}
          </motion.div>

          {/* Depoimento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="text" className="block text-foreground font-medium">
              Conte-nos sua experiência
            </Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Compartilhe sua experiência conosco... (mínimo 10 caracteres)"
              rows={6}
              className="resize-none text-base"
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {formData.text.length}/500 caracteres
              </p>
              {formData.text.length >= 10 && (
                <p className="text-xs text-green-600 font-medium">✓ Mínimo atingido</p>
              )}
            </div>
          </motion.div>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 pt-6"
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
              onClick={() => {
                setFormData({ rating: 0, text: "" });
              }}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="flex-1"
              disabled={isSubmitting || formData.rating === 0 || formData.text.trim().length < 10}
            >
              {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground text-center mt-8 pt-6 border-t border-border"
        >
          Seus depoimentos nos ajudam a melhorar continuamente! 💕
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Testimonial;
