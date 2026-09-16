"use client";

import { useState } from "react";

type Badge = "try" | "show" | "explain";

const badgeClass: Record<Badge, string> = {
  try: "badge try",
  show: "badge show",
  explain: "badge explain",
};

type Project = {
  category?: string;
  eyebrow: string;
  name: string;
  stackLine?: string;
  description: string;
  longDescription?: string;
  images?: string[];
  badge: Badge;
  badgeLabel: string;
  cost: string;
};

const flagshipProjects: Project[] = [
  {
    eyebrow: "Cowork Agent + Skills — pipeline",
    name: "Job Search Pipeline",
    stackLine: "Job Search Agent (Proficiently MCP) → ATS Navigator",
    description:
      "Treated my own job search like a GTM pipeline: defined an Ideal Job Profile (my own ICP), then built an agent that qualifies every new posting against it on a daily schedule — no manual re-scanning.",
    longDescription:
      "I run RevOps by building an ICP and a pipeline to qualify against it. I pointed that same thinking at my own job search: an **Ideal Job Profile** stands in for the ICP, and a scheduled **Cowork agent plus a set of custom Skills** stands in for the pipeline.\n\nThe agent runs **daily** against niche job sources via the **Proficiently MCP** — the MCP integration is what lets it actually reach and score postings on sites outside the mainstream boards, not just run a generic search. Each run scores new postings against my profile, flags High/Medium fits, dedupes against everything it's already seen (**~365 confirmed dedupes/skips** logged so far), and delivers the digest straight to Slack.\n\nEvery High-fit posting then gets run through a second tool, ATS Navigator. **It's not a keyword optimizer** — that's the shallow version of this problem. It's built on Stanford Digital Economy Lab research showing that **only ~42 underlying AI models** now sit behind the hiring pipelines processing millions of applications, creating an algorithmic monoculture: one model's rejection tends to propagate across every employer running the same system, and **roughly 10% of applicants who apply to 4+ jobs get systemically rejected by all of them regardless of fit**. ATS Navigator identifies which vendor and model sit behind a given listing, then separates what's actually fixable (resume-parser formatting, missing keywords) from what's a fixed structural risk score I can't change — so **I know which fights are worth fighting**.",
    images: [
      "/project-media/ats-navigator-analysis-1.png",
      "/project-media/ats-navigator-analysis-2.png",
      "/project-media/job-search-pipeline-run.png",
    ],
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    eyebrow: "Claude Skill — methodology",
    name: "Five-Doc Framework",
    stackLine: "PRD → System Design → UI/UX → Feature Breakdown → Master Prompt",
    description:
      "A mandatory five-document planning sequence, self-authored, that lets less-technical builders ship working Claude agents without skipping the thinking.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    eyebrow: "Python — built at BILL",
    name: "Route Detective",
    stackLine: "Gemini API (zero-temperature) → graph compression → 5-bucket root-cause classification",
    description:
      "AI diagnostic tool that triangulates actual vs. expected lead-routing outcomes across a 300+ node routing graph — built from scratch after four other approaches failed.",
    longDescription:
      "BILL's routing graph spans 300+ decision nodes across 14 sales teams and multiple ownership layers. It worked, but no one outside the person who built it could explain why a lead landed where it did — not reps, not managers, not even LeanData's own native AI feature, which could only reference audit logs and couldn't say whether a routing outcome was actually correct.\n\nFour attempts failed (n8n, Glean, Claude Cowork, LeanData's native AI) before I designed a custom Python application on the Gemini API. The core engineering challenge was context: the full routing graph runs ~400KB, too large for any model to reason over per-record. I built a compression approach that extracts only the nodes a given lead actually traversed, cutting the payload to under 1KB with no loss of investigative accuracy — then ran it at zero-temperature so the same inputs always produce the same structured verdict.\n\nRoute Detective triangulates four inputs (routing log, Rules of Engagement, compressed graph, rep's stated expectation) and classifies discrepancies into five root-cause buckets, distinguishing a real misroute from routing that was \"working as designed.\" Completed July 2026; testing already confirms correct classification against real anonymized data. Together with a companion field-level change I shipped, it targets a 30-40% reduction in \"why did I get this lead?\" tickets and roughly 20 hours/month of manual log-tracing eliminated.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — employer-covered",
  },
];

const categories = [
  "All",
  "Web App",
  "Claude Agent",
  "Claude Artifact",
  "n8n Automation",
  "Python",
];

