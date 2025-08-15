import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MobileContainer } from "@/components/ui/mobile-container";
import { Header } from "@/components/ui/header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ProductGrid } from "@/components/ui/product-grid";

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data } = await supabase.from("categories").select("id, name, slug").eq("slug", slug).maybeSingle();
      setCategory(data ?? null);
    };
    load();
  }, [slug]);

  return (
    <MobileContainer className="pb-20">
      <Header showBack />
      <main className="px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold text-foreground">{category?.name ?? "Category"}</h1>
        {!category ? (
          <p className="text-muted-foreground text-sm">No such category or not created yet.</p>
        ) : (
          // Reuse ProductGrid as a general grid soon; for now a simple query here would be better.
          <CategoryProducts categoryId={category.id} />
        )}
      </main>
      <BottomNav activeTab="home" />
    </MobileContainer>
  );
};

const CategoryProducts = ({ categoryId }: { categoryId: string }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, original_price, rating, reviews_count, image_url, discount")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });
      setProducts(data ?? []);
    };
    load();
  }, [categoryId]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm">No products found in this category.</p>
      ) : (
        products.map((p) => (
          <div key={p.id} className="p-3 bg-card rounded-lg shadow-card">
            <img className="w-full h-32 object-cover rounded" src={p.image_url ?? "https://via.placeholder.com/300"} alt={p.name} loading="lazy" />
            <p className="text-sm mt-2 font-medium text-foreground line-clamp-2">{p.name}</p>
            <p className="text-xs text-muted-foreground">Rs. {Number(p.price).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Category;
