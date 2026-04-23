const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist-cloudflare");

const copyFile = (name) => {
  fs.copyFileSync(path.join(root, name), path.join(outDir, name));
};

const copyDir = (name) => {
  fs.cpSync(path.join(root, name), path.join(outDir, name), { recursive: true });
};

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

fs.readdirSync(root)
  .filter((name) => name.endsWith(".html"))
  .forEach(copyFile);

["styles.css", "script.js"].forEach(copyFile);
["assets"].forEach(copyDir);

console.log(`Cloudflare assets built in ${outDir}`);
