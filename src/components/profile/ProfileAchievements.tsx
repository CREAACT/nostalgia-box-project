import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileAchievementsProps {
  achievements: any[];
  medals: any[];
  certificates: any[];
}

export function ProfileAchievements({ achievements, medals, certificates }: ProfileAchievementsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {achievements?.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-blue-500" />
                <span>{achievement.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:200ms]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-purple-500" />
            Медали
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {medals?.map((medal, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Medal className="w-4 h-4 text-purple-500" />
                <span>{medal.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:400ms]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Сертификаты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {certificates?.map((cert, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{cert.name}</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}