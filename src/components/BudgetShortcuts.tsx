import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const budgetItems = [
  {
    label: "Under ₹30,000",
    price: "under-30000",
    image: "/-my-gem-websit/images/budget/under-30k.jpg",
    size: "small",
    floatDelay: 0,
    floatDuration: 3.2,
  },
  {
    label: "Under ₹1,00,000",
    price: "under-100000",
    image: "/-my-gem-websit/images/budget/under-100k.jpg",
    size: "large",
    floatDelay: 0.8,
    floatDuration: 3.8,
  },
  {
    label: "Under ₹50,000",
    price: "under-50000",
    image: "/-my-gem-websit/images/budget/under-50k.jpg",
    size: "small",
    floatDelay: 1.5,
    floatDuration: 3.5,
  },
];

const BudgetShortcuts = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4">
            <div className="w-8 h-8 rounded border border-[#AD8B73]/40 flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm border border-[#AD8B73]" />
            </div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-[#5a1c1c] text-center mb-2">
            Budget Friendly Finds
          </h2>
          <p className="text-muted-foreground text-sm md:text-base text-center">
            Stunning jewelry, perfect for every price range.
          </p>
        </motion.div>

        {/* Circles Row */}
        <div className="flex flex-wrap items-end justify-center gap-10 md:gap-16">
          {budgetItems.map((item, index) => (
            // Entrance animation wrapper
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
            >
              {/* Continuous floating wrapper — direct animate prop, no variants */}
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{
                  duration: item.floatDuration,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: item.floatDelay,
                }}
              >
                <Link
                  to={`/products?price=${item.price}`}
                  className="group flex flex-col items-center gap-5"
                >
                  {/* Circle image */}
                  <motion.div
                    className={`relative rounded-full overflow-hidden shadow-lg border-2 border-transparent group-hover:border-[#AD8B73] transition-colors duration-700
                      ${item.size === "large"
                        ? "w-64 h-64 md:w-80 md:h-80"
                        : "w-52 h-52 md:w-64 md:h-64"
                      }`}
                    whileHover={{ scale: 1.07 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-black/20 group-hover:to-black/5 transition-all duration-500" />
                  </motion.div>

                  {/* Price label */}
                  <div className="text-center">
                    <span className="block text-[#1a1a1a] font-display text-lg md:text-xl font-semibold group-hover:text-[#AD8B73] transition-colors duration-300">
                      {item.label}
                    </span>
                    <span className="block text-[#AD8B73] text-xs tracking-[0.2em] uppercase mt-1 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Shop Now →
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BudgetShortcuts;