const otherProjects: Project[] = [
  {
    category: "Web App",
    eyebrow: "Web App",
    name: "RevOps Recruit",
    description:
      "Boutique GTM/RevOps recruiting site — Next.js, referral-network directory.",
    badge: "try",
    badgeLabel: "Try it — live link",
    cost: "$0/mo",
  },
  {
    category: "Web App",
    eyebrow: "Web App",
    name: "Meeting Types",
    description: "Calendly-style scheduler — Flask + mocked Zoom/Salesforce/Calendar.",
    badge: "explain",
    badgeLabel: "Explain it (for now)",
    cost: "$0/mo",
  },
  {
    category: "Claude Agent",
    eyebrow: "Claude Agent",
    name: "Monica",
    description:
      "Personal AI ops assistant — Cowork, Drive/Gmail/Calendar, strict guardrails.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    category: "Claude Agent",
    eyebrow: "Claude Agent",
    name: "Aeroscout",
    description:
      "Solo travel-research agent — flight/hotel timing, no booking capability.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    category: "Claude Artifact",
    eyebrow: "Claude Artifact",
    name: "Job Application Dashboard",
    description: "Persistent React dashboard tracking every application in the search.",
    badge: "show",
    badgeLabel: "Show it",
    cost: "$17/mo shared*",
  },
  {
    category: "n8n Automation",
    eyebrow: "n8n Automation — built at BILL",
    name: '"The Check"',
    description:
      "Extended a colleague's form-to-slide-deck automation with AI-enhanced content.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — employer-covered",
  },
  {
    category: "n8n Automation",
    eyebrow: "n8n Automation",
    name: "TOFU Lead-Routing Pipeline",
    description:
      "Intake → Hunter.io enrichment → Claude ICP scoring → routing → CRM write → nurture loop.",
    images: ["/project-media/tofu-pipeline-canvas.jpg"],
    badge: "show",
    badgeLabel: "Show it",
    cost: "$0–low/mo (free tiers)",
  },
  {
    category: "Python",
    eyebrow: "Python",
    name: "Executive Comms Coach",
    description: "Gradio + LangChain + Gemini — restructures a brain-dump into a BLUF doc.",
    badge: "show",
    badgeLabel: "Show it",
    cost: "$0/mo (free tier)",
  },
  {
    category: "Python",
    eyebrow: "Python",
    name: "Syncly",
    description: "OAuth calendar sync, idempotent — checks before inserting.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$0/mo",
  },
  {
    category: "Python",
    eyebrow: "Python",
    name: "Todoist AI Agent",
    description:
      "Real tool-calling agent (not a prompt chain) — adds/shows tasks from language.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$0/mo (free tier)",
  },
];

const skills = [
  "Python",
  "Next.js",
  "React",
  "Tailwind",
  "LangChain",
  "n8n",
  "Flask",
  "PyQt5",
  "Google Gemini API",
  "Salesforce",
  "Claude Skills / Artifacts",
  "MCP",
  "…and more",
];

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const visibleProjects =
    activeFilter === "All"
      ? otherProjects
      : otherProjects.filter((p) => p.category === activeFilter);

  const toggleExpanded = (name: string) => {
    setExpanded((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name]
    );
  };

  const renderProjectExtras = (project: Project) => {
    const isExpanded = expanded.includes(project.name);
    return (
      <>
        {project.images && project.images.length > 0 && (
          <div className="project-image-row">
            {project.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className="project-image"
                onClick={() => setLightboxSrc(src)}
              >
                <img src={src} alt={`${project.name} screenshot ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
        {project.longDescription && (
          <>
            <button
              type="button"
              className="read-more-btn"
              onClick={() => toggleExpanded(project.name)}
            >
              {isExpanded ? "Show less ↑" : "Read the case study ↓"}
            </button>
            {isExpanded && (
              <div className="long-description">
                {project.longDescription.split("\n\n").map((para, i) => (
                  <p key={i}>{renderWithBold(para)}</p>
                ))}
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--wire-strong)] bg-[var(--background)]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10">
          <div className="mono text-[15px] font-semibold tracking-wide">
            WENDY LAMPERT <span className="text-[var(--muted)]">/ portfolio</span>
          </div>
          <nav className="mono flex gap-4 text-[13px] text-[var(--muted)]">
            <span>Projects</span>
            <span>Skills</span>
            <span>Contact</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        <section className="mb-10">
          <div className="wire p-7">
            <h1 className="mb-2 text-3xl font-semibold leading-tight">Wendy Lampert</h1>
            <p className="text-[var(--muted)]">
              Revenue Operations Professional with Back-End Development Engineering Experience
            </p>
          </div>
        </section>

        <section className="mb-10">
          <div className="wire p-6">
            <div className="mono mb-2 text-[11px] uppercase tracking-wide text-[var(--note)]">
              Built lean, on purpose
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="mono text-[28px] font-semibold">$17/mo</span>
              <span className="text-[13.5px] text-[var(--muted)]">
                real total tool spend across every personal project here — one Claude
                subscription, everything else free/open source
              </span>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-title">01 — Flagship</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {flagshipProjects.map((project) => (
              <div key={project.name} className="wire flagship-card">
                <div className="eyebrow">{project.eyebrow}</div>
                <h3>{project.name}</h3>
                <div className="stack-line">{project.stackLine}</div>
                <p className="desc">{project.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                  <span className="cost-tag">{project.cost}</span>
                </div>
                {renderProjectExtras(project)}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-title">02 — Everything else</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="chip"
                aria-pressed={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visibleProjects.map((project) => (
              <div key={project.name} className="wire card">
                <span className="eyebrow">{project.eyebrow}</span>
                <h4>{project.name}</h4>
                <p className="desc">{project.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                  <span className="cost-tag">{project.cost}</span>
                </div>
                {renderProjectExtras(project)}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">03 — Skills &amp; tools</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-[var(--wire-strong)] px-6 py-8 sm:px-10">
        <div className="mono mx-auto max-w-3xl text-[12px] text-[var(--muted)]">
          [ email / LinkedIn / resume link ]
        </div>
      </footer>

      {lightboxSrc && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxSrc(null)}
        >
          <img src={lightboxSrc} alt="Expanded screenshot" />
        </div>
      )}
    </div>
  );
}
