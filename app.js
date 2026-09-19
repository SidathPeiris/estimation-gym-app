(function () {
  "use strict"

  // core/Model.js and core/questions.js load as classic scripts and expose
  // their declarations globally - a shape inherited from being shared with the
  // Omarchy widget, which is now finished and no longer a constraint on how
  // they are written. Collect them into one object matching the shape presenter.js and
  // storage.js expect, which is also the shape require() gives them under node.
  // core/Model.js declares its public surface as ModelAPI and exports that same
  // object under node, so there is no hand-maintained list here to fall out of
  // step. Twice already a function added to the Model was missing from a list
  // in this file, which threw mid-render and left a blank page.
  if (typeof ModelAPI === "undefined") {
    document.getElementById("prompt").textContent =
      "Setup error: core/Model.js did not load"
    return
  }
  var Model = ModelAPI

  var el = {}
  var ids = ["puzzle", "streak", "asof", "prompt", "guess-form", "guess-input", "guess-go",
             "exp",
             "error", "result", "band", "points", "guess-line", "actual-line",
             "decades-line", "decades-ruler", "decades-fill", "share", "hint", "source",
             "dist", "dist-summary", "dist-bars", "dist-note",
             "hint-toggle", "hint-confirm", "hint-confirm-yes", "hint-confirm-no",
             "strategy", "strategy-label", "strategy-guidance", "approach",
             "build", "remind", "remind-state", "remind-note",
             "howto", "howto-toggle", "howto-chev", "howto-body",
             "moved", "moved-go", "moved-note", "dist-percentile",
             "confess", "confess-body", "confess-yes", "confess-no", "dist-confessed",
             "suggest", "suggest-toggle", "suggest-chev", "suggest-body", "suggest-form",
             "suggest-prompt", "suggest-answer", "suggest-unit", "suggest-source",
             "suggest-note", "suggest-exp", "suggest-go", "suggest-note-out",
             "howto-steps", "howto-intro", "howto-scoring", "howto-notes",
             "howto-reminder", "howto-reminder-title", "howto-reminder-intro",
             "howto-reminder-steps", "howto-reminder-notes",
             "history", "history-toggle", "history-chev", "history-summary",
             "history-body", "history-list", "history-more",
             "stats", "stats-toggle", "chev", "stats-summary", "stats-body",
             "bars", "stats-footer", "calibration", "export",
             "restore-toggle", "restore-panel", "restore-input", "restore-go", "restore-note",
             "arch", "arch-headline", "arch-rows", "arch-note",
             "practice", "practice-toggle", "practice-chev", "practice-body", "practice-intro",
             "practice-prompt", "practice-asof", "practice-form", "practice-input", "practice-exp",
             "practice-go", "practice-error", "practice-result", "practice-band", "practice-points",
             "practice-guess-line", "practice-actual-line", "practice-decades",
             "practice-decades-ruler", "practice-decades-fill",
             "practice-approach", "practice-hint", "practice-source", "practice-next",
             "practice-offer",
             "home", "home-intro", "home-list", "game-screen", "back-to-games",
             "game-name", "game-icon"]
  ids.forEach(function (id) { el[id] = document.getElementById(id) })

  // Bank global name -> the bank. The registry declares the NAME so that
  // reading it never drags in 400KB of questions; this is where the name turns
  // back into the array.
  //
  // Written out rather than looked up. `window[name]` does not reach a classic
  // script's top-level `var` inside the smoke harnesses' sandbox, and
  // new Function is refused outright by the Content-Security-Policy, which
  // says script-src 'self' with no hashes and means it. Two entries is not a
  // burden and core/games.test.js pins every live game's bankGlobal to a key
  // here - a missing one renders an empty card and throws nothing at all.
  var BANKS = {
    "QUESTIONS": typeof QUESTIONS !== "undefined" ? QUESTIONS : null,
    "RECORDS": typeof RECORDS !== "undefined" ? RECORDS : null
  }

  // Recomputed whenever the app comes back to the foreground, not fixed for
  // the life of the page. An installed copy is resumed from memory rather than
  // reloaded, so a phone left open overnight would otherwise still be showing
  // yesterday's question - and would record an answer against yesterday.
  var today = Model.dayIndex(new Date())

  // --- which game is on screen --------------------------------------------
  //
  // These four were Fermi's singletons until World Records arrived. They are
  // now "whichever game is being played", swapped by selectGame() when the
  // route changes. Nothing downstream needed rewriting: the ~90 writes in
  // render() all read `question`, `state` and the view model built from them,
  // so they never knew which game they were rendering in the first place.
  //
  // That is the whole reason World Records was built second. It differs from
  // Fermi in its content and nothing else, so it forces this parameterisation
  // against the easiest possible case - rather than letting a genuinely
  // different game discover that the renderer was never game-agnostic.
  var game = GamesAPI.gameById("fermi")
  var bank = BANKS[game.bankGlobal]
  var question = Model.questionForDay(today, bank, game.scheduleOrigin)
  var state = loadState(Model, window.localStorage, game)

  // Per game, not per screen. Taking a hint is a fact about today's Fermi
  // question, so walking to World Records and back must not hand it back
  // unclaimed. Still not persisted - a reload forgets it, exactly as it always
  // has - because an unanswered hint is a state of the session, not of the day.
  var hintShownFor = {}
  var hintConfirmingFor = {}

  // Swap everything that belongs to one game. Guarded so re-selecting the game
  // already on screen keeps its unsaved screen state.
  function selectGame(id) {
    if (game && game.id === id) return
    var next = GamesAPI.gameById(id)
    if (!next || !GamesAPI.isPlayable(id)) return
    game = next
    bank = BANKS[game.bankGlobal]
    question = Model.questionForDay(today, bank, game.scheduleOrigin)
    state = loadState(Model, window.localStorage, game)

    // The answer box belongs to the question, and the question just changed.
    //
    // Both games share one input, because they share one screen. Nothing ever
    // cleared it, which never showed while there was one game: answer the day
    // and the form hides until tomorrow. With two, a guess typed into Fermi
    // was still sitting there on World Records - offered back as if it were
    // yours for this question.
    //
    // The second effect was worse and entirely invisible. applyUpdate() holds
    // back a service worker reload while a guess is half-typed, so a stale
    // value meant the app quietly stopped taking new versions until the player
    // cleared the box themselves. A leftover character could strand someone on
    // an old build indefinitely.
    el["guess-input"].value = ""
    show(el.error, false)
  }

  // --- Debug reset -------------------------------------------------------
  // ?reset=today  un-answers today, leaving the rest of the history intact
  // ?reset=all    wipes history, streak and all, back to a first run
  //
  // Applied before the first render, then stripped from the address bar, so a
  // reload or an accidentally bookmarked URL cannot silently wipe again. An
  // installed copy opens at start_url with no query string, so reach for this
  // in the browser rather than from the home screen.
  applyReset()

  var statsOpen = false
  var historyOpen = false
  var historyLimit = HISTORY_PAGE   // 0 means show every day played

  // Has the hint been taken on the game currently on screen? The score reads
  // this one.
  function hintShown() { return !!hintShownFor[game.id] }

  // Has it been asked for but not yet confirmed? Kept separate from the above
  // because until it is confirmed nothing about the day has changed and
  // backing out costs nothing.
  function hintConfirming() { return !!hintConfirmingFor[game.id] }

  // --- Practice ------------------------------------------------------------
  //
  // A separate pool and a separate verb. Nothing here is recorded against the
  // streak, the stats or the shared distribution - it exists so a new player
  // is not limited to one go a day while deciding whether they like this.
  var PRACTICE_KEY = "estimation-gym-practised"
  var practiceOpen = false
  var practiceQuestion = null
  var practiceResult = null

  // --- Shared distribution ------------------------------------------------
  //
  // Where the per-question band distribution is collected. Empty means the
  // feature is off and the app makes no request for it at all, which is the
  // default: nothing is shared until a destination is configured here.
  //
  // What gets sent is the question id and which of the four bands you landed
  // in. Not your guess, not the answer, no identifier. See worker/ for the
  // endpoint that receives it.
  var DISTRIBUTION_URL = "https://estimation-gym-distribution.estimationgym.workers.dev"

  // The application server key the browser is given when subscribing. Public
  // by design: it says who may push, and is useless without the private half,
  // which only the Worker holds.
  var VAPID_PUBLIC_KEY = "BHoIQ7xp8tGkF9-AoMc9_uN7e610XZ1GxXCYjk495Z_CBLeHO0YZIk0OjXgFn8bxs1mvxY5dANO6XDjN8BDdEZ0"
  var REMIND_KEY = "estimation-gym-reminder"

  // questionId -> last payload seen. Cleared on nothing: a distribution is
  // cheap to hold and the app is a single screen.
  var distCache = {}
  var distInFlight = {}
  var distFetchedAt = {}

  // How long a fetched distribution is treated as current. Coming back to the
  // app re-reads it if it is older than this, so the count reflects people who
  // answered while you were away rather than freezing at whatever it was when
  // the page first loaded. Long enough that flicking between apps does not
  // produce a request per switch.
  var DIST_MAX_AGE_MS = 60000
  var openHistoryDay = null
  // Open on a first visit, where "how to play" is the whole question, and
  // collapsed thereafter so it stays out of the way of the daily puzzle.
  var howToOpen = !hasAnsweredAnything(state)
  var suggestOpen = false

  function applyReset() {
    var mode = null
    try {
      mode = new URLSearchParams(window.location.search).get("reset")
    } catch (e) {
      return
    }
    if (mode !== "today" && mode !== "all") return

    state = mode === "all" ? Model.emptyState() : forgetDay(state, today)
    saveState(state, window.localStorage, game)

    try {
      window.history.replaceState(null, "", window.location.pathname)
    } catch (e) {
      // Not fatal - the reset already applied; the URL just stays dirty.
    }
  }

  // Submitting also returns the current picture, so answering costs one round
  // trip rather than two. Every failure path is silent and leaves the puzzle
  // untouched - offline play must not look broken.
  // --- Daily reminder ------------------------------------------------------
  //
  // Entirely opt-in, and off unless someone turns it on. What is sent is the
  // push endpoint the browser generates and the device's timezone offset, so
  // the nudge lands in the morning rather than the middle of the night. No
  // guess, no score, no history.

  function pushSupported() {
    return !!(DISTRIBUTION_URL && VAPID_PUBLIC_KEY &&
      typeof Notification !== "undefined" &&
      typeof navigator !== "undefined" && "serviceWorker" in navigator &&
      typeof PushManager !== "undefined")
  }

  // base64url, as subscribe() wants it: raw bytes.
  function vapidKeyBytes(key) {
    var padded = key + "===".slice(0, (4 - key.length % 4) % 4)
    var raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"))
    var out = new Uint8Array(raw.length)
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
    return out
  }

  function remindEnabled() {
    try { return window.localStorage.getItem(REMIND_KEY) === "on" } catch (e) { return false }
  }

  function setRemindEnabled(on) {
    try { window.localStorage.setItem(REMIND_KEY, on ? "on" : "off") } catch (e) {}
  }

  function tellWorker(path, body) {
    if (!DISTRIBUTION_URL || !canFetch()) return Promise.resolve(false)
    return fetch(DISTRIBUTION_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.ok }).catch(function () { return false })
  }

  function currentSubscription() {
    if (!pushSupported()) return Promise.resolve(null)
    return navigator.serviceWorker.ready
      .then(function (reg) { return reg.pushManager.getSubscription() })
      .catch(function () { return null })
  }

  // Every live game's state, reusing the one already in hand rather than
  // re-reading it. The reminder covers the app, so both facts it depends on -
  // whether the day is finished and how long the run is - are questions about
  // all the games rather than about Fermi.
  function liveStates() {
    return GamesAPI.liveGames().map(function (g) {
      return g.id === game.id ? state : loadState(Model, window.localStorage, g)
    })
  }

  function allGamesAnswered(day) {
    return liveStates().every(function (s) { return Model.hasAnsweredDay(s, day) })
  }

  function setRemindNote(text) {
    setText(el["remind-note"], text)
    show(el["remind-note"], !!text)
  }

  function renderRemind() {
    var on = remindEnabled()
    // One bell for the whole app, on the screen that is about the whole app.
    //
    // It used to sit in the Fermi header and be hidden everywhere else,
    // because the push named a Fermi question and a bell on World Records
    // would have promised a reminder about a different game. The push now
    // names every live game, so the setting stopped being a property of
    // whichever screen you were on - and the screen that is about the app
    // rather than about one game is the one listing them.
    show(el.remind, pushSupported())
    setText(el["remind-state"], on ? "On" : "Off")
    // Drives the accent styling, so "On" is visible at a glance in the corner.
    el.remind.setAttribute("data-on", String(on))
  }

  function enableReminder() {
    setRemindNote("Asking your browser for permission\u2026")
    return Notification.requestPermission().then(function (permission) {
      if (permission !== "granted") {
        setRemindEnabled(false)
        setRemindNote(permission === "denied"
          ? "Notifications are blocked for this site. You would have to allow them in your browser settings."
          : "Not enabled \u2014 permission was not granted.")
        renderRemind()
        return
      }
      return navigator.serviceWorker.ready.then(function (reg) {
        // Reuse the subscription this browser already has rather than asking
        // for another. Subscribing repeatedly can mint a fresh endpoint each
        // time, and every one left behind is another copy of the same
        // reminder arriving on the same phone.
        return reg.pushManager.getSubscription().then(function (existing) {
          if (existing) return existing
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKeyBytes(VAPID_PUBLIC_KEY)
          })
        })
      }).then(function (sub) {
        return tellWorker("/subscribe", {
          endpoint: sub.endpoint,
          tzOffset: new Date().getTimezoneOffset()
        }).then(function (ok) {
          // Turning the reminder on after already playing should not earn a
          // nudge for a day that is done. The Worker only learns this when a
          // day is answered, which has already happened by now.
          if (ok && allGamesAnswered(today)) {
            return tellWorker("/played", { endpoint: sub.endpoint, day: today }).then(function () { return ok })
          }
          return ok
        })
      }).then(function (ok) {
        setRemindEnabled(!!ok)
        setRemindNote(ok
          ? "One nudge a day, around 9am, and none on a day you have already played."
          : "Could not reach the reminder service. Try again later.")
        renderRemind()
      })
    }).catch(function () {
      setRemindEnabled(false)
      setRemindNote("Could not turn reminders on.")
      renderRemind()
    })
  }

  // Whether reminders are on is remembered in localStorage, but the thing
  // that actually delivers one is a row on the Worker - and those two drift
  // apart silently.
  //
  // Observed on 10 September: four stale endpoints for one phone were reported
  // dead by the push service and correctly deleted, which left the panel still
  // saying "on" with nothing on the server to send to. No nudge could ever
  // arrive, and nothing in the app said so. Browsers also rotate push
  // endpoints on their own, which produces the same silence.
  //
  // So the subscription is re-asserted every time the app opens. /subscribe is
  // idempotent and permission has already been granted, so this is invisible
  // when nothing is wrong and self-healing when something is.
  function reassertReminder() {
    if (!remindEnabled() || !pushSupported()) return

    // Permission can be revoked in browser settings without the app hearing
    // about it. Say so rather than going on claiming reminders are on.
    if (Notification.permission !== "granted") {
      setRemindEnabled(false)
      setRemindNote("Notifications are no longer allowed for this site, so the daily reminder is off.")
      renderRemind()
      return
    }

    navigator.serviceWorker.ready.then(function (reg) {
      return reg.pushManager.getSubscription().then(function (existing) {
        if (existing) return existing
        // The browser dropped it. Permission still stands, so this does not
        // prompt - it re-establishes what the panel already claims.
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKeyBytes(VAPID_PUBLIC_KEY)
        })
      })
    }).then(function (sub) {
      if (!sub) return
      return tellWorker("/subscribe", {
        endpoint: sub.endpoint,
        tzOffset: new Date().getTimezoneOffset()
      }).then(function (ok) {
        // A healed subscription must not earn a nudge for a day already done.
        if (ok && allGamesAnswered(today)) {
          return tellWorker("/played", { endpoint: sub.endpoint, day: today })
        }
      })
    }).catch(function () {
      // Deliberately silent. The panel is unchanged and the next open retries.
    })
  }

  function disableReminder() {
    return currentSubscription().then(function (sub) {
      if (!sub) return true
      var endpoint = sub.endpoint
      return sub.unsubscribe().catch(function () { return false })
        .then(function () { return tellWorker("/unsubscribe", { endpoint: endpoint }) })
    }).then(function () {
      setRemindEnabled(false)
      setRemindNote("Reminders off.")
      renderRemind()
    })
  }

  // Lets the reminder be skipped on a day already played. Only ever sent by a
  // device that asked to be reminded in the first place.
  function reportPlayed(day) {
    if (!remindEnabled()) return
    // Only once there is nothing left to play. Telling the Worker the day was
    // done because one game was answered would silence a nudge about a game
    // the player has not opened.
    if (!allGamesAnswered(day)) return
    currentSubscription().then(function (sub) {
      if (sub) tellWorker("/played", { endpoint: sub.endpoint, day: day })
    })
  }

  // The numeric keypad a phone shows for inputmode="decimal" has no "e", so
  // scientific notation - which the guide tells people to use, and which the
  // answers genuinely need, spanning 10^-11 to 10^80 - would be unreachable on
  // the device most people play on. Shared by the daily field and practice.
  function insertExponent(input) {
    var value = String(input.value)

    // One exponent only; "3e4e5" is not a number and the field would just
    // reject it later with no explanation.
    if (value.toLowerCase().indexOf("e") >= 0) return

    var start = typeof input.selectionStart === "number" ? input.selectionStart : value.length
    var end = typeof input.selectionEnd === "number" ? input.selectionEnd : value.length
    input.value = value.slice(0, start) + "e" + value.slice(end)

    // Keep the keypad up and the caret after the "e", ready for the exponent.
    try {
      input.focus()
      if (input.setSelectionRange) input.setSelectionRange(start + 1, start + 1)
    } catch (e) {
      // Focus handling is a convenience; the character is already inserted.
    }
  }

  // Sends a suggested question to the Worker, where it lands as pending. It
  // is never served to anyone from here - every suggestion is checked and
  // appended to the bank by hand, because the bank carries the answers and an
  // unchecked one would mark a correct guess as wrong.
  //
  // Unlike tellWorker, the reply body matters: the endpoint explains what it
  // refused and why, and repeating that is far more use than "failed".
  function sendSuggestion(event) {
    if (event) event.preventDefault()
    if (!DISTRIBUTION_URL || !canFetch()) {
      return setSuggestNote("No connection - suggestions need one.")
    }

    var payload = {
      prompt: el["suggest-prompt"].value,
      answer: el["suggest-answer"].value,
      unit: el["suggest-unit"].value,
      source: el["suggest-source"].value,
      note: el["suggest-note"].value
    }

    // Checked here as well as at the endpoint, so the common mistakes are
    // answered instantly rather than after a round trip. The endpoint is
    // still the one that decides - this is a courtesy, not the guard.
    var missing = !payload.prompt.trim() || !payload.unit.trim() ||
      !payload.answer.trim() || !payload.source.trim()
    if (missing) return setSuggestNote("Question, answer, unit and source are all needed.")
    if (!(Number(payload.answer.trim()) > 0)) {
      return setSuggestNote("The answer has to be a positive number. Use the ×10ⁿ button for big ones.")
    }

    el["suggest-go"].disabled = true
    setSuggestNote("Sending…")

    fetch(DISTRIBUTION_URL + "/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {} })
    }).then(function (data) {
      el["suggest-go"].disabled = false
      if (data && data.ok) {
        el["suggest-form"].reset()
        setSuggestNote("Thank you — it is in the queue to be checked.")
      } else {
        setSuggestNote((data && data.error) || "That did not go through. Try again later.")
      }
    }).catch(function () {
      el["suggest-go"].disabled = false
      setSuggestNote("That did not go through. Try again later.")
    })
  }

  function setSuggestNote(text) {
    setText(el["suggest-note-out"], text)
    show(el["suggest-note-out"], Boolean(text))
  }

  // Exact to the digit, which estimating does not usually produce. The answers
  // ship with the app so it can play offline, so anyone who wants them can read
  // them - this treats that as a joke rather than pretending otherwise.
  //
  // Deliberately not the Bullseye band, which is 0.3 decades wide and reached
  // honestly every day. An earlier version also demanded a non-round answer, to
  // avoid asking someone who typed 12000 and happened to be right - but that
  // skipped most of the bank, today included, and the round numbers are exactly
  // the ones a peeker would copy. Being asked wrongly costs a tap on "No", and
  // only self-reported peeks are ever counted.
  function looksLikeAPeek(guess, answerValue) {
    return guess === answerValue
  }

  // Which question is waiting on an answer, remembered rather than held in a
  // variable. Closing the app used to dismiss the question by default, which
  // makes owning up the only option that costs anything - so the honest answer
  // was the expensive one. It now survives a reload and asks again.
  var CONFESS_KEY = "estimation-gym-confess"

  function pendingConfession() {
    try { return window.localStorage.getItem(CONFESS_KEY) || null } catch (e) { return null }
  }

  function setPendingConfession(id) {
    try {
      if (id) window.localStorage.setItem(CONFESS_KEY, id)
      else window.localStorage.removeItem(CONFESS_KEY)
    } catch (e) {}
  }

  function confessionPrompt(question) {
    return "You got it exactly right — " + Model.formatCompact(question.answerValue) + " " +
      question.unit + ", to the digit. Either that is the finest estimating we have " +
      "ever seen, or you found the answers in the code. Which was it?"
  }

  // Shown from render(), so it comes back on every reload until it is answered.
  //
  // Only ever for the question currently on screen: a prompt about yesterday's
  // answer sitting above today's question would be nonsense, so a pending
  // confession that outlives its day is dropped rather than carried over.
  function renderConfession(question) {
    var id = pendingConfession()
    if (!id || !question || id !== question.id) {
      if (id && question && id !== question.id) setPendingConfession(null)
      show(el.confess, false)
      return
    }
    setText(el["confess-body"], confessionPrompt(question))
    show(el.confess, true)
  }

  function maybeAskAboutCheating(guess, question) {
    if (!question || !looksLikeAPeek(guess, question.answerValue)) return
    setPendingConfession(question.id)
    renderConfession(question)
  }

  function answerConfession(peeked) {
    var id = pendingConfession()
    setPendingConfession(null)
    show(el.confess, false)
    if (!peeked || !id) return
    tellWorker("/confess", { questionId: id }).then(function () {
      // Re-read so the count under the chart includes the confession just made.
      distFetchedAt[id] = 0
      loadDistribution(id)
    })
  }

  // Mirrors the streak into a cache the service worker can read.
  //
  // The reminder is built inside the worker while the app is closed, so it
  // cannot reach localStorage and has no client to ask. Written after every
  // answer rather than on a schedule, because the only moment the number
  // changes is the moment it is worth telling.
  //
  // Best-effort throughout: CacheStorage is unavailable in a few contexts and
  // absent on http origins, and a reminder that falls back to its generic
  // title is a much smaller loss than a failed submission.
  function saveProgress() {
    if (!(window.caches && window.caches.open)) return

    // The longest run still alive, across every live game.
    //
    // The service worker pairs these two numbers to decide whether to say
    // "Day 12" instead of "Today's questions", so they have to come from the
    // same game: one game's streak beside another game's last-played day
    // would claim a run that had already been broken. A game last played
    // before yesterday is out of the running for exactly that reason - its
    // streak number is a fact about the past, not about a run to protect.
    var best = null
    liveStates().forEach(function (s) {
      var days = Model.historyDays(s)
      if (!days.length) return
      var latest = Math.max.apply(null, days.map(function (d) { return d.day }))
      if (latest < today - 1) return
      if (!best || s.streak > best.streak) {
        best = { streak: s.streak, lastPlayedDay: latest }
      }
    })

    try {
      window.caches.open("estimation-gym-progress").then(function (cache) {
        return cache.put("./progress", new Response(JSON.stringify({
          streak: best ? best.streak : 0,
          lastPlayedDay: best ? best.lastPlayedDay : null
        }), { headers: { "Content-Type": "application/json" } }))
      }).catch(function () {})
    } catch (e) {}
  }

  // --- moving to estimationgym.app -------------------------------------
  //
  // History and streaks live in localStorage, which is per-origin, so changing
  // domain would otherwise reset everyone who has played. exportState and
  // importState already exist for moving a history between devices; this
  // reuses them to move one between origins.
  //
  // The data travels in the URL fragment, which browsers never send to a
  // server - so a history crosses without touching the network.
  var OLD_HOST = "sidathpeiris.github.io"
  var NEW_HOME = "https://estimationgym.app/"
  // Fragments are not formally capped but very long URLs get truncated in the
  // wild. Beyond this, ask them to use the export box instead of silently
  // handing over a broken half.
  var MOVE_LIMIT = 30000

  // Whether to announce the move on the old address.
  //
  // This was parked at false for a while because the app would not finish
  // installing from estimationgym.app on an Android handset - the WebAPK
  // mint never completed and no entry was ever written - and there was no
  // sense sending people somewhere they could not install from.
  //
  // It turned out to be the handset, not the site: a reboot cleared a stuck
  // install queue and the same address minted first try, with nothing here
  // having changed. The flag stays because it is the cheap way to pull the
  // announcement without touching any of the markup around it.
  var MOVE_ANNOUNCED = true

  function onOldHost() {
    try { return window.location.hostname === OLD_HOST } catch (e) { return false }
  }

  // The move to estimationgym.app. Fermi Questions is the only game that ever
  // existed on the old host, so both halves of this are deliberately about
  // Fermi and nothing else - no `game` is passed, the bare shape is written,
  // and the bare shape is what the other end reads back.
  function moveLink() {
    var payload = exportState(state)
    var packed
    try { packed = window.btoa(unescape(encodeURIComponent(payload))) } catch (e) { return null }
    if (packed.length > MOVE_LIMIT) return null
    return NEW_HOME + "#move=" + packed
  }

  // On the new domain: take a history handed over in the fragment, then strip
  // it, so a reload or a shared link cannot re-import or leak it.
  function acceptMovedHistory() {
    var hash = ""
    try { hash = window.location.hash || "" } catch (e) { return }
    if (hash.indexOf("#move=") !== 0) return
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
    } catch (e) {}
    var raw
    try { raw = decodeURIComponent(escape(window.atob(hash.slice(6)))) } catch (e) { return }
    var fermi = GamesAPI.gameById("fermi")
    var into = loadState(Model, window.localStorage, fermi)
    var result = importState(Model, into, raw, "fermi")
    if (!result || !result.state) return
    saveState(result.state, window.localStorage, fermi)
    // Named rather than assumed: this writes Fermi's key whichever screen the
    // move link happened to land on, and it must keep doing so.
    if (game.id === "fermi") state = result.state
    render()
  }

  function renderMoveBanner() {
    if (!MOVE_ANNOUNCED || !onOldHost()) { show(el.moved, false); return }
    show(el.moved, true)
    var href = moveLink()
    if (href) {
      el["moved-go"].setAttribute("href", href)
      show(el["moved-note"], false)
      return
    }
    // Too much history to carry in a URL, or the browser refused to encode it.
    // The export box downstairs does the same job without a length limit.
    el["moved-go"].setAttribute("href", NEW_HOME)
    setText(el["moved-note"],
      "Your history is too long to carry in a link. Use Export below, then " +
      "Restore it on the new site.")
    show(el["moved-note"], true)
  }

  function canFetch() {
    return typeof fetch === "function"
  }

  // Whole decades off, floored and capped, sent alongside the band.
  //
  // The band alone cannot tell a hard question from a typo: "Off" is everything
  // past 100x, so a respectable 2.5 decades and someone who typed 5 meaning
  // five billion land in the same bucket and want opposite responses. This is
  // coarser than the guess and says no more about a person than the band did.
  function decadesOff(entry) {
    var d = entry && entry.distanceDecades
    if (typeof d !== "number" || !isFinite(d) || d < 0) return null
    return Math.min(Math.floor(d), 20)
  }

  function submitResult(questionId, band, decades) {
    if (!DISTRIBUTION_URL || !questionId || !band || !canFetch()) return
    try {
    fetch(DISTRIBUTION_URL + "/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        typeof decades === "number"
          ? { questionId: questionId, band: band, decades: decades }
          : { questionId: questionId, band: band }
      )
    })
      .then(function (r) { return r.ok ? r.json() : null })
      .then(function (data) {
        if (!data) return
        distCache[questionId] = data
        distFetchedAt[questionId] = Date.now()
        render()
      })
      .catch(function () {})
    } catch (e) {
      // Never let sharing a result interfere with having scored it.
    }
  }

  function loadDistribution(questionId) {
    if (!DISTRIBUTION_URL || !questionId || !canFetch()) return
    if (distInFlight[questionId]) return
    // Cached is fine while it is fresh; past that, go and look again.
    if (distCache[questionId] &&
        Date.now() - (distFetchedAt[questionId] || 0) < DIST_MAX_AGE_MS) return
    distInFlight[questionId] = true
    distFetchedAt[questionId] = Date.now()
    try {
    fetch(DISTRIBUTION_URL + "/dist?q=" + encodeURIComponent(questionId))
      .then(function (r) { return r.ok ? r.json() : null })
      .then(function (data) {
        distInFlight[questionId] = false
        if (!data) return
        distCache[questionId] = data
        render()
      })
      .catch(function () { distInFlight[questionId] = false })
    } catch (e) {
      distInFlight[questionId] = false
    }
  }

  // Where this guess landed among everyone else. Needs the raw decade value
  // rather than the band, which is the same number already sent on submit.
  function renderPercentile(dist, entry) {
    var view = percentileView(dist, decadesOff(entry))
    show(el["dist-percentile"], Boolean(view))
    if (view) setText(el["dist-percentile"], view.text)
  }

  function renderDistribution(view) {
    show(el.dist, view.visible)
    if (!view.visible) return

    // Shown in both branches: the count is worth seeing even before there are
    // enough responses to draw the chart.
    show(el["dist-confessed"], Boolean(view.confessed))
    if (view.confessed) setText(el["dist-confessed"], view.confessed)

    show(el["dist-note"], !view.enough)
    if (!view.enough) {
      setText(el["dist-summary"], "")
      el["dist-bars"].replaceChildren()
      setText(el["dist-note"], view.note)
      return
    }

    setText(el["dist-summary"], view.summary)
    el["dist-bars"].replaceChildren()
    buildBars(el["dist-bars"], view)
    show(el["dist-note"], Boolean(view.comparison))
    if (view.comparison) setText(el["dist-note"], view.comparison)
  }

  // The same chart, drawn inside a history row.
  function renderDistributionInto(container, view) {
    container.replaceChildren()
    if (!view.visible) {
      var waiting = document.createElement("p")
      waiting.className = "dist-note"
      waiting.textContent = "Loading…"
      container.appendChild(waiting)
      return
    }
    if (!view.enough) {
      var few = document.createElement("p")
      few.className = "dist-note"
      few.textContent = view.note
      container.appendChild(few)
      return
    }
    var head = document.createElement("p")
    head.className = "dist-note"
    head.textContent = view.summary
    container.appendChild(head)
    buildBars(container, view)
    if (view.comparison) {
      var cmp = document.createElement("p")
      cmp.className = "dist-note"
      cmp.textContent = view.comparison
      container.appendChild(cmp)
    }
  }

  function buildBars(container, view) {
    view.bars.forEach(function (bar) {
      var row = document.createElement("div")
      row.className = "bar-row" + (bar.mine ? " mine" : "")

      var label = document.createElement("span")
      label.className = "bar-label"
      label.textContent = bar.band + (bar.mine ? " ←" : "")

      // Divs, not spans: a span fill stays inline, and width does not apply to
      // an inline box, so the bar renders invisible. The track happens to
      // survive as a grid item; its child does not.
      var track = document.createElement("div")
      track.className = "bar-track"
      var fill = document.createElement("div")
      fill.className = "bar-fill tone-" + bar.tone
      fill.dataset.band = bar.band
      fill.style.width = Math.round(bar.fraction * 100) + "%"
      track.appendChild(fill)

      var tally = document.createElement("span")
      tally.className = "bar-tally"
      tally.textContent = Math.round(bar.fraction * 100) + "%"

      row.append(label, track, tally)
      container.appendChild(row)
    })
  }

  function hasAnsweredAnything(s) {
    return !!(s && s.history && Object.keys(s.history).length)
  }

  // Returns true when the calendar day actually moved on.
  function refreshDay() {
    var now = Model.dayIndex(new Date())
    if (now === today) return false
    today = now
    question = Model.questionForDay(today, bank, game.scheduleOrigin)
    // Every game rolls over at once, so every game's hint state clears.
    hintShownFor = {}
    hintConfirmingFor = {}
    return true
  }

  // The running build, read from the service worker cache rather than from a
  // constant that could claim anything. Paired with the puzzle date so one
  // line answers both "am I on the latest version" and "is this today's
  // question".
  function renderBuild() {
    var dayPart = Model.formatDay(today)
    if (!(window.caches && window.caches.keys)) {
      setText(el.build, dayPart)
      return
    }
    window.caches.keys().then(function (names) {
      var mine = names.filter(function (n) { return n.indexOf("estimation-gym-v") === 0 })
      setText(el.build, mine.length
        ? mine[0].replace("estimation-gym-", "") + " · " + dayPart
        : dayPart)
    }).catch(function () { setText(el.build, dayPart) })
  }

  function setText(node, value) { node.textContent = value }

  function show(node, visible) {
    if (visible) node.removeAttribute("hidden")
    else node.setAttribute("hidden", "")
  }

  // The decade ruler on a scored result: the distance the sentence above it
  // already states, drawn as a bar. Capped at three decades, because past that
  // the bar is full and the number is doing the talking anyway. Floored at 2%
  // so a Bullseye still shows something rather than an empty track. Nothing
  // reads this back - it is a redrawing, not a second source of the score.
  var RULER_MAX_DECADES = 3

  function drawRuler(ruler, fill, decades) {
    var known = typeof decades === "number" && isFinite(decades)
    show(ruler, known)
    if (!known) return
    var span = Math.min(Math.abs(decades), RULER_MAX_DECADES) / RULER_MAX_DECADES
    fill.style.width = Math.max(2, Math.min(100, span * 100)) + "%"
  }

  function renderBars(bars) {
    el.bars.replaceChildren()
    bars.forEach(function (bar) {
      var row = document.createElement("div")
      row.className = "bar-row"

      var label = document.createElement("span")
      label.className = "bar-label"
      label.textContent = bar.band

      var track = document.createElement("div")
      track.className = "bar-track"

      var fill = document.createElement("div")
      fill.className = "bar-fill tone-" + bar.tone
      fill.dataset.band = bar.band
      fill.style.width = (bar.fraction * 100).toFixed(1) + "%"
      track.appendChild(fill)

      var tally = document.createElement("span")
      tally.className = "bar-tally"
      tally.textContent = bar.tally

      row.append(label, track, tally)
      el.bars.appendChild(row)
    })
  }

  // Static content, so it is built once rather than on every render.
  function renderHowToPlay(guide) {
    el["howto-steps"].replaceChildren()
    guide.steps.forEach(function (step) {
      var li = document.createElement("li")
      li.textContent = step
      el["howto-steps"].appendChild(li)
    })

    setText(el["howto-intro"], guide.scoringIntro)

    el["howto-scoring"].replaceChildren()
    guide.scoring.forEach(function (row) {
      var tr = document.createElement("tr")

      var band = document.createElement("td")
      band.className = "howto-band tone-" + row.tone
      band.dataset.band = row.band
      band.textContent = row.band

      var meaning = document.createElement("td")
      meaning.className = "howto-meaning"
      meaning.textContent = row.meaning

      var points = document.createElement("td")
      points.className = "howto-points"
      points.textContent = row.pointsLabel

      tr.append(band, meaning, points)
      el["howto-scoring"].appendChild(tr)
    })

    el["howto-notes"].replaceChildren()
    guide.notes.forEach(function (note) {
      var p = document.createElement("p")
      p.className = "howto-note"
      p.textContent = note
      el["howto-notes"].appendChild(p)
    })

    // Only explain the reminder where it can actually be switched on.
    var canRemind = pushSupported()
    show(el["howto-reminder"], canRemind)
    if (!canRemind) return

    setText(el["howto-reminder-title"], guide.reminder.title)
    setText(el["howto-reminder-intro"], guide.reminder.intro)

    el["howto-reminder-steps"].replaceChildren()
    guide.reminder.steps.forEach(function (step) {
      var li = document.createElement("li")
      li.textContent = step
      el["howto-reminder-steps"].appendChild(li)
    })

    el["howto-reminder-notes"].replaceChildren()
    guide.reminder.notes.forEach(function (note) {
      var p = document.createElement("p")
      p.className = "howto-note"
      p.textContent = note
      el["howto-reminder-notes"].appendChild(p)
    })
  }

  function renderArchetypes(view) {
    show(el.arch, view.visible)
    if (!view.visible) return

    show(el["arch-headline"], Boolean(view.headline))
    if (view.headline) setText(el["arch-headline"], view.headline)

    el["arch-rows"].replaceChildren()
    view.rows.forEach(function (row) {
      var line = document.createElement("div")
      line.className = "arch-row" + (row.ranked ? "" : " thin")

      var label = document.createElement("span")
      label.className = "arch-label"
      label.textContent = row.label

      var played = document.createElement("span")
      played.className = "arch-played"
      played.textContent = row.detail

      var median = document.createElement("span")
      median.className = "arch-median"
      median.textContent = row.medianLabel

      line.append(label, played, median)
      el["arch-rows"].appendChild(line)
    })

    show(el["arch-note"], Boolean(view.note))
    if (view.note) setText(el["arch-note"], view.note)
  }

  // --- Practice behaviour ---------------------------------------------------

  function practisedIds() {
    try {
      var raw = window.localStorage.getItem(PRACTICE_KEY)
      var parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  }

  function rememberPractised(id) {
    try {
      var list = practisedIds()
      if (list.indexOf(id) < 0) list.push(id)
      window.localStorage.setItem(PRACTICE_KEY, JSON.stringify(list))
    } catch (e) {
      // Not being able to remember only means a question may come round again.
    }
  }

  function nextPractice() {
    practiceResult = null
    // today is passed so the reserve applies: practice must not offer a
    // question the daily puzzle is about to use.
    practiceQuestion = Model.pickPractice(bank, state, practisedIds(), today)
    el["practice-input"].value = ""
    show(el["practice-error"], false)
    renderPractice()
    if (practiceQuestion) el["practice-input"].focus()
  }

  function submitPractice() {
    if (!practiceQuestion) return
    var check = validateGuess(el["practice-input"].value)
    if (!check.ok) {
      setText(el["practice-error"], check.message)
      show(el["practice-error"], true)
      return
    }
    show(el["practice-error"], false)

    // Scored the same way, recorded nowhere. The only thing kept is that this
    // question has now been seen, so it does not come round again.
    practiceResult = Model.scoreGuess(check.value, practiceQuestion.answerValue)
    practiceResult.guess = check.value
    rememberPractised(practiceQuestion.id)
    renderPractice()
  }

  function renderPractice() {
    // Practice draws from Fermi's bank and from Fermi's played history, so a
    // game without a pool has nothing to render. Returning early rather than
    // rendering into a hidden section keeps nextPractice off a bank it was
    // never written for.
    if (game.practice !== true) return

    el["practice-chev"].dataset.open = practiceOpen ? "true" : "false"
    el["practice-toggle"].setAttribute("aria-expanded", String(practiceOpen))
    show(el["practice-body"], practiceOpen)
    if (!practiceOpen) return

    var exhausted = !practiceQuestion
    var answered = !!practiceResult

    setText(el["practice-intro"], exhausted
      ? "You have worked through every question the daily puzzle has not used yet. Nothing left to practise on — which is quite the achievement."
      : "A question the daily puzzle has not given you. Scored the same way, but it does not touch your streak, your stats, or what other players see.")

    show(el["practice-prompt"], !exhausted)
    show(el["practice-form"], !exhausted && !answered)
    show(el["practice-next"], !exhausted && answered)

    if (exhausted) {
      show(el["practice-asof"], false)
      show(el["practice-result"], false)
      show(el["practice-approach"], false)
      show(el["practice-hint"], false)
      show(el["practice-source"], false)
      return
    }

    setText(el["practice-prompt"], practiceQuestion.prompt)
    el["practice-input"].placeholder = "Guess (" + practiceQuestion.unit + ")"

    var dated = practiceQuestion.asOf !== undefined
    show(el["practice-asof"], dated)
    if (dated) setText(el["practice-asof"], "as of " + Model.formatAsOf(practiceQuestion.asOf))

    show(el["practice-result"], answered)
    show(el["practice-approach"], answered)
    show(el["practice-hint"], answered)
    show(el["practice-source"], answered && Boolean(practiceQuestion.source))

    if (!answered) return

    var tone = toneForBand(practiceResult.band)
    el["practice-result"].className = "result tone-" + tone
    // Same as the daily: a styling hook for the per-band colour, nothing more.
    el["practice-result"].dataset.band = practiceResult.band
    setText(el["practice-band"], practiceResult.band)
    // Deliberately not points: practice earns none, and showing a number would
    // suggest otherwise.
    setText(el["practice-points"], "practice")
    setText(el["practice-guess-line"], "Your guess: " + Model.formatCompact(practiceResult.guess) + " " + practiceQuestion.unit)
    setText(el["practice-actual-line"], "Actual: " + Model.formatCompact(practiceQuestion.answerValue) + " " + practiceQuestion.unit)
    setText(el["practice-decades"], "Off by " +
      (practiceResult.distanceDecades !== null ? practiceResult.distanceDecades.toFixed(2) : "?") +
      " orders of magnitude")
    drawRuler(el["practice-decades-ruler"], el["practice-decades-fill"],
      practiceResult.distanceDecades)

    var strategy = Model.strategyFor(practiceQuestion)
    setText(el["practice-approach"], "Approach: " + strategy.label)
    setText(el["practice-hint"], "How to think about it: " + practiceQuestion.decompositionHint)
    if (practiceQuestion.source) setText(el["practice-source"], "Source: " + practiceQuestion.source)
  }

  function renderHistory(history) {
    el["history-list"].replaceChildren()

    history.rows.forEach(function (row) {
      var item = document.createElement("li")
      item.className = "history-row"

      var date = document.createElement("span")
      date.className = "history-date"
      date.textContent = row.dateLabel

      var band = document.createElement("span")
      band.className = "history-band tone-" + row.tone
      band.dataset.band = row.band
      band.textContent = row.band + (row.assisted ? " ·" : "")
      if (row.assisted) band.title = "Hint used - scored half points"

      // Guess against the value it was scored against, then the distance. The
      // two halves are separately unbreakable so a very wide value wraps
      // between them instead of overflowing a narrow phone.
      var numbers = document.createElement("span")
      numbers.className = "history-numbers"

      var pair = document.createElement("span")
      pair.className = "nowrap"
      pair.textContent = row.guessLabel + " / " + row.actualLabel

      var distance = document.createElement("span")
      distance.className = "nowrap"
      distance.textContent = " · " + row.decadesLabel + " dec"

      numbers.append(pair, distance)
      item.append(date, band, numbers)

      // Comparable only when the day recorded which question it asked and a
      // destination is configured. Rows without that stay plain text rather
      // than offering something that cannot work.
      if (DISTRIBUTION_URL && row.questionId) {
        item.classList.add("comparable")
        item.addEventListener("click", function () {
          openHistoryDay = openHistoryDay === row.day ? null : row.day
          if (openHistoryDay !== null) loadDistribution(row.questionId)
          render()
        })

        if (openHistoryDay === row.day) {
          item.classList.add("open")
          var panel = document.createElement("div")
          panel.className = "history-dist"
          renderDistributionInto(
            panel,
            distributionView(Model, distCache[row.questionId] || null, row.band)
          )
          item.appendChild(panel)
        }
      }

      el["history-list"].appendChild(item)
    })

    var more = history.total > history.shown
    show(el["history-more"], more)
    if (more) el["history-more"].textContent = "Show all " + history.total
  }

  // --- routing ---------------------------------------------------------
  //
  // Hash, and only hash. A query string would miss the precached "./" entry,
  // because the service worker's cache key includes it; a path would need its
  // own precache entry, which version.test.js forbids because a redirecting
  // alias makes cache.addAll reject and the worker never activate. A fragment
  // never reaches the network at all, so the navigation URL stays exactly "./"
  // and offline behaviour is unchanged.
  //
  // Navigation assigns location.hash rather than swapping elements directly,
  // which puts each screen in history. In display: standalone there is no
  // browser back button, so the Android hardware back key mapping to
  // history.back() is the whole reason this is a route and not a boolean.
  var HOME = "home"

  // Where a runtime without a location lands.
  //
  // The smoke harnesses' window has localStorage and addEventListener and
  // nothing else - core-loop.js does not define location at all. Reading it
  // unguarded turns every one of them red, and app.js:532 and :547 are wrapped
  // for the same reason.
  //
  // It falls back to the game rather than to home, which is the opposite of
  // what an empty hash does. That is deliberate: an empty hash is a browser
  // saying "no game chosen", whereas no location at all is a runtime that
  // cannot navigate. The honest behaviour there is the one from before routing
  // existed - render the puzzle - rather than a home screen whose only purpose
  // is to be navigated away from.
  var NO_LOCATION_ROUTE = "fermi"

  function currentRoute() {
    var hash
    try {
      if (!window.location) return NO_LOCATION_ROUTE
      hash = window.location.hash || ""
    } catch (e) {
      return NO_LOCATION_ROUTE
    }

    var id = hash.replace(/^#\/?/, "")
    if (!id || id === HOME) return HOME
    // Only a live game is routable. A coming-soon id, or anything typed or
    // shared that no longer exists, lands on home rather than a blank screen.
    return GamesAPI.isPlayable(id) ? id : HOME
  }

  function cleanHash() {
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
    } catch (e) {}
  }

  function route() {
    var id = currentRoute()

    // An unroutable fragment is tidied away so a reload does not repeat it and
    // a bookmark does not keep it.
    try {
      var raw = ((window.location && window.location.hash) || "").replace(/^#\/?/, "")
      if (raw && raw !== HOME && id === HOME) cleanHash()
    } catch (e) {}

    show(el.home, id === HOME)
    show(el["game-screen"], id !== HOME)

    if (id === HOME) {
      renderHome()
    } else {
      // Before render(), never after: every write below reads `question` and
      // `state`, so rendering first would paint the outgoing game's question
      // under the incoming game's name for one frame.
      selectGame(id)
      render()
    }

    // Both outside the route guard, for related reasons.
    //
    // The move banner is about which ADDRESS the app was opened at, not which
    // game is on screen - someone on the old host needs telling whether they
    // are looking at the home screen or a puzzle. It lives in the Fermi
    // screen's markup for now, which is where the old build had it, so moving
    // hosts does not also move the banner.
    //
    // The bell is about the app rather than about a game too. It is only
    // visible on the home screen, so renderHome() would be enough - but this
    // is the function that knows which screen is up, and rendering a control
    // from the one place that owns the screens is what keeps it from being
    // left stale by a path that forgot to ask.
    renderMoveBanner()
    renderRemind()
  }

  function goTo(id) {
    try {
      window.location.hash = id === HOME ? "" : "#" + id
      // Assigning an empty hash leaves a bare "#" behind, which is untidy in a
      // shared link and in the address bar.
      if (id === HOME) cleanHash()
    } catch (e) {}
    route()
  }

  // The second render path. It writes DOM and nothing else - every string it
  // shows comes from homeView, for the reason spelled out there.
  function renderHome() {
    var states = {}
    GamesAPI.liveGames().forEach(function (game) {
      states[game.id] = game.id === "fermi" ? state : loadState(Model, window.localStorage, game)
    })

    var view = homeView(Model, GamesAPI.allGames(), states, today)
    el["home-list"].replaceChildren()

    view.cards.forEach(function (card) {
      var item = document.createElement("li")

      // A playable card is a button; an announced one is deliberately not, and
      // is not focusable either. A disabled button that still takes focus and
      // does nothing is worse than not being a button.
      var box = document.createElement(card.playable ? "button" : "div")
      box.className = "home-card" + (card.playable ? "" : " is-soon")
      if (card.playable) {
        box.type = "button"
        box.addEventListener("click", function () { goTo(card.id) })
      } else {
        box.setAttribute("aria-disabled", "true")
      }

      // The icon and the name are one row, so the name of the game is what the
      // eye lands on and the icon is what tells the four cards apart at a
      // glance. Drawn as a mask rather than as an <svg>, like the chevrons: the
      // mask takes currentColor, so the coming-soon cards' muted name colour
      // mutes their icon too with no second rule.
      var heading = document.createElement("p")
      heading.className = "home-card-heading"

      if (card.icon) {
        var icon = document.createElement("span")
        icon.className = "home-card-icon icon-" + card.icon
        icon.setAttribute("aria-hidden", "true")
        heading.appendChild(icon)
      }

      var name = document.createElement("span")
      name.className = "home-card-name"
      name.textContent = card.name
      heading.appendChild(name)

      var tagline = document.createElement("p")
      tagline.className = "home-card-tagline"
      tagline.textContent = card.tagline

      box.append(heading, tagline)

      if (card.playable) {
        var meta = document.createElement("p")
        meta.className = "home-card-meta"
        if (card.streakLabel) {
          var streak = document.createElement("span")
          streak.className = "home-card-streak"
          streak.textContent = card.streakLabel
          meta.appendChild(streak)

          // Interpuncts separate metadata everywhere else in the product -
          // "Streak 6 · Best 14", "12 played · 780 pts" - so they do here too.
          // Punctuation rather than wording, which is why it is built in the
          // renderer instead of baked into a string in homeView.
          var dot = document.createElement("span")
          dot.setAttribute("aria-hidden", "true")
          dot.textContent = "·"
          meta.appendChild(dot)
        }
        var status = document.createElement("span")
        status.textContent = card.statusLabel
        meta.appendChild(status)
        box.appendChild(meta)
      } else {
        var soon = document.createElement("span")
        soon.className = "home-card-soon"
        soon.textContent = card.status
        box.appendChild(soon)
      }

      item.appendChild(box)
      el["home-list"].appendChild(item)
    })
  }

  function render() {
    // The home screen is a different screen, not a different state of this
    // one. Without this guard every one of the ~90 writes below runs against
    // a hidden subtree on every home render.
    if (currentRoute() === HOME) return

    var vm = viewModel(Model, state, question, today, historyLimit, hintShown(), bank)

    // Whose screen this is. The eyebrow names the game and wears its icon; the
    // hero above still says Estimation Gym, because that is the app.
    setText(el["game-name"], game.name)
    el["game-icon"].className = "qcard-mode-icon icon-" + game.icon

    // The three parts of this screen that belong to Fermi Questions rather
    // than to the engine. Declared per game in the registry, which is where
    // the reason for each one is written down.
    // Two of the three parts of this screen that belong to Fermi Questions
    // rather than to the engine; the bell is the third and renderRemind owns
    // it. Declared per game in the registry, which is where the reason for
    // each one is written down.
    show(el.practice, game.practice === true)
    show(el.suggest, game.suggest === true)

    setText(el.puzzle, vm.dateLabel)
    setText(el.streak, vm.streakLabel)
    show(el.asof, Boolean(vm.asOfLabel))
    if (vm.asOfLabel) setText(el.asof, vm.asOfLabel)
    setText(el.prompt, vm.prompt)
    el["guess-input"].placeholder = vm.placeholder

    // Once the day is answered the input is retired rather than left live,
    // since recordAnswer is a no-op for an already-played day.
    show(el["guess-form"], !vm.answered)

    show(el.result, Boolean(vm.result))
    if (vm.result) {
      el.result.className = "result tone-" + vm.result.tone
      // The tone class is the three-way mapping this app and the Omarchy
      // widget share, and it stays authoritative. The band name is carried
      // alongside it purely so the stylesheet can give Bullseye its own
      // colour instead of the accent it shares with Close - no scoring,
      // wording or behaviour reads this.
      el.result.dataset.band = vm.result.band
      setText(el.band, vm.result.band)
      setText(el.points, vm.result.pointsLabel)
      setText(el["guess-line"], vm.result.guessLine)
      setText(el["actual-line"], vm.result.actualLine)
      setText(el["decades-line"], vm.result.decadesLine)
      drawRuler(el["decades-ruler"], el["decades-fill"], vm.result.decades)
    }

    // The offer and its confirmation are the same control in two states, so
    // exactly one of them is ever on screen. vm.hintAvailable still governs
    // both: confirming does not take the hint, so the day can still be
    // answered, and answering it withdraws the question along with the offer.
    show(el["hint-toggle"], vm.hintAvailable && !hintConfirming())
    show(el["hint-confirm"], vm.hintAvailable && hintConfirming())
    show(el.strategy, vm.hintRevealed)
    if (vm.hintRevealed) {
      setText(el["strategy-label"], vm.strategyLabel)
      setText(el["strategy-guidance"], vm.strategyGuidance)
    }

    renderConfession(question)

    var todayEntry = vm.answered ? state.history[String(today)] : null
    var todayQid = todayEntry && todayEntry.questionId
    if (todayQid) loadDistribution(todayQid)
    var todayDist = todayQid ? distCache[todayQid] || null : null
    renderDistribution(distributionView(
      Model,
      todayDist,
      todayEntry ? todayEntry.band : null
    ))
    renderPercentile(todayDist, todayEntry)

    show(el.share, vm.answered)
    show(el["practice-offer"], vm.answered)
    show(el.approach, Boolean(vm.answered && vm.strategyLabel))
    if (vm.strategyLabel) setText(el.approach, vm.strategyLabel)
    show(el.hint, Boolean(vm.hint))
    if (vm.hint) setText(el.hint, vm.hint)
    show(el.source, Boolean(vm.source))
    if (vm.source) setText(el.source, vm.source)

    renderBuild()

    el["suggest-chev"].dataset.open = suggestOpen ? "true" : "false"
    el["suggest-toggle"].setAttribute("aria-expanded", String(suggestOpen))
    show(el["suggest-body"], suggestOpen)

    el["howto-chev"].dataset.open = howToOpen ? "true" : "false"
    el["howto-toggle"].setAttribute("aria-expanded", String(howToOpen))
    show(el["howto-body"], howToOpen)

    show(el.history, vm.history.visible)
    setText(el["history-summary"], vm.history.total === 1
      ? "1 day"
      : vm.history.total + " days")
    renderHistory(vm.history)
    el["history-chev"].dataset.open = historyOpen ? "true" : "false"
    el["history-toggle"].setAttribute("aria-expanded", String(historyOpen))
    show(el["history-body"], historyOpen)

    show(el.stats, vm.stats.visible)
    setText(el["stats-summary"], vm.stats.summary)
    setText(el["stats-footer"], vm.stats.footer)
    show(el.calibration, Boolean(vm.stats.calibration))
    if (vm.stats.calibration) setText(el.calibration, vm.stats.calibration)
    renderBars(vm.stats.bars)
    renderArchetypes(vm.archetypes)
    renderPractice()

    el.chev.dataset.open = statsOpen ? "true" : "false"
    el["stats-toggle"].setAttribute("aria-expanded", String(statsOpen))
    show(el["stats-body"], statsOpen)
  }

  function submit(event) {
    event.preventDefault()
    var check = validateGuess(el["guess-input"].value)
    if (!check.ok) {
      setText(el.error, check.message)
      show(el.error, true)
      return
    }
    show(el.error, false)
    state = Model.recordAnswer(state, today, check.value, question.answerValue, hintShown(), question.id)
    if (!saveState(state, window.localStorage, game)) {
      setText(el.error, "Scored, but your streak could not be saved on this device")
      show(el.error, true)
    }
    render()

    var entry = state.history[String(today)]

    // No game column in D1, and none needed: every question id outside Fermi
    // carries its game as a prefix, so "records-longest-bridge" cannot collide
    // with a Fermi id and the distributions stay separate on their own.
    if (entry) submitResult(entry.questionId, entry.band, decadesOff(entry))

    // Both of these are about the daily reminder, and the reminder is about
    // the app. Every live game answered feeds it: reportPlayed only suppresses
    // the nudge once none of them are left, and saveProgress recomputes the
    // longest surviving run across all of them.
    reportPlayed(today)
    saveProgress()

    maybeAskAboutCheating(check.value, question)
  }

  el["guess-form"].addEventListener("submit", submit)

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) return
    refreshDay()
    // Unconditional: render() is a DOM update and is cheap, and it is what
    // triggers a re-read of a distribution that has gone stale.
    render()
    if (pendingReload) applyUpdate()
    requestUpdate()
    reassertReminder()
  })

  // The numeric keypad a phone shows for inputmode="decimal" has no "e", so
  // scientific notation - which the guide tells people to use, and which the
  // answers genuinely need, spanning 10^-11 to 10^80 - was unreachable on the
  // device most people play on. This inserts it without giving up the keypad.
  el.exp.addEventListener("click", function () {
    insertExponent(el["guess-input"])
  })

  el.remind.addEventListener("click", function () {
    if (remindEnabled()) disableReminder()
    else enableReminder()
  })

  // Asking is free. Nothing about the day changes until Yes.
  el["hint-toggle"].addEventListener("click", function () {
    hintConfirmingFor[game.id] = true
    render()
    // Focus lands on "Not yet", never on "Yes". A confirmation that puts the
    // cursor on the costly option, one row above where the thumb already is,
    // reintroduces the mis-tap it exists to prevent.
    el["hint-confirm-no"].focus()
  })

  el["hint-confirm-yes"].addEventListener("click", function () {
    hintConfirmingFor[game.id] = false
    hintShownFor[game.id] = true
    render()
    el["guess-input"].focus()
  })

  el["hint-confirm-no"].addEventListener("click", function () {
    hintConfirmingFor[game.id] = false
    render()
    el["hint-toggle"].focus()
  })

  function flash(button, message) {
    var original = button.dataset.label || button.textContent
    button.dataset.label = original
    button.textContent = message
    setTimeout(function () { button.textContent = button.dataset.label }, 1600)
  }

  el.share.addEventListener("click", function () {
    var text = shareText(Model, state, question, today, location.origin + location.pathname + "#" + game.id, game.name)
    if (!text) return

    // On a phone this opens the OS share sheet, which is the whole point.
    // Everywhere else fall back to the clipboard.
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {})
      return
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(function () { flash(el.share, "Copied") })
        .catch(function () { flash(el.share, "Could not copy") })
    }
  })

  el["confess-yes"].addEventListener("click", function () { answerConfession(true) })
  el["confess-no"].addEventListener("click", function () { answerConfession(false) })

  el["suggest-toggle"].addEventListener("click", function () {
    suggestOpen = !suggestOpen
    render()
  })

  el["suggest-exp"].addEventListener("click", function () {
    insertExponent(el["suggest-answer"])
  })

  el["suggest-form"].addEventListener("submit", sendSuggestion)

  el["howto-toggle"].addEventListener("click", function () {
    howToOpen = !howToOpen
    render()
  })

  el["history-toggle"].addEventListener("click", function () {
    historyOpen = !historyOpen
    render()
  })

  el["history-more"].addEventListener("click", function () {
    historyLimit = 0
    render()
  })

  el["practice-toggle"].addEventListener("click", function () {
    practiceOpen = !practiceOpen
    if (practiceOpen && !practiceQuestion && !practiceResult) nextPractice()
    else renderPractice()
  })

  // The offer under a scored daily. Opens Practice and puts a question in it,
  // rather than only scrolling to a collapsed section and leaving the player
  // to find the control. An unanswered question already drawn is kept - the
  // offer should not discard one they are part-way through.
  el["practice-offer"].addEventListener("click", function () {
    practiceOpen = true
    if (!practiceQuestion || practiceResult) nextPractice()
    else renderPractice()

    // Guarded because the smoke harnesses render against a DOM stub, and
    // because a browser with reduced motion asked for should not be dragged
    // down the page.
    if (el.practice.scrollIntoView) {
      var reduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      el.practice.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
    }
  })

  el["practice-form"].addEventListener("submit", function (event) {
    event.preventDefault()
    submitPractice()
  })

  el["practice-next"].addEventListener("click", nextPractice)

  el["practice-exp"].addEventListener("click", function () {
    insertExponent(el["practice-input"])
  })

  el["restore-toggle"].addEventListener("click", function () {
    var opening = el["restore-panel"].hasAttribute("hidden")
    show(el["restore-panel"], opening)
    if (opening) el["restore-input"].focus()
  })

  el["restore-go"].addEventListener("click", function () {
    var result = importState(Model, state, el["restore-input"].value, game.id)
    setText(el["restore-note"], result.message)
    show(el["restore-note"], true)
    if (!result.ok) return

    state = result.state
    if (!saveState(state, window.localStorage, game)) {
      setText(el["restore-note"], "Restored on screen, but it could not be saved on this device.")
      render()
      return
    }
    el["restore-input"].value = ""
    render()
  })

  el["stats-toggle"].addEventListener("click", function () {
    statsOpen = !statsOpen
    render()
  })

  el.export.addEventListener("click", function () {
    var blob = exportState(state, game)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(blob)
        .then(function () { flash(el.export, "Copied") })
        .catch(function () { flash(el.export, "Could not copy") })
    }
  })

  // Static content, built once rather than on every render.
  renderHowToPlay(viewModel(Model, state, question, today, 0, false, QUESTIONS).howToPlay)

  // hashchange only, not popstate. Back and forward across fragments fire
  // both, so listening to one avoids rendering everything twice.
  try { window.addEventListener("hashchange", route) } catch (e) {}

  el["back-to-games"].addEventListener("click", function () { goTo(HOME) })

  route()

  // --- Anonymous install counter -----------------------------------------
  //
  // Counts installs and nothing else. The request carries no identifier, no
  // score, no history and no query of any kind beyond a cache-buster - the
  // only information conveyed is that one more install exists. Play history
  // still never leaves the device.
  //
  // Disabled by default: with no endpoint configured this is a no-op and the
  // app makes no outbound request at all. Set INSTALL_PING_URL to switch it on.
  var INSTALL_PING_URL = "https://abacus.jasoncameron.dev/hit/estimation-gym/app-installs"
  var INSTALL_PING_KEY = "estimation-gym-install-counted"

  // Two triggers, because no single one covers every platform. Chrome and the
  // desktop browsers fire `appinstalled`; iOS Safari never has, so a
  // home-screen launch is detected instead. Counting a first standalone launch
  // is arguably the better measure anyway - it counts installs that someone
  // actually opened rather than ones that were added and forgotten.
  function countInstall() {
    if (!INSTALL_PING_URL) return

    // The flag is both the de-duplicator and the consent record. If storage is
    // unavailable (private browsing), skip entirely rather than ping on every
    // single launch with no way to remember having done so.
    try {
      if (window.localStorage.getItem(INSTALL_PING_KEY)) return
      window.localStorage.setItem(INSTALL_PING_KEY, "1")
    } catch (e) {
      return
    }

    try {
      var sep = INSTALL_PING_URL.indexOf("?") >= 0 ? "&" : "?"
      new Image().src = INSTALL_PING_URL + sep + "t=" + Date.now()
    } catch (e) {
      // A failed count is not worth surfacing to someone trying to play.
    }
  }

  function launchedStandalone() {
    try {
      if (window.navigator && window.navigator.standalone) return true
      return !!(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches)
    } catch (e) {
      return false
    }
  }

  window.addEventListener("appinstalled", countInstall)
  if (launchedStandalone()) countInstall()

  // --- Staying on the latest build ---------------------------------------
  //
  // An installed copy is resumed rather than reloaded, so without this it can
  // sit on one build indefinitely: the service worker only looks for a new
  // version when the page is loaded, and on a phone that may be weeks apart.
  // Asking for an update every time the app comes to the foreground closes
  // that gap.
  var pendingReload = false
  var reloading = false

  function requestUpdate() {
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker.getRegistration()
      .then(function (reg) { if (reg) reg.update() })
      .catch(function () {})
  }

  // sw.js claims clients as soon as it activates, but the page keeps running
  // whatever code it started with, so a reload is what actually applies the
  // update. Deferred while a guess is half-typed - losing someone's input to
  // a background update would be a poor trade.
  function applyUpdate() {
    if (reloading) return
    if (el["guess-input"] && String(el["guess-input"].value).trim() !== "") {
      pendingReload = true
      return
    }
    reloading = true
    window.location.reload()
  }

  acceptMovedHistory()

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", applyUpdate)

    // Registered after render so a failure here can never stop the puzzle from
    // showing. Absent on http:// origins other than localhost, and in browsers
    // with service workers disabled.
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js")
        // Only after registration: reassertReminder needs serviceWorker.ready,
        // and on a first visit there is nothing to be ready for yet.
        .then(function () { reassertReminder() })
        .catch(function () {})
    })
  }
})()
