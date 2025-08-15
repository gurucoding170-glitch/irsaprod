import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MobileContainer } from "@/components/ui/mobile-container";
import { Header } from "@/components/ui/header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Cart = () => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    // Ensure cart exists
    const { data: existing } = await supabase.from("carts").select("id").eq("user_id", userId).maybeSingle();
    let cid = existing?.id as string | undefined;
    if (!cid) {
      const { data: inserted, error } = await supabase.from("carts").insert({ user_id: userId }).select("id").single();
      if (error) {
        toast({ title: "Cart error", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      cid = inserted.id as string;
    }
    setCartId(cid);

    const { data, error } = await supabase
      .from("cart_items")
      .select("id, quantity, products:product_id(id, name, price, image_url)")
      .eq("cart_id", cid);
    if (error) {
      toast({ title: "Cart error", description: error.message, variant: "destructive" });
    }
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.products?.price ?? 0) * (it.quantity ?? 1), 0);
  }, [items]);

  const changeQty = async (itemId: string, next: number) => {
    if (next <= 0) {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
      if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("cart_items").update({ quantity: next }).eq("id", itemId);
      if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    fetchCart();
  };

  return (
    <MobileContainer className="pb-20">
      <Header showBack />
      <main className="px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold text-foreground">Your Cart</h1>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : !cartId ? (
          <p className="text-muted-foreground text-sm">Please log in to view your cart.</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your cart is empty.</p>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center bg-card p-3 rounded-lg shadow-card">
                <img src={it.products?.image_url ?? "https://via.placeholder.com/64"} alt={it.products?.name} className="w-16 h-16 rounded object-cover" loading="lazy" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{it.products?.name}</p>
                  <p className="text-xs text-muted-foreground">Rs. {Number(it.products?.price ?? 0).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => changeQty(it.id, (it.quantity ?? 1) - 1)}>-</Button>
                    <span className="text-sm">{it.quantity ?? 1}</span>
                    <Button size="sm" variant="outline" onClick={() => changeQty(it.id, (it.quantity ?? 1) + 1)}>+</Button>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => changeQty(it.id, 0)}>Remove</Button>
              </div>
            ))}

            <div className="flex items-center justify-between p-3 bg-card rounded-lg shadow-card">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-price">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </main>
      <BottomNav activeTab="cart" />
    </MobileContainer>
  );
};

export default Cart;
