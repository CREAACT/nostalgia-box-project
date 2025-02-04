import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="p-4 border-t bg-background">
      <div className="flex gap-2 items-center max-w-3xl mx-auto">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          className="flex-1"
        />
        <Button onClick={onSend}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}