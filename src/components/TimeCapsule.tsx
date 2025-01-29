import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CapsuleHeader } from "./capsule/CapsuleHeader";
import { CapsuleContent } from "./capsule/CapsuleContent";
import { CapsuleActions } from "./capsule/CapsuleActions";

interface TimeCapsuleProps {
  initialData?: any;
  onComplete?: () => void;
  session: any;
}

export const TimeCapsule = ({ initialData, onComplete, session }: TimeCapsuleProps) => {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.open_date ? new Date(initialData.open_date) : undefined
  );
  const [message, setMessage] = useState(initialData?.message || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [isSealed, setIsSealed] = useState(initialData?.is_sealed || false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSeal = async () => {
    if (!date || !message || !title) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("time_capsules")
          .update({
            title,
            message,
            open_date: date.toISOString(),
            is_sealed: true,
            image_url: imageUrl,
          })
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("time_capsules").insert({
          title,
          message,
          open_date: date.toISOString(),
          is_sealed: true,
          image_url: imageUrl,
          user_id: session.user.id
        });

        if (error) throw error;
      }

      setIsSealed(true);
      toast({
        title: "Капсула времени запечатана!",
        description: `Она будет открыта ${format(date, "dd.MM.yyyy")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["capsules"] });
      if (onComplete) onComplete();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnseal = async () => {
    if (initialData?.id) {
      const { error } = await supabase
        .from("time_capsules")
        .update({ is_sealed: false })
        .eq("id", initialData.id);

      if (error) throw error;
    }
    setIsSealed(false);
    toast({
      title: "Капсула времени открыта!",
      description: "Теперь вы можете изменить её содержимое",
    });
    queryClient.invalidateQueries({ queryKey: ["capsules"] });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("time_capsule_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("time_capsule_images")
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      toast({
        title: "Изображение добавлено",
        description: "Файл успешно прикреплён к капсуле",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGiftClick = () => {
    toast({
      title: "Добавление подарка",
      description: "Скоро вы сможете прикрепить виртуальный подарок к капсуле времени!",
    });
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto p-6 space-y-4 transition-all duration-500",
        isSealed ? "bg-capsule-200" : "bg-capsule-100",
        isSealed && "animate-capsule-seal"
      )}
    >
      <CapsuleHeader
        title={title}
        isSealed={isSealed}
        onSealToggle={isSealed ? handleUnseal : handleSeal}
      />

      <CapsuleContent
        title={title}
        message={message}
        imageUrl={imageUrl}
        isSealed={isSealed}
        onTitleChange={setTitle}
        onMessageChange={setMessage}
      />

      <CapsuleActions
        date={date}
        isSealed={isSealed}
        uploading={uploading}
        onDateSelect={setDate}
        onImageUpload={handleImageUpload}
        onGiftClick={handleGiftClick}
      />
    </Card>
  );
};