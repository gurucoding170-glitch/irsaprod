import { 
  Smartphone, 
  Shirt, 
  ShoppingBag, 
  Home, 
  Car, 
  Baby, 
  Heart, 
  Gamepad2 
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Electronics", slug: "electronics", icon: Smartphone, color: "bg-gradient-primary" },
  { id: 2, name: "Fashion", slug: "fashion", icon: Shirt, color: "bg-gradient-secondary" },
  { id: 3, name: "Grocery", slug: "grocery", icon: ShoppingBag, color: "bg-gradient-primary" },
  { id: 4, name: "Home", slug: "home", icon: Home, color: "bg-gradient-secondary" },
  { id: 5, name: "Automotive", slug: "automotive", icon: Car, color: "bg-gradient-primary" },
  { id: 6, name: "Baby & Kids", slug: "baby-kids", icon: Baby, color: "bg-gradient-secondary" },
  { id: 7, name: "Health", slug: "health", icon: Heart, color: "bg-gradient-primary" },
  { id: 8, name: "Gaming", slug: "gaming", icon: Gamepad2, color: "bg-gradient-secondary" },
];

export const CategoryGrid = () => {
  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Shop by Category</h2>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="flex flex-col items-center p-3 rounded-xl bg-card shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
              aria-label={`Browse ${category.name}`}
            >
              <div className={`${category.color} p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-center leading-tight text-foreground">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};