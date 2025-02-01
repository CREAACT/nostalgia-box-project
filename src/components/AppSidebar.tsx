import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogOut, Settings, Star, User, List, History, MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";

export function AppSidebar() {
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

  const menuItems = [
    {
      title: "Профиль",
      icon: User,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Мои капсулы",
      icon: List,
      onClick: () => navigate("/"),
    },
    {
      title: "Избранные капсулы",
      icon: Star,
      onClick: () => navigate("/favorites"),
    },
    {
      title: "Хроники",
      icon: History,
      onClick: () => navigate("/chronicles"),
    },
    {
      title: "Сообщения",
      icon: MessageSquare,
      onClick: () => navigate("/messages"),
    },
    {
      title: "Друзья",
      icon: Users,
      onClick: () => navigate("/friends"),
    },
    {
      title: "Настройки",
      icon: Settings,
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Выйти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}