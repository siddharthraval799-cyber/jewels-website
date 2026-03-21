import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const collections = [
  // ROW 1
  { title: "Necklace", image: "https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80", span: "col-span-12 md:col-span-3", aspect: "aspect-[4/3]" },
  { title: "Kada", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80", span: "col-span-12 md:col-span-3", aspect: "aspect-[4/3]" },
  { title: "Pendant Set", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80", span: "col-span-12 md:col-span-4", aspect: "aspect-video md:aspect-[16/9]" },
  { title: "Mangalsutra", image: "https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80", span: "col-span-12 md:col-span-2", aspect: "aspect-[4/3]" },
  
  // ROW 2 & 3 COMPLEX STRUCTURE
  // We will handle row 2/3 manually below for irregular spans
];

const CuratedCollection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-semibold text-secondary-foreground mb-4"
          >
            Curated Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-body text-sm md:text-base max-w-2xl mx-auto"
          >
            Handpicked treasures, just for you. Discover style, curated with care.
          </motion.p>
        </div>

        {/* CSS GRID Layout matching Photo 1 exactly */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
          {/* Row 1 */}
          <Link to="/products?category=necklace" className="col-span-12 md:col-span-3 row-span-1 group relative rounded-xl overflow-hidden shadow-sm">
            <img src={collections[0].image} alt="Necklace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Necklace</span>
            </div>
          </Link>

          <Link to="/products?category=kada" className="col-span-12 md:col-span-3 row-span-1 group relative rounded-xl overflow-hidden shadow-sm">
            <img src={collections[1].image} alt="Kada" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Kada</span>
            </div>
          </Link>

          <Link to="/products?category=pendant-set" className="col-span-12 md:col-span-4 row-span-1 group relative rounded-xl overflow-hidden shadow-sm">
            <img src={collections[2].image} alt="Pendant Set" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Pendant Set</span>
            </div>
          </Link>

          <Link to="/products?category=mangalsutra" className="col-span-12 md:col-span-2 row-span-1 group relative rounded-xl overflow-hidden shadow-sm">
            <img src={collections[3].image} alt="Mangalsutra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Mangalsutra</span>
            </div>
          </Link>

          {/* Row 2 & 3 */}
          
          {/* Chains - Tall Left */}
          <Link to="/products?category=chains" className="col-span-12 md:col-span-3 row-span-2 group relative rounded-xl overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80" alt="Chains" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Chains</span>
            </div>
          </Link>

          {/* Rings & Earrings Column */}
          <div className="col-span-12 md:col-span-3 row-span-2 grid grid-rows-2 gap-4">
            <Link to="/products?category=rings" className="group relative rounded-xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80" alt="Rings" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Rings</span>
              </div>
            </Link>
            <Link to="/products?category=earrings" className="group relative rounded-xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80" alt="Earrings" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Earrings</span>
              </div>
            </Link>
          </div>

          {/* Pendants - Tall Center */}
          <Link to="/products?category=pendants" className="col-span-12 md:col-span-4 row-span-2 grid grid-rows-[1fr_auto] gap-4">
             {/* We mimic the layout: a single tall block or two distinct blocks? Actually looking at image, 'Pendants' is tall and 'Bracelet' is wide next to it? Wait, Pendants is a tall card, Bracelet is a wide card.
                 Let's make Pendants span 2 rows, and Bracelet span 2 rows? Image shows Bracelet is wide. Let's just create a nice masonry fit.
             */}
             <div className="group relative rounded-xl overflow-hidden shadow-sm h-full">
               <img src="https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80" alt="Bracelet" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-x-0 bottom-4 flex justify-center">
                 <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Bracelet</span>
               </div>
             </div>
          </Link>

          {/* Bangles - Tall Right */}
          <Link to="/products?category=bangles" className="col-span-12 md:col-span-2 row-span-2 group relative rounded-xl overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80" alt="Bangles" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full shadow-md text-secondary-foreground">Bangles</span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CuratedCollection;
