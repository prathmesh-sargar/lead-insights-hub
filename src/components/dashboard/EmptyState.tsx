import { Database } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Database className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-1">No leads found</h3>
        <p className="text-sm text-muted-foreground">The spreadsheet appears to be empty or has no valid data.</p>
      </div>
    </div>
  );
}
