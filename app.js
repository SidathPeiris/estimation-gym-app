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
             "error", "result", "band", "points", "guess-line", "actual-line",
             "decades-line", "share", "hint", "source",
             "hint-toggle", "strategy", "strategy-label", "strategy-guidance", "approach",
             "howto", "howto-toggle", "howto-chev", "howto-body",
             "howto-steps", "howto-intro", "howto-scoring", "howto-notes",
             "history", "history-toggle", "history-chev", "history-summary",
             "history-body", "history-list", "history-more",
             "stats", "stats-toggle", "chev", "stats-summary", "stats-body",
             "bars", "stats-footer", "calibration", "export"]
  ids.forEach(function (id) { el[id] = document.getElementById(id) })

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

  function hasAnsweredAnything(s) {
    return !!(s && s.history && Object.keys(s.history).length)
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
      el["history-list"].appendChild(item)
    })

    var more = history.total > history.shown
    show(el["history-more"], more)
    if (more) el["history-more"].textContent = "Show all " + history.total
  }

  function render() {
    var vm = viewModel(Model, state, question, today, historyLimit, hintShown)

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

    show(el.share, vm.answered)
    show(el.approach, Boolean(vm.answered && vm.strategyLabel))
    if (vm.strategyLabel) setText(el.approach, vm.strategyLabel)
    show(el.hint, Boolean(vm.hint))
    if (vm.hint) setText(el.hint, vm.hint)
    show(el.source, Boolean(vm.source))
    if (vm.source) setText(el.source, vm.source)

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
    state = Model.recordAnswer(state, today, check.value, question.answerValue, hintShown)
    if (!saveState(state, window.localStorage)) {
      setText(el.error, "Scored, but your streak could not be saved on this device")
      show(el.error, true)
    }
    render()
  }

  el["guess-form"].addEventListener("submit", submit)

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
  renderHowToPlay(viewModel(Model, state, question, today, 0, false).howToPlay)
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

  // Registered after render so a failure here can never stop the puzzle from
  // showing. Absent on http:// origins other than localhost, and in browsers
  // with service workers disabled.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {})
    })
  }
})()
