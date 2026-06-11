import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, PenLine } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const reviews = [
// ... (rest of reviews remains same)
  {
    name: "Maurvi Devda",
    text: "We had a really amazing experience and salesperson Amitbhai attended us very well and showed us some really amazing collection",
    rating: 5,
    avatar: "https://cdn.rushabhjewel.com/img/2026/2/18/1/1771394283966-img_8129.jpg.jpeg"
  },
  {
    name: "Suresh Chaudhary",
    text: "I had a wonderful experience with Rushabh Jewels! The quality of their jewelry is truly exceptional, with intricate designs and fine craftsmanship. Their customer service was warm, professional, and very helpful in guiding me to find exactly what I was looking for. Whether you're buying for a special occasion or just treating yourself, Rushabh Jewels is one of the best places to shop. Highly recommended!",
    rating: 5,
    avatar: "S"
  },
  {
    name: "payal jain",
    text: "I had a wonderful experience at this jewellery store. The designs are absolutely amazing and very unique. The hospitality is excellent, and the staff is polite, patient, and very helpful. They explained everything clearly and made us feel comfortable. I would definitely recommend this jewellery store.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "Shah Tirth",
    text: "Must visit Rushabh jewels nd also best experience. Staff behaviour is also good rd also have variety patterns of designs in jewelry.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-EMhf_o6yv_Gq9w-CXPq1R_S_J1S_7yZ9M_S_J1S_7yZ9M=s120-c-rp-mo-br100"
  },
  // Duplicating for marquee effect
  {
    name: "Khushboo Shah",
    text: "Excellent collection and very humble staff. Must visit for unique gold and diamond jewellery.",
    rating: 5,
    avatar: "K"
  }
];

const videos = [
  {
    title: "CRAFTED FOR MOMENTS THAT LAST FOREVER.",
    subtitle: "A jewel that tells my story ✨",
    customerName: "Priya Sharma",
    thumbnail: "/images/happy-customer-2.jpg",
  },
  {
    title: "CELEBRATED DAYS, CLASSIC WAYS.",
    subtitle: "My wedding look was perfect! 💍",
    customerName: "Anita Patel",
    thumbnail: "/images/nav/kids/baby_nazariya.png",
  },
  {
    title: "CAPTURE THE GLOW.",
    subtitle: "Gold that shines like my happiness 🌟",
    customerName: "Meera Joshi",
    thumbnail: "/images/nav/pendant-set/antique.png",
  }
];

const Testimonials = () => {
  const [videoIndex, setVideoIndex] = useState(0);

  const handleNextVideo = () => {
    setVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-full border border-[#AD8B73]/20 flex items-center justify-center text-[#AD8B73]">
              <PenLine className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display text-[#333] mb-4 font-bold">
            Hear from Our Happy Customers
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Every Jewel Has a Story. Hear What Our Customers Have to Say.
          </p>
          
          <div className="mt-8 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
            <button className="border-2 border-[#AD8B73] text-[#AD8B73] px-8 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#AD8B73] hover:text-white transition-all shadow-sm">
              Write A Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Auto-scrolling Reviews */}
          <div className="relative h-[600px] overflow-hidden group">
            <motion.div 
              animate={{ y: [0, -1000] }}
              transition={{ 
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex flex-col gap-6"
            >
              {[...reviews, ...reviews, ...reviews].map((review, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#F9F9F9] rounded-[40px] p-8 flex gap-6 shadow-sm border border-black/5"
                >
                  <div className="flex-shrink-0">
                    {review.avatar.length > 1 ? (
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#1e7e7e] text-white flex items-center justify-center font-bold text-xl">
                        {review.avatar}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#333] mb-1">{review.name}</h4>
                    <p className="text-sm text-[#666] leading-relaxed mb-4">
                      {review.text}
                    </p>
                    <div className="flex justify-end gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-[#FFD700] text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Gradient Overlays for smooth entry/exit */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>

          {/* Right: Video Testimonials Carousel */}
          <div className="relative w-full">
            <div className="overflow-hidden">
               <motion.div 
                 animate={{ x: `-${(videoIndex * (100 / 3))}%` }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 className="flex"
               >
                 {videos.map((video, idx) => (
                   <div key={idx} className="min-w-full md:min-w-[33.33%] px-2">
                     <div className="bg-[#4a1d1d] rounded-[30px] py-8 px-4 flex flex-col items-center shadow-xl h-full">

                       {/* Mohen Jewellers Logo Area */}
                       <div className="mb-5 flex items-center gap-2">
                         {/* Lotus icon in white */}
                         <svg viewBox="0 0 40 36" className="w-6 h-5 fill-white/80" xmlns="http://www.w3.org/2000/svg">
                           <path d="M20 2C20 2 14 9 14 15c0 3.3 2.7 6 6 6s6-2.7 6-6C26 9 20 2 20 2z" fillOpacity="0.7"/>
                           <path d="M20 4C20 4 9 11 9 18c0 4.4 4.9 8 11 8s11-3.6 11-8C31 11 20 4 20 4z"/>
                           <rect x="19" y="30" width="2" height="5" rx="1"/>
                           <rect x="10" y="34" width="20" height="2" rx="1"/>
                         </svg>
                         <span className="text-white text-[10px] tracking-[0.2em] font-bold uppercase whitespace-nowrap">
                           Mohen Jewellers
                         </span>
                       </div>

                       {/* Inner Video Frame — portrait phone style */}
                       <div className="w-full aspect-[9/14] bg-white rounded-2xl p-1 overflow-hidden relative shadow-inner">
                         <div className="w-full h-full rounded-xl overflow-hidden relative">
                           <img
                             src={video.thumbnail}
                             alt={video.customerName}
                             className="w-full h-full object-cover"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                           {/* Customer name badge at bottom */}
                           <div className="absolute bottom-3 left-3 right-3">
                             <p className="text-white text-[11px] font-bold drop-shadow-md">{video.customerName}</p>
                             <p className="text-white/80 text-[9px] mt-0.5">{video.subtitle}</p>
                           </div>

                           {/* Play Button */}
                           <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 hover:scale-110 transition-all cursor-pointer">
                               <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Caption */}
                       <div className="mt-6 text-center px-2">
                         <p className="text-white text-[9px] font-bold tracking-[0.15em] leading-[1.7] uppercase">
                           {video.title}
                         </p>
                       </div>
                     </div>
                   </div>
                 ))}
               </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={handlePrevVideo}
                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#AD8B73] hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextVideo}
                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#AD8B73] hover:text-white transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
