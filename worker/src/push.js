// Sending a daily reminder.
//
// These are payload-less pushes: the request carries no body, so none of the
// AES128GCM content encryption a normal Web Push needs applies here. The
// browser is simply told "something happened", and the service worker decides
// what the notification says. That means the encryption keys a subscription
// normally carries never have to be stored, which is both less code and less
// data held about anyone.
//
// What is still required is VAPID: a signed assertion proving the push came
// from whoever owns the application server key the browser subscribed with.

const TWELVE_HOURS = 12 * 60 * 60;

function b64url(bytes) {
  let s = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlText(text) {
  return b64url(new TextEncoder().encode(text));
}

// The audience is the origin of the push service, not the full endpoint.
function audienceOf(endpoint) {
  const u = new URL(endpoint);
  return u.origin;
}

async function signingKey(privateJwk) {
  return crypto.subtle.importKey(
    "jwk",
    privateJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
}

// WebCrypto's ECDSA output is already the raw r||s pair that JWS ES256 wants,
// so no DER unwrapping is needed.
export async function vapidHeaders(endpoint, env) {
  const privateJwk = JSON.parse(env.VAPID_PRIVATE_KEY);
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud: audienceOf(endpoint),
    exp: Math.floor(Date.now() / 1000) + TWELVE_HOURS,
    sub: env.VAPID_SUBJECT || "mailto:noreply@example.com"
  };

  const input = b64urlText(JSON.stringify(header)) + "." + b64urlText(JSON.stringify(payload));
  const key = await signingKey(privateJwk);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(input));
  const jwt = input + "." + b64url(sig);

  return {
    Authorization: "vapid t=" + jwt + ", k=" + env.VAPID_PUBLIC_KEY,
    TTL: "43200",
    "Content-Length": "0"
  };
}

// Returns "sent", "gone" when the subscription no longer exists and should be
// forgotten, or "failed" for anything else. A failure is never fatal: a
// reminder that does not arrive is a small loss, and one broken endpoint must
// not stop the rest of the run.
export async function sendPush(endpoint, env) {
  let res;
  try {
    res = await fetch(endpoint, { method: "POST", headers: await vapidHeaders(endpoint, env) });
  } catch (e) {
    return "failed";
  }
  if (res.status === 404 || res.status === 410) return "gone";
  return res.ok ? "sent" : "failed";
}

// The hour it is for the subscriber, given the UTC hour the cron fired at.
// getTimezoneOffset is minutes to add to local to reach UTC, so it subtracts.
export function localHour(utcHour, tzOffsetMinutes) {
  const minutes = utcHour * 60 - tzOffsetMinutes;
  return Math.floor(((minutes % 1440) + 1440) % 1440 / 60);
}

// Which day it currently is for the subscriber, in the same day-index space
// the app uses, so "already played" can be compared without the client having
// to tell us anything beyond a number.
export function localDayIndex(nowMs, tzOffsetMinutes) {
  const EPOCH_MS = Date.UTC(2024, 0, 1);
  const DAY_MS = 24 * 60 * 60 * 1000;
  const shifted = nowMs - tzOffsetMinutes * 60000;
  const d = new Date(shifted);
  const midnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((midnight - EPOCH_MS) / DAY_MS);
}
