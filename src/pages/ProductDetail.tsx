import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, Share2, Minus, Plus, ChevronRight, MessageCircle, Loader2, X } from "lucide-react";
import { calculatePrice, getProductById } from "@/data/products";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { rates } = useGoldRates();
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
       setLoading(true);
       api.products.get(id)
         .then(res => setProduct(res.product))
         .catch(err => {
            console.error("API failed, falling back to static data:", err);
            const staticProduct = getProductById(id);
            if (staticProduct) setProduct(staticProduct as Product);
            else setProduct(null);
         })
         .finally(() => setLoading(false));
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

  const price = product.price 
    ? { metalCost: 0, makingCharges: 0, gst: 0, total: product.price }
    : calculatePrice(product.weight, product.makingCharges, rates.gold22k);

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
          {/* Media Section: 2x2 Grid (3 Photos + 1 Video) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            {/* Slot 1: Video (Primary) */}
            <div 
              className="aspect-square bg-cream border border-border/50 overflow-hidden relative group rounded-xl shadow-sm cursor-zoom-in"
              onClick={() => {
                if (product.videoUrl) setSelectedMedia({ url: product.videoUrl, type: 'video' });
                else if (product.images?.[0]) setSelectedMedia({ url: product.images[0], type: 'image' });
              }}
            >
               {product.videoUrl ? (
                 <video 
                   src={product.videoUrl} 
                   className="w-full h-full object-cover" 
                   autoPlay muted loop playsInline
                 />
               ) : product.images?.[0] ? (
                 <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">💎</div>
               )}
               {product.videoUrl && (
                 <div className="absolute top-3 left-3">
                   <span className="bg-black/40 backdrop-blur-md text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">Live View</span>
                 </div>
               )}
            </div>

            {/* Slots 2-4: Photos */}
            {[0, 1, 2].map((idx) => {
              // If video is in slot 1, these take images 0, 1, 2.
              // If NO video, slot 1 takes image 0, so these take images 1, 2, 3.
              const imgIdx = product.videoUrl ? idx : idx + 1;
              const img = product.images?.[imgIdx];

              return (
                <div 
                  key={idx} 
                  className="aspect-square bg-white border border-border/50 overflow-hidden relative rounded-xl shadow-sm hover:border-primary/30 transition-colors cursor-zoom-in"
                  onClick={() => img && setSelectedMedia({ url: img, type: 'image' })}
                >
                   {img ? (
                     <img src={img} alt={`${product.name} view ${idx + 2}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10 grayscale bg-muted/20 text-3xl font-light">
                        {idx === 0 ? "✨" : idx === 1 ? "📿" : "💍"}
                     </div>
                   )}
                </div>
              );
            })}
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

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full border border-white/10 z-[1101]"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.url} 
                  className="max-h-[90vh] max-w-full rounded-lg shadow-2xl" 
                  controls autoPlay
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt="Full preview" 
                  className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl" 
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductDetail;
