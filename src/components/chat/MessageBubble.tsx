import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
  timestamp: string;
  status?: "sent" | "read" | "error";
}

export function MessageBubble({ content, isCurrentUser, timestamp, status }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex animate-fade-in",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-lg shadow-sm space-y-1",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-accent rounded-bl-sm"
        )}
      >
        <p className="break-words text-sm">{content}</p>
        <div className="flex justify-between items-center text-xs opacity-70">
          <span>{format(new Date(timestamp), "HH:mm")}</span>
          {isCurrentUser && status === "sent" && (
            <span className="ml-2">Отправлено</span>
          )}
          {isCurrentUser && status === "read" && (
            <span className="ml-2">Прочитано</span>
          )}
          {isCurrentUser && status === "error" && (
            <span className="ml-2 text-destructive">Ошибка</span>
          )}
        </div>
      </div>
    </div>
  );
}