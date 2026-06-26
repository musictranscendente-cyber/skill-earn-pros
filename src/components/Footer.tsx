import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Github, FileText } from "lucide-react";

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
  return (
    <footer className="border-t border-white/5 bg-[#050811]/80 mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-white/60">
            PvP Pro is the world's most competitive skill-based gaming ecosystem. Where skill becomes reward.
          </p>
          <div className="mt-5 flex gap-2">
            <SocialIcon label="Discord" href="#">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369A19.79 19.79 0 0016.558 3a13.7 13.7 0 00-.617 1.265 18.27 18.27 0 00-5.886 0A12.6 12.6 0 009.43 3a19.83 19.83 0 00-3.76 1.37C2.018 9.91 1.207 15.31 1.62 20.63a19.93 19.93 0 006.073 3.07c.49-.67.927-1.387 1.304-2.137a12.94 12.94 0 01-2.054-.99c.172-.127.34-.26.503-.39 3.927 1.83 8.18 1.83 12.06 0 .165.13.333.263.504.39a12.97 12.97 0 01-2.057.991c.378.75.814 1.466 1.304 2.137a19.92 19.92 0 006.075-3.07c.482-6.165-.823-11.519-3.515-16.262zM8.02 16.33c-1.183 0-2.157-1.085-2.157-2.42 0-1.336.955-2.422 2.157-2.422 1.21 0 2.176 1.094 2.156 2.422 0 1.335-.955 2.42-2.156 2.42zm7.96 0c-1.183 0-2.156-1.085-2.156-2.42 0-1.336.954-2.422 2.156-2.422 1.21 0 2.176 1.094 2.156 2.422 0 1.335-.946 2.42-2.156 2.42z"/></svg>
            </SocialIcon>
            <SocialIcon label="Telegram" href="#">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
            </SocialIcon>
            <SocialIcon label="X" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.52 7.45L22 22h-6.828l-4.77-6.243L4.8 22H2l7.04-8.05L2 2h6.914l4.34 5.73L18.244 2zm-1.196 18h1.79L7.05 4H5.13l11.918 16z"/></svg>
            </SocialIcon>
            <SocialIcon label="GitHub" href="#"><Github className="h-4 w-4" /></SocialIcon>
            <SocialIcon label="Whitepaper" href="#"><FileText className="h-4 w-4" /></SocialIcon>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Platform</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/genesis" className="hover:text-white">Genesis Sale</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Founder Dashboard</Link></li>
            <li><Link to="/claim" className="hover:text-white">Claim Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Resources</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Whitepaper</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Brand Kit</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} PvP Pro. All rights reserved.</span>
          <span>Built on Base. Not financial advice.</span>
        </div>
      </div>
    </footer>
  );
}