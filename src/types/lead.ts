export interface Lead {
  Dedupe_Key: string;

  Company_Name: string;
  Website: string;
  Services: string;

  Email: string;
  Phone_office: string;

  State: string;
  City: string;
  Address: string;

  Rating: number;
  Reviews: number;

  Lead_Status: string;
  Email_Sent: string;
  WhatsApp_Sent: string;

  Followup_Count: number;

  Last_Reply_Date: Date | null;
  Email_Sent_Date: Date | null;
  WhatsApp_Sent_Date: Date | null;

  Last_Contacted: Date | null;
  Next_Followup_At: Date | null;
}

/* ---------------- Dashboard ---------------- */

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  emailsSent: number;
  whatsappSent: number;
  repliesReceived: number;
}

/* ---------------- Followup ---------------- */

export interface FollowUpStats {
  overdue: Lead[];
  today: Lead[];
  upcoming: Lead[];
}

/* ---------------- Charts ---------------- */

export interface ChartData {
  statusDistribution: {
    name: string;
    value: number;
  }[];

  cityDistribution: {
    name: string;
    value: number;
  }[];

  categoryDistribution: {
    // still named categoryDistribution
    // but internally uses Services
    name: string;
    value: number;
  }[];

  outreachComparison: {
    name: string;
    email: number;
    whatsapp: number;
  }[];
}
