const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'server.cjs');
let code = fs.readFileSync(serverPath, 'utf-8');

// Replace standard better-sqlite3 require with db-wrapper
code = code.replace(/const db = require\("\.\/db\.cjs"\);/g, 'const db = require("./db-wrapper.cjs");');

// Add async to all route handlers
code = code.replace(/app\.(get|post|put|delete)\("([^"]+)", (authMiddleware, )?(adminMiddleware, )?\(req, res\) => {/g, 'app.$1("$2", $3$4async (req, res) => {');
code = code.replace(/app\.(get|post|put|delete)\("([^"]+)", \(req, res\) => {/g, 'app.$1("$2", async (req, res) => {');

// Add await to db.prepare(...).xxx()
code = code.replace(/db\.prepare\(([^)]+)\)\.all\(([^)]*)\)/g, 'await db.prepare($1).all($2)');
code = code.replace(/db\.prepare\(([^)]+)\)\.get\(([^)]*)\)/g, 'await db.prepare($1).get($2)');
code = code.replace(/db\.prepare\(([^)]+)\)\.run\(([^)]*)\)/g, 'await db.prepare($1).run($2)');

// Fix double awaits if script is run twice
code = code.replace(/await await/g, 'await');

// Special case: `const stmt = db.prepare(...); const result = stmt.all();`
// In server.cjs, there is:
// const batch = db.transaction((entries) => { for (const [k,v] of entries) upsert.run(k,v) })
// Let's manually rewrite the settings upsert logic.
code = code.replace(
  /const upsert = db\.prepare\([^)]+\);[\s\n]*const batch = db\.transaction\(\(entries\) => {[\s\n]*for \(const \[key, value\] of entries\) {[\s\n]*upsert\.run\(key, String\(value\)\);[\s\n]*}[\s\n]*}\);[\s\n]*batch\(Object\.entries\(settings\)\);/g,
  `const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at").run(key, String(value));
    }`
);

fs.writeFileSync(serverPath, code);
console.log("Migration script complete");
