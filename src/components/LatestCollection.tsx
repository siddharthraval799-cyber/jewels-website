import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const latestProducts = [
  { id: 1, price: "₹14,47,244", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 2, price: "₹12,96,299", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 3, price: "₹10,42,065", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 4, price: "₹8,45,534", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 5, price: "₹13,94,821", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
  { id: 6, price: "₹7,17,381", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" },
];

const LatestCollection = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* The Beautiful Curvy Brown Background Container */}
        <div className="relative bg-[#BD9A7A] rounded-[40px] pt-16 pb-24 px-8 md:px-16 shadow-lg">
          
          {/* Header */}
          <div className="mb-10 max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl uppercase tracking-widest text-white mb-2"
            >
              The Latest You'll Love
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-sm font-body tracking-wide"
            >
              New in, made to stand out. Curated essentials for every moment.
            </motion.p>
          </div>

          {/* Product Carousel / Grid */}
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {latestProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="snap-start shrink-0 w-[240px] bg-white rounded-xl overflow-hidden shadow-md flex flex-col pt-4 px-4 pb-0"
              >
                <Link to={`/products/${product.id}`} className="group relative block aspect-square bg-cream rounded-lg overflow-hidden mb-4">
                  <img src={product.image} alt="Jewellery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 mix-blend-multiply" />
                </Link>
                <div className="bg-white py-3 border-t border-border/50">
                  <p className="text-secondary-foreground font-display font-medium text-lg">
                    {product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Rotate Animation Bangles mapping to Photo 2 right edge request */}
          <motion.div 
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-8 md:right-12 top-10 md:-top-16 w-32 md:w-48 pointer-events-none drop-shadow-2xl z-20"
          >
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200&h=200" alt="Floating Bangle" className="w-full h-auto drop-shadow-2xl rounded-full sepia scale-125 clip-[circle(35%)] mix-blend-luminosity brightness-110" style={{ clipPath: 'circle(40%)' }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
