import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { settingsAPI } from "@/lib/api";

type DayHours = {
  open: string;
  close: string;
  closed?: boolean;
};

type Settings = {
  openingHours?: Record<string, DayHours>;
  socialLinks?: Record<string, any>;
  texts?: Record<string, any>;
};

const DEFAULT_HOURS: Record<string, DayHours> = {
  monday: { open: "09:00", close: "19:00", closed: false },
  tuesday: { open: "09:00", close: "19:00", closed: false },
  wednesday: { open: "09:00", close: "19:00", closed: false },
  thursday: { open: "09:00", close: "19:00", closed: false },
  friday: { open: "09:00", close: "19:00", closed: false },
  saturday: { open: "09:00", close: "15:00", closed: false },
  sunday: { open: "", close: "", closed: true },
};

const Configuracoes = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [openingHours, setOpeningHours] = useState<Record<string, DayHours>>(DEFAULT_HOURS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsAPI.get();
      if (data?.openingHours) {
        setOpeningHours({ ...DEFAULT_HOURS, ...data.openingHours });
      } else {
        setOpeningHours(DEFAULT_HOURS);
      }
      setSettings(data || {});
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar configurações. Usando valores padrão.");
      setOpeningHours(DEFAULT_HOURS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (day: string, key: keyof DayHours, value: string | boolean) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [key]: value as any,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...settings,
        openingHours,
      };
      await settingsAPI.update(payload);
      toast.success("Horários salvos com sucesso");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar horários");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Edite os horários de atendimento do estúdio</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Horário de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">Carregando...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(openingHours).map((day) => {
                    const d = openingHours[day];
                    return (
                      <div key={day} className="p-4 border border-border rounded-lg bg-background">
                        <h3 className="font-medium text-foreground capitalize mb-2">{day}</h3>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Aberto</Label>
                          <Input
                            type="time"
                            value={d.open}
                            onChange={(e) => handleChange(day, "open", e.target.value)}
                            disabled={!!d.closed}
                            className="w-36"
                          />
                          <span className="text-muted-foreground">até</span>
                          <Input
                            type="time"
                            value={d.close}
                            onChange={(e) => handleChange(day, "close", e.target.value)}
                            disabled={!!d.closed}
                            className="w-36"
                          />
                        </div>
                        <div className="mt-3">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!d.closed}
                              onChange={(e) => handleChange(day, "closed", e.target.checked)}
                            />
                            <span className="text-sm text-muted-foreground">Fechado neste dia</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Horários"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;
