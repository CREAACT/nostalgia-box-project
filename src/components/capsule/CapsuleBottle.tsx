import { cn } from "@/lib/utils";

interface CapsuleBottleProps {
  title: string;
  onClick: () => void;
  className?: string;
}

export const CapsuleBottle = ({ title, onClick, className }: CapsuleBottleProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-transform hover:scale-105",
        className
      )}
    >
      <div className="relative w-24 h-32 mx-auto">
        {/* Bottle neck */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-emerald-500/80 dark:bg-emerald-600/80 rounded-t-lg" />
        
        {/* Bottle body */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-emerald-500/80 dark:bg-emerald-600/80 rounded-lg">
          {/* Paper scroll inside */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-16 bg-amber-50 dark:bg-amber-100 rounded shadow-inner transform rotate-3 flex items-center justify-center p-2">
            <div className="text-xs text-center text-gray-600 line-clamp-2">
              {title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};