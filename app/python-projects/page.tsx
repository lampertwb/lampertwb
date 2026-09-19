import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";
import Tracker from "./tracker";
import { courseTitle, projects } from "./projects";

export const metadata: Metadata = {
  title: "Python Projects — Wendy Lampert",
  description:
    "Progress tracker for 20 hands-on Python apps, with full write-ups for the finished builds.",
};

export default function PythonProjectsPage() {
  const total = projects.length;
  const completed = projects.filter((p) => p.status === "complete").length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--wire-strong)] bg-[var(--background)]">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10 lg:px-14">
          <Link href="/" className="mono text-[15px] font-semibold tracking-wide">
            WENDY LAMPERT <span className="text-[var(--muted)]">/ python projects</span>
          </Link>
          <SiteNav current="python" />
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-6 py-12 sm:px-10 lg:px-14">
        <section className="mb-10">
          <div className="wire p-7">
            <h1 className="mb-2 text-3xl font-semibold leading-tight">
              20 Python apps, built hands-on
            </h1>
            <p className="mb-5 text-[var(--muted)]">
              I am working through the 20 apps in {courseTitle} (Ardit Sulce, on
              Udemy). I am not going strictly in course order: finished builds get
              a full write-up below, and the rest are queued as pending.
            </p>
            <div className="mono mb-2 text-[13px] font-semibold">
              {completed} of {total} apps complete
            </div>
            <div
              className="tracker-progress"
              role="progressbar"
              aria-label="Apps completed"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={completed}
            >
              <div className="tracker-progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </section>

        <Tracker />
      </main>
    </div>
  );
}
