"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { createStore, useStore, type StoreApi } from "zustand";

import type { ThemeMode, ThemePreset, FontFamily } from "@/types/preferences/theme";

interface PreferencesState {
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  fontFamily: FontFamily;
  setThemeMode: (themeMode: ThemeMode) => void;
  setThemePreset: (themePreset: ThemePreset) => void;
  setFontFamily: (fontFamily: FontFamily) => void;
}

type PreferencesStore = StoreApi<PreferencesState>;

const PreferencesContext = createContext<PreferencesStore | null>(null);

export interface PreferencesStoreProviderProps {
  children: ReactNode;
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  fontFamily?: FontFamily;
}

export function PreferencesStoreProvider({
  children,
  themeMode,
  themePreset,
  fontFamily = "inter",
}: PreferencesStoreProviderProps) {
  const [store] = useState(() =>
    createStore<PreferencesState>((set) => ({
      themeMode,
      themePreset,
      fontFamily,
      setThemeMode: (themeMode) => set({ themeMode }),
      setThemePreset: (themePreset) => set({ themePreset }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
    })),
  );

  return <PreferencesContext.Provider value={store}>{children}</PreferencesContext.Provider>;
}

export function usePreferencesStore<T>(selector: (state: PreferencesState) => T): T {
  const store = useContext(PreferencesContext);
  if (!store) {
    throw new Error("usePreferencesStore must be used within PreferencesStoreProvider");
  }
  return useStore(store, selector);
}
