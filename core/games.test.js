// Checks the game registry, and the contracts a second game depends on.
//
//   node core/games.test.js
//
// Most of this file guards one failure that is genuinely irreversible. The
// Worker's D1 tables - responses, seen, confessions, decade_errors - are all
// keyed on a bare question_id with no game column, and validQuestionId already
// accepts a namespaced id like "records-fastest-100m". So the id prefix *is*
// the namespace. If two games ever ship a question with the same id, their band
// distributions merge into one row and there is no way to separate them
// afterwards, because the rows do not record which game they came from.
//
// It costs one assertion to prevent and cannot be undone once live data lands.

const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")

const Games = require("./games.js")
const Model = require("./Model.js")
const Storage = require("../storage.js")
const Presenter = require("../presenter.js")

const root = path.join(__dirname, "..")
const games = Games.allGames()
const live = Games.liveGames()

assert.ok(games.length >= 1, "the registry is empty")
assert.equal(live.length, 1, "exactly one game is live today: Fermi Questions")

// --- ids ------------------------------------------------------------------

const ids = games.map((g) => g.id)
assert.equal(new Set(ids).size, ids.length, "two games share an id")

for (const g of games) {
  assert.match(
    g.id, /^[a-z0-9]+(-[a-z0-9]+)*$/,
    `game id "${g.id}" is not kebab-case - it has to match the Worker's ` +
    `validQuestionId charset, because question ids are built from it`
  )
  assert.ok(
    !Games.RESERVED_IDS.includes(g.id),
    `game id "${g.id}" is reserved by the router and cannot name a game`
  )
  assert.ok(g.name && g.name.trim(), `game "${g.id}" has no name`)
  assert.ok(g.tagline && g.tagline.trim(), `game "${g.id}" has no tagline`)
  assert.ok(
    g.status === "live" || g.status === "coming-soon",
    `game "${g.id}" has status "${g.status}", which is neither live nor coming-soon`
  )
}

// --- the id-prefix contract ----------------------------------------------
//
// Fermi is the single allowlisted exception: its ids shipped unprefixed, and
// questions.test.js pins a SHA-256 of the first 1000 of them, so they cannot be
// renamed even if we wanted to.
for (const g of live) {
  const expected = g.id === "fermi" ? "" : g.id + "-"
  assert.equal(
    g.idPrefix, expected,
    `game "${g.id}" must prefix its question ids with "${expected}". Without ` +
    `that, two games can ship the same question id and their distributions ` +
    `merge into one row in D1 - which cannot be undone once real answers land.`
  )
}

// --- a coming-soon game carries nothing it cannot yet honour ---------------
//
// A half-filled entry is worse than an empty one: it looks ready. If a bank or
// a storage key appears here, something has been half-wired and the home screen
// would offer a game that cannot be played.
for (const g of games.filter((x) => x.status === "coming-soon")) {
  for (const field of ["storageKey", "bankGlobal", "assets", "rootId", "scheduleOrigin"]) {
    assert.equal(
      g[field], undefined,
      `coming-soon game "${g.id}" declares ${field}. Either it is ready and ` +
      `its status should say so, or it is not and this should not be here.`
    )
  }
  assert.equal(Games.isPlayable(g.id), false, `"${g.id}" is not live but reports as playable`)
}

// --- a live game carries everything it needs ------------------------------

for (const g of live) {
  for (const field of ["storageKey", "bankGlobal", "assets", "rootId", "scheduleOrigin", "engine"]) {
    assert.ok(g[field] !== undefined, `live game "${g.id}" is missing ${field}`)
  }
  assert.ok(Array.isArray(g.assets) && g.assets.length, `live game "${g.id}" declares no assets`)
  assert.equal(typeof g.scheduleOrigin, "number", `live game "${g.id}" has a non-numeric origin`)
  assert.equal(Games.isPlayable(g.id), true, `live game "${g.id}" does not report as playable`)
}

const keys = live.map((g) => g.storageKey)
assert.equal(new Set(keys).size, keys.length, "two live games share a storage key")

// --- every declared engine is real ----------------------------------------

for (const g of games) {
  if (g.engine === undefined) continue
  assert.ok(
    Games.ENGINES[g.engine],
    `game "${g.id}" declares engine "${g.engine}", which is not in ENGINES`
  )
}

// --- every icon a game names is actually drawn ----------------------------
//
// The registry names an icon; app.css draws it as a mask under `.icon-<name>`.
// A name with no rule behind it is not an error anywhere - the element renders
// as an empty 22px square, on the one screen every player starts from. So the
// two halves are pinned together here, the same way the engine names are.
{
  const css = readFileSync(path.join(root, "app.css"), "utf8")
  const drawn = new Set(
    [...css.matchAll(/^\.icon-([a-z0-9-]+)\s*\{/gm)].map((m) => m[1])
  )
  assert.ok(drawn.size, "app.css declares no .icon-* rules at all")

  for (const g of games) {
    assert.ok(
      g.icon && g.icon.trim(),
      `game "${g.id}" names no icon, so its home card would sit unlabelled ` +
      `beside three that are not`
    )
    assert.ok(
      drawn.has(g.icon),
      `game "${g.id}" names icon "${g.icon}", but app.css has no ` +
      `.icon-${g.icon} rule - it would render as a blank square rather than ` +
      `as anything that looks broken`
    )
  }
}

// --- the duplicated constants, pinned to their sources --------------------
//
// games.js is deliberately dependency-free, so it repeats three values that
// live elsewhere. Every copy gets a test rather than a promise.

const fermi = Games.gameById("fermi")
assert.ok(fermi, "the fermi game is missing from the registry")

assert.equal(
  fermi.scheduleOrigin, Model.SCHEDULE_ORIGIN,
  "the registry and Model.js disagree about when the Fermi schedule was frozen"
)

assert.equal(
  fermi.storageKey, Storage.STORAGE_KEY,
  "the registry and storage.js disagree about where Fermi's history is kept - " +
  "which would mean real players' streaks living at one key and being read " +
  "from another"
)

assert.equal(
  fermi.name, Presenter.GAME_NAME,
  "the registry and presenter.js disagree about what the game is called, so " +
  "the share card would name something the home screen does not"
)

// --- every live asset is precached ----------------------------------------
//
// sw.js's ASSETS is a literal array and cannot be generated from the registry
// at runtime - the service worker refuses importScripts for a documented
// reason. So adding a game means adding its bank here by hand, and forgetting
// is the failure this catches: the game would 404 offline while working
// perfectly online, which is the hardest kind to notice.
{
  const sw = readFileSync(path.join(root, "sw.js"), "utf8")
  const open = sw.indexOf("var ASSETS = [")
  const close = sw.indexOf("]", open)
  const precached = sw.slice(open, close)
    .split("\n").map((l) => l.trim())
    .filter((l) => l.startsWith('"'))
    .map((l) => l.split('"')[1])

  assert.ok(
    precached.includes("./core/games.js"),
    "the registry itself is not precached, so it is unavailable offline"
  )

  for (const g of live) {
    for (const asset of g.assets) {
      assert.ok(
        precached.includes(asset),
        `live game "${g.id}" needs ${asset}, which is not in sw.js's ASSETS - ` +
        `it would work online and 404 offline`
      )
    }
  }
}

console.log(
  `registry: ${games.length} games, ${live.length} live (${live.map((g) => g.name).join(", ")})`
)
console.log(
  `coming soon: ${games.filter((g) => g.status === "coming-soon").map((g) => g.name).join(", ")}`
)
console.log("all registry checks passed.")
