import { useState, useEffect, useCallback } from 'react';
import { Lead, DashboardStats, FollowUpStats, ChartData } from '@/types/lead';
import { fetchLeadsFromSheet } from '@/lib/googleSheets';
import { calculateStats, getFollowUpStats, generateChartData } from '@/lib/dataTransform';

interface UseLeadsDataReturn {
  leads: Lead[];
  stats: DashboardStats;
  followUpStats: FollowUpStats;
  chartData: ChartData;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refresh: () => Promise<void>;
}

const defaultStats: DashboardStats = {
  totalLeads: 0,
  newLeads: 0,
  contactedLeads: 0,
  emailsSent: 0,
  whatsappSent: 0,
  repliesReceived: 0,
};

const defaultFollowUpStats: FollowUpStats = {
  overdue: [],
  today: [],
  upcoming: [],
};

const defaultChartData: ChartData = {
  statusDistribution: [],
  cityDistribution: [],
  categoryDistribution: [],
  outreachComparison: [],
};

export function useLeadsData(): UseLeadsDataReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [followUpStats, setFollowUpStats] = useState<FollowUpStats>(defaultFollowUpStats);
  const [chartData, setChartData] = useState<ChartData>(defaultChartData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedLeads = await fetchLeadsFromSheet();
      setLeads(fetchedLeads);
      setStats(calculateStats(fetchedLeads));
      setFollowUpStats(getFollowUpStats(fetchedLeads));
      setChartData(generateChartData(fetchedLeads));
      setLastRefresh(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    leads,
    stats,
    followUpStats,
    chartData,
    isLoading,
    error,
    lastRefresh,
    refresh,
  };
}
