import { useState, useEffect } from "react";
import { X, Megaphone, AlertTriangle, PartyPopper, Wrench, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SystemEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  priority: string;
}

export const EventsBanner = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchActiveEvents();
    
    // Load dismissed events from session storage
    const savedDismissed = sessionStorage.getItem('dismissed_events');
    if (savedDismissed) {
      setDismissed(JSON.parse(savedDismissed));
    }

    const channel = supabase
      .channel('banner-events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_events'
      }, () => {
        fetchActiveEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActiveEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('system_events')
        .select('id, title, description, event_type, priority')
        .eq('is_active', true)
        .in('priority', ['critical', 'high'])
        .order('priority', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const dismiss = (eventId: string) => {
    const newDismissed = [...dismissed, eventId];
    setDismissed(newDismissed);
    sessionStorage.setItem('dismissed_events', JSON.stringify(newDismissed));
  };

  const activeEvents = events.filter(e => !dismissed.includes(e.id));
  
  if (activeEvents.length === 0) return null;

  const currentEvent = activeEvents[currentIndex % activeEvents.length];

  const getEventStyle = (type: string, priority: string) => {
    if (priority === 'critical') {
      return "bg-red-500/10 border-red-500/30 text-red-400";
    }
    switch (type) {
      case 'maintenance': return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case 'announcement': return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case 'celebration': return "bg-green-500/10 border-green-500/30 text-green-400";
      default: return "bg-primary/10 border-primary/30 text-primary";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'announcement': return <Megaphone className="w-4 h-4" />;
      case 'celebration': return <PartyPopper className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`mx-4 mt-2 px-4 py-2 rounded-lg border flex items-center gap-3 ${getEventStyle(currentEvent.event_type, currentEvent.priority)}`}>
      {getEventIcon(currentEvent.event_type)}
      
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm">{currentEvent.title}</span>
        {currentEvent.description && (
          <span className="text-sm opacity-80 ml-2">— {currentEvent.description}</span>
        )}
      </div>

      {activeEvents.length > 1 && (
        <button
          onClick={() => setCurrentIndex(i => i + 1)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => dismiss(currentEvent.id)}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
