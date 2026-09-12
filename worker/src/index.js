// Collects, and hands back, the distribution of how everyone did on a given
// question.
//
// What is stored is four counters per question - one per scoring band. No
// guess, no answer, no identifier, no timestamp beyond a coarse rate-limiting
// row. There is nothing here that could reconstruct an individual's play.
//
// Deploy:
//   npx wrangler d1 create estimation-gym          # paste the id into wrangler.toml
//   npx wrangler d1 execute estimation-gym --remote --file=./schema.sql
//   npx wrangler deploy

import { sendPush, localHour, localDayIndex } from "./push.js";

const BANDS = ["Bullseye", "Close", "Ballpark", "Off"];

// The local hour a reminder aims for. The cron runs hourly and each subscriber
// matches exactly once a day, whatever their offset.
const REMINDER_HOUR = 9;

// The breakdown is released from the very first response.
//
// Everyone playing on a given calendar date gets the same question, so a day's
// responses land on one question id rather than spreading across the bank -
// the constraint is how many people play, not dilution. A question also
// recurs only about every 500 days and a returning player is not counted
// twice, so any floor above 1 keeps the chart hidden for a long time on a
// small audience.
//
// The honesty problem a floor was guarding against is handled in the client
// instead, where it belongs: at n = 1 the sole respondent is the player
// looking at it, so it is presented as "you are the first" rather than as a
// comparison against themselves.
const MIN_SAMPLE = 1;

// The app is moving from sidathpeiris.github.io to estimationgym.app, and both
// are live at once while people reinstall - so this takes a list. Each origin
// is echoed back individually rather than as a set, because
// Access-Control-Allow-Origin may only ever name one.
function allowedOrigins(env) {
  return (env.ALLOWED_ORIGIN || "").split(",").map(function (o) { return o.trim(); }).filter(Boolean);
}

function corsHeaders(env, request) {
  const allowed = allowedOrigins(env);
  const asked = request && request.headers.get("Origin");
  const echo = allowed.length === 0
    ? "*"
    : (allowed.indexOf(asked) >= 0 ? asked : allowed[0]);
  return {
    "Access-Control-Allow-Origin": echo,
    // The answer varies by request origin now, so caches must not share it.
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function json(body, env, status, request) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign(
      { "Content-Type": "application/json", "Cache-Control": "no-store" },
      corsHeaders(env, request)
    )
  });
}

function originAllowed(request, env) {
  const allowed = allowedOrigins(env);
  if (!allowed.length) return true;
  const origin = request.headers.get("Origin");
  // A same-origin or non-browser request carries no Origin; allow those so the
  // endpoint stays testable with curl.
  return !origin || allowed.indexOf(origin) >= 0;
}

// Question ids are kebab-case by contract, enforced by questions.test.js.
// Rejecting anything else keeps junk keys out of the table.
function validQuestionId(id) {
  return typeof id === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) && id.length <= 80;
}

// How many people owned up to looking this one up. Counted separately from the
// bands so a confession never distorts the distribution it sits under - someone
// who peeked still answered, and their band still stands.
async function readConfessions(env, questionId) {
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM confessions WHERE question_id = ?"
  ).bind(questionId).first();
  return (row && row.n) || 0;
}

async function handleConfess(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400, request); }
  if (!validQuestionId(body && body.questionId)) return json({ error: "bad question id" }, env, 400, request);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const client = await hash("confess:" + ip + ":" + body.questionId);

  // The primary key does the deduplicating, so owning up twice is still one
  // confession. INSERT OR IGNORE rather than read-then-write: there is nothing
  // to tell the confessor either way.
  await env.DB.prepare(
    "INSERT OR IGNORE INTO confessions (question_id, client, at) VALUES (?, ?, ?)"
  ).bind(body.questionId, client, Date.now()).run();

  return json({ ok: true, confessed: await readConfessions(env, body.questionId) }, env, null, request);
}

