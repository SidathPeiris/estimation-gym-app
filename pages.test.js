// Checks that the two exclude lists agree with each other, and that neither of
// them hides something the app needs at runtime.
//
//   node pages.test.js
//
// This is the test `.assetsignore` claimed existed and did not. Its header said
// `pages.test.js` held the two lists in step and that `version.test.js` checked
// the precache list against both; neither was true. The comment had been there
// long enough to be believed, which is the whole problem with describing a
// guard instead of writing one - nobody writes it, because it reads as done.
//
// Two hosts serve this repository at once and they decide what to publish in
// completely different ways:
//
//   Cloudflare Workers  uploads everything under `assets.directory` (the
//                       repository root) except what `.assetsignore` lists.
//   GitHub Pages        publishes everything except what `_config.yml` lists,
//                       plus dotfiles and top-level `_` entries, which Jekyll
//                       hides on its own without being told.
//
// So a file can be excluded from one host and served by the other, and nothing
// about either file makes that visible. When this test was first run it found
// two live examples: `/.gitignore` returned 200 from Workers, and
// `/wrangler.jsonc` returned 200 from Pages. Both harmless in content, both
// precisely the drift this is here to stop.
//
// The failure that actually costs something is the other direction. Every
// precache entry has to be fetchable, because `cache.addAll` rejects the whole
// batch on a single non-ok response - the service worker then never finishes
// installing, the app silently stops being installable, and the page keeps
// working so nothing looks wrong. Excluding a precached asset from a deploy is
// one of the few edits that can cause that, and it would be an easy one to make
// while tidying a list of development files.

const assert = require("node:assert/strict")
const { readFileSync, readdirSync } = require("node:fs")
const path = require("node:path")

const root = __dirname

// --- reading the two lists -------------------------------------------------

function assetsignorePatterns() {
  return readFileSync(path.join(root, ".assetsignore"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
}

// Jekyll's `exclude:` is a flat YAML list of `- entry` lines. Nothing else in
// this file is a list, so reading it this way needs no YAML parser - and adding
// one would be a dependency for a repository that deliberately has none.
function configExcludes() {
  const text = readFileSync(path.join(root, "_config.yml"), "utf8")
  const start = text.indexOf("exclude:")
  assert.ok(start >= 0, "_config.yml has no exclude: list")
  return text
    .slice(start)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
}

// Both lists use the same shapes: a bare path, a `dir/` prefix, or a `*.ext`
// suffix. Neither host is given anything more elaborate than that, and keeping
// the matcher this small is deliberate - a clever one would quietly disagree
// with the hosts it is meant to model.
function matched(patterns, file) {
  return patterns.some((p) => {
    if (p.endsWith("/")) return file === p.slice(0, -1) || file.startsWith(p)
    if (p.startsWith("*.")) return file.endsWith(p.slice(1))
    return file === p || file.startsWith(p + "/")
  })
}

// Jekyll hides these whether or not `exclude:` mentions them: anything with a
// dot-segment, and anything whose top-level entry begins with an underscore,
// which is how `_posts` and `_layouts` stay unpublished.
function jekyllHidesByDefault(file) {
  const segments = file.split("/")
  return segments.some((s) => s.startsWith(".")) || segments[0].startsWith("_")
}

// --- walking the repository ------------------------------------------------

// `.git` and `node_modules` are not deployable by either host, and `.wrangler`
// is local build state.
const SKIP_DIRS = new Set([".git", "node_modules", ".wrangler"])

function walk(dir = "", out = []) {
  for (const entry of readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const rel = dir ? dir + "/" + entry.name : entry.name
    if (entry.isDirectory()) walk(rel, out)
    else out.push(rel)
  }
  return out
}

// --- what the service worker precaches -------------------------------------

function precachedPaths() {
  const sw = readFileSync(path.join(root, "sw.js"), "utf8")
  const open = sw.indexOf("var ASSETS = [")
  assert.ok(open >= 0, "could not find the precache list in sw.js")
  const close = sw.indexOf("]", open)
  assert.ok(close > open, "the precache list is not closed")

  return sw
    .slice(open, close)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith('"'))
    .map((line) => line.split('"')[1])
    // "./" is the app's own URL; both hosts answer it with index.html.
    .map((url) => (url === "./" ? "index.html" : url.replace(/^\.\//, "")))
}

// --- the exceptions, and why they are exceptions ---------------------------

// `_headers` is read by Cloudflare as configuration and never served as an
// asset, and Jekyll hides it for beginning with an underscore. So it is absent
// from both hosts - 404 on each, verified - despite appearing in neither list.
// Listing it in `.assetsignore` would be wrong rather than redundant: that file
// is what the host consumes, and hiding it from the upload would take the
// security headers with it.
const CONSUMED_BY_THE_PLATFORM = new Set(["_headers"])

// ---------------------------------------------------------------------------

const workers = assetsignorePatterns()
const jekyll = configExcludes()
const files = walk()

const servedByWorkers = (f) => !matched(workers, f)
const servedByPages = (f) => !matched(jekyll, f) && !jekyllHidesByDefault(f)

// --- 1. nothing the app loads at runtime may be excluded from either host ---

for (const asset of precachedPaths()) {
  assert.ok(
    servedByWorkers(asset),
    `sw.js precaches "${asset}" but .assetsignore keeps it out of the deploy. ` +
    `cache.addAll rejects the whole batch on one missing file, so the service ` +
    `worker would never activate and the app would stop being installable - ` +
    `with the page still working, so nothing would look broken.`
  )
  assert.ok(
    servedByPages(asset),
    `sw.js precaches "${asset}" but _config.yml (or Jekyll's own dotfile and ` +
    `underscore rules) keeps it off the Pages host, where the app is also live.`
  )
}

console.log(`precache: ${precachedPaths().length} assets, all served by both hosts`)

// --- 2. the two lists must reach the same verdict on every file ------------

const divergent = files.filter((f) => {
  if (CONSUMED_BY_THE_PLATFORM.has(f)) return false
  return servedByWorkers(f) !== servedByPages(f)
})

assert.deepEqual(
  divergent,
  [],
  "these files are published by one host and hidden by the other:\n" +
  divergent
    .map((f) => `  ${f} - served by ${servedByWorkers(f) ? "Workers" : "Pages"}, ` +
                `hidden from ${servedByWorkers(f) ? "Pages" : "Workers"}`)
    .join("\n") +
  "\nAdd it to the list that is missing it, or - if it genuinely belongs on " +
  "one host only - say so in CONSUMED_BY_THE_PLATFORM with the reason."
)

console.log(`exclude lists: ${files.length} files, both hosts agree on every one`)

// --- 3. the design system is not a public asset ----------------------------

// `.claude/` holds the design system - components, specimen pages, icons and
// documentation the app never loads. It may or may not be committed; that is a
// judgement call and not this test's business. What is this test's business is
// that committing it cannot quietly publish it, because `assets.directory` is
// the repository root and everything not excluded goes up.
{
  const present = readdirSync(root, { withFileTypes: true })
    .some((e) => e.isDirectory() && e.name === ".claude")

  if (present) {
    const sample = ".claude/skills"
    assert.ok(
      !servedByWorkers(sample),
      ".claude/ exists but .assetsignore does not exclude it - committing it " +
      "would publish the design system at /.claude/."
    )
    assert.ok(
      !servedByPages(sample),
      ".claude/ exists but _config.yml does not exclude it."
    )
    console.log(".claude/ present and excluded from both hosts")
  } else {
    console.log(".claude/ not present - nothing to exclude")
  }
}

console.log("all deploy-exclusion checks passed.")
