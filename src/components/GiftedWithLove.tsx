import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Gift } from "lucide-react";

const giftingCategories = [
  { id: 1, title: "For Kids", image: "https://cdn.rushabhjewel.com/img/2025/12/12/12/1766127480273-for-kids.jpg", link: "/products?category=kids-collections" },
  { id: 2, title: "For Anniversary", image: "https://cdn.rushabhjewel.com/img/2025/12/10/13/for-anniversary.jpg", link: "/products?occasion=anniversary" },
  { id: 3, title: "Birthday", image: "https://cdn.rushabhjewel.com/img/2025/12/10/13/birthday.jpg", link: "/products?occasion=birthday" },
  { id: 4, title: "Wedding Gifting", image: "https://cdn.rushabhjewel.com/img/2025/12/10/13/wedding-gifting.jpg", link: "/products?occasion=wedding" },
  { id: 5, title: "Engagement", image: "https://cdn.rushabhjewel.com/img/2025/12/10/13/engagement.jpg", link: "/products?occasion=engagement" },
];

const GiftedWithLove = () => {
  return (
    <section className="py-24 bg-background border-t border-border/40 relative">
      <div className="container mx-auto px-4 text-center">
        
        {/* Header with Gift Icon */}
        <div className="mb-14 flex flex-col items-center">
           <div className="mb-4">
             {/* Exact style from reference image: simple brown icon without the circle bg */}
             <Gift className="w-8 h-8 text-[#A68A6A] stroke-[1.5]" />
           </div>
           <motion.h2 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-3xl md:text-[32px] font-display font-bold text-[#1a1a1a] mb-2 tracking-wide"
           >
             Gifted with Love
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-[#666666] font-body text-[15px] tracking-wide"
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
