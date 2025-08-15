import { useState, useEffect } from "react";
import { MobileContainer } from "@/components/ui/mobile-container";
import { SplashScreen } from "@/components/ui/splash-screen";
import { Header } from "@/components/ui/header";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import { CategoryGrid } from "@/components/ui/category-grid";
import { FlashSale } from "@/components/ui/flash-sale";
import { ProductGrid } from "@/components/ui/product-grid";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getCartCount } from "@/lib/cart";

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => sessionStorage.getItem('splashDone') !== '1');
  const [activeTab, setActiveTab] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  // Load cart count once on app load - MUST be before any conditional returns
  useEffect(() => {
    let mounted = true;
    getCartCount()
      .then((count) => {
        if (mounted) setCartCount(count);
      })
      .catch(() => {
        if (mounted) setCartCount(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          sessionStorage.setItem('splashDone', '1');
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <MobileContainer className="pb-20">
      <Header cartCount={cartCount} />
      
      <main className="animate-fade-in">
        <BannerCarousel />
        <CategoryGrid />
        <FlashSale />
        <ProductGrid />
      </main>

      <BottomNav 
        activeTab={activeTab} 
        cartCount={cartCount}
        onTabChange={setActiveTab}
      />
    </MobileContainer>
  );
};

export default Index;
