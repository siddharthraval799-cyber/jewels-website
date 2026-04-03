import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const collections = [
  { 
    id: "mangalsutra",
    title: "Mangalsutra", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-4" 
  },
  { 
    id: "bangles",
    title: "Bangles", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "pendants",
    title: "Pendants", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-4" 
  },
  { 
    id: "earrings",
    title: "Earrings", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "bracelet",
    title: "Bracelet", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "chains",
    title: "Chains", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-4" 
  },
  { 
    id: "kada",
    title: "Kada", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-4" 
  },
  { 
    id: "necklace",
    title: "Necklace", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  },
  { 
    id: "rings",
    title: "Rings", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-4" 
  },
  { 
    id: "pendant-set",
    title: "Pendant Set", 
    image: "/placeholder.svg", 
    className: "col-span-1 aspect-square lg:aspect-auto lg:col-span-1 lg:row-span-5" 
  }
];

const CuratedCollection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden relative">
      <div className="mx-auto px-4 md:px-10 lg:px-14 max-w-[1750px]">
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
                <span className="bg-white/95 backdrop-blur-sm text-xs md:text-sm font-bold uppercase tracking-widest px-5 md:px-6 py-2 rounded-full shadow-md text-gray-900 whitespace-nowrap">
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
