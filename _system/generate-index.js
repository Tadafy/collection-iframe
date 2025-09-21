/**
 * generate-index.js
 * 
 * Skripta, ki pregleda vse komponente v root folderju (und, out, fill, ...),
 * in ustvari glavni index.html v root repozitorija.
 * 
 * Ta index vsebuje seznam povezav na vse posamezne komponente (iframe index.html).
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, ".."); // eno nivo višje od _system
const OUTPUT_FILE = path.join(ROOT_DIR, "index.html");

// katere mape v rootu štejemo kot kategorije komponent
const IGNORE_FOLDERS = ["_system", ".git", ".github", "node_modules"];

function generateIndex() {
  const categories = fs.readdirSync(ROOT_DIR).filter(dir => {
    const fullPath = path.join(ROOT_DIR, dir);
    return fs.statSync(fullPath).isDirectory() && !IGNORE_FOLDERS.includes(dir);
  });

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tadafy Component Index</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; line-height: 1.6; }
    h1 { margin-bottom: 1rem; }
    h2 { margin-top: 2rem; }
    ul { list-style: none; padding-left: 1rem; }
    li { margin-bottom: 0.5rem; }
    a { text-decoration: none; color: #0366d6; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Tadafy Component Index</h1>
`;

  categories.forEach(category => {
    html += `<h2>${category}</h2>\n<ul>\n`;

    const components = fs.readdirSync(path.join(ROOT_DIR, category)).filter(cmp => {
      const cmpPath = path.join(ROOT_DIR, category, cmp);
      return fs.statSync(cmpPath).isDirectory();
    });

    components.forEach(cmp => {
      const link = `${category}/${cmp}/`;
      html += `  <li><a href="${link}" target="_blank">${cmp}</a></li>\n`;
    });

    html += `</ul>\n`;
  });

  html += `
</body>
</html>
`;

  fs.writeFileSync(OUTPUT_FILE, html, "utf-8");
  console.log(`✅ Index generated: ${OUTPUT_FILE}`);
}

generateIndex();
