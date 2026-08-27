export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="PvP Pro"
      className={`h-9 w-auto ${className}`}
    />
  );
}
