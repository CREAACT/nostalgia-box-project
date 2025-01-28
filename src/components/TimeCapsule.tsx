import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Lock, Unlock, Image as ImageIcon, Gift, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export const TimeCapsule = () => {
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [isSealed, setIsSealed] = useState(false);
  const { toast } = useToast();

  const handleSeal = () => {
    if (!date || !message || !title) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    setIsSealed(true);
    toast({
      title: "Капсула времени запечатана!",
      description: `Она будет открыта ${format(date, "dd.MM.yyyy")}`,
    });
  };

  const handleUnseal = () => {
    setIsSealed(false);
    toast({
      title: "Капсула времени открыта!",
      description: "Теперь вы можете изменить её содержимое",
    });
  };

  return (
    <Card className={cn(
      "w-full max-w-md mx-auto p-6 space-y-4 transition-all duration-500",
      isSealed ? "bg-capsule-200" : "bg-capsule-100",
      isSealed && "animate-capsule-seal"
    )}>
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
            disabled={isSealed}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            disabled={isSealed}
          >
            <Gift className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};