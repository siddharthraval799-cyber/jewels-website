import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type CreatorReel } from "@/lib/api";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from "lucide-react";

export default function CreatorReels() {
  const [reels, setReels] = useState<CreatorReel[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    api.creatorReels.get()
      .then(res => setReels(res.reels))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Play active video, pause others
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Auto-play might be blocked by browser
          video.muted = true;
          setIsMuted(true);
          video.play().catch(console.error);
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex, reels]);

  if (reels.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-cream to-primary/5">
      <div className="container mx-auto px-4 text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center">
             <div className="w-3 h-3 bg-primary rounded-sm transform rotate-45" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Glow Up with Top Creators</h2>
        <p className="text-secondary-foreground font-body max-w-2xl mx-auto">
          Step into the spotlight with your favorite creators. Trends, style, and moments that inspire. All in one Reel.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto h-[600px] flex items-center justify-center">
        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-foreground hover:scale-110 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-foreground hover:scale-110 transition-transform"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Container */}
        <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000">
          <AnimatePresence initial={false}>
            {reels.map((reel, index) => {
              // Calculate relative position based on infinite loop wrap-around
              const distance = (index - activeIndex + reels.length) % reels.length;
              // Make negative distance for the left side items
              const offset = distance > reels.length / 2 ? distance - reels.length : distance;
              
              // Only render items that are close to active to save DOM elements
              if (Math.abs(offset) > 5) return null;

              const isActive = offset === 0;
              
              // Positioning logic matching the image reference
              let x = offset * 140; // Reduced distance between cards to fit more on screen
              let zIndex = 10 - Math.abs(offset);
              let scale = 1 - Math.abs(offset) * 0.12;
              let smOpacity = Math.abs(offset) > 4 ? 0 : 1;
              let backdropBrightness = isActive ? 1 : 1 - (Math.abs(offset) * 0.2);

              // Mobile overrides
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                x = offset * 100;
                scale = 1 - Math.abs(offset) * 0.2;
              }

              return (
                <motion.div
                  key={reel.id}
                  className={`absolute w-[280px] md:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-black ${isActive ? 'ring-4 ring-white/20' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    x,
                    scale,
                    zIndex,
                    opacity: smOpacity,
                    filter: `brightness(${backdropBrightness})`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  onClick={() => !isActive && setActiveIndex(index)}
                >
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={reel.videoUrl}
                    poster={reel.thumbnailUrl}
                    loop
                    playsInline
                    muted={isActive ? isMuted : true}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dark overlay for inactive items to look like the reference image */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}

                  {/* UI for Active Item */}
                  {isActive && (
                    <>
                      {/* Mute toggle button */}
                      <button 
                        onClick={toggleMute}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:bg-black/60 transition-colors z-30"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      
                      {/* Caption */}
                      {reel.caption && (
                         <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
                            <p className="text-white text-sm font-semibold drop-shadow-md">
                              {reel.caption}
                            </p>
                         </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
