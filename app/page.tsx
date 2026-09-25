"use client";

import { useEffect, useState } from "react";
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
  // One-line summaries shown on the case-study slide without clicking.
  problemShort?: string;
  solutionShort?: string;
  resultShort?: string;
  // Optional credit line shown at the end of the full case study.
  credit?: { text: string; linkText: string; url: string };
  images?: string[];
  // "contain" shows a diagram whole (full width, natural height) instead of cropping it to 16:9.
  imageFit?: "contain";
  // "row" shows all images as one equal-size sequence (in array order) instead of a big hero + smaller extras below.
  imageLayout?: "row";
  // Captioned screen recording shown in the card hero instead of a still image.
  video?: string;
  videoAlt?: string;
  // Text-only card: skips the hero block (no image, video, or striped placeholder). Remove once media exists.
  noHero?: boolean;
  // Optional: link to the live project. Renders as a "Visit the live site" link on the card.
  liveUrl?: string;
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
    problemShort:
      "Scanning niche job boards by hand is slow, and strong applications get auto-rejected before a human ever sees them.",
    solutionShort:
      "I ran my own job search like a GTM pipeline: an Ideal Job Profile as the ICP, and a daily agent that scores every new posting against it.",
    resultShort:
      "~365 repeat postings skipped automatically, a daily Slack digest, and a clear read on which ATS risks I can actually fix.",
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
    imageLayout: "row",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
  {
    eyebrow: "Python — built at BILL",
    category: "Python",
    name: "Route Detective",
    problemShort:
      "BILL's 300+ node lead-routing graph worked, but no one could explain why a lead landed where it did. Not even LeanData's own AI.",
    solutionShort:
      "After four other tools failed, I built a Python app on Gemini that compresses the ~400KB routing graph to under 1KB per lead, then diagnoses it.",
    resultShort:
      "Sorts every routing question into five root causes. Targets 30-40% fewer \"why did I get this lead?\" tickets and ~20 hrs/month of log-tracing.",
    stackLine: "Gemini API (zero-temperature) → graph compression → 5-bucket root-cause classification",
    description:
      "AI diagnostic tool that triangulates actual vs. expected lead-routing outcomes across a 300+ node routing graph — built from scratch after four other approaches failed.",
    problem:
      "BILL's routing graph spans 300+ decision nodes across 14 sales teams and multiple ownership layers. It worked, but **no one outside the person who built it could explain why a lead landed where it did** — not reps, not managers, **not even LeanData's own native AI feature**, which could only reference audit logs and couldn't say whether a routing outcome was actually correct.",
    solution:
      "Four attempts failed (n8n, Glean, Claude Cowork, LeanData's native AI) before I designed a custom Python application on the Gemini API. The core engineering challenge was context: **the full routing graph runs ~400KB, too large for any model to reason over** per-record. I built a compression approach that extracts only the nodes a given lead actually traversed, **cutting the payload to under 1KB** with no loss of investigative accuracy — then ran it at zero-temperature **so the same inputs always produce the same structured verdict.** Route Detective triangulates what actually happened, what should have happened per the Rules of Engagement, and what the rep expected to happen.",
    results:
      "**Classifies exactly where those three diverge into five root-cause buckets, distinguishing a real misroute from routing that was \"working as designed.\"** Completed July 2026; testing already confirms correct classification against real anonymized data. Together with a companion field-level change I shipped, **it targets a 30-40% reduction in \"why did I get this lead?\" tickets and roughly 20 hours/month of manual log-tracing eliminated.**",
    images: ["/project-media/route-detective/route-detective-mockup.png"],
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
    problemShort:
      "Most \"AI task managers\" are a prompt wrapped around a to-do list. They can suggest an action, but they can't take one.",
    solutionShort:
      "I built a real tool-calling agent in Python with LangChain that adds, shows, and removes tasks in my actual Todoist.",
    resultShort:
      "Four plain-English requests, four real changes in Todoist, including one that never uses the word \"remove.\"",
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
  {
    eyebrow: "Claude Scheduled Agent — grocery price tracking",
    category: "Claude Agent",
    name: "Grocery Scanner",
    problemShort:
      "A 30% RIF was on the table and I didn't know if I'd be in it — the kind of uncertainty where a lower grocery bill actually matters, but comparing flyers against what I buy, by hand, every week, wasn't happening.",
    solutionShort:
      "A Claude scheduled agent that scrapes the weekly flyers for my regular stores, checks them against my Alexa Shopping List, and tracks price history on staples so it can tell a real deal from a normal sale.",
    resultShort:
      "Runs on its own every week — I get flagged when something on my actual list is genuinely cheap, instead of scanning flyers myself and guessing.",
    stackLine: "Weekly schedule → flyer scrape → Alexa Shopping List match → price-history check → deal alert",
    description:
      "A Claude scheduled agent that scrapes weekly grocery flyers, checks them against my Alexa Shopping List, and tracks staple-item pricing week over week to flag genuine deals — built during a stretch of real income uncertainty.",
    problem:
      "My company announced a **30% reduction in force**, and I had no way of knowing whether I'd be in that group. That's the kind of uncertainty where a lower grocery bill actually matters — but comparing flyers against what I actually buy, every week, by hand, wasn't something I was going to keep doing.",
    solution:
      "A Claude scheduled agent that runs on its own every week: it **scrapes the flyers for my regular stores**, cross-references them against my **Alexa Shopping List** so it's only looking at what I actually buy, and keeps a **running price history on staple items** so it can tell a real deal from a store's normal in-and-out pricing. When something clears that bar, it notifies me — I don't have to go looking.",
    results:
      "Runs unattended on the same schedule every week. I get flagged when something on my actual list is genuinely cheap, instead of scanning flyers myself and guessing whether a \"sale\" price is any better than what I paid last month.",
    images: ["/project-media/grocery-scanner/grocery-scanner.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
];

const frameworkProjects: Project[] = [
  {
    eyebrow: "Strategy Framework — self-authored investment philosophy",
    category: "Framework",
    name: "The Red Egg Philosophy",
    problemShort:
      "Feed an AI too much undifferentiated data and it can't find the field that actually answers the question — more inputs don't mean a better answer.",
    solutionShort:
      "A diworsification-avoidance lens borrowed from investing: curate a dataset down to what earns its place, the way a red egg is only obvious once the noise is stripped away.",
    resultShort:
      "The filter applied to a dataset before it's trusted: is this curated enough to find the signal, or just padded enough to look thorough?",
    stackLine: "Too much data, no signal ⟷ curated data, obvious signal",
    description:
      "A diworsification-avoidance lens for data: curating a dataset down to the fields that actually earn their place, instead of trusting an AI to find the signal in everything left in.",
    problem:
      "Diworsification is investor Peter Lynch's term for diversifying a portfolio so far that no single holding can move the needle. **The same failure shows up in data: feed a model too much undifferentiated data and it can't find the field that actually answers the question.** More inputs don't mean a better answer — they mean the signal is buried under noise the model has to sort through first.",
    solution:
      "Named for a basket of eggs with one painted red: **a single clean color reads instantly against a plain background, and disappears the moment a dozen other patterns compete for attention.** Data works exactly the same way — a dataset stripped to the fields that actually earn their place makes the answer obvious, where a dataset with everything left in buries it. The discipline is the same one Lynch applied to stock picking, applied one layer down: **before asking an AI to find the right answer, ask whether the data even gives it a fair shot.**",
    results:
      "Used as the filter behind any dataset, **before FIRST or Process Evolution ever get applied to a specific initiative:** is what's here curated enough to find the signal, or just padded enough to look thorough?",
    images: ["/project-media/red-egg/red-egg.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — strategy framework, not software",
  },
  {
    eyebrow: "Strategy Framework — publicly known rubric, applied to AI/automation bets",
    category: "Framework",
    name: "The FIRST Framework",
    problemShort:
      "Without a shared rubric, whichever initiative got pitched most recently or most loudly tends to win the budget conversation, whether or not it's actually the best bet.",
    solutionShort:
      "A five-criteria scorecard — Feasibility, Investment, Risk/Reward, Strategic Priority, Timeframe — for scoring any initiative on the same axes before it gets funded.",
    resultShort:
      "Turns a prioritization debate into a comparison of five specific factors instead of five competing narratives.",
    stackLine: "Feasibility → Investment → Risk/Reward → Strategic Priority → Timeframe",
    description:
      "A five-criteria scoring rubric — Feasibility, Investment, Risk/Reward, Strategic Priority, Timeframe — for deciding which AI or automation initiatives actually get funded.",
    problem:
      "Once a shortlist of candidate initiatives exists, the next failure mode is scoring them on gut feel. **Whichever idea got pitched most recently, or most loudly, tends to win the budget conversation** regardless of whether it's actually the strongest bet.",
    solution:
      "Applies a five-criteria rubric — **Feasibility** (can this actually be built with the data, systems, and skills on hand right now), **Investment** (what it costs in engineering time, tooling spend, and org attention to stand up), **Risk/Reward** (what breaks if it fails, versus what it's worth if it works), **Strategic Priority** (does it move a goal leadership already committed to, or just feel productive), and **Timeframe** (a quick win to build momentum, or a multi-quarter bet) — to score any initiative on the same axes before it gets funded.",
    results:
      "Turns a prioritization debate into a **comparison of five specific factors instead of five competing narratives**, and makes it possible to explain, after the fact, why an initiative got funded (or didn't) to anyone who asks.",
    images: ["/project-media/first-framework/first-framework.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — strategy framework, not software",
  },
  {
    eyebrow: "Strategy Framework — self-authored, applies Jeff Winter's AGPDCC taxonomy",
    category: "Framework",
    name: "Risk-Tier Portfolio Lens",
    credit: {
      text: "AGPDCC taxonomy by",
      linkText: "Jeff Winter",
      url: "https://www.linkedin.com/in/jeffreyrwinter/",
    },
    problemShort:
      "A roadmap that's all safe bets never produces a breakthrough — and a roadmap that's all Generative AI with no Analytical is just as lopsided as one that's all moonshots.",
    solutionShort:
      "A two-axis lens for reading a whole portfolio: the mix of risk tiers (Low-Risk, Medium-Risk, Moonshot), and — borrowing Jeff Winter's AGPDCC taxonomy — the mix of AI capability types (Analyze, Generate, Predict, Detect, Control, Connect).",
    resultShort:
      "Catches an unbalanced portfolio before it ships, on either axis: too many safe wins or too many moonshots, too many Generative tools or too few Analytical ones.",
    stackLine: "Low-Risk ⟷ Medium-Risk ⟷ Moonshot   |   Analyze · Generate · Predict · Detect · Control · Connect",
    description:
      "A two-axis portfolio lens — risk tier, and Jeff Winter's AGPDCC taxonomy of AI capability types — for checking the balance of an entire AI or automation portfolio, not just scoring one initiative in isolation.",
    problem:
      "FIRST scores whether a single initiative is worth funding. It doesn't answer a different question: **across everything funded, is the portfolio actually balanced** — or is it entirely safe, incremental wins with no shot at a real breakthrough, or entirely ambitious bets with nothing certain to ship this quarter? The same imbalance shows up on a second axis, too: a stack of nothing but Generative AI tools, with no Analytical, Predictive, or Detective capability anywhere in it, is diworsified the same way a portfolio of ten look-alike micro-caps is.",
    solution:
      "A two-axis lens for reading a whole roadmap at once, the way a 401(k) statement reads a retirement account from more than one angle. The first axis is risk: **Low-Risk** (predictable, near-certain ROI, ships fast), **Medium-Risk** (real business impact, manageable complexity and uncertainty), and **Moonshot** (industry-level disruption, high risk/high reward, genuinely uncertain). The second axis borrows Jeff Winter's **AGPDCC taxonomy — Analyze, Generate, Predict, Detect, Control, Connect** — as a capability-type check: you cannot have too many Generative AI tools and none of the Analytical, any more than a diversified retirement account can be all one holding. Neither axis asks whether any one tier or type is good or bad — both ask whether **the mix matches what the organization can actually tolerate and needs to prove.**",
    results:
      "Used after FIRST and Red Egg have already picked the individual bets — the **last gut check on the shape of the whole portfolio**, on both axes, not any one line in it.",
    images: ["/project-media/risk-tier-lens/risk-tier-lens.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — strategy framework, not software",
  },
  {
    eyebrow: "Strategy Framework — applied from Jeff Winter's Process Evolution Framework",
    category: "Framework",
    name: "Process Evolution Framework",
    credit: {
      text: "Framework originated by",
      linkText: "Jeff Winter",
      url: "https://www.jeffwinterinsights.com/insights/the-process-evolution-framework",
    },
    problemShort:
      "The instinct with a new AI tool is to point it at the messiest manual process in the building. Automating a broken process just makes the mess move faster.",
    solutionShort:
      "Applied a six-stage maturity model — Understand, Standardize, Optimize, Digitize, Automate, Integrate — where automation is stage four and five, not stage one.",
    resultShort:
      "The sequencing discipline behind moving from scattered, ad hoc pilots to a genuinely integrated, automated system.",
    stackLine: "Understand → Standardize → Optimize → Digitize → Automate → Integrate",
    description:
      "A six-stage maturity model — Understand, Standardize, Optimize, Digitize, Automate, Integrate — applied to sequence an organization's move from scattered AI pilots to a genuinely automated, integrated system.",
    problem:
      "The instinct with a new AI capability is to point it at the messiest, most manual process in the building and call that transformation. **Automating a broken process just makes the mess move faster** — it doesn't fix it.",
    solution:
      "Applied a six-stage model — **Understand, Standardize, Optimize, Digitize, Automate, Integrate** — that treats automation as the fourth and fifth stages, not the first. **The first three stages are deliberately non-technical**: understand what the process actually is today, standardize it so it runs the same way twice, and optimize it before a single line of code gets written. Only then does it get digitized, automated, and finally integrated into the surrounding systems.",
    results:
      "The sequencing discipline behind moving an organization from **scattered, ad hoc pilots to a genuinely automated, integrated system** — each stage is a checkpoint, not a step to skip on the way to the exciting part.",
    images: ["/project-media/process-evolution/process-evolution-framework.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — strategy framework, not software",
  },
  {
    eyebrow: "Strategy Framework — self-authored, inspired by Jeff Winter's transformation thinking",
    category: "Framework",
    name: "Trifecta of Transformation",
    credit: {
      text: "Inspired by the transformation thinking of",
      linkText: "Jeff Winter",
      url: "https://www.linkedin.com/in/jeffreyrwinter/",
    },
    problemShort:
      "Most GTM transformations stop at the tool swap. A new platform without process or buy-in is just a more expensive version of the old mess.",
    solutionShort:
      "A three-pillar checklist (Technology, Process, People) for whether a transformation is actually complete, not just technically shipped.",
    resultShort:
      "The lens behind every project on this page: even the hardest build fails if the process and the org don't change with it.",
    stackLine: "Technology ⟷ Process ⟷ People",
    description:
      "A three-pillar model for what actually has to move together for a GTM transformation to stick — not just the tool swap most teams default to.",
    problem:
      "Most GTM transformation efforts default to a tools conversation — buy the new platform, migrate the data, call it done. **That's one pillar out of three**, and it's the one most likely to fail on its own: a new system with no process discipline behind it, or no organizational buy-in around it, just becomes a more expensive version of the old mess.",
    solution:
      "Built a three-pillar framework — **Technology** (infrastructure, integrations, automation, and the data hygiene/integrity/governance that makes all three trustworthy), **Process** (the hand-offs, enablement, and customer-journey mapping that determine whether a system actually gets used correctly), and **People** (leadership alignment, cross-functional collaboration, and treating RevOps as its own strategic function rather than a tactical branch of Sales or Service) — as a working checklist for whether a transformation is actually complete, not just technically shipped.",
    results:
      "Used as the lens behind every project on this page — the technically hardest build still fails as a transformation if the process around it doesn't change or the org isn't structured to sustain it.",
    images: ["/project-media/trifecta/trifecta-of-transformation.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — strategy framework, not software",
  },
  {
    eyebrow: "Claude Skill — methodology",
    category: "Claude Skill",
    name: "Five-Doc Framework",
    problemShort:
      "AI-assisted builders jump straight into building, then find out mid-build that no one defined success or how the pieces connect.",
    solutionShort:
      "A self-authored, mandatory five-document sequence (PRD, System Design, UI/UX, Feature Breakdown, Master Prompt), written in order before any building starts.",
    resultShort:
      "Less-technical builders ship working Claude agents without skipping the thinking an experienced engineer does in their head.",
    stackLine: "PRD → System Design → UI/UX → Feature Breakdown → Master Prompt",
    description:
      "A mandatory five-document planning sequence, self-authored, that lets less-technical builders ship working Claude agents without skipping the thinking.",
    problem:
      "Less-technical builders — and AI-assisted builders in general — tend to jump straight into code or configuration, then discover mid-build that **no one ever defined what success looks like or how the pieces are supposed to connect**.",
    solution:
      "Authored a mandatory five-document planning sequence — PRD, System Design, UI/UX Wireframe, Feature Breakdown, and a Master Prompt — that has to be written and reviewed, **in that order, before any building starts**. Each document has required sections; the PRD alone forces an explicit What, Why, Who, success criteria, and out-of-scope list before anything else happens.",
    results:
      "Lets someone without a deep technical background **ship a working Claude agent without skipping the thinking** that usually only happens inside an experienced engineer's head.",
    images: ["/project-media/five-doc-framework/five-doc-framework-overview.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$17/mo shared*",
  },
];

const categories = [
  "All",
  "Web App",
  "Claude Agent",
  "n8n Automation",
  "Python",
];

const otherProjects: Project[] = [
  {
    category: "Web App",
    eyebrow: "Web App",
    name: "RevOps Recruit",
    problemShort:
      "A boutique GTM/RevOps recruiting venture needs a credible front door before it can take on candidates or clients.",
    solutionShort:
      "Built a Next.js candidate-intake site, a LinkedIn company page, and a brand: \"Precisely Placed,\" with a bullseye logo.",
    resultShort:
      "Site, brand, and positioning are built. Early stage and not in market yet.",
    description:
      "Boutique GTM/RevOps recruiting site — Next.js, referral-network directory.",
    problem:
      "A boutique GTM/RevOps recruiting concept needs a real front door before it can take on candidates or clients — an idea alone doesn't establish credibility.",
    solution:
      "Built a candidate-intake site and a LinkedIn company presence to give the venture a real front door, with a completed brand mark — **\"Precisely Placed,\" a bullseye logo** — finalized after evaluating four design concepts and choosing one direction.",
    results:
      "A functioning intake site and a defined brand identity in place — early-stage and not yet in market, but with the foundational pieces (site, brand, positioning) built rather than still undecided.",
    images: ["/project-media/revops-recruit/revops-recruit-home.jpg"],
    liveUrl: "https://revops-recruit.vercel.app/",
    badge: "try",
    badgeLabel: "Try it — live link",
    cost: "$0/mo",
  },
  {
    category: "Web App",
    eyebrow: "Web App",
    name: "Meeting Types",
    problemShort:
      "Generic scheduling links treat a 30-minute discovery call and a full product demo the same way.",
    solutionShort:
      "A Flask app with distinct meeting types, where every booking creates a Zoom meeting, a calendar event, and a Salesforce activity.",
    resultShort:
      "A working end-to-end booking flow, with Zoom, Calendar, and Salesforce mocked as a proof of concept for now.",
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
    name: "Aeroscout",
    problemShort:
      "Solo trip research means juggling sites and price trackers, and most travel AI assumes you want it to book for you.",
    solutionShort:
      "A research agent that finds affordable flights and hotels and the best time to buy, with an itinerary only when I ask for one.",
    resultShort:
      "Timing and pricing guidance with zero booking or payment access, by design. It can tell me when to buy, but it can never buy.",
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
    category: "n8n Automation",
    eyebrow: "n8n Automation — built at BILL",
    name: "Enablement Deck Automation",
    problemShort:
      "Enablement took every form entry and did the rest by hand: writing tailored messaging slide by slide, then copying from the master deck into each business unit's deck.",
    solutionShort:
      "I saw her unanswered question in a channel and offered to help, then added an n8n step that uses AI to improve each entry before it lands on the master deck.",
    resultShort:
      "The tailored messaging and business-unit deck updates now happen automatically instead of slide by slide, copy-paste by copy-paste.",
    stackLine:
      "Form → Google Sheet (Apps Script) → n8n + AI text enhancement → master Google Slides deck → each business unit's deck",
    description:
      "Extended a colleague's form-to-Google-Slides automation with an n8n step that uses AI to enhance what people enter.",
    problem:
      "Before any automation, Enablement took each form entry and did everything by hand: writing the tailored messaging slide by slide, then copying and pasting from the master deck into every business unit deck that needed it. A colleague at BILL had built a form that fed a Google Sheet through Apps Script, which triggered a master Google Slides deck and pushed it out to each business unit's own deck. It worked, but the slide text was whatever people typed into the form.",
    solution:
      "It started when I saw her question go unanswered in a channel and asked if she still needed help. She had the vision; I had the tools and wanted the practice. Once the form data landed in the spreadsheet, **I used n8n and AI to enhance what people had entered, then replaced the text on the appropriate slide in the master deck.**",
    results:
      "**The tailored messaging and the business-unit deck updates now happen automatically instead of by hand.** Because this was built inside BILL, I can't share the actual screenshots or a recording — the diagram above is a generic recreation of the workflow shape, not the real thing. What I can share is the lesson: **the barrier to helping someone with AI automation is low enough that “I saw your message and wanted to try” is a legitimate way in.** No project plan or 10,000 hours as an SME, just curiosity and a willingness to dig in.",
    images: ["/project-media/enablement-deck-automation/enablement-deck-automation.png"],
    imageFit: "contain",
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "N/A — employer-covered",
  },
  {
    category: "n8n Automation",
    eyebrow: "n8n Automation",
    name: "TOFU Lead-Routing Pipeline",
    problemShort:
      "Enriching, scoring, and routing inbound leads by hand is a repetitive, error-prone chain of lookups and copy-paste.",
    solutionShort:
      "An n8n workflow: intake → Hunter.io enrichment → Claude ICP scoring → routing → CRM write-back → nurture handoff.",
    resultShort:
      "Every lead is enriched, scored, and routed the moment it lands, on free and low-cost tiers instead of a paid stack.",
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
    name: "Syncly",
    problemShort:
      "My consulting meetings and personal life lived in two calendars, so I had to check both and could easily double-book.",
    solutionShort:
      "A Python script on the Google Calendar API (OAuth2) that copies consulting events one-way into my personal calendar, 30 days ahead.",
    resultShort:
      "Everything sits side by side in one calendar, so I see conflicts up front. Runs locally at no cost.",
    description: "Python calendar sync: my consulting schedule and personal life in one calendar.",
    problem:
      "During a consulting engagement, my work meetings lived in one calendar and everything else in another. Knowing what my day actually looked like meant checking two places, and it was easy to double-book myself because I couldn't see both sides at once. I do my best work when my whole schedule is visible in one place, and that setup didn't give me that.",
    solution:
      "Built an OAuth2-authenticated Python script against the Google Calendar API that reads events from my consulting calendar and inserts them into my personal calendar, so **everything shows up in the one place I already look**. It's one-way (it only reads from the consulting calendar and only writes to my personal one), works over a rolling window from yesterday through the next 30 days, and checks the target calendar before inserting each event.",
    results:
      "I ran it regularly, and it did the job: **my consulting meetings and personal commitments finally sat side by side in one calendar**, so I could see conflicts up front instead of discovering them later. It runs locally, so it costs nothing to operate.",
    images: ["/project-media/syncly/syncly-first-run-demo.png"],
    badge: "explain",
    badgeLabel: "Explain it",
    cost: "$0/mo",
  },
  {
    category: "Python",
    eyebrow: "Python — desktop app",
    name: "Expense Tracker (Reimbursement)",
    problemShort:
      "Reimbursement reports typed by hand into a spreadsheet end up with inconsistent dates, amounts, and categories.",
    solutionShort:
      "A Python/tkinter desktop app with category drop-downs and date and amount checks that saves straight to Excel. Vibe-coded with ChatGPT in 2024.",
    resultShort:
      "Vibe coding got a first version fast, then endless fix-one-thing, break-another loops. The lesson: learn and understand the code, don't just rely on it.",
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
    problemShort:
      "My recipes are scattered across Paprika 3, AnyImport, HelloFresh, websites, and saved reels and TikToks, and most recipe apps charge a fee.",
    solutionShort:
      "A Python (PyQt5) desktop app: paste a recipe from a web page into a form, and one click saves it as a formatted Word document.",
    resultShort:
      "In the demo, a recipe goes from a web page to a saved Word document in one click. A first step: imports are manual for now, with reels, TikToks, and recipe sites as the long-term goal.",
    description:
      "A small desktop app that turns a recipe copied from a web page into a saved Word document: paste it into a form, click Save.",
    problem:
      "My recipes live everywhere: Paprika 3, AnyImport, HelloFresh, recipe websites, and saved Facebook and Instagram reels and TikToks. Most recipe apps charge a fee, and none of them let me pull everything into one place and organize it like my own recipe book. **Having my own app means one free, central home for every recipe I want to keep.**",
    solution:
      "Built a desktop app in Python with PyQt5. A form takes a recipe's name, source, cooking time, nutrition facts, ingredients and instructions, most of it copied straight from a web page. **One click on Save Recipe writes it out as a formatted Word document** (using python-docx) in a `new_recipes` folder and shows a pop-up confirming it was saved.",
    results:
      "**In the demo, one recipe goes from a web page to a saved Word document in a single click.** I paste in the name, source, cooking time, nutrition facts, ingredients and instructions for a peanut butter cookie recipe, click Save Recipe, and the finished document appears in the project folder with the title, source, cooking time, nutrition facts, ingredients and directions laid out on the page. **It was never finished: so far it only imports recipes pasted in by hand.** The long-term plan is importing straight from Facebook and Instagram reels, TikToks, and recipe sites into one organized, free recipe book.",
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
  "Claude Skills",
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
  const [activeCase, setActiveCase] = useState(0);
  const [activeFramework, setActiveFramework] = useState(0);

  // Switch case study; if the reader has scrolled past the top of the section,
  // bring them back to the start of the new one so they begin at its title.
  const goToCase = (i: number) => {
    const n = flagshipProjects.length;
    setActiveCase(((i % n) + n) % n);
    const el = document.getElementById("projects");
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Same pattern as goToCase, for the Frameworks & Strategy carousel.
  const goToFramework = (i: number) => {
    const n = frameworkProjects.length;
    setActiveFramework(((i % n) + n) % n);
    const el = document.getElementById("frameworks");
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // On-page anchor links (nav's Projects / Skills / Contact) jump to the
  // target immediately, but project screenshots and demo videos further
  // down are still loading at that point. As they finish loading and the
  // page grows, whatever we jumped to slides further down than where we
  // landed. Re-run the jump a few times shortly after, so it settles on
  // the right spot instead of stranding you wherever the page happened to
  // be at click time.
  useEffect(() => {
    const runSettlePass = (id: string) => {
      const scrollNow = () => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      };
      scrollNow();
      const timers = [150, 400, 900, 1600].map((delay) =>
        window.setTimeout(scrollNow, delay)
      );
      return () => timers.forEach((t) => window.clearTimeout(t));
    };

    let cleanupPass: (() => void) | undefined;

    if (window.location.hash) {
      cleanupPass = runSettlePass(window.location.hash.slice(1));
    }

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest(
        "a[href*='#']"
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      cleanupPass?.();
      cleanupPass = runSettlePass(url.hash.slice(1));
    };
    document.addEventListener("click", onClick);

    return () => {
      cleanupPass?.();
      document.removeEventListener("click", onClick);
    };
  }, []);

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

  const renderPsrCompact = (project: Project) => {
    const rows: [string, string | undefined][] = [
      ["Problem", project.problemShort],
      ["Solution", project.solutionShort],
      ["Result", project.resultShort],
    ];
    if (!rows.some(([, t]) => t)) return null;
    return (
      <div className="psr-compact">
        {rows.map(([label, text]) =>
          text ? (
            <div key={label} className="psr-compact-row" data-kind={label.toLowerCase()}>
              <span className="mono psr-compact-label">{label}</span>
              <p>{text}</p>
            </div>
          ) : null
        )}
      </div>
    );
  };

  const renderProjectExtras = (project: Project, extraImages: string[] = []) => {
    const isExpanded = expanded.includes(project.name);
    const hasCaseStudy = project.problem || project.solution || project.results;
    return (
      <>
        {project.liveUrl && (
          <a
            className="feature-link"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit the live site ↗
          </a>
        )}
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
        {project.credit && (
          <p className="case-study-credit">
            {project.credit.text}{" "}
            <a href={project.credit.url} target="_blank" rel="noopener noreferrer">
              {project.credit.linkText}
            </a>
            .
          </p>
        )}
        {hasCaseStudy && (
          <>
            <button
              type="button"
              className="read-more-btn"
              onClick={() => toggleExpanded(project.name)}
            >
              {isExpanded ? "Show less ↑" : "Read the full case study ↓"}
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
          <div className="mono text-[18px] font-semibold tracking-wide">
            WENDY LAMPERT <span className="text-[var(--muted)]">/ portfolio</span>
          </div>
          <SiteNav />
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-6 py-12 sm:px-10 lg:px-14">
        <section className="hero mb-8">
          <div className="hero-top">
            <img
              src="/wendy-about-photo.jpg"
              alt="Wendy Lampert at her desk, mid-build"
              className="hero-photo"
            />
            <div className="hero-text">
          <p className="hero-intro">Hi, I&apos;m Wendy Lampert, GTM Engineer.</p>
          <h1 className="hero-title">RevOps depth, shipped in code.</h1>
          <p className="hero-sub">
            I spent a decade inside the revenue problems. Now I write the code that fixes them.
          </p>
            </div>
          </div>
          <ul className="hero-beliefs">
            <li>
              <strong>Process first, code second.</strong> Every build starts as a
              plain-English outline before a line of code.
            </li>
            <li>
              <strong>I don&apos;t outsource, I offload.</strong> Claude helps me think
              through problems. It doesn&apos;t think for me.
            </li>
            <li>
              <strong>A hammer, not a toolbox.</strong> Knowing when AI is the wrong tool
              is half the job.
            </li>
            <li>
              <strong>Built from real problems.</strong> Something I hit doing the work, or
              built the hard way to learn it.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <div className="wire roi-box p-6 sm:p-7">
            <div className="mono mb-2 text-[13px] uppercase tracking-wide text-[var(--note)]">
              What I spend vs. what it&apos;s worth
            </div>
            <div className="roi-headline">
              What the ROI would look like: <span className="mono">~$3.8K/mo</span> in time saved.
            </div>
            <div className="roi-subhead">
              Generated from a <span className="mono">$17/mo</span> tool bill &mdash; my
              entire cost for every project on this page.
            </div>
            <p className="mt-3 text-[17px] leading-relaxed text-[var(--muted)]">
              One Claude subscription; everything else is free or open source. Time saved is
              measured for Route Detective, the Job Search Pipeline, and the Enablement Deck
              Automation, estimated for five more, and priced at market medians (BLS,
              Glassdoor) for whoever normally does that work.
            </p>
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
                        <td>Enablement Deck Automation</td>
                        <td>SDR base, $31/hr</td>
                        <td>~43 (stated, 10+ hrs/wk)</td>
                        <td className="num">$1,343</td>
                      </tr>
                      <tr>
                        <td>Syncly</td>
                        <td>Admin Assistant, $23/hr</td>
                        <td>~4 (est.)</td>
                        <td className="num">$93</td>
                      </tr>
                      <tr className="roi-total">
                        <td colSpan={3}>Total</td>
                        <td className="num">~$3,816</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="roi-footnote">
                    Route Detective, Job Search Pipeline, and Enablement Deck Automation hours are
                    stated (Enablement at 10+ hrs/week, converted to a monthly figure); every
                    other hours figure is my own reasonable estimate, not measured. Not included: TOFU Lead-Routing Pipeline (its ROI is
                    tool-cost avoidance — running on free/low-cost tiers instead of a paid
                    enrichment + orchestration stack — not hours, and I don&apos;t have
                    reliable figures for what was actually running to price that out yet),
                    and two early-stage prototypes not yet in production use (RevOps
                    Recruit, Meeting Types).
                  </p>
                </div>
              )}
          </div>
        </section>

        <section id="projects" className="mb-12">
          <h2 className="section-title"><span className="section-num">01</span>Technical Case Studies</h2>
          {(() => {
            const project = flagshipProjects[activeCase];
            const isRowLayout = project.imageLayout === "row";
            const heroImage = project.images && project.images.length > 0 ? project.images[0] : undefined;
            const psr: [string, string | undefined][] = [
              ["Problem", project.problemShort],
              ["Solution", project.solutionShort],
              ["Result", project.resultShort],
            ];
            const nextProject = flagshipProjects[(activeCase + 1) % flagshipProjects.length];
            return (
              <div className="case-carousel">
              <button
                type="button"
                className="case-arrow case-arrow-side case-arrow-prev"
                aria-label="Previous case study"
                onClick={() => goToCase(activeCase - 1)}
              >
                ←
              </button>
              <button
                type="button"
                className="case-arrow case-arrow-side case-arrow-next"
                aria-label="Next case study"
                onClick={() => goToCase(activeCase + 1)}
              >
                →
              </button>
              <div key={project.name} className="wire flagship-card case-slide">
                <div className="case-slide-top">
                  <div className="case-slide-intro">
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
                    <p className="desc">{project.description}</p>
                    <div className="stack-line">{project.stackLine}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                      <span className="cost-tag">{project.cost}</span>
                    </div>
                  </div>
                  <div className="case-slide-media">
                    {project.video ? (
                      <video
                        className="demo-video"
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={project.videoAlt}
                        src={project.video}
                        style={{ aspectRatio: "1512 / 1182" }}
                      />
                    ) : isRowLayout && project.images ? (
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
                    ) : heroImage ? (
                      <button
                        type="button"
                        className="card-hero-image-btn"
                        onClick={() => setLightboxSrc(heroImage)}
                      >
                        <img src={heroImage} alt={`${project.name} preview`} />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="psr-grid">
                  {psr.map(([label, text]) =>
                    text ? (
                      <div key={label} className="psr-tile" data-kind={label.toLowerCase()}>
                        <div className="mono psr-label">{label}</div>
                        <p>{text}</p>
                      </div>
                    ) : null
                  )}
                </div>
                <div className="case-slide-more">{renderProjectExtras(project, [])}</div>
                <button
                  type="button"
                  className="case-next-btn"
                  onClick={() => goToCase(activeCase + 1)}
                >
                  {activeCase === flagshipProjects.length - 1 ? "Back to the first case study" : "Next case study"}:{" "}
                  <strong>{nextProject.name}</strong> →
                </button>
              </div>
              <div className="case-dots-row">
                <button
                  type="button"
                  className="case-arrow case-arrow-inline"
                  aria-label="Previous case study"
                  onClick={() => goToCase(activeCase - 1)}
                >
                  ←
                </button>
                <div className="case-dots" role="tablist" aria-label="Technical case studies">
                  {flagshipProjects.map((p, i) => (
                    <button
                      key={p.name}
                      type="button"
                      role="tab"
                      aria-selected={i === activeCase}
                      aria-label={`Case study ${i + 1}: ${p.name}`}
                      className="case-dot"
                      onClick={() => goToCase(i)}
                    />
                  ))}
                </div>
                <span className="mono case-count">
                  {activeCase + 1} of {flagshipProjects.length}
                </span>
                <button
                  type="button"
                  className="case-arrow case-arrow-inline"
                  aria-label="Next case study"
                  onClick={() => goToCase(activeCase + 1)}
                >
                  →
                </button>
              </div>
              </div>
            );
          })()}
        </section>

        <section id="frameworks" className="mb-12">
          <h2 className="section-title"><span className="section-num">02</span>Frameworks &amp; Strategy</h2>
          <p className="section-intro">The lenses I actually use to decide what gets built, in what order, and whether the portfolio is balanced once it is.</p>
          {(() => {
            const project = frameworkProjects[activeFramework];
            const heroImage = project.images && project.images.length > 0 ? project.images[0] : undefined;
            const extraImages = project.images && project.images.length > 1 ? project.images.slice(1) : [];
            const nextFramework = frameworkProjects[(activeFramework + 1) % frameworkProjects.length];
            return (
              <div className="case-carousel frameworks-grid">
                <button
                  type="button"
                  className="case-arrow case-arrow-side case-arrow-prev"
                  aria-label="Previous framework"
                  onClick={() => goToFramework(activeFramework - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="case-arrow case-arrow-side case-arrow-next"
                  aria-label="Next framework"
                  onClick={() => goToFramework(activeFramework + 1)}
                >
                  →
                </button>
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
                    {renderPsrCompact(project)}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badgeClass[project.badge]}>{project.badgeLabel}</span>
                      <span className="cost-tag">{project.cost}</span>
                    </div>
                    {renderProjectExtras(project, extraImages)}
                    <button
                      type="button"
                      className="case-next-btn"
                      onClick={() => goToFramework(activeFramework + 1)}
                    >
                      {activeFramework === frameworkProjects.length - 1 ? "Back to the first framework" : "Next framework"}:{" "}
                      <strong>{nextFramework.name}</strong> →
                    </button>
                  </div>
                </div>
                <div className="case-dots-row">
                  <button
                    type="button"
                    className="case-arrow case-arrow-inline"
                    aria-label="Previous framework"
                    onClick={() => goToFramework(activeFramework - 1)}
                  >
                    ←
                  </button>
                  <div className="case-dots" role="tablist" aria-label="Frameworks and strategy">
                    {frameworkProjects.map((p, i) => (
                      <button
                        key={p.name}
                        type="button"
                        role="tab"
                        aria-selected={i === activeFramework}
                        aria-label={`Framework ${i + 1}: ${p.name}`}
                        className="case-dot"
                        onClick={() => goToFramework(i)}
                      />
                    ))}
                  </div>
                  <span className="mono case-count">
                    {activeFramework + 1} of {frameworkProjects.length}
                  </span>
                  <button
                    type="button"
                    className="case-arrow case-arrow-inline"
                    aria-label="Next framework"
                    onClick={() => goToFramework(activeFramework + 1)}
                  >
                    →
                  </button>
                </div>
              </div>
            );
          })()}
        </section>

        <section className="mb-12">
          <h2 className="section-title"><span className="section-num">03</span>Other Technical Builds</h2>
          <p className="section-intro">Smaller tools and earlier builds — filter by how they were made below.</p>
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
                <div
                  key={project.name}
                  className={`wire card${
                    project.video || project.imageFit === "contain" ? " sm:col-span-2" : ""
                  }`}
                >
                  {!project.noHero && (
                  <div
                    className={
                      project.video
                        ? "card-hero card-hero-video"
                        : project.imageFit === "contain"
                        ? "card-hero card-hero-contain"
                        : "card-hero"
                    }
                  >
                    {project.video ? (
                      <video
                        className="demo-video"
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={project.videoAlt}
                        src={project.video}
                        style={{ aspectRatio: "1920 / 1080" }}
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
                    {renderPsrCompact(project)}
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

        <section id="about" className="mb-12">
          <h2 className="section-title"><span className="section-num">04</span>About me</h2>
          <div className="wire p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div>
                <h3 className="mb-3 text-2xl font-semibold leading-tight">Running Revenue to Coding It</h3>
                <div className="lg:columns-2 lg:gap-12">
                  <p className="mb-3 text-[18px] leading-relaxed">
                    I am a GTM Engineer who spent the last decade in Sales &amp; Revenue
                    Operations, bridging deep operational experience with hands-on backend
                    software development.
                  </p>
                  <p className="mb-3 text-[18px] leading-relaxed">
                    Having solved high-stakes scale problems, I bring the discipline of process
                    design directly into code. I build production-grade automations and software
                    using Python, n8n, and LLMs: designed with pseudocode first, tested end to
                    end, and engineered to solve root data and scale bottlenecks.
                  </p>
                  <p className="mb-3 text-[18px] leading-relaxed">
                    I lean on Claude to think through problems with me, not to think for me:
                    pointing me to the right documentation, helping me troubleshoot, working
                    through a decision out loud. Never shipping something I don&apos;t understand,
                    or wondering whether it&apos;s architecturally sound, secure, or even the right
                    tool for the job.
                  </p>
                  <p className="mb-3 text-[18px] leading-relaxed">
                    Every project on this page is either a real problem I hit doing the work, or
                    one I built on my own to learn something the hard way, line by line, instead
                    of vibe-coding past the parts most people skip. There is one exception, and it
                    taught me exactly why vibe coding is not the right approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="section-title"><span className="section-num">05</span>Features</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {featuredIn.map((feature) => {
              const text = (
                <>
                  <span className="eyebrow">{feature.publication}</span>
                  <h4 className="mb-2 mt-1 text-[19px] font-semibold">{feature.title}</h4>
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
          <h2 className="section-title"><span className="section-num">06</span>Skills &amp; Tools</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="contact-footer mt-8 px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
        <div className="mx-auto max-w-[1360px]">
          <div className="contact-eyebrow">Get in touch</div>
          <h2 className="mb-3 text-4xl font-semibold leading-tight">Contact</h2>
          <p className="contact-body mb-7 max-w-[520px] text-[18.5px] leading-relaxed">
            Open to conversations about GTM engineering, RevOps, and roles where
            building real tools is part of the job.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:lampertwb@gmail.com" className="contact-link">
              lampertwb@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/lampertwb/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              linkedin.com/in/lampertwb
            </a>
          </div>
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
