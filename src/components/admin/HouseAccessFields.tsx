import { Segmented } from "@/components/ui/segmented";
import type { HouseAccessParams } from "@/api/routes/get-admin";

export type HouseAccess = Required<HouseAccessParams>;

type Tri = "yes" | "no" | "unknown";

const TRI_OPTIONS = [
  { value: "yes", label: "Sim" },
  { value: "no", label: "Não" },
  { value: "unknown", label: "?" },
] as const;

const toTri = (v: boolean | null): Tri => (v === null ? "unknown" : v ? "yes" : "no");
const fromTri = (t: Tri): boolean | null => (t === "unknown" ? null : t === "yes");

const ROWS: { key: keyof HouseAccess; label: string }[] = [
  { key: "requiresVpn", label: "Precisa de VPN" },
  { key: "acceptsPix", label: "Aceita PIX" },
  { key: "acceptsCrypto", label: "Aceita cripto" },
];

export const houseAccessOf = (h: Partial<HouseAccess> | null | undefined): HouseAccess => ({
  requiresVpn: h?.requiresVpn ?? null,
  acceptsPix: h?.acceptsPix ?? null,
  acceptsCrypto: h?.acceptsCrypto ?? null,
});

/**
 * Requisitos da casa pro verificador de acesso. "?" = não informado: o bot
 * não avisa nada sobre aquele item em vez de chutar.
 */
export function HouseAccessFields({ value, onChange }: { value: HouseAccess; onChange: (v: HouseAccess) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {ROWS.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">{label}</span>
          <Segmented
            label={label}
            value={toTri(value[key])}
            options={TRI_OPTIONS}
            onChange={(t) => onChange({ ...value, [key]: fromTri(t) })}
          />
        </div>
      ))}
    </div>
  );
}

/** Resumo curto pra linha do catálogo: "VPN · só cripto". */
export function houseAccessSummary(h: HouseAccess): string | null {
  const parts: string[] = [];
  if (h.requiresVpn) parts.push("VPN");
  if (h.acceptsPix !== true && h.acceptsCrypto === true) parts.push("só cripto");
  else if (h.acceptsPix === true) parts.push("PIX");
  return parts.length ? parts.join(" · ") : null;
}
