import { useState, useMemo } from 'react';
import { Search, Download, ChevronUp, ChevronDown, ExternalLink, Mail, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead } from '@/types/lead';
import { exportToCSV } from '@/lib/dataTransform';

interface LeadsTableProps {
  leads: Lead[];
}

type SortField = 'Company_Name' | 'Category' | 'City' | 'Lead_Status' | 'Followup_Count' | 'Last_Contacted' | 'Next_Followup_At';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

// Normalize boolean values: "Yes" -> true, "No"/empty -> false
function normalizeBoolean(value: string): boolean {
  return value?.trim().toLowerCase() === 'yes';
}

// Normalize status: trim whitespace and proper case
function normalizeStatus(status: string): string {
  if (!status || status.trim() === '') return 'Unknown';
  const trimmed = status.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

// Parse ISO date string to Date object or null
function parseISODate(value: Date | string | null): Date | null {
  if (!value) return null;
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

// Format date as YYYY-MM-DD for display
function formatDateDisplay(date: Date | null): string {
  if (!date) return '';
  try {
    return date.toISOString().split('T')[0];
  } catch {
    return 'Invalid date';
  }
}

// Normalized lead for table display
interface NormalizedLead extends Omit<Lead, 'Email_Sent' | 'WhatsApp_Sent' | 'Lead_Status'> {
  Email_Sent: boolean;
  WhatsApp_Sent: boolean;
  Lead_Status: string;
  _original: Lead;
}

function normalizeLead(lead: Lead): NormalizedLead {
  return {
    ...lead,
    Email_Sent: normalizeBoolean(lead.Email_Sent),
    WhatsApp_Sent: normalizeBoolean(lead.WhatsApp_Sent),
    Lead_Status: normalizeStatus(lead.Lead_Status),
    Last_Contacted: parseISODate(lead.Last_Contacted),
    Next_Followup_At: parseISODate(lead.Next_Followup_At),
    Last_Reply_Date: parseISODate(lead.Last_Reply_Date),
    Email_Sent_Date: parseISODate(lead.Email_Sent_Date),
    WhatsApp_Sent_Date: parseISODate(lead.WhatsApp_Sent_Date),
    _original: lead,
  };
}

function StatusBadge({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  let className = 'status-badge status-default';
  
  if (statusLower === 'new') {
    className = 'status-badge status-new';
  } else if (statusLower === 'contacted') {
    className = 'status-badge status-contacted';
  } else if (statusLower === 'replied') {
    className = 'status-badge status-replied';
  }
  
  return <span className={className}>{status}</span>;
}

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <span className={`text-xs ${value ? 'text-success' : 'text-muted-foreground'}`}>
      {value ? <Check className="w-4 h-4 inline" /> : ''}
    </span>
  );
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('Company_Name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Normalize all leads upfront
  const normalizedLeads = useMemo(() => leads.map(normalizeLead), [leads]);

  // Get unique values for filters (using normalized values)
  const cities = useMemo(() => {
    const unique = [...new Set(normalizedLeads.map(l => l.City).filter(Boolean))];
    return unique.sort();
  }, [normalizedLeads]);

  const statuses = useMemo(() => {
    const unique = [...new Set(normalizedLeads.map(l => l.Lead_Status).filter(s => s !== 'Unknown'))];
    return unique.sort();
  }, [normalizedLeads]);

  // Filter and sort leads (using normalized values)
  const filteredLeads = useMemo(() => {
    let result = [...normalizedLeads];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(lead => 
        lead.Company_Name.toLowerCase().includes(searchLower) ||
        lead.Email.toLowerCase().includes(searchLower)
      );
    }

    // City filter
    if (cityFilter !== 'all') {
      result = result.filter(lead => lead.City === cityFilter);
    }

    // Status filter (use normalized status)
    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.Lead_Status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number | Date | null | boolean = a[sortField as keyof NormalizedLead] as string | number | Date | null | boolean;
      let bVal: string | number | Date | null | boolean = b[sortField as keyof NormalizedLead] as string | number | Date | null | boolean;

      // Handle dates
      if (sortField === 'Last_Contacted' || sortField === 'Next_Followup_At') {
        aVal = aVal instanceof Date ? aVal.getTime() : 0;
        bVal = bVal instanceof Date ? bVal.getTime() : 0;
      }

      // Handle numbers
      if (sortField === 'Followup_Count') {
        aVal = aVal as number;
        bVal = bVal as number;
      }

      // Handle strings
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [normalizedLeads, search, cityFilter, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline-block ml-1" />
      : <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return formatDateDisplay(date);
  };

  const handleExport = () => {
    // Export using original lead data
    exportToCSV(filteredLeads.map(l => l._original), `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Check if a followup is overdue (using UTC date comparison)
  const isOverdue = (date: Date | null): boolean => {
    if (!date) return false;
    try {
      const followupDate = date instanceof Date ? date : new Date(date);
      if (isNaN(followupDate.getTime())) return false;
      
      const todayUTC = new Date().toISOString().split('T')[0];
      const followupUTC = followupDate.toISOString().split('T')[0];
      return followupUTC < todayUTC;
    } catch {
      return false;
    }
  };

  return (
    <div className="table-container">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search company or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            
            <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-3">
          Showing {paginatedLeads.length} of {filteredLeads.length} leads
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th 
                className="text-left p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('Company_Name')}
              >
                Company <SortIcon field="Company_Name" />
              </th>
              <th 
                className="text-left p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('Category')}
              >
                Category <SortIcon field="Category" />
              </th>
              <th 
                className="text-left p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('City')}
              >
                City <SortIcon field="City" />
              </th>
              <th 
                className="text-left p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('Lead_Status')}
              >
                Status <SortIcon field="Lead_Status" />
              </th>
              <th className="text-center p-3 text-xs font-medium text-muted-foreground">Email</th>
              <th className="text-center p-3 text-xs font-medium text-muted-foreground">WhatsApp</th>
              <th 
                className="text-center p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('Followup_Count')}
              >
                Follow-ups <SortIcon field="Followup_Count" />
              </th>
              <th 
                className="text-left p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('Last_Contacted')}
              >
                Last Contact <SortIcon field="Last_Contacted" />
              </th>
              <th 
                className="text-left p-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('Next_Followup_At')}
              >
                Next Followup <SortIcon field="Next_Followup_At" />
              </th>
              <th className="text-center p-3 text-xs font-medium text-muted-foreground">Links</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-muted-foreground">
                  No leads found matching your criteria
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead, index) => (
                <tr 
                  key={lead.Dedupe_Key || index} 
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-3 text-sm text-foreground font-medium">{lead.Company_Name || ''}</td>
                  <td className="p-3 text-sm text-muted-foreground">{lead.Category || ''}</td>
                  <td className="p-3 text-sm text-muted-foreground">{lead.City || ''}</td>
                  <td className="p-3"><StatusBadge status={lead.Lead_Status} /></td>
                  <td className="p-3 text-center"><BooleanBadge value={lead.Email_Sent} /></td>
                  <td className="p-3 text-center"><BooleanBadge value={lead.WhatsApp_Sent} /></td>
                  <td className="p-3 text-center text-sm text-muted-foreground">{lead.Followup_Count}</td>
                  <td className="p-3 text-sm text-muted-foreground">{formatDate(lead.Last_Contacted)}</td>
                  <td className={`p-3 text-sm ${isOverdue(lead.Next_Followup_At) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {formatDate(lead.Next_Followup_At)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      {lead.Website && (
                        <a 
                          href={lead.Website.startsWith('http') ? lead.Website : `https://${lead.Website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {lead.Email && (
                        <a 
                          href={`mailto:${lead.Email}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
