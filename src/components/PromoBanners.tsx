import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import VideoCallModal from "./VideoCallModal";

const PromoBanners = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-2xl shadow-sm border border-border/40">
          
          {/* Left Banner - Custom Jewellery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/custom-jewellery" className="group block relative overflow-hidden h-56 md:h-[300px] rounded-[24px] shadow-sm">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2025%2F11%2F27%2F18%2F1764570414025-1200-_-375.jpg&w=3840&q=75')` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
              <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-10">
                <span className="text-white text-base md:text-lg font-body mb-3 drop-shadow-md">
                  Make it Your Custom Jewellery
                </span>
                <div className="bg-white/95 backdrop-blur-sm text-[#333] text-[10px] md:text-xs font-semibold px-4 py-1.5 rounded-full w-max mb-4 shadow-md flex items-center gap-1.5">
                  <span>Snap</span>
                  <span className="text-gray-400">→</span>
                  <span>Sketch</span>
                  <span className="text-gray-400">→</span>
                  <span>Shine</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-white font-bold drop-shadow-lg">
                  Sketch to Sparkle
                </h3>
              </div>
            </Link>
          </motion.div>

          {/* Right Banner - Live Video Call */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full text-left group block relative overflow-hidden h-56 md:h-[300px] rounded-[24px] shadow-sm outline-none"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F1%2F8%2F15%2F1767869852637-1200-_-375-2.jpg&w=3840&q=75')` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
              <div className="relative z-10 h-full flex flex-col justify-center items-end text-right p-6 md:p-10">
                <div className="bg-white/95 backdrop-blur-sm text-[#333] text-[10px] md:text-xs font-bold tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-md flex items-center gap-1.5">
                  <span>Join Call</span>
                  <span className="text-gray-400">→</span>
                  <span>Select Jewellery</span>
                  <span className="text-gray-400">→</span>
                  <span>Get Delivery</span>
                </div>
                <h3 className="font-display text-4xl md:text-5xl text-white font-black drop-shadow-lg uppercase tracking-tight italic">
                  LIVE VIDEO CALL
                </h3>
                <span className="mt-3 text-white font-body text-xs md:text-sm tracking-wide drop-shadow-md bg-black/10 px-3 py-0.5 rounded-md backdrop-blur-[1px]">
                  Connect instantly. Book your session now.
                </span>
              </div>
            </button>
          </motion.div>

        </div>
      </div>

      <VideoCallModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </section>
  );
};

export default PromoBanners;
