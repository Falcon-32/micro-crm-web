import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  customer?: Customer | null;
  loading?: boolean;
}

export const CustomerForm = ({ isOpen, onClose, onSubmit, customer, loading }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New" as Customer['status'],
    notes: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        company: customer.company || "",
        status: customer.status,
        notes: customer.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "New",
        notes: "",
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      notes: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            {customer ? "Update customer information" : "Add a new customer to your CRM"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Customer Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Customer['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Talks">In Talks</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : customer ? "Update" : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};