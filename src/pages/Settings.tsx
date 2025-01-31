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

const translations = {
  ru: {
    generalSettings: "Общие настройки",
    appearance: "Настройте внешний вид и язык интерфейса",
    theme: "Тема",
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",
    language: "Язык",
    accountSettings: "Настройки аккаунта",
    manageProfile: "Управляйте своим профилем",
    username: "Имя пользователя",
    save: "Сохранить",
    cancel: "Отмена",
    avatar: "Аватар",
    uploadAvatar: "Загрузить новый аватар",
    security: "Безопасность",
    manageAccount: "Управляйте безопасностью вашего аккаунта",
    changePassword: "Изменить пароль",
    oldPassword: "Старый пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите пароль",
    savePassword: "Сохранить новый пароль",
    logout: "Выход из аккаунта",
    endSession: "Завершите текущую сессию",
    logoutButton: "Выйти из аккаунта",
    enterNewName: "Введите новое имя",
    chooseName: "Выберите имя пользователя",
    changeName: "Изменить имя",
  },
  en: {
    generalSettings: "General Settings",
    appearance: "Customize appearance and interface language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    accountSettings: "Account Settings",
    manageProfile: "Manage your profile",
    username: "Username",
    save: "Save",
    cancel: "Cancel",
    avatar: "Avatar",
    uploadAvatar: "Upload new avatar",
    security: "Security",
    manageAccount: "Manage your account security",
    changePassword: "Change Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    savePassword: "Save new password",
    logout: "Logout",
    endSession: "End current session",
    logoutButton: "Logout",
    enterNewName: "Enter new name",
    chooseName: "Choose username",
    changeName: "Change name",
  },
};

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
  const t = translations[language as keyof typeof translations];

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
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-4 md:py-8 px-4 md:px-8 space-y-4 md:space-y-8">
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl dark:text-white">{t.generalSettings}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t.appearance}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="dark:text-gray-200">{t.theme}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full md:w-[200px] dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder={t.theme} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="light">{t.light}</SelectItem>
                <SelectItem value="dark">{t.dark}</SelectItem>
                <SelectItem value="system">{t.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="dark:text-gray-200">{t.language}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full md:w-[200px] dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder={t.language} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl dark:text-white">{t.accountSettings}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t.manageProfile}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="dark:text-gray-200">{t.username}</Label>
            {isEditingName ? (
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.enterNewName}
                  className="dark:bg-gray-800 dark:text-white"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateUsername}>{t.save}</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingName(false)}
                    className="dark:text-gray-200"
                  >
                    {t.cancel}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                <span className="text-muted-foreground dark:text-gray-300">
                  {username || t.chooseName}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingName(true)}
                  className="dark:text-gray-200"
                >
                  {t.changeName}
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="dark:text-gray-200">{t.avatar}</Label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="dark:bg-gray-800 dark:text-white">
                  {username?.substring(0, 2).toUpperCase() || "AV"}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer"
              >
                <Button variant="outline" className="relative dark:text-gray-200">
                  {t.uploadAvatar}
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

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl dark:text-white">{t.security}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t.manageAccount}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="dark:text-gray-200">{t.changePassword}</Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="dark:text-white">{t.changePassword}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{t.oldPassword}</Label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{t.newPassword}</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">{t.confirmPassword}</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  {t.savePassword}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl dark:text-white">{t.logout}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t.endSession}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full md:w-auto"
          >
            {t.logoutButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}