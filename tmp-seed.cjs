const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "server", "aurum.db");
const db = new Database(DB_PATH);

const newCategories = [
  { id: 'kids-collections', name: 'Kids Collections', slug: 'kids-collections' },
  { id: 'mens-jewellery', name: 'Mens Jewellery', slug: 'mens-jewellery' },
  { id: 'collections', name: 'Collections', slug: 'collections' },
  { id: 'more-jewellery', name: 'More Jewellery', slug: 'more-jewellery' }
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO categories (id, name, slug) 
  VALUES (@id, @name, @slug)
`);

const insertMany = db.transaction((cats) => {
  for (const cat of cats) insert.run(cat);
});

insertMany(newCategories);

console.log("Successfully seeded missing categories to the database!");

const rows = db.prepare('SELECT id, name FROM categories').all();
console.log("Current DB Categories:", rows.map(r => r.name).join(", "));
