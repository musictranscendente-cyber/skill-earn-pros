import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="glass flex items-center gap-1 rounded-full p-1 text-xs font-semibold">
      <button
        onClick={() => setLang("pt")}
        aria-label="Português"
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "pt" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
        }`}
      >
        PT
      </button>
      <button
        onClick={() => setLang("en")}
        aria-label="English"
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "en" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
