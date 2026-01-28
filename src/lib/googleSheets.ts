import { Lead } from '@/types/lead';

const SHEET_ID = '15wlPalTmA2t0DgQVBi5OVEK-5s12_SWo08uIG76gxfI';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

function parseDate(value: string): Date | null {
  if (!value || value.trim() === '') return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value || value.trim() === '') return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export async function fetchLeadsFromSheet(): Promise<Lead[]> {
  const response = await fetch(SHEET_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  const text = await response.text();
  
  // Google Sheets returns JSONP-like response, extract JSON
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
  if (!jsonMatch) {
    throw new Error('Invalid response format from Google Sheets');
  }

  const data = JSON.parse(jsonMatch[1]);
  
  if (!data.table || !data.table.rows) {
    return [];
  }

  const rows = data.table.rows;
  const cols = data.table.cols;

  // Map column labels to indices
  const columnMap: Record<string, number> = {};
  cols.forEach((col: { label?: string }, index: number) => {
    if (col.label) {
      columnMap[col.label] = index;
    }
  });

  const leads: Lead[] = rows.map((row: { c: Array<{ v?: unknown }> }) => {
    const cells = row.c || [];
    
    const getValue = (colName: string): unknown => {
      const idx = columnMap[colName];
      if (idx === undefined || !cells[idx]) return null;
      return cells[idx].v;
    };

    return {
      Company_Name: safeString(getValue('Company_Name')),
      Category: safeString(getValue('Category')),
      City: safeString(getValue('City')),
      Address: safeString(getValue('Address')),
      Phone: safeString(getValue('Phone')),
      Website: safeString(getValue('Website')),
      Rating: parseNumber(safeString(getValue('Rating'))),
      Reviews: parseNumber(safeString(getValue('Reviews'))),
      Lead_Status: safeString(getValue('Lead_Status')),
      Email_Sent: safeString(getValue('Email_Sent')),
      WhatsApp_Sent: safeString(getValue('WhatsApp_Sent')),
      Email: safeString(getValue('Email')),
      Last_Reply_Date: parseDate(safeString(getValue('Last_Reply_Date'))),
      Followup_Count: parseNumber(safeString(getValue('Followup_Count'))),
      Email_Sent_Date: parseDate(safeString(getValue('Email_Sent_Date'))),
      Dedupe_Key: safeString(getValue('Dedupe_Key')),
      Last_Contacted: parseDate(safeString(getValue('Last_Contacted'))),
      Next_Followup_At: parseDate(safeString(getValue('Next_Followup_At'))),
      WhatsApp_Sent_Date: parseDate(safeString(getValue('WhatsApp_Sent_Date'))),
    };
  });

  return leads.filter(lead => lead.Company_Name || lead.Dedupe_Key);
}
