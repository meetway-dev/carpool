import { ShieldCheck, Info } from "lucide-react";

const SAFETY_TIPS = [
  "Confirm the driver's name and vehicle number before boarding.",
  "Share your live trip location with a family member.",
  "Agree on the fare and pickup point over the call in advance.",
  "Prefer verified drivers and avoid sharing personal financial details.",
];

/** Static safety guidance shown on ride details. */
export function SafetyTips() {
  return (
    <div className="rounded-xl border bg-accent/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck className="h-4 w-4 text-primary" /> Safety tips
      </div>
      <ul className="space-y-1.5">
        {SAFETY_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
