import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { requireAdmin } from "./auth";
import { db } from "./db";
import { projects } from "./schema";
import { triggerSync } from "./sync";

const projectInput = z.object({
  title: z.string().min(1),
  status: z.string().min(1),
  live: z.boolean(),
  href: z.string().url(),
  coverUrl: z.string().min(1),
  description: z.string().min(1),
  tech: z.array(z.string().min(1)),
  sortOrder: z.number().int(),
});

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt));
});

export const createProject = createServerFn({ method: "POST" })
  .validator(projectInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const [created] = await db.insert(projects).values(data).returning();
    triggerSync();
    return created;
  });

export const updateProject = createServerFn({ method: "POST" })
  .validator(projectInput.extend({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, ...rest } = data;
    const [updated] = await db
      .update(projects)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    if (!updated) throw Object.assign(new Error("Project not found"), { statusCode: 404 });
    triggerSync();
    return updated;
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await db.delete(projects).where(eq(projects.id, data.id));
    triggerSync();
    return { ok: true };
  });
