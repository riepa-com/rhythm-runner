import { useState, useEffect } from "react";
import { Award, Lock, Check, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAchievements } from "@/hooks/useAchievements";
import { supabase } from "@/integrations/supabase/client";
import { Achievement, getRarityColor, getRarityBgColor } from "@/lib/achievements";

type AchievementCategory = Achievement['category'];

export const AchievementsViewer = () => {
  const [category, setCategory] = useState<AchievementCategory | "all">("all");
  const [userId, setUserId] = useState<string | undefined>();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  const { getAllWithStatus, getProgress, totalPoints, loading } = useAchievements(userId);

  const achievements = getAllWithStatus();
  const progress = getProgress();

  const filteredAchievements = category === "all" 
    ? achievements 
    : achievements.filter(a => a.category === category);

  const categories: { value: AchievementCategory | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "onboarding", label: "Start" },
    { value: "social", label: "Social" },
    { value: "contribution", label: "Contrib" },
    { value: "longevity", label: "Time" },
    { value: "special", label: "Special" },
  ];

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Achievements</h1>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-foreground">{totalPoints} pts</span>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-sm font-medium text-foreground">
            {progress.unlocked} / {progress.total}
          </span>
        </div>
        <Progress value={progress.percentage} className="h-2" />
      </div>

      <Tabs value={category} onValueChange={(v) => setCategory(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-6 mb-4 h-8">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-[10px]">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 gap-2 pr-4">
              {filteredAchievements.map((achievement) => {
                const isUnlocked = achievement.unlocked;
                
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      isUnlocked 
                        ? `${getRarityBgColor(achievement.rarity)} border-primary/30` 
                        : "bg-muted/20 border-border opacity-60"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isUnlocked ? "bg-primary/20" : "bg-muted"
                    }`}>
                      {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                          {achievement.name}
                        </span>
                        <Badge variant="outline" className={`text-[9px] px-1 ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </Badge>
                        {isUnlocked && <Check className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-bold ${isUnlocked ? "text-primary" : "text-muted-foreground"}`}>
                        +{achievement.points}
                      </div>
                      <div className="text-[10px] text-muted-foreground">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
};