async function readDistribution(env, questionId) {
  const { results } = await env.DB.prepare(
    "SELECT band, tally FROM responses WHERE question_id = ?"
  ).bind(questionId).all();

  const counts = {};
  for (const band of BANDS) counts[band] = 0;
  let n = 0;
  for (const row of results || []) {
    if (band_known(row.band)) {
      counts[row.band] = row.tally;
      n += row.tally;
    }
  }
  return { n, counts };
}

// Whole decades off, as the client reports it. Optional: a client that has not
// updated simply sends nothing and only its band is counted, so this can never
// reject a submission that would otherwise have been recorded.
const DECADE_CAP = 20;
function validDecade(value) {
  return typeof value === "number" && Number.isInteger(value) &&
    value >= 0 && value <= DECADE_CAP;
}

function band_known(band) {
  return BANDS.indexOf(band) >= 0;
}

// A push endpoint is a URL the browser hands out. Anything else is refused
// rather than stored, so the table cannot be filled with junk or pointed at
// somewhere that is not a push service.
function validEndpoint(value) {
  if (typeof value !== "string" || value.length > 1000) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch (e) {
    return false;
  }
}

// Minutes, as Date.getTimezoneOffset() reports. Real offsets run -840..+720.
function validOffset(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= -840 && value <= 720;
}

async function handleSubscribe(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400, request); }

  if (!validEndpoint(body && body.endpoint)) return json({ error: "bad endpoint" }, env, 400, request);
  if (!validOffset(body && body.tzOffset)) return json({ error: "bad tzOffset" }, env, 400, request);

  await env.DB.prepare(
    "INSERT INTO subscriptions (endpoint, tz_offset, last_played_day, created_at) VALUES (?, ?, NULL, ?) " +
    "ON CONFLICT(endpoint) DO UPDATE SET tz_offset = excluded.tz_offset"
  ).bind(body.endpoint, body.tzOffset, Date.now()).run();

  return json({ ok: true }, env, null, request);
}

async function handleUnsubscribe(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400, request); }
  if (!validEndpoint(body && body.endpoint)) return json({ error: "bad endpoint" }, env, 400, request);

  await env.DB.prepare("DELETE FROM subscriptions WHERE endpoint = ?").bind(body.endpoint).run();
  return json({ ok: true }, env, null, request);
}

// Lets a device say it has played, so the reminder can be skipped rather than
// telling someone to do a thing they have already done.
async function handlePlayed(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400, request); }
  if (!validEndpoint(body && body.endpoint)) return json({ error: "bad endpoint" }, env, 400, request);
  if (typeof body.day !== "number" || !Number.isInteger(body.day)) return json({ error: "bad day" }, env, 400, request);

  await env.DB.prepare(
    "UPDATE subscriptions SET last_played_day = ? WHERE endpoint = ?"
  ).bind(body.day, body.endpoint).run();

  return json({ ok: true }, env, null, request);
}

async function handleGet(request, env, url) {
  const questionId = url.searchParams.get("q");
  if (!validQuestionId(questionId)) return json({ error: "bad question id" }, env, 400, request);

  const { n, counts } = await readDistribution(env, questionId);

  // Withhold the breakdown until it means something, rather than letting the
  // client draw a chart from three responses.
  const confessed = await readConfessions(env, questionId);
  if (n < MIN_SAMPLE) return json({ questionId, n, enough: false, minimum: MIN_SAMPLE, confessed }, env, null, request);
  return json({ questionId, n, enough: true, counts, confessed }, env, null, request);
}

// Which address a play came from, and on what day.
//
// Only ever one of the origins the Worker already allows, or "other" for a
// request that carried no Origin at all - so nothing a caller writes reaches
// the table. Same epoch the app counts days from, on UTC.
const EPOCH_MS = Date.UTC(2024, 0, 1);
const DAY_LENGTH_MS = 24 * 60 * 60 * 1000;

function originLabel(request, env) {
  const asked = request.headers.get("Origin");
  if (!asked) return "other";
  return allowedOrigins(env).indexOf(asked) >= 0 ? asked : "other";
}

