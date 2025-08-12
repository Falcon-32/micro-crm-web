import { Customer } from "@/types/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Mail, Phone, Building } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onStatusChange: (customerId: string, newStatus: Customer['status']) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export const CustomerCard = ({ customer, onStatusChange, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex justify-between items-start">
          <span>{customer.name}</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(customer)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(customer.id)}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {customer.company && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-3 w-3" />
            <span>{customer.company}</span>
          </div>
        )}
        {customer.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.notes && (
          <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {customer.notes}
          </p>
        )}
        <Select
          value={customer.status}
          onValueChange={(value) => onStatusChange(customer.id, value as Customer['status'])}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="In Talks">In Talks</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};