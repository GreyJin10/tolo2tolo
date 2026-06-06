"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  line1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
});

type AddressForm = z.infer<typeof addressSchema>;

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  async function loadAddresses() {
    const res = await fetch("/api/addresses");
    if (res.ok) setAddresses(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadAddresses(); }, []);

  async function onSubmit(data: AddressForm) {
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Address saved");
      reset();
      setOpen(false);
      loadAddresses();
    } else {
      toast.error("Failed to save");
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Shipping Addresses</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your shipping addresses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="gap-2 rounded-full" size="sm" type="button">
              <Plus className="h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Recipient *</Label>
                  <Input placeholder="Full name" {...register("fullName")} />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input placeholder="13800138000" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <Label>Address *</Label>
                <Input placeholder="Street, building number" {...register("line1")} />
                {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>City *</Label>
                  <Input placeholder="Beijing" {...register("city")} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
                <div>
                  <Label>Province</Label>
                  <Input placeholder="Beijing" {...register("state")} />
                </div>
                <div>
                  <Label>Postal Code *</Label>
                  <Input placeholder="100000" {...register("postalCode")} />
                  {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No addresses yet, click above to add one
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{addr.fullName}</span>
                  <span className="text-muted-foreground text-sm">{addr.phone}</span>
                  {addr.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {addr.line1}，{addr.city} {addr.state || ""} {addr.postalCode}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
