import { supabase } from "@/integrations/supabase/client";

export const getOrCreateCartId = async (userId: string) => {
  const { data: existing, error: selErr } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (selErr) throw new Error(selErr.message);
  if (existing?.id) return existing.id as string;

  const { data: inserted, error: insErr } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (insErr) throw new Error(insErr.message);
  return inserted.id as string;
};

export const addToCart = async (productId: string) => {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  const userId = userData.user?.id;
  if (!userId) {
    throw new Error("Please login to add items to your cart.");
  }

  const cartId = await getOrCreateCartId(userId);

  // Check if item exists
  const { data: existingItem, error: itemSelErr } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();
  if (itemSelErr) throw new Error(itemSelErr.message);

  if (existingItem?.id) {
    const { error: updErr } = await supabase
      .from("cart_items")
      .update({ quantity: (existingItem.quantity ?? 1) + 1 })
      .eq("id", existingItem.id);
    if (updErr) throw new Error(updErr.message);
  } else {
    const { error: insErr } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, quantity: 1 });
    if (insErr) throw new Error(insErr.message);
  }
};

export const getCartCount = async (): Promise<number> => {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) return 0;
  const userId = userData.user?.id;
  if (!userId) return 0;

  const { data: existing, error: selErr } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (selErr || !existing?.id) return 0;

  const { data: items, error: itemsErr } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", existing.id);

  if (itemsErr || !items) return 0;
  return (items as any[]).reduce((sum, i) => sum + (i.quantity ?? 0), 0);
};

