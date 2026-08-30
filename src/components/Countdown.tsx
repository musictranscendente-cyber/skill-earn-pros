import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

export function Countdown({ to }: { to: string }) {
  const { t } = useLang();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = new Date(to).getTime();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const items = [
    { v: d, l: t("countdown.days") },
    { v: h, l: t("countdown.hrs") },
    { v: m, l: t("countdown.min") },
    { v: s, l: t("countdown.sec") },
  ];
  return (
    <div className="grid grid-cols-4 gap-1 md:gap-1.5">
      {items.map((it, idx) => (
        <div key={idx} className="glass min-w-0 rounded-lg px-0.5 py-2 text-center md:rounded-xl md:px-1.5 md:py-3">
          <div className="text-silver text-base font-bold leading-none tabular-nums md:text-2xl">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="mt-1 truncate text-[8px] uppercase tracking-widest text-white/50 md:text-[10px]">{it.l}</div>
        </div>
      ))}
    </div>
  );
}
