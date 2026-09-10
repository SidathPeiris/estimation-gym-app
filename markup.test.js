// Checks that the pages nest correctly.
//
//   node markup.test.js
//
// This exists because of a specific failure. Moving the confession dialog left
// its closing </div> behind at the old location: the total number of opening
// and closing tags was unchanged, so a count-based check said "balanced" and
// passed, while every section below the dialog had become a child of it. The
// dialog carries `hidden`, so the chart, history, stats, practice, how-to-play
// and the suggestion form all vanished from a shipped build.
//
// Counting tags cannot catch that. Matching them can.

const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")

// Elements that never wrap content and so never close.
const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr", "!doctype"
])

function check(file) {
  let html = readFileSync(path.join(__dirname, file), "utf8")

  // Comments and raw-text elements can contain anything that looks like a tag.
  html = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "<script></script>")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "<style></style>")

  const stack = []
  const tag = /<(\/?)([a-zA-Z!][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g
  let m

  while ((m = tag.exec(html)) !== null) {
    const closing = m[1] === "/"
    const name = m[2].toLowerCase()
    const selfClosed = m[4] === "/"

    if (VOID.has(name) || selfClosed) continue

    if (!closing) {
      stack.push({ name, at: m.index })
      continue
    }

    const open = stack.pop()
    assert.ok(
      open,
      `${file}: </${name}> closes nothing (at character ${m.index})`
    )
    assert.equal(
      open.name,
      name,
      `${file}: </${name}> closes a <${open.name}> that opened at character ` +
      `${open.at} - the tags are crossed, so everything between them is nested ` +
      `somewhere it does not belong`
    )
  }

  assert.equal(
    stack.length,
    0,
    `${file}: ${stack.length} element(s) never closed: ` +
    stack.map((e) => `<${e.name}> at character ${e.at}`).join(", ") +
    ` - everything after this is nested inside it`
  )

  return html
}

for (const file of ["index.html", "install/index.html"]) {
  check(file)
  console.log(`${file} nests correctly`)
}

// --- and the specific thing that broke ---
//
// The dialog is hidden until an exact guess earns it. Anything that ends up
// inside it is hidden too, so the sections that follow must be its siblings
// rather than its children.
const app = readFileSync(path.join(__dirname, "index.html"), "utf8")
const dialogStart = app.indexOf('<div class="confess"')
const dialogEnd = app.indexOf("</div>", app.indexOf("confess-actions")) // closes .confess-actions
const dialogClose = app.indexOf("</div>", dialogEnd + 6)                // closes .confess

assert.ok(dialogStart >= 0 && dialogClose > dialogStart, "the confession dialog is not where expected")

for (const id of ["dist", "history", "stats", "practice", "howto", "suggest"]) {
  const at = app.indexOf(`id="${id}"`)
  if (at < 0) continue
  assert.ok(
    at > dialogClose,
    `#${id} sits inside the confession dialog, which is hidden - it would ` +
    `never appear`
  )
}

console.log("nothing is trapped inside the hidden confession dialog")
