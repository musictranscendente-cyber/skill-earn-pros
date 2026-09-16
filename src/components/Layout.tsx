import { useEffect, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { captureReferralFromUrl } from "@/lib/referral";

export function Layout({ children }: { children: ReactNode }) {
  // Roda em toda página que usa Layout — se a URL tiver ?ref=nomedocanal (link de
  // youtuber), guarda isso no navegador (ver src/lib/referral.ts) pra saber depois de
  // qual canal veio um lead/compra, mesmo que a pessoa navegue pelo site antes disso.
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
