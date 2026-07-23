"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VEHICLE_COLORS, VEHICLE_TYPE_VALUES } from "@/constants/vehicle-types";
import { useEffect, useState } from "react";
import { getApi, putApi } from "@/lib/api-client";
import { toast } from "sonner";

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getApi<{ name?: string; phone?: string; vehicle?: { type?: string; model?: string; color?: string; number?: string } }>("/api/auth/me");
        if (!mounted || !data) return;
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setVehicleType(data.vehicle?.type ?? "");
        setVehicleModel(data.vehicle?.model ?? "");
        setVehicleColor(data.vehicle?.color ?? "");
        setVehicleNumber(data.vehicle?.number ?? "");
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    try {
      await putApi<{ success: boolean; user?: { name?: string; phone?: string; vehicle?: { type?: string; model?: string; color?: string; number?: string } } }>('/api/user/profile', { name, phone, vehicle: { type: vehicleType, model: vehicleModel, color: vehicleColor, number: vehicleNumber } });
      toast.success("Profile saved");
    } catch (e) {
      // handled by api-client
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Vehicle Model</Label>
        <Input value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Toyota Corolla" />
      </div>
      <div className="space-y-1">
        <Label>Vehicle Number</Label>
        <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="ABC-1234" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={vehicleType || ""} onValueChange={(v) => setVehicleType(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Car" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPE_VALUES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color</Label>
          <Select value={vehicleColor || ""} onValueChange={(v) => setVehicleColor(v)}>
            <SelectTrigger>
              <SelectValue placeholder="White" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_COLORS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={save} disabled={saving} className="w-full">{saving ? 'Saving…' : 'Save profile'}</Button>
      </div>
    </div>
  );
}
