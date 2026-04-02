const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../server/aurum.db');
const mockDir = path.join(__dirname, '../public/mock');

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at:", dbPath);
  process.exit(1);
}

const db = new Database(dbPath);

function syncTable(tableName, fileName, key) {
  try {
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
    const formattedRows = rows.map(row => {
      // Parse JSON fields
      if (row.attributes) row.attributes = JSON.parse(row.attributes);
      if (row.images) row.images = JSON.parse(row.images);
      if (row.items) row.items = JSON.parse(row.items);
      return row;
    });

    const data = key ? { [key]: formattedRows } : formattedRows;
    const filePath = path.join(mockDir, `${fileName}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully synced ${tableName} to ${fileName}.json (${rows.length} rows)`);
  } catch (err) {
    console.error(`Error syncing ${tableName}:`, err.message);
  }
}

// Sync all relevant tables
syncTable('products', 'products', 'products');
syncTable('categories', 'categories', 'categories');
syncTable('creator_reels', 'creator-reels', 'reels');
syncTable('reviews', 'testimonials', 'reviews');
syncTable('gallery', 'gallery', 'photos');

db.close();
