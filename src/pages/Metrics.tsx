import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { MetricsDashboard } from "@/components/crm/MetricsDashboard";
import { MetricsCharts } from "@/components/crm/MetricsCharts";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Metrics = () => {
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setCustomers((data || []) as Customer[]);
      } catch (e) {
        // no toast here to keep page minimal; Index handles full UX
        console.error("Failed to fetch customers for metrics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [user]);

  const title = useMemo(() => "CRM Metrics | Micro CRM", []);
  const description = useMemo(
    () =>
      "View CRM metrics: total customers, new prospects, in talks, and closed deals.",
    []
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Preparing your metrics</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="/metrics" />
      </Helmet>

      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CRM Metrics</h1>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link to="/">← Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-muted-foreground">Loading metrics…</div>
        ) : (
          <>
            <MetricsDashboard customers={customers} />
            <MetricsCharts customers={customers} />
          </>
        )}
      </main>
    </div>
  );
};

export default Metrics;
