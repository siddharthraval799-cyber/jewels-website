import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/products";

const categoryImages: Record<string, string> = {
  rings: "https://images.unsplash.com/photo-1605100804763-247f6615b3c5?auto=format&fit=crop&q=80",
  earrings: "https://images.unsplash.com/photo-1535632066927-ab0c9ab60908?auto=format&fit=crop&q=80",
  necklaces: "https://images.unsplash.com/photo-1599643478524-fb52445c711a?auto=format&fit=crop&q=80",
  bangles: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80",
  bracelets: "https://images.unsplash.com/photo-1573408301145-3f3652de9e5d?auto=format&fit=crop&q=80",
  chains: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80",
  pendants: "https://images.unsplash.com/photo-1515562141207-7a8efd331af1?auto=format&fit=crop&q=80",
};

const CategoriesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">
            Our Collections
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">
            Shop by Category
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-cream border border-border flex items-center justify-center group-hover:border-primary group-hover:shadow-[var(--shadow-gold)] transition-all duration-500 overflow-hidden">
                  <img src={categoryImages[cat.id]} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <span className="mt-3 text-xs tracking-[0.15em] uppercase font-body font-medium text-foreground/80 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
