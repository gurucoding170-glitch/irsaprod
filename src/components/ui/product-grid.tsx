import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addToCart } from "@/lib/cart";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Data fetching moved inside component

export const ProductGrid = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, original_price, rating, reviews_count, image_url, discount")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  const products = (data ?? []).map((p: any) => ({
    id: p.id as string,
    name: p.name as string,
    price: Number(p.price),
    originalPrice: p.original_price != null ? Number(p.original_price) : undefined,
    rating: p.rating ?? 0,
    reviews: p.reviews_count ?? 0,
    image: p.image_url ?? "https://via.placeholder.com/300x300?text=Product",
    discount: p.discount ?? (p.original_price ? Math.max(0, Math.round(100 - (Number(p.price) / Number(p.original_price)) * 100)) : undefined),
    isWishlisted: false,
  }));

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
        <Button variant="ghost" className="text-primary text-sm" onClick={() => navigate('/search')}>
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 animate-pulse bg-card rounded-lg h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="product-card p-3 group">
              <div className="relative mb-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg"
                  loading="lazy"
                />
                
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-secondary text-white text-xs">
                    -{product.discount}%
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-2 right-2 w-8 h-8 ${
                    product.isWishlisted 
                      ? 'text-secondary bg-white shadow-sm' 
                      : 'text-muted-foreground bg-white/80 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${product.isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="price-text text-base">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground text-xs line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-gradient-primary hover:bg-primary/90 text-white shadow-sm group-hover:shadow-glow transition-all duration-300"
                  onClick={async () => {
                    try {
                      await addToCart(product.id as string);
                      toast({ title: "Added to cart" });
                    } catch (e: any) {
                      toast({ title: "Action required", description: e.message, variant: "destructive" });
                    }
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};