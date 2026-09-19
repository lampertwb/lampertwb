"use client";

import { useState } from "react";
import { DemoDialog } from "./demo-dialog";

const DIGEST_SRC = "/project-media/news-digest-sample.html";

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
