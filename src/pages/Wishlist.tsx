import { MobileContainer } from "@/components/ui/mobile-container";
import { Header } from "@/components/ui/header";
import { BottomNav } from "@/components/ui/bottom-nav";

const Wishlist = () => {
  return (
    <MobileContainer className="pb-20">
      <Header showBack />
      <main className="px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold text-foreground">Wishlist</h1>
        <p className="text-muted-foreground text-sm">Wishlist coming soon.</p>
      </main>
      <BottomNav activeTab="wishlist" />
    </MobileContainer>
  );
};

export default Wishlist;
