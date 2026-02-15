// import { Lead, DashboardStats, FollowUpStats, ChartData } from '@/types/lead';

// export function calculateStats(leads: Lead[]): DashboardStats {
//   return {
//     totalLeads: leads.length,
//     newLeads: leads.filter(l => l.Lead_Status.toLowerCase() === 'new').length,
//     contactedLeads: leads.filter(l => l.Lead_Status.toLowerCase() === 'contacted').length,
//     emailsSent: leads.filter(l => l.Email_Sent.toLowerCase() === 'yes').length,
//     whatsappSent: leads.filter(l => l.WhatsApp_Sent.toLowerCase() === 'yes').length,
//     repliesReceived: leads.filter(l => l.Last_Reply_Date !== null).length,
//   };
// }

// // Get UTC date string (YYYY-MM-DD) for comparison
// function getUTCDateString(date: Date): string {
//   return date.toISOString().split('T')[0];
// }

// export function getFollowUpStats(leads: Lead[]): FollowUpStats {
//   // Get today's date in UTC (YYYY-MM-DD format)
//   const todayUTC = getUTCDateString(new Date());

//   const overdue: Lead[] = [];
//   const todayFollowups: Lead[] = [];
//   const upcoming: Lead[] = [];

//   leads.forEach(lead => {
//     if (!lead.Next_Followup_At) return;
    
//     try {
//       // Ensure we have a valid Date object
//       const followupDate = lead.Next_Followup_At instanceof Date 
//         ? lead.Next_Followup_At 
//         : new Date(lead.Next_Followup_At);
      
//       if (isNaN(followupDate.getTime())) return;
      
//       // Compare only the date part in UTC
//       const followupUTC = getUTCDateString(followupDate);

//       if (followupUTC < todayUTC) {
//         overdue.push(lead);
//       } else if (followupUTC === todayUTC) {
//         todayFollowups.push(lead);
//       } else {
//         upcoming.push(lead);
//       }
//     } catch {
//       // Skip rows with invalid dates safely
//       return;
//     }
//   });

//   return {
//     overdue: overdue.sort((a, b) => 
//       (a.Next_Followup_At?.getTime() || 0) - (b.Next_Followup_At?.getTime() || 0)
//     ),
//     today: todayFollowups,
//     upcoming: upcoming.slice(0, 10), // Limit to next 10
//   };
// }

// export function generateChartData(leads: Lead[]): ChartData {
//   // Status distribution
//   const statusCounts: Record<string, number> = {};
//   leads.forEach(lead => {
//     const status = lead.Lead_Status || 'Unknown';
//     statusCounts[status] = (statusCounts[status] || 0) + 1;
//   });
//   const statusDistribution = Object.entries(statusCounts)
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value);

//   // City distribution
//   const cityCounts: Record<string, number> = {};
//   leads.forEach(lead => {
//     const city = lead.City || 'Unknown';
//     cityCounts[city] = (cityCounts[city] || 0) + 1;
//   });
//   const cityDistribution = Object.entries(cityCounts)
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 8); // Top 8 cities

//   // Category distribution
//   const categoryCounts: Record<string, number> = {};
//   leads.forEach(lead => {
//     const category = lead.Category || 'Unknown';
//     categoryCounts[category] = (categoryCounts[category] || 0) + 1;
//   });
//   const categoryDistribution = Object.entries(categoryCounts)
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 8); // Top 8 categories

//   // Outreach comparison
//   const emailsSent = leads.filter(l => l.Email_Sent.toLowerCase() === 'yes').length;
//   const whatsappSent = leads.filter(l => l.WhatsApp_Sent.toLowerCase() === 'yes').length;
//   const outreachComparison = [
//     { name: 'Outreach', email: emailsSent, whatsapp: whatsappSent }
//   ];

//   return {
//     statusDistribution,
//     cityDistribution,
//     categoryDistribution,
//     outreachComparison,
//   };
// }

// export function exportToCSV(leads: Lead[], filename: string = 'leads-export.csv'): void {
//   const headers = [
//     'Company_Name', 'Category', 'City', 'Lead_Status', 'Email_Sent', 
//     'WhatsApp_Sent', 'Email', 'Phone', 'Website', 'Followup_Count', 
//     'Last_Contacted', 'Next_Followup_At'
//   ];

