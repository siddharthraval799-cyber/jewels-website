import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the preloader after exactly 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-secondary flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center relative"
          >
            {/* Logo Text Animation */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-display text-4xl md:text-6xl tracking-widest mb-6"
            >
              <span className="gold-text font-bold">AURUM</span>
              <span className="font-light text-secondary-foreground ml-3">JEWELS</span>
            </motion.h1>
            
            {/* Animated Underline Progress */}
            <div className="w-[120%] -ml-[10%] h-[1px] bg-border relative overflow-hidden">
               <motion.div
                 initial={{ x: "-100%" }}
                 animate={{ x: "0%" }}
                 transition={{ delay: 1, duration: 3.8, ease: "easeInOut" }}
                 className="absolute inset-0 bg-primary"
               />
            </div>
            
            {/* Subtext Animation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-xs md:text-sm tracking-[0.4em] text-muted-foreground uppercase font-body mt-6"
            >
              Heritage & Luxury Since 1985
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
