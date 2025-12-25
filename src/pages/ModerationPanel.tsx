import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, AlertTriangle, Ban, Clock, Search, RefreshCw, XCircle, CheckCircle, Skull, FileText, PartyPopper, Activity, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  role: string;
  isBanned: boolean;
  banInfo?: {
    action_type: string;
    reason: string;
    expires_at: string | null;
    is_fake: boolean;
  };
  warningsCount: number;
  warnings: Array<{ reason: string; created_at: string }>;
  created_at: string;
}

interface StatusEntry {
  id: string;
  status: string;
  message: string | null;
}

const routeLabels: Record<string, string> = {
  'main': 'Main Site',
  'docs': 'Documentation',
  'def-dev': 'DefDev Mode',
  'entire-site': 'Entire Site (Global)'
};

const StatusCard = ({ status, onUpdate }: { status: StatusEntry; onUpdate: (id: string, status: string, message: string | null) => void }) => {
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status.status);
  const [newMessage, setNewMessage] = useState(status.message || '');

  const handleSave = () => {
    onUpdate(status.id, newStatus, newMessage || null);
    setEditing(false);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'online': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'maintenance': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'offline': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className={`p-5 rounded-xl border transition-all ${getStatusColor(status.status)}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">{routeLabels[status.id] || status.id}</h4>
          <span className="text-xs opacity-70">ID: {status.id}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
          status.status === 'online' ? 'bg-green-500/30' :
          status.status === 'maintenance' ? 'bg-amber-500/30' :
          'bg-red-500/30'
        }`}>
          {status.status}
        </span>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block opacity-70">Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="bg-slate-900/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block opacity-70">Message (optional)</label>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Custom message to show users..."
              className="bg-slate-900/50"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="gap-1">
              <Save className="w-3 h-3" /> Save
            </Button>
            <Button onClick={() => setEditing(false)} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {status.message && (
            <p className="text-sm mb-3 opacity-80">{status.message}</p>
          )}
          <Button onClick={() => setEditing(true)} size="sm" variant="outline">
            Edit Status
          </Button>
        </div>
      )}
    </div>
  );
};

