"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/common/form-field";
import { CitySelect } from "@/features/search/components/city-select";
import { createRideRequest } from "@/features/requests/actions/create-request";
import {
  createRideRequestSchema,
  type CreateRideRequestInput,
} from "@/validators/ride-request.schema";
import { ROUTES } from "@/constants/routes";
import { useDeviceKey } from "@/hooks/use-device-key";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Passenger "Need a ride" request form. */
export function RequestForm() {
  const router = useRouter();
  const deviceKey = useDeviceKey();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateRideRequestInput>({
    resolver: zodResolver(createRideRequestSchema),
    defaultValues: {
      passengerName: "",
      phone: "",
      fromCity: "Peshawar",
      toCity: "Islamabad",
      date: "",
      seats: 1,
      notes: "",
    },
    mode: "onTouched",
  });

  const fromCity = watch("fromCity");
  const toCity = watch("toCity");

  function onSubmit(values: CreateRideRequestInput) {
    startTransition(async () => {
      const result = await createRideRequest(values, deviceKey ?? "");
      if (result.success) {
        toast.success("Request posted! Drivers can now contact you.");
        router.push(ROUTES.requests);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Your name" error={errors.passengerName?.message} required>
        <Input placeholder="e.g. Ahmed Khan" {...register("passengerName")} aria-invalid={!!errors.passengerName} />
      </FormField>

      <FormField
        label="Phone number"
        error={errors.phone?.message}
        hint="Drivers contact you on WhatsApp / call"
        required
      >
        <Input placeholder="0300 1234567" inputMode="tel" {...register("phone")} aria-invalid={!!errors.phone} />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="From" error={errors.fromCity?.message} required>
          <Controller
            control={control}
            name="fromCity"
            render={({ field }) => (
              <CitySelect value={field.value} onChange={field.onChange} exclude={toCity} />
            )}
          />
        </FormField>
        <FormField label="To" error={errors.toCity?.message} required>
          <Controller
            control={control}
            name="toCity"
            render={({ field }) => (
              <CitySelect value={field.value} onChange={field.onChange} exclude={fromCity} />
            )}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Date" error={errors.date?.message} required>
          <Input type="date" min={todayISO()} {...register("date")} />
        </FormField>
        <FormField label="Seats needed" error={errors.seats?.message} required>
          <Controller
            control={control}
            name="seats"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "seat" : "seats"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <FormField label="Budget (Rs)" error={errors.budget?.message} hint="Optional, per seat">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="e.g. 800"
          {...register("budget", {
            setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
          })}
        />
      </FormField>

      <FormField label="Notes" error={errors.notes?.message} hint="Optional, max 500 chars">
        <Textarea placeholder="Flexible timing, need AC, etc." {...register("notes")} />
      </FormField>

      <Button type="submit" size="xl" className="w-full" loading={isPending}>
        <Send /> Post request
      </Button>
    </form>
  );
}
