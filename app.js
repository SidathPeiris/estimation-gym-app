(function () {
  "use strict"

  // core/Model.js and core/questions.js are vendored verbatim from the Omarchy
  // plugin, so they load as classic scripts and expose their declarations
  // globally. Collect them into one object matching the shape presenter.js and
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
             "decades-line", "share", "hint", "source",
             "dist", "dist-summary", "dist-bars", "dist-note",
             "hint-toggle", "strategy", "strategy-label", "strategy-guidance", "approach",
             "build", "remind", "remind-state", "remind-note",
             "howto", "howto-toggle", "howto-chev", "howto-body",
             "howto-steps", "howto-intro", "howto-scoring", "howto-notes",
             "history", "history-toggle", "history-chev", "history-summary",
             "history-body", "history-list", "history-more",
             "stats", "stats-toggle", "chev", "stats-summary", "stats-body",
             "bars", "stats-footer", "calibration", "export",
             "restore-toggle", "restore-panel", "restore-input", "restore-go", "restore-note",
             "arch", "arch-headline", "arch-rows", "arch-note"]
  ids.forEach(function (id) { el[id] = document.getElementById(id) })

  // Recomputed whenever the app comes back to the foreground, not fixed for
  // the life of the page. An installed copy is resumed from memory rather than
  // reloaded, so a phone left open overnight would otherwise still be showing
  // yesterday's question - and would record an answer against yesterday.
  var today = Model.dayIndex(new Date())
  var question = Model.questionForDay(today, QUESTIONS)
  var state = loadState(Model, window.localStorage)
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
  var hintShown = false

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

  function applyReset() {
    var mode = null
    try {
      mode = new URLSearchParams(window.location.search).get("reset")
    } catch (e) {
      return
    }
    if (mode !== "today" && mode !== "all") return

    state = mode === "all" ? Model.emptyState() : forgetDay(state, today)
    saveState(state, window.localStorage)

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

  function setRemindNote(text) {
    setText(el["remind-note"], text)
    show(el["remind-note"], !!text)
  }

  function renderRemind() {
    show(el.remind, pushSupported())
    setText(el["remind-state"], remindEnabled() ? "On" : "Off")
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
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKeyBytes(VAPID_PUBLIC_KEY)
        })
      }).then(function (sub) {
        return tellWorker("/subscribe", {
          endpoint: sub.endpoint,
          tzOffset: new Date().getTimezoneOffset()
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
    currentSubscription().then(function (sub) {
      if (sub) tellWorker("/played", { endpoint: sub.endpoint, day: day })
    })
  }

  function canFetch() {
    return typeof fetch === "function"
  }

  function submitResult(questionId, band) {
    if (!DISTRIBUTION_URL || !questionId || !band || !canFetch()) return
    try {
    fetch(DISTRIBUTION_URL + "/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: questionId, band: band })
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

  function renderDistribution(view) {
    show(el.dist, view.visible)
    if (!view.visible) return

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

      var track = document.createElement("span")
      track.className = "bar-track"
      var fill = document.createElement("span")
      fill.className = "bar-fill tone-" + bar.tone
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
    question = Model.questionForDay(today, QUESTIONS)
    hintShown = false
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
      var mine = names.filter(function (n) { return n.indexOf("estimation-gym-") === 0 })
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

  function render() {
    var vm = viewModel(Model, state, question, today, historyLimit, hintShown, QUESTIONS)

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
      setText(el.band, vm.result.band)
      setText(el.points, vm.result.pointsLabel)
      setText(el["guess-line"], vm.result.guessLine)
      setText(el["actual-line"], vm.result.actualLine)
      setText(el["decades-line"], vm.result.decadesLine)
    }

    show(el["hint-toggle"], vm.hintAvailable)
    show(el.strategy, vm.hintRevealed)
    if (vm.hintRevealed) {
      setText(el["strategy-label"], vm.strategyLabel)
      setText(el["strategy-guidance"], vm.strategyGuidance)
    }

    var todayEntry = vm.answered ? state.history[String(today)] : null
    var todayQid = todayEntry && todayEntry.questionId
    if (todayQid) loadDistribution(todayQid)
    renderDistribution(distributionView(
      Model,
      todayQid ? distCache[todayQid] || null : null,
      todayEntry ? todayEntry.band : null
    ))

    show(el.share, vm.answered)
    show(el.approach, Boolean(vm.answered && vm.strategyLabel))
    if (vm.strategyLabel) setText(el.approach, vm.strategyLabel)
    show(el.hint, Boolean(vm.hint))
    if (vm.hint) setText(el.hint, vm.hint)
    show(el.source, Boolean(vm.source))
    if (vm.source) setText(el.source, vm.source)

    renderBuild()
    renderRemind()

    setText(el["howto-chev"], howToOpen ? "▾" : "▸")
    el["howto-toggle"].setAttribute("aria-expanded", String(howToOpen))
    show(el["howto-body"], howToOpen)

    show(el.history, vm.history.visible)
    setText(el["history-summary"], vm.history.total === 1
      ? "1 day"
      : vm.history.total + " days")
    renderHistory(vm.history)
    setText(el["history-chev"], historyOpen ? "▾" : "▸")
    el["history-toggle"].setAttribute("aria-expanded", String(historyOpen))
    show(el["history-body"], historyOpen)

    show(el.stats, vm.stats.visible)
    setText(el["stats-summary"], vm.stats.summary)
    setText(el["stats-footer"], vm.stats.footer)
    show(el.calibration, Boolean(vm.stats.calibration))
    if (vm.stats.calibration) setText(el.calibration, vm.stats.calibration)
    renderBars(vm.stats.bars)
    renderArchetypes(vm.archetypes)

    setText(el.chev, statsOpen ? "▾" : "▸")
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
    state = Model.recordAnswer(state, today, check.value, question.answerValue, hintShown, question.id)
    if (!saveState(state, window.localStorage)) {
      setText(el.error, "Scored, but your streak could not be saved on this device")
      show(el.error, true)
    }
    render()

    var entry = state.history[String(today)]
    if (entry) submitResult(entry.questionId, entry.band)
    reportPlayed(today)
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
  })

  // The numeric keypad a phone shows for inputmode="decimal" has no "e", so
  // scientific notation - which the guide tells people to use, and which the
  // answers genuinely need, spanning 10^-11 to 10^80 - was unreachable on the
  // device most people play on. This inserts it without giving up the keypad.
  el.exp.addEventListener("click", function () {
    var input = el["guess-input"]
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
  })

  el.remind.addEventListener("click", function () {
    if (remindEnabled()) disableReminder()
    else enableReminder()
  })

  el["hint-toggle"].addEventListener("click", function () {
    hintShown = true
    render()
    el["guess-input"].focus()
  })

  function flash(button, message) {
    var original = button.dataset.label || button.textContent
    button.dataset.label = original
    button.textContent = message
    setTimeout(function () { button.textContent = button.dataset.label }, 1600)
  }

  el.share.addEventListener("click", function () {
    var text = shareText(Model, state, question, today, location.origin + location.pathname)
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

  el["restore-toggle"].addEventListener("click", function () {
    var opening = el["restore-panel"].hasAttribute("hidden")
    show(el["restore-panel"], opening)
    if (opening) el["restore-input"].focus()
  })

  el["restore-go"].addEventListener("click", function () {
    var result = importState(Model, state, el["restore-input"].value)
    setText(el["restore-note"], result.message)
    show(el["restore-note"], true)
    if (!result.ok) return

    state = result.state
    if (!saveState(state, window.localStorage)) {
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
    var blob = exportState(state)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(blob)
        .then(function () { flash(el.export, "Copied") })
        .catch(function () { flash(el.export, "Could not copy") })
    }
  })

  // Static content, built once rather than on every render.
  renderHowToPlay(viewModel(Model, state, question, today, 0, false, QUESTIONS).howToPlay)
  render()

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

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", applyUpdate)

    // Registered after render so a failure here can never stop the puzzle from
    // showing. Absent on http:// origins other than localhost, and in browsers
    // with service workers disabled.
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {})
    })
  }
})()
