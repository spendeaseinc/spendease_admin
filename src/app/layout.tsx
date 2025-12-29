import type { ReactNode } from "react";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import {
  THEME_MODE_VALUES,
  THEME_PRESET_VALUES,
  FONT_FAMILY_VALUES,
  type ThemePreset,
  type ThemeMode,
  type FontFamily,
} from "@/types/preferences/theme";

import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");
  const fontFamily = await getPreference<FontFamily>("font_family", FONT_FAMILY_VALUES, "inter");

  const getFontClassName = (font: FontFamily): string => {
    switch (font) {
      case "inter":
        return inter.className;
      case "geist":
        return geist.className;
      case "geistmono":
        return geistMono.className;
      case "geistsans":
        return geist.className;
      case "roboto":
        return roboto.className;
      default:
        return inter.className;
    }
  };

  return (
    <html
      lang="en"
      className={`${themeMode === "dark" ? "dark" : ""} font-${fontFamily}`}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <meta name="apple-mobile-web-app-title" content="SpendEase Admin" />
      <body className={`${getFontClassName(fontFamily)} min-h-screen antialiased`}>
        <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset} fontFamily={fontFamily}>
          {children}
          <Toaster richColors />
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
