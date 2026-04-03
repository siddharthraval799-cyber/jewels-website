import { motion } from "framer-motion";

const artisanImage = "/-my-gem-websit/images/artisan-master.jpg";

const col1Images = [
  "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F1%2F21%2F1%2F1768998617531-ag22-767---g-82.460----n-76.360----42310-rjp.jpg&w=1080&q=75",
  "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F1%2F17%2F1%2F1768660639385-akd22-59---g-34.290-----n-31.640----9885-rjp.jpg&w=1080&q=75",
];

const col2Images = [
  "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F2%2F2%2F1%2F1770028654820-ansn22-2125----g-126.830----n-101.160----87990----anst22-2125----g-34.710----n-26.380----27315-rjp.jpg&w=1080&q=75",
  "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F2%2F2%2F1%2F1770021099924-ansn22-990----g-145.800-----n-118.900-----55380-rjp.jpg&w=1080&q=75",
];

const col3Images = [
  "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F2%2F2%2F15%2F1770030769700-ansn22-2255---g-97.770--n-62.040--120825---anst22-2255--g-28.380--n-22.370--37655-rjp.jpg&w=1080&q=75",
  "https://www.rushabhjewel.com/_next/image?url=https%3A%2F%2Fcdn.rushabhjewel.com%2Fimg%2F2026%2F2%2F2%2F15%2F1770029211978-ansn22-2251----g-61.140-----n-54.230------11340-----anst22-2251---g-22.740----n-19.460------4995-rjp.jpg&w=1080&q=75",
];

// Duplicate items twice to create a seamless infinite scroll
// For seamless scroll from 0 to 50%, the DOM element needs to contain two exact sets of the list so when it translates up by half its height, it looks identical to the start state.
const ColumnMarquee = ({ images, direction }: { images: string[], direction: 'up' | 'down' }) => {
  const repeatedImages = [...images, ...images, ...images, ...images]; // ensure it's tall enough

  return (
    <div className="relative h-full overflow-hidden rounded-xl">
      <div className={`flex flex-col gap-4 ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}`}>
        {repeatedImages.map((src, idx) => (
          <div key={idx} className="w-full aspect-square rounded-xl overflow-hidden shadow-sm bg-secondary/10 border border-border/20 flex-shrink-0">
            <img
              src={src}
              alt="Signature Jewelry"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SignatureStyles = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Left Side: Artisan Info and Image */}
          <div className="flex flex-col">
            <div className="mb-8 pl-4 lg:pl-8 border-l-2 border-primary/40">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-display font-medium text-secondary-foreground"
              >
                Signature Styles by Rushabh Shah
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground font-body text-base mt-4"
              >
                Where vision meets elegance. Discover the art of Rushabh Shah.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative rounded-2xl overflow-hidden shadow-2xl mt-auto bg-stone-900/40 border border-white/10 flex items-center justify-center"
            >
              <img
                src={artisanImage}
                alt="The Master Artisan"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                <span className="text-white font-display text-3xl italic tracking-wider">The Master Artisan</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: 3 Animated Columns */}
          <div className="h-[600px] lg:h-[800px] grid grid-cols-3 gap-4 lg:gap-6 overflow-hidden relative rounded-2xl p-2 bg-gradient-to-b from-transparent via-secondary/5 to-transparent">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>

            <ColumnMarquee images={col1Images} direction="up" />
            <ColumnMarquee images={col2Images} direction="down" />
            <ColumnMarquee images={col3Images} direction="up" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default SignatureStyles;
