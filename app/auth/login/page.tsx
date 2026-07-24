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
      <div className="mx-auto flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-4 py-8">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-drive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div className="h-1 w-16 mx-auto rounded-full animate-road opacity-40" />
        </div>

        <Card className="w-full max-w-sm border-border shadow-sm">
          <CardHeader className="space-y-1 pb-5 pt-6">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to continue booking rides and managing your trips.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Email" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="you@domain.com"
                  autoFocus
                  {...register("email")}
                />
              </FormField>

              <FormField label="Password" error={errors.password?.message}>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </FormField>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center text-xs text-muted-foreground">
                  <input type="checkbox" className="mr-2 h-4 w-4 rounded border-border" />
                  Remember me
                </label>
                <Link href={ROUTES.auth.forgot} className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Login
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <GoogleAuthButton text="Sign in with Google" />

              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link className="text-primary hover:underline" href={ROUTES.auth.signup}>
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 w-full max-w-sm space-y-3 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-primary"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
              Safe rides
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-primary"><path d="M12 2v20M2 12h20"/></svg>
              Best prices
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-primary"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Trusted drivers
            </span>
          </div>
          <p>Trusted by thousands of passengers across Pakistan</p>
        </div>
      </div>
    </main>
  );
}