//   const formatDate = (date: Date | null): string => {
//     if (!date) return '';
//     return date.toISOString().split('T')[0];
//   };

//   const rows = leads.map(lead => [
//     lead.Company_Name,
//     lead.Category,
//     lead.City,
//     lead.Lead_Status,
//     lead.Email_Sent,
//     lead.WhatsApp_Sent,
//     lead.Email,
//     lead.Phone,
//     lead.Website,
//     lead.Followup_Count.toString(),
//     formatDate(lead.Last_Contacted),
//     formatDate(lead.Next_Followup_At),
//   ].map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','));

//   const csv = [headers.join(','), ...rows].join('\n');
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
// }

import {
  Lead,
  DashboardStats,
  FollowUpStats,
  ChartData
} from '@/types/lead';

export function calculateStats(leads: Lead[]): DashboardStats {
  return {
    totalLeads: leads.length,
    newLeads: leads.filter(
      l => l.Lead_Status.toLowerCase() === 'new'
    ).length,
    contactedLeads: leads.filter(
      l => l.Lead_Status.toLowerCase() === 'contacted'
    ).length,
    emailsSent: leads.filter(
      l => l.Email_Sent.toLowerCase() === 'yes'
    ).length,
    whatsappSent: leads.filter(
      l => l.WhatsApp_Sent.toLowerCase() === 'yes'
    ).length,
    repliesReceived: leads.filter(
      l => l.Last_Reply_Date !== null
    ).length,
  };
}

function getUTCDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getFollowUpStats(leads: Lead[]): FollowUpStats {
  const todayUTC = getUTCDateString(new Date());

  const overdue: Lead[] = [];
  const todayFollowups: Lead[] = [];
  const upcoming: Lead[] = [];

  leads.forEach(lead => {
    if (!lead.Next_Followup_At) return;

    const followupDate =
      lead.Next_Followup_At instanceof Date
        ? lead.Next_Followup_At
        : new Date(lead.Next_Followup_At);

    if (isNaN(followupDate.getTime())) return;

    const followupUTC = getUTCDateString(followupDate);

    if (followupUTC < todayUTC) overdue.push(lead);
    else if (followupUTC === todayUTC)
      todayFollowups.push(lead);
    else upcoming.push(lead);
  });

  return {
    overdue: overdue.sort(
      (a, b) =>
        (a.Next_Followup_At?.getTime() || 0) -
        (b.Next_Followup_At?.getTime() || 0)
    ),
    today: todayFollowups,
    upcoming: upcoming.slice(0, 10),
  };
}

export function generateChartData(leads: Lead[]): ChartData {
  const statusCounts: Record<string, number> = {};
  leads.forEach(lead => {
    const status = lead.Lead_Status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statusDistribution = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const cityCounts: Record<string, number> = {};
  leads.forEach(lead => {
    const city = lead.City || 'Unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  const cityDistribution = Object.entries(cityCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const serviceCounts: Record<string, number> = {};
  leads.forEach(lead => {
    const service = lead.Services || 'Unknown';
    serviceCounts[service] =
      (serviceCounts[service] || 0) + 1;
  });

  const servicesDistribution = Object.entries(serviceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const emailsSent = leads.filter(
    l => l.Email_Sent.toLowerCase() === 'yes'
  ).length;

  const whatsappSent = leads.filter(
    l => l.WhatsApp_Sent.toLowerCase() === 'yes'
  ).length;

  const outreachComparison = [
    { name: 'Outreach', email: emailsSent, whatsapp: whatsappSent }
  ];

  return {
    statusDistribution,
    cityDistribution,
    categoryDistribution: servicesDistribution,
    outreachComparison,
  };
}

export function exportToCSV(
  leads: Lead[],
  filename: string = 'leads-export.csv'
): void {

  const headers = [
    'Company_Name',
    'Services',
    'City',
    'State',
    'Lead_Status',
    'Email_Sent',
    'WhatsApp_Sent',
    'Email',
    'Phone_office',
    'Website',
    'Followup_Count',
    'Last_Contacted',
    'Next_Followup_At'
  ];

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const rows = leads.map(lead => [
    lead.Company_Name,
    lead.Services,
    lead.City,
    lead.State,
    lead.Lead_Status,
    lead.Email_Sent,
    lead.WhatsApp_Sent,
    lead.Email,
    lead.Phone_office,
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
