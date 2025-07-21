"use client";
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "light",  

  setTheme: (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);

        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
      }

      set({ theme: newTheme });
    } else {
      console.warn(`Invalid theme: ${newTheme}`);
    }
  },
}));
