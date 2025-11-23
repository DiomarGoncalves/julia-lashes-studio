import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { servicesAPI, appointmentsAPI } from "@/lib/api";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    serviceId: searchParams.get("service") || "",
    date: "",
    time: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (error) {
      // Fallback to mock data if API fails
      setServices([
        { id: "1", name: "Fio a Fio", price: 150, duration: "2h" },
        { id: "2", name: "Volume Russo", price: 200, duration: "2h30" },
        { id: "3", name: "Mega Volume", price: 250, duration: "3h" },
        { id: "4", name: "Volume Híbrido", price: 180, duration: "2h30" },
        { id: "5", name: "Manutenção", price: 100, duration: "1h30" },
      ]);
    }
  };

  const loadAvailability = async () => {
    if (!bookingData.serviceId || !bookingData.date) return;
    
    setIsLoading(true);
    try {
      const data = await appointmentsAPI.getAvailability(bookingData.serviceId, bookingData.date);
      setAvailableTimes(data.availableTimes || []);
    } catch (error) {
      // Fallback to mock times
      setAvailableTimes(["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3) {
      loadAvailability();
    }
  }, [step, bookingData.date]);

  const handleSubmit = async () => {
    if (!bookingData.name || !bookingData.phone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      await appointmentsAPI.create(bookingData);
      setStep(5);
      toast.success("Agendamento realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar agendamento. Tente novamente ou entre em contato via WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedService = services.find((s) => s.id === bookingData.serviceId);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Escolha o Serviço
            </h2>
            <RadioGroup
              value={bookingData.serviceId}
              onValueChange={(value) => setBookingData({ ...bookingData, serviceId: value })}
              className="space-y-4"
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    bookingData.serviceId === service.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setBookingData({ ...bookingData, serviceId: service.id })}
                >
                  <RadioGroupItem value={service.id} id={service.id} />
                  <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground">Duração: {service.duration}</p>
                      </div>
                      <p className="text-primary font-bold text-lg">R$ {service.price}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!bookingData.serviceId}
              onClick={() => setStep(2)}
            >
              Continuar
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Escolha a Data
            </h2>
            <div>
              <Label htmlFor="date">Selecione uma data</Label>
              <Input
                id="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
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
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Escolha o Horário
            </h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground mt-4">Carregando horários...</p>
              </div>
            ) : availableTimes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={bookingData.time === time ? "hero" : "outline"}
                    onClick={() => setBookingData({ ...bookingData, time })}
                    className="h-16"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">
                  Não há horários disponíveis para esta data.
                  <br />
                  Por favor, escolha outra data.
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={() => setStep(2)} className="flex-1">
                Voltar
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
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
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Seus Dados
            </h2>
            
            {/* Resumo */}
            <div className="bg-rose-light/20 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-foreground mb-4">Resumo do Agendamento</h3>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Serviço:</span>
                <span className="font-medium text-foreground">{selectedService?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium text-foreground">
                  {new Date(bookingData.date + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Horário:</span>
                <span className="font-medium text-foreground">{bookingData.time}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone/WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  placeholder="(62) 99600-6289"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={() => setStep(3)} className="flex-1">
                Voltar
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
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
            className="text-center space-y-6 py-12"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-foreground">
              Agendamento Confirmado!
            </h2>
            <div className="bg-rose-light/20 rounded-lg p-6 max-w-md mx-auto space-y-3">
              <p className="text-foreground font-semibold">{selectedService?.name}</p>
              <p className="text-muted-foreground">
                {new Date(bookingData.date + "T00:00:00").toLocaleDateString("pt-BR")} às{" "}
                {bookingData.time}
              </p>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enviamos uma confirmação para seu WhatsApp. Caso precise remarcar ou cancelar, entre
              em contato conosco com antecedência.
            </p>
            <Button variant="hero" size="lg" onClick={() => (window.location.href = "/")}>
              Voltar para Home
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            {step < 5 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                        s === step
                          ? "bg-primary text-primary-foreground scale-110"
                          : s < step
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < step ? <Check className="w-5 h-5" /> : s}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
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

            {/* Step Content */}
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
