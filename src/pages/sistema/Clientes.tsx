import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clientsAPI, testimonialsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Search, Calendar, Copy, Send, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Client = {
  id: string;
  name: string;
  phone: string;
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  service?: {
    name: string;
  };
};

const Clientes = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Estados para modal de link de depoimento
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [testimonialLink, setTestimonialLink] = useState<string | null>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data: any = await clientsAPI.getAll();
      setClients(data.items || data || []);
    } catch (error) {
      toast.error("Erro ao carregar clientes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectClient = async (client: Client) => {
    setSelectedClient(client);
    setIsLoadingHistory(true);
    try {
      const data: any = await clientsAPI.getById(client.id);
      setHistory(data.appointments || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar histórico do cliente");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerateTestimonialLink = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsGeneratingLink(true);
    try {
      const linkInfo = await testimonialsAPI.getLinkInfo(appointment.id);
      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/depoimento/${linkInfo.uniqueLink}`;
      setTestimonialLink(fullLink);
      toast.success("Link gerado com sucesso!");
    } catch (error: any) {
      // Se não existir, tenta criar
      if (error.response?.status === 404) {
        try {
          await testimonialsAPI.generateLink(appointment.id);
          const linkInfo = await testimonialsAPI.getLinkInfo(appointment.id);
          const baseUrl = window.location.origin;
          const fullLink = `${baseUrl}/depoimento/${linkInfo.uniqueLink}`;
          setTestimonialLink(fullLink);
          toast.success("Link gerado com sucesso!");
        } catch (err) {
          toast.error("Erro ao gerar link de depoimento");
          console.error(err);
        }
      } else {
        toast.error("Erro ao gerar link de depoimento");
        console.error(error);
      }
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (testimonialLink) {
      navigator.clipboard.writeText(testimonialLink);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  const handleSendWhatsApp = async () => {
    if (!testimonialLink || !selectedClient) return;

    setIsSendingWhatsApp(true);
    try {
      const message = encodeURIComponent(
        `Olá ${selectedClient.name}! 👋\n\nGostaria de saber sua opinião sobre o atendimento! Deixe seu depoimento aqui:\n\n${testimonialLink}\n\nObrigada! 💕`
      );
      const whatsappUrl = `https://wa.me/${selectedClient.phone.replace(/\D/g, "")}?text=${message}`;
      window.open(whatsappUrl, "_blank");
      toast.success("Abrindo WhatsApp...");
    } catch (error) {
      toast.error("Erro ao abrir WhatsApp");
      console.error(error);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const closeModal = () => {
    setShowTestimonialModal(false);
    setSelectedAppointment(null);
    setTestimonialLink(null);
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie suas clientes e visualize o histórico de atendimentos.
            </p>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-medium mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Nome ou telefone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de clientes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Lista de clientes</CardTitle>
                <CardDescription>
                  {clients.length
                    ? `${clients.length} cliente(s) cadastradas.`
                    : "Nenhum cliente cadastrado ainda."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            Carregando...
                          </TableCell>
                        </TableRow>
                      ) : filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.phone}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant={selectedClient?.id === client.id ? "default" : "outline"}
                                onClick={() => handleSelectClient(client)}
                              >
                                Ver histórico
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            Nenhuma cliente encontrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Histórico */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  {selectedClient ? `Histórico de ${selectedClient.name}` : "Selecione uma cliente"}
                </CardTitle>
                <CardDescription>
                  {selectedClient
                    ? "Visualize todos os atendimentos realizados para esta cliente."
                    : "Escolha uma cliente na lista ao lado para ver os detalhes."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedClient && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Nenhuma cliente selecionada.
                    </p>
                  </div>
                )}

                {selectedClient && (
                  <>
                    {isLoadingHistory ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                        <p className="text-muted-foreground mt-2">Carregando histórico...</p>
                      </div>
                    ) : history.length > 0 ? (
                      <div className="overflow-x-auto max-h-[420px] overflow-y-auto space-y-3">
                        {history.map((apt) => (
                          <motion.div
                            key={apt.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border border-border rounded-lg p-3 space-y-2 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <p className="text-sm font-medium">
                                    {apt.date
                                      ? new Date(apt.date).toLocaleDateString("pt-BR")
                                      : "-"}{" "}
                                    às {apt.time}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {apt.service?.name || "-"}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                {getStatusLabel(apt.status)}
                              </span>
                            </div>

                            {/* Botão de gerar link de depoimento */}
                            {apt.status === "done" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                onClick={() => {
                                  setShowTestimonialModal(true);
                                  handleGenerateTestimonialLink(apt);
                                }}
                              >
                                <Link2 className="w-3 h-3 mr-1" />
                                Gerar link de depoimento
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum atendimento encontrado para esta cliente.
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal de Link de Depoimento */}
      <Dialog open={showTestimonialModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Link de Depoimento</DialogTitle>
            <DialogDescription>
              Compartilhe este link com {selectedClient?.name} para que ela possa deixar seu depoimento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isGeneratingLink ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : testimonialLink ? (
              <>
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <p className="text-sm text-muted-foreground break-all">
                    {testimonialLink}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={handleSendWhatsApp}
                      disabled={isSendingWhatsApp}
                      className="flex-1"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSendingWhatsApp ? "Abrindo..." : "WhatsApp"}
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded p-3">
                  💡 <strong>Dica:</strong> Use o botão "WhatsApp" para enviar a mensagem automaticamente,
                  ou copie o link e compartilhe de outra forma.
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Erro ao gerar link. Tente novamente.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Clientes;
