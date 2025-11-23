import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  // Mock data - in production, this would come from the API
  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "8",
      description: "3 pendentes",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Total de Clientes",
      value: "142",
      description: "+12 este mês",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Receita do Mês",
      value: "R$ 8.450",
      description: "+15% vs mês anterior",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Taxa de Retorno",
      value: "87%",
      description: "Clientes recorrentes",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  const upcomingAppointments = [
    { id: 1, client: "Maria Silva", service: "Volume Russo", time: "10:00", status: "confirmado" },
    { id: 2, client: "Ana Costa", service: "Manutenção", time: "13:30", status: "confirmado" },
    { id: 3, client: "Carla Santos", service: "Fio a Fio", time: "15:00", status: "pendente" },
    { id: 4, client: "Julia Oliveira", service: "Mega Volume", time: "17:00", status: "confirmado" },
  ];

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
              day: "numeric" 
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
                        <p className="font-semibold text-foreground">{appointment.client}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{appointment.time}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === "confirmado"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
