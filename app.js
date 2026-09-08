(function () {
  "use strict"

  // core/Model.js and core/questions.js are vendored verbatim from the Omarchy
  // plugin, so they load as classic scripts and expose their declarations
  // globally. Collect them into one object matching the shape presenter.js and
  // storage.js expect, which is also the shape require() gives them under node.
  var Model = {
    dayIndex: dayIndex,
    questionForDay: questionForDay,
    hasAnsweredDay: hasAnsweredDay,
    recordAnswer: recordAnswer,
    computeStats: computeStats,
    calibrationLabel: calibrationLabel,
    formatCompact: formatCompact,
    pointsForBand: pointsForBand,
    emptyState: emptyState,
    BANDS: BANDS,
    CALIBRATION_MIN_PLAYS: CALIBRATION_MIN_PLAYS
  }

  // This facade is assembled by hand, so a function added to Model.js but
  // forgotten here throws mid-render and leaves a blank page with the failure
  // buried in the console. Check it up front and say so on screen instead.
  var missing = ["dayIndex", "questionForDay", "hasAnsweredDay", "recordAnswer",
                 "computeStats", "calibrationLabel", "formatCompact",
                 "pointsForBand", "emptyState", "BANDS"]
    .filter(function (name) { return Model[name] === undefined })

  if (missing.length) {
    document.getElementById("prompt").textContent =
      "Setup error: Model is missing " + missing.join(", ")
    return
  }

  var el = {}
  var ids = ["puzzle", "streak", "asof", "prompt", "guess-form", "guess-input", "guess-go",
             "error", "result", "band", "points", "guess-line", "actual-line",
             "decades-line", "hint", "source", "stats", "stats-toggle", "chev",
             "stats-summary", "stats-body", "bars", "stats-footer", "calibration",
             "export"]
  ids.forEach(function (id) { el[id] = document.getElementById(id) })

  var today = Model.dayIndex(new Date())
  var question = Model.questionForDay(today, QUESTIONS)
  var state = loadState(Model, window.localStorage)
  var statsOpen = false

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

  function render() {
    var vm = viewModel(Model, state, question, today)

    setText(el.puzzle, vm.puzzleLabel)
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

    show(el.hint, Boolean(vm.hint))
    if (vm.hint) setText(el.hint, vm.hint)
    show(el.source, Boolean(vm.source))
    if (vm.source) setText(el.source, vm.source)

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

  el["stats-toggle"].addEventListener("click", function () {
    statsOpen = !statsOpen
    render()
  })

  el.export.addEventListener("click", function () {
    var blob = exportState(state)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(blob).then(function () {
        el.export.textContent = "Copied"
        setTimeout(function () { el.export.textContent = "Copy my history" }, 1600)
      })
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
