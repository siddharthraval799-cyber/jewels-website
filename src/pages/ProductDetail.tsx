import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, Share2, Minus, Plus, ChevronRight, MessageCircle } from "lucide-react";
import { getProductById, calculatePrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  const { rates } = useGoldRates();
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow !== showStickyBar) {
        setShowStickyBar(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showStickyBar]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="font-display text-2xl text-foreground/50">Product Not Found</h2>
            <Link to="/products" className="text-primary text-sm font-body mt-3 inline-block hover:underline">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const price = calculatePrice(product.weight, product.makingCharges, rates.gold22k);

  const handleWhatsAppBuy = () => {
    const msg = `Hi, I'm interested in buying "${product.name}" (${product.weight}g, ₹${price.total.toLocaleString("en-IN")}). Please share more details.`;
    window.open(`https://wa.me/916356647453?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-primary">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-cream flex items-center justify-center border border-border/50">
              <div className="text-center">
                <span className="text-8xl opacity-20">
                  {product.category === "rings" ? "💍" :
                   product.category === "earrings" ? "✨" :
                   product.category === "necklaces" ? "📿" :
                   product.category === "bangles" ? "⭕" :
                   product.category === "bracelets" ? "🔗" :
                   product.category === "chains" ? "⛓️" : "💎"}
                </span>
                <p className="text-muted-foreground/40 text-xs font-body mt-4 tracking-wider uppercase">
                  Product Image
                </p>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-body font-medium mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">{product.name}</h1>
            <p className="text-foreground/70 font-body text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Price Breakdown */}
            <div className="border border-border p-5 mb-6 space-y-3">
              <h3 className="font-body text-xs tracking-wider uppercase font-semibold text-foreground/80 mb-3">
                Price Breakdown
              </h3>
              <div className="flex justify-between text-sm font-body">
                <span className="text-foreground/70">Gold ({product.weight}g × ₹{rates.gold22k.toLocaleString("en-IN")})</span>
                <span className="text-foreground">₹{price.metalCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-foreground/70">Making Charges</span>
                <span className="text-foreground">₹{price.makingCharges.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-foreground/70">GST (3%)</span>
                <span className="text-foreground">₹{price.gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-body font-semibold text-foreground">Total</span>
                <span className="font-display text-xl text-primary">₹{price.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Weight */}
            <div className="flex items-center gap-6 mb-6 text-sm font-body">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Weight</span>
                <p className="text-foreground font-semibold">{product.weight}g</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Purity</span>
                <p className="text-foreground font-semibold">22K Gold</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Hallmark</span>
                <p className="text-foreground font-semibold">BIS 916</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-body uppercase tracking-wider text-foreground/70">Qty</span>
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-muted transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-body">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div ref={mainCtaRef} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                  className="flex-1 bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button className="p-3.5 border border-border hover:border-primary hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3.5 border border-border hover:border-primary hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleWhatsAppBuy}
                className="w-full bg-[#25D366] text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold flex items-center justify-center gap-2 hover:bg-[#1da851] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Buy via WhatsApp
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "BIS Hallmarked", icon: "🏅" },
                { label: "100% Certified", icon: "📜" },
                { label: "Secure Payment", icon: "🔒" },
                { label: "Buyback Policy", icon: "🔄" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider font-body font-semibold text-muted-foreground leading-tight">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] py-3 px-4 md:py-4"
          >
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <div className="w-12 h-12 bg-cream flex items-center justify-center border border-border/50 rounded-sm">
                  <span className="text-xl">
                    {product.category === "rings" ? "💍" : "💎"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground truncate max-w-[200px]">{product.name}</h4>
                  <p className="text-xs text-primary font-bold">₹{price.total.toLocaleString("en-IN")}</p>
                </div>
              </div>
              
              <div className="flex-1 sm:flex-initial flex items-center gap-3">
                <div className="text-center sm:hidden">
                   <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Price</p>
                   <p className="text-sm text-primary font-bold">₹{price.total.toLocaleString("en-IN")}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 sm:w-48 bg-primary text-primary-foreground h-11 text-[10px] tracking-[0.2em] uppercase font-body font-semibold flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors rounded-sm"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductDetail;
