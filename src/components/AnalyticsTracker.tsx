import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { logEvent, logSession } from "@/data/analytics";

function getOrGenerateVisitorId(): string {
  let id = localStorage.getItem("portfolio_visitor_id");
  if (!id) {
    try {
      id = crypto.randomUUID();
    } catch {
      id = "visitor-" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }
    localStorage.setItem("portfolio_visitor_id", id || "");
  }
  return id || "";
}

function getOrGenerateSessionId(): string {
  let id = sessionStorage.getItem("portfolio_session_id");
  if (!id) {
    id = "sess-" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem("portfolio_session_id", id);
  }
  return id;
}

export function AnalyticsTracker() {
  const location = useLocation();
  const lastTrackedRef = useRef<{ pathname: string; timestamp: number }>({
    pathname: "",
    timestamp: 0,
  });

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    try {
      const visitorId = getOrGenerateVisitorId();
      const sessionId = getOrGenerateSessionId();
      const referrer = document.referrer || "direct";

      // Register session with backend
      logSession({
        data: {
          id: sessionId,
          visitorId,
          referrer,
        },
      }).catch((e) => console.warn("Failed to register session:", e));
    } catch (e) {
      console.warn("Analytics initialization failed silently:", e);
    }

    // Set up global click listener to track outbound interactions
    const handleGlobalClick = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement;
        const anchor = target.closest("a");
        if (!anchor) return;

        const href = anchor.getAttribute("href") || "";
        const analyticKey = anchor.getAttribute("data-analytics-click");

        const sessionId = getOrGenerateSessionId();

        // 1. Explicit data-analytics-click attribute takes priority
        if (analyticKey) {
          logEvent({
            data: {
              sessionId,
              eventType: "click",
              eventKey: analyticKey,
            },
          }).catch((err) => console.warn("Failed to log explicit click:", err));
          return;
        }

        // 2. Fallbacks based on URL rules
        let eventKey = "";
        if (href.startsWith("mailto:")) {
          eventKey = "click:email";
        } else if (href.includes("linkedin.com")) {
          eventKey = "click:linkedin";
        } else if (href.includes("github.com/ajha19")) {
          eventKey = "click:github";
        } else if (href.includes("calendly.com") || href.includes("calendar.app.google")) {
          eventKey = "click:calendly";
        } else if (href.includes("drive.google.com") || href.toLowerCase().includes("resume")) {
          eventKey = "click:resume";
        }

        if (eventKey) {
          logEvent({
            data: {
              sessionId,
              eventType: "click",
              eventKey,
            },
          }).catch((err) => console.warn("Failed to log outbound click:", err));
        }
      } catch (err) {
        console.warn("Global click tracking failed silently:", err);
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  // Track page navigation changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = location.pathname;

    // Do not track admin-facing routes to keep logs clean
    if (path.startsWith("/admin")) return;

    // 1. Duplicate & rate-throttling check (5 seconds throttle for identical paths)
    const lastTracked = lastTrackedRef.current;
    const now = Date.now();
    if (lastTracked.pathname === path && now - lastTracked.timestamp < 5000) {
      return;
    }

    // Update throttle cache
    lastTrackedRef.current = { pathname: path, timestamp: now };

    // Standardize page view tags
    let eventKey = `page:${path.replace(/^\//, "") || "home"}`;
    if (path === "/") {
      eventKey = "page:home";
    }

    try {
      const sessionId = getOrGenerateSessionId();
      logEvent({
        data: {
          sessionId,
          eventType: "page_view",
          eventKey,
        },
      }).catch((e) => console.warn("Failed to log page view:", e));
    } catch (e) {
      console.warn("Page view tracking failed silently:", e);
    }
  }, [location.pathname]);

  return null;
}
