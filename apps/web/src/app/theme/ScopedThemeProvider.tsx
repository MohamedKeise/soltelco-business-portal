import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeScope = "marketing" | "admin" | "customer";

type ScopedThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  scope: ThemeScope;
};

const ScopedThemeContext = createContext<ScopedThemeContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  scope: ThemeScope;
};

const STORAGE_KEYS = {
  marketing: "soltelco_theme_marketing",
  admin: "soltelco_theme_admin",
  customer: "soltelco_theme_customer",
} as const;

export function ScopedThemeProvider({ children, scope }: Props) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storageKey = STORAGE_KEYS[scope];
    const saved = localStorage.getItem(storageKey);
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const storageKey = STORAGE_KEYS[scope];
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(storageKey, theme);
  }, [theme, scope]);

  const value = {
    theme,
    setTheme,
    toggleTheme: () => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    },
    scope,
  };

  return (
    <ScopedThemeContext.Provider value={value}>
      {children}
    </ScopedThemeContext.Provider>
  );
}

export function useScopedTheme() {
  const context = useContext(ScopedThemeContext);

  if (!context) {
    throw new Error("useScopedTheme must be used within a ScopedThemeProvider");
  }

  return context;
}
