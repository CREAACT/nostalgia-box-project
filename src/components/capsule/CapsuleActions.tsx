import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Image, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapsuleActionsProps {
  date: Date | undefined;
  isSealed: boolean;
  uploading: boolean;
  onDateSelect: (date: Date | undefined) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGiftClick: () => void;
}

export const CapsuleActions = ({
  date,
  isSealed,
  uploading,
  onDateSelect,
  onImageUpload,
  onGiftClick,
}: CapsuleActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={isSealed}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd.MM.yyyy") : "Выберите дату открытия"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        className="flex-shrink-0"
        disabled={isSealed || uploading}
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
          disabled={isSealed || uploading}
        />
        <Image className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="flex-shrink-0"
        disabled={isSealed}
        onClick={onGiftClick}
      >
        <Gift className="w-4 h-4" />
      </Button>
    </div>
  );
};