import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

export default function Settings({ session }: { session: any }) {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "ru");
  const [username, setUsername] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  const handleUpdateUsername = async () => {
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", session.user.id)
        .single();

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Это имя пользователя уже занято. Пожалуйста, выберите другое.",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Имя успешно обновлено",
        description: "Ваше новое имя пользователя сохранено",
      });
      setIsEditingName(false);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить имя пользователя",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Выберите изображение для загрузки");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setAvatarUrl(urlData.publicUrl);
      toast({
        title: "Аватар обновлен",
        description: "Ваш новый аватар успешно загружен",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить аватар",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пароли не совпадают",
      });
      return;
    }

    if (newPassword === oldPassword) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Новый пароль должен отличаться от старого",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (error.message.includes("same_password")) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Новый пароль должен отличаться от старого",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Пароль изменен",
        description: "Ваш пароль успешно обновлен",
      });
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить пароль",
      });
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    // Здесь можно добавить логику для изменения языка в приложении
    window.location.reload(); // Перезагружаем страницу для применения изменений
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выйти из системы",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Общие настройки</CardTitle>
          <CardDescription>
            Настройте внешний вид и язык интерфейса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Тема</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тему" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Светлая</SelectItem>
                <SelectItem value="dark">Тёмная</SelectItem>
                <SelectItem value="system">Системная</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Язык</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройки аккаунта</CardTitle>
          <CardDescription>
            Управляйте своим профилем
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Имя пользователя</Label>
            {isEditingName ? (
              <div className="flex gap-2">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите новое имя"
                />
                <Button onClick={handleUpdateUsername}>Сохранить</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingName(false)}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="text-muted-foreground">
                  {username || "Выберите имя пользователя"}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingName(true)}
                >
                  Изменить имя
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Аватар</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>АВ</AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer"
              >
                <Button variant="outline" className="relative">
                  Загрузить новый аватар
                  <input
                    id="avatar-upload"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </Button>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Безопасность</CardTitle>
          <CardDescription>
            Управляйте безопасностью вашего аккаунта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Изменить пароль</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Изменение пароля</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Старый пароль</Label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Новый пароль</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Подтвердите пароль</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handlePasswordChange}>
                  Сохранить новый пароль
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Выход из аккаунта</CardTitle>
          <CardDescription>
            Завершите текущую сессию
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
