import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { WalletButton } from "./WalletButton";
import { LanguageToggle } from "./LanguageToggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/play", label: t("nav.play") },
    { to: "/genesis", label: t("nav.genesis") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/claim", label: t("nav.claim") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#070B14]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="shrink-0 transition hover:opacity-80">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              activeProps={{
                className:
                  "relative rounded-full px-4 py-2 text-sm text-white bg-gradient-to-r from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/10 ring-1 ring-[var(--neon-purple)]/40 shadow-[0_0_16px_rgba(138,46,255,0.25)]",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <WalletButton />
        </div>
        <button
          className="text-white transition hover:opacity-80 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {open ? <X /> : <Menu />}
          </motion.span>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 p-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5"
                  activeProps={{
                    className:
                      "rounded-xl px-4 py-3 text-sm text-white bg-gradient-to-r from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/10 ring-1 ring-[var(--neon-purple)]/40",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex items-center justify-between gap-3 pt-2">
                <LanguageToggle />
                <WalletButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
