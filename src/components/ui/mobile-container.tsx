import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export const MobileContainer = ({ children, className }: MobileContainerProps) => {
  return (
    <div className={cn("mobile-container", className)}>
      {children}
    </div>
  );
};