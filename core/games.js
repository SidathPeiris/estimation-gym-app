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
  },

  // Historical Dates. Same four bands and the same points, so a result card, a
  // streak and a share line all read the same as the other two games - but the
  // distance underneath is absolute rather than logarithmic.
  //
  // It has to be. 1969 and 1970 are a thousandth of a decade apart, so the
  // numeric-log engine would hand a hundred points to any guess in the right
  // century. Model.scoreDate measures years, or days on a question whose
  // source pins it to the day, and Model.PRECISIONS is where each question
  // says which of those it is and how much of a miss is forgivable.
  date: {
    label: "Place it in time",
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

// The day Historical Dates went live, so its first question is its first day
// rather than some arbitrary offset into the bank.
var DATES_SCHEDULE_ORIGIN = 992

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

    // Both live games render into the same screen, because they are the same
    // engine: a number, log-distance scoring, four bands. Sharing it is the
    // point - a second copy of that markup would be a second place for the
    // wording to drift, which is the exact failure renderPractice already
    // demonstrates. A game that needs a genuinely different screen, like
    // Crossword Clues, names a different one here.
    rootId: "game-screen",

    // Two optional parts of the screen, each hidden on any game that does not
    // claim it.
    //
    // practice: this game offers a practice pool, drawn from its own bank and
    //           reserved off its own scheduleOrigin. Every live game has one.
    //           It was Fermi's alone for as long as Fermi was the only bank
    //           big enough for a year's reserve to leave anything over.
    // suggest:  submissions land in one D1 table with no game column, so a
    //           suggestion made from another game would arrive unattributable.
    //           This one really is Fermi's alone.
    practice: true,
    suggest: true,

    // Whether the daily reminder names this game.
    //
    // Not a screen flag - the bell is app-wide and lives on the home screen.
    // This is about the notification's CONTENT: the service worker builds the
    // text itself, with no payload to read, by slicing this game's bank out of
    // its asset and indexing it by scheduleOrigin. sw.test.js pins its copy of
    // that table to every entry marked here, so a game cannot join the
    // reminder in the registry without the worker learning how to read it.
    //
    // A game can be live and sit this out - one whose answer is not a number,
    // or whose bank is too thin to promise a question every morning.
    reminder: true
  },

  // The second game, and the one that proves the platform. It runs on Fermi's
  // engine - the same numeric input, the same log-distance maths, the same
  // four bands, the same result card - and differs in its bank, its name, its
  // streak and its schedule, which is everything a player can see. Share the
  // engine, not the identity.
  {
    id: "records",
    name: "World Records",
    tagline: "The fastest, the furthest, the most. Estimate the record.",
    status: "live",
    icon: "trophy",
    engine: "numeric-log",

    // Namespaced, unlike Fermi's. Fermi's bare key is the legacy exception
    // above; everything after it follows this shape, and the two never touch,
    // so a streak in one game cannot disturb a streak in the other.
    storageKey: "estimation-gym-state:records",

    // The day this went live, so its first question is its first day rather
    // than some arbitrary offset into the bank.
    scheduleOrigin: 991,

    bankGlobal: "RECORDS",
    assets: ["./games/records/questions.js"],

    // Every question id starts with this. The Worker's D1 tables are keyed on
    // a bare question_id with no game column, so the prefix IS the namespace -
    // without it two games' answer distributions merge into one row and cannot
    // be separated afterwards.
    idPrefix: "records-",

    rootId: "game-screen",

    // A practice pool of its own, drawn from this bank and reserved off this
    // game's own schedule origin. No suggestion form: submissions land in one
    // D1 table with no game column, so a suggestion made here would arrive
    // unattributable - see Fermi's entry.
    practice: true,
    suggest: false,

    // Named in the daily reminder alongside Fermi. It was left out while the
    // reminder was Fermi's alone, which meant the second game was never
    // advertised and answering either one silenced the nudge for both.
    reminder: true
  },
  {
    id: "dates",
    name: "Historical Dates",
    tagline: "When did it happen? Scored on how close you get.",
    status: "live",
    icon: "landmark",

    // The first game that is not a reskin of Fermi Questions. Same four bands,
    // same hundred points, same hint cost - and underneath, a distance in
    // years or days rather than in powers of ten, because 1969 and 1970 are a
    // thousandth of a decade apart and the log engine would call that perfect.
    engine: "date",

    storageKey: "estimation-gym-state:dates",
    scheduleOrigin: DATES_SCHEDULE_ORIGIN,
    bankGlobal: "DATES",
    assets: ["./games/dates/questions.js"],
    idPrefix: "dates-",

    // The same screen as the other two. It is a different engine but not a
    // different shape: a prompt, one answer control, a result card, a hint.
    // What differs is which control appears, and app.js chooses that from the
    // question's precision rather than from a second copy of the markup.
    rootId: "game-screen",

    // A practice pool of its own, which on this game means the practice card
    // has to offer the same three answer controls the daily does - a question
    // dated to the day wants a date, everything else wants a year and an era.
    // No suggestion form, for the reason in Fermi's entry. Named in the daily
    // reminder alongside the other two live games.
    practice: true,
    suggest: false,
    reminder: true
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
