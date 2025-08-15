import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Data will be fetched from Supabase

export const FlashSale = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const { data: saleData, isLoading } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, original_price, discount, image_url, stock")
        .gt("stock", 0)
        .order("discount", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const flashProducts = (saleData ?? []).map((p: any) => ({
    id: p.id as string,
    name: p.name as string,
    originalPrice: p.original_price != null ? Number(p.original_price) : Number(p.price),
    salePrice: Number(p.price),
    discount: p.discount ?? (p.original_price ? Math.max(0, Math.round(100 - (Number(p.price) / Number(p.original_price)) * 100)) : 0),
    image: p.image_url ?? "https://via.placeholder.com/200x200?text=Sale",
    stock: p.stock ?? 0,
  }));

  return (
    <div className="px-4 mb-6">
      <div className="bg-gradient-secondary rounded-xl p-4 shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Flash Sale</h2>
              <p className="text-white/80 text-sm">Limited time offers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-white">
            <div className="bg-white/20 px-2 py-1 rounded text-sm font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-1 rounded text-sm font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-1 rounded text-sm font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {flashProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 bg-white rounded-lg p-3 shadow-card min-w-[140px]">
              <div className="relative mb-2">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <Badge className="absolute top-1 left-1 bg-secondary text-white text-xs">
                  -{product.discount}%
                </Badge>
              </div>
              
              <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-price font-bold text-sm">
                    Rs. {product.salePrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">
                  {product.stock} left
                </p>
              </div>
            </div>
          ))}
          
          <Button 
            variant="ghost" 
            className="flex-shrink-0 text-white hover:bg-white/20 flex flex-col items-center justify-center min-w-[100px] h-auto py-4"
            onClick={() => navigate('/search')}
          >
            <ArrowRight className="w-6 h-6 mb-1" />
            <span className="text-xs">View All</span>
          </Button>
        </div>
      </div>
    </div>
  );
};