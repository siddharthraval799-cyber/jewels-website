const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const DB_PATH = path.join(__dirname, "aurum.db");
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT '',
    image TEXT DEFAULT '',
    displayOrder INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    weight REAL NOT NULL,
    purity TEXT DEFAULT '22K',
    makingCharges INTEGER DEFAULT 0,
    description TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    bestSeller INTEGER DEFAULT 0,
    newArrival INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    attributes TEXT DEFAULT '{}',
    price REAL DEFAULT NULL,
    videoUrl TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    addresses TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    orderNumber TEXT UNIQUE NOT NULL,
    userId TEXT,
    items TEXT NOT NULL DEFAULT '[]',
    subtotal REAL DEFAULT 0,
    shipping REAL DEFAULT 0,
    tax REAL DEFAULT 0,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    shippingAddress TEXT DEFAULT '{}',
    contactInfo TEXT DEFAULT '{}',
    paymentMethod TEXT DEFAULT 'cod',
    paymentStatus TEXT DEFAULT 'pending',
    trackingNumber TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    productId TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(userId, productId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    userName TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS feedback_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    videoUrl TEXT NOT NULL,
    thumbnailUrl TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    displayOrder INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL,
    jewelryName TEXT DEFAULT '',
    displayOrder INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS creator_reels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    videoUrl TEXT NOT NULL,
    thumbnailUrl TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    displayOrder INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Safely attempt to add the new attributes column for existing users
try {
  db.exec("ALTER TABLE products ADD COLUMN attributes TEXT DEFAULT '{}'");
} catch(e) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN price REAL DEFAULT NULL");
} catch(e) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN videoUrl TEXT DEFAULT NULL");
} catch(e) {}

// ═══════════════════════════════════════════════════════════
// SEED DATA — runs only if tables are empty
// ═══════════════════════════════════════════════════════════

const categoryCount = db.prepare("SELECT COUNT(*) as c FROM categories").get().c;
if (categoryCount === 0) {
  console.log("🌱 Seeding categories...");
  const cats = [
    { id: "rings", name: "Rings", slug: "rings", icon: "💍", order: 1 },
    { id: "earrings", name: "Earrings", slug: "earrings", icon: "✨", order: 2 },
    { id: "necklaces", name: "Necklaces", slug: "necklaces", icon: "📿", order: 3 },
    { id: "bangles", name: "Bangles", slug: "bangles", icon: "⭕", order: 4 },
    { id: "bracelets", name: "Bracelets", slug: "bracelets", icon: "🔗", order: 5 },
    { id: "chains", name: "Chains", slug: "chains", icon: "⛓️", order: 6 },
    { id: "pendants", name: "Pendants", slug: "pendants", icon: "💎", order: 7 },
  ];
  const insertCat = db.prepare("INSERT INTO categories (id, name, slug, icon, displayOrder) VALUES (?, ?, ?, ?, ?)");
  cats.forEach(c => insertCat.run(c.id, c.name, c.slug, c.icon, c.order));
} else {
  // Ensure mangalsutra is there
  const msCount = db.prepare("SELECT COUNT(*) as c FROM categories WHERE id = 'mangalsutra'").get().c;
  if(msCount === 0) {
    db.prepare("INSERT INTO categories (id, name, slug, icon, displayOrder) VALUES (?, ?, ?, ?, ?)").run("mangalsutra", "Mangalsutra", "mangalsutra", "📿", 8);
  }
}

const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
if (userCount === 0) {
  console.log("🌱 Seeding admin user...");
  const adminId = "admin-001";
  const hash = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (id, name, email, phone, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)")
    .run(adminId, "Admin", "admin@aurumjewels.com", "+91 63566 47453", hash, "admin");
}

