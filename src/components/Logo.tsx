export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="lg-bolt" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A45BFF" />
            <stop offset="100%" stopColor="#5B1FD6" />
          </linearGradient>
          <linearGradient id="lg-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="29" height="29" rx="9" stroke="url(#lg-ring)" />
        <path d="M17.5 5L8 18h6l-1.5 9L24 13h-6l1.5-8z" fill="url(#lg-bolt)" />
      </svg>
      <span className="text-silver text-lg font-extrabold tracking-tight">
        PvP<span className="text-white/60 font-light"> </span>
        <span className="text-silver">Pro</span>
      </span>
    </div>
  );
}