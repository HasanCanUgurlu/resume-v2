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
  "resume.pdf",
  "robots.txt",
];

// Publish the island without development files or retained story drafts.
fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
for (const file of publicFiles) {
  fs.cpSync(path.join(__dirname, file), path.join(destination, file), {
    recursive: true,
  });
}
console.log("Packaged the pixel island in dist.");