const productCount = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
if (productCount === 0) {
  console.log("🌱 Seeding products...");

  const descriptions = {
    rings: "Exquisitely crafted in premium gold, this ring features intricate detailing and a timeless design that elevates any ensemble.",
    earrings: "These stunning earrings showcase masterful craftsmanship with delicate patterns that catch the light beautifully.",
    necklaces: "A magnificent piece that drapes elegantly, this necklace is a testament to the artistry of traditional Indian jewelry making.",
    bangles: "This bangle embodies grace and tradition, with hand-finished details that make it a cherished addition to any collection.",
    bracelets: "A sophisticated bracelet combining modern design with classic gold craftsmanship for everyday luxury.",
    chains: "Crafted with precision, this chain features a strong yet elegant design suitable for pendants or standalone wear.",
    pendants: "This pendant is a miniature work of art, featuring detailed craftsmanship that carries deep symbolic meaning.",
  };

  const allItems = [
    { names: ["Royal Heritage Ring", "Celestial Bloom Ring", "Maharani Solitaire", "Eternal Knot Band", "Lotus Petal Ring", "Diamond Halo Ring", "Vintage Filigree Ring", "Mogul Crown Ring", "Twisted Vine Ring", "Classic Signet Ring", "Pearl Cluster Ring", "Art Deco Ring", "Infinity Promise Ring", "Temple Dome Ring", "Aurora Borealis Ring"], category: "rings" },
    { names: ["Chandelier Drop Earrings", "Jhumka Heritage Earrings", "Diamond Stud Earrings", "Peacock Feather Drops", "Gold Hoop Earrings", "Kundan Chandbali", "Ruby Cascade Earrings", "Pearl Button Earrings", "Floral Cluster Studs", "Geometric Dangle Earrings", "Temple Bell Earrings", "Crescent Moon Earrings", "Tassel Drop Earrings", "Emerald Stud Earrings"], category: "earrings" },
    { names: ["Maharani Choker Set", "Layered Temple Necklace", "Diamond Rivière Necklace", "Kundan Bridal Set", "Polki Heritage Necklace", "Pearl Strand Necklace", "Gold Filigree Chain", "Ruby Cluster Necklace", "Antique Coin Necklace", "Emerald Statement Necklace", "Hasli Gold Necklace", "Lakshmi Haar", "Opera Length Chain"], category: "necklaces" },
    { names: ["Traditional Kada Bangle", "Diamond Studded Bangle", "Twisted Gold Bangle", "Meenakari Bangle Set", "Slim Stackable Bangles", "Rajasthani Broad Bangle", "Floral Cutwork Bangle", "Stone Encrusted Bangle", "Plain Polished Bangle", "Antique Finish Bangle", "Navratan Bangle", "Celtic Knot Bangle"], category: "bangles" },
    { names: ["Tennis Diamond Bracelet", "Chain Link Bracelet", "Charm Bracelet Gold", "Cuff Statement Bracelet", "Pearl Strand Bracelet", "Herringbone Bracelet", "Byzantine Chain Bracelet", "Flexible Mesh Bracelet", "Bangle Bracelet Hybrid"], category: "bracelets" },
    { names: ["Rope Chain 22K", "Box Chain Delicate", "Figaro Chain Classic", "Cuban Link Chain", "Wheat Chain Fine", "Singapore Twist Chain", "Belcher Chain Bold", "Venetian Box Chain", "Anchor Marine Chain"], category: "chains" },
    { names: ["Ganesh Om Pendant", "Diamond Solitaire Pendant", "Heart Locket Pendant", "Peacock Pendant", "Evil Eye Pendant", "Cross Pendant Gold", "Lotus Pendant", "Star Burst Pendant", "Hamsa Hand Pendant", "Initial Letter Pendant", "Medallion Pendant"], category: "pendants" },
  ];

  const insertProduct = db.prepare(
    `INSERT INTO products (id, name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival, attributes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let id = 1;
  const seededRandom = (seed) => {
    // Simple deterministic pseudo-random for consistent seed data
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  allItems.forEach(({ names, category }) => {
    names.forEach((name, i) => {
      const seed = id;
      const weight = category === "necklaces" ? 15 + seededRandom(seed) * 40 :
        category === "bangles" ? 10 + seededRandom(seed + 1) * 25 :
        category === "chains" ? 8 + seededRandom(seed + 2) * 20 :
        category === "bracelets" ? 6 + seededRandom(seed + 3) * 15 :
        2 + seededRandom(seed + 4) * 12;

      insertProduct.run(
        `prod-${id++}`,
        name,
        category,
        parseFloat(weight.toFixed(2)),
        "22K",
        Math.round((500 + seededRandom(seed + 5) * 4500) / 100) * 100,
        descriptions[category],
        JSON.stringify(["/placeholder.svg"]),
        i < 2 ? 1 : 0,
        i >= 2 && i < 4 ? 1 : 0,
        i >= 4 && i < 6 ? 1 : 0,
        JSON.stringify({})
      );
    });
  });

  console.log(`🌱 Seeded ${id - 1} products`);
}

// Ensure 50 mangalsutra items
const mangalsutraCount = db.prepare("SELECT COUNT(*) as c FROM products WHERE category = 'mangalsutra'").get().c;
if (mangalsutraCount < 50) {
  console.log("🌱 Seeding 50 Mangalsutras with attributes...");
  const designTypes = ["Light Weight", "Heart", "Antique", "Heritage", "Premium Elite"];
  const collections = ["Bridal Dreams", "Heart Harmony", "Mother of Pearl", "Antique Parampara", "Premium Elite"];
  const occasions = ["Anniversary", "Wedding", "Birthday", "Desk to Dinner", "Daily Wear"];
  const shopFor = ["Women"];
  const gifts = ["Anniversary", "Birthday", "Gifts for Wife"];
  const metals = ["22 Karat", "18 Karat"];
  const colors = ["Yellow", "White", "Rose"];
  
  const insertProduct = db.prepare(
    `INSERT INTO products (id, name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival, attributes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  
  for (let i = 0; i < 50; i++) {
     const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
     const pickMultiple = (arr) => {
        const num = Math.floor(Math.random() * 2) + 1;
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
     };

     const attributes = {
        "Design Types": pickMultiple(designTypes),
        "Collection": pickMultiple(collections),
        "Occasion": pickMultiple(occasions),
        "Shop For": ["Women"], // Default to Women
        "Gifts": pickMultiple(gifts),
        "Metal": [pickRandom(metals)],
        "Color": [pickRandom(colors)]
     };

     const namePrefixes = ["Pranava", "Aanvika", "Kanak", "Svarnasut", "Parampara", "Ishira", "Dudhira", "Kanika"];
     const nameSuffixes = ["Vayujyoti", "Latticeline", "Rahasya", "Taraashta", "Vedika", "Vaidurya", "Kalyani", "Vilas"];
     const name = `${pickRandom(namePrefixes)} ${pickRandom(nameSuffixes)} Mangalsutra ${attributes.Metal[0].split(' ')[0]}KT`;

     insertProduct.run(
        `prod-ms-${Date.now()}-${i}`,
        name,
        "mangalsutra",
        parseFloat((5 + Math.random() * 45).toFixed(2)), // 5gm - 50gm
        attributes.Metal[0],
        Math.round((1000 + Math.random() * 5000) / 100) * 100, // randomized making charges
        "Elegant mangalsutra meticulously crafted to celebrate your eternal bond.",
        JSON.stringify(["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"]),
        Math.random() > 0.8 ? 1 : 0,
        Math.random() > 0.8 ? 1 : 0,
        Math.random() > 0.8 ? 1 : 0,
        JSON.stringify(attributes)
     );
  }
  console.log("🌱 Successfully seeded mangalsutras!");
}

// Seed default settings
const settingsCount = db.prepare("SELECT COUNT(*) as c FROM settings").get().c;
if (settingsCount === 0) {
  console.log("🌱 Seeding default settings...");
  const defaults = {
    store_name: "Aurum Jewels",
    store_phone: "+91 63566 47453",
    store_email: "info@aurumjewels.com",
    store_address: "123 Heritage Lane, Zaveri Bazaar, Mumbai, Maharashtra 400002",
    store_tagline: "Heritage & Luxury Since 1985",
    whatsapp_number: "916356647453",
    free_shipping_minimum: "25000",
    gst_percentage: "3",
  };
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  Object.entries(defaults).forEach(([k, v]) => insertSetting.run(k, v));
}

const reviewsCount = db.prepare("SELECT COUNT(*) as c FROM reviews").get().c;
if (reviewsCount === 0) {
  console.log("🌱 Seeding reviews...");
  const insertReview = db.prepare("INSERT INTO reviews (userName, rating, text, status) VALUES (?, ?, ?, 'approved')");
  insertReview.run("Prince Patel", 5, "I recently purchased this stunning gold necklace, and I couldn't be happier! The craftsmanship is exceptional, and it has such a timeless design that works well with both casual and formal outfits. The chain feels sturdy yet delicate, and the pendant is the perfect size—not too flashy, but just enough to catch the eye. I've received so many compliments every time I wear it.");
  insertReview.run("Meet Shah", 5, "The way they treat the customers are really great... they have lots of choices too for gold chain and ring. I came through reference and now i am pretty confident that I can also give references to people as well.");
  insertReview.run("Maurvi Devda", 5, "We had a really amazing experience and salesperson Amitbhai attended us very well and showed us some really amazing collections suitable for every wedding occasion, making it easy to find exactly what we were looking for.");
}

const videosCount = db.prepare("SELECT COUNT(*) as c FROM feedback_videos").get().c;
if (videosCount === 0) {
  console.log("🌱 Seeding feedback videos...");
  const insertVideo = db.prepare("INSERT INTO feedback_videos (videoUrl, thumbnailUrl, caption, displayOrder) VALUES (?, ?, ?, ?)");
  // Using a sample public mp4 for the seed data so the player works
  const sampleVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
  insertVideo.run(sampleVideo, "/placeholder.svg", "CRAFTED FOR MOMENTS THAT LAST FOREVER.", 1);
  insertVideo.run(sampleVideo, "/placeholder.svg", "CELEBRATED DAYS, CLASSIC WAYS.", 2);
  insertVideo.run(sampleVideo, "/placeholder.svg", "CAPTURE THE GLOW.", 3);
}

const reelsCount = db.prepare("SELECT COUNT(*) as c FROM creator_reels").get().c;
if (reelsCount === 0) {
  console.log("🌱 Seeding creator reels...");
  const insertReel = db.prepare("INSERT INTO creator_reels (videoUrl, thumbnailUrl, caption, displayOrder) VALUES (?, ?, ?, ?)");
  const sampleVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
  insertReel.run(sampleVideo, "https://images.unsplash.com/photo-1595950653106-6c0ebd41b994?auto=format&fit=crop&q=80", "Stunning Bride in Kundan", 1);
  insertReel.run(sampleVideo, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80", "Heritage Gold Collection", 2);
  insertReel.run(sampleVideo, "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80", "Modern Minimalist Rings", 3);
  insertReel.run(sampleVideo, "https://images.unsplash.com/photo-1599643478524-fb5244dc1c97?auto=format&fit=crop&q=80", "Festive Bangles", 4);
  insertReel.run(sampleVideo, "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80", "Bridal Glow", 5);
}

module.exports = db;
