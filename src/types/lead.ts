export interface Lead {
  Company_Name: string;
  Category: string;
  City: string;
  Address: string;
  Phone: string;
  Website: string;
  Rating: number;
  Reviews: number;
  Lead_Status: string;
  Email_Sent: string;
  WhatsApp_Sent: string;
  Email: string;
  Last_Reply_Date: Date | null;
  Followup_Count: number;
  Email_Sent_Date: Date | null;
  Dedupe_Key: string;
  Last_Contacted: Date | null;
  Next_Followup_At: Date | null;
  WhatsApp_Sent_Date: Date | null;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  emailsSent: number;
  whatsappSent: number;
  repliesReceived: number;
}

export interface FollowUpStats {
  overdue: Lead[];
  today: Lead[];
  upcoming: Lead[];
}

export interface ChartData {
  statusDistribution: { name: string; value: number }[];
  cityDistribution: { name: string; value: number }[];
  categoryDistribution: { name: string; value: number }[];
  outreachComparison: { name: string; email: number; whatsapp: number }[];
}
