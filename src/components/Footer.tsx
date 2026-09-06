import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { FileText } from "lucide-react";
import { useLang } from "@/lib/i18n";

function SocialIcon({ label, children, href }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:text-white"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-white/5 bg-[#050811]/80 mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            to="/"
            onClick={() => requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
            className="inline-block transition hover:opacity-80"
          >
            <Logo />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            {t("footer.tagline")}
          </p>
          <div className="mt-5 flex gap-2">
            <SocialIcon label="Telegram" href="https://t.me/pvprofounder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
            </SocialIcon>
            <SocialIcon label="X" href="https://x.com/pvpprofounder">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.52 7.45L22 22h-6.828l-4.77-6.243L4.8 22H2l7.04-8.05L2 2h6.914l4.34 5.73L18.244 2zm-1.196 18h1.79L7.05 4H5.13l11.918 16z"/></svg>
            </SocialIcon>
            <Link
              to="/whitepaper"
              aria-label="Whitepaper"
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:text-white"
            >
              <FileText className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">{t("footer.platform")}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white">{t("nav.home")}</Link></li>
            <li><Link to="/play" className="hover:text-white">{t("nav.play")}</Link></li>
            <li><Link to="/genesis" className="hover:text-white">{t("footer.genesis")}</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">{t("footer.dashboard")}</Link></li>
            <li><Link to="/claim" className="hover:text-white">{t("footer.claim")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">{t("footer.resources")}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/whitepaper" className="hover:text-white">{t("footer.whitepaper")}</Link></li>
            <li><Link to="/" hash="faq" className="hover:text-white">{t("footer.faq")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} PvP Pro. {t("footer.rights")}</span>
          <span>{t("footer.disclaimer")}</span>
        </div>
      </div>
    </footer>
  );
}
