"use client";

import { FormField } from "@/components/common/form-field";
import { GoogleAuthButton } from "@/components/common/google-auth-button";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginInput } from "@/validators/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      const message = body?.error ?? "Unable to login";
      setError(message);
      toast.error(message);
      return;
    }

    toast.success("Logged in successfully!");
    router.push(ROUTES.home);
  };

  return (
    <main>
      <AppHeader title="Login" />
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-border/60 bg-background/95 shadow-xl">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to continue booking rides and managing your trips.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" {...register("email")} />
              </FormField>

              <FormField label="Password" error={errors.password?.message}>
                <Input type="password" {...register("password")} />
              </FormField>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Login
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <GoogleAuthButton text="Sign in with Google" />

              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link className="text-primary hover:underline" href={ROUTES.auth.signup}>
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
