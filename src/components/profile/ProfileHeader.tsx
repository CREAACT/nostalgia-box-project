import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, Edit, Share2, Award, Medal, FileText, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfileHeaderProps {
  profile: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  session: any;
}

export function ProfileHeader({ profile, isEditing, setIsEditing, session }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Выход выполнен успешно",
        description: "Вы успешно вышли из системы",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{profile?.username || "Пользователь"}</h2>
            <p className="text-sm text-muted-foreground">
              Рейтинг: {profile?.rating || 0} • Ранг: {profile?.rank || "Новичок"}
            </p>
            <p className="text-sm text-muted-foreground">
              Статус: {profile?.status || "Активный участник"}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="animate-fade-in">
              <Settings className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Мой профиль</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="w-4 h-4 mr-2" />
              Просмотр профиля
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Отменить редактирование" : "Редактировать профиль"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/achievements")}>
              <Award className="w-4 h-4 mr-2" />
              Мои достижения
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/certificates")}>
              <FileText className="w-4 h-4 mr-2" />
              Сертификаты
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/history")}>
              <History className="w-4 h-4 mr-2" />
              История участия
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться профилем
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}