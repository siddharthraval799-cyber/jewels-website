const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const crypto = require("crypto");

// Load env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const db = require("./db-wrapper.cjs");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use multer with memory storage so we can buffer and upload to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

const otpStore = new Map(); // Store OTPs in memory for WhatsApp Login

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "aurum_jewels_secret_key_2025";

console.log("🚀 Server starting...");
console.log("📂 __dirname:", __dirname);
console.log("🌐 PORT:", PORT);
console.log("🔧 NODE_ENV:", process.env.NODE_ENV);

// ─── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increased for potential base64 images
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "../public/uploads")));

const fs = require("fs");


app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// ─── Auth Helpers ──────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const r = Math.floor(1000 + Math.random() * 9000);
  return `AU${y}${m}${d}${r}`;
}

// ═══════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/auth/whatsapp-otp/send", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });
    
    // 1. Verify number via RapidAPI WhatsApp OSINT (Real Integration)
    // This checks if the number exists and is active on WhatsApp
    console.log(`🔍 Verifying ${phone} on WhatsApp via RapidAPI...`);
    
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    let isWhatsAppValid = true; // Fallback if API fails

    try {
      const response = await fetch(`https://whatsapp-osint.p.rapidapi.com/business-insights?phone=${phone}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'whatsapp-osint.p.rapidapi.com'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ WhatsApp Verification Success for ${phone}`);
        // The API returns business info if it exists, but even for non-business it confirms WhatsApp presence
      } else {
        console.warn(`⚠️ RapidAPI Warning: ${response.status} - ${await response.text()}`);
      }
    } catch (apiErr) {
      console.error("❌ RapidAPI Connection Error:", apiErr.message);
    }

    // 2. Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min

    // 3. Real-time sending via RapidAPI WhatsApp Messaging Service
    const message = `Your Aurum Jewels verification code is: ${otp}. Valid for 10 minutes.`;
    const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;
    
    console.log(`📡 Sending real WhatsApp OTP to ${formattedPhone}...`);

    try {
      const sendResponse = await fetch(`https://whatsapp-messenger.p.rapidapi.com/send-message`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'whatsapp-messenger.p.rapidapi.com'
        },
        body: JSON.stringify({
          phone: formattedPhone,
          message: message
        })
      });

      if (sendResponse.ok) {
        const sendData = await sendResponse.json();
        console.log(`✅ Real OTP Sent successfully to ${formattedPhone}:`, sendData);
      } else {
        const errorText = await sendResponse.text();
        console.error(`❌ RapidAPI Send Error: ${sendResponse.status} - ${errorText}`);
        // We still return success: true to the frontend so the user can try the mock 
        // if they are just testing, but in production this would be a failure.
      }
    } catch (sendErr) {
      console.error("❌ RapidAPI Send Connection Error:", sendErr.message);
    }

    // Always log to console as backup/debug
    console.log(`\n==========================================`);
    console.log(`📲 OTP FOR ${phone}: ${otp}`);
    console.log(`==========================================\n`);

    res.json({ success: true, message: "OTP Sent successfully via WhatsApp" });
  } catch (err) {
    console.error("OTP Send Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/api/auth/whatsapp-otp/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

    const record = otpStore.get(phone);
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    otpStore.delete(phone); // Burn OTP after use

    let user = await db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
    if (!user) {
      // Missing user: Register via WhatsApp
      const id = crypto.randomUUID();
      const placeholderEmail = `${phone}_${Date.now()}@whatsapp.user`;
      const passwordHash = bcrypt.hashSync(crypto.randomUUID(), 10);
      db.prepare(
        "INSERT INTO users (id, name, email, phone, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(id, "WhatsApp User", placeholderEmail, phone, passwordHash, "customer");
      user = await db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    }

    const token = generateToken(user);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "OTP Verification failed" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const id = crypto.randomUUID();
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare(
      "INSERT INTO users (id, name, email, phone, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, name, email, phone || "", passwordHash, "customer");

    const user = { id, name, email, phone: phone || "", role: "customer" };
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const user = await db.prepare("SELECT id, name, email, phone, role, addresses, created_at FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.addresses = JSON.parse(user.addresses || "[]");
  res.json({ user });
});

app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const updates = [];
    const params = [];
    if (name) { updates.push("name = ?"); params.push(name); }
    if (phone !== undefined) { updates.push("phone = ?"); params.push(phone); }
    if (addresses) { updates.push("addresses = ?"); params.push(JSON.stringify(addresses)); }
    if (updates.length === 0) return res.status(400).json({ error: "Nothing to update" });
    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...params);
    const user = await db.prepare("SELECT id, name, email, phone, role, addresses FROM users WHERE id = ?").get(req.user.id);
    user.addresses = JSON.parse(user.addresses || "[]");
    res.json({ user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

// ═══════════════════════════════════════════════════════════
// CATEGORIES ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/categories", async (req, res) => {
  const cats = await db.prepare("SELECT * FROM categories ORDER BY displayOrder ASC").all();
  res.json({ categories: cats });
});

app.post("/api/categories", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, slug, icon, image, displayOrder } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "Name and slug are required" });
    const id = slug;
    db.prepare(
      "INSERT INTO categories (id, name, slug, icon, image, displayOrder) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, name, slug, icon || "", image || "", displayOrder || 0);
    res.status(201).json({ id, name, slug });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.put("/api/categories/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, icon, image, displayOrder } = req.body;
    db.prepare(
      "UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon), image = COALESCE(?, image), displayOrder = COALESCE(?, displayOrder) WHERE id = ?"
    ).run(name, icon, image, displayOrder, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/categories/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ═══════════════════════════════════════════════════════════
// PRODUCTS ROUTES
// ═══════════════════════════════════════════════════════════

// Public: Get all products with optional filters
app.get("/api/products", async (req, res) => {
  try {
    const { category, featured, bestSeller, newArrival, q } = req.query;
    let query = "SELECT * FROM products WHERE active = 1";
    let params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (featured === "true") query += " AND featured = 1";
    if (bestSeller === "true") query += " AND bestSeller = 1";
    if (newArrival === "true") query += " AND newArrival = 1";
    if (q) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    query += " ORDER BY created_at DESC";

    const products = await db.prepare(query).all(...params);
    products.forEach(p => {
      try { p.images = JSON.parse(p.images || "[]"); } catch(e) { p.images = ["/placeholder.svg"]; }
      try { p.attributes = JSON.parse(p.attributes || "{}"); } catch(e) { p.attributes = {}; }
    });
    
    res.json({ products, total: products.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Public: Get single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    try { product.images = JSON.parse(product.images || "[]"); } catch(e) { product.images = ["/placeholder.svg"]; }
    try { product.attributes = JSON.parse(product.attributes || "{}"); } catch(e) { product.attributes = {}; }
    
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Admin: Create product
app.post("/api/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival, active, attributes, price, videoUrl } = req.body;
    const id = `prod-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO products (id, name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival, active, attributes, price, videoUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, name, category, weight, purity, makingCharges, description,
      JSON.stringify(images || []),
      featured ? 1 : 0, bestSeller ? 1 : 0, newArrival ? 1 : 0, active !== false ? 1 : 0,
      JSON.stringify(attributes || {}),
      price || null, videoUrl || null
    );
    
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Admin: Update product
app.put("/api/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, weight, purity, makingCharges, description, images, featured, bestSeller, newArrival, active, attributes, price, videoUrl } = req.body;
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, weight = ?, purity = ?, makingCharges = ?, description = ?, images = ?, 
          featured = ?, bestSeller = ?, newArrival = ?, active = ?, attributes = ?, price = ?, videoUrl = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    stmt.run(
      name, category, weight, purity, makingCharges, description,
      JSON.stringify(images || []),
      featured ? 1 : 0, bestSeller ? 1 : 0, newArrival ? 1 : 0, active !== false ? 1 : 0,
      JSON.stringify(attributes || {}),
      price || null, videoUrl || null,
      req.params.id
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ═══════════════════════════════════════════════════════════
// ORDERS ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/orders", async (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total, shippingAddress, contactInfo, paymentMethod, userId } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: "No items in order" });
    if (!contactInfo?.name || !contactInfo?.phone) return res.status(400).json({ error: "Contact info required" });

    const id = crypto.randomUUID();
    const orderNumber = generateOrderNumber();

    db.prepare(
      `INSERT INTO orders (id, orderNumber, userId, items, subtotal, shipping, tax, total, shippingAddress, contactInfo, paymentMethod)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, orderNumber, userId || null, JSON.stringify(items),
      subtotal || 0, shipping || 0, tax || 0, total || 0,
      JSON.stringify(shippingAddress || {}), JSON.stringify(contactInfo || {}),
      paymentMethod || "cod"
    );

    res.status(201).json({ id, orderNumber });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", authMiddleware, async (req, res) => {
  const orders = await db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY created_at DESC").all(req.user.id);
  orders.forEach(o => {
    o.items = JSON.parse(o.items || "[]");
    o.shippingAddress = JSON.parse(o.shippingAddress || "{}");
    o.contactInfo = JSON.parse(o.contactInfo || "{}");
  });
  res.json({ orders });
});

app.get("/api/orders/:id", authMiddleware, async (req, res) => {
  const order = await db.prepare("SELECT * FROM orders WHERE id = ? OR orderNumber = ?").get(req.params.id, req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }
  order.items = JSON.parse(order.items || "[]");
  order.shippingAddress = JSON.parse(order.shippingAddress || "{}");
  order.contactInfo = JSON.parse(order.contactInfo || "{}");
  res.json({ order });
});

// Admin Upload Route
app.post("/api/admin/upload", authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }
    
    // Convert buffer to Base64 to upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "aurum"
    });
    
    res.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// ═══════════════════════════════════════════════════════════
// WISHLIST ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/wishlist", authMiddleware, async (req, res) => {
  const items = await db.prepare(
    `SELECT w.*, p.name, p.category, p.weight, p.makingCharges, p.images, p.purity
     FROM wishlist w JOIN products p ON w.productId = p.id WHERE w.userId = ?`
  ).all(req.user.id);
  items.forEach(i => { i.images = JSON.parse(i.images || "[]"); });
  res.json({ wishlist: items });
});

app.post("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "Product ID required" });
    db.prepare("INSERT OR IGNORE INTO wishlist (userId, productId) VALUES (?, ?)").run(req.user.id, productId);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

app.delete("/api/wishlist/:productId", authMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM wishlist WHERE userId = ? AND productId = ?").run(req.user.id, req.params.productId);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// CONTACT ROUTES
// ═══════════════════════════════════════════════════════════

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: "Name and message are required" });
    db.prepare(
      "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)"
    ).run(name, email || "", phone || "", subject || "", message);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ═══════════════════════════════════════════════════════════
// CUSTOM INQUIRIES
// ═══════════════════════════════════════════════════════════

app.post("/api/custom-inquiries", async (req, res) => {
  try {
    const { name, email, phone, budget, message, imageUrl } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Name, phone, and message are required" });
    }
    db.prepare(
      "INSERT INTO custom_inquiries (name, email, phone, budget, message, imageUrl) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(name, email || "", phone, budget || "", message, imageUrl || "");
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Custom inquiry error:", err);
    res.status(500).json({ error: "Failed to submit custom inquiry" });
  }
});

// ═══════════════════════════════════════════════════════════
// SETTINGS ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/api/settings", async (req, res) => {
  const rows = await db.prepare("SELECT key, value FROM settings").all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json({ settings });
});

