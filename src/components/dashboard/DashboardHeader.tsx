import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  lastRefresh: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ lastRefresh, isLoading, onRefresh }: DashboardHeaderProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Lead Generation Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time outreach & follow-up overview</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last refresh: {formatTime(lastRefresh)}</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </header>
  );
}
