import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const budgetItems = [
  { 
    label: "Under ₹30,000", 
    price: "under-30000", 
    image: "https://cdn.rushabhjewel.com/img/2026/1/2/17/1767356030025-budget-friendly-finds-600_612-1-30,000.jpg",
    size: "small"
  },
  { 
    label: "Under ₹1,00,000", 
    price: "under-100000", 
    image: "https://cdn.rushabhjewel.com/img/2026/1/2/17/1767356003191-budget-friendly-finds-600_612-2-1,00,000.jpg",
    size: "large"
  },
  { 
    label: "Under ₹50,000", 
    price: "under-50000", 
    image: "https://cdn.rushabhjewel.com/img/2026/1/2/17/1767356014234-budget-friendly-finds-600_612-3-50,000.jpg",
    size: "small"
  },
];

const BudgetShortcuts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header with Icon */}
        <div className="flex flex-col items-center mb-12">
          <div className="mb-4">
             {/* Small icon as seen in reference */}
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
        </div>

        {/* Circles Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {budgetItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${index === 0 ? "order-1" : index === 1 ? "order-2 md:scale-110" : "order-3"}`}
            >
              <Link
                to={`/products?price=${item.price}`}
                className="group flex flex-col items-center gap-6"
              >
                <div className={`relative ${
                  item.size === "large" ? "w-48 h-48 md:w-64 md:h-64" : "w-40 h-40 md:w-52 md:h-52"
                } rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#AD8B73] transition-all duration-700 shadow-md group-hover:shadow-xl`}>
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="text-center">
                  <span className="text-secondary-foreground font-display text-base md:text-lg font-semibold group-hover:text-[#AD8B73] transition-colors">
                    {item.label}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BudgetShortcuts;
