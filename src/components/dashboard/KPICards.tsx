import { Users, UserPlus, Phone, Mail, MessageCircle, Reply } from 'lucide-react';
import { DashboardStats } from '@/types/lead';

interface KPICardsProps {
  stats: DashboardStats;
}

interface KPICardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function KPICard({ label, value, icon, color }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="kpi-value">{value.toLocaleString()}</p>
          <p className="kpi-label">{label}</p>
        </div>
        <div className={`kpi-icon ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function KPICards({ stats }: KPICardsProps) {
  const kpis = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      icon: <Users className="w-5 h-5" />,
      color: 'bg-primary/20 text-primary',
    },
    {
      label: 'New Leads',
      value: stats.newLeads,
      icon: <UserPlus className="w-5 h-5" />,
      color: 'bg-info/20 text-info',
    },
    {
      label: 'Contacted',
      value: stats.contactedLeads,
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-warning/20 text-warning',
    },
    {
      label: 'Emails Sent',
      value: stats.emailsSent,
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-success/20 text-success',
    },
    {
      label: 'WhatsApp Sent',
      value: stats.whatsappSent,
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-accent/20 text-accent',
    },
    {
      label: 'Replies Received',
      value: stats.repliesReceived,
      icon: <Reply className="w-5 h-5" />,
      color: 'bg-primary/20 text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}
