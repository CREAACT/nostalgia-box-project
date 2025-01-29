import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Lock, Unlock, Image, Gift, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto p-6 space-y-4 transition-all duration-500",
        isSealed ? "bg-capsule-200" : "bg-capsule-100",
        isSealed && "animate-capsule-seal"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Archive className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Капсула времени</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={isSealed ? handleUnseal : handleSeal}
        >
          {isSealed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </Button>
      </div>

      {imageUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Изображение капсулы"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        <Input
          placeholder="Название капсулы"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSealed}
          className="bg-white/50"
        />

        <Textarea
          placeholder="Ваше сообщение будущему..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSealed}
          className={cn(
            "min-h-[150px] bg-white/50",
            isSealed && "animate-fade-age"
          )}
        />

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                disabled={isSealed}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd.MM.yyyy") : "Выберите дату открытия"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            disabled={isSealed || uploading}
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isSealed || uploading}
            />
            <Image className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            disabled={isSealed}
            onClick={() => {
              toast({
                title: "Добавление подарка",
                description: "Скоро вы сможете прикрепить виртуальный подарок к капсуле времени!",
              });
            }}
          >
            <Gift className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};