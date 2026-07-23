"use client";

import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/common/form-field";
import { GoogleAuthButton } from "@/components/common/google-auth-button";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
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
    <main className="flex h-full flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mb-6 text-center">
          <Badge variant="success" className="gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Live in KPK &amp; Islamabad
          </Badge>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight">
            Find your next ride <span className="text-primary">in seconds.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

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
                <label className="inline-flex items-center text-sm text-muted-foreground">
                  <input type="checkbox" className="mr-2 h-4 w-4 rounded border-border" />
                  Remember me
                </label>
                <Link href={ROUTES.auth.forgot} className="text-sm text-primary hover:underline">
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
