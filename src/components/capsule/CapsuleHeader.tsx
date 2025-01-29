import { Button } from "@/components/ui/button";
import { Lock, Unlock, Archive } from "lucide-react";

interface CapsuleHeaderProps {
  title: string;
  isSealed: boolean;
  onSealToggle: () => void;
}

export const CapsuleHeader = ({ title, isSealed, onSealToggle }: CapsuleHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Archive className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Капсула времени</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSealToggle}
      >
        {isSealed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
      </Button>
    </div>
  );
};