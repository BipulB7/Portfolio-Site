import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing a thin band just above the
 * middle of the viewport. Uses IntersectionObserver only (no scroll handler),
 * so state changes only when the active section actually changes.
 */
export const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    const order = key.split("|");
    const elements = order.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        // When two sections share the band, the later one is the one arriving
        const next = [...order].reverse().find((id) => visible.has(id));
        if (next) setActive(next);
      },
      { rootMargin: "-38% 0px -56% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
};
