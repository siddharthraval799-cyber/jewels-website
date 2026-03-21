import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const signaturePieces = [
  { id: 1, image: "https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80", span: "col-span-1 border-b border-r" },
  { id: 2, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80", span: "col-span-1 border-b" },
  { id: 3, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80", span: "col-span-1 border-b border-r" },
  { id: 4, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80", span: "col-span-1 border-b" },
  { id: 5, image: "https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80", span: "col-span-1 border-r" },
  { id: 6, image: "https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80", span: "col-span-1" },
];

const SignatureStyles = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
             <div className="w-16 h-[1px] bg-border absolute -left-20 top-1/2"></div>
             <div className="w-6 h-6 border rotate-45 border-border inline-block flex items-center justify-center">
                 <div className="w-2 h-2 bg-primary rounded-full"></div>
             </div>
             <div className="w-16 h-[1px] bg-border absolute -right-20 top-1/2"></div>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-medium text-secondary-foreground mt-4"
          >
            Signature Styles by Rushabh Shah
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-body text-sm mt-3"
          >
            Where vision meets elegance. Discover the art of Rushabh Shah.
          </motion.p>
        </div>

        {/* Two Column Layout (Photo & Rotating Grid) */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Large Image */}
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="w-full relative rounded-2xl overflow-hidden shadow-xl group border border-border/50"
          >
             <img 
               src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" 
               alt="Rushabh Shah Designing" 
               className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                <span className="text-white font-display text-2xl tracking-wider">The Master Artisan</span>
             </div>
          </motion.div>

          {/* Right 3D Rotating Grid elements (mapping to user request "div should rotate") */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 perspective-1000">
            {signaturePieces.map((piece, idx) => (
               <motion.div
                 key={piece.id}
                 initial={{ opacity: 0, rotateY: 90 }}
                 whileInView={{ opacity: 1, rotateY: 0 }}
                 viewport={{ margin: "-100px", once: true }}
                 transition={{ duration: 0.8, delay: idx * 0.15, type: "spring" }}
                 className="relative w-full aspect-square group"
                 // Hover effect triggers a cool 3D rotation flip like requested 
                 whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }}
                 style={{ transformStyle: "preserve-3d" }}
               >
                 <div className="absolute inset-0 rounded-xl overflow-hidden shadow-md bg-secondary/80 border border-border/20 content-center justify-center p-4" style={{ transform: "translateZ(20px)" }}>
                    <img 
                      src={piece.image} 
                      alt="Signature Piece" 
                      className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                    />
                 </div>
               </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SignatureStyles;
