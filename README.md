# Aman Jha — Personal Portfolio & Analytics Dashboard

A minimal, editorial-style developer portfolio presenting experiences, skills, and projects, coupled with a lightweight, privacy-focused analytics dashboard. Inspired by clean editorial portfolios, it provides real-time traffic visualization for the administrator while maintaining strict user privacy.

---

## 🛠️ Technology Stack

- **Frontend & Routing:** React 19, [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (full-stack React SSR), Tailwind CSS v4, and Lucide React.
- **Analytics & Visualizations:** Recharts (responsive line, horizontal bar, and doughnut charts).
- **Backend Server:** Nitro server framework (embedded in TanStack Start).
- **Database & ORM:** CockroachDB Serverless, queried via [Drizzle ORM](https://orm.drizzle.team/).

---

## 📊 Analytics Features & Architecture

We prioritize speed, security, and low database overhead to remain within CockroachDB Serverless limits:

1. **Failsafe Tracking:** All telemetry writes are encapsulated in server-side and client-side try-catch safety boundaries. Telemetry failures never interrupt visitor navigation.
2. **Page View Throttling:** Client routers throttle identical path logs using a 5-second sliding guard to prevent reload spikes or rapid tab transitions from creating redundant db writes.
3. **Outbound Click Capture:** Automatically tracks outbound transitions to critical contact channels (LinkedIn, GitHub, Email, Calendly schedules) and external project live demos.
4. **Geo & User-Agent Detection:** Location is determined through standard edge delivery headers (`cf-ipcountry`, `x-vercel-ip-country`, etc.), preserving client performance.
5. **Exclusion Filters:** Automated filters bypass tracking requests matching common search crawler/bot regexes or containing a valid administrator login session.

---

## 🏗️ Folder Architecture

```text
├── src/
│   ├── components/
│   │   ├── AnalyticsCharts.tsx    # Recharts trend, source, and device components
│   │   ├── AnalyticsTracker.tsx   # React hook capturing route paths and clicks
│   │   └── ui/                     # UI components (sonner, badges, buttons)
│   ├── data/
│   │   ├── schema.ts               # Drizzle schemas (analytics_sessions, analytics_events)
│   │   ├── db.ts                   # Database driver client singleton
│   │   ├── auth.ts                 # Admin auth helpers and cookies
│   │   └── analytics.ts            # Server-side logging and analytics metrics handlers
│   └── routes/
│       ├── __root.tsx              # Root app router layout (mounts AnalyticsTracker)
│       └── admin/
│           ├── _layout/
│           │   ├── index.tsx       # Analytics Dashboard overview UI
│           │   └── projects.tsx    # Portfolio projects panel
│           └── login.tsx           # Admin authentication gateway
```

---

## 🔑 Environment Secrets Configuration

Configure the local environment values inside a root `.env` file:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require
```

---

## 🚀 Setup & Local Development Cycle

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Database Schema
To check current database compatibility or manually define database tables:
```bash
npx drizzle-kit generate
```
Since CockroachDB might restrict introspection queries in drizzle-kit push CLI, database schemas can also be verified manually on CockroachDB with the following SQL:
```sql
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id TEXT PRIMARY KEY,
  visitor_id UUID NOT NULL,
  device_type TEXT NOT NULL,
  browser TEXT NOT NULL,
  os TEXT NOT NULL,
  country TEXT NOT NULL,
  referrer TEXT NOT NULL DEFAULT 'direct',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_key TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```

## 📬 Contact Me

I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.

- **Email**: [jhaaman810@gmail.com](mailto:jhaaman810@gmail.com)
- **LinkedIn**: [Aman Jha](https://www.linkedin.com/in/aman-jha-3103a9185/)
- **GitHub**: [ajha19](https://github.com/ajha19)
- **Portfolio**: [Aman Jha](https://aman-jha-portfolio.netlify.app/)
---

Made with ❤️ and &lt;/&gt; by **[Aman Jha](https://github.com/ajha19)**
