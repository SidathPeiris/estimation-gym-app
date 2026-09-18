// Checks the hash router through the real app.js.
//
// Routing is hash-only for a reason worth restating: a query string would miss
// the service worker's precached "./" entry, because the cache key includes the
// query, and a path would need its own precache entry, which version.test.js
// forbids. A fragment never reaches the network, so the navigation URL stays
// exactly "./" and offline behaviour is untouched.
//
// The cases here are the ones that would otherwise ship broken - an id for a
// game that does not exist yet, a runtime with no location at all, and the
// move link still working now that something else also owns the fragment.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const initiallyHidden = new Set(
  [...html.matchAll(/<[a-z]+[^>]*>/g)].map((m) => m[0])
    .filter((tag) => / hidden[ >=]/.test(tag))
    .map((tag) => (tag.match(/id="([^"]+)"/) || [])[1]).filter(Boolean)
);

// `location: null` means "this runtime cannot navigate", which is a different
// thing from an empty hash and must behave differently.
function run({ hash = "", store = {}, noLocation = false } = {}) {
  const listeners = {};
  let replaced = 0;
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "", type: "",
    classList: { add() {}, remove() {}, contains: () => false, toggle() {} },
    hasAttribute(k) { return k === "hidden" ? this.hidden : (k in this.attrs) },
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}
  });
  const els = {};
  for (const id of ids) { els[id] = makeEl(id); if (initiallyHidden.has(id)) els[id].hidden = true; }

  const loc = { hash, search: "", pathname: "/", reload() {} };
  const win = {
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v) },
      removeItem: (k) => { delete store[k] }
    },
    history: { replaceState() { replaced++ } },
    navigator: {}, matchMedia: () => ({ matches: false }),
    addEventListener(ev, fn) { (listeners["window:" + ev] = listeners["window:" + ev] || []).push(fn) }
  };
  if (!noLocation) win.location = loc;

  // acceptMovedHistory decodes the payload with atob + escape, so the sandbox
  // has to supply both or the move link silently does nothing.
  win.atob = (b) => Buffer.from(b, "base64").toString("binary");

  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, Date,
    encodeURIComponent, decodeURIComponent, escape, unescape,
    Image: function () { return {} },
    fetch: () => Promise.resolve({ ok: false }),
    document: {
      hidden: false, addEventListener() {},
      getElementById: (id) => els[id] || null,
      createElement: (t) => makeEl("<" + t + ">")
    },
    window: win, navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/games.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });

  const fire = (id, ev) => (listeners[id + ":" + ev] || []).forEach((fn) => fn({ preventDefault() {} }));
  const fireWindow = (ev) => (listeners["window:" + ev] || []).forEach((fn) => fn({}));
  return { els, fire, fireWindow, loc, store, replaced: () => replaced };
}

const G = require(root + "core/games.js");
const onHome = (r) => !r.els.home.hidden && r.els["game-fermi"].hidden;
const onGame = (r) => r.els.home.hidden && !r.els["game-fermi"].hidden;

// 1. No hash is the landing page.
let r = run({ hash: "" });
if (!onHome(r)) throw new Error("an empty hash should land on the home screen");
if (!r.els["home-list"].children.length) throw new Error("the home screen rendered no cards");
console.log("no hash            -> home, " + r.els["home-list"].children.length + " cards");

// 2. #fermi is the game.
r = run({ hash: "#fermi" });
if (!onGame(r)) throw new Error("#fermi should open Fermi Questions");
console.log("#fermi             -> the game");

// 3. A coming-soon id must not open a half-rendered empty screen. This is the
//    case that ships broken if nobody checks it: the card says COMING SOON, but
//    nothing stops someone typing the id or opening a link shared later.
for (const g of G.allGames().filter((x) => x.status === "coming-soon")) {
  const probe = run({ hash: "#" + g.id });
  if (!onHome(probe)) throw new Error("#" + g.id + " is not built and must land on home");
  if (!probe.replaced()) throw new Error("#" + g.id + " should be tidied out of the address bar");
}
console.log("coming-soon ids    -> home, hash cleaned (" +
  G.allGames().filter((x) => x.status === "coming-soon").map((g) => g.id).join(", ") + ")");

// 4. Anything else lands on home and is cleaned away.
r = run({ hash: "#nonsense" });
if (!onHome(r)) throw new Error("an unknown hash should land on home");
if (!r.replaced()) throw new Error("an unknown hash should be stripped");
console.log("unknown hash       -> home, cleaned");

// 5. A runtime with no location renders the game rather than the home screen.
//    An empty hash is a browser saying "no game chosen"; no location at all is
//    a runtime that cannot navigate, and the honest behaviour there is the one
//    from before routing existed.
r = run({ noLocation: true });
if (!onGame(r)) throw new Error("with no location the app should still render the puzzle");
console.log("no location at all -> the game, as before routing existed");

// 6. hashchange re-renders rather than needing a reload.
r = run({ hash: "#fermi" });
if (!onGame(r)) throw new Error("expected to start on the game");
r.loc.hash = "";
r.fireWindow("hashchange");
if (!onHome(r)) throw new Error("hashchange did not move to the home screen");
r.loc.hash = "#fermi";
r.fireWindow("hashchange");
if (!onGame(r)) throw new Error("hashchange did not move back to the game");
console.log("hashchange         -> both directions, no reload");

// 7. The back control returns to the chooser.
r = run({ hash: "#fermi" });
r.fire("back-to-games", "click");
if (!onHome(r)) throw new Error("the back control did not return to the home screen");
console.log("back to games      -> home");

// 8. The move link still works. It owned the fragment first, and a migrating
//    player should land on the whole app rather than one game inside it.
{
  const M = require(root + "core/Model.js");
  const played = M.recordAnswer(M.emptyState(), M.dayIndex(new Date()) - 1, 100, 100);
  const payload = Buffer.from(JSON.stringify(played), "utf8").toString("base64");
  const moved = run({ hash: "#move=" + payload });
  if (!onHome(moved)) throw new Error("a move link should land on the home screen");
  const restored = JSON.parse(moved.store["estimation-gym-state"] || "{}");
  if (!restored.history) throw new Error("the move link did not import a history");
  console.log("#move= link        -> history imported, lands on home");
}

console.log("\nsmoke16 passed");
