import { useMemo } from "react";
import type { Customer } from "@/types/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface MetricsChartsProps {
  customers: Customer[];
}

export const MetricsCharts = ({ customers }: MetricsChartsProps) => {
  // Status distribution (New, In Talks, Closed)
  const statusData = useMemo(() => {
    const counts: Record<string, number> = { New: 0, "In Talks": 0, Closed: 0 };
    for (const c of customers) counts[c.status] = (counts[c.status] || 0) + 1;
    return [
      { status: "New", count: counts["New"] || 0 },
      { status: "In Talks", count: counts["In Talks"] || 0 },
      { status: "Closed", count: counts["Closed"] || 0 },
    ];
  }, [customers]);

  // Monthly new customers trend
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>(); // key = yyyy-MM
    for (const c of customers) {
      const d = new Date(c.created_at);
      const key = format(d, "yyyy-MM");
      map.set(key, (map.get(key) || 0) + 1);
    }
    const sorted = Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([key, value]) => ({ month: format(new Date(key + "-01"), "MMM yyyy"), customers: value }));
    return sorted;
  }, [customers]);

  const statusConfig = {
    count: {
      label: "Customers",
      color: "hsl(var(--primary))",
    },
  } as const;

  const growthConfig = {
    customers: {
      label: "New Customers",
      color: "hsl(var(--primary))",
    },
  } as const;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="hover-scale animate-fade-in transition-shadow hover:shadow-md hover:ring-1 hover:ring-ring">
        <CardHeader>
          <CardTitle className="text-base">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={statusConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={statusData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" radius={6} fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="hover-scale animate-fade-in transition-shadow hover:shadow-md hover:ring-1 hover:ring-ring">
        <CardHeader>
          <CardTitle className="text-base">Monthly New Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={growthConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={monthlyData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="customers" stroke="var(--color-customers)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default MetricsCharts;
