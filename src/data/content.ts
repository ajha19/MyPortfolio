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
  logoUrl: z.string().min(1).optional(),
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
});

const siteContentInput = z.object({
  heroName: z.string().min(1),
  heroTagline: z.string().min(1),
  heroBio: z.string().min(1),
  aboutParagraphs: z.array(z.string().min(1)),
  experience: z.array(experienceEntry),
  skills: z.array(skillGroup),
  education: z.array(educationEntry),
  linkedinUrl: z.string().url(),
  githubUrl: z.string().url(),
  email: z.string().min(1),
  githubChartUsername: z.string().min(1),
  calendlyUrl: z.string().url(),
  resumeDriveFileId: z.string().min(1),
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
    const [updated] = await db
      .update(siteContent)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteContent.id, 1))
      .returning();
    return updated;
  });