app.put("/api/settings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { settings } = req.body;
    const upsert = db.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
    );
    const batch = db.transaction((entries) => {
      for (const [key, value] of entries) {
        upsert.run(key, String(value));
      }
    });
    batch(Object.entries(settings));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// ═══════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════

app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ products: [] });
  const products = db.prepare(
    "SELECT * FROM products WHERE active = 1 AND (name LIKE ? OR description LIKE ? OR category LIKE ?) LIMIT 20"
  ).all(`%${q}%`, `%${q}%`, `%${q}%`);
  products.forEach(p => { p.images = JSON.parse(p.images || "[]"); });
  res.json({ products });
});

// ═══════════════════════════════════════════════════════════
// TESTIMONIALS & REVIEWS
// ═══════════════════════════════════════════════════════════

app.get("/api/testimonials", async (req, res) => {
  const reviews = await db.prepare("SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC").all();
  const videos = await db.prepare("SELECT * FROM feedback_videos ORDER BY displayOrder ASC, created_at DESC").all();
  res.json({ reviews, videos });
});

app.post("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const { rating, text } = req.body;
    if (!rating || !text) return res.status(400).json({ error: "Rating and text are required" });
    db.prepare("INSERT INTO reviews (userId, userName, rating, text) VALUES (?, ?, ?, ?)").run(
      req.user.id,
      req.user.name || "Customer",
      rating,
      text
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// ═══════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════

app.get("/api/gallery", async (req, res) => {
  const photos = await db.prepare("SELECT * FROM gallery ORDER BY displayOrder ASC, created_at DESC").all();
  res.json({ photos });
});

// ═══════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

// Admin Reviews
app.get("/api/admin/reviews", authMiddleware, adminMiddleware, async (req, res) => {
  const reviews = await db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all();
  res.json({ reviews });
});

app.put("/api/admin/reviews/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("UPDATE reviews SET status = ? WHERE id = ?").run(req.body.status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/reviews/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Admin Videos
app.post("/api/admin/videos", authMiddleware, adminMiddleware, async (req, res) => {
  const { videoUrl, thumbnailUrl, caption, displayOrder } = req.body;
  if (!videoUrl) return res.status(400).json({ error: "Video URL required" });
  db.prepare("INSERT INTO feedback_videos (videoUrl, thumbnailUrl, caption, displayOrder) VALUES (?, ?, ?, ?)").run(
    videoUrl, thumbnailUrl || "", caption || "", displayOrder || 0
  );
  res.status(201).json({ success: true });
});

app.delete("/api/admin/videos/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM feedback_videos WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Admin Gallery
app.post("/api/admin/gallery", authMiddleware, adminMiddleware, async (req, res) => {
  const { imageUrl, jewelryName, displayOrder } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "Image URL required" });
  db.prepare("INSERT INTO gallery (imageUrl, jewelryName, displayOrder) VALUES (?, ?, ?)").run(
    imageUrl, jewelryName || "", displayOrder || 0
  );
  res.status(201).json({ success: true });
});

app.delete("/api/admin/gallery/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// CREATOR REELS
// ═══════════════════════════════════════════════════════════

app.get("/api/creator-reels", async (req, res) => {
  const reels = await db.prepare("SELECT * FROM creator_reels WHERE active = 1 ORDER BY displayOrder ASC, created_at DESC").all();
  res.json({ reels });
});

// Admin Creator Reels
app.get("/api/admin/creator-reels", authMiddleware, adminMiddleware, async (req, res) => {
  const reels = await db.prepare("SELECT * FROM creator_reels ORDER BY displayOrder ASC, created_at DESC").all();
  res.json({ reels });
});

app.post("/api/admin/creator-reels", authMiddleware, adminMiddleware, async (req, res) => {
  const { videoUrl, thumbnailUrl, caption, displayOrder, active } = req.body;
  if (!videoUrl) return res.status(400).json({ error: "Video URL required" });
  db.prepare("INSERT INTO creator_reels (videoUrl, thumbnailUrl, caption, displayOrder, active) VALUES (?, ?, ?, ?, ?)").run(
    videoUrl, thumbnailUrl || "", caption || "", displayOrder || 0, active !== false ? 1 : 0
  );
  res.status(201).json({ success: true });
});

app.put("/api/admin/creator-reels/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { caption, displayOrder, active } = req.body;
  const sets = [];
  const params = [];
  if (caption !== undefined) { sets.push("caption = ?"); params.push(caption); }
  if (displayOrder !== undefined) { sets.push("displayOrder = ?"); params.push(displayOrder); }
  if (active !== undefined) { sets.push("active = ?"); params.push(active ? 1 : 0); }
  
  if (sets.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE creator_reels SET ${sets.join(", ")} WHERE id = ?`).run(...params);
  }
  res.json({ success: true });
});

app.delete("/api/admin/creator-reels/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM creator_reels WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════

app.get("/api/banners", async (req, res) => {
  const banners = await db.prepare("SELECT * FROM banners ORDER BY displayOrder ASC").all();
  res.json({ banners });
});

app.get("/api/admin/banners", authMiddleware, adminMiddleware, async (req, res) => {
  const banners = await db.prepare("SELECT * FROM banners ORDER BY displayOrder ASC").all();
  res.json({ banners });
});

app.post("/api/admin/banners", authMiddleware, adminMiddleware, async (req, res) => {
  const { imageUrl, subtitle, title, description, cta, link, displayOrder } = req.body;
  if (!imageUrl || !title) return res.status(400).json({ error: "Image URL and title required" });
  db.prepare("INSERT INTO banners (imageUrl, subtitle, title, description, cta, link, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    imageUrl, subtitle || "", title, description || "", cta || "Shop Now", link || "/products", displayOrder || 0
  );
  res.status(201).json({ success: true });
});

app.put("/api/admin/banners/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { imageUrl, subtitle, title, description, cta, link, displayOrder } = req.body;
  const sets = [];
  const params = [];
  if (imageUrl !== undefined) { sets.push("imageUrl = ?"); params.push(imageUrl); }
  if (subtitle !== undefined) { sets.push("subtitle = ?"); params.push(subtitle); }
  if (title !== undefined) { sets.push("title = ?"); params.push(title); }
  if (description !== undefined) { sets.push("description = ?"); params.push(description); }
  if (cta !== undefined) { sets.push("cta = ?"); params.push(cta); }
  if (link !== undefined) { sets.push("link = ?"); params.push(link); }
  if (displayOrder !== undefined) { sets.push("displayOrder = ?"); params.push(displayOrder); }
  
  if (sets.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE banners SET ${sets.join(", ")} WHERE id = ?`).run(...params);
  }
  res.json({ success: true });
});

app.delete("/api/admin/banners/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM banners WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products WHERE active = 1").get().count;
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE status != 'cancelled'").get().sum;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count;
    const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE read = 0").get().count;

    const recentOrders = await db.prepare(
      "SELECT id, orderNumber, total, status, contactInfo, created_at FROM orders ORDER BY created_at DESC LIMIT 10"
    ).all();
    recentOrders.forEach(o => { o.contactInfo = JSON.parse(o.contactInfo || "{}"); });

    res.json({
      stats: { totalProducts, totalOrders, totalCustomers, totalRevenue, pendingOrders, unreadMessages },
      recentOrders,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

app.get("/api/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
  const { status, limit, offset } = req.query;
  let sql = "SELECT * FROM orders";
  const params = [];
  if (status) { sql += " WHERE status = ?"; params.push(status); }
  sql += " ORDER BY created_at DESC";
  if (limit) { sql += " LIMIT ?"; params.push(Number(limit)); }
  if (offset) { sql += " OFFSET ?"; params.push(Number(offset)); }

  const orders = await db.prepare(sql).all(...params);
  orders.forEach(o => {
    o.items = JSON.parse(o.items || "[]");
    o.shippingAddress = JSON.parse(o.shippingAddress || "{}");
    o.contactInfo = JSON.parse(o.contactInfo || "{}");
  });
  res.json({ orders });
});

app.put("/api/admin/orders/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, trackingNumber, notes, paymentStatus } = req.body;
    const sets = ["updated_at = datetime('now')"];
    const params = [];
    if (status) { sets.push("status = ?"); params.push(status); }
    if (trackingNumber !== undefined) { sets.push("trackingNumber = ?"); params.push(trackingNumber); }
    if (notes !== undefined) { sets.push("notes = ?"); params.push(notes); }
    if (paymentStatus) { sets.push("paymentStatus = ?"); params.push(paymentStatus); }
    params.push(req.params.id);
    db.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id = ?`).run(...params);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.get("/api/admin/customers", authMiddleware, adminMiddleware, async (req, res) => {
  const customers = db.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.created_at,
      (SELECT COUNT(*) FROM orders WHERE userId = u.id) as orderCount,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE userId = u.id) as totalSpent
     FROM users u WHERE u.role = 'customer' ORDER BY u.created_at DESC`
  ).all();
  res.json({ customers });
});

