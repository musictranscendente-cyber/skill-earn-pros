import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-6 py-14 md:py-20 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-purple)] shadow-[0_0_10px_var(--neon-purple)]" />
              {eyebrow}
            </div>
          )}
          {title && <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>}
          {subtitle && <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-white/60 md:text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}