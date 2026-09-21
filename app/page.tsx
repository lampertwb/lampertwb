"use client";

import { useState } from "react";
import SiteNav from "./site-nav";

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
  problem?: string;
  solution?: string;
  results?: string;
  images?: string[];
  // "contain" shows a diagram whole (full width, natural height) instead of cropping it to 16:9.
  imageFit?: "contain";
  // Captioned screen recording shown in the card hero instead of a still image.
  video?: string;
  videoAlt?: string;
  // Text-only card: skips the hero block (no image, video, or striped placeholder). Remove once media exists.
  noHero?: boolean;
  awardBanner?: string;
  awardNote?: string;
  badge: Badge;
  badgeLabel: string;
  cost: string;
};

const flagshipProjects: Project[] = [
  {
    eyebrow: "Cowork Agent + Skills — pipeline",
    category: "Claude Agent",
    name: "Job Search Pipeline",
    stackLine: "Job Search Agent (Proficiently MCP) → ATS Navigator",
    description:
      "Treated my own job search like a GTM pipeline: defined an Ideal Job Profile (my own ICP), then built an agent that qualifies every new posting against it on a daily schedule — no manual re-scanning.",
    problem:
      "Manually scanning job postings across niche sources is slow — and even a strong-fit application can get systemically rejected before a human ever sees it. **Stanford Digital Economy Lab research shows only ~42 underlying AI models now sit behind the hiring pipelines processing millions of applications**, an algorithmic monoculture where one model's rejection propagates to every employer running the same system.",
    solution:
      "I run RevOps by building an ICP and a pipeline to qualify against it — I pointed that same thinking at my own job search. An **Ideal Job Profile stands in for the ICP**, and a scheduled **Cowork agent plus a set of custom Skills stands in for the pipeline**, running daily via the **Proficiently MCP** — the integration that actually lets it reach and score postings on niche sites, not just run a generic search. Every High-fit posting then gets run through ATS Navigator, which identifies which vendor and AI model sit behind that specific listing.",
    results:
      "The agent **dedupes against everything it's already seen (~365 confirmed dedupes/skips logged so far)** and delivers a daily digest to Slack. ATS Navigator separates what's actually fixable (resume-parser formatting, missing keywords) from what's a fixed structural risk score I can't change — **so I know which fights are worth fighting.**",
    images: [
      "/project-media/job-search-pipeline-run.png",
      "/project-media/ats-navigator-analysis-1.png",
      "/project-media/ats-navigator-analysis-2.png",
    ],
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    eyebrow: "Python — built at BILL",
    category: "Python",
    name: "Route Detective",
    stackLine: "Gemini API (zero-temperature) → graph compression → 5-bucket root-cause classification",
    description:
      "AI diagnostic tool that triangulates actual vs. expected lead-routing outcomes across a 300+ node routing graph — built from scratch after four other approaches failed.",
    problem:
      "BILL's routing graph spans 300+ decision nodes across 14 sales teams and multiple ownership layers. It worked, but **no one outside the person who built it could explain why a lead landed where it did** — not reps, not managers, **not even LeanData's own native AI feature**, which could only reference audit logs and couldn't say whether a routing outcome was actually correct.",
    solution:
      "Four attempts failed (n8n, Glean, Claude Cowork, LeanData's native AI) before I designed a custom Python application on the Gemini API. The core engineering challenge was context: **the full routing graph runs ~400KB, too large for any model to reason over** per-record. I built a compression approach that extracts only the nodes a given lead actually traversed, **cutting the payload to under 1KB** with no loss of investigative accuracy — then ran it at zero-temperature **so the same inputs always produce the same structured verdict.** Route Detective triangulates what actually happened, what should have happened per the Rules of Engagement, and what the rep expected to happen.",
    results:
      "**Classifies exactly where those three diverge into five root-cause buckets, distinguishing a real misroute from routing that was \"working as designed.\"** Completed July 2026; testing already confirms correct classification against real anonymized data. Together with a companion field-level change I shipped, **it targets a 30-40% reduction in \"why did I get this lead?\" tickets and roughly 20 hours/month of manual log-tracing eliminated.**",
    awardBanner: "Intelligent GTM Orchestration Award — Nominated Finalist",
    awardNote: "*Awards Pending",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — employer-covered",
  },
  {
    eyebrow: "Python + LangChain — AI agent",
    category: "Python",
    name: "Todoist AI Agent",
    stackLine: "LangChain v1 create_agent → Gemini 2.5 Flash → add_task / show_tasks / remove_task → Todoist API",
    description:
      "A real tool-calling agent, not a prompt chain: I type a request in plain English, and it picks the right tool and changes my actual Todoist list.",
    problem:
      "Most “AI task managers” are really just a prompt wrapped around a to-do list. They can suggest an action, but they can’t actually take one.",
    solution:
      "Built a tool-calling agent in Python with LangChain on Gemini 2.5 Flash and gave it three real tools, **add_task, show_tasks, and remove_task, wired directly into the Todoist API**, so the model decides which one a plain-English request needs and calls it. It keeps the conversation history, so it remembers earlier requests in the same session. I built it while working through the LangChain lessons in the Python Mega Course, then rebuilt it on LangChain v1 when the course’s pattern went out of date and added removal on my own.",
    results:
      "**In the demo, four plain-English requests produce four real changes in Todoist: two tasks added and two removed**, including a casually phrased one (“What about buy bananas? I got those there too!”) that never uses the word remove. Under the hood, “remove” checks the task off in Todoist by its exact name, and the agent says so if no task matches.",
    video: "/project-media/langchain-agent/langchain-todo-agent-demo.mp4",
    videoAlt:
      "A captioned screen recording of an AI agent managing a Todoist to-do list. Four plain-English requests are typed into the agent on the right, and the to-do list on the left updates after each one: two tasks are added and two are removed.",
    badge: "show",
    badgeLabel: "Show it",
    cost: "$0/mo (free tier)",
  },
];