function utcDayIndex(now) {
  return Math.floor((now - EPOCH_MS) / DAY_LENGTH_MS);
}

function countOriginDay(env, request) {
  return env.DB.prepare(
    "INSERT INTO origin_days (day, origin, tally) VALUES (?, ?, 1) " +
    "ON CONFLICT(day, origin) DO UPDATE SET tally = tally + 1"
  ).bind(utcDayIndex(Date.now()), originLabel(request, env));
}

async function handlePost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "bad json" }, env, 400, request);
  }

  const questionId = body && body.questionId;
  const band = body && body.band;
  if (!validQuestionId(questionId)) return json({ error: "bad question id" }, env, 400, request);
  if (!band_known(band)) return json({ error: "bad band" }, env, 400, request);

  // One submission per question per address. Cloudflare supplies the address;
  // it is hashed with the question id so the table never holds a bare IP.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const client = await hash(ip + ":" + questionId);

  const already = await env.DB.prepare(
    "SELECT 1 FROM seen WHERE question_id = ? AND client = ?"
  ).bind(questionId, client).first();

  if (!already) {
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO seen (question_id, client, at) VALUES (?, ?, ?)"
      ).bind(questionId, client, Date.now()),
      env.DB.prepare(
        "INSERT INTO responses (question_id, band, tally) VALUES (?, ?, 1) " +
        "ON CONFLICT(question_id, band) DO UPDATE SET tally = tally + 1"
      ).bind(questionId, band),
      // Inside the dedupe, so this counts people rather than requests, and in
      // the same batch so a play is either counted everywhere or nowhere.
      countOriginDay(env, request)
    ]);

    // Counted separately and only when sent, so the band tallies stay exactly
    // what they were and an older client is never penalised for not knowing
    // about this.
    if (validDecade(body && body.decades)) {
      await env.DB.prepare(
        "INSERT INTO decade_errors (question_id, decade, tally) VALUES (?, ?, 1) " +
        "ON CONFLICT(question_id, decade) DO UPDATE SET tally = tally + 1"
      ).bind(questionId, body.decades).run();
    }
  }

  // Hand back the current picture so submitting and reading is one round trip.
  const { n, counts } = await readDistribution(env, questionId);
  const confessed = await readConfessions(env, questionId);
  return n < MIN_SAMPLE
    ? json({ questionId, n, enough: false, minimum: MIN_SAMPLE, counted: !already, confessed }, env, null, request)
    : json({ questionId, n, enough: true, counts, counted: !already, confessed }, env, null, request);
}

// --- question suggestions ---
//
// Nothing submitted here is ever served to a player. A suggestion lands as
// `pending` and stays that way until it is reviewed off-line and appended to
// the bank by hand, which is the only path into the game. That is deliberate:
// the bank carries the answers, so a question nobody has checked is worse than
// no question at all - it would mark a correct guess as wrong.
const SUGGEST_MAX_PER_DAY = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Free text written by strangers, so the limits are about what can safely be
// stored rather than about being generous. Angle brackets are refused
// outright: the widget renders prompts through Qt's Text, which treats
// anything HTML-shaped as rich text unless told otherwise, and the bank
// validator refuses them for the same reason. Control characters go too - they
// have no place in a sentence and are a standard way to smuggle something past
// a later check.
function cleanText(value, min, max) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) return null;
  if (/[<>]/.test(trimmed)) return null;
  // Checked by codepoint rather than by regex: a control-character class is
  // easy to write, easy to get subtly wrong, and unreadable afterwards.
  for (const ch of trimmed) {
    const code = ch.codePointAt(0);
    if (code < 0x20 || code === 0x7f) return null;
  }
  return trimmed;
}

// The submitter's claimed answer. Stored as a number, because a value that
// cannot be parsed is not a claim anyone could check. Number() rather than
// parseFloat, which would quietly accept "5e9 or so" - and scientific notation
// has to work, since the bank spans 10^-37 to 10^80.
function parsedAnswer(value) {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!isFinite(n) || n <= 0) return null;
  return n;
}

