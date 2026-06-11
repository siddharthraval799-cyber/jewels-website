const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  console.log("🛠️ Initializing Postgres database...");
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // CREATE TABLES
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT DEFAULT '',
        image TEXT DEFAULT '',
        "displayOrder" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT REFERENCES categories(id) ON DELETE CASCADE,
        weight NUMERIC NOT NULL,
        purity TEXT DEFAULT '22K',
        "makingCharges" INTEGER DEFAULT 0,
        description TEXT DEFAULT '',
        images TEXT DEFAULT '[]',
        featured INTEGER DEFAULT 0,
        "bestSeller" INTEGER DEFAULT 0,
        "newArrival" INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        attributes TEXT DEFAULT '{}',
        price NUMERIC DEFAULT NULL,
        "videoUrl" TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT DEFAULT '',
        "passwordHash" TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        addresses TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        "orderNumber" TEXT UNIQUE NOT NULL,
        "userId" TEXT REFERENCES users(id) ON DELETE SET NULL,
        items TEXT NOT NULL DEFAULT '[]',
        subtotal NUMERIC DEFAULT 0,
        shipping NUMERIC DEFAULT 0,
        tax NUMERIC DEFAULT 0,
        total NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'pending',
        "shippingAddress" TEXT DEFAULT '{}',
        "contactInfo" TEXT DEFAULT '{}',
        "paymentMethod" TEXT DEFAULT 'cod',
        "paymentStatus" TEXT DEFAULT 'pending',
        "trackingNumber" TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "productId" TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "productId")
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        subject TEXT DEFAULT '',
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        "userId" TEXT REFERENCES users(id) ON DELETE SET NULL,
        "userName" TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        text TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS feedback_videos (
        id SERIAL PRIMARY KEY,
        "videoUrl" TEXT NOT NULL,
        "thumbnailUrl" TEXT DEFAULT '',
        caption TEXT DEFAULT '',
        "displayOrder" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        "imageUrl" TEXT NOT NULL,
        "jewelryName" TEXT DEFAULT '',
        "displayOrder" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS creator_reels (
        id SERIAL PRIMARY KEY,
        "videoUrl" TEXT NOT NULL,
        "thumbnailUrl" TEXT DEFAULT '',
        caption TEXT DEFAULT '',
        "displayOrder" INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS custom_inquiries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT DEFAULT '',
        phone TEXT NOT NULL,
        budget TEXT DEFAULT '',
        message TEXT NOT NULL,
        "imageUrl" TEXT DEFAULT '',
        read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        "imageUrl" TEXT NOT NULL,
        subtitle TEXT DEFAULT '',
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        cta TEXT DEFAULT 'Shop Now',
        link TEXT DEFAULT '/products',
        "displayOrder" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // SEED ADMIN USER
    const userRes = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userRes.rows[0].count) === 0) {
      console.log("🌱 Seeding admin user...");
      const hash = bcrypt.hashSync("admin123", 10);
      await client.query(
        'INSERT INTO users (id, name, email, phone, "passwordHash", role) VALUES ($1, $2, $3, $4, $5, $6)',
        ["admin-001", "Admin", "admin@aurumjewels.com", "+91 63566 47453", hash, "admin"]
      );
    }

    // SEED BANNERS
    const bannerRes = await client.query('SELECT COUNT(*) FROM banners');
    if (parseInt(bannerRes.rows[0].count) === 0) {
      console.log("🌱 Seeding banners...");
      const banners = [
        ["/assets/hero-1.jpg", "The Heritage Collection", "Timeless Elegance", "Discover masterfully crafted pieces that celebrate centuries of artistry", "Explore Collection", "/products?category=necklaces", 1],
        ["/assets/hero-2.jpg", "Bridal Luxuries", "Your Special Day", "Exquisite bridal sets handcrafted with love and tradition", "Shop Bridal", "/products?category=necklaces", 2],
        ["/assets/hero-3.jpg", "New Arrivals", "Modern Classics", "Contemporary designs that blend heritage with modern sophistication", "View New Arrivals", "/products?category=rings", 3],
        ["/assets/hero-4.jpg", "Handcrafted Bangles", "Tradition Refined", "Each bangle tells a story of artisanal excellence", "Shop Bangles", "/products?category=bangles", 4],
        ["/assets/hero-5.jpg", "Exclusive Offers", "Festive Season Sale", "Flat 20% off on making charges — limited time only", "Shop Now", "/products", 5]
      ];
      for (const b of banners) {
        await client.query(
          'INSERT INTO banners ("imageUrl", subtitle, title, description, cta, link, "displayOrder") VALUES ($1, $2, $3, $4, $5, $6, $7)',
          b
        );
      }
    }

    // SEED SETTINGS
    const setRes = await client.query('SELECT COUNT(*) FROM settings');
    if (parseInt(setRes.rows[0].count) === 0) {
      console.log("🌱 Seeding settings...");
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
      for (const [k, v] of Object.entries(defaults)) {
        await client.query('INSERT INTO settings (key, value) VALUES ($1, $2)', [k, v]);
      }
    }

    await client.query('COMMIT');
    console.log("✅ Database initialized successfully!");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ Database initialization failed:", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

initDB();
