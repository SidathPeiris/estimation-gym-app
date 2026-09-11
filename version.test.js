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

// --- nothing in the precache list may redirect ---------------------------
//
// cache.addAll rejects the entire batch if any response is not ok, and a
// service worker that never finishes installing means the browser will not
// offer to install the app. The page still works, so there is no visible
// symptom - it simply stops being installable.
//
// This bit once. './index.html' sat in the list harmlessly while GitHub Pages
// served it as 200; Cloudflare answers it with a 307 to './', and the app
// became uninstallable the moment it moved host.
//
// The rule: precache the URL the app is opened at, never an alias of it.
{
  const open = sw.indexOf('var ASSETS = [')
  assert.ok(open >= 0, 'could not find the precache list in sw.js')
  const close = sw.indexOf(']', open)
  assert.ok(close > open, 'the precache list is not closed')

  const entries = sw.slice(open, close)
    .split(String.fromCharCode(10))
    .map((line) => line.trim())
    .filter((line) => line.indexOf('"') === 0)
    .map((line) => line.split('"')[1])

  assert.ok(entries.includes('./'), 'the app own URL must be precached')

  const aliases = ['./index.html', 'index.html', '/index.html', './install/index.html']
  for (const alias of aliases) {
    assert.ok(
      !entries.includes(alias),
      alias + ' is in the precache list. Static hosts redirect it to the ' +
      'directory, cache.addAll rejects on a redirect, and the service worker ' +
      'then never activates - which silently makes the app uninstallable.'
    )
  }

  console.log('precache: ' + entries.length + ' assets, no redirecting aliases')
}
