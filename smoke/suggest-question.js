// The suggest-a-question form, through the real app.js.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const initiallyHidden = new Set(
  [...html.matchAll(/<[a-z]+[^>]*>/g)].map((m) => m[0])
    .filter((tag) => / hidden[ >=]/.test(tag))
    .map((tag) => (tag.match(/id="([^"]+)"/) || [])[1]).filter(Boolean)
);
const M = require(root + "core/Model.js");
const Q = require(root + "core/questions.js");

function run({ store = {}, reply = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }) } = {}) {
  const calls = [];
  const listeners = {};
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "",
    selectionStart: 0, selectionEnd: 0, setSelectionRange(a, b) { this.selectionStart = a; this.selectionEnd = b },
    classList: { add() {}, remove() {}, contains: () => false },
    hasAttribute(k) { return k === "hidden" ? this.hidden : (k in this.attrs) },
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {},
    // A real <form> has reset(); without it the success path threw inside the
    // .then and was reported as a network failure. The shim has no idea which
    // inputs belong to it, so it records the call for the test to assert on
    // rather than pretending to clear them.
    reset() { this.didReset = true }
  });
  const els = {};
  for (const id of ids) { els[id] = makeEl(id); if (initiallyHidden.has(id)) els[id].hidden = true; }
  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent, Date, Uint8Array,
    atob: (b) => Buffer.from(b, "base64").toString("binary"),
    fetch: (url, opts) => { calls.push({ url, opts }); return reply(url, opts) },
    Image: function () { return {} },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v29"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  const fire = (id, ev) => (listeners[id + ":" + ev] || []).forEach((f) => f({ preventDefault() {} }));
  return { els, store, fire, calls };
}

void (async function () {
  // --- the suggest-a-question form -----------------------------------------

  const GOOD = {
    "suggest-prompt": "How many bricks are in the Great Wall of China?",
    "suggest-answer": "3.9e9",
    "suggest-unit": "bricks",
    "suggest-source": "Wall length and typical brick dimensions",
    "suggest-note": "Length times cross-section over the volume of one brick."
  };

  function fill(r, fields) {
    for (const [id, value] of Object.entries(fields)) r.els[id].value = value;
  }

  const ok = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });

  // 1. Collapsed until asked for.
  let r = run();
  if (!r.els["suggest-body"].hidden) throw new Error("suggestions should start collapsed");
  console.log("collapsed          -> yes");

  // 2. Opening it reveals the form.
  r.fire("suggest-toggle", "click");
  if (r.els["suggest-body"].hidden) throw new Error("should open");
  if (r.els["suggest-toggle"].attrs["aria-expanded"] !== "true") throw new Error("aria-expanded not set");
  console.log("opened             -> form visible, aria-expanded=true");

  // 3. An empty form says what is missing and sends nothing at all.
  r.fire("suggest-form", "submit");
  if (!/needed/i.test(r.els["suggest-note-out"].textContent)) {
    throw new Error("expected a 'what is missing' note, got: " + r.els["suggest-note-out"].textContent);
  }
  if (r.calls.length) throw new Error("an incomplete form must not reach the network");
  console.log("empty form         -> " + r.els["suggest-note-out"].textContent);

  // 4. A non-numeric answer is caught before any request is made.
  fill(r, Object.assign({}, GOOD, { "suggest-answer": "about a billion" }));
  r.fire("suggest-form", "submit");
  if (!/positive number/i.test(r.els["suggest-note-out"].textContent)) {
    throw new Error("expected a numeric complaint, got: " + r.els["suggest-note-out"].textContent);
  }
  if (r.calls.length) throw new Error("an unusable answer must not reach the network");
  console.log("bad answer         -> caught locally, nothing sent");

  // 5. A good one posts to /suggest, with the fields the endpoint expects.
  r = run({ reply: ok });
  r.fire("suggest-toggle", "click");
  fill(r, GOOD);
  r.fire("suggest-form", "submit");
  if (r.calls.length !== 1) throw new Error("expected exactly one request, got " + r.calls.length);
  const call = r.calls[0];
  if (!/\/suggest$/.test(call.url)) throw new Error("wrong endpoint: " + call.url);
  if (call.opts.method !== "POST") throw new Error("should be a POST");
  const sent = JSON.parse(call.opts.body);
  for (const k of ["prompt", "answer", "unit", "source", "note"]) {
    if (!sent[k]) throw new Error("missing field in payload: " + k);
  }
  if (sent.prompt !== GOOD["suggest-prompt"]) throw new Error("prompt mangled in transit");
  console.log("good suggestion    -> POST /suggest with all five fields");

  // 6. The reply is repeated back, and the form is cleared for the next one.
  await new Promise((resolve) => setImmediate(resolve));
  if (!/thank you/i.test(r.els["suggest-note-out"].textContent)) {
    throw new Error("expected an acknowledgement, got: " + r.els["suggest-note-out"].textContent);
  }
  if (!r.els["suggest-form"].didReset) throw new Error("the form should be cleared for the next one");
  console.log("accepted           -> " + r.els["suggest-note-out"].textContent);

  // 7. When the endpoint refuses, its reason is shown rather than a generic
  //    failure - the rate limit and the validation messages are worth reading.
  const refusal = "that is enough for today - thank you, try again tomorrow";
  r = run({ reply: () => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: refusal }) }) });
  r.fire("suggest-toggle", "click");
  fill(r, GOOD);
  r.fire("suggest-form", "submit");
  await new Promise((resolve) => setImmediate(resolve));
  if (r.els["suggest-note-out"].textContent !== refusal) {
    throw new Error("the endpoint's reason was not shown: " + r.els["suggest-note-out"].textContent);
  }
  console.log("refused            -> the endpoint's own reason is shown");

  console.log("\nsmoke12 passed");

})().catch((e) => { console.error(e.message); process.exit(1) });
