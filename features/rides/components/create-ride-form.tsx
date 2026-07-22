"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MapPin,
  Car,
  SlidersHorizontal,
  Eye,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Trash2,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/common/form-field";
import { StepIndicator } from "@/components/common/step-indicator";
import { CitySelect } from "@/features/search/components/city-select";
import { RideCard } from "@/features/rides/components/ride-card";
import { RIDE_OPTION_CONFIG } from "@/features/rides/components/ride-options-config";
import { createRide } from "@/features/rides/actions/create-ride";
import { createRideSchema, type CreateRideInput } from "@/validators/ride.schema";
import { VEHICLE_TYPES, VEHICLE_COLORS, VEHICLE_TYPE_META } from "@/constants/vehicle-types";
import { ROUTES } from "@/constants/routes";
import { useDeviceKey } from "@/hooks/use-device-key";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { RideDTO } from "@/types";

const STEPS = ["Route", "Vehicle", "Options", "Preview"];
const DRAFT_KEY = "rc.rideDraft";

/** Fields validated when advancing from each step. */
const STEP_FIELDS: (keyof CreateRideInput)[][] = [
  ["fromCity", "toCity", "pickupPoint", "dropPoint", "date", "time", "arrivalEstimate"],
  ["driverName", "phone", "vehicleType", "vehicleModel", "vehicleColor", "vehicleNumber", "pricePerSeat", "seatsTotal"],
  ["options", "recurrence", "notes"],
  [],
];

function defaultValues(): CreateRideInput {
  return {
    driverName: "",
    phone: "",
    vehicleType: "Car",
    vehicleModel: "",
    vehicleColor: "White",
    vehicleNumber: "",
    pricePerSeat: 500,
    seatsTotal: 3,
    fromCity: "Islamabad",
    toCity: "Peshawar",
    pickupPoint: "",
    dropPoint: "",
    date: "",
    time: "",
    arrivalEstimate: "",
    notes: "",
    options: {
      luggage: true,
      smoking: false,
      ac: true,
      femaleOnly: false,
      music: true,
      pets: false,
      returnTrip: false,
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
  const vehicleType = watch("vehicleType");

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
          <FormField label="Pickup point" error={errors.pickupPoint?.message} required>
            <Input placeholder="e.g. Faizabad Metro" {...register("pickupPoint")} />
          </FormField>
          <FormField label="Drop point" error={errors.dropPoint?.message} required>
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
        </div>
      ) : null}

      {/* Step 2 — Vehicle & price */}
      {step === 1 ? (
        <div className="space-y-4">
          <SectionHeading icon={Car} title="Driver, vehicle & price" />
          <FormField label="Your name" error={errors.driverName?.message} required>
            <Input placeholder="e.g. Bilal Ahmed" {...register("driverName")} />
          </FormField>
          <FormField
            label="Phone number"
            error={errors.phone?.message}
            hint="Passengers contact you on WhatsApp / call"
            required
          >
            <Input placeholder="0300 1234567" inputMode="tel" {...register("phone")} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Vehicle type" error={errors.vehicleType?.message} required>
              <Controller
                control={control}
                name="vehicleType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Color" error={errors.vehicleColor?.message} required>
              <Controller
                control={control}
                name="vehicleColor"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_COLORS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
          <FormField label="Vehicle model" error={errors.vehicleModel?.message} required>
            <Input placeholder="e.g. Toyota Corolla" {...register("vehicleModel")} />
          </FormField>
          <FormField
            label="Vehicle number"
            error={errors.vehicleNumber?.message}
            hint="Optional"
          >
            <Input placeholder="e.g. ABC-123" {...register("vehicleNumber")} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price per seat (Rs)" error={errors.pricePerSeat?.message} required>
              <Input
                type="number"
                inputMode="numeric"
                {...register("pricePerSeat", { valueAsNumber: true })}
              />
            </FormField>
            <FormField
              label="Total seats"
              error={errors.seatsTotal?.message}
              hint={`Max ${VEHICLE_TYPE_META[vehicleType as keyof typeof VEHICLE_TYPE_META]?.maxSeats ?? 30}`}
              required
            >
              <Input
                type="number"
                inputMode="numeric"
                {...register("seatsTotal", { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </div>
      ) : null}

      {/* Step 3 — Options */}
      {step === 2 ? (
        <div className="space-y-4">
          <SectionHeading icon={SlidersHorizontal} title="Ride options" />
          <div className="space-y-2">
            {RIDE_OPTION_CONFIG.map((option) => {
              const Icon = option.icon;
              return (
                <Controller
                  key={option.key}
                  control={control}
                  name={`options.${option.key}` as const}
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                      <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                    </label>
                  )}
                />
              );
            })}
          </div>

          <div className="space-y-2">
            <SectionHeading icon={Repeat} title="Recurrence & expiry" small />
            <Controller
              control={control}
              name="recurrence.repeatDaily"
              render={({ field }) => (
                <ToggleRow label="Repeat daily" checked={Boolean(field.value)} onChange={field.onChange} />
              )}
            />
            <Controller
              control={control}
              name="recurrence.repeatWeekly"
              render={({ field }) => (
                <ToggleRow label="Repeat weekly" checked={Boolean(field.value)} onChange={field.onChange} />
              )}
            />
            <Controller
              control={control}
              name="autoExpire"
              render={({ field }) => (
                <ToggleRow
                  label="Auto-expire after departure"
                  checked={Boolean(field.value)}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <FormField label="Notes" error={errors.notes?.message} hint="Optional, max 500 chars">
            <Textarea placeholder="Anything passengers should know…" {...register("notes")} />
          </FormField>
        </div>
      ) : null}

      {/* Step 4 — Preview */}
      {step === 3 ? (
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

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
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
      pickupPoint: values.pickupPoint,
      dropPoint: values.dropPoint,
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
