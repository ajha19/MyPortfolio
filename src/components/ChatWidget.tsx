import { useEffect, useRef, useState, type ReactNode } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { role: "bot" | "user"; text: ReactNode };

const LINKEDIN_URL = "https://www.linkedin.com/in/aman-jha-3103a9185/";
const EMAIL_URL = "mailto:jhaaman810@gmail.com";
const CALENDLY_URL = "https://calendar.app.google/A51hb6jJtRQT3jyH7";
const GITHUB_URL = "https://github.com/ajha19";

const linkClass = "underline underline-offset-2 decoration-current/60 hover:decoration-current";

const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener" className={linkClass}>
    {children}
  </a>
);

const QA: { q: string; a: ReactNode }[] = [
  {
    q: "What tech do you use?",
    a: "React, Next.js, TypeScript, Node.js, Express, Python, Flask, PostgreSQL, MongoDB, Docker, AWS. Frontend-heavy full-stack.",
  },
  {
    q: "Are you open to work?",
    a: (
      <>
        Yes — open to interesting full-stack roles and freelance/contract collaborations. The
        fastest ways to reach me: <ExtLink href={EMAIL_URL}>Email</ExtLink>,{" "}
        <ExtLink href={LINKEDIN_URL}>LinkedIn</ExtLink>, or{" "}
        <ExtLink href={CALENDLY_URL}>Book a free call</ExtLink>.
      </>
    ),
  },
  {
    q: "Where do you work now?",
    a: "Currently a Senior Software Engineer at QuickServe, building a premium event-based ordering platform for hospitality.",
  },
  {
    q: "Years of experience?",
    a: "Close to 4 years of professional full-stack experience across Wipro, Mercor and QuickServe.",
  },
  {
    q: "Where are you based?",
    a: (
      <>
        India — working remotely with global teams. You can also find me on{" "}
        <ExtLink href={GITHUB_URL}>GitHub</ExtLink>.
      </>
    ),
  },
  {
    q: "How can I book a call?",
    a: (
      <>
        Scroll to the <ExtLink href={CALENDLY_URL}>‘Book a free call’</ExtLink> button below the
        GitHub section, or drop me a line on <ExtLink href={LINKEDIN_URL}>LinkedIn</ExtLink>.
      </>
    ),
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hey! I'm Aman's Portfolio little assistant. Pick a question below 👇",
    },
  ]);
  const [waiting, setWaiting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, waiting]);

  const ask = (q: string) => {
    if (waiting) return;
    const hit = QA.find((x) => x.q === q);
    setMessages((m) => [...m, { role: "user", text: q }]);
    setWaiting(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "bot", text: hit?.a ?? "Hmm, I don't have an answer for that yet." },
      ]);
      setWaiting(false);
    }, 3000);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-60 flex items-center gap-2">
        {!open && (
          <span className="pointer-events-none hidden select-none rounded-full border border-border bg-card px-3 py-1.5 text-[0.78rem] font-medium text-fg shadow-md sm:inline-flex">
            Click to ask anything
          </span>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
          title={open ? "Close chat" : "Click to ask anything"}
          className="grid h-13 w-13 place-items-center rounded-full border border-border-strong bg-fg-strong text-bg shadow-lg transition hover:-translate-y-0.5"
        >
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-21.5 right-5 z-60 flex h-115 w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-pill text-sm">👋</span>
            <div className="min-w-0">
              <div className="text-[0.9rem] font-semibold text-fg-strong">Ask about Aman</div>
              <div className="font-mono text-[0.68rem] text-faint">Usually replies instantly</div>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-[0.86rem] leading-snug ${
                    m.role === "user" ? "bg-fg-strong text-bg" : "bg-pill text-fg"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {waiting && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl bg-pill px-3 py-2 text-[0.86rem] leading-snug text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    Waiting for the response
                    <span className="inline-flex gap-0.5">
                      <span className="h-1 w-1 animate-bounce rounded-full bg-fg [animation-delay:-0.3s]" />
                      <span className="h-1 w-1 animate-bounce rounded-full bg-fg [animation-delay:-0.15s]" />
                      <span className="h-1 w-1 animate-bounce rounded-full bg-fg" />
                    </span>
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-bg/50 p-3">
            <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-faint">
              Quick questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QA.map((x) => (
                <button
                  key={x.q}
                  onClick={() => ask(x.q)}
                  disabled={waiting}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-pill px-2.5 py-1 text-[0.72rem] text-fg transition hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border"
                >
                  <Send className="h-3 w-3 opacity-60" />
                  {x.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
