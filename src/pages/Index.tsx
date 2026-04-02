import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CuratedCollection from "@/components/CuratedCollection";
import PromoBanners from "@/components/PromoBanners";
import LatestCollection from "@/components/LatestCollection";
import SignatureStyles from "@/components/SignatureStyles";
import ProductCarousel from "@/components/ProductCarousel";
import GiftedWithLove from "@/components/GiftedWithLove";
import InDemandBanner from "@/components/InDemandBanner";
import CreatorReels from "@/components/CreatorReels";
import ElegantCollections from "@/components/ElegantCollections";
import InvestmentBanner from "@/components/InvestmentBanner";

import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BudgetShortcuts from "@/components/BudgetShortcuts";
import Testimonials from "@/components/Testimonials";
import InstagramSocialFeed from "@/components/InstagramSocialFeed";

interface IndexProps {
  onOpenLogin?: () => void;
}

export default function Index({ onOpenLogin }: IndexProps) {
  return (
    <div className="min-h-screen bg-background text-[#1a1a1a]">
      <Header onOpenLogin={onOpenLogin} />
      <CartDrawer />
      <WhatsAppFloat />
      <main className="overflow-hidden">
        <HeroSlider />
        <CuratedCollection />
        <PromoBanners />
        <LatestCollection />
        <SignatureStyles />
        <InDemandBanner />
        <GiftedWithLove />
        <ElegantCollections />
        <BudgetShortcuts />
        <ProductCarousel />
        
        <CreatorReels />
        <InvestmentBanner />
        <Testimonials />
        <InstagramSocialFeed />
      </main>
      <Footer />
    </div>
  );
}
