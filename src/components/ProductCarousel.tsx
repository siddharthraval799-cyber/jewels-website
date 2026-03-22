import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

// Convert mock data to fit standard Product type so we can use the main ProductCard
const inDemandProducts: Product[] = [
  { id: "p1", name: "Ishira Vaidurya Mangalsutra 22KT", weight: 30.12, makingCharges: 15000, category: "mangalsutra", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"], description: "" },
  { id: "p2", name: "Pradyumna Padmashree Mangalsutra", weight: 43.21, makingCharges: 20000, category: "mangalsutra", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"], description: "" },
  { id: "p3", name: "Aarvika Shringar Mangalsutra 22KT", weight: 19.04, makingCharges: 12000, category: "mangalsutra", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"], description: "" },
  { id: "p4", name: "Parampara Vedika Mangalsutra", weight: 25.30, makingCharges: 18000, category: "mangalsutra", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"], description: "" },
  { id: "p5", name: "Aarvika Sovereign Mangalsutra", weight: 18.24, makingCharges: 11000, category: "mangalsutra", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"], description: "" },
  { id: "p6", name: "Kanika Vilas Mangalsutra 22KT", weight: 28.55, makingCharges: 14000, category: "mangalsutra", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80"], description: "" },
];

const ProductCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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

  const exploreAll = () => {
    navigate("/products");
  };

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Banner container designed mapping Image 1 */}
        <div className="relative w-full rounded-[40px] bg-[#DBCAC0]/40 overflow-visible pt-16 pb-20 md:pb-8">
           
           <div className="flex flex-col xl:flex-row gap-8 xl:gap-0">
             
             {/* Left Banner Text Section */}
             <div className="xl:w-1/3 px-8 md:px-12 flex flex-col justify-end pb-4 xl:pb-12 z-20">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-4xl md:text-5xl font-black tracking-widest uppercase text-[#1a1a1a] mb-4"
                >
                  In-Demand<br/>Favorites
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="font-body text-base font-semibold text-[#1a1a1a]/80"
                >
                  Loved by many, made for you.<br/>
                  Find out what's trending today.
                </motion.p>

                {/* Desktop Explore Button - aligned visually within the banner area */}
                <motion.button 
                   whileHover={{ scale: 1.05 }} 
                   whileTap={{ scale: 0.95 }}
                   onClick={exploreAll}
                   className="hidden xl:inline-flex mt-12 bg-[#B5A18C] hover:bg-[#A38F7A] text-white px-8 py-3.5 rounded-full font-body text-sm font-semibold tracking-wider uppercase transition-colors shadow-md w-max"
                >
                   Explore All Designs
                </motion.button>
             </div>

             {/* Right Section: Overlapping Carousel */}
             <div className="xl:w-2/3 xl:-mt-24 xl:pr-12 z-20">
                
                {/* Carousel Controls */}
                <div className="flex justify-end gap-3 mb-6 px-8 xl:px-0">
                  <button 
                    onClick={() => scroll("left")} 
                    disabled={!canScrollLeft}
                    className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center bg-white/80 backdrop-blur disabled:opacity-40 transition-all hover:bg-white text-secondary-foreground shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => scroll("right")} 
                    disabled={!canScrollRight}
                    className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center bg-white/80 backdrop-blur disabled:opacity-40 transition-all hover:bg-white text-secondary-foreground shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Carousel Track containing perfectly matched Product Cards */}
                <div 
                  ref={scrollRef}
                  onScroll={checkScroll}
                  className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-8 xl:px-0"
                >
                   {inDemandProducts.map((product, index) => (
                     <div key={product.id} className="snap-start shrink-0 w-[260px] md:w-[300px]">
                        <ProductCard product={product} index={index} />
                     </div>
                   ))}
                </div>

                {/* Mobile/Tablet Explore Button - right aligned below carousel */}
                <div className="xl:hidden flex justify-end px-8 mt-4">
                  <motion.button 
                     whileHover={{ scale: 1.05 }} 
                     whileTap={{ scale: 0.95 }}
                     onClick={exploreAll}
                     className="bg-[#B5A18C] hover:bg-[#A38F7A] text-white px-8 py-3.5 rounded-full font-body text-sm font-semibold tracking-wider uppercase transition-colors shadow-md"
                  >
                     Explore All Designs
                  </motion.button>
                </div>

             </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default ProductCarousel;
