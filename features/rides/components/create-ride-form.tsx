"use client";

import { FormField } from "@/components/common/form-field";
import { StepIndicator } from "@/components/common/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/constants/routes";
import { createRide } from "@/features/rides/actions/create-ride";
import { RideCard } from "@/features/rides/components/ride-card";
import { RIDE_OPTION_CONFIG } from "@/features/rides/components/ride-options-config";
import { CitySelect } from "@/features/search/components/city-select";
import { useDeviceKey } from "@/hooks/use-device-key";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getApi } from "@/lib/api-client";
import type { RideDTO } from "@/types";
import { createRideSchema, type CreateRideInput } from "@/validators/ride.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Car, Eye, MapPin, Save, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const STEPS = ["Route & details", "Amenities", "Preview"];
const DRAFT_KEY = "rc.rideDraft";

/** Fields validated when advancing from each step. */
const STEP_FIELDS: (keyof CreateRideInput)[][] = [
  [
    "fromCity",
    "toCity",
    "pickupPoint",
    "dropPoint",
    "date",
    "time",
    "arrivalEstimate",
    "pricePerSeat",
    "seatsTotal",
  ],
  ["options"],
  [],
];

function defaultValues(): CreateRideInput {
  return {
    driverName: "",
    phone: "",
    vehicleType: "Car",
    vehicleModel: "Toyota Corolla",
    vehicleColor: "White",
    vehicleNumber: "",
    pricePerSeat: 500,
    seatsTotal: 4,
    fromCity: "Islamabad",
    toCity: "Peshawar",
    pickupPoint: "",
    dropPoint: "",
    date: "",
    time: "",
    arrivalEstimate: "",
    notes: "",
    options: {
      smoking: false,
      ac: true,
      femaleOnly: false,
      music: true,
    },
    recurrence: { repeatDaily: false, repeatWeekly: false },
    autoExpire: true,
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CreateRideForm() {
  const router = useRouter();
  const deviceKey = useDeviceKey();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useLocalStorageDraft();

  const form = useForm<CreateRideInput>({
    resolver: zodResolver(createRideSchema),
    defaultValues: draft ?? defaultValues(),
    mode: "onTouched",
  });

  // Prefill driver name and phone from authenticated user when available
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getApi<{ name?: string; phone?: string }>("/api/auth/me");
        if (!data || !mounted) return;
        const values = form.getValues();
        const patch: Partial<CreateRideInput> = {};
        if (!values.driverName && data.name) patch.driverName = data.name;
        if (!values.phone && data.phone) patch.phone = data.phone;
        if (Object.keys(patch).length) form.reset({ ...values, ...patch });
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [form]);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = form;

  // Persist a draft on every change so users don't lose progress.
  useEffect(() => {
    const subscription = watch((values) => {
      setDraft(values as CreateRideInput);
    });
    return () => subscription.unsubscribe();
  }, [watch, setDraft]);

  const fromCity = watch("fromCity");
  const toCity = watch("toCity");

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveDraft() {
    setDraft(form.getValues());
    toast.success("Draft saved on this device.");
  }

  function clearDraft() {
    setDraft(null);
    reset(defaultValues());
    setStep(0);
    toast.success("Draft cleared.");
  }

  function onSubmit(values: CreateRideInput) {
    startTransition(async () => {
      const result = await createRide(values, deviceKey ?? "");
      if (result.success) {
        setDraft(null);
        toast.success("Ride published!");
        router.push(ROUTES.rideDetails(result.data.rideId));
      } else {
        toast.error(result.error);
        if (result.fieldErrors) {
          // Jump back to the earliest step containing an error.
          const errorKeys = Object.keys(result.fieldErrors);
          const stepWithError = STEP_FIELDS.findIndex((fields) =>
            fields.some((f) => errorKeys.includes(f)),
          );
          if (stepWithError >= 0) setStep(stepWithError);
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <StepIndicator steps={STEPS} current={step} />

      {/* Step 1 — Route */}
      {step === 0 ? (
        <div className="space-y-4">
          <SectionHeading icon={MapPin} title="Route & timing" />
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
          <FormField label="Pickup point" error={errors.pickupPoint?.message} hint="Optional">
            <Input placeholder="e.g. Faizabad Metro" {...register("pickupPoint")} />
          </FormField>
          <FormField label="Drop point" error={errors.dropPoint?.message} hint="Optional">
            <Input placeholder="e.g. University Town" {...register("dropPoint")} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date" error={errors.date?.message} required>
              <Input type="date" min={todayISO()} {...register("date")} />
            </FormField>
            <FormField label="Time" error={errors.time?.message} required>
              <Input type="time" {...register("time")} />
            </FormField>
          </div>
          <FormField
            label="Arrival estimate"
            error={errors.arrivalEstimate?.message}
            hint="Optional, e.g. ~2h 30m"
          >
            <Input placeholder="~2h 30m" {...register("arrivalEstimate")} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price per seat (Rs)" error={errors.pricePerSeat?.message} required>
              <Input
                type="number"
                inputMode="numeric"
                {...register("pricePerSeat", { valueAsNumber: true })}
              />
            </FormField>
            <FormField label="Total seats" error={errors.seatsTotal?.message} required>
              <Input
                type="number"
                inputMode="numeric"
                max={4}
                {...register("seatsTotal", { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </div>
      ) : null}

      

      {/* Step 2 — Amenities / options */}
      {step === 1 ? (
        <div className="space-y-4">
          <SectionHeading icon={Car} title="Ride options & amenities" />
          <p className="text-sm text-muted-foreground">Choose amenities and rules for your ride.</p>
          <div className="space-y-3">
            {RIDE_OPTION_CONFIG.map((opt) => (
              <label key={opt.key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-sm text-muted-foreground">{opt.description}</div>
                </div>
                <Controller
                  control={control}
                  name={("options." + opt.key) as any}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange as any} />
                  )}
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}


      {/* Step 3 — Preview */}
      {step === 2 ? (
        <div className="space-y-4">
          <SectionHeading icon={Eye} title="Preview your ride" />
          <p className="text-sm text-muted-foreground">
            This is how passengers will see your ride. Go back to edit anything.
          </p>
          <RideCard ride={buildPreviewRide(form.getValues())} />
        </div>
      ) : null}

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={back} disabled={isPending}>
            <ArrowLeft /> Back
          </Button>
        ) : null}

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next} className="flex-1">
            Next <ArrowRight />
          </Button>
        ) : (
          <Button type="submit" className="flex-1" disabled={isPending}>
            <Send /> {isPending ? "Publishing…" : "Publish ride"}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={saveDraft} disabled={isPending}>
          <Save className="h-4 w-4" /> Save draft
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearDraft}
          disabled={isPending}
          className="text-muted-foreground"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
    </form>
  );
}

/** Draft persistence hook returning a nullable draft. */
function useLocalStorageDraft() {
  return useLocalStorage<CreateRideInput | null>(DRAFT_KEY, null);
}

function SectionHeading({
  icon: Icon,
  title,
  small,
}: {
  icon: LucideIconType;
  title: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={small ? "h-4 w-4 text-muted-foreground" : "h-5 w-5 text-primary"} />
      <h2 className={small ? "text-sm font-semibold text-muted-foreground" : "text-base font-semibold"}>
        {title}
      </h2>
    </div>
  );
}

// Local alias to avoid importing the type separately.
type LucideIconType = typeof MapPin;

/** Build a RideDTO from form values for the live preview card. */
function buildPreviewRide(values: CreateRideInput): RideDTO {
  const timestamp =
    values.date && values.time
      ? new Date(`${values.date}T${values.time}:00`).toISOString()
      : new Date().toISOString();

  return {
    id: "preview",
    driver: {
      name: values.driverName || "You",
      phone: values.phone || "",
      verified: false,
    },
    vehicle: {
      type: values.vehicleType as RideDTO["vehicle"]["type"],
      model: values.vehicleModel || "Vehicle",
      color: values.vehicleColor as RideDTO["vehicle"]["color"],
      number: values.vehicleNumber || undefined,
    },
    route: {
      fromCity: values.fromCity,
      toCity: values.toCity,
      pickupPoint: values.pickupPoint || "",
      dropPoint: values.dropPoint || "",
    },
    pricePerSeat: values.pricePerSeat || 0,
    seatsTotal: values.seatsTotal || 0,
    seatsLeft: values.seatsTotal || 0,
    departure: {
      date: values.date || todayISO(),
      time: values.time || "00:00",
      timestamp,
    },
    arrivalEstimate: values.arrivalEstimate || undefined,
    options: values.options,
    notes: values.notes || undefined,
    status: "open",
    featured: false,
    createdAt: new Date().toISOString(),
  };
}
