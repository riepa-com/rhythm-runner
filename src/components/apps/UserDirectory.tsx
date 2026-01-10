import { useState } from "react";
import { Search, Users, Wifi, WifiOff, Shield, Crown, Star, Award, MessageSquare, UserPlus, Flag, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfiles, UserProfile } from "@/hooks/useUserProfiles";

export const UserDirectory = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<"all" | "online" | "staff">("all");
  
  const { profiles, loading } = useUserProfiles();

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.username.toLowerCase().includes(search.toLowerCase()) ||
      (profile.display_name?.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (filter === "online") return profile.is_online;
    if (filter === "staff") return profile.user_role === "admin" || profile.user_role === "moderator" || profile.user_role === "creator";
    
    return true;
  });

  const getRoleBadge = (userRole?: string, isVip?: boolean) => {
    const badges = [];
    
    if (userRole === "creator") {
      badges.push(
        <Badge key="creator" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5">
          <Crown className="w-3 h-3 mr-0.5" />
          Creator
        </Badge>
      );
    } else if (userRole === "admin") {
      badges.push(
        <Badge key="admin" className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5">
          <Shield className="w-3 h-3 mr-0.5" />
          Admin
        </Badge>
      );
    } else if (userRole === "moderator") {
      badges.push(
        <Badge key="mod" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5">
          <Shield className="w-3 h-3 mr-0.5" />
          Mod
        </Badge>
      );
    }
    
    if (isVip) {
      badges.push(
        <Badge key="vip" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px] px-1.5">
          <Star className="w-3 h-3 mr-0.5" />
          VIP
        </Badge>
      );
    }
    
    return badges;
  };

  const formatLastSeen = (lastSeen?: string | null, isOnline?: boolean) => {
    if (isOnline) return "Online now";
    if (!lastSeen) return "Unknown";
    
    const diff = Date.now() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-full flex bg-background">
      {/* Left Panel - User List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="w-full grid grid-cols-3 h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="online" className="text-xs">Online</TabsTrigger>
              <TabsTrigger value="staff" className="text-xs">Staff</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Loading users...
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No users found
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredProfiles.map((profile) => (
                <button
                  key={profile.user_id}
                  onClick={() => setSelected(profile)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                    selected?.user_id === profile.user_id 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                      {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                      profile.is_online ? "bg-green-500" : "bg-muted-foreground/50"
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {profile.display_name || profile.username}
                      </span>
                      {getRoleBadge(profile.user_role, profile.is_vip)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{profile.username}
                    </div>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{profiles.length} registered users</span>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Profile View */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {(selected.display_name || selected.username).charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                    selected.is_online ? "bg-green-500" : "bg-muted-foreground/50"
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-foreground">
                      {selected.display_name || selected.username}
                    </h2>
                    {getRoleBadge(selected.user_role, selected.is_vip)}
                  </div>
                  <p className="text-muted-foreground">@{selected.username}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    {selected.is_online ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <Wifi className="w-3 h-3" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <WifiOff className="w-3 h-3" />
                        {formatLastSeen(selected.last_seen, false)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              {selected.bio && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-foreground">{selected.bio}</p>
                </div>
              )}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.total_chat_messages || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Chat Messages</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.total_messages || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">DMs Sent</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.achievement_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.friend_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Friends</div>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="text-sm text-muted-foreground">
                Member since {new Date(selected.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" variant="ghost">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a user to view their profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
