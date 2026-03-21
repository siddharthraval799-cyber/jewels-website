import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock the Mangalsutra data matching the 4th image (warm brown/beige colors)
const inDemandProducts = [
  { id: 1, name: "Ishira Vaidurya Mangalsutra 22KT", price: "₹5,05,184", weight: "30.12 gm", karat: "22KT", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 2, name: "Pradyumna Padmashree Mangalsutra", price: "₹7,37,677", weight: "43.21 gm", karat: "22KT", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 3, name: "Aarvika Shringar Mangalsutra 22KT", price: "₹3,21,269", weight: "19.04 gm", karat: "22KT", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 4, name: "Parampara Vedika Mangalsutra", price: "₹4,49,633", weight: "25.3 gm", karat: "22KT", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 5, name: "Aarvika Sovereign Mangalsutra", price: "₹3,09,423", weight: "18.24 gm", karat: "22KT", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 6, name: "Kanika Vilas Mangalsutra 22KT", price: "₹4,85,085", weight: "28.55 gm", karat: "22KT", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
];

const ProductCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 350); 
    }
  };

  return (
    <section className="py-20 bg-background relative border-t border-border/40">
      <div className="container mx-auto px-4">
        
        {/* Top Controls Container matching the image structure */}
        {/* We place the "IN-DEMAND FAVORITES" block inside a banner or on the side depending on layout. 
            The photo shows the items sliding over a subtle background banner.
         */}
        <div className="bg-[#FAF6F2] py-16 px-8 rounded-[40px] relative">
           
           <div className="absolute bottom-0 left-0 w-full h-[150px] bg-[#D6C1A9] rounded-b-[40px] flex items-center px-16 z-0" />
           
           <div className="relative z-10 flex flex-col md:flex-row gap-12 justify-between items-end mb-10 w-full px-4">
              {/* If we look at photo 4, the title is inside the banner itself at the bottom left alongside the products sliding. 
                  Let's inject title text into the banner. */}
           </div>

           <div className="relative z-20">
             
             {/* Slider Navigation */}
             <div className="flex justify-between items-center mb-6">
                <div className="opacity-0 w-1"></div> {/* Spacer */}
                <div className="flex gap-2 justify-end w-full px-4">
                  <button 
                    onClick={() => scroll("left")} 
                    disabled={!canScrollLeft}
                    className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center bg-white/50 backdrop-blur disabled:opacity-30 transition-all hover:bg-white text-secondary-foreground"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => scroll("right")} 
                    disabled={!canScrollRight}
                    className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center bg-white/50 backdrop-blur disabled:opacity-30 transition-all hover:bg-white text-secondary-foreground"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <Link to="/products?category=mangalsutra" className="ml-4 bg-[#B5A18C]/30 hover:bg-[#B5A18C]/50 px-6 py-2 rounded-full font-body text-sm font-medium transition-colors border border-border/50 text-secondary-foreground shadow-sm">
                    Explore All Designs
                  </Link>
                </div>
             </div>

             {/* The Actual Track of Items */}
             <div 
               ref={scrollRef}
               onScroll={checkScroll}
               className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4"
             >
                {inDemandProducts.map((product) => (
                  <div key={product.id} className="snap-start shrink-0 w-[240px] md:w-[280px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border/30">
                    <Link to={`/products/${product.id}`} className="block relative aspect-[4/5] bg-cream/30 p-4">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </Link>
                    <div className="p-4 bg-white z-10 relative">
                       <h4 className="font-display font-semibold text-lg text-secondary-foreground mb-1">{product.price}</h4>
                       <p className="font-body text-xs text-secondary-foreground opacity-80 mb-3 truncate">{product.name}</p>
                       <div className="flex gap-4 text-[10px] text-muted-foreground font-body">
                          <span className="flex items-center gap-1">📐 {product.weight}</span>
                          <span className="flex items-center gap-1">✨ {product.karat}</span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             {/* Banner Title Overlay on bottom left */}
             <div className="absolute -bottom-[3.5rem] left-8 pointer-events-none text-secondary-foreground z-30">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-widest mb-2">In-Demand Favorites</h2>
                <p className="font-body text-sm tracking-wide font-medium">Loved by many, made for you.<br/>Find out what's trending today.</p>
             </div>

           </div>
        </div>

      </div>
    </section>
  );
};

export default ProductCarousel;