const frameworkProjects: Project[] = [
  {
    eyebrow: "Claude Skill — methodology",
    category: "Claude Skill",
    name: "Five-Doc Framework",
    stackLine: "PRD → System Design → UI/UX → Feature Breakdown → Master Prompt",
    description:
      "A mandatory five-document planning sequence, self-authored, that lets less-technical builders ship working Claude agents without skipping the thinking.",
    problem:
      "Less-technical builders — and AI-assisted builders in general — tend to jump straight into code or configuration, then discover mid-build that **no one ever defined what success looks like or how the pieces are supposed to connect**.",
    solution:
      "Authored a mandatory five-document planning sequence — PRD, System Design, UI/UX Wireframe, Feature Breakdown, and a Master Prompt — that has to be written and reviewed, **in that order, before any building starts**. Each document has required sections; the PRD alone forces an explicit What, Why, Who, success criteria, and out-of-scope list before anything else happens.",
    results:
      "Lets someone without a deep technical background **ship a working Claude agent without skipping the thinking** that usually only happens inside an experienced engineer's head.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    eyebrow: "Strategy Framework — self-authored, inspired by Jeff Winter's transformation thinking",
    category: "Framework",
    name: "Trifecta of Transformation",
    stackLine: "Technology ⟷ Process ⟷ People",
    description:
      "A three-pillar model for what actually has to move together for a GTM transformation to stick — not just the tool swap most teams default to.",
    problem:
      "Most GTM transformation efforts default to a tools conversation — buy the new platform, migrate the data, call it done. **That's one pillar out of three**, and it's the one most likely to fail on its own: a new system with no process discipline behind it, or no organizational buy-in around it, just becomes a more expensive version of the old mess.",
    solution:
      "Built a three-pillar framework — **Technology** (infrastructure, integrations, automation, and the data hygiene/integrity/governance that makes all three trustworthy), **Process** (the hand-offs, enablement, and customer-journey mapping that determine whether a system actually gets used correctly), and **People** (leadership alignment, cross-functional collaboration, and treating RevOps as its own strategic function rather than a tactical branch of Sales or Service) — as a working checklist for whether a transformation is actually complete, not just technically shipped. [DRAFT — Wendy to confirm the Automation sub-point's description once verified against the source diagram.]",
    results:
      "Used as the lens behind every project on this page — the technically hardest build still fails as a transformation if the process around it doesn't change or the org isn't structured to sustain it.",
    images: ["/project-media/trifecta/trifecta-of-transformation.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — strategy framework, not software",
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
    problem:
      "A boutique GTM/RevOps recruiting concept needs a real front door before it can take on candidates or clients — an idea alone doesn't establish credibility.",
    solution:
      "Built a candidate-intake site and a LinkedIn company presence to give the venture a real front door, with a completed brand mark — **\"Precisely Placed,\" a bullseye logo** — finalized after evaluating four design concepts and choosing one direction.",
    results:
      "A functioning intake site and a defined brand identity in place — early-stage and not yet in market, but with the foundational pieces (site, brand, positioning) built rather than still undecided.",
    badge: "try",
    badgeLabel: "Try it — live link",
    cost: "$0/mo",
  },
  {
    category: "Web App",
    eyebrow: "Web App",
    name: "Meeting Types",
    description: "Calendly-style scheduler — Flask + mocked Zoom/Salesforce/Calendar.",
    problem:
      "Booking a call today usually means back-and-forth emails or a generic scheduling link that doesn't know the difference between a 30-minute discovery call and a full product demo.",
    solution:
      "Built a Flask app that defines distinct meeting types — Discovery Call, Product Demo — each with its own duration and description, and a booking flow that creates a Zoom meeting, a Google Calendar event, and a Salesforce activity log for every booking.",
    results:
      "A working end-to-end booking flow, with the real Salesforce/Zoom/Calendar calls **mocked out as a proof of concept for now** — the version that would extend into a live scheduler once those integrations point at real accounts.",
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
    problem:
      "Personal AI assistance usually means either a generic chatbot with no real access to your accounts, or a fully autonomous agent you can't trust not to send an email or delete a file on its own.",
    solution:
      "Built Monica — a personal AI assistant living in Claude Cowork with real integrations into Drive, Gmail, and Calendar, running under **strict guardrails: no sending, scheduling, spending, or deleting without my explicit approval first**. It also runs a dedicated job-search mode built on the Proficiently skill.",
    results:
      "A daily assistant I actually trust with real account access, because **every irreversible action still routes through me** — full capability without giving up control.",
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
    problem:
      "Researching flight and hotel timing for a solo trip means juggling multiple sites and price-tracking tools, and most travel-AI demos quietly assume you want it to book things for you.",
    solution:
      "Built a solo-use travel research agent — evolved from an earlier AI Studio prototype of the same name, a PDX-to-BOS flight finder — that finds affordable hotel and flight pricing and the best timing to buy, with a light itinerary only when I actually ask for one, never as default output.",
    results:
      "Research and timing guidance with **zero booking or payment capability, by design** — it can tell me when to buy, it can never buy anything itself.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    category: "Claude Artifact",
    eyebrow: "Claude Artifact",
    name: "Job Application Dashboard",
    description: "Persistent React dashboard tracking every application in the search.",
    problem:
      "Applications pile up fast once a job search is actually running, and a spreadsheet doesn't hold status, notes, and next-steps well across dozens of active applications.",
    solution:
      "Built a persistent React dashboard, as a Claude Artifact, that tracks every application in the search — status, dates, and next steps — fed by the same job search system as the Job Search Pipeline and ATS Navigator.",
    results:
      "One place to see the full state of the search at a glance, instead of reconstructing it from memory or a scattered spreadsheet.",
    badge: "show",
    badgeLabel: "Show it",
    cost: "$17/mo shared*",
  },
  {
    category: "n8n Automation",
    eyebrow: "n8n Automation — built at BILL",
    name: "Enablement Deck Automation",
    stackLine:
      "Form → Google Sheet (Apps Script) → n8n + AI text enhancement → master Google Slides deck → each business unit's deck",
    description:
      "Extended a colleague's form-to-Google-Slides automation with an n8n step that uses AI to enhance what people enter.",
    problem:
      "A colleague at BILL had built a form that fed a Google Sheet through Apps Script, which triggered a master Google Slides deck and pushed it out to each business unit's own deck. It worked, but the slide text was whatever people typed into the form.",
    solution:
      "It started when I saw her question go unanswered in a channel and asked if she still needed help. She had the vision; I had the tools and wanted the practice. Once the form data landed in the spreadsheet, **I used n8n and AI to enhance what people had entered, then replaced the text on the appropriate slide in the master deck.**",
    results:
      "Because this was built inside BILL, I can't share screenshots or a recording. What I can share is the lesson: **the barrier to helping someone with AI automation is low enough that “I saw your message and wanted to try” is a legitimate way in.** No project plan or 10,000 hours as an SME, just curiosity and a willingness to dig in.",
    noHero: true,
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
    problem:
      "Inbound leads need enrichment, scoring, and routing before a rep ever sees them — done manually, that's a repetitive, error-prone chain of lookups and copy-paste between tools.",
    solution:
      "Built an n8n workflow that chains intake → Hunter.io enrichment → Claude-based ICP scoring → routing logic → a CRM write-back → a nurture-sequence handoff, running on **free/low-cost tiers rather than a paid enrichment-and-orchestration stack**.",
    results:
      "A lead gets enriched, scored, and routed automatically the moment it lands — no manual triage step, and the tool-cost story is as much the point as the automation: **this runs for $0–low/month** instead of what a comparable paid stack would cost.",
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
    problem:
      "Turning a messy brain-dump of thoughts into something an executive audience will actually read takes real communications skill — most people either over-structure it into a rigid template or leave it unstructured.",
    solution:
      "Built a LangChain + Gradio app on Gemini 2.5 Flash that takes a raw brain-dump and restructures it around BLUF principles — a concise core message, background context, 3-5 supporting key points, and clear next steps — **without forcing a rigid academic structure onto content that doesn't need it**. It also returns a coach's note explaining why it chose that structure for that audience.",
    results:
      "Turns an unstructured brain-dump into a formatted, audience-aware communication in one pass, with **the reasoning behind the structure made visible rather than hidden**.",
    badge: "show",
    badgeLabel: "Show it",
    cost: "$0/mo (free tier)",
  },
  {
    category: "Python",
    eyebrow: "Python",
    name: "Syncly",
    description: "OAuth calendar sync, idempotent — checks before inserting.",
    problem:
      "Keeping a work calendar and a personal calendar in sync by hand means constantly re-checking what's already been copied over, and it's easy to double-book or miss something.",
    solution:
      "Built an OAuth2-authenticated Python script against the Google Calendar API that pulls events from a source calendar and inserts them into a target calendar — **checking the target for existing event IDs first, so re-running it never creates duplicates**.",
    results:
      "**Idempotent by design**: run it once a day or ten times a day, the result is the same — every event from the source calendar exists exactly once in the target calendar.",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$0/mo",
  },
  {
    category: "Python",
    eyebrow: "Python — desktop app",
    name: "Expense Tracker (Reimbursement)",
    description:
      "Desktop expense tracker for work reimbursements — Python + tkinter, saving to a spreadsheet-friendly file. My first AI-assisted build, from 2024.",
    problem:
      "A reimbursement report is only as good as the data going into it — dates, amounts, categories, and payment types typed by hand into a spreadsheet are easy to get inconsistent.",
    solution:
      "Built a small desktop app in Python with tkinter: an Add/Edit Expense window (date, amount, category, payment method, source) with a category drop-down — Car, Lodging, Flight, Meals and Beverages, Shopping, Miscellaneous — plus **date (MM/DD/YYYY) and amount validation** and Load / Save / Edit buttons that read and write the expense report as a file that opens straight in Excel. **I built it in 2024 by \"vibe coding\" with ChatGPT** — describing what I wanted and iterating on what came back.",
    results:
      "The real result was the lesson. **Vibe coding got me to a first working version fast, but then came infinite loops of updating one thing and breaking another** — because I couldn't yet read the code well enough to steer it. It taught me how to really use AI to assist with code, and it reinforced **the importance of truly learning, understanding, and knowing the code, and not just relying on it.** It's why the Python work on this page is written and understood by me, with AI as a guide rather than the author. I plan to come back and get this one running again.",
    images: ["/project-media/reimbursement/expense-tracker.png"],
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$0/mo",
  },
  {
    category: "Python",
    eyebrow: "Python — desktop app",
    name: "Iron Chef (Recipe Importer)",
    description:
      "A small desktop app that turns a recipe copied from a web page into a saved Word document: paste it into a form, click Save.",
    solution:
      "Built a desktop app in Python with PyQt5. A form takes a recipe's name, source, cooking time, nutrition facts, ingredients and instructions, most of it copied straight from a web page. **One click on Save Recipe writes it out as a formatted Word document** (using python-docx) in a `new_recipes` folder and shows a pop-up confirming it was saved.",
    results:
      "**In the demo, one recipe goes from a web page to a saved Word document in a single click.** I paste in the name, source, cooking time, nutrition facts, ingredients and instructions for a peanut butter cookie recipe, click Save Recipe, and the finished document appears in the project folder with the title, source, cooking time, nutrition facts, ingredients and directions laid out on the page.",
    video: "/project-media/iron-chef/iron-chef-recipe-importer-demo.mp4",
    videoAlt:
      "A captioned screen recording of a Python desktop app called Iron Chef. A recipe is copied from a web page and pasted into the app's form in six steps, Save Recipe is clicked, a pop-up confirms it saved, and the recipe opens as a formatted Word document.",
    badge: "show",
    badgeLabel: "Show it",
    cost: "$0/mo",
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

type Feature = {
  publication: string;
  title: string;
  // Optional: a feature without a link renders as text only.
  url?: string;
  linkLabel?: string;
  blurb?: string;
  // Optional: a pull-quote from her own contribution, shown highlighted so visitors do not have to open the link.
  quote?: string;
  // Optional: a square photo filling the left side of the card (top of the card on small screens).
  photo?: { src: string; alt: string };
  // Optional: span both grid columns (text-only cards). Cards with a photo or video always do.
  wide?: boolean;
  // Optional: a short highlight clip shown beside the text (click to play, sound on).
  video?: { src: string; poster: string; alt: string };
  // Optional: link to the full episode. Leave it undefined until the episode is live, so the card never shows a dead link.
  fullEpisodeUrl?: string;
};

const featuredIn: Feature[] = [
  {
    publication: "Sweep — REVolutions series",
    title: "REVolutions: Wendy Lampert",
    url: "https://www.sweep.io/blog/revolutions-wendy-lampert",
    blurb:
      "Interview on moving from Hospitality & Tourism Management into RevOps, and the lessons that carried over.",
    linkLabel: "Read the full interview",
  },
  {
    publication: "INFUSE Academy — B2B marketing course",
    title: "Sales Funnel in B2B Marketing",
    url: "https://academy.infuse.com/course/sales-funnel",
    blurb:
      "Featured practitioner in INFUSE Academy's free certification course on the B2B sales funnel, the Dark Funnel, and alternative buyer-journey models. 4 lessons, 47 minutes.",
    linkLabel: "View the course",
  },
  {
    publication: "INFUSE — B2B Expert Roundup",
    title: "Top RevOps Trends to Watch in 2023",
    url: "https://infuse.com/insight/top-revops-trends-to-watch/",
    blurb: "Contributing expert.",
    quote:
      "“I believe we will also find an increase in AI System automation implementation adding to the current tech stacks already in place with a heavy focus on Reverse ETLs.”",
    photo: { src: "/project-media/features/wendy-infuse-headshot.jpg", alt: "Wendy Lampert" },
    linkLabel: "Read the full roundup",
  },
  {
    publication: "INFUSE — B2B Expert Roundup",
    title: "What Is the Link Between RevOps and Client Experience?",
    url: "https://infuse.com/insight/b2b-expert-roundup-what-is-the-link-between-revops-and-client-experience/",
    blurb: "Contributing expert.",
    quote:
      "“I believe that the hand-offs throughout an entire process are the most pivotal for a successful client experience.”",
    wide: true,
    linkLabel: "Read the full roundup",
  },
  {
    publication: "The Revenue Operators — podcast",
    title: "Guest appearance on The Revenue Operators",
    blurb:
      "Guest on The Revenue Operators podcast. This 91-second highlight opens on the problem, that with job titles blurred professionals have no clear path or sense of identity. It then goes back to 2016, when I lived the split between sales ops and RevOps before those titles existed, and lands on why RevOps should define and design go-to-market while the other ops functions maintain it.",
    video: {
      src: "/project-media/revenue-operators/podcast-highlight.mp4",
      poster: "/project-media/revenue-operators/podcast-highlight-poster.jpg",
      alt: "91-second highlight from Wendy Lampert's guest appearance on The Revenue Operators podcast, with captions",
    },
    fullEpisodeUrl: "https://youtu.be/vndNmGUrdfI",
  },
];

function MedalIcon() {
  return (
    <svg
      className="award-banner-icon"
      viewBox="0 0 32 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11 13 L21 13 L21 36 L16 30 L11 36 Z"
        fill="var(--wire-strong)"
      />
      <circle
        cx="16"
        cy="14"
        r="13"
        fill="var(--award-bg)"
        stroke="var(--wire-strong)"
        strokeWidth="1.2"
      />
      <circle
        cx="16"
        cy="14"
        r="9.5"
        fill="var(--award)"
        stroke="var(--wire-strong)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function categorySlug(category?: string): string {
  switch (category) {
    case "Python":
      return "python";
    case "Claude Agent":
      return "agent";
    case "Claude Artifact":
      return "artifact";
    case "n8n Automation":
      return "automation";
    case "Web App":
      return "web";
    case "Claude Skill":
      return "skill";
    case "Framework":
      return "framework";
    default:
      return "default";
  }
}

function categoryLabel(category?: string): string {
  return (category ?? "Project").toUpperCase();
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [roiExpanded, setRoiExpanded] = useState(false);

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

  const renderProjectExtras = (project: Project, extraImages: string[] = []) => {
    const isExpanded = expanded.includes(project.name);
    const hasCaseStudy = project.problem || project.solution || project.results;
    return (
      <>
        {extraImages.length > 0 && (
          <div className="project-image-row">
            {extraImages.map((src, i) => (
              <button
                key={src}
                type="button"
                className="project-image"
                onClick={() => setLightboxSrc(src)}
              >
                <img src={src} alt={`${project.name} screenshot ${i + 2}`} />
              </button>
            ))}
          </div>
        )}
        {hasCaseStudy && (
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
                {project.problem && (
                  <div className="case-study-block">
                    <div className="case-study-label">Problem</div>
                    <p>{renderWithBold(project.problem)}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="case-study-block">
                    <div className="case-study-label">Solution</div>
                    <p>{renderWithBold(project.solution)}</p>
                  </div>
                )}
                {project.results && (
                  <div className="case-study-block">
                    <div className="case-study-label">Results</div>
                    <p>{renderWithBold(project.results)}</p>
                  </div>
                )}
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
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10 lg:px-14">
          <div className="mono text-[15px] font-semibold tracking-wide">
            WENDY LAMPERT <span className="text-[var(--muted)]">/ portfolio</span>
          </div>
          <SiteNav />
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-6 py-12 sm:px-10 lg:px-14">
        <section className="mb-10">
          <div className="wire p-7">
            <h1 className="mb-2 text-3xl font-semibold leading-tight">Wendy Lampert</h1>
            <p className="text-[var(--muted)]">
              RevOps depth, shipped in code.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <div className="wire p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <img
                src="/wendy-about-photo.jpg"
                alt="Wendy Lampert at her desk, mid-build"
                className="about-photo"
              />
              <div>
            <h2 className="mb-3 text-2xl font-semibold leading-tight">Running Revenue to Coding It</h2>
            <div className="lg:columns-2 lg:gap-12">
            <p className="mb-3 text-[15px] leading-relaxed">
              I am a GTM Engineer who spent the last decade in Sales & Revenue Operations, bridging deep 
              operational experience with hands-on software development. 
              </p>
            <p className="mb-3 text-[15px] leading-relaxed">
              Having solved high-stakes scale problems, I bring the discipline of process design and input it
              directly into code. I build production-grade automations and software using Python, n8n, and LLMs
              with a keene focus architecturally, treating AI as a partner for reasoning and debugging 
              rather than a black-box shortcut. 
            </p>
            <p className="mb-3 text-[15px] leading-relaxed">
              Every system I build reflects real operating scars: designed with rigorous pseudocode (step-by-step
              plain English process outline) first, tested end to end, and engineered to solve root data 
              and scale bottlenecks.
            </p>
            <p className="  text-[15px] leading-relaxed">
              That combination (real operating scars, plus real engineering discipline) is what
              I actually bring to GTM Engineering. I lean on Claude to think through problems with
              me, not to think for me: pointing me to the right documentation, helping me
              troubleshoot when something breaks, working through a decision out loud, never
              writing the whole thing while I stay in the dark about how it works. Never wondering
              if it's architecturally sound, in compliance, secure, or even the right best tool for the job.
              </p>
              <p className="mb-3 text-[15px] leading-relaxed">
              And it&apos;s not the only tool I use. Claude is a hammer, not an entire toolbox - the right choice
              for some problems, the wrong one for others, and knowing the difference is half the job.
</p>
  <p className="mb-3">
              Every project on this page is either a real problem I hit doing the work, or one I
              built on my own to learn something the hard way, hands-on, line by line,  instead
              of vibe-coding past the parts most people skip. There is one exception which taught 
              me the importance of why Vibe Coding is not the right approach.
            </p>
            </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="wire p-6">
              <div className="mono mb-2 text-[11px] uppercase tracking-wide text-[var(--note)]">
                Estimated ROI, as built
              </div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="mono text-[28px] font-semibold">~$2,850/mo</span>
                <span className="text-[13.5px] text-[var(--muted)]">
                  in time value across 10 of 13 projects — measured for Route Detective (20
                  hrs/month, targeting a 30-40% reduction in &quot;why did I get this
                  lead?&quot; tickets) and the Job Search Pipeline (15+ hrs/month);
                  reasonably estimated for the rest, using real market medians (BLS,
                  Glassdoor) for whichever role each tool actually serves.
                </span>
              </div>
              <button
                type="button"
                className="read-more-btn mt-2"
                onClick={() => setRoiExpanded((v) => !v)}
              >
                {roiExpanded ? "Hide the math ↑" : "See the math ↓"}
              </button>
              {roiExpanded && (
                <div className="long-description">
                  <p>
                    Every rate here is a real market median for whoever actually does that
                    job — not a personal figure:{" "}
                    <a
                      href="https://www.glassdoor.com/Salaries/director-of-revenue-operations-salary-SRCH_KO0,30.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Glassdoor, Director of Revenue Operations
                    </a>{" "}
                    (base pay midpoint ~$137,500/yr → ~$66/hr) for tools that save my own
                    time,{" "}
                    <a
                      href="https://www.glassdoor.com/Salaries/revenue-operations-manager-salary-SRCH_KO0,26.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Glassdoor, Revenue Operations Manager
                    </a>{" "}
                    (base pay midpoint ~$96,000/yr → ~$46/hr) for the hands-on
                    investigation work Route Detective replaces,{" "}
                    <a
                      href="https://www.bls.gov/ooh/office-and-administrative-support/secretaries-and-administrative-assistants.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      BLS, Secretaries &amp; Administrative Assistants
                    </a>{" "}
                    ($48,310/yr → $23.23/hr),{" "}
                    <a
                      href="https://www.glassdoor.com/Salaries/communications-manager-salary-SRCH_KO0,22.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Glassdoor, Communications Manager
                    </a>{" "}
                    ($108,624/yr avg → $52.22/hr), and{" "}
                    <a
                      href="https://www.glassdoor.com/Salaries/sales-development-representative-salary-SRCH_KO0,32.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Glassdoor, Sales Development Rep
                    </a>{" "}
                    (median base ~$64,500/yr → ~$31/hr).
                  </p>
                  <table className="roi-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Rate basis</th>
                        <th>Hrs/mo</th>
                        <th className="num">Est. $/mo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Route Detective</td>
                        <td>RevOps Manager, $46/hr</td>
                        <td>20 (stated)</td>
                        <td className="num">$920</td>
                      </tr>
                      <tr>
                        <td>Job Search Pipeline</td>
                        <td>Director of RevOps, $66/hr</td>
                        <td>15 (stated)</td>
                        <td className="num">$990</td>
                      </tr>
                      <tr>
                        <td>Executive Comms Coach</td>
                        <td>Comms Manager, $52/hr</td>
                        <td>~3 (est.)</td>
                        <td className="num">$157</td>
                      </tr>
                      <tr>
                        <td>Job Application Dashboard</td>
                        <td>Director of RevOps, $66/hr</td>
                        <td>~2 (est.)</td>
                        <td className="num">$130</td>
                      </tr>
                      <tr>
                        <td>Aeroscout</td>
                        <td>Director of RevOps, $66/hr</td>
                        <td>~2 (est.)</td>
                        <td className="num">$130</td>
                      </tr>
                      <tr>
                        <td>Five-Doc Framework</td>
                        <td>SDR base, $31/hr</td>
                        <td>~4 (est.)</td>
                        <td className="num">$124</td>
                      </tr>
                      <tr>
                        <td>Todoist AI Agent</td>
                        <td>Director of RevOps, $66/hr</td>
                        <td>~1.5 (est.)</td>
                        <td className="num">$100</td>
                      </tr>
                      <tr>
                        <td>Monica</td>
                        <td>Admin Assistant, $23/hr</td>
                        <td>~5 (est.)</td>
                        <td className="num">$116</td>
                      </tr>
                      <tr>
                        <td>Enablement Deck Automation</td>
                        <td>SDR base, $31/hr</td>
                        <td>~3 (est.)</td>
                        <td className="num">$93</td>
                      </tr>
                      <tr>
                        <td>Syncly</td>
                        <td>Admin Assistant, $23/hr</td>
                        <td>~4 (est.)</td>
                        <td className="num">$93</td>
                      </tr>
                      <tr className="roi-total">
                        <td colSpan={3}>Total</td>
                        <td className="num">~$2,850</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="roi-footnote">
                    Route Detective and Job Search Pipeline hours are stated in their case
                    studies; every other hours figure is my own reasonable estimate, not
                    measured. Not included: TOFU Lead-Routing Pipeline (its ROI is
                    tool-cost avoidance — running on free/low-cost tiers instead of a paid
                    enrichment + orchestration stack — not hours, and I don&apos;t have
                    reliable figures for what was actually running to price that out yet),
                    and two early-stage prototypes not yet in production use (RevOps
                    Recruit, Meeting Types).
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="projects" className="mb-12">
          <h2 className="section-title">01 — Flagship</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {flagshipProjects.map((project) => {
              const heroImage = project.images && project.images.length > 0 ? project.images[0] : undefined;
              const extraImages = project.images && project.images.length > 1 ? project.images.slice(1) : [];
              return (
                <div key={project.name} className="wire flagship-card">
                  <div className={project.video ? "card-hero card-hero-video" : "card-hero"}>
                    {project.video ? (
                      <video
                        className="demo-video"
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={project.videoAlt}
                        src={project.video}
                      />
                    ) : heroImage ? (
                      <button
                        type="button"
                        className="card-hero-image-btn"
                        onClick={() => setLightboxSrc(heroImage)}
                      >
                        <img src={heroImage} alt={`${project.name} preview`} />
                      </button>
                    ) : (
                      <div className="card-hero-placeholder" data-cat={categorySlug(project.category)}>
                        <span className="card-hero-label">{categoryLabel(project.category)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flagship-body">
                    {project.awardBanner && (
                      <div className="award-banner">
                        <MedalIcon />
                        <div className="award-banner-text">
                          <span className="award-main">{project.awardBanner}</span>
                          {project.awardNote && (
                            <span className="award-note">{project.awardNote}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="eyebrow">{project.eyebrow}</div>
                    <h3>{project.name}</h3>
                    <div className="stack-line">{project.stackLine}</div>
                    <p className="desc">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                      <span className="cost-tag">{project.cost}</span>
                    </div>
                    {renderProjectExtras(project, extraImages)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-title">02 — Frameworks &amp; Strategy</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {frameworkProjects.map((project) => {
              const heroImage = project.images && project.images.length > 0 ? project.images[0] : undefined;
              const extraImages = project.images && project.images.length > 1 ? project.images.slice(1) : [];
              return (
                <div key={project.name} className="wire card">
                  <div className={project.imageFit === "contain" ? "card-hero card-hero-contain" : "card-hero"}>
                    {heroImage ? (
                      <button
                        type="button"
                        className="card-hero-image-btn"
                        onClick={() => setLightboxSrc(heroImage)}
                      >
                        <img src={heroImage} alt={`${project.name} preview`} />
                      </button>
                    ) : (
                      <div className="card-hero-placeholder" data-cat={categorySlug(project.category)}>
                        <span className="card-hero-label">{categoryLabel(project.category)}</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <span className="eyebrow">{project.eyebrow}</span>
                    <h4>{project.name}</h4>
                    <p className="desc">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                      <span className="cost-tag">{project.cost}</span>
                    </div>
                    {renderProjectExtras(project, extraImages)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-title">03 — Technical Builds</h2>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-flow:dense]">
            {visibleProjects.map((project) => {
              const heroImage = project.images && project.images.length > 0 ? project.images[0] : undefined;
              const extraImages = project.images && project.images.length > 1 ? project.images.slice(1) : [];
              return (
                <div key={project.name} className={`wire card${project.video ? " sm:col-span-2" : ""}`}>
                  {!project.noHero && (
                  <div className={project.video ? "card-hero card-hero-video" : "card-hero"}>
                    {project.video ? (
                      <video
                        className="demo-video"
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={project.videoAlt}
                        src={project.video}
                      />
                    ) : heroImage ? (
                      <button
                        type="button"
                        className="card-hero-image-btn"
                        onClick={() => setLightboxSrc(heroImage)}
                      >
                        <img src={heroImage} alt={`${project.name} preview`} />
                      </button>
                    ) : (
                      <div className="card-hero-placeholder" data-cat={categorySlug(project.category)}>
                        <span className="card-hero-label">{categoryLabel(project.category)}</span>
                      </div>
                    )}
                  </div>
                  )}
                  <div className="card-body">
                    <span className="eyebrow">{project.eyebrow}</span>
                    <h4>{project.name}</h4>
                    <p className="desc">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                      <span className="cost-tag">{project.cost}</span>
                    </div>
                    {renderProjectExtras(project, extraImages)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-title">04 — Features</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {featuredIn.map((feature) => {
              const text = (
                <>
                  <span className="eyebrow">{feature.publication}</span>
                  <h4 className="mb-2 mt-1 text-[16px] font-semibold">{feature.title}</h4>
                  {feature.blurb && <p className="desc">{feature.blurb}</p>}
                  {feature.quote && <blockquote className="feature-quote">{feature.quote}</blockquote>}
                  {(feature.fullEpisodeUrl || feature.url) && (
                    <div className="flex flex-wrap gap-x-5">
                      {feature.fullEpisodeUrl && (
                        <a
                          className="feature-link"
                          href={feature.fullEpisodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch the full episode &#8594;
                        </a>
                      )}
                      {feature.url && (
                        <a
                          className="feature-link"
                          href={feature.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {feature.linkLabel ?? "Read more"} &#8594;
                        </a>
                      )}
                    </div>
                  )}
                </>
              );
              if (feature.photo) {
                return (
                  <div key={feature.title} className="wire feature-with-photo sm:col-span-2">
                    <div className="feature-photo-wrap">
                      <img
                        className="feature-photo"
                        src={feature.photo.src}
                        alt={feature.photo.alt}
                        width={480}
                        height={480}
                        loading="lazy"
                      />
                    </div>
                    <div className="feature-text">{text}</div>
                  </div>
                );
              }
              if (feature.video) {
                return (
                  <div key={feature.title} className="wire feature-with-video sm:col-span-2">
                    <video
                      className="feature-video"
                      controls
                      playsInline
                      preload="metadata"
                      poster={feature.video.poster}
                      aria-label={feature.video.alt}
                    >
                      <source src={feature.video.src} type="video/mp4" />
                    </video>
                    <div className="feature-text">{text}</div>
                  </div>
                );
              }
              return (
                <div key={feature.title} className={`wire p-6${feature.wide ? " sm:col-span-2" : ""}`}>
                  {text}
                </div>
              );
            })}
          </div>
        </section>

        <section id="skills">
          <h2 className="section-title">05 — Skills &amp; tools</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="mt-8 border-t border-[var(--wire-strong)] px-6 py-8 sm:px-10 lg:px-14">
        <div className="mono mx-auto max-w-[1360px] text-[12px] text-[var(--muted)]">
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
