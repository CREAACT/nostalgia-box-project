import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CapsuleBottleProps {
  title: string;
  openDate: string;
  onClick: () => void;
  className?: string;
}

export const CapsuleBottle = ({ title, openDate, onClick, className }: CapsuleBottleProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-transform hover:scale-105 relative",
        className
      )}
    >
      <div className="relative w-24 h-40 mx-auto">
        {/* Bottle */}
        <div className="absolute inset-0">
          {/* Bottle neck */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-10 bg-emerald-500/40 dark:bg-emerald-600/40 rounded-t-lg">
            {/* Cork */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-3 bg-amber-800 rounded-t-lg" />
          </div>
          
          {/* Bottle body */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-emerald-500/40 dark:bg-emerald-600/40 rounded-lg">
            {/* Glass shine effect */}
            <div className="absolute top-0 left-1 w-1 h-full bg-white/20 rounded-full transform -rotate-12" />
            
            {/* Paper scroll inside */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-20 bg-amber-50 dark:bg-amber-100 rounded shadow-inner transform rotate-3">
              {/* Paper texture */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-100/50 to-transparent" />
              {/* Paper edges */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-50 dark:bg-amber-100 rounded-t-lg transform -translate-y-1" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-50 dark:bg-amber-100 rounded-b-lg transform translate-y-1" />
              
              <div className="text-xs text-center text-gray-600 p-2 line-clamp-2">
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Open date display */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
        Opens: {format(new Date(openDate), "dd.MM.yyyy")}
      </div>
    </div>
  );
};