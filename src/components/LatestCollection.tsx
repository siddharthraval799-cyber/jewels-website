import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const latestProducts = [
  { 
    id: 1, 
    name: "Amulya Heritage Gajara 22KT",
    price: "₹12,65,726", 
    image: "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fapi.rushabhjewel.com%2Fimg%2F2025%2F1%2F10%2F15%2F1736502220496-heritage-gajara.jpg&w=1200&q=75",
    weight: "72.08 gm",
    karat: "22KT"
  },
  { 
    id: 2, 
    name: "Ratnāvartā Rāgamālā Gajara 22KT",
    price: "₹7,47,169", 
    image: "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fapi.rushabhjewel.com%2Fimg%2F2025%2F1%2F10%2F17%2F1736509935406-ratnavarta-ragamala.jpg&w=1200&q=75",
    weight: "43.75 gm",
    karat: "22KT"
  },
  { 
    id: 3, 
    name: "Heritage Lotus Blossom Gajara 22KT",
    price: "₹13,61,523", 
    image: "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fapi.rushabhjewel.com%2Fimg%2F2025%2F1%2F10%2F15%2F1736502202685-heritage-lotus-blossom.jpg&w=1200&q=75",
    weight: "78.5 gm",
    karat: "22KT"
  },
  { 
    id: 4, 
    name: "Svarapushpa Gajara 22KT",
    price: "₹7,00,572", 
    image: "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fapi.rushabhjewel.com%2Fimg%2F2025%2F1%2F10%2F16%2F1736504938642-svarapushpa.jpg&w=1200&q=75",
    weight: "40.66 gm",
    karat: "22KT"
  },
  { 
    id: 5, 
    name: "Pushparang Antique Gajara 22KT",
    price: "₹10,16,941", 
    image: "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fapi.rushabhjewel.com%2Fimg%2F2025%2F1%2F10%2F17%2F1736511116244-pushparang-antique.jpg&w=1200&q=75",
    weight: "60.78 gm",
    karat: "22KT"
  },
  { 
    id: 6, 
    name: "Kanakāvalli Rūpantara Gajara 22KT",
    price: "₹8,25,236", 
    image: "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fapi.rushabhjewel.com%2Fimg%2F2025%2F1%2F10%2F16%2F1736505370243-kanakavalli-rupantara.jpg&w=1200&q=75",
    weight: "49.1 gm",
    karat: "22KT"
  },
];

const LatestCollection = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="mx-auto px-4 md:px-10 lg:px-14 max-w-[1750px]">
        {/* The Beautiful Curvy Brown Background Container */}
        <div className="relative bg-[#AD8B73] rounded-t-[40px] pt-12 pb-16 px-6 md:px-12 shadow-lg">
          
          {/* Header */}
          <div className="mb-8 max-w-4xl">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl uppercase tracking-[0.1em] text-white mb-2 italic font-medium"
            >
              The Latest You'll Love
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-xs md:text-sm font-body tracking-wider"
            >
              New in, made to stand out. Curated essentials for every moment.
            </motion.p>
          </div>

          {/* Product Carousel / Grid */}
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
            {latestProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="snap-start shrink-0 w-[180px] md:w-[220px] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col pt-3 px-3 pb-3 group"
              >
                <Link to={`/products/${product.id}`} className="relative block aspect-[4/5] bg-[#F7F3F0] rounded-xl overflow-hidden mb-3">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </Link>
                <div className="flex flex-col gap-1 px-1">
                  <p className="text-[#333] font-bold text-base md:text-lg">
                    {product.price}
                  </p>
                  <p className="text-gray-500 text-[10px] md:text-[11px] font-medium uppercase tracking-tight line-clamp-1">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-gray-100">
                    <div className="flex items-center gap-1 grayscale opacity-60">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <span className="text-[9px] text-gray-600 font-semibold uppercase">{product.weight}</span>
                    </div>
                    <div className="flex items-center gap-1 grayscale opacity-60">
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <span className="text-[9px] text-gray-600 font-semibold uppercase">{product.karat}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-1.5">
              <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#AD8B73] transition-colors">
                <ArrowRight className="rotate-180 w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#AD8B73] hover:bg-white/90 transition-colors shadow-md">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <Link to="/products" className="bg-[#5A6D7C] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-[#4A5D6C] transition-colors shadow-lg">
              Explore All Designs
            </Link>
          </div>

          {/* Floating Rotate Animation Bangles mapping to Photo 2 right edge request */}
          <motion.div 
            animate={{ 
              rotate: [15, 20, 15],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-10 md:right-6 -top-8 md:-top-20 w-40 md:w-64 pointer-events-none z-20 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
          >
            <img 
              src="/-my-gem-websit/images/floating-bangles.png" 
              alt="Floating Bangle" 
              className="w-full h-auto brightness-110" 
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
