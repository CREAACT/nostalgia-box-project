import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileAchievementsProps {
  achievements: any[];
  medals: any[];
  certificates: any[];
}

export function ProfileAchievements({ achievements, medals, certificates }: ProfileAchievementsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="animate-fade-in hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {achievements?.map((achievement, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Star className="w-4 h-4 text-blue-500" />
                <span>{achievement.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:200ms] hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-purple-500" />
            Медали
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {medals?.map((medal, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Medal className="w-4 h-4 text-purple-500" />
                <span>{medal.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:400ms] hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Сертификаты
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {certificates?.map((cert, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span>{cert.name}</span>
                <Button variant="ghost" size="sm" className="hover:text-green-500">
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