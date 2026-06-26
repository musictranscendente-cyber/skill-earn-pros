export function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, black 30%, transparent 80%)",
        }}
      />
      <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(138,46,255,0.45),transparent)] blur-3xl" />
      <div className="absolute top-1/3 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(0,178,255,0.35),transparent)] blur-3xl" />
    </div>
  );
}