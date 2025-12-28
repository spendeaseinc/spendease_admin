import type { FontFamily } from "@/types/preferences/theme";

export function updateThemeMode(value: "light" | "dark") {
  const doc = document.documentElement;
  doc.classList.add("disable-transitions");
  doc.classList.toggle("dark", value === "dark");
  requestAnimationFrame(() => {
    doc.classList.remove("disable-transitions");
  });
}

export function updateThemePreset(value: string) {
  document.documentElement.setAttribute("data-theme-preset", value);
}

export function updateFontFamily(font: FontFamily) {
  const root = document.documentElement;

  // Remove all font classes
  root.classList.remove("font-inter", "font-geist", "font-geistsans", "font-roboto");

  // Add the selected font class
  root.classList.add(`font-${font}`);
}
