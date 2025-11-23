import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { galleryAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2, Plus, ImageIcon } from "lucide-react";

const Galeria = () => {
  const [images, setImages] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const data = await galleryAPI.getAll();
      setImages(data || []);
    } catch (error) {
      toast.error("Erro ao carregar galeria");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newUrl.trim()) {
      toast.error("Informe a URL da imagem");
      return;
    }

    if (!newAlt.trim()) {
      toast.error("Informe a descrição (alt) da imagem");
      return;
    }

    setIsAdding(true);
    try {
      await galleryAPI.create({ url: newUrl, alt: newAlt });
      toast.success("Imagem adicionada à galeria");
      setNewUrl("");
      setNewAlt("");
      await loadGallery();
    } catch (error) {
      toast.error("Erro ao adicionar imagem");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta imagem da galeria?")) return;

    try {
      await galleryAPI.delete(id);
      toast.success("Imagem deletada");
      await loadGallery();
    } catch (error) {
      toast.error("Erro ao deletar imagem");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Galeria</h1>
          <p className="text-muted-foreground">
            Gerencie imagens usadas no site e em serviços
          </p>
        </div>

        {/* Adicionar Imagem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Adicionar Imagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">URL da Imagem</Label>
                  <Input
                    id="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    disabled={isAdding}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="alt">Descrição (Alt Text)</Label>
                  <Input
                    id="alt"
                    placeholder="Ex: Extensão fio a fio natural"
                    value={newAlt}
                    onChange={(e) => setNewAlt(e.target.value)}
                    disabled={isAdding}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Descrição importante para acessibilidade e SEO
                  </p>
                </div>
                <Button
                  onClick={handleAdd}
                  disabled={isAdding || !newUrl.trim() || !newAlt.trim()}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAdding ? "Adicionando..." : "Adicionar Imagem"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Imagens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Imagens Cadastradas ({images.length})
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground mt-4">Carregando...</p>
              </div>
            ) : images.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma imagem cadastrada</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-soft transition-shadow">
                      <div className="h-48 bg-muted overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.alt || "Imagem da galeria"}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">Alt Text:</p>
                              <p className="text-sm text-muted-foreground break-words">
                                {img.alt || "Sem descrição"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">URL:</p>
                            <p className="text-xs text-muted-foreground/60 truncate">
                              {img.url}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(img.id)}
                            className="w-full mt-3"
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
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Galeria;
