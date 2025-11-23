import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { appointmentsAPI, clientsAPI, servicesAPI } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStat {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const [appointmentsResponse, clientsResponse, servicesResponse] = await Promise.all([
          appointmentsAPI.getAll({ date: dateStr }),
          clientsAPI.getAll(),
          servicesAPI.getAll(),
        ]);

        // Garantir que são arrays
        const todayAppointments = Array.isArray(appointmentsResponse)
          ? appointmentsResponse
          : (appointmentsResponse?.items || []);

        const clients = Array.isArray(clientsResponse)
          ? clientsResponse
          : (clientsResponse?.items || []);

        const services = Array.isArray(servicesResponse)
          ? servicesResponse
          : [];

        const activeServices = services.filter((s: any) => s.active);
        const pendingCount = todayAppointments.filter((a: any) => a.status === "scheduled").length;
        const lastAppointment = todayAppointments[todayAppointments.length - 1];

        const lastAppointmentText = lastAppointment
          ? `${lastAppointment.time} - ${lastAppointment.client?.name || lastAppointment.clientName || "Cliente"}`
          : "Nenhum agendamento";

        const lastAppointmentDesc = lastAppointment
          ? "Último horário agendado hoje"
          : "Nenhum agendamento hoje";

        setStats([
          {
            title: "Agendamentos Hoje",
            value: String(todayAppointments.length),
            description: pendingCount ? `${pendingCount} pendente(s)` : "Nenhum pendente",
            icon: Calendar,
            color: "text-primary",
          },
          {
            title: "Total de Clientes",
            value: String(clients.length),
            description: "Clientes cadastradas",
            icon: Users,
            color: "text-primary",
          },
          {
            title: "Serviços Ativos",
            value: String(activeServices.length),
            description: "Serviços disponíveis para agendamento",
            icon: TrendingUp,
            color: "text-primary",
          },
          {
            title: "Último agendamento",
            value: lastAppointmentText,
            description: lastAppointmentDesc,
            icon: DollarSign,
            color: "text-primary",
          },
        ]);

        setUpcomingAppointments(todayAppointments.slice(0, 5));
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do dashboard.");
        // Definir valores padrão em caso de erro
        setStats([
          {
            title: "Agendamentos Hoje",
            value: "0",
            description: "Nenhum pendente",
            icon: Calendar,
            color: "text-primary",
          },
          {
            title: "Total de Clientes",
            value: "0",
            description: "Clientes cadastradas",
            icon: Users,
            color: "text-primary",
          },
          {
            title: "Serviços Ativos",
            value: "0",
            description: "Serviços disponíveis para agendamento",
            icon: TrendingUp,
            color: "text-primary",
          },
          {
            title: "Status",
            value: "Erro",
            description: "Falha ao carregar dados",
            icon: DollarSign,
            color: "text-primary",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados do dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio - {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Próximos Agendamentos</CardTitle>
                <CardDescription>Agendamentos de hoje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {appointment.client?.name || appointment.clientName || "Cliente"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.service?.name || appointment.serviceName || "Serviço"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{appointment.time}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            appointment.status === "done"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "canceled"
                                ? "bg-red-100 text-red-700"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {appointment.status === "scheduled"
                            ? "Agendado"
                            : appointment.status === "done"
                              ? "Realizado"
                              : appointment.status === "canceled"
                                ? "Cancelado"
                                : appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
