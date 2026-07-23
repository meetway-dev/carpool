"use client";

import { FormField } from "@/components/common/form-field";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validators/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      const message = body?.error ?? 'Failed to send reset link';
      setError(message);
      toast.error(message);
      return;
    }
    setSent(true);
    toast.success('If the account exists, a reset link was sent.');
  };

  return (
    <main>
      <AppHeader title="Forgot password" />
      <div className="mx-auto min-h-dvh max-w-lg">
        <div className="space-y-4 px-4 py-4">
        {sent ? (
          <div className="space-y-2">
            <p className="text-sm">If an account exists with that email, we sent a password reset link. Check your inbox.</p>
            <Button asChild>
              <Link href={ROUTES.auth.login}>Back to login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email" error={errors.email?.message}>
              <Input type="email" {...register('email')} />
            </FormField>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>Send reset link</Button>
          </form>
        )}
        </div>
      </div>
    </main>
  );
}
