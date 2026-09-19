// Pure, framework-free port of the Weather Data API's three endpoints (see
// python-projects/app6-weather-api/main.py). It reproduces the Flask app's exact JSON text
// (sorted keys, 2-space indent, HTTP-style dates in the all-dates endpoint, string dates in the
// yearly one) from the compact station files in public/project-media/weather/, so the portfolio
// explorer can answer requests in the browser without a server.

export type StationMeta = {
  id: number;
  name: string;
  country: string;
  start: string;
  end: string;
  records: number;
};

// Compact form of one ECA&D station file. Rows are one per day from `start`, with no gaps.
export type StationData = {
  id: number;
  start: string; // YYYY-MM-DD of the first row
  souid: [number, number][]; // [source id, run length] pairs, in row order
  tg: number[]; // mean temperature in tenths of a degree C (-9999 = missing)
  q: string; // one quality-code digit per row
};

export type Endpoint = "date" | "all" | "year";

export type ApiResult = {
  method: "GET";
  path: string;
  status: number;
  statusText: string;
  body: string;
  total: number; // records the real endpoint would return
  shown: number; // records included in `body`
  series?: (number | null)[]; // daily temperatures in C, for charting the yearly endpoint
  seriesStart?: string;
};

const DAY_MS = 86_400_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const souidCache = new WeakMap<StationData, Int32Array>();

function souidByRow(data: StationData): Int32Array {
  let arr = souidCache.get(data);
  if (!arr) {
    arr = new Int32Array(data.tg.length);
    let at = 0;
    for (const [souid, run] of data.souid) {
      arr.fill(souid, at, at + run);
      at += run;
    }
    souidCache.set(data, arr);
  }
  return arr;
}

function utcMs(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function rowDate(data: StationData, row: number): Date {
  return new Date(utcMs(data.start) + row * DAY_MS);
}

function compactDate(data: StationData, row: number): string {
  const d = rowDate(data, row);
  return `${pad(d.getUTCFullYear(), 4)}${pad(d.getUTCMonth() + 1, 2)}${pad(d.getUTCDate(), 2)}`;
}

// Flask serializes a pandas Timestamp with http_date(), e.g. "Sun, 01 Jan 1860 00:00:00 GMT".
function httpDate(data: StationData, row: number): string {
  const d = rowDate(data, row);
  return `${WEEKDAYS[d.getUTCDay()]}, ${pad(d.getUTCDate(), 2)} ${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCFullYear(), 4)} 00:00:00 GMT`;
}

// Python's json module prints 5.0, not 5.
function pyFloat(n: number): string {
  return Number.isInteger(n) ? n.toFixed(1) : String(n);
}

function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(utcMs(iso));
  return d.toISOString().slice(0, 10) === iso;
}

function recordText(data: StationData, stationId: number, row: number, asHttpDate: boolean): string {
  const date = asHttpDate ? httpDate(data, row) : compactDate(data, row);
  return [
    "  {",
    `    "    DATE": "${date}",`,
    `    "   TG": ${data.tg[row]},`,
    `    " Q_TG": ${data.q[row]},`,
    `    " SOUID": ${souidByRow(data)[row]},`,
    `    "STAID": ${stationId}`,
    "  }",
  ].join("\n");
}

function listBody(
  data: StationData,
  stationId: number,
  rows: number[],
  asHttpDate: boolean,
  limit: number,
): { body: string; shown: number } {
  if (rows.length === 0) return { body: "[]\n", shown: 0 };
  const truncated = rows.length > limit;
  const shownRows = truncated ? rows.slice(0, limit) : rows;
  const items = shownRows.map((r) => recordText(data, stationId, r, asHttpDate)).join(",\n");
  return { body: `[\n${items}${truncated ? "\n  …" : ""}\n]\n`, shown: shownRows.length };
}

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

export function apiRequest(
  meta: StationMeta,
  data: StationData,
  endpoint: Endpoint,
  param: string,
  limit = 25,
): ApiResult {
  const n = data.tg.length;
  const startMs = utcMs(data.start);

  if (endpoint === "date") {
    const path = `/api/v1/${meta.id}/${param}`;
    const row = isRealDate(param) ? Math.round((utcMs(param) - startMs) / DAY_MS) : -1;
    if (row < 0 || row >= n) {
      return {
        method: "GET",
        path,
        status: 500,
        statusText: "INTERNAL SERVER ERROR",
        body: "TypeError: Object of type Series is not JSON serializable\n",
        total: 0,
        shown: 0,
      };
    }
    const body = `{\n  "date": "${param}",\n  "station": "${meta.id}",\n  "temperature": ${pyFloat(data.tg[row] / 10)}\n}\n`;
    return { method: "GET", path, status: 200, statusText: "OK", body, total: 1, shown: 1 };
  }

  if (endpoint === "all") {
    const rows = range(0, n - 1);
    const { body, shown } = listBody(data, meta.id, rows, true, limit);
    return { method: "GET", path: `/api/v1/${meta.id}`, status: 200, statusText: "OK", body, total: n, shown };
  }

  // year: the real app keeps rows whose date string starts with the year
  const path = `/api/v1/yearly/${meta.id}/${param}`;
  let rows: number[] = [];
  if (/^\d{4}$/.test(param)) {
    const year = Number(param);
    const first = Math.round((Date.UTC(year, 0, 1) - startMs) / DAY_MS);
    const last = Math.round((Date.UTC(year, 11, 31) - startMs) / DAY_MS);
    if (last >= 0 && first < n) rows = range(Math.max(first, 0), Math.min(last, n - 1));
  }
  const { body, shown } = listBody(data, meta.id, rows, false, limit);
  const series = rows.map((r) => (data.tg[r] === -9999 ? null : data.tg[r] / 10));
  return {
    method: "GET",
    path,
    status: 200,
    statusText: "OK",
    body,
    total: rows.length,
    shown,
    series,
    seriesStart: rows.length ? compactDate(data, rows[0]) : undefined,
  };
}