const ModerationPanel = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "status">("users");
  const [logs, setLogs] = useState<any[]>([]);
  
  // Status management
  const [statuses, setStatuses] = useState<StatusEntry[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Action dialogs
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [warnReason, setWarnReason] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState<"1h" | "24h" | "7d" | "30d" | "perm">("24h");
  const [isFakeBan, setIsFakeBan] = useState(false);

  // Check admin status and fetch data
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please log in first");
          navigate("/");
          return;
        }

        // Call edge function to get users (it will verify admin status)
        const response = await supabase.functions.invoke('admin-actions', {
          method: 'GET'
        });

        if (response.error) {
          if (response.error.message?.includes('403') || response.error.message?.includes('Access denied')) {
            toast.error("Access denied - Admin only");
            navigate("/");
            return;
          }
          throw response.error;
        }

        setIsAdmin(true);
        setUsers(response.data.users || []);
        
      } catch (error: any) {
        console.error("Admin check error:", error);
        toast.error("Access denied");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await supabase.functions.invoke('admin-actions', {
        method: 'GET'
      });
      if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await supabase.functions.invoke('admin-actions/logs', {
        method: 'GET'
      });
      if (response.data?.logs) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error("Fetch logs error:", error);
    }
  };

  const fetchStatuses = async () => {
    setStatusLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_status')
        .select('id, status, message')
        .order('id');
      
      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error("Fetch status error:", error);
      toast.error("Failed to fetch site status");
    } finally {
      setStatusLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, message: string | null) => {
    try {
      const { error } = await supabase
        .from('site_status')
        .update({ status, message, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Status updated for ${id}`);
      fetchStatuses();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleWarn = async () => {
    if (!selectedUser || !warnReason) return;
    
    try {
      const response = await supabase.functions.invoke('admin-actions/warn', {
        method: 'POST',
        body: { targetUserId: selectedUser.user_id, reason: warnReason }
      });

      if (response.error) throw response.error;
      
      toast.success(`Warning issued to ${selectedUser.username}`);
      setShowWarnDialog(false);
      setWarnReason("");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to issue warning");
    }
  };

  const handleBan = async () => {
    if (!selectedUser || !banReason) return;
    
    try {
      const response = await supabase.functions.invoke('admin-actions/ban', {
        method: 'POST',
        body: { 
          targetUserId: selectedUser.user_id, 
          reason: banReason,
          duration: banDuration !== 'perm' ? banDuration : null,
          isPermanent: banDuration === 'perm',
          isFake: isFakeBan
        }
      });

      if (response.error) throw response.error;
      
      toast.success(`${isFakeBan ? 'Fake ban' : 'Ban'} issued to ${selectedUser.username}`);
      setShowBanDialog(false);
      setBanReason("");
      setIsFakeBan(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to ban user");
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const response = await supabase.functions.invoke('admin-actions/unban', {
        method: 'POST',
        body: { targetUserId: userId }
      });

      if (response.error) throw response.error;
      
      toast.success("User unbanned");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unban user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-gray-400">You do not have permission to access this panel.</p>
          <Button onClick={() => navigate("/")} className="mt-4">Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <div className="border-b border-red-500/30 bg-gradient-to-r from-red-950/50 to-orange-950/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-400">UrbanShade Moderation Panel</h1>
                <p className="text-sm text-gray-500">Admin-only access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchUsers} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")}>Exit</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="gap-2"
          >
            <Users className="w-4 h-4" /> Users ({users.length})
          </Button>
          <Button 
            variant={activeTab === "logs" ? "default" : "outline"}
            onClick={() => { setActiveTab("logs"); fetchLogs(); }}
            className="gap-2"
          >
            <FileText className="w-4 h-4" /> Logs
          </Button>
          <Button 
            variant={activeTab === "status" ? "default" : "outline"}
            onClick={() => { setActiveTab("status"); fetchStatuses(); }}
            className="gap-2"
          >
            <Activity className="w-4 h-4" /> Site Status
          </Button>
        </div>

        {activeTab === "users" && (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-bold text-cyan-400">{users.length}</div>
                <div className="text-xs text-gray-500">Total Users</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-bold text-red-400">{users.filter(u => u.isBanned).length}</div>
                <div className="text-xs text-gray-500">Banned</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-bold text-amber-400">{users.reduce((acc, u) => acc + u.warningsCount, 0)}</div>
                <div className="text-xs text-gray-500">Total Warnings</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-bold text-green-400">{users.filter(u => u.role === 'admin').length}</div>
                <div className="text-xs text-gray-500">Admins</div>
              </div>
            </div>

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <div 
                  key={user.id}
                  className={`p-4 rounded-xl border transition-all ${
                    user.isBanned 
                      ? 'bg-red-950/30 border-red-500/30' 
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{user.display_name || user.username}</span>
                          <span className="text-xs text-gray-500">@{user.username}</span>
                          {user.role === 'admin' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">ADMIN</span>
                          )}
                          {user.isBanned && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                              <Ban className="w-3 h-3" /> BANNED
                              {user.banInfo?.is_fake && <PartyPopper className="w-3 h-3" />}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                          {user.warningsCount > 0 && (
                            <span className="text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {user.warningsCount} warnings
                            </span>
                          )}
                          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {user.role !== 'admin' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { setSelectedUser(user); setShowWarnDialog(true); }}
                            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" /> Warn
                          </Button>
                          
                          {user.isBanned ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUnban(user.user_id)}
                              className="text-green-400 border-green-500/30 hover:bg-green-500/10"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Unban
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => { setSelectedUser(user); setShowBanDialog(true); }}
                              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                            >
                              <Ban className="w-4 h-4 mr-1" /> Ban
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "logs" && (
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No moderation logs yet</p>
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.action_type === 'warn' ? 'bg-amber-500/20 text-amber-400' :
                        log.action_type.includes('ban') ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {log.action_type.toUpperCase()}
                        {log.is_fake && ' (FAKE)'}
                      </span>
                      <span className="text-sm">{log.reason}</span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Site Status Management
              </h3>
              <p className="text-sm text-gray-400">
                Control the status of different parts of UrbanShade. Setting a section to "offline" or "maintenance" will show a warning to users.
              </p>
            </div>

            {statusLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                <p className="text-gray-400">Loading status...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {statuses.map(status => (
                  <StatusCard 
                    key={status.id}
                    status={status}
                    onUpdate={updateStatus}
                  />
                ))}
              </div>
            )}

            <Button onClick={fetchStatuses} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh Status
            </Button>
          </div>
        )}
      </div>

      {/* Warn Dialog */}
      <Dialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Issue Warning
            </DialogTitle>
            <DialogDescription>
              Issue a warning to {selectedUser?.username}. This will be logged.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={warnReason}
            onChange={(e) => setWarnReason(e.target.value)}
            placeholder="Reason for warning..."
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarnDialog(false)}>Cancel</Button>
            <Button onClick={handleWarn} className="bg-amber-500 hover:bg-amber-600">Issue Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Ban className="w-5 h-5" />
              Ban User
            </DialogTitle>
            <DialogDescription>
              Ban {selectedUser?.username} from UrbanShade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Duration</label>
              <div className="flex flex-wrap gap-2">
                {(['1h', '24h', '7d', '30d', 'perm'] as const).map(d => (
                  <Button
                    key={d}
                    variant={banDuration === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBanDuration(d)}
                  >
                    {d === 'perm' ? 'Permanent' : d}
                  </Button>
                ))}
              </div>
            </div>
            
            <Textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Reason for ban..."
              rows={3}
            />

            <label className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 cursor-pointer">
              <input
                type="checkbox"
                checked={isFakeBan}
                onChange={(e) => setIsFakeBan(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-purple-400 flex items-center gap-2">
                  <PartyPopper className="w-4 h-4" /> Fake Ban (Prank)
                </div>
                <p className="text-xs text-gray-400">
                  Shows ban message, but reveals "GET PRANKED!" when they click OK
                </p>
              </div>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>Cancel</Button>
            <Button onClick={handleBan} className="bg-red-500 hover:bg-red-600">
              {isFakeBan ? 'Fake Ban' : 'Ban User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationPanel;
