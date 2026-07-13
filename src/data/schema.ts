import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  adminUserId: uuid("admin_user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  live: boolean("live").notNull().default(true),
  href: text("href").notNull(),
  coverUrl: text("cover_url").notNull(),
  description: text("description").notNull(),
  tech: jsonb("tech").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  place: string;
  tech: string[];
  bullets: string[];
  logoUrl?: string;
  current?: boolean;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type EducationEntry = {
  title: string;
  place: string;
  period: string;
  logoUrl?: string;
};

export const siteContent = pgTable("site_content", {
  id: integer("id").primaryKey().default(1),
  heroName: text("hero_name").notNull(),
  heroTagline: text("hero_tagline").notNull(),
  heroBio: text("hero_bio").notNull(),
  aboutParagraphs: jsonb("about_paragraphs").$type<string[]>().notNull().default([]),
  experience: jsonb("experience").$type<ExperienceEntry[]>().notNull().default([]),
  skills: jsonb("skills").$type<SkillGroup[]>().notNull().default([]),
  education: jsonb("education").$type<EducationEntry[]>().notNull().default([]),
  linkedinUrl: text("linkedin_url").notNull(),
  githubUrl: text("github_url").notNull(),
  email: text("email").notNull(),
  githubChartUsername: text("github_chart_username").notNull(),
  calendlyUrl: text("calendly_url").notNull(),
  resumeDriveFileId: text("resume_drive_file_id").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type SiteContent = typeof siteContent.$inferSelect;

export const analyticsSessions = pgTable("analytics_sessions", {
  id: text("id").primaryKey(),
  visitorId: uuid("visitor_id").notNull(),
  deviceType: text("device_type").notNull(),
  browser: text("browser").notNull(),
  os: text("os").notNull(),
  country: text("country").notNull(),
  referrer: text("referrer").notNull().default("direct"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id")
    .notNull()
    .references(() => analyticsSessions.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  eventKey: text("event_key").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export type AnalyticsSession = typeof analyticsSessions.$inferSelect;
export type NewAnalyticsSession = typeof analyticsSessions.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
