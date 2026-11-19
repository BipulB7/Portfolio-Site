import { useEffect, useState } from "react";

/**
 * Theme helpers shared by every ThemeToggle instance.
 * The source of truth is the `dark` class on <html> (index.html applies the
 * saved choice before first paint). Instances stay in sync by observing it.
 */

// Matches --background in index.css for each theme (browser UI tint)
const THEME_COLORS = { dark: "#05060f", light: "#f8f9fc" };

export const isDarkTheme = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("dark");

export const syncThemeColorMeta = (theme) => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
};

export const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
  syncThemeColorMeta(theme);
};

/**
 * Live boolean that follows the html `dark` class, whoever changes it.
 * Returns [isDark, setIsDark]; the setter lets a toggle update itself
 * synchronously (inside flushSync) before the observer catches up.
 */
export const useIsDark = () => {
  const [isDark, setIsDark] = useState(isDarkTheme);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));
    sync();
    syncThemeColorMeta(root.classList.contains("dark") ? "dark" : "light");
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return [isDark, setIsDark];
};
