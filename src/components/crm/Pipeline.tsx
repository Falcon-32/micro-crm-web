import { Customer } from "@/types/customer";
import { CustomerCard } from "./CustomerCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PipelineProps {
  customers: Customer[];
  onStatusChange: (customerId: string, newStatus: Customer['status']) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const PIPELINE_STAGES: { status: Customer['status']; title: string; color: string }[] = [
  { status: 'New', title: 'New Prospects', color: 'bg-blue-50 border-blue-200' },
  { status: 'In Talks', title: 'In Talks', color: 'bg-yellow-50 border-yellow-200' },
  { status: 'Closed', title: 'Closed Deals', color: 'bg-green-50 border-green-200' },
];

export const Pipeline = ({ customers, onStatusChange, onEdit, onDelete }: PipelineProps) => {
  const getCustomersForStatus = (status: Customer['status']) => {
    return customers.filter(customer => customer.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PIPELINE_STAGES.map((stage) => (
        <Card key={stage.status} className={`${stage.color}`}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {stage.title} ({getCustomersForStatus(stage.status).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getCustomersForStatus(stage.status).map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {getCustomersForStatus(stage.status).length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No customers in this stage
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};