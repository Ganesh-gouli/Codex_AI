import * as React from "react";

const MOBILE_BREAKPOINT = 768; // Tailwind default for md breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Skip SSR until client-side hydration
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Initial check
    checkMobile();

    // Listen for changes
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile);
    } else {
      // Fallback for older browsers
      mql.addListener(checkMobile);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkMobile);
      } else {
        mql.removeListener(checkMobile);
      }
    };
  }, []);

  return isMobile;
}
