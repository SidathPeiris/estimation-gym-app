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

const BANDS = ["Bullseye", "Close", "Ballpark", "Off"];

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

async function handleGet(request, env, url) {
  const questionId = url.searchParams.get("q");
  if (!validQuestionId(questionId)) return json({ error: "bad question id" }, env, 400);

  const { n, counts } = await readDistribution(env, questionId);

  // Withhold the breakdown until it means something, rather than letting the
  // client draw a chart from three responses.
  if (n < MIN_SAMPLE) return json({ questionId, n, enough: false, minimum: MIN_SAMPLE }, env);
  return json({ questionId, n, enough: true, counts }, env);
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
  return n < MIN_SAMPLE
    ? json({ questionId, n, enough: false, minimum: MIN_SAMPLE, counted: !already }, env)
    : json({ questionId, n, enough: true, counts, counted: !already }, env);
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
    return json({ error: "not found" }, env, 404);
  }
};
