const fs = require("node:fs");
const path = require("node:path");

const destination = path.join(__dirname, "dist");
const publicFiles = [
  "index.html",
  "map.css",
  "stories.js",
  "map.js",
  "wildlife.js",
  "ambience.js",
  "mobile.js",
  "assets",
];

// Package the island at the domain root without publishing drafts or tests.
fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
for (const file of publicFiles) {
  fs.cpSync(path.join(__dirname, file), path.join(destination, file), {
    recursive: true,
  });
}
fs.copyFileSync(
  path.join(__dirname, "..", "resume.pdf"),
  path.join(destination, "resume.pdf"),
);
fs.copyFileSync(
  path.join(__dirname, "..", "public", "robots.txt"),
  path.join(destination, "robots.txt"),
);
console.log("Packaged the pixel island in pixel-map/dist.");
