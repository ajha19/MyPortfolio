import { randomBytes, scryptSync } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "../src/data/db.ts";
import { adminUsers, projects, siteContent } from "../src/data/schema.ts";

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user");
  }
  await db
    .insert(adminUsers)
    .values({ email: email.toLowerCase(), passwordHash: hashPassword(password) })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: { passwordHash: hashPassword(password) },
    });
  console.log(`Admin user upserted: ${email}`);
}

async function seedSiteContent() {
  const [existing] = await db
    .select({ id: siteContent.id })
    .from(siteContent)
    .where(eq(siteContent.id, 1));
  if (existing) {
    console.log("Site content already exists, leaving it untouched.");
    return;
  }

  await db.insert(siteContent).values({
    id: 1,
    heroName: "Aman Jha",
    heroTagline: "A Full Stack Developer.",
    heroBio:
      "I build scalable web applications, customer-facing platforms and analytics systems — end to end, from frontend architecture to backend services, payments and production. Currently building premium event-based ordering at QuickServe.",
    aboutParagraphs: [
      "I'm a <b>Full Stack Developer</b> with close to 4 years of professional experience building scalable web applications, customer-facing platforms and enterprise-grade software. I work across frontend, backend and cloud deployment, with strong expertise in <b>React, Next.js, TypeScript, Node.js and Python</b>.",
      "I enjoy building products end to end — solving complex engineering challenges, improving user experience, and shipping software that creates measurable business impact.",
    ],
    experience: [
      {
        company: "QuickServe",
        role: "Senior Software Engineer",
        period: "Mar 2026 — Present",
        place: "Remote",
        current: true,
        logoUrl: "/logos/quickserve.png",
        tech: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "PWA"],
        bullets: [
          "Building a <b>premium event-based ordering platform</b> for frictionless hospitality at live events and venues.",
          "Developing customer-facing ordering apps with React & Next.js, plus <b>PWA and Apple Wallet integrations</b>.",
          "Designing <b>analytics dashboards</b> for operational insights and owning production deployments and reliability.",
          "Collaborating directly with founders across frontend, backend, cloud and product strategy.",
        ],
      },
      {
        company: "Mercor",
        role: "Software Engineering Expert · Contract",
        period: "Jan 2026 — Mar 2026",
        place: "Remote",
        logoUrl: "/logos/mercor.png",
        tech: ["AI Evaluation", "Code Review", "System Design"],
        bullets: [
          "Evaluated <b>engineering solutions, code quality and architecture</b> on AI and software evaluation projects.",
          "Contributed to large-scale <b>software assessment and benchmarking</b> initiatives across full-stack work.",
        ],
      },
      {
        company: "Wipro",
        role: "Project Engineer → Consultant → Senior Consultant",
        period: "May 2021 — Jul 2025",
        place: "India",
        logoUrl: "/logos/wipro.png",
        tech: ["React.js", "Next.js", "TypeScript", "Node.js", "Express.js", "Python", "Flask"],
        bullets: [
          "<b>Promoted across multiple engineering roles</b> from Project Engineer to Consultant to Senior Consultant over 4+ years.",
          "Built <b>enterprise-grade web applications</b> for international clients using React, Next.js, TypeScript and Bootstrap.",
          "Delivered backend services with <b>Node.js, Express, Python and Flask</b>, driving performance, maintainability and UX gains.",
          "Led <b>application modernization</b> work and collaborated with cross-functional agile teams across geographies.",
        ],
      },
    ],
    skills: [
      {
        category: "Frontend",
        items: [
          "React.js",
          "Next.js",
          "TypeScript",
          "JavaScript",
          "Tailwind CSS",
          "Redux Toolkit",
          "HTML5",
          "CSS3",
        ],
      },
      {
        category: "Backend",
        items: ["Node.js", "Express.js", "Python", "Flask", "REST APIs", "Auth"],
      },
      { category: "Databases", items: ["MongoDB", "PostgreSQL", "Supabase"] },
      { category: "Cloud / DevOps", items: ["Docker", "AWS", "CI/CD", "PM2", "Linux", "Git"] },
    ],
    education: [{ period: "2017 — 2021", title: "B.Tech in Computer Science", place: "India" }],
    linkedinUrl: "https://www.linkedin.com/in/aman-jha-3103a9185/",
    githubUrl: "https://github.com/ajha19",
    email: "mailto:jhaaman810@gmail.com",
    githubChartUsername: "ajha19",
    calendlyUrl: "https://calendar.app.google/A51hb6jJtRQT3jyH7",
    resumeDriveFileId: "16wF6vNv9FlKwAQ_lXWFTZPXqW8Fq_huA",
  });
  console.log("Site content seeded.");
}

async function seedProjects() {
  const existing = await db.select({ id: projects.id }).from(projects);
  if (existing.length > 0) {
    console.log("Projects already exist, leaving them untouched.");
    return;
  }

  await db.insert(projects).values([
    {
      title: "QuickServe Order",
      status: "All systems operational",
      live: true,
      href: "https://quick-serve.nl/",
      coverUrl: "/covers/QuickServe.png",
      description:
        "A premium event-based ordering system letting customers scan a QR code, browse menus, place orders and enjoy a seamless hospitality experience at large-scale venues and events.",
      tech: ["Next.js", "TypeScript", "Node.js", "PWA", "Payments"],
      sortOrder: 0,
    },
    {
      title: "Devarc",
      status: "All systems operational",
      live: true,
      href: "https://getdevarc.com/",
      coverUrl: "/covers/DevArc.png",
      description:
        "DevArc aims to become a Developer Career Copilot — helping developers learn, practice and grow with AI assistance. Combines curated learning paths, hands-on practice environments and AI-driven guidance to accelerate real career growth.",
      tech: [
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Supabase",
        "Python",
        "Docker",
        "Grok AI",
      ],
      sortOrder: 1,
    },
    {
      title: "AuditGenie — SEO Audit",
      status: "All systems operational",
      live: true,
      href: "https://auditgenie.netlify.app/",
      coverUrl: "/covers/Audit-genie.png",
      description:
        "An SEO audit tool that analyzes any website and generates actionable insights on performance, meta tags, accessibility and on-page optimization — powered by an LLM-based recommendation engine.",
      tech: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini LLM", "SEO"],
      sortOrder: 2,
    },
    {
      title: "GetIt Ecommerce",
      status: "All systems operational",
      live: true,
      href: "https://thecollarcraft.netlify.app/",
      coverUrl: "/covers/Get-It.png",
      description:
        "Full-stack MERN application for men's fashion accessories, featuring payment integration, user authentication and a complete admin dashboard for catalog and order management.",
      tech: [
        "React",
        "Node.js",
        "Supabase",
        "Razorpay",
        "AWS",
        "Tailwind CSS",
        "TypeScript",
        "JWT",
      ],
      sortOrder: 3,
    },
  ]);
  console.log("Projects seeded.");
}

async function main() {
  await seedAdmin();
  await seedSiteContent();
  await seedProjects();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
