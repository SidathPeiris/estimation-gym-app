// The reminder toggle, through the real app.js.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const ENDPOINT = "https://fcm.googleapis.com/fcm/send/tok123";

function run({ permission = "granted", supported = true, store = {}, workerOk = true, existingSubscription = false } = {}) {
  const listeners = {}, calls = [];
  let subscribed = existingSubscription
    ? { endpoint: ENDPOINT, unsubscribe: () => { subscribed = null; return Promise.resolve(true) } }
    : null;
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "",
    selectionStart: 0, selectionEnd: 0, setSelectionRange() {},
    classList: { add() {}, remove() {}, contains: () => false },
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}
  });
  const els = {}; for (const id of ids) els[id] = makeEl(id);

  const registration = {
    pushManager: {
      getSubscription: () => Promise.resolve(subscribed),
      subscribe: (opts) => {
        calls.push({ subscribeKeyBytes: opts.applicationServerKey.length, userVisibleOnly: opts.userVisibleOnly });
        subscribed = { endpoint: ENDPOINT, unsubscribe: () => { subscribed = null; return Promise.resolve(true) } };
        return Promise.resolve(subscribed);
      }
    }
  };

  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent, Date, Uint8Array,
    atob: (b64) => Buffer.from(b64, "base64").toString("binary"),
    fetch: (url, opts) => {
      calls.push({ url: String(url), method: (opts && opts.method) || "GET", body: opts && opts.body });
      return Promise.resolve({ ok: workerOk, json: () => Promise.resolve({ n: 0, enough: false }) });
    },
    Image: function () { return {} },
    Notification: supported ? { requestPermission: () => Promise.resolve(permission) } : undefined,
    PushManager: supported ? function () {} : undefined,
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v25"]) }
    },
    navigator: supported ? { serviceWorker: { ready: Promise.resolve(registration), addEventListener() {}, getRegistration: () => Promise.resolve(registration) } } : {},
    setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });

  return {
    els, calls, store,
    tap: () => (listeners["remind:click"] || []).forEach((f) => f({ preventDefault() {} })),
    submit(v) { els["guess-input"].value = v; (listeners["guess-form:submit"] || []).forEach((f) => f({ preventDefault() {} })); },
    isSubscribed: () => !!subscribed
  };
}

const settle = async () => { for (let i = 0; i < 8; i++) await new Promise((r) => setImmediate(r)); };

