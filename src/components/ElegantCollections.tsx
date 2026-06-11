import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const collections = [
  {
    title: "Where masculinity meets luxury.",
    image: "/images/collections/mens-luxury.jpg",
    link: "/products?category=mens-jewellery",
    align: "left"
  },
  {
    title: "Because every love story deserves a beautiful symbol.",
    image: "/images/collections/mangalsutra.jpg",
    link: "/products?category=mangalsutra",
    align: "right"
  },
  {
    title: "Bold brilliance in a subtle stone Monzoite elegance.",
    image: "/images/collections/monzoite.jpg",
    link: "/products",
    align: "left"
  }
];

const ElegantCollections = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-[#5a1c1c] mb-3">
            Elegant Collections
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Your perfect ring awaits. Handcrafted with passion, designed to last forever.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden shadow-md"
            >
              <Link to={item.link} className="block w-full h-full relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />

                {/* Removed overlay text to avoid overlap with baked-in image text */}
                <div className={`relative z-10 h-full flex flex-col justify-center p-8 md:p-10 ${item.align === "right" ? "items-end text-right" : "items-start text-left"
                  }`}>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElegantCollections;
