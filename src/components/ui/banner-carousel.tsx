import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import heroBanner from "@/assets/hero-banner.jpg";

const banners = [
  {
    id: 1,
    image: heroBanner,
    title: "Flash Sale 50% Off",
    subtitle: "Electronics & Fashion"
  },
  {
    id: 2,
    image: heroBanner,
    title: "Free Delivery",
    subtitle: "On orders above Rs. 1500"
  },
  {
    id: 3,
    image: heroBanner,
    title: "New Arrivals",
    subtitle: "Trending products just for you"
  }
];

export const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative overflow-hidden rounded-lg mx-4 mb-6 shadow-card">
      <div 
        className="flex transition-transform duration-500 ease-smooth"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative">
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                <p className="text-white/90">{banner.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};