(async () => {
  // 1. Off by default; the toggle is offered where push is supported.
  let r = run();
  if (r.els.remind.hidden) throw new Error("toggle should be offered when push is supported");
  if (r.els["remind-state"].textContent !== "Off") throw new Error("should start Off");
  const before = r.calls.filter((c) => c.url).length;
  if (before !== 0 && r.calls.some((c) => c.url && c.url.includes("/subscribe"))) throw new Error("subscribed without being asked");
  console.log("default            -> toggle shown, state Off, nothing subscribed");

  // 2. Turning it on asks permission, subscribes, and tells the Worker.
  r.tap(); await settle();
  const sub = r.calls.find((c) => c.url && c.url.includes("/subscribe"));
  if (!sub) throw new Error("no /subscribe call");
  const sent = JSON.parse(sub.body);
  console.log("turned on          -> " + JSON.stringify({ endpoint: sent.endpoint.slice(0, 38) + "\u2026", tzOffset: sent.tzOffset }));
  if (Object.keys(sent).sort().join(",") !== "endpoint,tzOffset") throw new Error("payload carries more than endpoint and offset");
  if (r.els["remind-state"].textContent !== "On") throw new Error("state should be On");
  const keyCall = r.calls.find((c) => c.subscribeKeyBytes);
  if (keyCall.subscribeKeyBytes !== 65) throw new Error("application server key should decode to 65 bytes, got " + keyCall.subscribeKeyBytes);
  if (keyCall.userVisibleOnly !== true) throw new Error("userVisibleOnly must be true");
  console.log("                      key decodes to 65 bytes, userVisibleOnly true");

  // 3. Answering reports the day so the nudge can be skipped.
  r.submit("1000"); await settle();
  const played = r.calls.find((c) => c.url && c.url.includes("/played"));
  if (!played) throw new Error("no /played call after answering");
  console.log("answered           -> reported day " + JSON.parse(played.body).day);

  // 4. Turning it off unsubscribes and tells the Worker.
  r.tap(); await settle();
  if (r.isSubscribed()) throw new Error("still subscribed in the browser");
  if (!r.calls.some((c) => c.url && c.url.includes("/unsubscribe"))) throw new Error("no /unsubscribe call");
  if (r.els["remind-state"].textContent !== "Off") throw new Error("state should be Off again");
  console.log("turned off         -> unsubscribed, Worker told, state Off");

  // 5. Permission refused: says so, stays off, does not subscribe.
  r = run({ permission: "denied" });
  r.tap(); await settle();
  if (r.els["remind-state"].textContent !== "Off") throw new Error("should stay Off when denied");
  if (r.calls.some((c) => c.url && c.url.includes("/subscribe"))) throw new Error("subscribed despite denial");
  console.log("permission denied  -> " + r.els["remind-note"].textContent.slice(0, 58) + "\u2026");

  // 6. A browser without push never sees the toggle at all.
  r = run({ supported: false });
  if (!r.els.remind.hidden) throw new Error("toggle should be hidden without push support");
  console.log("no push support    -> toggle hidden entirely");

  // 7. Worker unreachable: not silently marked On.
  r = run({ workerOk: false });
  r.tap(); await settle();
  if (r.els["remind-state"].textContent !== "Off") throw new Error("should not claim On when the Worker failed");
  console.log("worker unreachable -> stays Off, " + r.els["remind-note"].textContent.slice(0, 40) + "\u2026");

  // 8. Enabling while a subscription already exists in the browser reuses it
  //    rather than minting a second endpoint. This is the case that matters:
  //    the stored "on" flag can be lost (cleared site data, a reinstall) while
  //    the browser subscription survives, and every extra endpoint left behind
  //    is another copy of the same reminder arriving on the same phone.
  //    (Turning it off and on again legitimately needs a new one, because off
  //    calls unsubscribe.)
  const sharedStore = {};
  r = run({ store: sharedStore });
  r.tap(); await settle();
  const firstSubs = r.calls.filter((c) => c.subscribeKeyBytes).length;

  delete sharedStore["estimation-gym-reminder"];   // the flag is gone, the subscription is not
  const r2 = run({ store: sharedStore, existingSubscription: true });
  r2.tap(); await settle();
  const secondSubs = r2.calls.filter((c) => c.subscribeKeyBytes).length;
  console.log("flag lost, sub kept -> browser subscribe calls: " + secondSubs + " (reused, not re-minted)");
  if (secondSubs !== 0) throw new Error("minted a second endpoint for a device that already had one");
  if (!r2.calls.some((c) => c.url && c.url.includes("/subscribe"))) throw new Error("the existing endpoint was not re-registered");

  // 9. Turning it on after already playing tells the Worker so, so no nudge
  //    arrives for a day that is already done.
  const M2 = require(root + "core/Model.js");
  const todayIdx = M2.dayIndex(new Date());
  const alreadyPlayed = M2.recordAnswer(M2.emptyState(), todayIdx, 100, 100, false, "q");
  r = run({ store: { "estimation-gym-state": JSON.stringify(alreadyPlayed) } });
  r.tap(); await settle();
  const playedCall = r.calls.find((c) => c.url && c.url.includes("/played"));
  if (!playedCall) throw new Error("subscribing after playing did not report the day");
  console.log("subscribe after play -> reported day " + JSON.parse(playedCall.body).day);

  console.log("\nsmoke9 passed");
})();
