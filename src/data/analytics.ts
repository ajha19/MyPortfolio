import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, eq, gte, lt, lte, sql } from "drizzle-orm";
import { z } from "zod";

import { getAdminFromRequest } from "./auth";
import { db } from "./db";
import { analyticsEvents, analyticsSessions } from "./schema";

const BOT_REGEX =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|linkedincrawler|twitterbot|discordbot|github-camo|slackbot|vkshare|w3c_validator|redditbot/i;

function parseUserAgent(ua?: string) {
  if (!ua) {
    return { deviceType: "desktop", browser: "Other", os: "Other" };
  }

  // Device Type
  let deviceType = "desktop";
  if (/ipad|tablet/i.test(ua)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|android/i.test(ua)) {
    deviceType = "mobile";
  }

  // OS
  let os = "Other";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser
  let browser = "Other";
  if (/Edg|Edge/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";

  return { deviceType, os, browser };
}

function getProviderAgnosticGeo(headers: Headers): string {
  const code =
    headers.get("x-country") || // Netlify
    headers.get("cf-ipcountry") || // Cloudflare
    headers.get("x-vercel-ip-country") || // Vercel
    headers.get("x-ip-country") ||
    headers.get("x-country-code") ||
    "ZZ";

  return code.toUpperCase();
}

/** Registers a new anonymous visitor session */
export const logSession = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      visitorId: z.string().uuid(),
      referrer: z.string().default("direct"),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const request = getRequest();
      if (!request) return { ok: false, error: "no_request" };

      const headers = request.headers;
      const userAgent = headers.get("user-agent") || "";

      // 1. Bot check
      if (BOT_REGEX.test(userAgent)) {
        return { ok: true, bypassed: "bot" };
      }

      // 2. Admin checkout
      const admin = await getAdminFromRequest();
      if (admin) {
        return { ok: true, bypassed: "admin" };
      }

      // Parse metadata
      const { deviceType, os, browser } = parseUserAgent(userAgent);
      const country = getProviderAgnosticGeo(headers);

      // Check if session already registered
      const [existing] = await db
        .select({ id: analyticsSessions.id })
        .from(analyticsSessions)
        .where(eq(analyticsSessions.id, data.id))
        .limit(1);

      if (existing) {
        return { ok: true, existing: true };
      }

      // Write session
      await db.insert(analyticsSessions).values({
        id: data.id,
        visitorId: data.visitorId,
        deviceType,
        browser,
        os,
        country,
        referrer: data.referrer || "direct",
      });

      return { ok: true };
    } catch (e) {
      console.error("logSession failed silently:", e);
      return { ok: false, error: "failsafe_active" };
    }
  });

/** Logs a page view or interactive button click event */
export const logEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      sessionId: z.string().min(1),
      eventType: z.enum(["page_view", "click"]),
      eventKey: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const request = getRequest();
      if (!request) return { ok: false, error: "no_request" };

      // Admin bypass
      const admin = await getAdminFromRequest();
      if (admin) {
        return { ok: true, bypassed: "admin" };
      }

      // Verify parent session exists to maintain consistency
      const [session] = await db
        .select({ id: analyticsSessions.id })
        .from(analyticsSessions)
        .where(eq(analyticsSessions.id, data.sessionId))
        .limit(1);

      if (!session) {
        return { ok: false, error: "session_not_found" };
      }

      await db.insert(analyticsEvents).values(data);
      return { ok: true };
    } catch (e) {
      console.error("logEvent failed silently:", e);
      return { ok: false, error: "failsafe_active" };
    }
  });

function getDateRangeBounds(
  range: "today" | "7d" | "30d" | "custom",
  startDate?: string,
  endDate?: string,
): { rangeStart: Date; rangeEnd: Date } {
  const now = new Date();

  if (range === "custom" && startDate) {
    const rangeStart = new Date(startDate);
    // If endDate is provided, set to 23:59:59.999. If not, default to current time.
    const rangeEnd = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : now;
    return { rangeStart, rangeEnd };
  }

  const rangeEnd = now;
  switch (range) {
    case "today": {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { rangeStart: todayStart, rangeEnd };
    }
    case "30d": {
      const past30 = new Date();
      past30.setDate(now.getDate() - 30);
      past30.setHours(0, 0, 0, 0);
      return { rangeStart: past30, rangeEnd };
    }
    case "7d":
    default: {
      const past7 = new Date();
      past7.setDate(now.getDate() - 7);
      past7.setHours(0, 0, 0, 0);
      return { rangeStart: past7, rangeEnd };
    }
  }
}

