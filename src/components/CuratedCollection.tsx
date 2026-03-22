import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const collections = [
  { 
    id: "necklace",
    title: "Necklace", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359947302-vertical-layout-800-_-1281-1.jpg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-4" 
  },
  { 
    id: "earrings",
    title: "Earrings", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359792703-horizontal-layout-1200-_-452-1.jpg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "bracelet",
    title: "Bracelet", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359853435-horizontal-layout-1200-_-452-1.jpg", 
    className: "col-span-2 aspect-[2/1] lg:aspect-auto lg:col-span-2 lg:row-span-5" 
  },
  { 
    id: "chains",
    title: "Chains", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359604363-square-layout-800-_-619-1.jpg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "bangles",
    title: "Bangles", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765360044811-square-layout-800-_-619-2.jpg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-6" 
  },
  { 
    id: "pendants",
    title: "Pendants", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359878295-big-square-layout-1200-_-934-1.jpg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "kada",
    title: "Kada", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359823783-vertical-layout-800-_-1281-1.jpg", 
    className: "col-span-1 aspect-square md:aspect-[1/2] lg:aspect-auto lg:col-span-1 lg:row-span-9" 
  },
  { 
    id: "pendant-set",
    title: "Pendant Set", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359913436-vertical-layout-800-_-1281-1.jpg", 
    className: "col-span-2 aspect-[2/1] lg:aspect-auto lg:col-span-2 lg:row-span-5" 
  },
  { 
    id: "mangalsutra",
    title: "Mangalsutra", 
    image: "https://cdn.rushabhjewel.com/img/2025/12/10/14/1765359757823-square-layout-800-_-619-1.jpg", 
    className: "col-span-2 aspect-[2/1] lg:aspect-auto lg:col-span-2 lg:row-span-4" 
  },
  { 
    id: "rings",
    title: "Rings", 
    image: "https://cdn.rushabhjewel.com/img/2026/1/19/1/1768807038822-square-layout-800_619-1.jpg", 
    className: "col-span-2 aspect-[2/1] lg:aspect-auto lg:col-span-2 lg:row-span-4" 
  }
];

const CuratedCollection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl">
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

        {/* Responsive CSS Grid: 2 columns on mobile, 5 on lg desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 auto-rows-min lg:auto-rows-[45px] grid-flow-row-dense">
          {collections.map((item) => (
            <Link 
              key={item.id}
              to={`/products?category=${item.id}`} 
              className={`group relative rounded-xl overflow-hidden shadow-sm bg-muted ${item.className}`}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="bg-white/90 backdrop-blur-sm text-xs md:text-sm font-semibold uppercase tracking-widest px-4 md:px-6 py-2 rounded-full shadow-md text-secondary-foreground whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuratedCollection;
