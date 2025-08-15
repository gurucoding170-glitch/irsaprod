import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MobileContainer } from "@/components/ui/mobile-container";
import { Header } from "@/components/ui/header";
import { BottomNav } from "@/components/ui/bottom-nav";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (term: string) => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("id, name, price, original_price, rating, reviews_count, image_url, discount")
      .order("created_at", { ascending: false })
      .limit(50);
    if (term) query = query.ilike("name", `%${term}%`);
    const { data } = await query;
    setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(q);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q });
    fetchProducts(q);
  };

  return (
    <MobileContainer className="pb-20">
      <Header showBack />
      <main className="px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold text-foreground">Search</h1>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded border px-3 py-2 bg-background text-foreground"
          />
          <button className="px-4 py-2 rounded bg-primary text-primary-foreground">Find</button>
        </form>
        {loading ? (
          <p className="text-muted-foreground text-sm">Searching...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="p-3 bg-card rounded-lg shadow-card">
                <img className="w-full h-32 object-cover rounded" src={p.image_url ?? "https://via.placeholder.com/300"} alt={p.name} loading="lazy" />
                <p className="text-sm mt-2 font-medium text-foreground line-clamp-2">{p.name}</p>
                <p className="text-xs text-muted-foreground">Rs. {Number(p.price).toLocaleString()}</p>
              </div>
            ))}
            {products.length === 0 && <p className="text-muted-foreground text-sm">No products found.</p>}
          </div>
        )}
      </main>
      <BottomNav activeTab="search" />
    </MobileContainer>
  );
};

export default Search;
