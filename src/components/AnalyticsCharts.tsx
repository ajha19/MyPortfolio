import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// Modern editorial color palette mapped to portfolio theme variables
const PIE_COLORS = [
  "var(--fg-strong)", // Primary contrast element (white in dark, black in light)
  "var(--ok)", // Accent/Success element (greenish)
  "var(--muted)", // Secondary slate element
  "var(--faint)", // Low-contrast slate element
  "color-mix(in srgb, var(--fg-strong) 40%, transparent)",
];

interface ChartTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  valueSuffix?: string;
}

function CustomTooltip({ active, payload, label, valueSuffix = "" }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-md font-sans text-xs">
        {label && (
          <p className="mb-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-faint">
            {label}
          </p>
        )}
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color || "var(--fg-strong)" }}
            />
            <span className="font-medium text-fg-strong">{item.value}</span>
            <span className="text-muted">
              {item.name}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

interface TrendData {
  date: string;
  count: number;
}

export function DailyTrendChart({ data }: { data: TrendData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-faint">
        No visit activity recorded in this period.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="var(--faint)"
            fontSize={11}
            fontFamily="var(--font-mono)"
            tickLine={false}
            dy={8}
          />
          <YAxis
            stroke="var(--faint)"
            fontSize={11}
            fontFamily="var(--font-mono)"
            tickLine={false}
            allowDecimals={false}
            dx={-8}
          />
          <Tooltip
            content={<CustomTooltip valueSuffix=" Visits" />}
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Visitors"
            stroke="var(--fg-strong)"
            strokeWidth={2}
            dot={{ fill: "var(--card)", stroke: "var(--fg-strong)", strokeWidth: 1.5, r: 3.5 }}
            activeDot={{ fill: "var(--fg-strong)", stroke: "var(--card)", strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DistributionEntry {
  name: string;
  value: number;
}

export function DistributionPieChart({
  data,
  valueSuffix = " Visits",
}: {
  data: DistributionEntry[];
  valueSuffix?: string;
}) {
  const filteredData = data.filter((d) => d.value > 0);

  if (filteredData.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center font-mono text-xs text-faint">
        No composition data.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="45%"
            innerRadius="58%"
            outerRadius="80%"
            paddingAngle={3}
            dataKey="value"
          >
            {filteredData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                stroke="var(--card)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip valueSuffix={valueSuffix} />} />
          <Legend
            verticalAlign="bottom"
            iconSize={8}
            iconType="circle"
            formatter={(value) => (
              <span className="font-sans text-[0.80rem] text-fg hover:text-fg-strong">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProjectEntry {
  name: string;
  count: number;
}

export function ProjectsBarChart({ data }: { data: ProjectEntry[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-faint">
        No project views or clicks tracked in this period.
      </div>
    );
  }

  return (
    <div className="h-68 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            stroke="var(--faint)"
            fontSize={11}
            fontFamily="var(--font-mono)"
            tickLine={false}
            allowDecimals={false}
            dy={4}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="var(--fg)"
            fontSize={11.5}
            fontFamily="var(--font-sans)"
            tickLine={false}
            width={120}
            dx={-4}
          />
          <Tooltip
            content={<CustomTooltip valueSuffix=" Clicks" />}
            cursor={{ fill: "var(--pill)", opacity: 0.7 }}
          />
          <Bar
            dataKey="count"
            name="Interactions"
            fill="var(--fg-strong)"
            radius={[0, 4, 4, 0]}
            maxBarSize={28}
          >
            {data.map((_entry, index) => (
              // Give the top project a subtle brand color highlighting, rest contrast
              <Cell key={`cell-${index}`} fill={index === 0 ? "var(--ok)" : "var(--fg-strong)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
