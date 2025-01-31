import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { CapsuleSection } from "@/components/capsule/CapsuleSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimeCapsule } from "@/components/TimeCapsule";

const Profile = ({ session }: { session: any }) => {
  const [username, setUsername] = useState("");
  const [customId, setCustomId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<any>(null);
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
    if (profile) {
      setUsername(profile.username || "");
      setCustomId(profile.custom_id || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Выберите изображение для загрузки.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", session.user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Успешно",
        description: "Аватар обновлен",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (customId) {
        // Check if custom ID is already taken
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("custom_id", customId)
          .neq("id", session.user.id)
          .single();

        if (existingUser) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Этот ID уже занят. Пожалуйста, выберите другой.",
          });
          return;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({ username, custom_id: customId })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Профиль обновлен",
      });

      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    }
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(session.user.id);
    toast({
      title: "ID скопирован",
      description: "Теперь вы можете поделиться им с друзьями",
    });
  };

  const personalCapsules = capsules || [];
  const sharedCapsules: any[] = [];
  const groupCapsules: any[] = [];

  const handleCapsuleClick = (capsule: any) => {
    setSelectedCapsule(capsule);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Профиль</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Управляйте своими данными и капсулами времени
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6 shadow-md">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
                id="avatar-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("avatar-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? "Загрузка..." : "Изменить аватар"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={session.user.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              placeholder="Введите имя пользователя"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-id">Пользовательский ID</Label>
            <Input
              id="custom-id"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              placeholder="Введите уникальный ID"
            />
            {isEditing && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Этот ID будет использоваться для поиска вашего профиля
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
                <Button onClick={handleUpdateProfile}>
                  Сохранить
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Редактировать профиль
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <CapsuleSection
          title="Мои личные капсулы"
          capsules={personalCapsules}
          onCapsuleClick={handleCapsuleClick}
        />
        
        <CapsuleSection
          title="Совместные капсулы"
          capsules={sharedCapsules}
          onCapsuleClick={handleCapsuleClick}
        />
        
        <CapsuleSection
          title="Групповые капсулы"
          capsules={groupCapsules}
          onCapsuleClick={handleCapsuleClick}
        />
      </div>

      <Dialog open={!!selectedCapsule} onOpenChange={() => setSelectedCapsule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Капсула времени</DialogTitle>
          </DialogHeader>
          {selectedCapsule && (
            <TimeCapsule
              initialData={selectedCapsule}
              session={session}
              onComplete={() => setSelectedCapsule(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
