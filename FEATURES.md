# Portfolio Site — Feature Log

Running record of every feature/section built, most recent first. Update this file whenever new features ship — don't just rely on a session handoff — so any new session (or you) can see the full build history in one place without re-deriving it from git log or old chats.

## 2026-09-19 — Python projects tracker page (`/python-projects`)
uncommitted

- New route `app/python-projects/` (`page.tsx`, `tracker.tsx`, `projects.ts`) tracking all 20 apps from the Udemy course "Python Mega Course: Build 20 Real-World Apps and AI Agents" (Ardit Sulce). App numbers and section ranges follow the course's *current* curriculum.
- Sticky left sidebar with a status dot per app (mobile: collapses into a "Jump to an app" dropdown), All / Complete / Pending filter chips, and a progress bar ("2 of 20 apps complete").
- Reuses the existing design system: `.wire` cards, `.card-hero` placeholder tiles (python / agent / automation / web), `.badge` status pills, and the Problem / Solution / Results case-study blocks.
- Complete: App 3 (Email News Digest, the News_API project) and App 4 (Weather Data API), both with case-study write-ups (venv/migration debugging intentionally left out of the copy). Apps 1, 2, 5-20 are Pending placeholders.
- To mark an app done: in `projects.ts` set `status: "complete"` and add `problem` / `solution` / `results`.
- Home page header nav now has a "Python" link to `/python-projects` (`app/page.tsx`).
- Status markers: 20px circles in the sidebar, filled green with a check mark for Complete, hollow for Pending; Complete names are bold green and the card badge reads "✓ Complete".
- Case studies support an optional `iteration` field (rendered as an amber "Iteration" block after Results). App 3 uses it for the 2-years-later Claude iteration (URL-query filtering, HTML email, cron); the Problem/Solution/Results text focuses on what the project does and what the course teaches.
- Numbering note: the repo folder `python-projects/app6-weather-api` and commit d2a3039 use the older course numbering (app 6); the current course lists Weather API as App 4.

## 2026-09-18 — ROI rework, full case studies, image-first redesign, About section
commit `73a7bcf`

- ROI section rebuilt using sourced external market-rate methodology (BLS Occupational Outlook Handbook, Glassdoor) instead of Wendy's own hourly rate. Personal salary math permanently removed — this is a hard privacy rule, not a style choice.
- "See the math" expandable panel added under the ROI box: full per-project rate/hours/dollar table plus sourced links.
- Problem / Solution / Results case-study structure extended to all 13 projects (previously only Route Detective had it).
- Card layout redesigned: every card now leads with a full-bleed image at the top (`.card-hero`).
  - Job Search Pipeline and TOFU use real screenshots as the hero image.
  - The other 11 projects get a color-coded placeholder tile (`.card-hero-placeholder`, categories: python / agent / artifact / automation / web / skill) instead of a blank box.
  - Text below the image is now just title + one-line description; full detail lives behind "Read the case study."
- Hero tagline added: "RevOps depth, shipped in code."
- New "About" section added below the hero (heading: "Running Revenue to Coding It") — three paragraphs grounded in Wendy's resume, covering her RevOps career arc and how she actually works with AI (see Positioning Rules below).
- git identity configured for this repo (Wendy Lampert / lampertwb@gmail.com) — was previously unset, blocked the first commit attempt.

## 2026-09-16 — Route Detective flagship promotion + award banner
commit `e091814`

- Route Detective promoted to a flagship project.
- Award banner added: "Intelligent GTM Orchestration Award — Nominated Finalist" with a custom hand-drawn medal icon (`MedalIcon` component).
- Case-study bold-text convention established: bold spans must form a complete, readable story on their own — never bold an isolated number or keyword.

## 2026-09-16 — Job Search Pipeline rework
commit `7495e9d`

- Job Search Pipeline case study rewritten around ICP framing and ATS Navigator risk detail.
- In-page lightbox added for project screenshots (click image → full-size overlay, click anywhere to close) — replaces opening images in a new tab.

## 2026-09-16 — Contrast + image/case-study rendering
commit `e42d5cd`

- Color contrast increased site-wide.
- Image and case-study rendering added to project cards for the first time.

## 2026-09-16 — Site structure
commit `5c16ab3`

- Core page structure built: header, flagship section, filterable "everything else" grid (category chips), skills strip, footer.

## 2026-09-16 — Initial content
commit `5a9b83a`

- Name and headline added to the homepage for the first time.

---

## Positioning rules (not features, but govern all future copy — read before writing any case study or bio text)

- Core differentiator: unlike most GTM Engineers who vibe-code or lean on no-code/AI-output tools (e.g. Clay), Wendy writes production Python from scratch, makes real architectural/language decisions, and solves problems beyond what off-the-shelf GTM tooling addresses.
- AI-collaboration framing: not "no AI" — she uses Claude, but as a guide/troubleshooting partner ("I lean on Claude to think through problems with me, not to think for me"), never as an executor that ships things she doesn't understand. "Claude is a hammer, not a toolbox."
- Wendy's own salary and any salary-derived calculation must never appear on the site, ever.
- Resume-grounded facts to keep precise: BILL Enterprise segment, B2B/B2B2B/partnership channel motions; the BILL routing project was a data-integrity fix, not literally "the lead lifecycle"; the enablement comms-deck automation was built with the Enablement team, not solo; Apex Fintech — she also defined the GTM strategy there, in addition to the tech-stack consolidation; Diamond Resorts — bottom to 3rd overall company-wide AND #1/top-performing in in-house sales specifically.

## Open / not yet built

- Real photo for the About section — undecided.
- BILL-internal framework/philosophy jargon from her resume — currently omitted from public copy, not explicitly confirmed either way.
- Python Udemy Course and Python Project of the Day — to be pushed to GitHub and linked from the site. Course material located (News_API in `Python_import/News_API`, Weather API in `python-projects/app6-weather-api`); tracker page built (see 2026-09-19); still to do: GitHub push.
- System/workflow diagrams (Miro-style) as a replacement for the 11 category-placeholder tiles — deferred.
