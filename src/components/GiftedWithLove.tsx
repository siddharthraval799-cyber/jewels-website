import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Gift } from "lucide-react";

const giftingCategories = [
  { id: 1, title: "Birthday", image: "https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80", link: "/products?occasion=birthday" },
  { id: 2, title: "Wedding Gifting", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80", link: "/products?occasion=wedding" },
  { id: 3, title: "Engagement", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80", link: "/products?occasion=engagement" },
  { id: 4, title: "For Wife", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80", link: "/products?category=gifts-for-wife" },
  { id: 5, title: "For Daughter", image: "https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80", link: "/products?category=gifts-for-daughter" },
];

const GiftedWithLove = () => {
  return (
    <section className="py-24 bg-background border-t border-border/40 relative">
      <div className="container mx-auto px-4 text-center">
        
        {/* Header with Gift Icon */}
        <div className="mb-14 flex flex-col items-center">
           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-sm">
             <Gift className="w-6 h-6 text-primary" />
           </div>
           <motion.h2 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl font-display font-medium text-secondary-foreground mb-3 tracking-wide"
           >
             Gifted with Love
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-muted-foreground font-body text-sm tracking-wide"
           >
             Thoughtful treasures, wrapped in elegance.
           </motion.p>
        </div>

        {/* Categories Grid (5 items) */}
        {/* The screenshot shows a horizontal slider with next/prev buttons floating. 
            We will implement a responsive 5-column grid that turns into a slider on mobile. */}
        <div className="relative group/slider w-full max-w-[1400px] mx-auto">
          
          <button className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full border border-border shadow-md flex items-center justify-center text-secondary-foreground opacity-0 group-hover/slider:opacity-100 transition-opacity md:flex hidden hover:bg-white hover:scale-105">
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 overflow-x-auto snap-x scrollbar-hide px-2 pb-4">
            {giftingCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="snap-center shrink-0 w-full relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all border border-border/40"
              >
                <Link to={cat.link} className="block w-full h-full">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle brown gradient overlay at the bottom as requested in Photo 5 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B6E4E]/90 via-[#8B6E4E]/20 to-transparent opacity-90" />
                  
                  <div className="absolute inset-x-0 bottom-6 text-center">
                    <h3 className="text-white font-display text-xl md:text-2xl font-medium tracking-wide drop-shadow-md">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <button className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full border border-border shadow-md flex items-center justify-center text-secondary-foreground opacity-0 group-hover/slider:opacity-100 transition-opacity md:flex hidden hover:bg-white hover:scale-105">
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Simple brown pagination indicator at the bottom mapping to the line in Photo 5 */}
          <div className="flex justify-center mt-10 gap-2">
            <div className="w-12 h-1 bg-[#8B6E4E] rounded-full"></div>
            <div className="w-12 h-1 bg-border rounded-full"></div>
            <div className="w-12 h-1 bg-border rounded-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GiftedWithLove;
