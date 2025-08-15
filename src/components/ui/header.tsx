import { Search, ShoppingCart, User, Bell, ArrowLeft } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface HeaderProps {
  cartCount?: number;
  showBack?: boolean;
}

export const Header = ({ cartCount = 0, showBack = false }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-50 bg-gradient-primary shadow-elegant">
      <div className="flex items-center gap-3 p-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => {
  if (window.history.state && window.history.state.idx > 0) {
    navigate(-1);
  } else {
    navigate("/");
  }
}}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-white/90 border-none shadow-sm"
            onFocus={() => navigate('/search')}
            readOnly
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20" 
            onClick={() => toast({ title: "No notifications", description: "You're all caught up!" })}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-secondary text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
