# Portfolio Site — Feature Log

Running record of every feature/section built, most recent first. Update this file whenever new features ship — don't just rely on a session handoff — so any new session (or you) can see the full build history in one place without re-deriving it from git log or old chats.

## 2026-09-20 — Two INFUSE B2B Expert Roundup cards in 04 Features (uncommitted)

- Added two Features cards, placed before the Revenue Operators card: "Top RevOps Trends to Watch in 2023" (https://infuse.com/insight/top-revops-trends-to-watch/) and "What Is the Link Between RevOps and Client Experience?" (https://infuse.com/insight/b2b-expert-roundup-what-is-the-link-between-revops-and-client-experience/). Each shows a short verbatim quote from her contribution, checked against the live INFUSE pages (the bio on both links to her LinkedIn, so identity is confirmed). Text-only cards, no code changes.
- Not added: Jen Bergren's weekly newsletter mentions (#67, #103, #104) point at her LinkedIn posts, so they are mentions, not features. A "Top RevOps Trends to Watch in 2022" INFUSE roundup may also quote her; it could not be opened to check. A Zapier survey she took part in has not been found published.

## 2026-09-20 — Podcast highlight clip on the Revenue Operators Features card (uncommitted)

- The Revenue Operators card in 04 Features now shows a 91-second captioned highlight clip next to the text (click to play, sound on). Clip: `public/project-media/revenue-operators/podcast-highlight.mp4` (8.3 MB, 720p) with poster `podcast-highlight-poster.jpg`. It is cut from a new edit of the raw July 2024 recording (both speakers, burned-in captions) and ordered Problem, Situation, Answer: (1) the problem, no clear path or sense of identity when roles are blurred ("is this what I do?"); (2) the situation, back in 2016 when she did both sales ops and RevOps before the titles existed; (3) the answer, RevOps should define and design go-to-market while the other ops maintain it. Swapped in for a 2-deep-bench clip because that topic is already public in the LinkedIn post. It contains no show name and no employer-proprietary names. Captions were rebuilt for the clip itself (not cut from the full episode) so no caption bleeds across a cut.
- Code: `Feature` in `app/page.tsx` gained optional `video: { src, poster, alt }` and `fullEpisodeUrl`. A card with a `video` spans both grid columns (`.feature-with-video`, `.feature-video`, `.feature-text` in `globals.css`). `fullEpisodeUrl` adds a "Watch the full episode" link and renders only when set, so there is no dead link before the episode is uploaded.
- Full episode is not hosted in the repo (about 830 MB; GitHub rejects files over 100 MB). It is on YouTube: https://youtu.be/vndNmGUrdfI, set as `fullEpisodeUrl` on the card, which renders "Watch the full episode". The old LinkedIn post link (August 2024) was removed from the card. To change the link, edit `fullEpisodeUrl` in `app/page.tsx`.
- Show name settled: the show is "The Revenue Operators". The full-episode edit (v2, on the Desktop) uses that name in the title card and Garrath's lower-third, and the spoken "No Name Podcast" intro line was cut.

## 2026-09-20 — Two new Features cards + Expense Tracker (Reimbursement) build card

- 04 Features now has three cards. `Feature` in `app/page.tsx` gained an optional `url` (no link = text-only card) and a per-card `linkLabel` (the button used to be hard-coded "Read the full interview"). Cards key on `title`.
- New: **INFUSE Academy, "Sales Funnel in B2B Marketing"** links to the live course page (https://academy.infuse.com/course/sales-funnel; Wendy's original link was dead, this one was found on the INFUSE courses page). She is listed there as a featured practitioner, so the copy says "featured practitioner", not instructor, and leaves out her employer/title as listed on that page. INFUSE's promo graphic (other people's photos) was not reproduced.
- New: **The Revenue Operators podcast** links to her August 2024 LinkedIn post (tracking parameters trimmed) that shares a clip on the 2-deep bench. She is still looking for the original video file; if she finds it, replace the LinkedIn link or add a second link.
- 03 Technical Builds: new **Expense Tracker (Reimbursement)** card (category Python, badge "Explain it"). Python + tkinter desktop app built in 2024 by vibe coding with ChatGPT; screenshot at `public/project-media/reimbursement/expense-tracker.png` (her cropped screenshot; the card number in it is test data). The case study tells the lessons story in her words (infinite loops of fixing one thing and breaking another; the importance of truly learning and knowing the code). It says nothing about whether the app runs today; she plans to try to get it working again. Source is in `~/Python_import/Reimbursement/` and is not published.

## 2026-09-20 — App 12 (LangChain AI agent) complete: demo video, write-up, Flagship card

- Captioned demo video (`public/project-media/langchain-agent/langchain-todo-agent-demo.mp4`, plus an unused `.srt` copy of the captions) of the Todoist agent: four plain-English requests, two tasks added and two removed. Captions are burned into the video; intro and outro cards explain "left = Todoist, right = the AI agent." The computer-username path in the console was blurred before publishing.
- `/python-projects`: App 12 is now `status: "complete"` (3 of 20 complete) with a video in place of the placeholder tile and a full Problem / Solution / Results / Iteration write-up. Code: optional `video: { src, alt }` on `TrackerProject`; `Showcase` in `tracker.tsx` renders it; the "Read the write-up" toggle now only renders when an app has write-up text; `.demo-video` in `globals.css`.
- Home page: the Todoist AI Agent card was promoted from 03 Technical Builds to 01 Flagship (moved, not duplicated) so visitors who never open the Python tab still see it. Its copy was rewritten to match the current build (three tools on LangChain v1, was two tools on the older OpenAI-tools pattern). `Project` gained optional `video` / `videoAlt`; the flagship hero renders the video when present; `.card-hero-video` shows the full frame instead of a 16:9 crop.
- Copy history: the old card first appeared in `5c16ab3` (2026-09-16); its case study was written in `73a7bcf` (2026-09-18) against the older two-tool version.
- Confirmed history (from Wendy's Sep 19 session notes): the original course code (`source-material/todoist-ai-agent/agent.py`) used `create_openai_tools_agent` + `AgentExecutor` with add_task and show_tasks. LangChain 1.4.2 no longer includes those imports, so it was rebuilt on `create_agent`; a missing `todoist-api-python` install, a `.env` API-key problem, and a model-string problem (Vertex AI guess) were fixed along the way; `history = response["messages"]` keeps memory across turns; `remove_task` (exact-name match, checks the task off) was added with a system-prompt mention. Home and tracker copy now state memory, the course-code origin, and the v1 rebuild.

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
