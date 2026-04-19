const files = ['server/aurum.db', 'server/Mohen.db', 'server/sohen.db'];
files.forEach(f => {
  try {
    const db = require('better-sqlite3')(f, {readonly: true});
    const c = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
    console.log(`${f}: ${c} products`);
    db.close();
  } catch(e) {
    console.log(`${f}: ERROR ${e.message}`);
  }
});