/** Fetches metrics for the admin analytics dashboard */
export const getDashboardMetrics = createServerFn({ method: "GET" })
  .validator(
    z.object({
      range: z.enum(["today", "7d", "30d", "custom"]),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  )
  .handler(async ({ data: { range, startDate, endDate } }) => {
    try {
      // Security Check: Only admins can view metrics
      const admin = await getAdminFromRequest();
      if (!admin) {
        throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
      }

      const { rangeStart, rangeEnd } = getDateRangeBounds(range, startDate, endDate);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // --- 1. KPI COUNTS ---
      // Total visitors in selected range
      const [totalSessionsResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(analyticsSessions)
        .where(
          and(
            gte(analyticsSessions.createdAt, rangeStart),
            lte(analyticsSessions.createdAt, rangeEnd),
          ),
        );
      const totalVisitors = totalSessionsResult?.count ?? 0;

      // Unique visitors in range (visitor had their first session within this range)
      const uniqueSessionCount = (await db.execute(sql`
        SELECT COUNT(DISTINCT visitor_id)::int FROM analytics_sessions
        WHERE created_at >= ${rangeStart.toISOString()} AND created_at <= ${rangeEnd.toISOString()}
        AND visitor_id NOT IN (
          SELECT visitor_id FROM analytics_sessions
          WHERE created_at < ${rangeStart.toISOString()}
        )
      `)) as unknown as Array<{ count: number }>;
      const uniqueVisitors = uniqueSessionCount[0]?.count ?? 0;

      // Returning visitors (visitor had session in range AND before it)
      const returningSessionCount = (await db.execute(sql`
        SELECT COUNT(DISTINCT visitor_id)::int FROM analytics_sessions
        WHERE created_at >= ${rangeStart.toISOString()} AND created_at <= ${rangeEnd.toISOString()}
        AND visitor_id IN (
          SELECT visitor_id FROM analytics_sessions
          WHERE created_at < ${rangeStart.toISOString()}
        )
      `)) as unknown as Array<{ count: number }>;
      const returningVisitors = returningSessionCount[0]?.count ?? 0;

      // Visitors Today (sessions start >= todayStart)
      const [todaySessionsResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(analyticsSessions)
        .where(gte(analyticsSessions.createdAt, todayStart));
      const visitorsToday = todaySessionsResult?.count ?? 0;

      // Visitors This Month (sessions start >= thisMonthStart)
      const [monthSessionsResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(analyticsSessions)
        .where(gte(analyticsSessions.createdAt, thisMonthStart));
      const visitorsThisMonth = monthSessionsResult?.count ?? 0;

      // Event Counts for Resume, Projects, Contacts in Range
      const [eventsOverview] = await db
        .select({
          resumeClicks: sql<number>`count(case when event_key = 'click:resume' then 1 end)::int`,
          projectClicks: sql<number>`count(case when event_key like 'click:project:%' then 1 end)::int`,
          contactClicks: sql<number>`count(case when event_key in ('click:github', 'click:linkedin', 'click:email', 'click:calendly') then 1 end)::int`,
        })
        .from(analyticsEvents)
        .where(
          and(gte(analyticsEvents.timestamp, rangeStart), lte(analyticsEvents.timestamp, rangeEnd)),
        );

      const resumeClicks = eventsOverview?.resumeClicks ?? 0;
      const projectClicks = eventsOverview?.projectClicks ?? 0;
      const contactClicks = eventsOverview?.contactClicks ?? 0;

      // --- 2. DAILY TREND CHART ---
      // We aggregate by day in the range. Keep timezone agnostic UTC date formatting.
      const dailyTrendRows = (await db.execute(sql`
        SELECT date_trunc('day', created_at AT TIME ZONE 'UTC')::date as day, count(*)::int as count
        FROM analytics_sessions
        WHERE created_at >= ${rangeStart.toISOString()} AND created_at <= ${rangeEnd.toISOString()}
        GROUP BY day
        ORDER BY day ASC
      `)) as unknown as Array<{ day: string; count: number }>;

      const trendData = dailyTrendRows.map((row) => {
        // Format day neatly
        const dateObj = new Date(row.day);
        return {
          date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          count: row.count,
        };
      });

      // --- 3. TRAFFIC SOURCES Pie Chart ---
      const trafficRows = await db
        .select({
          name: analyticsSessions.referrer,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsSessions)
        .where(
          and(
            gte(analyticsSessions.createdAt, rangeStart),
            lte(analyticsSessions.createdAt, rangeEnd),
          ),
        )
        .groupBy(analyticsSessions.referrer)
        .orderBy(sql`count(*) desc`);

      const trafficSummary = trafficRows.map((row) => ({
        name:
          row.name === "direct" ? "Direct" : row.name.charAt(0).toUpperCase() + row.name.slice(1),
        value: row.count,
      }));

      // --- 4. DEVICE DISTRIBUTION Pie Chart ---
      const deviceRows = await db
        .select({
          name: analyticsSessions.deviceType,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsSessions)
        .where(
          and(
            gte(analyticsSessions.createdAt, rangeStart),
            lte(analyticsSessions.createdAt, rangeEnd),
          ),
        )
        .groupBy(analyticsSessions.deviceType)
        .orderBy(sql`count(*) desc`);

      const deviceSummary = deviceRows.map((row) => ({
        name: row.name.charAt(0).toUpperCase() + row.name.slice(1),
        value: row.count,
      }));

      // --- 5. TOP PROJECTS Bar Chart ---
      const projectRows = await db
        .select({
          eventKey: analyticsEvents.eventKey,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, "click"),
            sql`${analyticsEvents.eventKey} like 'click:project:%'`,
            gte(analyticsEvents.timestamp, rangeStart),
            lte(analyticsEvents.timestamp, rangeEnd),
          ),
        )
        .groupBy(analyticsEvents.eventKey)
        .orderBy(sql`count(*) desc`)
        .limit(5);

      const projectSummary = projectRows.map((row) => {
        const titleSlug = row.eventKey.replace("click:project:", "");
        // Clean display name format (e.g. "quickserve-order" -> "Quickserve Order")
        const name = titleSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        return { name, count: row.count };
      });

      // --- 6. ADDITIONAL METRICS (COUNTRIES & BROWSERS) ---
      const countryRows = await db
        .select({
          name: analyticsSessions.country,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsSessions)
        .where(
          and(
            gte(analyticsSessions.createdAt, rangeStart),
            lte(analyticsSessions.createdAt, rangeEnd),
          ),
        )
        .groupBy(analyticsSessions.country)
        .orderBy(sql`count(*) desc`)
        .limit(5);

      const browserRows = await db
        .select({
          name: analyticsSessions.browser,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsSessions)
        .where(
          and(
            gte(analyticsSessions.createdAt, rangeStart),
            lte(analyticsSessions.createdAt, rangeEnd),
          ),
        )
        .groupBy(analyticsSessions.browser)
        .orderBy(sql`count(*) desc`)
        .limit(5);

      return {
        kpis: {
          totalVisitors,
          uniqueVisitors,
          returningVisitors,
          visitorsToday,
          visitorsThisMonth,
          resumeClicks,
          projectClicks,
          contactClicks,
        },
        trend: trendData,
        traffic: trafficSummary,
        devices: deviceSummary,
        projects: projectSummary,
        countries: countryRows,
        browsers: browserRows,
      };
    } catch (e) {
      console.error("getDashboardMetrics failed:", e);
      throw Object.assign(new Error("Failed to scan analytics database"), { statusCode: 500 });
    }
  });
