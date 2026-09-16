import { useState, type FormEvent } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { sendLead } from "@/lib/referral";
import { useLang } from "@/lib/i18n";

export type LeadCaptureVariant = "home" | "genesis" | "claim";

/** Captura de email "quero saber mais" — não exige carteira nem bloqueia nada do site.
 *  Se um link de youtuber (?ref=...) trouxe a pessoa até aqui, o email já sai marcado
 *  com esse "ref" (ver src/lib/referral.ts) sem ela precisar digitar nada a mais.
 *  Fica inerte (mostra erro ao enviar, sem quebrar a página) até FORM_ENDPOINT ser
 *  preenchido em referral.ts — mesma convenção usada no resto do projeto.
 *
 *  `variant` escolhe o texto (título/descrição/botão/sucesso) certo pra cada página —
 *  a pessoa que já está olhando o Dashboard/Genesis está num momento diferente de quem
 *  acabou de cair na Home, então o gancho é diferente em cada lugar (ver chaves
 *  "leads.home.*" / "leads.genesis.*" / "leads.claim.*" em i18n.tsx). */
export function LeadCapture({ variant }: { variant: LeadCaptureVariant }) {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    const ok = await sendLead(email.trim());
    setStatus(ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div className="glass mt-6 flex items-center justify-center gap-2 rounded-3xl p-6 text-center text-sm text-emerald-300">
        <Check className="h-4 w-4" /> {t(`leads.${variant}.success`)}
      </div>
    );
  }

  return (
    <div className="glass mt-6 rounded-3xl p-6">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white/90">
        <Mail className="h-4 w-4 text-[var(--neon-purple)]" /> {t(`leads.${variant}.title`)}
      </div>
      <p className="mb-4 text-sm text-white/60">{t(`leads.${variant}.desc`)}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("leads.placeholder")}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[var(--neon-purple)]/60"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-neon shrink-0 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : t(`leads.${variant}.button`)}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-xs text-red-300">{t("leads.error")}</p>}
    </div>
  );
}
