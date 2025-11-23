import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { settingsAPI } from "@/lib/api";
import { motion } from "framer-motion";

type SettingsForm = {
  homeTitle: string;
  homeSubtitle: string;
  aboutText: string;
  instagram: string;
  whatsapp: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

const Configuracoes = () => {
  const [form, setForm] = useState<SettingsForm>({
    homeTitle: "",
    homeSubtitle: "",
    aboutText: "",
    instagram: "",
    whatsapp: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data: any = await settingsAPI.get();
      if (data) {
        setForm({
          homeTitle: data.texts?.homeTitle || "",
          homeSubtitle: data.texts?.homeSubtitle || "",
          aboutText: data.texts?.aboutText || "",
          instagram: data.socialLinks?.instagram || "",
          whatsapp: data.socialLinks?.whatsapp || "",
          monday: data.openingHours?.monday || "",
          tuesday: data.openingHours?.tuesday || "",
          wednesday: data.openingHours?.wednesday || "",
          thursday: data.openingHours?.thursday || "",
          friday: data.openingHours?.friday || "",
          saturday: data.openingHours?.saturday || "",
          sunday: data.openingHours?.sunday || "",
        });
      }
    } catch (error) {
      toast.error("Erro ao carregar configurações");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsAPI.update({
        texts: {
          homeTitle: form.homeTitle,
          homeSubtitle: form.homeSubtitle,
          aboutText: form.aboutText,
        },
        socialLinks: {
          instagram: form.instagram,
          whatsapp: form.whatsapp,
        },
        openingHours: {
          monday: form.monday,
          tuesday: form.tuesday,
          wednesday: form.wednesday,
          thursday: form.thursday,
          friday: form.friday,
          saturday: form.saturday,
          sunday: form.sunday,
        },
      });
      toast.success("Configurações salvas com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Configurações do site</h1>
          <p className="text-muted-foreground">
            Ajuste os textos principais, links de redes sociais e horários de funcionamento.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground mt-4">Carregando configurações...</p>
          </div>
        ) : (
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* Textos principais */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Textos principais</CardTitle>
                  <CardDescription>Esses textos aparecem na Home e na página Sobre.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="homeTitle">Título da Home</Label>
                    <Input
                      id="homeTitle"
                      value={form.homeTitle}
                      onChange={(e) => handleChange("homeTitle", e.target.value)}
                      placeholder="Ex: Realce sua beleza com cílios perfeitos"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="homeSubtitle">Subtítulo da Home</Label>
                    <Input
                      id="homeSubtitle"
                      value={form.homeSubtitle}
                      onChange={(e) => handleChange("homeSubtitle", e.target.value)}
                      placeholder="Ex: Atendimento personalizado e resultados incríveis"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aboutText">Texto Sobre</Label>
                    <Textarea
                      id="aboutText"
                      rows={6}
                      value={form.aboutText}
                      onChange={(e) => handleChange("aboutText", e.target.value)}
                      placeholder="Conte a história do estúdio, sua experiência e diferenciais."
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Redes sociais e horários */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Redes e horários</CardTitle>
                  <CardDescription>Configure como as clientes encontram e agendam com você.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={form.instagram}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/seu_perfil"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={form.whatsapp}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="Ex: 5562999999999"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <div key={day}>
                        <Label className="text-xs">
                          {day === "monday"
                            ? "Seg"
                            : day === "tuesday"
                            ? "Ter"
                            : day === "wednesday"
                            ? "Qua"
                            : day === "thursday"
                            ? "Qui"
                            : day === "friday"
                            ? "Sex"
                            : day === "saturday"
                            ? "Sab"
                            : "Dom"}
                        </Label>
                        <Input
                          value={form[day as keyof SettingsForm]}
                          onChange={(e) => handleChange(day as keyof SettingsForm, e.target.value)}
                          placeholder="Ex: 09h às 18h"
                          className="mt-1 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving ? "Salvando..." : "Salvar configurações"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;
