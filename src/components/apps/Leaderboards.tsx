import { useState } from "react";
import { Trophy, MessageSquare, Award, Users, Clock, Medal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLeaderboards, LeaderboardEntry } from "@/hooks/useLeaderboards";

export const Leaderboards = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "achievements" | "social" | "veteran">("chat");
  
  const { entries: chatEntries, loading: chatLoading } = useLeaderboards("chat");
  const { entries: achievementEntries, loading: achievementLoading } = useLeaderboards("achievements");
  const { entries: socialEntries, loading: socialLoading } = useLeaderboards("social");
  const { entries: veteranEntries, loading: veteranLoading } = useLeaderboards("veteran");

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30";
    return "bg-muted/30 border-border";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{rank}</span>;
  };

  const LeaderboardList = ({ 
    data, 
    loading,
    valueKey, 
    valueLabel 
  }: { 
    data: LeaderboardEntry[]; 
    loading: boolean;
    valueKey: keyof LeaderboardEntry; 
    valueLabel: string;
  }) => (
    <ScrollArea className="h-[400px]">
      {loading ? (
        <div className="p-4 text-center text-muted-foreground">Loading...</div>
      ) : data.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No data yet</div>
      ) : (
        <div className="p-3 space-y-2">
          {data.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${getRankStyle(index + 1)}`}
            >
              <div className="flex-shrink-0">
                {getRankBadge(index + 1)}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                {(entry.display_name || entry.username || "?").charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {entry.display_name || entry.username}
                </div>
                <div className="text-xs text-muted-foreground">
                  @{entry.username}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {typeof entry[valueKey] === 'number' ? entry[valueKey].toLocaleString() : entry[valueKey] || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  {valueLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );

  // Calculate days since member_since for veteran leaderboard
  const veteranWithDays = veteranEntries.map(entry => ({
    ...entry,
    days_member: Math.floor((Date.now() - new Date(entry.member_since).getTime()) / (1000 * 60 * 60 * 24))
  }));

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Leaderboards</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="chat" className="text-xs gap-1">
            <MessageSquare className="w-3 h-3" />
            Chatters
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs gap-1">
            <Award className="w-3 h-3" />
            Achievers
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs gap-1">
            <Users className="w-3 h-3" />
            Social
          </TabsTrigger>
          <TabsTrigger value="veteran" className="text-xs gap-1">
            <Clock className="w-3 h-3" />
            Veterans
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 border border-border rounded-lg overflow-hidden">
          <TabsContent value="chat" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Top Chatters</h2>
              <p className="text-xs text-muted-foreground">Most active in global chat</p>
            </div>
            <LeaderboardList 
              data={chatEntries} 
              loading={chatLoading}
              valueKey="total_chat_messages" 
              valueLabel="messages" 
            />
          </TabsContent>
          
          <TabsContent value="achievements" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Achievement Hunters</h2>
              <p className="text-xs text-muted-foreground">Most achievements unlocked</p>
            </div>
            <LeaderboardList 
              data={achievementEntries} 
              loading={achievementLoading}
              valueKey="achievement_count" 
              valueLabel="achievements" 
            />
          </TabsContent>
          
          <TabsContent value="social" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Most Social</h2>
              <p className="text-xs text-muted-foreground">Most friends added</p>
            </div>
            <LeaderboardList 
              data={socialEntries} 
              loading={socialLoading}
              valueKey="friend_count" 
              valueLabel="friends" 
            />
          </TabsContent>
          
          <TabsContent value="veteran" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Veterans</h2>
              <p className="text-xs text-muted-foreground">Longest-standing members</p>
            </div>
            <ScrollArea className="h-[400px]">
              {veteranLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : veteranWithDays.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No data yet</div>
              ) : (
                <div className="p-3 space-y-2">
                  {veteranWithDays.map((entry, index) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${getRankStyle(index + 1)}`}
                    >
                      <div className="flex-shrink-0">
                        {getRankBadge(index + 1)}
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                        {(entry.display_name || entry.username || "?").charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {entry.display_name || entry.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{entry.username}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {entry.days_member}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">
                          days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
