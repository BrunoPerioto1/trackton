import { useState } from "react";
import type { MeResponse } from "@/api/routes/get-me";
import { patchMe } from "@/api/routes/patch-me";
import { actionToast } from "@/lib/action-toast";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { SETTINGS_CARD } from "./SettingsSection";

type AccessField = "hasVpn" | "hasCrypto";

const ITEMS: { field: AccessField; title: string; hint: string }[] = [
  { field: "hasVpn", title: "Tenho VPN", hint: "Casas que só abrem com IP de fora do Brasil" },
  { field: "hasCrypto", title: "Tenho cripto", hint: "Casas que só aceitam depósito em cripto (USDT, BTC…)" },
];

/**
 * Verificador de acesso: o que o usuário tem. O bot cruza com os requisitos
 * da casa e põe "✅ Pode acessar" ou "⚠️ Precisa de VPN" na tip. Cada chave
 * salva na hora — não tem o que conferir antes.
 */
export function HouseAccessCard({ me, onSaved }: { me: MeResponse; onSaved: (me: MeResponse) => void }) {
  const [saving, setSaving] = useState<AccessField | null>(null);

  const toggle = async (field: AccessField) => {
    setSaving(field);
    try {
      onSaved(await patchMe({ [field]: !me[field] }));
    } catch (err) {
      actionToast.error({ description: getErrorMessage(err, "Não foi possível salvar.") });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className={cn(SETTINGS_CARD, "divide-y divide-border")}>
      {ITEMS.map(({ field, title, hint }) => {
        const on = !!me[field];
        return (
          <div key={field} className="flex items-center gap-3 px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted">{hint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={title}
              disabled={saving !== null}
              onClick={() => void toggle(field)}
              className={cn(
                "shrink-0 w-[46px] h-7 rounded-full border px-[3px] flex items-center transition-colors disabled:opacity-60",
                on ? "justify-end bg-accent border-accent" : "justify-start bg-background border-border",
              )}
            >
              <span className={cn("w-5 h-5 rounded-full", on ? "bg-white" : "bg-foreground/35")} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
