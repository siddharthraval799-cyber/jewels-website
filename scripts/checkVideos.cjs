const db = require('better-sqlite3')('server/aurum.db');
const rows = db.prepare('SELECT name, videoUrl FROM products WHERE videoUrl IS NOT NULL LIMIT 10').all();
console.log("Found products with uploaded videos:", rows.length);
console.table(rows);
