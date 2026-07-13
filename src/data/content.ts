import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireAdmin } from "./auth";
import { db } from "./db";
import { siteContent } from "./schema";

const experienceEntry = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  place: z.string().min(1),
  tech: z.array(z.string().min(1)),
  bullets: z.array(z.string().min(1)),
  logoUrl: z.string().optional(),
  current: z.boolean().optional(),
});

const skillGroup = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)),
});

const educationEntry = z.object({
  title: z.string().min(1),
  place: z.string().min(1),
  period: z.string().min(1),
  logoUrl: z.string().optional(),
});

const siteContentInput = z.object({
  heroName: z.string().min(1).optional(),
  heroTagline: z.string().min(1).optional(),
  heroBio: z.string().min(1).optional(),
  aboutParagraphs: z.array(z.string().min(1)).optional(),
  experience: z.array(experienceEntry).optional(),
  skills: z.array(skillGroup).optional(),
  education: z.array(educationEntry).optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  email: z.string().min(1).optional(),
  githubChartUsername: z.string().min(1).optional(),
  calendlyUrl: z.string().url().optional(),
  resumeDriveFileId: z.string().min(1).optional(),
});

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const [content] = await db.select().from(siteContent).where(eq(siteContent.id, 1)).limit(1);
  if (!content) throw Object.assign(new Error("Site content not seeded"), { statusCode: 500 });
  return content;
});

export const updateSiteContent = createServerFn({ method: "POST" })
  .validator(siteContentInput)
  .handler(async ({ data }) => {
    await requireAdmin();

    // Merge on DB level: construct only fields that are explicitly provided (not undefined)
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    const [updated] = await db
      .update(siteContent)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(siteContent.id, 1))
      .returning();
    return updated;
  });

let cachedContributions: number | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3600 * 1000; // 1 hour

export const getGitHubContributions = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: username }) => {
    const now = Date.now();
    if (cachedContributions !== null && now - lastFetchTime < CACHE_TTL) {
      return cachedContributions;
    }

    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
      if (!response.ok) {
        throw new Error(`GitHub contributions API returned code ${response.status}`);
      }
      const result = (await response.json()) as { total?: Record<string, number> };
      const count = result.total?.["2026"] ?? result.total?.["2025"] ?? 0;

      cachedContributions = count;
      lastFetchTime = now;
      return count;
    } catch (e) {
      console.error("Error fetching GitHub contributions from jogruber API:", e);
      if (cachedContributions !== null) {
        return cachedContributions;
      }
      return 643; // Static fallback representative of Aman Jha's activity
    }
  });
