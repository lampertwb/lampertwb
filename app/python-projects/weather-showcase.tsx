"use client";

import { useState } from "react";
import { DemoDialog } from "./demo-dialog";

const BASE = "http://127.0.0.1:5000";
const IMG = "/project-media/weather-app";

type Step = {
  title: string;
  path: string;
  route: string;
  image: string;
  alt: string;
  text: string;
  note?: string;
};

// Every screenshot is a real capture of the app's own output (main.py, unmodified) for station 1
// (Växjö, Sweden). The route lines are copied verbatim from main.py.
const steps: Step[] = [
  {
    title: "The home page",
    path: "/",
    route: '@app.route("/")',
    image: "weather-home.png",
    alt: "The Weather Data API home page: a heading, the URL format, three example URLs, and a table of weather stations with their ID numbers and names.",
    text: "The front door. It shows the three kinds of question the app can answer, then lists every weather station by number and name.",
    note: "The table runs on for 6,454 stations, and the examples on the page use station 26. This portfolio copy only ships data for 5 stations, so the screens below use station 1.",
  },
  {
    title: "One station, one date",
    path: "/api/v1/1/1988-10-25",
    route: '@app.route("/api/v1/<station>/<date>")',
    image: "weather-one-date.png",
    alt: "The reply for station 1 on 1988-10-25: a small block of data with the date, the station, and a temperature of -3.9.",
    text: "Station 1 (Växjö, Sweden) on October 25, 1988. The reply is data, not a web page: the date, the station, and a temperature of −3.9 °C.",
    note: "The data file stores temperatures in tenths of a degree (−39), so my code divides by 10.",
  },
  {
    title: "One station, one year",
    path: "/api/v1/yearly/1/1988",
    route: '@app.route("/api/v1/yearly/<station>/<year>")',
    image: "weather-one-year.png",
    alt: "The start of the reply for station 1 in 1988: one block of data per day, beginning with 19880101.",
    text: "Every day of 1988 for that station, one block per day. Here are the first five of 366.",
    note: "TG is the temperature in tenths of a degree, so 47 means 4.7 °C.",
  },
  {
    title: "One station, all dates",
    path: "/api/v1/1",
    route: '@app.route("/api/v1/<station>")',
    image: "weather-all-dates.png",
    alt: "The start of the reply for station 1 across all dates: one block of data per day, beginning with Sun, 01 Jan 1860.",
    text: "Everything the station has recorded: 59,321 days, starting January 1, 1860. Here are the first five.",
    note: "Dates arrive in a different format here than in the year view.",
  },
];

function Shot({ step }: { step: Step }) {
  return (
    <div className="wxs-shot">
      <div className="demo-window">
        <div className="demo-window-bar">
          <span className="demo-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="demo-window-title mono">
            {BASE}
            {step.path}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/${step.image}`} alt={step.alt} loading="lazy" />
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
          <span className="demo-window-title mono">{BASE}/</span>
        </div>
        <div className="wxs-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/weather-home.png`} alt="" />
        </div>
        <button
          type="button"
          className="demo-overlay"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="See the Weather Data API running, one screen at a time"
        >
          <span className="demo-cta">
            <span>See it running →</span>
            <small>my real app, one screen at a time</small>
          </span>
        </button>
      </div>

      <DemoDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Weather Data API, running"
        kicker="My real app · screenshots of its own output"
      >
        <div className="demo-shell-body wxs">
          <p className="wxs-intro">
            This is my Flask app answering real requests. Each screen below is a browser pointed at one of its web
            addresses, with a plain-English note on what you&apos;re looking at and the line of my code that handles
            it.
          </p>
          {steps.map((step, i) => (
            <section key={step.path} className="wxs-step" aria-labelledby={`wxs-${i}`}>
              <div>
                <h3 className="wxs-title" id={`wxs-${i}`}>
                  <span className="wxs-num">{i + 1}</span>
                  {step.title}
                </h3>
                <p className="wxs-text">{step.text}</p>
                <span className="wxs-label">The web address</span>
                <code className="wxs-code">{step.path}</code>
                <span className="wxs-label">The line in my main.py that answers it</span>
                <code className="wxs-code">{step.route}</code>
                {step.note && <p className="wxs-note">{step.note}</p>}
              </div>
              <Shot step={step} />
            </section>
          ))}
          <p className="demo-fineprint">
            Data: European Climate Assessment &amp; Dataset (ECA&amp;D), daily mean temperature. Screenshots are the
            output of main.py, unmodified.
          </p>
        </div>
      </DemoDialog>
    </>
  );
}
