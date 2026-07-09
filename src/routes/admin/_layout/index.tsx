import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  MousePointerClick,
  MapPin,
  Laptop,
  Globe,
  ArrowUpRight,
  BookOpen,
  Mail,
  Loader2,
  Calendar,
} from "lucide-react";

import { getDashboardMetrics } from "@/data/analytics";
import {
  DailyTrendChart,
  DistributionPieChart,
  ProjectsBarChart,
} from "@/components/AnalyticsCharts";

export const Route = createFileRoute("/admin/_layout/")({
  component: DashboardPage,
});

type RangeType = "today" | "7d" | "30d" | "custom";

function DashboardPage() {
  const [range, setRange] = useState<RangeType>("7d");
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [customEnd, setCustomEnd] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminMetrics", range, customStart, customEnd],
    queryFn: () =>
      getDashboardMetrics({
        data: {
          range,
          startDate: range === "custom" ? customStart : undefined,
          endDate: range === "custom" ? customEnd : undefined,
        },
      }),
    refetchInterval: 60000, // Auto-refresh once a minute
  });

  const ranges: { label: string; value: RangeType }[] = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "Custom", value: "custom" },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg-strong">Analytics Overview</h1>
          <p className="mt-1 text-sm text-muted">
            Privacy-friendly tracking of visitor sessions and link interactions.
          </p>
        </div>

        {/* Date Filters Select */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`rounded-md px-3 py-1.25 text-xs font-medium font-mono uppercase tracking-wider transition-colors ${
                  range === r.value ? "bg-fg-strong text-bg" : "text-muted hover:text-fg-strong"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {range === "custom" && (
            <div className="flex items-center gap-1.5 animate-in slide-in-from-left duration-250">
              <span className="font-mono text-[0.68rem] uppercase text-faint">From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-md border border-border bg-card px-2 py-0.75 font-mono text-xs text-fg-strong outline-none focus:border-border-strong"
              />
              <span className="font-mono text-[0.68rem] uppercase text-faint">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-md border border-border bg-card px-2 py-0.75 font-mono text-xs text-fg-strong outline-none focus:border-border-strong"
              />
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-900/30 dark:bg-red-950/15 dark:text-red-400">
          <p className="font-semibold">Failed to fetch metrics</p>
          <p className="mt-1 font-mono text-xs">{String(error)}</p>
        </div>
      ) : isLoading || !data ? (
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-faint" />
          <span className="font-mono text-xs text-faint">Aggregating telemetry...</span>
        </div>
      ) : (
        <>
          {/* KPI CARDS GRID */}
          <div className="grid gap-4.5 sm:grid-cols-2 md:grid-cols-4">
            {/* Visitors Card */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[0.78rem] font-mono uppercase tracking-wider">
                  Total Sessions
                </span>
                <Users className="h-4.5 w-4.5 text-faint" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2.5xl font-bold tracking-tight text-fg-strong">
                  {data.kpis.totalVisitors}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {data.kpis.uniqueVisitors} unique visits · {data.kpis.returningVisitors} returning
              </p>
            </div>

            {/* Resume Clicks Card */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[0.78rem] font-mono uppercase tracking-wider">
                  Resume Clicks
                </span>
                <BookOpen className="h-4.5 w-4.5 text-faint" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2.5xl font-bold tracking-tight text-fg-strong">
                  {data.kpis.resumeClicks}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Downloads/views of resume drive files</p>
            </div>

            {/* Project Outbound Card */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[0.78rem] font-mono uppercase tracking-wider">
                  Project Clicks
                </span>
                <ArrowUpRight className="h-4.5 w-4.5 text-faint" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2.5xl font-bold tracking-tight text-fg-strong">
                  {data.kpis.projectClicks}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Visits to highlighted external demo links</p>
            </div>

            {/* Social/Mail contact Card */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[0.78rem] font-mono uppercase tracking-wider">
                  Contact Clicks
                </span>
                <Mail className="h-4.5 w-4.5 text-faint" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2.5xl font-bold tracking-tight text-fg-strong">
                  {data.kpis.contactClicks}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">GitHub, LinkedIn, Email, or Calendly links</p>
            </div>
          </div>

          {/* DUAL COLUMN CHARTS LAYOUT */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* Primary line trend graph */}
            <div className="rounded-[14px] border border-border bg-card p-5.5 md:col-span-2">
              <div className="mb-4">
                <h3 className="text-sm font-semibold tracking-tight text-fg-strong">
                  Session Frequency Over Time
                </h3>
                <p className="text-xs text-muted">Aggregated direct page visit actions</p>
              </div>
              <DailyTrendChart data={data.trend} />
            </div>

            {/* Top Projects bar graph */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold tracking-tight text-fg-strong">
                  Top Performing Project Links
                </h3>
                <p className="text-xs text-muted">Total unique click transitions sorted by slug</p>
              </div>
              <ProjectsBarChart data={data.projects} />
            </div>
          </div>

          {/* DOUGHNUTS PIES LAYOUT */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Traffic Sources Pie */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="mb-3">
                <h3 className="text-sm font-semibold tracking-tight text-fg-strong">
                  Traffic Origins
                </h3>
                <p className="text-xs text-muted">Referrer headers fetched on session register</p>
              </div>
              <DistributionPieChart data={data.traffic} valueSuffix=" Visits" />
            </div>

            {/* Devices Pie */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="mb-3">
                <h3 className="text-sm font-semibold tracking-tight text-fg-strong">
                  Device Composition
                </h3>
                <p className="text-xs text-muted">Visitor platform classifications</p>
              </div>
              <DistributionPieChart data={data.devices} valueSuffix=" Devices" />
            </div>
          </div>

          {/* GEOGRAPHY & BROWSERS DETAILED LISTS */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Location Table */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="mb-4 border-b border-border pb-3">
                <h3 className="text-sm font-semibold tracking-tight text-fg-strong">
                  Top Direct Countries
                </h3>
                <p className="text-xs text-muted">
                  Geolocation headers from regional proxy connections
                </p>
              </div>
              {data.countries.length === 0 ? (
                <div className="py-6 text-center font-mono text-xs text-faint">
                  No regional logs available in this duration.
                </div>
              ) : (
                <div className="divide-y divide-border font-sans text-xs">
                  {data.countries.map((c, idx) => (
                    <div key={idx} className="flex justify-between py-2.75 items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-faint">
                          #{(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-medium text-fg-strong">
                          {c.name === "ZZ" ? "Unknown (Proxy)" : c.name}
                        </span>
                      </div>
                      <span className="font-mono text-muted">{c.count} sessions</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Browsers Table */}
            <div className="rounded-[14px] border border-border bg-card p-5.5">
              <div className="mb-4 border-b border-border pb-3">
                <h3 className="text-sm font-semibold tracking-tight text-fg-strong">
                  Top Client User-Agents
                </h3>
                <p className="text-xs text-muted">Browser application family parsed from logs</p>
              </div>
              {data.browsers.length === 0 ? (
                <div className="py-6 text-center font-mono text-xs text-faint">
                  No browser metrics tracked.
                </div>
              ) : (
                <div className="divide-y divide-border font-sans text-xs">
                  {data.browsers.map((b, idx) => (
                    <div key={idx} className="flex justify-between py-2.75 items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-faint">
                          #{(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-medium text-fg-strong">{b.name}</span>
                      </div>
                      <span className="font-mono text-muted">{b.count} sessions</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
