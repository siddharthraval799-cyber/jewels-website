import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, Share2, Minus, Plus, ChevronRight, MessageCircle, Loader2, X, Scale, Video, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { calculatePrice, getProductById } from "@/data/products";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import VideoCallModal from "@/components/VideoCallModal";
import ProductCarousel from "@/components/ProductCarousel";
import { getProductsByCategory } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { rates } = useGoldRates();
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const mainCtaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
       setLoading(true);
       api.products.get(id)
         .then(res => {
            setProduct(res.product);
            // Fetch related products
            const related = getProductsByCategory(res.product.category)
              .filter(p => p.id !== id)
              .slice(0, 8);
            setRelatedProducts(related as unknown as Product[]);
         })
         .catch(err => {
            console.error("API failed, falling back to static data:", err);
            const staticProduct = getProductById(id);
            if (staticProduct) {
              setProduct(staticProduct as Product);
              const related = getProductsByCategory(staticProduct.category)
                .filter(p => p.id !== id)
                .slice(0, 8);
              setRelatedProducts(related as unknown as Product[]);
            } else {
              setProduct(null);
            }
         })
         .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow !== showStickyBar) {
        setShowStickyBar(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showStickyBar]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="font-display text-2xl text-foreground/50">Product Not Found</h2>
            <Link to="/products" className="text-primary text-sm font-body mt-3 inline-block hover:underline">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const price = product.price 
    ? { metalCost: 0, makingCharges: 0, gst: 0, total: product.price }
    : calculatePrice(product.weight, product.makingCharges, rates.gold22k);

  const handleWhatsAppBuy = () => {
    const msg = `Hi, I'm interested in buying "${product.name}" (${product.weight}g, ₹${price.total.toLocaleString("en-IN")}). Please share more details.`;
    window.open(`https://wa.me/916356647453?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="bg-white py-2 border-b border-border/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-primary">Product</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Media Section: 2x2 Grid (3 Photos + 1 Video) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-2 md:gap-3"
          >
            {/* Slot 1: Primary (Video or Image 0) */}
            <div 
              className="aspect-[4/5] bg-[#F8F9FA] border border-border/40 overflow-hidden relative group rounded-lg shadow-sm cursor-zoom-in"
              onClick={() => {
                if (product.videoUrl) setSelectedMedia({ url: product.videoUrl, type: 'video' });
                else if (product.images?.[0]) setSelectedMedia({ url: product.images[0], type: 'image' });
              }}
            >
               {product.videoUrl ? (
                 <video 
                   src={product.videoUrl} 
                   className="w-full h-full object-cover" 
                   autoPlay muted loop playsInline
                 />
               ) : product.images?.[0] ? (
                 <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">💎</div>
               )}
               {product.videoUrl && (
                 <div className="absolute top-2 left-2">
                   <div className="bg-black/50 backdrop-blur-md text-white text-[8px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                      Live
                   </div>
                 </div>
               )}
            </div>

            {/* Slots 2-4: Photos */}
            {[0, 1, 2].map((idx) => {
              // If video is in slot 1, these take images 0, 1, 2.
              // If NO video, slot 1 takes image 0, so these take images 1, 2, 3.
              const imgIdx = product.videoUrl ? idx : idx + 1;
              const img = product.images?.[imgIdx];

              return (
                <div 
                  key={idx} 
                  className="aspect-[4/5] bg-white border border-border/40 overflow-hidden relative rounded-lg shadow-sm hover:border-primary/20 transition-colors cursor-zoom-in"
                  onClick={() => img && setSelectedMedia({ url: img, type: 'image' })}
                >
                   {img ? (
                     <img src={img} alt={`${product.name} view ${idx + 2}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10 grayscale bg-[#F8F9FA] text-3xl font-light">
                        {idx === 0 ? "✨" : idx === 1 ? "📿" : "💍"}
                     </div>
                   )}
                </div>
              );
            })}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header Info: Title & Price */}
            <Card className="p-6 border-none shadow-sm bg-[#FFFBF7]/50 backdrop-blur-sm">
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-foreground">₹{price.total.toLocaleString("en-IN")}</span>
                </div>
                <h1 className="text-sm md:text-base text-muted-foreground font-body">{product.name}</h1>
              </div>

              <div className="bg-[#F8F9FA] rounded-lg p-3 flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E5B80B] to-[#B8860B] shadow-inner" />
                  <span className="text-xs font-medium text-foreground">Yellow</span>
                </div>
                <div className="w-[1px] h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">22 Karat</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                  className="flex-1 bg-[#8B5E3C] hover:bg-[#734A2F] text-white h-12 rounded-lg text-xs font-bold tracking-[0.1em] uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO CART
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-12 w-12 rounded-lg border-border hover:bg-primary/5 hover:text-primary transition-all p-0">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-lg border-border hover:bg-primary/5 hover:text-primary transition-all p-0">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Weight Card */}
            <Card className="p-6 border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center">
                   <img src="https://cdn-icons-png.flaticon.com/512/1043/1043422.png" className="w-5 h-5 grayscale opacity-60" alt="weight" />
                </div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight</h3>
              </div>
              <div className="w-full py-4 px-6 border border-[#E9ECEF] rounded-xl bg-[#F8F9FA] flex items-center justify-center shadow-sm">
                <span className="font-display text-base font-bold text-foreground/80">{product.weight} GM</span>
              </div>
            </Card>

            {/* Live Video Call Card */}
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden group cursor-pointer" onClick={() => setShowVideoModal(true)}>
               <div className="flex items-center">
                  <div className="w-1/3 aspect-[4/5] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400" 
                      alt="Review call" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="w-2/3 p-6 flex flex-col justify-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                         <h3 className="font-display text-base font-semibold text-foreground">Live Video Call</h3>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Join a live video call with our consultants to see your favourite designs up close!
                      </p>
                    </div>
                    <Button variant="secondary" className="w-full rounded-full bg-[#F3EFEA] hover:bg-[#E9E4DE] text-foreground border-none text-[10px] font-bold tracking-wider uppercase h-10">
                      Schedule Your Video Chat
                    </Button>
                  </div>
               </div>
            </Card>

            {/* COD Check Card */}
            <Card className="p-6 border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-muted-foreground opacity-60" />
                </div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Check Availability For COD Orders</h3>
              </div>
              <div className="flex gap-2 relative">
                <Input 
                  placeholder="Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="rounded-xl h-12 border-border focus:ring-primary/20 bg-white"
                />
                <Button 
                  onClick={() => {
                    if (pincode.length === 6) {
                      setPincodeStatus('checking');
                      setTimeout(() => setPincodeStatus('available'), 1000);
                    }
                  }}
                  className="rounded-xl h-12 px-6 bg-[#AD8B73] hover:bg-[#8B5E3C] text-white border-none font-bold text-[10px] uppercase tracking-wider"
                >
                  {pincodeStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check Availability"}
                </Button>
              </div>
              {pincodeStatus === 'available' && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3" /> Delivery available for {pincode}!
                </motion.p>
              )}
            </Card>

            {/* Trust Logos */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-none shadow-sm bg-white/50 flex flex-col items-center justify-center text-center gap-3">
                 <div className="w-12 h-12 relative grayscale group-hover:grayscale-0 transition-all">
                    <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=100" alt="BIS Logo" className="w-full h-full object-contain mix-blend-multiply" />
                 </div>
                 <div className="space-y-0.5">
                    <p className="font-bold text-[10px] uppercase tracking-tighter">BIS</p>
                    <p className="text-[8px] text-muted-foreground uppercase leading-none">Hallmarked Jewellery</p>
                 </div>
              </Card>
              <Card className="p-4 border-none shadow-sm bg-white/50 flex flex-col items-center justify-center text-center gap-3">
                 <div className="w-10 h-10 flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-4 border-yellow-500/20 flex items-center justify-center text-yellow-600 font-black text-[8px] leading-tight text-center px-1 bg-yellow-50">100% MONEY BACK</div>
                 </div>
                 <div className="space-y-0.5">
                    <p className="font-bold text-[10px] uppercase tracking-tighter">Buyback Guarantee</p>
                    <p className="text-[8px] text-muted-foreground uppercase leading-none">T&C Apply</p>
                 </div>
              </Card>
            </div>

            {/* Tabs & Details */}
            <Tabs defaultValue="details" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-xl p-1 h-12">
                <TabsTrigger value="details" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Product Details</TabsTrigger>
                <TabsTrigger value="price" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Price Breakup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <Card className="border border-border/40 overflow-hidden bg-white/30 backdrop-blur-sm shadow-none rounded-xl">
                  <div className="p-4 border-b border-border/40">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {product.description}
                    </p>
                  </div>
                  <Accordion type="single" collapsible className="w-full px-4" defaultValue="general">
                    <AccordionItem value="general" className="border-border/40">
                      <AccordionTrigger className="hover:no-underline font-display text-sm">General</AccordionTrigger>
                      <AccordionContent>
                         <div className="grid grid-cols-2 gap-y-4 py-2">
                           <div>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Design Code</p>
                             <p className="text-xs font-bold">{product.id.split('-').pop()?.toUpperCase() || "GLUM-01"}</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Net Weight</p>
                             <p className="text-xs font-bold">{product.weight}g</p>
                           </div>
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="gold" className="border-border/40">
                      <AccordionTrigger className="hover:no-underline font-display text-sm">Gold Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-3 gap-y-4 py-2">
                           <div>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Purity</p>
                             <p className="text-xs font-bold">22 Karat</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Weight</p>
                             <p className="text-xs font-bold">{product.weight}g</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-muted-foreground uppercase font-semibold">Colour</p>
                             <p className="text-xs font-bold">Yellow</p>
                           </div>
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </TabsContent>

              <TabsContent value="price" className="mt-4">
                <Card className="border border-border/40 bg-white/30 backdrop-blur-sm shadow-none rounded-xl p-6 space-y-4">
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">Gold ({product.weight}g × ₹{rates.gold22k.toLocaleString()})</span>
                     <span className="font-bold">₹{price.metalCost.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">Making Charges</span>
                     <span className="font-bold">₹{price.makingCharges.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-muted-foreground">GST (3%)</span>
                     <span className="font-bold">₹{price.gst.toLocaleString()}</span>
                   </div>
                   <div className="pt-4 border-t border-border flex justify-between items-center">
                     <span className="text-sm font-bold">Total Payable</span>
                     <span className="text-lg font-display font-bold text-primary">₹{price.total.toLocaleString()}</span>
                   </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Bottom Certification Badges */}
            <div className="flex items-center gap-6 pt-4 border-t border-border/40">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                   <ShieldCheck className="w-4 h-4 text-green-600" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold leading-none mb-0.5">100% Payment Secure</p>
                   <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Your Security, Our Priority</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                   <CheckCircle2 className="w-4 h-4 text-green-600" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold leading-none mb-0.5">100% Certified</p>
                   <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Authentic Jewellery</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] bg-white/80 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] py-3 px-4"
          >
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <div className="w-12 h-12 bg-cream flex items-center justify-center border border-border/50 rounded-lg overflow-hidden">
                   {product.images?.[0] ? (
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-xl">💎</span>
                   )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground truncate max-w-[200px] capitalize">{product.name}</h4>
                  <p className="text-xs text-primary font-bold">₹{price.total.toLocaleString("en-IN")}</p>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-lg border-none bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setShowVideoModal(true)}
                >
                  <Video className="w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-11 px-8 rounded-lg border-border text-[11px] font-bold uppercase tracking-wider bg-[#F8F9FA] hover:bg-white transition-colors"
                  onClick={handleWhatsAppBuy}
                >
                  BUY NOW
                </Button>

                <Button 
                  onClick={() => addToCart(product)}
                  className="flex-1 sm:flex-initial sm:w-48 bg-[#8B5E3C] hover:bg-[#734A2F] text-white h-11 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                >
                  ADD TO CART
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoCallModal 
        isOpen={showVideoModal} 
        onClose={() => setShowVideoModal(false)} 
        productName={product.name}
      />

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full border border-white/10 z-[1101]"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.url} 
                  className="max-h-[90vh] max-w-full rounded-lg shadow-2xl" 
                  controls autoPlay
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt="Full preview" 
                  className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl" 
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <ProductCarousel 
          title={`More Items\nYou'll Love`} 
          subtitle="Hand-picked designs that perfectly complement your choice."
          products={relatedProducts}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
