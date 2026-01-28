import { Lead, DashboardStats, FollowUpStats, ChartData } from '@/types/lead';

export function calculateStats(leads: Lead[]): DashboardStats {
  return {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.Lead_Status.toLowerCase() === 'new').length,
    contactedLeads: leads.filter(l => l.Lead_Status.toLowerCase() === 'contacted').length,
    emailsSent: leads.filter(l => l.Email_Sent.toLowerCase() === 'yes').length,
    whatsappSent: leads.filter(l => l.WhatsApp_Sent.toLowerCase() === 'yes').length,
    repliesReceived: leads.filter(l => l.Last_Reply_Date !== null).length,
  };
}

export function getFollowUpStats(leads: Lead[]): FollowUpStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const overdue: Lead[] = [];
  const todayFollowups: Lead[] = [];
  const upcoming: Lead[] = [];

  leads.forEach(lead => {
    if (!lead.Next_Followup_At) return;
    
    const followupDate = new Date(lead.Next_Followup_At);
    followupDate.setHours(0, 0, 0, 0);

    if (followupDate < today) {
      overdue.push(lead);
    } else if (followupDate.getTime() === today.getTime()) {
      todayFollowups.push(lead);
    } else {
      upcoming.push(lead);
    }
  });

  return {
    overdue: overdue.sort((a, b) => 
      (a.Next_Followup_At?.getTime() || 0) - (b.Next_Followup_At?.getTime() || 0)
    ),
    today: todayFollowups,
    upcoming: upcoming.slice(0, 10), // Limit to next 10
  };
}

export function generateChartData(leads: Lead[]): ChartData {
  // Status distribution
  const statusCounts: Record<string, number> = {};
  leads.forEach(lead => {
    const status = lead.Lead_Status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const statusDistribution = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // City distribution
  const cityCounts: Record<string, number> = {};
  leads.forEach(lead => {
    const city = lead.City || 'Unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });
  const cityDistribution = Object.entries(cityCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 cities

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  leads.forEach(lead => {
    const category = lead.Category || 'Unknown';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  const categoryDistribution = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 categories

  // Outreach comparison
  const emailsSent = leads.filter(l => l.Email_Sent.toLowerCase() === 'yes').length;
  const whatsappSent = leads.filter(l => l.WhatsApp_Sent.toLowerCase() === 'yes').length;
  const outreachComparison = [
    { name: 'Outreach', email: emailsSent, whatsapp: whatsappSent }
  ];

  return {
    statusDistribution,
    cityDistribution,
    categoryDistribution,
    outreachComparison,
  };
}

export function exportToCSV(leads: Lead[], filename: string = 'leads-export.csv'): void {
  const headers = [
    'Company_Name', 'Category', 'City', 'Lead_Status', 'Email_Sent', 
    'WhatsApp_Sent', 'Email', 'Phone', 'Website', 'Followup_Count', 
    'Last_Contacted', 'Next_Followup_At'
  ];

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const rows = leads.map(lead => [
    lead.Company_Name,
    lead.Category,
    lead.City,
    lead.Lead_Status,
    lead.Email_Sent,
    lead.WhatsApp_Sent,
    lead.Email,
    lead.Phone,
    lead.Website,
    lead.Followup_Count.toString(),
    formatDate(lead.Last_Contacted),
    formatDate(lead.Next_Followup_At),
  ].map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
