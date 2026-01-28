import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { FollowUpStats, Lead } from '@/types/lead';

interface FollowUpSectionProps {
  followUpStats: FollowUpStats;
}

interface FollowUpCardProps {
  title: string;
  count: number;
  leads: Lead[];
  icon: React.ReactNode;
  variant: 'overdue' | 'today' | 'upcoming';
}

function FollowUpCard({
  title,
  count,
  leads,
  icon,
  variant,
}: FollowUpCardProps) {
  const variantClasses = {
    overdue: 'followup-overdue border',
    today: 'followup-today border',
    upcoming: 'followup-upcoming border',
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`rounded-lg p-4 min-h-[140px] ${variantClasses[variant]}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-foreground">
            {title}
          </span>
        </div>
        <span className="text-xl font-bold text-foreground">
          {count}
        </span>
      </div>

      {/* Content */}
      {leads.length > 0 ? (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {leads.slice(0, 5).map((lead, index) => (
            <div
              key={lead.Dedupe_Key || index}
              className="flex items-center justify-between text-xs py-1 border-t border-border/50 first:border-0"
            >
              <span className="truncate max-w-[150px] text-foreground">
                {lead.Company_Name}
              </span>
              <span className="text-muted-foreground">
                {formatDate(lead.Next_Followup_At)}
              </span>
            </div>
          ))}

          {leads.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{leads.length - 5} more
            </p>
          )}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground py-6 text-center">
          No follow-ups
        </div>
      )}
    </div>
  );
}

export function FollowUpSection({ followUpStats }: FollowUpSectionProps) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Follow-up Status</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FollowUpCard
          title="Overdue"
          count={followUpStats.overdue.length}
          leads={followUpStats.overdue}
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
          variant="overdue"
        />

        <FollowUpCard
          title="Today"
          count={followUpStats.today.length}
          leads={followUpStats.today}
          icon={<Clock className="w-4 h-4 text-warning" />}
          variant="today"
        />

        <FollowUpCard
          title="Upcoming"
          count={followUpStats.upcoming.length}
          leads={followUpStats.upcoming}
          icon={<Calendar className="w-4 h-4 text-success" />}
          variant="upcoming"
        />
      </div>
    </div>
  );
}
