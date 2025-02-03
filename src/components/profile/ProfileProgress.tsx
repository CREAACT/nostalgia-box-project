import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock } from "lucide-react";

interface ProfileProgressProps {
  completedStages: number;
  totalOlympiads: number;
}

export function ProfileProgress({ completedStages, totalOlympiads }: ProfileProgressProps) {
  const progressPercentage = (completedStages / 10) * 100;

  return (
    <Card className="w-full animate-fade-in [animation-delay:600ms]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Прогресс
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Пройдено этапов</span>
              <span className="font-medium">{completedStages}/10</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Олимпиад</p>
                <p className="text-2xl font-bold">{totalOlympiads}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Этапов</p>
                <p className="text-2xl font-bold">{completedStages}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}