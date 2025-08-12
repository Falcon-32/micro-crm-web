import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Pipeline } from "@/components/crm/Pipeline";
import { CustomerForm } from "@/components/crm/CustomerForm";
import { MetricsDashboard } from "@/components/crm/MetricsDashboard";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers((data || []) as Customer[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  const handleCustomerSubmit = async (customerData: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    setLoading(true);
    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', editingCustomer.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([{ ...customerData, user_id: user.id }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
      }

      setShowCustomerForm(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (customerId: string, newStatus: Customer['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .update({ status: newStatus })
        .eq('id', customerId);

      if (error) throw error;
      
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, status: newStatus }
            : customer
        )
      );
      
      toast({
        title: "Success",
        description: "Customer status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleDelete = async (customerId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your CRM</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Micro CRM</h1>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/metrics">Metrics</Link>
            </Button>
            <Button onClick={() => setShowCustomerForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <MetricsDashboard customers={customers} />
        <Pipeline
          customers={customers}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <CustomerForm
        isOpen={showCustomerForm}
        onClose={() => {
          setShowCustomerForm(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleCustomerSubmit}
        customer={editingCustomer}
        loading={loading}
      />
    </div>
  );
};

export default Index;
