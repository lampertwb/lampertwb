"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  apiRequest,
  type ApiResult,
  type Endpoint,
  type StationData,
  type StationMeta,
} from "./weather-core";

const DIGEST_SRC = "/project-media/news-digest-sample.html";

/* ------------------------------------------------------------------ */
/* Shared modal                                                        */
/* ------------------------------------------------------------------ */

function DemoDialog({
  open,
  onClose,
  title,
  kicker,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="demo-dialog"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="demo-shell">
          <header className="demo-shell-head">
            <div>
              <div className="demo-kicker">{kicker}</div>
              <h2 className="demo-title">{title}</h2>
            </div>
            <button type="button" className="demo-close" onClick={onClose}>
              Close <span aria-hidden="true">✕</span>
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Email digest                                                        */
/* ------------------------------------------------------------------ */

const emailNotes: { label: string; text: string }[] = [
  {
    label: "Subject line",
    text: "Set in code on the message object, so the digest lands with a real subject line.",
  },
  {
    label: "One email, many stories",
    text: "The script loops over the API response and builds one block per article: headline, description, image, and a link to the source.",
  },
  {
    label: "Capped at 10",
    text: "The list is sliced to the first 10 articles so the digest stays skimmable.",
  },
  {
    label: "Filtered in the URL",
    text: "English only, a whitelist of news domains, and yesterday's date are all query-string parameters on the request itself.",
  },
  {
    label: "Sent on a schedule",
    text: "Gmail SMTP over SSL, triggered by a cron job every day at 7 AM.",
  },
];

export function EmailShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="demo-window">
        <div className="demo-window-bar">
          <span className="demo-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="demo-window-title">Inbox · Python Scripted AI News Digest</span>
        </div>
        <div className="demo-email-preview">
          <iframe
            src={DIGEST_SRC}
            title="Preview of the digest email"
            tabIndex={-1}
            aria-hidden="true"
            loading="lazy"
            sandbox=""
            referrerPolicy="no-referrer"
          />
        </div>
        <button
          type="button"
          className="demo-overlay"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open the sample digest email"
        >
          <span className="demo-cta">
            <span>Open the email →</span>
            <small>scroll all 10 stories</small>
          </span>
        </button>
      </div>

      <DemoDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Python Scripted AI News Digest"
        kicker="Real email · sent by my script"
      >
        <div className="demo-shell-body email-layout">
          <div className="email-client">
            <div className="email-meta">
              <div className="email-subject">Python Scripted AI News Digest</div>
              <div className="email-from">
                <span className="email-avatar" aria-hidden="true">
                  W
                </span>
                <div className="email-from-text">
                  <span>
                    <strong>Wendy Lampert</strong> <em>sent by main.py</em>
                  </span>
                  <span className="email-to">to me</span>
                </div>
                <span className="email-date">Sat, Sep 19, 2026</span>
              </div>
            </div>
            <iframe
              className="email-frame"
              src={DIGEST_SRC}
              title="Digest email body"
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer"
            />
          </div>
          <aside className="demo-notes" aria-label="What to notice">
            <div className="demo-notes-title">What to notice</div>
            <ol>
              {emailNotes.map((note) => (
                <li key={note.label}>
                  <strong>{note.label}.</strong> {note.text}
                </li>
              ))}
            </ol>
            <p className="demo-fineprint">
              Sample digest sent Sep 19, 2026. Headlines and images belong to their publishers.
            </p>
          </aside>
        </div>
      </DemoDialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Weather API explorer                                                */
/* ------------------------------------------------------------------ */

const STATIONS: StationMeta[] = [
  { id: 1, name: "VAEXJOE", country: "SE", start: "1860-01-01", end: "2022-05-31", records: 59321 },
  { id: 5, name: "LINKOEPING-MALMSLAETT", country: "SE", start: "1858-12-01", end: "2022-05-31", records: 59717 },
  { id: 12, name: "GRAZ-UNIVERSITAET", country: "AT", start: "1894-01-01", end: "2022-05-31", records: 46902 },
  { id: 48, name: "HOHENPEISSENBERG", country: "DE", start: "1781-01-01", end: "2022-05-31", records: 88174 },
  { id: 71, name: "ARXANGEL'SK", country: "RU", start: "1881-01-01", end: "2022-05-31", records: 51650 },
];

const BASE = "http://127.0.0.1:5000";

// Real responses captured from the Flask app (main.py) for the card preview.
const PREVIEW_DATE = `{
  "date": "1988-10-25",
  "station": "1",
  "temperature": -3.9
}`;

const PREVIEW_YEAR = `[
  {
    "    DATE": "19880101",
    "   TG": 47,
    " Q_TG": 0,
    " SOUID": 35381,
    "STAID": 1
  },
  …
]`;

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function clampIso(iso: string, meta: StationMeta): string {
  if (iso < meta.start) return meta.start;
  if (iso > meta.end) return meta.end;
  return iso;
}

function YearChart({ result, station }: { result: ApiResult; station: StationMeta }) {
  const series = result.series ?? [];
  const values = series.filter((v): v is number => v !== null);
  if (values.length === 0) {
    return <div className="weather-chart-empty">No temperature readings recorded that year.</div>;
  }
  const w = 640;
  const h = 150;
  const padL = 34;
  const padR = 8;
  const padT = 10;
  const padB = 20;
  const min = Math.floor(Math.min(...values));
  const max = Math.ceil(Math.max(...values));
  const span = Math.max(max - min, 1);
  const x = (i: number) => padL + (i / Math.max(series.length - 1, 1)) * (w - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / span) * (h - padT - padB);

  const segments: string[] = [];
  let current: string[] = [];
  series.forEach((v, i) => {
    if (v === null) {
      if (current.length) segments.push(current.join(" "));
      current = [];
    } else {
      current.push(`${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    }
  });
  if (current.length) segments.push(current.join(" "));

  const monthTicks = MONTH_LABELS.map((label, m) => {
    const dayOfYear = Math.round((Date.UTC(2001, m, 1) - Date.UTC(2001, 0, 1)) / 86_400_000);
    return { label, xPos: x(Math.min(dayOfYear, series.length - 1)) };
  });

  return (
    <svg
      className="weather-chart"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Daily mean temperature at station ${station.name}, from ${min} to ${max} degrees Celsius`}
    >
      {min < 0 && max > 0 && (
        <line x1={padL} x2={w - padR} y1={y(0)} y2={y(0)} className="weather-chart-zero" />
      )}
      <text x={padL - 6} y={y(max) + 4} textAnchor="end" className="weather-chart-label">
        {max}°
      </text>
      <text x={padL - 6} y={y(min) + 4} textAnchor="end" className="weather-chart-label">
        {min}°
      </text>
      {segments.map((points, i) => (
        <polyline key={i} points={points} className="weather-chart-line" />
      ))}
      {monthTicks.map((t, i) => (
        <text key={i} x={t.xPos} y={h - 4} className="weather-chart-label">
          {t.label}
        </text>
      ))}
    </svg>
  );
}

function WeatherExplorer() {
  const [stationId, setStationId] = useState(1);
  const [endpoint, setEndpoint] = useState<Endpoint>("date");
  const [date, setDate] = useState("1988-10-25");
  const [year, setYear] = useState("1988");
  const [cache, setCache] = useState<Record<number, StationData>>({});
  const [failed, setFailed] = useState<number | null>(null);

  const meta = STATIONS.find((s) => s.id === stationId) ?? STATIONS[0];
  const data = cache[stationId];

  useEffect(() => {
    if (cache[stationId]) return;
    let cancelled = false;
    fetch(`/project-media/weather/station-${stationId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<StationData>;
      })
      .then((json) => {
        if (!cancelled) setCache((prev) => ({ ...prev, [stationId]: json }));
      })
      .catch(() => {
        if (!cancelled) setFailed(stationId);
      });
    return () => {
      cancelled = true;
    };
  }, [stationId, cache]);

  const param = endpoint === "date" ? date : endpoint === "year" ? year : "";
  const result = useMemo(
    () => (data ? apiRequest(meta, data, endpoint, param, 25) : null),
    [data, meta, endpoint, param],
  );

  const changeStation = (id: number) => {
    const next = STATIONS.find((s) => s.id === id) ?? STATIONS[0];
    setStationId(id);
    setFailed(null);
    setDate((d) => clampIso(d, next));
    setYear((y) => {
      const n = Number(y);
      const lo = Number(next.start.slice(0, 4));
      const hi = Number(next.end.slice(0, 4));
      return String(Math.min(Math.max(Number.isFinite(n) ? n : lo, lo), hi));
    });
  };

  return (
    <div className="demo-shell-body weather-layout">
      <div className="weather-controls">
        <label className="weather-field">
          <span>Station</span>
          <select value={stationId} onChange={(e) => changeStation(Number(e.target.value))}>
            {STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} · {s.name} ({s.country})
              </option>
            ))}
          </select>
        </label>

        <fieldset className="weather-field">
          <legend>Endpoint</legend>
          {(
            [
              ["date", "One date", "/api/v1/<station>/<date>"],
              ["year", "One year", "/api/v1/yearly/<station>/<year>"],
              ["all", "All dates", "/api/v1/<station>"],
            ] as [Endpoint, string, string][]
          ).map(([key, label, route]) => (
            <label key={key} className="weather-radio">
              <input
                type="radio"
                name="endpoint"
                value={key}
                checked={endpoint === key}
                onChange={() => setEndpoint(key)}
              />
              <span>
                <strong>{label}</strong>
                <code>{route}</code>
              </span>
            </label>
          ))}
        </fieldset>

        {endpoint === "date" && (
          <label className="weather-field">
            <span>Date</span>
            <input
              type="date"
              value={date}
              min={meta.start}
              max={meta.end}
              onChange={(e) => e.target.value && setDate(e.target.value)}
            />
          </label>
        )}
        {endpoint === "year" && (
          <label className="weather-field">
            <span>Year</span>
            <input
              type="number"
              value={year}
              min={Number(meta.start.slice(0, 4))}
              max={Number(meta.end.slice(0, 4))}
              onChange={(e) => setYear(e.target.value)}
            />
          </label>
        )}

        <p className="weather-coverage">
          Station {meta.id} covers {meta.start} to {meta.end}: {meta.records.toLocaleString("en-US")} daily
          records.
        </p>
        <p className="demo-fineprint">
          This runs the same logic as the Flask app&apos;s main.py in your browser, on the same 5-station
          sample. Its output matches the Flask app&apos;s byte for byte. Data: ECA&amp;D.
        </p>
      </div>

      <div className="weather-output">
        {failed === stationId && <div className="weather-loading">Could not load that station&apos;s data.</div>}
        {!result && failed !== stationId && <div className="weather-loading">Loading station data…</div>}
        {result && (
          <>
            <div className="weather-request">
              <span className="weather-method">{result.method}</span>
              <code className="weather-url">
                {BASE}
                {result.path}
              </code>
              <span className={`weather-status ${result.status === 200 ? "is-ok" : "is-error"}`}>
                {result.status} {result.statusText}
              </span>
            </div>
            {endpoint === "year" && result.series && <YearChart result={result} station={meta} />}
            <pre className="weather-json" tabIndex={0}>
              {result.body}
            </pre>
            {result.total > result.shown && (
              <p className="weather-note">
                Showing the first {result.shown} of {result.total.toLocaleString("en-US")} records. The real
                endpoint returns all of them.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function WeatherShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="demo-window">
        <div className="demo-window-bar">
          <span className="demo-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="demo-window-title mono">{BASE}</span>
        </div>
        <div className="weather-preview" aria-hidden="true">
          <div className="weather-request">
            <span className="weather-method">GET</span>
            <code className="weather-url">/api/v1/1/1988-10-25</code>
            <span className="weather-status is-ok">200 OK</span>
          </div>
          <pre className="weather-preview-json">{PREVIEW_DATE}</pre>
          <div className="weather-request">
            <span className="weather-method">GET</span>
            <code className="weather-url">/api/v1/yearly/1/1988</code>
            <span className="weather-status is-ok">200 OK</span>
          </div>
          <pre className="weather-preview-json">{PREVIEW_YEAR}</pre>
        </div>
        <button
          type="button"
          className="demo-overlay"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open the Weather API explorer"
        >
          <span className="demo-cta">
            <span>Try the API →</span>
            <small>pick a station, a date, or a whole year</small>
          </span>
        </button>
      </div>

      <DemoDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Weather Data API explorer"
        kicker="Live sample · 5 stations, 1781 to 2022"
      >
        <WeatherExplorer />
      </DemoDialog>
    </>
  );
}
