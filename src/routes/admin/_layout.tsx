import { useState, useEffect } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin, logout } from "@/data/auth";

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    return { admin };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { admin } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      await router.invalidate();
      await navigate({ to: "/admin/login" });
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    let timeoutId: any;

    async function triggerLogout() {
      setLoggingOut(true);
      try {
        await logout();
        await router.invalidate();
        await navigate({
          to: "/admin/login",
          search: { expired: "true" },
        });
      } catch (err) {
        console.error("Auto logout failed:", err);
      } finally {
        setLoggingOut(false);
      }
    }

    function resetTimer() {
      if (timeoutId) clearTimeout(timeoutId);

      const timeoutMs =
        typeof window !== "undefined" &&
        (window as any).__TEST_INACTIVITY_TIMEOUT !== undefined
          ? (window as any).__TEST_INACTIVITY_TIMEOUT
          : 30 * 60 * 1000; // 30 minutes

      timeoutId = setTimeout(() => {
        triggerLogout();
      }, timeoutMs);
    }

    // Set initial timer
    resetTimer();

    // Listen to user interactions
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const handler = () => resetTimer();

    events.forEach((evt) => {
      window.addEventListener(evt, handler, { passive: true });
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((evt) => {
        window.removeEventListener(evt, handler);
      });
    };
  }, [navigate, router]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-215 items-center justify-between px-5.5 py-3.25">
          <div className="flex items-center gap-5">
            <span className="text-[0.95rem] font-semibold tracking-tight text-fg-strong">
              Admin
            </span>
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              className="text-sm text-muted transition hover:text-fg-strong [&.active]:text-fg-strong"
            >
              Analytics
            </Link>
            <Link
              to="/admin/projects"
              className="text-sm text-muted transition hover:text-fg-strong [&.active]:text-fg-strong"
            >
              Projects
            </Link>
            <Link
              to="/admin/content"
              className="text-sm text-muted transition hover:text-fg-strong [&.active]:text-fg-strong"
            >
              Content
            </Link>
            <Link
              to="/admin/resume"
              className="text-sm text-muted transition hover:text-fg-strong [&.active]:text-fg-strong"
            >
              Resume
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{admin.email}</span>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              disabled={loggingOut}
              onClick={() => {
                handleLogout().catch(() => toast.error("Failed to log out"));
              }}
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-215 px-5.5 py-8">
        <Outlet />
      </main>
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 shadow-2xl">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-fg-strong border-t-transparent" />
            <span className="text-sm font-medium text-muted">Logging out...</span>
          </div>
        </div>
      )}
    </div>
  );
}