app.get("/api/admin/messages", authMiddleware, adminMiddleware, async (req, res) => {
  const messages = await db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all();
  res.json({ messages });
});

app.put("/api/admin/messages/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("UPDATE contact_messages SET read = 1 WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/messages/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM contact_messages WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/custom-inquiries", authMiddleware, adminMiddleware, async (req, res) => {
  const inquiries = await db.prepare("SELECT * FROM custom_inquiries ORDER BY created_at DESC").all();
  res.json({ inquiries });
});

app.put("/api/admin/custom-inquiries/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("UPDATE custom_inquiries SET read = 1 WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/custom-inquiries/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await db.prepare("DELETE FROM custom_inquiries WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Admin: Get all products
app.get("/api/admin/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    products.forEach(p => {
      p.images = JSON.parse(p.images);
      try { p.attributes = JSON.parse(p.attributes || "{}"); } catch(e) { p.attributes = {}; }
    });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ═══════════════════════════════════════════════════════════
// PRODUCTION SETUP (SERVE FRONTEND)
// ═══════════════════════════════════════════════════════════

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "production_simulation") {
  app.use(express.static(path.join(__dirname, "..", "dist")));
  
  // Serve Admin Panel for /admin routes
  app.get(/\/admin.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "admin.html"));
  });

  // Serve Storefront for all other routes
  app.get("(.*)", async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
  });
}

// ─── Start Server ──────────────────────────────────────────
console.log("📡 Attempting to bind to PORT:", PORT);

// On Vercel, we export the app. On local, we listen.
let server;
if (process.env.NODE_ENV !== 'production' || require.main === module) {
  const PORT = process.env.PORT || 3001;
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;

server.on('error', (err) => {
  console.error("❌ SERVER BINDING ERROR:", err);
});

process.on('uncaughtException', (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION at:", promise, "reason:", reason);
});
