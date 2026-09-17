// Minimal static server for local development. A real origin is needed because
// localStorage behaves inconsistently on file:// URLs, and service workers
// (added later) will not register there at all.
//
//   node scripts/serve.mjs [port]

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || 8123);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  // Without this a font falls through to application/octet-stream, which the
  // production headers would refuse outright - _headers sets nosniff.
  ".woff2": "font/woff2"
};

createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split("?")[0]);
  // A directory URL resolves to its index.html, the way the static host does.
  // Only "/" did before, so "/install/" answered "not found" locally while it
  // worked perfectly in production - which made the install page effectively
  // untestable without deploying it.
  const file = join(root, path.endsWith("/") ? path + "index.html" : path);
  if (!file.startsWith(root)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" }).end("not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Estimation Gym on http://127.0.0.1:${port}`);
});
