import { format } from "date-fns";
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
        "flex animate-fade-in w-full",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] p-4 rounded-lg shadow-sm space-y-2",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-accent rounded-bl-sm"
        )}
      >
        <p className="break-words text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        <div className="flex justify-between items-center text-xs opacity-70 mt-1">
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