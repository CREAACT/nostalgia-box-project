import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, Star } from "lucide-react";

interface ProfileProgressProps {
  completedStages: number;
  totalOlympiads: number;
}

export function ProfileProgress({ completedStages, totalOlympiads }: ProfileProgressProps) {
  const progressPercentage = (completedStages / 10) * 100;

  return (
    <Card className="w-full animate-fade-in [animation-delay:600ms] hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Прогресс участника
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Пройдено этапов</span>
              <span className="font-medium">{completedStages}/10</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {progressPercentage}% завершено
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Олимпиад</p>
                <p className="text-2xl font-bold">{totalOlympiads}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <Star className="w-8 h-8 text-green-500" />
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