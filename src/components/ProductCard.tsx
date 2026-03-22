import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Video, BrainCircuit } from "lucide-react";
import { Product, calculatePrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import { motion } from "framer-motion";

const ProductCard = ({ product, index = 0, onExplore }: { product: Product; index?: number; onExplore?: (product: Product) => void }) => {
  const { addToCart } = useCart();
  const { rates } = useGoldRates();
  const price = calculatePrice(product.weight, product.makingCharges, rates.gold22k);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-border/40 h-full flex flex-col">
        {/* Image Region */}
        <Link to={`/product/${product.id}`} className="relative aspect-[4/5] bg-[#FAF6F2] overflow-hidden block">
          <img 
            src={product.images?.[0] || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
          />

          {/* Floating Action Icons */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2 z-10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            {onExplore && (
              <button 
                onClick={(e) => { e.preventDefault(); onExplore(product); }}
                className="w-8 h-8 rounded-md bg-[#1f2937] text-white flex items-center justify-center hover:bg-black transition-colors shadow-lg"
                title="Explore similar designs"
              >
                <BrainCircuit className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={(e) => { e.preventDefault(); }}
              className="w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center hover:bg-rose-50 shadow-md backdrop-blur-sm transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4 fill-rose-100/50 text-rose-400" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-emerald-50 shadow-md backdrop-blur-sm transition-colors"
              title="Watch Video"
            >
              <Video className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
          
          {/* Add to cart hover overlay */}
          <div className="absolute inset-x-0 top-0 flex gap-1 p-3 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="flex-1 bg-white/90 backdrop-blur-md text-secondary-foreground py-2 text-[10px] tracking-wider uppercase font-body font-bold flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors rounded-full shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </button>
          </div>
        </Link>

        {/* Info Region */}
        <div className="p-4 md:p-5 flex flex-col flex-1 bg-white">
          <Link to={`/product/${product.id}`}>
            <span className="font-body font-bold text-secondary-foreground text-sm md:text-[15px] block mb-1">
              ₹{price.total.toLocaleString("en-IN")}
            </span>
            <h3 className="font-body text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors line-clamp-1 mb-3">
              {product.name}
            </h3>
          </Link>
          
          {/* Attributes */}
          <div className="mt-auto flex items-center justify-start gap-4 border-t border-border/30 pt-3">
            <div className="flex items-center gap-1.5 text-muted-foreground/80">
              <span className="text-xs">📐</span>
              <span className="text-[11px] font-body text-muted-foreground font-medium">{product.weight} gm</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-muted-foreground/80">
              <span className="text-xs text-primary/80">✨</span>
              <span className="text-[11px] font-body text-muted-foreground font-medium">22KT</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
