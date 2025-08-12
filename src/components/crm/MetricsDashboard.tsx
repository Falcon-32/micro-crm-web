import { Customer } from "@/types/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp, Clock } from "lucide-react";

interface MetricsDashboardProps {
  customers: Customer[];
}

export const MetricsDashboard = ({ customers }: MetricsDashboardProps) => {
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(c => c.status === 'New').length;
  const inTalks = customers.filter(c => c.status === 'In Talks').length;
  const closedDeals = customers.filter(c => c.status === 'Closed').length;
  
  const conversionRate = totalCustomers > 0 ? Math.round((closedDeals / totalCustomers) * 100) : 0;

  const metrics = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "New Prospects",
      value: newCustomers,
      icon: Clock,
      iconBg: "bg-ring/10",
      iconColor: "text-ring",
    },
    {
      title: "In Talks",
      value: inTalks,
      icon: TrendingUp,
      iconBg: "bg-secondary",
      iconColor: "text-secondary-foreground",
    },
    {
      title: "Closed Deals",
      value: closedDeals,
      icon: UserCheck,
      iconBg: "bg-muted",
      iconColor: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover-scale animate-fade-in transition-shadow hover:shadow-md hover:ring-1 hover:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${metric.iconBg}`}>
              <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.title === "Closed Deals" && (
              <p className="text-xs text-muted-foreground">
                {conversionRate}% conversion rate
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};