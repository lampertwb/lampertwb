# Portfolio Site — Feature Log

Running record of every feature/section built, most recent first. Update this file whenever new features ship — don't just rely on a session handoff — so any new session (or you) can see the full build history in one place without re-deriving it from git log or old chats.

## 2026-09-19 — App 5 (Weather Forecast Dashboard) screenshot on tracker card

- App 5's "Up next" card on `/python-projects` now shows a real screenshot instead of the colored placeholder tile. The screenshot is of the Streamlit + Plotly forecast dashboard as it currently runs (place = Tirana, 2 forecast days, Temperature chart), saved as `public/project-media/weather-dashboard/weather-forecast-dashboard.png`.
- This is a stand-in visual until the script is finalized. App 5 stays `status: "pending"`; it is not marked Complete and has no write-up yet.
- Code: `TrackerProject` gained an optional `image: { src, alt }` field (`projects.ts`); `PendingCard` in `tracker.tsx` renders it when present and falls back to the placeholder tile otherwise; `.card-hero-shot` in `globals.css` crops the portrait screenshot into the 16:9 tile, anchored on the chart (`object-position: center 82%`). Any pending app can now take a real screenshot the same way.
- Logged for later: a "Try it out" link on this card (see Open / not yet built).

## 2026-09-19 — Python projects tracker page (`/python-projects`), wide layout, live demos
commits `b310801` (first pass), `11b8768` (nav, wide layout, demos), `ef20079` (Weather demo replaced with annotated screenshots)

- New route `app/python-projects/` (`page.tsx`, `tracker.tsx`, `projects.ts`, `showcase.tsx` (email demo), `weather-showcase.tsx`, `demo-dialog.tsx`) tracking all 20 apps from the Udemy course "Python Mega Course: Build 20 Real-World Apps and AI Agents" (Ardit Sulce). App numbers and section ranges follow the course's *current* curriculum.
- Layout: sticky left sidebar with check-mark status markers (filled green = Complete, hollow = Pending; mobile collapses to a "Jump to an app" dropdown), All / Complete / Pending filter chips, progress bar. Finished apps are "Built" showcase cards (live demo left, description + fact tags + collapsed write-up right); pending apps are "Up next" cards in a 3-column grid with the site's colored placeholder tiles.
- Complete: App 3 (Email News Digest, the News_API project) and App 4 (Weather Data API). To mark another app done: set `status: "complete"` in `projects.ts`, add `problem` / `solution` / `results` (+ optional `iteration`, `facts`, `demo`).
- Email demo (App 3): card shows a live scaled preview of the real digest; click opens a modal styled like an email client (subject, sender, all 10 stories scrollable, "What to notice" notes). Source is the real .eml body, saved as `public/project-media/news-digest-sample.html` (Gmail address is not in the body and is not shown). Story images are hotlinked from the publishers, as in the original email.
- Weather demo (App 4): the card previews the real home page of her Flask app (screenshot). Click opens a walkthrough of four real screenshots of the app's own output for station 1 (home page, one date, one year, all dates), each with a plain-English caption, the web address, and the `@app.route(...)` line from her main.py that answers it. The screenshots were taken from her unmodified main.py and data_small, in `public/project-media/weather-app/`. An earlier interactive explorer (browser-side port of the API plus plain-language answers) was built and then removed on 2026-09-19 because she didn't build the interface and couldn't vouch for its code; the removed files are parked in `_to_delete/` (untracked) and can be deleted.
- Site-wide: containers widened from 768px to 1360px on the home page and the tracker; home About section is two columns on large screens; Technical Builds grid is 3 columns on large screens.
- Nav (`app/site-nav.tsx`): Projects, Python, Skills and Contact are all real links (section anchors `#projects`, `#skills`, `#contact` plus the `/python-projects` route) on both pages. The Contact target is still the footer placeholder.
- Case studies support an optional `iteration` field (amber "Iteration" block after Results). App 3's copy focuses on what the project does and what the course teaches.
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
- **"Try it out" link on App 5 (Weather Forecast Dashboard):** once the script is finalized, add a "Try it out" link on the App 5 card that opens the running app. Needs: (1) the finished script, (2) a public host for the Streamlit app (e.g. Streamlit Community Cloud) since the portfolio site is Next.js and cannot run it, (3) a `tryItOutUrl?: string` field on `TrackerProject` and a button on the card that renders only when set. Then swap the stand-in screenshot for a final one and mark App 5 Complete with problem/solution/results. Consider the same link for other apps that end up hosted.
- System/workflow diagrams (Miro-style) as a replacement for the 11 category-placeholder tiles — deferred.
