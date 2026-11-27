import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ScreenFooter } from "@/components/perfil/ScreenFooter";
import { useMe } from "@/hooks/queries/use-me";
import { usePreferencesForm } from "@/hooks/use-preferences-form";
import { PreferencesFields } from "@/components/perfil/PreferencesFields";
import { PageHeader } from "@/components/ui/page-header";
import { HouseAccessCard } from "@/components/perfil/HouseAccessCard";

export default function PreferencesPage() {
  const { me, setMe } = useMe();
  const form = usePreferencesForm(me, setMe);
  // Hidrata o form quando o usuario chega — do cache (instantaneo) ou da rede.
  useEffect(() => {
    if (me) form.resetFrom(me);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  return (
    <MainLayout
      title="Preferências de aposta"
      hideBottomNav
      mobileHeader={<PageHeader back title="Preferências de aposta" />}
    >
      {!me ? (
        <FormSkeleton fields={4} />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col gap-7">
            <PreferencesFields form={form} />
            <section aria-labelledby="house-access-title" className="space-y-2">
              <h2 id="house-access-title" className="text-sm font-medium">Acesso às casas</h2>
              <p className="text-xs text-muted">A tip chega com “✅ Pode acessar” ou com o que falta. Salva na hora.</p>
              <HouseAccessCard me={me} onSaved={setMe} />
            </section>
          </div>

          <ScreenFooter onSave={form.handleSave} onDiscard={form.handleDiscard} saving={form.saving} disabled={!form.canSave} />
        </div>
      )}
    </MainLayout>
  );
}
