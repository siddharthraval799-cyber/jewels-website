import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PromoBanners = () => {
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
            <Link to="/custom-jewellery" className="group block relative overflow-hidden h-64 md:h-[350px] rounded-xl shadow-inner">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#5a4834]/90 via-[#735A3F]/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-center text-left p-8 md:p-12 w-3/4">
                <span className="text-white/80 text-sm tracking-wide font-body mb-2">
                  Make it Your Custom Jewellery
                </span>
                <span className="bg-white text-[#5a4834] text-xs font-semibold px-3 py-1 rounded inline-block w-max mb-3 shadow-sm">
                  Snap → Sketch → Shine
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-white font-semibold">
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
            <Link to="/video-call" className="group block relative overflow-hidden h-64 md:h-[350px] rounded-xl shadow-inner">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80')` }}
              />
              <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-l from-black/40 to-transparent md:hidden" />
              <div className="relative z-10 h-full flex flex-col justify-center items-end text-right p-8 md:p-12">
                <span className="bg-white/80 backdrop-blur-sm text-secondary-foreground text-[10px] tracking-widest px-3 py-1 rounded-full inline-block mb-3 border border-white/50 shadow-sm">
                  Join Call → Select Jewellery → Get Delivery
                </span>
                <h3 className="font-display text-4xl md:text-5xl text-white font-bold drop-shadow-lg uppercase tracking-tight">
                  LIVE VIDEO CALL
                </h3>
                <span className="mt-2 text-white/90 text-xs md:text-sm tracking-wide font-body max-w-[200px] drop-shadow-md">
                  Connect instantly. Book your session now.
                </span>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
