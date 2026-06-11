import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Gift } from "lucide-react";

const giftingCategories = [
  { id: 1, title: "For Wife", image: "/images/gifting/for-wife.jpg", link: "/products?occasion=wife" },
  { id: 2, title: "For Daughter", image: "/images/gifting/for-daughter.jpg", link: "/products?occasion=daughter" },
  { id: 3, title: "For Mother", image: "/images/gifting/for-mother.jpg", link: "/products?occasion=mother" },
  { id: 4, title: "For Kids", image: "/images/gifting/for-kids.jpg", link: "/products?category=kids-collections" },
  { id: 5, title: "Wedding Gift", image: "/images/gifting/for-wedding.jpg", link: "/products?occasion=wedding" },
];

const GiftedWithLove = () => {
  return (
    <section className="py-16 bg-background border-t border-border/40 relative">
      <div className="container mx-auto px-4 text-center">
        
        {/* Header with Gift Icon */}
        <div className="mb-10 flex flex-col items-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="mb-3"
           >
             <Gift className="w-7 h-7 text-[#A68A6A] stroke-[1.5]" />
           </motion.div>
           
           <h2 className="text-2xl md:text-[28px] font-display font-medium text-[#1a1a1a] mb-1.5 tracking-wide flex flex-wrap justify-center overflow-hidden">
             {"Gifted with Love".split("").map((char, index) => (
               <motion.span
                 key={index}
                 initial={{ y: "100%", opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ 
                   duration: 0.5, 
                   delay: index * 0.03,
                   ease: [0.33, 1, 0.68, 1]
                 }}
                 className="inline-block"
                 style={{ whiteSpace: char === " " ? "pre" : "normal" }}
               >
                 {char}
               </motion.span>
             ))}
           </h2>
           
           <motion.p 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.5 }}
             className="text-[#666666] font-body text-sm tracking-wide"
           >
             Thoughtful treasures, wrapped in elegance.
           </motion.p>
        </div>

        {/* Categories Grid (5 items) */}
        <div className="relative group/slider w-full max-w-[1400px] mx-auto px-4 md:px-8">
          
          <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center text-secondary-foreground opacity-0 group-hover/slider:opacity-100 transition-opacity md:flex hidden hover:bg-white hover:scale-105">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 overflow-x-auto snap-x scrollbar-hide pb-4">
            {giftingCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="snap-center shrink-0 w-full relative aspect-[3/4] md:aspect-[4/5.2] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all"
              >
                <Link to={cat.link} className="block w-full h-full relative">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Perfect opaque to transparent brown gradient overlay mimicking reference */}
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#9B7F69] via-[#9B7F69]/80 to-transparent pointer-events-none" />
                  
                  <div className="absolute inset-x-0 bottom-6 text-center z-10 px-2 lg:px-4">
                    <h3 className="text-white font-body text-xl md:text-[22px] font-semibold tracking-wide drop-shadow-sm leading-tight">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center text-secondary-foreground opacity-0 group-hover/slider:opacity-100 transition-opacity md:flex hidden hover:bg-white hover:scale-105">
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Simple brown pagination indicator at the bottom matching reference image 1 */}
          <div className="flex justify-center mt-8 gap-2">
            <div className="w-10 h-[3px] bg-[#9B7F69] rounded-full"></div>
            <div className="w-10 h-[3px] bg-border rounded-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GiftedWithLove;
