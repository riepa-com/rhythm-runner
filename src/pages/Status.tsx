import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, CheckCircle, XCircle, AlertTriangle, RefreshCw, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface StatusEntry {
  id: string;
  status: string;
  message: string | null;
  updated_at: string;
}

const StatusPage = () => {
  const [statuses, setStatuses] = useState<StatusEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [supabaseOnline, setSupabaseOnline] = useState<boolean | null>(null);

  const routeLabels: Record<string, string> = {
    'main': 'Main Site',
    'docs': 'Documentation',
    'def-dev': 'DefDev Mode',
    'entire-site': 'Entire Site'
  };

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_status')
        .select('*')
        .order('id');

      if (error) {
        console.error('Failed to fetch status:', error);
        setSupabaseOnline(false);
      } else {
        setStatuses(data || []);
        setSupabaseOnline(true);
      }
    } catch (error) {
      console.error('Status fetch error:', error);
      setSupabaseOnline(false);
    } finally {
      setIsLoading(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'maintenance':
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'maintenance':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'offline':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const overallStatus = () => {
    if (supabaseOnline === false) return 'offline';
    const entireSite = statuses.find(s => s.id === 'entire-site');
    if (entireSite?.status !== 'online') return entireSite?.status || 'offline';
    if (statuses.some(s => s.status === 'offline')) return 'partial';
    if (statuses.some(s => s.status === 'maintenance')) return 'maintenance';
    return 'online';
  };

  const status = overallStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to UrbanShade
          </Link>
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
              status === 'online' ? 'bg-green-500/20 border-green-500/50' :
              status === 'partial' ? 'bg-amber-500/20 border-amber-500/50' :
              status === 'maintenance' ? 'bg-amber-500/20 border-amber-500/50' :
              'bg-red-500/20 border-red-500/50'
            }`}>
              <Activity className={`w-8 h-8 ${
                status === 'online' ? 'text-green-400' :
                status === 'partial' || status === 'maintenance' ? 'text-amber-400' :
                'text-red-400'
              }`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">UrbanShade Status</h1>
              <p className="text-gray-400 mt-1">
                {status === 'online' && 'All systems operational'}
                {status === 'partial' && 'Some systems experiencing issues'}
                {status === 'maintenance' && 'Maintenance in progress'}
                {status === 'offline' && 'Systems currently offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Refresh Bar */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
          <Button 
            onClick={fetchStatus} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Supabase Connection Status */}
        <div className={`mb-6 p-4 rounded-xl border ${
          supabaseOnline === null ? 'bg-gray-500/10 border-gray-500/30' :
          supabaseOnline ? 'bg-green-500/10 border-green-500/30' :
          'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {supabaseOnline === null ? (
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
            ) : supabaseOnline ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <div>
              <span className="font-semibold">Database Connection</span>
              <span className={`ml-3 px-2 py-0.5 rounded text-xs font-bold ${
                supabaseOnline === null ? 'bg-gray-500/20 text-gray-400' :
                supabaseOnline ? 'bg-green-500/20 text-green-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {supabaseOnline === null ? 'CHECKING' : supabaseOnline ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="space-y-4">
          {isLoading && statuses.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Checking status...</p>
            </div>
          ) : (
            statuses.map((entry) => (
              <div 
                key={entry.id}
                className={`p-6 rounded-xl border transition-all ${getStatusColor(entry.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(entry.status)}
                    <div>
                      <h3 className="font-bold text-lg">
                        {routeLabels[entry.id] || entry.id}
                      </h3>
                      {entry.message && (
                        <p className="text-sm opacity-80 mt-1">{entry.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                      entry.status === 'online' ? 'bg-green-500/30' :
                      entry.status === 'maintenance' ? 'bg-amber-500/30' :
                      'bg-red-500/30'
                    }`}>
                      {entry.status}
                    </span>
                    <p className="text-xs opacity-60 mt-2">
                      Updated: {new Date(entry.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <h3 className="font-semibold mb-3">Status Legend</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Online - Fully operational</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-gray-400">Maintenance - Scheduled work</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Offline - Currently unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
