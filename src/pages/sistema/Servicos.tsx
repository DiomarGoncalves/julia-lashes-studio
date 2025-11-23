import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { servicesAPI, serviceImagesAPI, galleryAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  active: boolean;
};

type ServiceImage = {
  id: string;
  url?: string;
  alt?: string;
  gallery?: { url: string; alt?: string };
};

const Servicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    durationMinutes: 60,
    price: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
    loadGallery();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data: Service[] = await servicesAPI.getAll();
      setServices(data || []);
    } catch (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGallery = async () => {
    try {
      const data = await galleryAPI.getAll();
      setGallery(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadServiceImages = async (serviceId: string) => {
    try {
      setIsLoadingImages(true);
      const imgs = await serviceImagesAPI.getByService(serviceId);
      setServiceImages(imgs || []);
    } catch (error) {
      toast.error("Erro ao carregar imagens do serviço");
      console.error(error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      durationMinutes: 60,
      price: 0,
    });
    loadServiceImages(service.id);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        name: form.name,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        active: true,
      };

      if (editingId) {
        await servicesAPI.update(editingId, payload);
        toast.success("Serviço atualizado com sucesso.");
        setEditingId(null);
      } else {
        await servicesAPI.create(payload);
        toast.success("Serviço criado com sucesso.");
      }

      setForm({ name: "", description: "", durationMinutes: 60, price: 0 });
      setSelectedService(null);
      await loadServices();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? "Erro ao atualizar serviço." : "Erro ao criar serviço.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || "",
      durationMinutes: service.durationMinutes,
      price: Number(service.price),
    });
    setSelectedService(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este serviço?")) return;
    try {
      setIsLoading(true);
      await servicesAPI.delete(id);
      toast.success("Serviço removido.");
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ name: "", description: "", durationMinutes: 60, price: 0 });
      }
      if (selectedService?.id === id) {
        setSelectedService(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar serviço.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await servicesAPI.update(service.id, { ...service, active: !service.active });
      toast.success("Serviço atualizado.");
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s))
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar serviço.");
    }
  };

  const handleAddImageByUrl = async () => {
    if (!selectedService) return toast.error("Selecione um serviço");
    if (!newImageUrl.trim()) return toast.error("Informe a URL da imagem");

    try {
      const payload = { serviceId: selectedService.id, url: newImageUrl, alt: selectedService.name };
      await serviceImagesAPI.create(payload);
      toast.success("Imagem adicionada ao serviço");
      setNewImageUrl("");
      loadServiceImages(selectedService.id);
    } catch (error) {
      toast.error("Erro ao adicionar imagem");
      console.error(error);
    }
  };

  const handleAddImageFromGallery = async () => {
    if (!selectedService) return toast.error("Selecione um serviço");
    if (!selectedGalleryId) return toast.error("Selecione uma imagem da galeria");

    try {
      const payload = { serviceId: selectedService.id, galleryId: selectedGalleryId };
      await serviceImagesAPI.create(payload);
      toast.success("Imagem vinculada ao serviço");
      setSelectedGalleryId(null);
      loadServiceImages(selectedService.id);
    } catch (error) {
      toast.error("Erro ao vincular imagem");
      console.error(error);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Deseja remover esta imagem do serviço?")) return;
    try {
      await serviceImagesAPI.delete(id);
      toast.success("Imagem removida");
      if (selectedService) loadServiceImages(selectedService.id);
    } catch (error) {
      toast.error("Erro ao remover imagem");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground">
              Gerencie os serviços oferecidos no estúdio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de criação / edição */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  {editingId ? "Editar serviço" : "Novo serviço"}
                </CardTitle>
                <CardDescription>
                  {editingId ? "Atualize os dados do serviço" : "Cadastre um novo serviço para oferecer às clientes."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCreate}>
                  <div>
                    <Label className="block text-sm font-medium mb-1">Nome</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Ex: Volume Russo"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium mb-1">Descrição</Label>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Breve descrição do serviço"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium mb-1">Duração (min)</Label>
                      <Input
                        type="number"
                        min={15}
                        value={form.durationMinutes}
                        onChange={(e) =>
                          setForm({ ...form, durationMinutes: Number(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-1">Preço (R$)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : (editingId ? "Salvar alterações" : "Salvar serviço")}
                    </Button>
                    {editingId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setForm({ name: "", description: "", durationMinutes: 60, price: 0 });
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lista de serviços */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Serviços cadastrados</CardTitle>
                <CardDescription>
                  Ative ou desative serviços que aparecerão para as clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.durationMinutes} min</TableCell>
                          <TableCell>
                            {Number(service.price).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                "px-2 py-1 rounded-full text-xs font-medium " +
                                (service.active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500")
                              }
                            >
                              {service.active ? "Ativo" : "Inativo"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => toggleActive(service)}>
                                {service.active ? "Desativar" : "Ativar"}
                              </Button>
                              <Button size="sm" onClick={() => handleEdit(service)}>Editar</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}>Excluir</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!services.length && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Nenhum serviço cadastrado ainda.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Gerenciamento de Imagens por Serviço */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Imagens do Serviço: {selectedService.name}
                </CardTitle>
                <CardDescription>
                  Adicione imagens por URL ou selecione da galeria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grid de imagens */}
                {isLoadingImages ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {serviceImages.map((img) => (
                      <div key={img.id} className="bg-muted rounded-lg p-3 flex flex-col gap-3">
                        <div
                          className="h-40 bg-cover bg-center rounded-md"
                          style={{ backgroundImage: `url(${img.url || img.gallery?.url})` }}
                        />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground truncate">
                            {img.alt || img.gallery?.alt || "Imagem"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteImage(img.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Adicionar imagens */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label>Adicionar por URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://..."
                      />
                      <Button onClick={handleAddImageByUrl} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adicionar da Galeria</Label>
                    <div className="flex gap-2">
                      <select
                        value={selectedGalleryId || ""}
                        onChange={(e) => setSelectedGalleryId(e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="">-- selecione --</option>
                        {gallery.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.alt || g.url}
                          </option>
                        ))}
                      </select>
                      <Button onClick={handleAddImageFromGallery} size="sm">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Servicos;
