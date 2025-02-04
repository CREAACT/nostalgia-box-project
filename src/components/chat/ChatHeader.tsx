import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User } from "lucide-react";

interface ChatHeaderProps {
  avatar?: string;
  name: string;
  username?: string;
  onBack?: () => void;
  onViewProfile: () => void;
  showBackButton?: boolean;
}

export function ChatHeader({
  avatar,
  name,
  username,
  onBack,
  onViewProfile,
  showBackButton,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-accent/50">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      <Avatar className="h-12 w-12 cursor-pointer" onClick={onViewProfile}>
        <AvatarImage src={avatar} />
        <AvatarFallback>
          {username?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 cursor-pointer" onClick={onViewProfile}>
        <h2 className="text-lg font-semibold">
          {name || username}
        </h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onViewProfile}
      >
        <User className="h-5 w-5" />
      </Button>
    </div>
  );
}