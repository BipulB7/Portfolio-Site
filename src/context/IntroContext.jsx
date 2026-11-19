import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Tracks whether the opening intro animation has finished, so the hero can
 * start its own entrance right as the intro curtain opens.
 *
 * The intro plays once per browser session and is skipped for reduced motion.
 * `shouldPlayIntro` is decided once on load.
 */

const SESSION_KEY = "intro-played";

const decideShouldPlay = () => {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    // ?nointro skips it (handy for screenshots and testing)
    if (new URLSearchParams(window.location.search).has("nointro")) return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
  } catch {
    return false;
  }
  return true;
};

const IntroContext = createContext({
  shouldPlayIntro: false,
  introDone: true,
  markIntroDone: () => {},
});

export const IntroProvider = ({ children }) => {
  const [shouldPlayIntro] = useState(decideShouldPlay);
  const [introDone, setIntroDone] = useState(!shouldPlayIntro);

  const markIntroDone = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable: intro will just play again next load */
    }
    setIntroDone(true);
  }, []);

  const value = useMemo(
    () => ({ shouldPlayIntro, introDone, markIntroDone }),
    [shouldPlayIntro, introDone, markIntroDone]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useIntro = () => useContext(IntroContext);
