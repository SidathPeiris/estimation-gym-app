// The app's version has one home, package.json, and everything else is pinned
// to it here.
//
//   node version.test.js
//
// Two separate numbers used to be in play: package.json said 0.1.0 and never
// moved, while the panel showed the service worker's cache counter, which was
// at v37. Neither answered "what am I running" on its own.

const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")

const pkg = require("./package.json")
const sw = readFileSync(path.join(__dirname, "sw.js"), "utf8")

// --- format: three numbers, none of them padded ---
//
// major.minor.patch, meaning a full release, a feature added within it, and a
// fix or small change within that. Padding a field to two digits ("01.02.03")
// reads tidily but is not a valid version: leading zeros are forbidden, every
// field would cap at 99, and anything that parses versions either rejects it
// outright or sorts it wrongly.
assert.match(
  pkg.version,
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
  `version "${pkg.version}" must be major.minor.patch with no leading zeros`
)

// --- the cache name carries the version ---
//
// The panel reads what it displays out of the live cache name rather than a
// constant, so it reports the build actually running instead of one a constant
// claims. That only tells the truth while the cache name and package.json
// agree, so they are pinned together here.
const expected = `estimation-gym-v${pkg.version}`
const declared = (sw.match(/var CACHE = "([^"]+)"/) || [])[1]

assert.equal(
  declared,
  expected,
  `sw.js caches as "${declared}" but package.json says ${pkg.version} - both move together`
)

// --- and it must change on every deploy ---
//
// A versioned cache is what replaces an old copy instead of stranding someone
// on a stale build, so shipping twice under one version leaves whoever already
// fetched the first one on old files with no signal that anything changed.
// This cannot be checked against what is live, so it is a rule rather than a
// test: bump the patch for every deploy, however small. DEVELOPING.md says so
// next to the deploy steps.
assert.ok(declared.startsWith("estimation-gym-v"), "cache name keeps its prefix")

console.log(`version ${pkg.version}, cache ${declared} - all version checks passed.`)

// --- the site must not exclude anything the app loads -------------------
//
// _config.yml stops GitHub Pages serving the Worker source, the tests and the
// build tooling. That list is edited by hand, and excluding a runtime asset
// would not fail anything here or in CI - it would simply take the live site
// down, quietly, on the next deploy.
//
// So every asset the service worker precaches is checked against it. Those are
// exactly the files the app cannot start without.

const configPath = path.join(__dirname, "_config.yml")
if (require("node:fs").existsSync(configPath)) {
  const config = readFileSync(configPath, "utf8")

  const excluded = config
    .split("\n")
    .map((line) => (line.match(/^\s*-\s+(.+?)\s*$/) || [])[1])
    .filter(Boolean)
    .filter((entry) => !entry.startsWith("#"))

  assert.ok(excluded.length > 5, "the exclude list looks empty - did the format change?")

  // The precache list is the definition of "needed to run".
  const assets = (sw.match(/var ASSETS = \[([\s\S]*?)\]/) || [])[1]
  assert.ok(assets, "could not find the precache list in sw.js")

  const needed = [...assets.matchAll(/"\.\/([^"]*)"/g)]
    .map((m) => m[1])
    .filter(Boolean)

  assert.ok(needed.length >= 10, `expected the precache list to be substantial, found ${needed.length}`)

  for (const asset of needed) {
    for (const entry of excluded) {
      const blocked = entry.endsWith("/")
        ? asset.startsWith(entry)
        : asset === entry
      assert.ok(
        !blocked,
        `_config.yml excludes "${entry}", which would stop Pages serving ` +
        `"${asset}" - the app precaches that and will not start without it`
      )
    }
  }

  // And the page itself, which is not in the precache list by that name.
  for (const entry of excluded) {
    assert.notEqual(entry, "index.html", "excluding index.html would serve an empty site")
    assert.notEqual(entry, "install/", "the install page is the one people are sent to")
  }

  console.log(`_config.yml hides ${excluded.length} dev paths, none of them needed at runtime`)
}
