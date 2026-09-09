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

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function json(body, env, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign(
      { "Content-Type": "application/json", "Cache-Control": "no-store" },
      corsHeaders(env)
    )
  });
}

function originAllowed(request, env) {
  if (!env.ALLOWED_ORIGIN) return true;
  const origin = request.headers.get("Origin");
  // A same-origin or non-browser request carries no Origin; allow those so the
  // endpoint stays testable with curl.
  return !origin || origin === env.ALLOWED_ORIGIN;
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
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400); }
  if (!validQuestionId(body && body.questionId)) return json({ error: "bad question id" }, env, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const client = await hash("confess:" + ip + ":" + body.questionId);

  // The primary key does the deduplicating, so owning up twice is still one
  // confession. INSERT OR IGNORE rather than read-then-write: there is nothing
  // to tell the confessor either way.
  await env.DB.prepare(
    "INSERT OR IGNORE INTO confessions (question_id, client, at) VALUES (?, ?, ?)"
  ).bind(body.questionId, client, Date.now()).run();

  return json({ ok: true, confessed: await readConfessions(env, body.questionId) }, env);
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
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400); }

  if (!validEndpoint(body && body.endpoint)) return json({ error: "bad endpoint" }, env, 400);
  if (!validOffset(body && body.tzOffset)) return json({ error: "bad tzOffset" }, env, 400);

  await env.DB.prepare(
    "INSERT INTO subscriptions (endpoint, tz_offset, last_played_day, created_at) VALUES (?, ?, NULL, ?) " +
    "ON CONFLICT(endpoint) DO UPDATE SET tz_offset = excluded.tz_offset"
  ).bind(body.endpoint, body.tzOffset, Date.now()).run();

  return json({ ok: true }, env);
}

async function handleUnsubscribe(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400); }
  if (!validEndpoint(body && body.endpoint)) return json({ error: "bad endpoint" }, env, 400);

  await env.DB.prepare("DELETE FROM subscriptions WHERE endpoint = ?").bind(body.endpoint).run();
  return json({ ok: true }, env);
}

// Lets a device say it has played, so the reminder can be skipped rather than
// telling someone to do a thing they have already done.
async function handlePlayed(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, env, 400); }
  if (!validEndpoint(body && body.endpoint)) return json({ error: "bad endpoint" }, env, 400);
  if (typeof body.day !== "number" || !Number.isInteger(body.day)) return json({ error: "bad day" }, env, 400);

  await env.DB.prepare(
    "UPDATE subscriptions SET last_played_day = ? WHERE endpoint = ?"
  ).bind(body.day, body.endpoint).run();

  return json({ ok: true }, env);
}

async function handleGet(request, env, url) {
  const questionId = url.searchParams.get("q");
  if (!validQuestionId(questionId)) return json({ error: "bad question id" }, env, 400);

  const { n, counts } = await readDistribution(env, questionId);

  // Withhold the breakdown until it means something, rather than letting the
  // client draw a chart from three responses.
  const confessed = await readConfessions(env, questionId);
  if (n < MIN_SAMPLE) return json({ questionId, n, enough: false, minimum: MIN_SAMPLE, confessed }, env);
  return json({ questionId, n, enough: true, counts, confessed }, env);
}

async function handlePost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "bad json" }, env, 400);
  }

  const questionId = body && body.questionId;
  const band = body && body.band;
  if (!validQuestionId(questionId)) return json({ error: "bad question id" }, env, 400);
  if (!band_known(band)) return json({ error: "bad band" }, env, 400);

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
      ).bind(questionId, band)
    ]);
  }

  // Hand back the current picture so submitting and reading is one round trip.
  const { n, counts } = await readDistribution(env, questionId);
  const confessed = await readConfessions(env, questionId);
  return n < MIN_SAMPLE
    ? json({ questionId, n, enough: false, minimum: MIN_SAMPLE, counted: !already, confessed }, env)
    : json({ questionId, n, enough: true, counts, counted: !already, confessed }, env);
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
    return json({ error: "bad json" }, env, 400);
  }

  const prompt = cleanText(body && body.prompt, 15, 200);
  const unit = cleanText(body && body.unit, 1, 40);
  const source = cleanText(body && body.source, 4, 200);
  const answer = parsedAnswer(body && body.answer);
  // Optional: absent is fine, present but unusable is not.
  const note = body && body.note ? cleanText(body.note, 1, 500) : "";

  if (!prompt) return json({ error: "prompt must be 15-200 characters, without < or >" }, env, 400);
  if (!unit) return json({ error: "unit must be 1-40 characters" }, env, 400);
  if (answer === null) return json({ error: "answer must be a positive number" }, env, 400);
  if (!source) return json({ error: "source must be 4-200 characters" }, env, 400);
  if (note === null) return json({ error: "note must be under 500 characters" }, env, 400);

  // Rate limited per address per day, hashed so the table never holds a bare
  // IP - the same treatment the response counter gives it.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const client = await hash("suggest:" + ip);

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM suggestions WHERE client = ? AND at > ?"
  ).bind(client, Date.now() - DAY_MS).first();

  if (recent && recent.n >= SUGGEST_MAX_PER_DAY) {
    return json({ error: "that is enough for today - thank you, try again tomorrow" }, env, 429);
  }

  await env.DB.prepare(
    "INSERT INTO suggestions (id, prompt, unit, answer, source, note, status, client, at) " +
    "VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)"
  ).bind(crypto.randomUUID(), prompt, unit, answer, source, note, client, Date.now()).run();

  return json({ ok: true }, env);
}

async function hash(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }
    if (!originAllowed(request, env)) {
      return json({ error: "origin not allowed" }, env, 403);
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
    return json({ error: "not found" }, env, 404);
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
