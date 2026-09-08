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
             "history", "history-toggle", "history-chev", "history-summary",
             "history-body", "history-list", "history-more",
             "stats", "stats-toggle", "chev", "stats-summary", "stats-body",
             "bars", "stats-footer", "calibration", "export"]
  ids.forEach(function (id) { el[id] = document.getElementById(id) })

  var today = Model.dayIndex(new Date())
  var question = Model.questionForDay(today, QUESTIONS)
  var state = loadState(Model, window.localStorage)
  var statsOpen = false
  var historyOpen = false
  var historyLimit = HISTORY_PAGE   // 0 means show every day played

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
      band.textContent = row.band

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
    var vm = viewModel(Model, state, question, today, historyLimit)

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

    show(el.share, vm.answered)
    show(el.hint, Boolean(vm.hint))
    if (vm.hint) setText(el.hint, vm.hint)
    show(el.source, Boolean(vm.source))
    if (vm.source) setText(el.source, vm.source)

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
    state = Model.recordAnswer(state, today, check.value, question.answerValue)
    if (!saveState(state, window.localStorage)) {
      setText(el.error, "Scored, but your streak could not be saved on this device")
      show(el.error, true)
    }
    render()
  }

  el["guess-form"].addEventListener("submit", submit)

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

  render()

  // Registered after render so a failure here can never stop the puzzle from
  // showing. Absent on http:// origins other than localhost, and in browsers
  // with service workers disabled.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {})
    })
  }
})()
