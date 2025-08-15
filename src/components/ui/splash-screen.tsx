import { useEffect, useState } from "react";
import { MobileContainer } from "./mobile-container";
import irsaLogo from "@/assets/irsa-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <MobileContainer className={`flex items-center justify-center bg-gradient-hero transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-fade-in">
        <div className="mb-8 animate-pulse-gentle">
          <img 
            src={irsaLogo} 
            alt="Irsa Traders Logo" 
            className="w-32 h-32 mx-auto mb-4 drop-shadow-glow"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Irsa Traders</h1>
        <p className="text-white/80 text-lg">Your Trusted Shopping Partner</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </MobileContainer>
  );
};