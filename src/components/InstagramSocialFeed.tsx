import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// ONLY dark-background images used — all paths verified to exist in public/images/nav/
// These all have dark brown velvet backgrounds and show clearly on any card color
const allImages = [
  "/-my-gem-websit/images/nav/kids/baby_kadli.png",
  "/-my-gem-websit/images/nav/mens/mens_rings.png",
  "/-my-gem-websit/images/nav/pendant-set/antique.png",
  "/-my-gem-websit/images/nav/kids/baby_nazariya.png",
  "/-my-gem-websit/images/nav/mens/mens_bracelets.png",
  "/-my-gem-websit/images/nav/pendant-set/heritage.png",
  "/-my-gem-websit/images/nav/kids/baby_pendent.png",
  "/-my-gem-websit/images/nav/mens/mens_chains.png",
  "/-my-gem-websit/images/nav/pendant-set/monzonaite.png",
  "/-my-gem-websit/images/nav/more/explore_all.png",
];

const columnA = [
  allImages[0], allImages[3], allImages[6], allImages[9],
  allImages[1], allImages[4], allImages[7], allImages[2],
];

const columnB = [
  allImages[5], allImages[8], allImages[1], allImages[4],
  allImages[0], allImages[7], allImages[3], allImages[6],
];

const columnC = [
  allImages[2], allImages[6], allImages[9], allImages[3],
  allImages[5], allImages[0], allImages[8], allImages[1],
];

const columnD = [
  allImages[7], allImages[4], allImages[0], allImages[5],
  allImages[9], allImages[2], allImages[6], allImages[3],
];

const gridImages = [
  allImages[0], allImages[1], allImages[2],
  allImages[3], allImages[4], allImages[5],
  allImages[6], allImages[7], allImages[8],
];

export default function InstagramSocialFeed() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="relative rounded-[40px] border border-border/40 overflow-hidden w-full flex items-center justify-center"
          style={{ background: "#F2EDE6", height: "760px" }}
        >

          {/* Background Scrolling Columns */}
          <div className="absolute inset-0 flex p-5 gap-3 overflow-hidden">
            {/* Col 1 – scroll UP */}
            <MarqueeColumn images={columnA} duration="38s" direction="up" />
            {/* Col 2 – scroll DOWN */}
            <MarqueeColumn images={columnB} duration="48s" direction="down" />
            {/* middle spacer for card */}
            <div className="hidden lg:block flex-none w-[340px]" />
            {/* Col 3 – scroll UP */}
            <MarqueeColumn images={columnC} duration="43s" direction="up" />
            {/* Col 4 – scroll DOWN */}
            <MarqueeColumn images={columnD} duration="53s" direction="down" />
          </div>

          {/* ── Central Instagram Card ── */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-border/50 w-[330px] flex flex-col gap-4 overflow-hidden p-5">

              {/* Header: logo + stats */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm tracking-tight">RJ</span>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="font-bold text-base leading-tight text-black">2801</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base leading-tight text-black">167K</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Followers</p>
                  </div>
                </div>
              </div>

              {/* 3×3 photo grid */}
              <div className="grid grid-cols-3 gap-[3px] rounded-xl overflow-hidden">
                {gridImages.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden group cursor-pointer bg-[#2C1A0E]">
                    <img
                      src={src}
                      alt={`post ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* play icon on alternate posts */}
                    {i % 2 !== 0 && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 rounded flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Join Instagram button */}
              <Link
                to="#"
                className="flex items-center justify-between bg-gradient-to-r from-[#D8C3A5] to-[#B8955E] text-white rounded-full pl-5 pr-2 py-2 group"
              >
                <span className="text-sm font-medium tracking-wide">Join Us on Instagram</span>
                <span className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center group-hover:bg-white group-hover:text-[#B8955E] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Handle pill */}
            <div className="bg-white rounded-full py-2 px-5 shadow-lg border border-border/50 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">RJ</div>
              <span className="text-sm font-medium text-black">@mohenjewels</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function MarqueeColumn({
  images,
  duration,
  direction,
  className,
}: {
  images: string[];
  duration: string;
  direction: "up" | "down";
  className?: string;
}) {
  // tripled for a longer buffer
  const items = [...images, ...images, ...images];

  return (
    <div className={cn("flex-1 overflow-hidden relative", className)}>
      <div
        className="flex flex-col gap-3"
        style={{
          animation: `marquee-vert-${direction} ${duration} linear infinite`,
        }}
      >
        {items.map((src, i) => (
          <div
            key={i}
            className="shrink-0 rounded-2xl overflow-hidden bg-[#2C1A0E] border-0 shadow-sm"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-vert-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        @keyframes marquee-vert-down {
          0%   { transform: translateY(-33.33%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
