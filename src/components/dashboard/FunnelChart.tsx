import { DashboardStats } from '@/types/lead';

interface FunnelChartProps {
  stats: DashboardStats;
}

interface FunnelStepProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
  isLast?: boolean;
}

function FunnelStep({ label, value, percentage, color, isLast }: FunnelStepProps) {
  return (
    <div className="relative">
      <div 
        className="funnel-step"
        style={{ 
          background: `linear-gradient(90deg, hsl(var(${color}) / 0.15) 0%, hsl(var(${color}) / 0.05) 100%)`,
          borderLeft: `3px solid hsl(var(${color}))`
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-foreground">{value.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
        </div>
      </div>
      {!isLast && (
        <div className="h-2 ml-4 border-l-2 border-dashed border-border" />
      )}
    </div>
  );
}

export function FunnelChart({ stats }: FunnelChartProps) {
  const total = stats.totalLeads || 1; // Avoid division by zero
  
  const steps = [
    { label: 'Total Leads', value: stats.totalLeads, color: '--primary' },
    { label: 'Contacted', value: stats.contactedLeads, color: '--warning' },
    { label: 'Email Sent', value: stats.emailsSent, color: '--success' },
    { label: 'WhatsApp Sent', value: stats.whatsappSent, color: '--accent' },
    { label: 'Replies Received', value: stats.repliesReceived, color: '--info' },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Lead Funnel</h3>
      <div className="space-y-1">
        {steps.map((step, index) => (
          <FunnelStep
            key={step.label}
            label={step.label}
            value={step.value}
            percentage={(step.value / total) * 100}
            color={step.color}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
