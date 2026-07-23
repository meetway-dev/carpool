"use client";

import { FormField } from "@/components/common/form-field";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validators/user.schema";
import { postApi } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token ?? "";
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null);
    try {
      await postApi<{ success: boolean }>('/api/auth/reset', { token, password: data.password });
      toast.success('Password reset successfully!');
      router.push('/auth/login');
    } catch (err: any) {
      const message = err?.message ?? 'Failed to reset password';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <main>
      <AppHeader title="Reset password" />
      <div className="mx-auto min-h-dvh max-w-lg">
        <div className="space-y-4 px-4 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="New password" error={errors.password?.message}>
            <Input type="password" {...register('password')} />
          </FormField>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>Set new password</Button>
        </form>
        </div>
      </div>
    </main>
  );
}
