import { Instagram } from "lucide-react";
import { motion } from "framer-motion";

const instaImages = [
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400&h=401",
];

const InstagramGrid = () => {
  return (
    <section className="py-20 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Instagram className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.3em] font-body font-bold">Follow Us @AurumJewels</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-wider text-secondary-foreground text-center uppercase">
            From Our Instagram
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 lg:gap-2">
          {instaImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="aspect-square relative group overflow-hidden bg-cream"
            >
              <img
                src={src}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white w-8 h-8 scale-75 group-hover:scale-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGrid;
