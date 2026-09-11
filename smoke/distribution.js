// Drives the real app.js through the distribution flow against a stub
// endpoint.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const M = require(root + "core/Model.js");

function run({ store = {}, endpoint = "", serverCounts = null } = {}) {
  const listeners = {}, docListeners = {};
  const calls = [];
  const makeEl = (id) => {
    const el = {
      id, textContent: "", className: "", dataset: {}, style: {}, children: [],
      hidden: false, attrs: {}, value: "", placeholder: "", title: "",
      classList: { add(c) { el.className += " " + c }, contains: (c) => el.className.includes(c) },
      setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
      removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
      append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
      replaceChildren(...c) { this.children = c },
      addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
      focus() {}
    };
    return el;
  };
  const els = {}; for (const id of ids) els[id] = makeEl(id);

  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent,
    Image: function () { return {} },
    fetch: (url, opts) => {
      calls.push({ url, method: (opts && opts.method) || "GET", body: opts && opts.body });
      if (!serverCounts) return Promise.resolve({ ok: false });
      return Promise.resolve({ ok: true, json: () => Promise.resolve(serverCounts) });
    },
    document: {
      hidden: false, addEventListener(ev, fn) { (docListeners[ev] = docListeners[ev] || []).push(fn) },
      getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">")
    },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v14"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);

  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"]) {
    let code = fs.readFileSync(root + f, "utf8");
    if (f === "app.js") {
      const before = code;
      code = code.replace(/var DISTRIBUTION_URL = "[^"]*"/, 'var DISTRIBUTION_URL = "' + endpoint + '"');
      if (code === before) throw new Error("could not configure DISTRIBUTION_URL");
    }
    vm.runInContext(code, sandbox, { filename: f });
  }
  return {
    els, store, calls,
    submit(v) { els["guess-input"].value = v; (listeners["guess-form:submit"] || []).forEach((f) => f({ preventDefault() {} })); },
    click(id) { (listeners[id + ":click"] || []).forEach((f) => f({ preventDefault() {} })); }
  };
}

const settle = () => new Promise((r) => setImmediate(r));

(async () => {
  // 1. Disabled by default: answering makes no network call at all.
  let r = run();
  r.submit("1000");
  await settle();
  if (r.calls.length !== 0) throw new Error("made " + r.calls.length + " request(s) with no endpoint set");
  if (!r.els.dist.hidden) throw new Error("the chart should stay hidden when disabled");
  console.log("disabled          -> 0 requests, chart hidden");

  // 2. Configured: answering submits question id + band, and nothing else.
  const server = { questionId: "x", n: 40, enough: true, counts: { Bullseye: 4, Close: 16, Ballpark: 14, Off: 6 } };
  r = run({ endpoint: "https://w.example", serverCounts: server });
  r.submit("1000");
  await settle(); await settle();
  const post = r.calls.find((c) => c.method === "POST");
  if (!post) throw new Error("no submission made");
  const sent = JSON.parse(post.body);
  console.log("submitted         -> " + JSON.stringify(sent));
  // The contract, and nothing beyond it. "decades" joined in 1.4.0 because the
  // band alone cannot separate a hard question from a mistyped one; it is the
  // whole number of powers of ten, which is coarser than the guess.
  if (Object.keys(sent).sort().join(",") !== "band,decades,questionId") throw new Error("payload carries more than it should: " + Object.keys(sent).join(","));
  if (String(post.body).includes("1000")) throw new Error("the guess itself was sent");
  if (!Number.isInteger(sent.decades) || sent.decades < 0 || sent.decades > 20) throw new Error("decades must be a whole number 0-20, got " + sent.decades);
  // The point of flooring: a decade of 3 could be any guess across a 10x span,
  // so it cannot be walked back to the number that was typed.
  if (String(sent.decades).includes(".")) throw new Error("decades was not floored");

  // 3. The chart renders, with the player's own band marked.
  if (r.els.dist.hidden) throw new Error("chart did not appear");
  console.log("chart             -> " + r.els["dist-summary"].textContent);
  const rows = r.els["dist-bars"].children.map((row) =>
    row.children[0].textContent + " " + row.children[2].textContent);
  console.log("bars              -> " + rows.join(" | "));
  if (r.els["dist-bars"].children.length !== M.BANDS.length) throw new Error("wrong number of bars");
  const mine = r.els["dist-bars"].children.filter((row) => row.className.includes("mine"));
  if (mine.length !== 1) throw new Error("expected exactly one band marked as mine");
  console.log("comparison        -> " + r.els["dist-note"].textContent);
  if (!/better than \d+% of them/.test(r.els["dist-note"].textContent)) throw new Error("no comparison line");

  // 4. First responder: the chart appears, but is not dressed up as a
  //    comparison, because the only response in it is their own.
  r = run({ endpoint: "https://w.example", serverCounts: { questionId: "x", n: 1, enough: true, counts: { Bullseye: 0, Close: 0, Ballpark: 0, Off: 1 } } });
  r.submit("1000");
  await settle(); await settle();
  if (r.els["dist-bars"].children.length !== 4) throw new Error("expected the chart at n=1");
  if (/better than/.test(r.els["dist-note"].textContent)) throw new Error("compared the player against themselves");
  console.log("first responder   -> " + r.els["dist-summary"].textContent + " | " + r.els["dist-note"].textContent);

  // 4b. Nothing answered yet: no bars, and it says so.
  r = run({ endpoint: "https://w.example", serverCounts: { questionId: "x", n: 0, enough: false, minimum: 1 } });
  r.submit("1000");
  await settle(); await settle();
  if (r.els["dist-bars"].children.length !== 0) throw new Error("drew bars with no data");
  console.log("nothing yet       -> " + r.els["dist-note"].textContent);

  // 5. Endpoint down: the puzzle is unaffected.
  r = run({ endpoint: "https://w.example", serverCounts: null });
  r.submit("1000");
  await settle(); await settle();
  if (r.els.result.hidden) throw new Error("a failed request broke the result");
  if (!r.els.dist.hidden) throw new Error("chart should stay hidden when the request fails");
  console.log("endpoint down     -> result still shown, chart hidden, no error surfaced");

  console.log("\nsmoke6 passed");
})();