async function handleSuggest(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "bad json" }, env, 400, request);
  }

  const prompt = cleanText(body && body.prompt, 15, 200);
  const unit = cleanText(body && body.unit, 1, 40);
  const source = cleanText(body && body.source, 4, 200);
  const answer = parsedAnswer(body && body.answer);
  // Optional: absent is fine, present but unusable is not.
  const note = body && body.note ? cleanText(body.note, 1, 500) : "";

  if (!prompt) return json({ error: "prompt must be 15-200 characters, without < or >" }, env, 400, request);
  if (!unit) return json({ error: "unit must be 1-40 characters" }, env, 400, request);
  if (answer === null) return json({ error: "answer must be a positive number" }, env, 400, request);
  if (!source) return json({ error: "source must be 4-200 characters" }, env, 400, request);
  if (note === null) return json({ error: "note must be under 500 characters" }, env, 400, request);

  // Rate limited per address per day, hashed so the table never holds a bare
  // IP - the same treatment the response counter gives it.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const client = await hash("suggest:" + ip);

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM suggestions WHERE client = ? AND at > ?"
  ).bind(client, Date.now() - DAY_MS).first();

  if (recent && recent.n >= SUGGEST_MAX_PER_DAY) {
    return json({ error: "that is enough for today - thank you, try again tomorrow" }, env, 429, request);
  }

  await env.DB.prepare(
    "INSERT INTO suggestions (id, prompt, unit, answer, source, note, status, client, at) " +
    "VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)"
  ).bind(crypto.randomUUID(), prompt, unit, answer, source, note, client, Date.now()).run();

  return json({ ok: true }, env, null, request);
}

async function hash(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, request) });
    }
    if (!originAllowed(request, env)) {
      return json({ error: "origin not allowed" }, env, 403, request);
    }
    if (url.pathname === "/dist" && request.method === "GET") {
      return handleGet(request, env, url);
    }
    if (url.pathname === "/submit" && request.method === "POST") {
      return handlePost(request, env);
    }
    if (url.pathname === "/subscribe" && request.method === "POST") {
      return handleSubscribe(request, env);
    }
    if (url.pathname === "/unsubscribe" && request.method === "POST") {
      return handleUnsubscribe(request, env);
    }
    if (url.pathname === "/played" && request.method === "POST") {
      return handlePlayed(request, env);
    }
    if (url.pathname === "/suggest" && request.method === "POST") {
      return handleSuggest(request, env);
    }
    if (url.pathname === "/confess" && request.method === "POST") {
      return handleConfess(request, env);
    }
    return json({ error: "not found" }, env, 404, request);
  },

  // Hourly. Each run reminds only the subscribers for whom it has just turned
  // REMINDER_HOUR, so one cron covers every timezone without anyone getting
  // woken at three in the morning.
  async scheduled(event, env, ctx) {
    const now = event.scheduledTime || Date.now();
    const utcHour = new Date(now).getUTCHours();

    const { results } = await env.DB.prepare(
      "SELECT endpoint, tz_offset, last_played_day FROM subscriptions"
    ).all();

    const due = (results || []).filter(function (row) {
      if (localHour(utcHour, row.tz_offset) !== REMINDER_HOUR) return false;
      // Already answered today where they are: say nothing.
      return row.last_played_day !== localDayIndex(now, row.tz_offset);
    });

    const gone = [];
    for (const row of due) {
      const outcome = await sendPush(row.endpoint, env);
      if (outcome === "gone") gone.push(row.endpoint);
    }

    // A subscription the push service reports as dead is never coming back, so
    // it is dropped rather than retried every hour forever.
    for (const endpoint of gone) {
      await env.DB.prepare("DELETE FROM subscriptions WHERE endpoint = ?").bind(endpoint).run();
    }

    console.log("reminder run: utcHour=" + utcHour + " due=" + due.length + " removed=" + gone.length);
  }
};
