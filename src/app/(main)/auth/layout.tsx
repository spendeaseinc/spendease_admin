import type { ReactNode } from "react";

import Image from "next/image";

import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full overflow-hidden rounded-3xl lg:flex">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/auth.jpg)" }} />

          <div className="absolute inset-0 bg-linear-to-br from-[#0F14334D]/80 to-[#0F14334D]/60" />

          <div className="text-primary-foreground absolute top-6 z-10 space-y-1 px-6">
            <Image alt="SpendEase Logo" src="/logo/logo-white.png" width={40} height={40} />
          </div>

          <div className="absolute bottom-10 z-10 flex w-full justify-between px-10 text-white">
            <div className="bg-background/20 space-y-3 rounded-lg p-6 backdrop-blur-md">
              <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
              <p className="text-sm">
                Your reliable ally in cross-border payments, helping individuals, small businesses, and partners
                navigate international transactions to reach their financial aspirations.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
