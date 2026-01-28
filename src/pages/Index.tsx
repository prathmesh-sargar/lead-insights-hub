import { useLeadsData } from '@/hooks/useLeadsData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICards } from '@/components/dashboard/KPICards';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { FollowUpSection } from '@/components/dashboard/FollowUpSection';
import { Charts } from '@/components/dashboard/Charts';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { EmptyState } from '@/components/dashboard/EmptyState';

const Index = () => {
  const { 
    leads, 
    stats, 
    followUpStats, 
    chartData, 
    isLoading, 
    error, 
    lastRefresh, 
    refresh 
  } = useLeadsData();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          lastRefresh={lastRefresh} 
          isLoading={isLoading} 
          onRefresh={refresh} 
        />

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : leads.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <KPICards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <FunnelChart stats={stats} />
              <FollowUpSection followUpStats={followUpStats} />
            </div>
            
            <Charts chartData={chartData} />
            
            <LeadsTable leads={leads} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
