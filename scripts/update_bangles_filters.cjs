const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "server", "aurum.db");
const db = new Database(DB_PATH);

console.log("💾 Connecting to database at:", DB_PATH);

// Define attribute options for Bangles
const designTypes = ["Antique Bangles", "Daily Wear Bangles", "Premium Elite Bangles", "Light Weight"];
const collections = ["Bridal Dreams", "Enamel Imperial", "Antique Parampara", "Premium Elite"];
const occasions = ["Wedding", "Engagement", "Daily Wear", "Office wear", "Bridal Wear"];
const gifts = ["Wedding", "Engagement", "Gifts for Wife", "Gifts for Mother", "Anniversary", "Birthday"];
const metals = ["22 Karat", "18 Karat"];
const colors = ["Yellow", "White", "Rose"];

try {
  const bangles = db.prepare("SELECT id, name FROM products WHERE category = 'bangles'").all();
  console.log(`🔍 Found ${bangles.length} bangles to update.`);

  const updateStmt = db.prepare(`
    UPDATE products 
    SET attributes = ?, purity = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  bangles.forEach((bangle, i) => {
    // Deterministic "random" picks based on index to ensure variety
    const pickMultiple = (arr, count) => {
      const result = [];
      for (let j = 0; j < count; j++) {
        const item = arr[(i + j * 3) % arr.length];
        if (!result.includes(item)) result.push(item);
      }
      return result;
    };

    const attrs = {
      "Design Types": pickMultiple(designTypes, (i % 2) + 1),
      "Collection": pickMultiple(collections, 1),
      "Occasion": pickMultiple(occasions, (i % 3) + 1),
      "Shop For": ["Women"],
      "Gifts": pickMultiple(gifts, 1),
      "Metal": [metals[i % metals.length]],
      "Color": [colors[i % colors.length]]
    };

    const purity = attrs.Metal[0];
    
    updateStmt.run(JSON.stringify(attrs), purity, bangle.id);
    console.log(`✅ Updated: ${bangle.name} (${bangle.id})`);
  });

  console.log("\n✨ All bangles updated successfully!");
} catch (error) {
  console.error("❌ Error updating bangles:", error);
} finally {
  db.close();
}
