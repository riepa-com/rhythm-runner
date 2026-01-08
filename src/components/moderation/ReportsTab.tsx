import { useState, useEffect } from "react";
import { 
  AlertTriangle, User, Bug, MessageSquare, Shield, FileText, Clock, 
  Search, RefreshCw, Filter, ChevronRight, CheckCircle, XCircle, Trash2,
  Eye, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Report {
  id: string;
  reporter_id: string | null;
  reported_user_id: string | null;
  report_type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  resolution_notes: string | null;
  assigned_admin_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  reporter_profile?: { username: string; display_name: string | null };
  reported_user_profile?: { username: string; display_name: string | null };
  assigned_admin_profile?: { username: string };
}

const ReportsTab = ({ isDemo }: { isDemo: boolean }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  useEffect(() => {
    const getAdminId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentAdminId(user.id);
    };
    getAdminId();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [statusFilter, typeFilter]);

  const fetchReports = async () => {
    if (isDemo) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('report_type', typeFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Fetch profiles for reporters and reported users
      const reportsWithProfiles = await Promise.all(
        (data || []).map(async (report: Report) => {
          let reporter_profile = undefined;
          let reported_user_profile = undefined;
          let assigned_admin_profile = undefined;

          if (report.reporter_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, display_name')
              .eq('user_id', report.reporter_id)
              .single();
            reporter_profile = profile || undefined;
          }

          if (report.reported_user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, display_name')
              .eq('user_id', report.reported_user_id)
              .single();
            reported_user_profile = profile || undefined;
          }

          if (report.assigned_admin_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('user_id', report.assigned_admin_id)
              .single();
            assigned_admin_profile = profile || undefined;
          }

          return {
            ...report,
            reporter_profile,
            reported_user_profile,
            assigned_admin_profile
          };
        })
      );

      setReports(reportsWithProfiles);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveReport = async () => {
    if (!selectedReport || !currentAdminId) return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'resolved', 
          resolution_notes: resolutionNotes || null,
          resolved_at: new Date().toISOString(),
          assigned_admin_id: currentAdminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      setShowResolveDialog(false);
      setResolutionNotes("");
      setSelectedReport(null);
      fetchReports();
      toast.success('Report resolved!');
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to resolve report');
    }
  };

  const discardReport = async () => {
    if (!selectedReport || !currentAdminId) return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'discarded', 
          resolution_notes: resolutionNotes || 'Report discarded',
          resolved_at: new Date().toISOString(),
          assigned_admin_id: currentAdminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      setShowDiscardDialog(false);
      setResolutionNotes("");
      setSelectedReport(null);
      fetchReports();
      toast.success('Report discarded');
    } catch (error) {
      console.error('Error discarding report:', error);
      toast.error('Failed to discard report');
    }
  };

  const assignToMe = async (report: Report) => {
    if (!currentAdminId) return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          assigned_admin_id: currentAdminId,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (error) throw error;

      fetchReports();
      toast.success('Report assigned to you');
    } catch (error) {
      console.error('Error assigning report:', error);
      toast.error('Failed to assign report');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'content': return <MessageSquare className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
      case 'low':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Open</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Resolved</Badge>;
      case 'discarded':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Discarded</Badge>;
      default:
        return null;
    }
  };

  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.reporter_profile?.username?.toLowerCase().includes(query) ||
      report.reported_user_profile?.username?.toLowerCase().includes(query)
    );
  });

  const openCount = reports.filter(r => r.status === 'open' || r.status === 'pending').length;

  if (isDemo) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="font-mono text-slate-500">Demo mode - no real reports</p>
          <p className="text-xs text-slate-600 mt-2">Connect to the database to view reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Reports List */}
      <div className="w-96 flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="pl-10 bg-slate-900/50 border-slate-700 font-mono text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchReports}
            className="border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-sm flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="open">Open ({openCount})</SelectItem>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="discarded">Discarded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-sm flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">User Reports</SelectItem>
              <SelectItem value="bug">Bug Reports</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-slate-500" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500 font-mono text-sm">No reports found</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {filteredReports.map(report => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReport?.id === report.id
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : report.priority === 'critical'
                      ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                      : report.priority === 'high'
                      ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.report_type)}
                      <span className="font-medium text-sm truncate">{report.title}</span>
                    </div>
                    {getPriorityBadge(report.priority)}
                  </div>
                  <p className="text-xs text-slate-400 truncate mb-2">
                    {report.reporter_profile?.username 
                      ? `Reported by @${report.reporter_profile.username}` 
                      : 'Anonymous report'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Report Details */}
      <div className="flex-1 flex flex-col bg-slate-900/30 rounded-lg border border-slate-800">
        {selectedReport ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedReport.report_type === 'security' ? 'bg-red-500/20 text-red-400' :
                    selectedReport.report_type === 'user' ? 'bg-purple-500/20 text-purple-400' :
                    selectedReport.report_type === 'bug' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {getTypeIcon(selectedReport.report_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedReport.title}</h3>
                    <p className="text-xs text-slate-500 font-mono uppercase">{selectedReport.report_type} Report</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(selectedReport.priority)}
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>
              
              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span>
                  Reporter: {selectedReport.reporter_profile?.username 
                    ? `@${selectedReport.reporter_profile.username}` 
                    : 'Anonymous'}
                </span>
                {selectedReport.reported_user_profile && (
                  <span className="text-red-400">
                    Reported User: @{selectedReport.reported_user_profile.username}
                  </span>
                )}
                <span>
                  Created: {new Date(selectedReport.created_at).toLocaleString()}
                </span>
                {selectedReport.assigned_admin_profile && (
                  <span className="text-purple-400">
                    Assigned: @{selectedReport.assigned_admin_profile.username}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono text-slate-400 mb-2">DESCRIPTION</h4>
                  <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                    <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                </div>

                {selectedReport.resolution_notes && (
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 mb-2">RESOLUTION NOTES</h4>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-sm text-green-300 whitespace-pre-wrap">{selectedReport.resolution_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Actions */}
            {selectedReport.status !== 'resolved' && selectedReport.status !== 'discarded' && (
              <div className="p-4 border-t border-slate-800 flex gap-3">
                {!selectedReport.assigned_admin_id && (
                  <Button
                    onClick={() => assignToMe(selectedReport)}
                    className="bg-purple-600 hover:bg-purple-500 gap-2"
                  >
                    <Eye className="w-4 h-4" /> Assign to Me
                  </Button>
                )}
                <Button
                  onClick={() => setShowResolveDialog(true)}
                  className="bg-green-600 hover:bg-green-500 gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </Button>
                <Button
                  onClick={() => setShowDiscardDialog(true)}
                  variant="outline"
                  className="border-slate-700 gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Discard
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-500 font-mono">Select a report to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="bg-slate-950 border-green-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400 font-mono">
              <CheckCircle className="w-5 h-5" />
              RESOLVE REPORT
            </DialogTitle>
            <DialogDescription className="font-mono text-slate-400">
              Mark this report as resolved and add optional notes.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Resolution notes (optional)..."
            rows={4}
            className="bg-slate-900 border-slate-700 font-mono"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)} className="border-slate-700">Cancel</Button>
            <Button onClick={resolveReport} className="bg-green-600 hover:bg-green-500">
              Resolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discard Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent className="bg-slate-950 border-slate-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-400 font-mono">
              <Trash2 className="w-5 h-5" />
              DISCARD REPORT
            </DialogTitle>
            <DialogDescription className="font-mono text-slate-400">
              Discard this report as invalid, duplicate, or not actionable.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Reason for discarding (required)..."
            rows={4}
            className="bg-slate-900 border-slate-700 font-mono"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)} className="border-slate-700">Cancel</Button>
            <Button onClick={discardReport} variant="outline" className="border-slate-600" disabled={!resolutionNotes.trim()}>
              Discard Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsTab;
