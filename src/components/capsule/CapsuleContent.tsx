import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CapsuleContentProps {
  title: string;
  message: string;
  imageUrl: string;
  isSealed: boolean;
  onTitleChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}

export const CapsuleContent = ({
  title,
  message,
  imageUrl,
  isSealed,
  onTitleChange,
  onMessageChange,
}: CapsuleContentProps) => {
  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Изображение капсулы"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Input
        placeholder="Название капсулы"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        disabled={isSealed}
        className="bg-white/50"
      />

      <Textarea
        placeholder="Ваше сообщение будущему..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        disabled={isSealed}
        className={cn(
          "min-h-[150px] bg-white/50",
          isSealed && "animate-fade-age"
        )}
      />
    </div>
  );
};