import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CuratedCollection from "@/components/CuratedCollection";
import PromoBanners from "@/components/PromoBanners";
import LatestCollection from "@/components/LatestCollection";
import SignatureStyles from "@/components/SignatureStyles";
import ProductCarousel from "@/components/ProductCarousel";
import GiftedWithLove from "@/components/GiftedWithLove";
import CreatorReels from "@/components/CreatorReels";

import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="overflow-hidden">
        <HeroSlider />
        
        {/* NEWLY ADDED HOMEPAGE BLOCKS */}
        <CuratedCollection />
        <PromoBanners />
        <LatestCollection />
        <SignatureStyles />
        <ProductCarousel />
        <GiftedWithLove />
        <CreatorReels />
        {/* --------------------------- */}
        
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
