// The game registry: what games exist, what each one is called, and where its
// pieces live.
//
// Estimation Gym is the app. Fermi Questions is a game inside it, and for a
// long time they were the same thing. This is the file that stops them being
// the same thing.
//
// Deliberately pure data with no dependencies. It declares the *name* of a
// bank's global and the *path* of its asset rather than the bank itself, so
// loading the registry never pulls in 400KB of questions - which matters
// because games.test.js, the home screen and eventually the router all read it,
// and none of them want a question bank as a side effect.
//
// It follows the ModelAPI convention from Model.js: one declared public
// surface, exported under node and left as a global in the browser, so the two
// cannot drift. app.js explains why that convention exists - twice, a function
// added to the Model was missing from a hand-maintained list and threw
// mid-render, leaving a blank page.

// The mechanics a game can be built on. A game names one; several games can
// share one. Fermi Questions and World Records both run on numeric-log: the
// same numeric input, the same log-distance scoring, the same four bands. They
// differ in their bank, their name, their streak and their schedule - which is
// everything a player can see, and nothing a player needs explaining.
var ENGINES = {
  "numeric-log": {
    label: "Estimate a number",
    // Scored by Model.scoreGuess: distance in powers of ten, four bands,
    // 100/70/40/10 points, halved when a hint was taken.
    scoring: "bands"
  }
}

// Every game names an `icon`. It is a name, not a drawing - the same reason
// this file declares `bankGlobal` rather than the bank. The drawings are CSS
// masks in app.css (`.icon-<name>`), following the chevron's precedent: a mask
// takes currentColor, so one rule themes an icon for light, dark and the muted
// coming-soon state without a second copy. games.test.js pins each name to a
// rule that actually exists, because a missing one renders as a blank square
// rather than as an error.

// Fermi Questions' schedule origin, repeated here as a literal so this file
// stays dependency-free. games.test.js pins it to Model.SCHEDULE_ORIGIN, the
// same way sw.test.js pins the service worker's copy - duplicated constants
// drift, so every copy gets a test rather than a promise.
var FERMI_SCHEDULE_ORIGIN = 982

var GAMES = [
  {
    id: "fermi",
    name: "Fermi Questions",
    tagline: "A real-world quantity to estimate. Scored on how close you get in powers of ten.",
    status: "live",
    engine: "numeric-log",

    // A brain, because the whole game is the reasoning rather than the recall.
    icon: "brain",

    // The legacy unnamespaced key, kept forever and on purpose.
    //
    // Every other game uses "estimation-gym-state:<id>". Fermi keeps the bare
    // name because real players have real streaks under it, and because
    // Model.recordAnswer returns a fresh four-key object rather than spreading
    // state - so anything nested under a new key would be destroyed on the next
    // answer, by any version of the code. One key per game is what makes the
    // multi-game state need no migration at all.
    //
    // Do not "tidy" this to estimation-gym-state:fermi. That would create two
    // sources of truth for one streak, and a player served stale cached code
    // would write to the old one while new code read the new one.
    storageKey: "estimation-gym-state",

    scheduleOrigin: FERMI_SCHEDULE_ORIGIN,
    bankGlobal: "QUESTIONS",
    assets: ["./core/questions.js"],

    // Fermi's question ids shipped unprefixed and cannot be renamed:
    // questions.test.js pins a SHA-256 of the first 1000 ids, and the Worker's
    // D1 tables hold live rows keyed on those exact strings. It is the one
    // allowlisted exception to the id-prefix contract below.
    idPrefix: "",

    rootId: "game-fermi",
    practice: true
  },

  // --- announced, not yet built -------------------------------------------
  //
  // These appear on the home screen as COMING SOON. They carry a name and a
  // tagline and nothing else: no storage key, no bank, no assets. A half-filled
  // entry is worse than an empty one, because it looks ready - so the test
  // asserts these stay empty until the game actually exists.

  {
    id: "records",
    name: "World Records",
    tagline: "The fastest, the furthest, the most. Estimate the record.",
    status: "coming-soon",
    icon: "trophy",
    // Known already: it runs on the same engine as Fermi Questions. Its bank,
    // name, streak and schedule are its own, which is all a player sees.
    engine: "numeric-log"
  },
  {
    id: "dates",
    name: "Historical Dates",
    tagline: "When did it happen? Scored on how close you get.",
    status: "coming-soon",
    icon: "landmark"
  },
  {
    id: "crossword",
    name: "Crossword Clues",
    tagline: "One word, three clues. The fewer you need, the better you score.",
    status: "coming-soon",
    icon: "grid"
  }
]

// Hashes that can never be a game id, because the router already means
// something else by them.
var RESERVED_IDS = ["move", "home"]

function allGames() {
  return GAMES.slice()
}

function liveGames() {
  return GAMES.filter(function (g) { return g.status === "live" })
}

function gameById(id) {
  for (var i = 0; i < GAMES.length; i++) {
    if (GAMES[i].id === id) return GAMES[i]
  }
  return null
}

// Only a live game is routable. A coming-soon id must land on the home screen
// rather than a half-rendered empty one - including when somebody types it, or
// opens a link shared before that game shipped.
function isPlayable(id) {
  var game = gameById(id)
  return !!game && game.status === "live"
}

// The storage key for a game. Declared per game rather than derived, because
// Fermi's is a legacy exception and deriving it would quietly rename it.
function storageKeyFor(game) {
  return game && game.storageKey ? game.storageKey : null
}

var GamesAPI = {
  GAMES: GAMES,
  ENGINES: ENGINES,
  RESERVED_IDS: RESERVED_IDS,
  allGames: allGames,
  liveGames: liveGames,
  gameById: gameById,
  isPlayable: isPlayable,
  storageKeyFor: storageKeyFor
}

if (typeof module !== "undefined") module.exports = GamesAPI
