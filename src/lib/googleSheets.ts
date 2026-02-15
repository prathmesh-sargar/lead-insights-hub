import { Lead } from '@/types/lead';

const SHEET_ID = '15wlPalTmA2t0DgQVBi5OVEK-5s12_SWo08uIG76gxfI';
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

/* ------------------ helpers ------------------ */

function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  const num = parseFloat(String(value));
  return isNaN(num) ? 0 : num;
}

/**
 * Handles ALL Google Sheet date formats:
 * - Date object
 * - "2026-02-15 19:26"
 * - "15/02/2026 19:26:00"
 * - "Date(2026,1,15,19,26,0)"
 * - ISO strings
 */
function parseDate(value: unknown): Date | null {
  if (!value) return null;

  try {
    // Case 1: already Date
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const str = String(value).trim();
    if (!str) return null;

    // Case 2: Google GViz format
    // Date(2026,1,15,19,26,0)
    if (str.startsWith('Date(')) {
      const parts = str
        .replace('Date(', '')
        .replace(')', '')
        .split(',')
        .map(Number);

      return new Date(
        parts[0],
        parts[1],
        parts[2],
        parts[3] || 0,
        parts[4] || 0,
        parts[5] || 0
      );
    }

    // Case 3: DD/MM/YYYY HH:mm:ss
    if (str.includes('/')) {
      const [datePart, timePart] = str.split(' ');
      const [day, month, year] = datePart.split('/');

      if (!day || !month || !year) return null;

      const iso =
        `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` +
        (timePart ? `T${timePart}` : '');

      const parsed = new Date(iso);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Case 4: YYYY-MM-DD HH:mm
    if (str.includes(' ') && str.includes('-')) {
      const parsed = new Date(str.replace(' ', 'T'));
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Case 5: ISO
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;

  } catch {
    return null;
  }
}

/* ------------------ main fetch ------------------ */

export async function fetchLeadsFromSheet(): Promise<Lead[]> {
  const response = await fetch(SHEET_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  const text = await response.text();

  const jsonMatch = text.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/
  );

  if (!jsonMatch) {
    throw new Error('Invalid response format from Google Sheets');
  }

  const data = JSON.parse(jsonMatch[1]);

  if (!data.table?.rows) return [];

  const rows = data.table.rows;
  const cols = data.table.cols;

  const columnMap: Record<string, number> = {};

  cols.forEach((col: { label?: string }, index: number) => {
    if (col.label) columnMap[col.label] = index;
  });

  const leads: Lead[] = rows.map((row: { c: Array<{ v?: unknown }> }) => {
    const cells = row.c || [];

    const getValue = (colName: string): unknown => {
      const idx = columnMap[colName];
      if (idx === undefined || !cells[idx]) return null;
      return cells[idx].v;
    };

    return {
      Dedupe_Key: safeString(getValue('Dedupe_Key')),

      Company_Name: safeString(getValue('Company_Name')),
      Website: safeString(getValue('Website')),
      Services: safeString(getValue('Services')),
      Email: safeString(getValue('Email')),
      Phone_office: safeString(getValue('Phone_office')),

      State: safeString(getValue('State')),
      City: safeString(getValue('City')),
      Address: safeString(getValue('Address')),

      Rating: parseNumber(getValue('Rating')),
      Reviews: parseNumber(getValue('Reviews')),

      Lead_Status: safeString(getValue('Lead_Status')),
      Email_Sent: safeString(getValue('Email_Sent')),
      WhatsApp_Sent: safeString(getValue('WhatsApp_Sent')),

      Followup_Count: parseNumber(getValue('Followup_Count')),

      Last_Reply_Date: parseDate(getValue('Last_Reply_Date')),
      WhatsApp_Sent_Date: parseDate(getValue('WhatsApp_Sent_Date')),
      Email_Sent_Date: parseDate(getValue('Email_Sent_Date')),

      Last_Contacted: parseDate(getValue('Last_Contacted')),
      Next_Followup_At: parseDate(getValue('Next_Followup_At')),
    };
  });

  return leads.filter(
    lead => lead.Company_Name || lead.Dedupe_Key
  );
}
