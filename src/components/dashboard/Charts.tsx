import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChartData } from '@/types/lead';

interface ChartsProps {
  chartData: ChartData;
}

const COLORS = [
  'hsl(187, 85%, 53%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 65%, 60%)',
  'hsl(199, 89%, 48%)',
  'hsl(0, 72%, 51%)',
  'hsl(220, 70%, 50%)',
  'hsl(160, 60%, 45%)',
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string; dataKey?: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label || payload[0]?.name}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {item.dataKey || 'Value'}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatusChart({ data }: { data: ChartData['statusDistribution'] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function CityChart({ data }: { data: ChartData['cityDistribution'] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
        <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} 
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="hsl(187, 85%, 53%)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryChart({ data }: { data: ChartData['categoryDistribution'] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} 
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OutreachComparisonChart({ data }: { data: ChartData['outreachComparison'] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 20 }}>
        <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
        <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="email" fill="hsl(142, 76%, 36%)" name="Email" radius={[4, 4, 0, 0]} />
        <Bar dataKey="whatsapp" fill="hsl(187, 85%, 53%)" name="WhatsApp" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Charts({ chartData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="chart-container">
        <h3 className="chart-title">Lead Status Distribution</h3>
        <StatusChart data={chartData.statusDistribution} />
      </div>
      
      <div className="chart-container">
        <h3 className="chart-title">City-wise Lead Count</h3>
        <CityChart data={chartData.cityDistribution} />
      </div>
      
      <div className="chart-container">
        <h3 className="chart-title">Category-wise Lead Count</h3>
        <CategoryChart data={chartData.categoryDistribution} />
      </div>
      
      <div className="chart-container">
        <h3 className="chart-title">Email vs WhatsApp Outreach</h3>
        <OutreachComparisonChart data={chartData.outreachComparison} />
      </div>
    </div>
  );
}
