"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface AdminThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("admin-theme", t);
    document.cookie = `admin-theme=${t};path=/admin;max-age=31536000;SameSite=Lax`;
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div data-admin-theme={mounted ? theme : "light"} className="contents">
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}
