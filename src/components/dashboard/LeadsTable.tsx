import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Mail,
  Check
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Lead } from '@/types/lead';
import { exportToCSV } from '@/lib/dataTransform';
import { log } from 'console';

interface LeadsTableProps {
  leads: Lead[];
}

type SortField =
  | 'Company_Name'
  | 'Services'
  | 'City'
  | 'Lead_Status'
  | 'Followup_Count'
  | 'Last_Contacted'
  | 'Next_Followup_At';

type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

/* ------------------ helpers ------------------ */

const normalizeBoolean = (v: string) =>
  v?.trim().toLowerCase() === 'yes';

const normalizeStatus = (s: string) => {
  if (!s) return 'Unknown';
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
};

const parseDate = (value: Date | string | null): Date | null => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const formatDate = (d: Date | null) =>
  d ? d.toISOString().split('T')[0] : '';

/* ------------------ normalized type ------------------ */

interface NormalizedLead
  extends Omit<Lead, 'Email_Sent' | 'WhatsApp_Sent' | 'Lead_Status'> {
  Email_Sent: boolean;
  WhatsApp_Sent: boolean;
  Lead_Status: string;
  _original: Lead;
}

const normalizeLead = (lead: Lead): NormalizedLead => ({
  ...lead,
  Email_Sent: normalizeBoolean(lead.Email_Sent),
  WhatsApp_Sent: normalizeBoolean(lead.WhatsApp_Sent),
  Lead_Status: normalizeStatus(lead.Lead_Status),
  Last_Contacted: parseDate(lead.Last_Contacted),
  Next_Followup_At: parseDate(lead.Next_Followup_At),
  _original: lead,
});

/* ------------------ UI components ------------------ */

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();

  let cls = 'status-badge status-default';
  if (s === 'new') cls = 'status-badge status-new';
  if (s === 'contacted') cls = 'status-badge status-contacted';
  if (s === 'replied') cls = 'status-badge status-replied';

  return <span className={cls}>{status}</span>;
}

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <span className={`text-xs ${value ? 'text-success' : 'text-muted-foreground'}`}>
      {value ? <Check className="w-4 h-4 inline" /> : ''}
    </span>
  );
}

/* ------------------ main component ------------------ */

export function LeadsTable({ leads }: LeadsTableProps) {

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('Company_Name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedLeads = useMemo(
    () => leads.map(normalizeLead),
    [leads]
  );

  /* ---------- filters ---------- */

  const cities = useMemo(
    () => [...new Set(normalizedLeads.map(l => l.City).filter(Boolean))].sort(),
    [normalizedLeads]
  );

  const statuses = useMemo(
    () => [...new Set(normalizedLeads.map(l => l.Lead_Status))].sort(),
    [normalizedLeads]
  );

  const filteredLeads = useMemo(() => {
    let result = [...normalizedLeads];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        l =>
          l.Company_Name.toLowerCase().includes(s) ||
          l.Email.toLowerCase().includes(s)
      );
    }

    if (cityFilter !== 'all')
      result = result.filter(l => l.City === cityFilter);

    if (statusFilter !== 'all')
      result = result.filter(l => l.Lead_Status === statusFilter);

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [normalizedLeads, search, cityFilter, statusFilter, sortField, sortDirection]);

  /* ---------- pagination ---------- */

  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

 console.log('Total Leads after filtering:', filteredLeads.length);
  console.log('Paginated Leads:', paginatedLeads);

  /* ---------- handlers ---------- */

  const handleSort = (field: SortField) => {
    if (sortField === field)
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () =>
    exportToCSV(
      filteredLeads.map(l => l._original),
      `leads-${new Date().toISOString().split('T')[0]}.csv`
    );

  /* ------------------ UI ------------------ */

  return (
    <div className="table-container">

      {/* HEADER */}
      <div className="p-4 border-b flex flex-col md:flex-row gap-3 justify-between">

        <div className="flex gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search company or email..."
              className="pl-9"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('Company_Name')}>
                Company
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('Services')}>
                Services
              </th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Email</th>
              <th className="p-3 text-center">WhatsApp</th>
              <th className="p-3 text-center">Followups</th>
              <th className="p-3 text-left">Last Contact Date </th>
              <th className="p-3 text-left">Next Followup Date</th>
              <th className="p-3 text-center">Links</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLeads.map((lead, i) => (
              <tr key={lead.Dedupe_Key || i} className="border-b hover:bg-muted/20">
                <td className="p-3 font-medium">{lead.Company_Name}</td>
                <td className="p-3">{lead.Services}</td>
                <td className="p-3">{lead.City}</td>
                <td className="p-3"><StatusBadge status={lead.Lead_Status} /></td>
                <td className="p-3 text-center"><BooleanBadge value={lead.Email_Sent} /></td>
                <td className="p-3 text-center"><BooleanBadge value={lead.WhatsApp_Sent} /></td>
                <td className="p-3 text-center">{lead.Followup_Count}</td>
                <td className="p-3">{formatDate(lead.Last_Contacted)}</td>
                <td className="p-3">{formatDate(lead.Next_Followup_At)}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  {lead.Website && (
                    <a href={lead.Website} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {lead.Email && (
                    <a href={`mailto:${lead.Email}`}>
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
