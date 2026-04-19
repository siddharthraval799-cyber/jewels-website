const cp = require('child_process');
const fs = require('fs');

const dbPath = 'tmp.db';
const hashes = cp.execSync('git rev-list --all -- server/aurum.db').toString().trim().split('\n');
console.log(`Checking ${hashes.length} commits...`);

for (let hash of hashes) {
  try {
    cp.execSync(`git show ${hash}:server/aurum.db > ${dbPath}`);
    const db = require('better-sqlite3')(dbPath, {readonly: true});
    const c = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
    console.log(`Commit ${hash} : ${c} products`);
    db.close();
  } catch (err) {
    console.log(`Commit ${hash} : Error reading DB`);
  }
}
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
