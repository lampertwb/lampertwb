"use client";

import { useState } from "react";
import { projects, type TrackerProject } from "./projects";

type Filter = "all" | "complete" | "pending";

const filterLabels: Record<Filter, string> = {
  all: "All",
  complete: "Complete",
  pending: "Pending",
};

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function NavList({ items }: { items: TrackerProject[] }) {
  return (
    <ul className="tracker-nav-list">
      {items.map((p) => (
        <li key={p.slug}>
          <a className="tracker-nav-link" href={`#${p.slug}`}>
            <span
              className={`status-dot ${p.status === "complete" ? "is-complete" : ""}`}
              role="img"
              aria-label={p.status === "complete" ? "Complete" : "Pending"}
            >
              {p.status === "complete" && (
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="tracker-nav-num">{p.number}</span>
            <span className={p.status === "complete" ? "tracker-nav-name-done" : ""}>{p.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ project }: { project: TrackerProject }) {
  const done = project.status === "complete";
  const hasCaseStudy =
    project.problem || project.solution || project.results || project.iteration;

  return (
    <article
      id={project.slug}
      className={`wire card tracker-card ${done ? "tracker-card-complete" : ""}`}
    >
      <div className="card-hero">
        <div className="card-hero-placeholder" data-cat={project.category}>
          <span className="card-hero-label">{project.kind}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="eyebrow">
          App {project.number} · {project.sections}
        </div>
        <h3>{project.name}</h3>
        <span className={done ? "badge try" : "badge explain"}>
          {done ? "✓ Complete" : "Pending"}
        </span>
        <p className="desc">{project.description}</p>
        {done && hasCaseStudy && (
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
            {project.iteration && (
              <div className="case-study-block">
                <div className="case-study-label is-iteration">Iteration</div>
                <p>{renderWithBold(project.iteration)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Tracker() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = projects.filter((p) => filter === "all" || p.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects by status">
        {(Object.keys(filterLabels) as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            className="chip"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {filterLabels[key]}
          </button>
        ))}
      </div>

      <details className="tracker-mobile-nav wire">
        <summary className="mono">Jump to an app</summary>
        <NavList items={visible} />
      </details>

      <div className="tracker-layout">
        <nav className="tracker-sidebar" aria-label="Python projects">
          <div className="section-title">The 20 apps</div>
          <NavList items={visible} />
        </nav>

        <div className="tracker-grid">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
