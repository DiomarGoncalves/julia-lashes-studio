import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { appointmentsAPI, servicesAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, CheckCircle2, XCircle } from "lucide-react";

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  client: { name: string; phone: string };
  service: { name: string };
};

const Agenda = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    loadAppointments();
    loadServices();
  }, [selectedDate]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentsAPI.getAll({ date: selectedDate });
      setAppointments(data || []);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, newStatus);
      toast.success("Status atualizado");
      await loadAppointments();
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      case "no_show":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "done":
        return "Realizado";
      case "canceled":
        return "Cancelado";
      case "no_show":
        return "Não compareceu";
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos do dia
          </p>
        </div>

        {/* Seletor de Data */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Selecione a Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                >
                  Hoje
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agendamentos do Dia */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Agendamentos de {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </CardTitle>
              <CardDescription>
                Total: {appointments.length} agendamento(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="text-muted-foreground mt-4">Carregando...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum agendamento para esta data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-border rounded-lg p-4 hover:shadow-soft transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Hora</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-foreground">{apt.time}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cliente</p>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <div>
                              <p className="font-semibold text-foreground">{apt.client.name}</p>
                              <p className="text-xs text-muted-foreground">{apt.client.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Serviço</p>
                          <p className="font-semibold text-foreground">{apt.service.name}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                              {getStatusLabel(apt.status)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(apt.id, 'done')}
                              className="flex-1"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Realizado
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(apt.id, 'canceled')}
                              className="flex-1 text-destructive"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Agenda;
