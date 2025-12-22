import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Calendar, Clock, User, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { servicesAPI, appointmentsAPI } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const [bookingData, setBookingData] = useState({
    serviceId: searchParams.get("service") || "",
    date: "",
    time: "",
    name: "",
    phone: "",
  });

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h${m}m`;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const selectedService = useMemo(
    () => services.find((s) => s.id === bookingData.serviceId),
    [services, bookingData.serviceId]
  );

  // Detecta mobile pra decidir target do link
  const isMobile = () =>
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  const openWhatsApp = () => {
    const targetPhone = "5562996006289";

    const dateBr =
      bookingData.date &&
      new Date(bookingData.date + "T00:00:00").toLocaleDateString("pt-BR");

    const message = `
Olá, gostaria de confirmar um agendamento.

Servico: ${selectedService?.name ?? "-"}
Data: ${dateBr || "-"}
Horario: ${bookingData.time || "-"}

Nome: ${bookingData.name || "-"}
Telefone: ${bookingData.phone || "-"}
`.trim();

    // api.whatsapp.com costuma ser o mais compatível no mobile
    const url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(
      message
    )}`;

    // No mobile, abrir na mesma aba é mais confiável
    if (isMobile()) {
      window.location.href = url;
      return;
    }

    // No desktop, pode abrir em nova aba
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadServices = async () => {
    try {
      setIsLoadingServices(true);
      const data = await servicesAPI.getAll();
      setServices(data || []);
    } catch (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Ao trocar serviço, zera data/time e horários
  useEffect(() => {
    if (!bookingData.serviceId) return;
    setBookingData((prev) => ({ ...prev, date: "", time: "" }));
    setAvailableTimes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.serviceId]);

  // Ao trocar data, zera time e horários
  useEffect(() => {
    if (!bookingData.date) return;
    setBookingData((prev) => ({ ...prev, time: "" }));
    setAvailableTimes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData.date]);

  const loadAvailability = async () => {
    if (!bookingData.serviceId || !bookingData.date) return;

    setIsLoading(true);
    try {
      const data = await appointmentsAPI.getAvailability(
        bookingData.serviceId,
        bookingData.date
      );
      setAvailableTimes(data?.availableTimes || []);
    } catch (error) {
      toast.error("Erro ao carregar horários disponíveis");
      console.error(error);
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3) {
      loadAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, bookingData.date, bookingData.serviceId]);

  const handleSubmit = async () => {
    if (!bookingData.name || !bookingData.phone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!bookingData.serviceId || !bookingData.date || !bookingData.time) {
      toast.error("Por favor, finalize serviço, data e horário");
      return;
    }

    setIsLoading(true);
    try {
      await appointmentsAPI.create(bookingData);

      // NÃO abre automático (pra não bloquear no celular).
      // A gente deixa o botão no step 5 fazer isso.
      setStep(5);
      toast.success("Agendamento realizado com sucesso!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Erro ao realizar agendamento. Tente novamente ou entre em contato via WhatsApp."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 md:space-y-6 px-2 md:px-0"
          >
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-serif font-bold text-foreground mb-4 md:mb-6">
              Escolha o Serviço
            </h2>

            {isLoadingServices ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              </div>
            ) : (
              <>
                <RadioGroup
                  value={bookingData.serviceId}
                  onValueChange={(value) =>
                    setBookingData({ ...bookingData, serviceId: value })
                  }
                  className="space-y-3 md:space-y-4"
                >
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-start space-x-3 p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        bookingData.serviceId === service.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setBookingData({ ...bookingData, serviceId: service.id })
                      }
                    >
                      <RadioGroupItem value={service.id} id={service.id} />
                      <Label
                        htmlFor={service.id}
                        className="flex-1 cursor-pointer flex-col space-y-1"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <p className="font-semibold text-foreground text-sm md:text-base">
                            {service.name}
                          </p>
                          <p className="text-primary font-bold text-base md:text-lg">
                            R$ {service.price}
                          </p>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Duração: {formatDuration(service.durationMinutes)}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full text-sm sm:text-base"
                  disabled={!bookingData.serviceId}
                  onClick={() => setStep(2)}
                >
                  Continuar
                </Button>
              </>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 md:space-y-6 px-2 md:px-0"
          >
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-serif font-bold text-foreground mb-4 md:mb-6">
              Escolha a Data
            </h2>

            <div>
              <Label htmlFor="date" className="text-sm md:text-base">
                Selecione uma data
              </Label>
              <Input
                id="date"
                type="date"
                min={getMinDate()}
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
                className="mt-2 text-sm md:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep(1)}
                className="flex-1 text-sm sm:text-base"
              >
                Voltar
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1 text-sm sm:text-base"
                disabled={!bookingData.date}
                onClick={() => setStep(3)}
              >
                Continuar
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 md:space-y-6 px-2 md:px-0"
          >
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-serif font-bold text-foreground mb-4 md:mb-6">
              Escolha o Horário
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground mt-4 text-sm md:text-base">
                  Carregando horários...
                </p>
              </div>
            ) : availableTimes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={bookingData.time === time ? "hero" : "outline"}
                    onClick={() => setBookingData({ ...bookingData, time })}
                    className="h-12 md:h-14 text-xs sm:text-sm"
                  >
                    <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground text-sm md:text-base px-4">
                  Não há horários disponíveis para esta data.
                  <br />
                  Por favor, escolha outra data.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep(2)}
                className="flex-1 text-sm sm:text-base"
              >
                Voltar
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1 text-sm sm:text-base"
                disabled={!bookingData.time}
                onClick={() => setStep(4)}
              >
                Continuar
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 md:space-y-6 px-2 md:px-0"
          >
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-serif font-bold text-foreground mb-4 md:mb-6">
              Seus Dados
            </h2>

            <div className="bg-rose-light/20 rounded-lg p-4 md:p-6 space-y-3">
              <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">
                Resumo do Agendamento
              </h3>

              <div className="flex items-center gap-3 text-xs md:text-sm">
                <User className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Serviço:</span>
                <span className="font-medium text-foreground break-words">
                  {selectedService?.name}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs md:text-sm">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium text-foreground">
                  {bookingData.date
                    ? new Date(bookingData.date + "T00:00:00").toLocaleDateString(
                        "pt-BR"
                      )
                    : "-"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs md:text-sm">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Horário:</span>
                <span className="font-medium text-foreground">
                  {bookingData.time || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm md:text-base">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  value={bookingData.name}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, name: e.target.value })
                  }
                  placeholder="Seu nome"
                  className="mt-2 text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm md:text-base">
                  Telefone/WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, phone: e.target.value })
                  }
                  placeholder="(62) 99600-6289"
                  className="mt-2 text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep(3)}
                className="flex-1 text-sm sm:text-base"
              >
                Voltar
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1 text-sm sm:text-base"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 md:space-y-6 py-8 md:py-12 px-2 md:px-0"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-4xl font-serif font-bold text-foreground">
              Agendamento Confirmado!
            </h2>

            <div className="bg-rose-light/20 rounded-lg p-4 md:p-6 max-w-md mx-auto space-y-2 md:space-y-3">
              <p className="text-foreground font-semibold text-sm md:text-base">
                {selectedService?.name}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">
                {bookingData.date
                  ? new Date(bookingData.date + "T00:00:00").toLocaleDateString(
                      "pt-BR"
                    )
                  : "-"}{" "}
                às {bookingData.time}
              </p>
            </div>

            <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base px-2">
              Para confirmar ou falar com a equipe, clique no botão abaixo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="hero"
                size="lg"
                onClick={openWhatsApp}
                className="text-sm sm:text-base"
              >
                Confirmar no WhatsApp
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                className="text-sm sm:text-base"
              >
                Voltar para Home
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-20 md:pt-32 pb-12 md:pb-20 min-h-screen px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            {step < 5 && (
              <div className="mb-8 md:mb-12">
                <div className="flex justify-between items-center mb-3 md:mb-4 gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-semibold transition-all text-xs md:text-sm ${
                        s === step
                          ? "bg-primary text-primary-foreground scale-110"
                          : s < step
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < step ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        s
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-1 md:gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        s <= step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
