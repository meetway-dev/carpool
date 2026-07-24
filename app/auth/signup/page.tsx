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
import { signupSchema, type SignupInput } from "@/validators/user.schema";
import { postApi } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupInput) => {
    setError(null);
    try {
      await postApi<{ success: boolean }>("/api/auth/signup", data);
      toast.success("Account created successfully!");
      router.push(ROUTES.home);
    } catch (err: any) {
      const message = err?.message ?? "Unable to sign up";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <main className="flex h-full flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-drive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div className="h-1 w-16 mx-auto rounded-full animate-road opacity-40" />
        </div>

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

        <Card className="w-full max-w-sm border-border shadow-sm">
          <CardHeader className="space-y-2 pb-5 pt-6">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Join RideConnect to find trusted rides and share your travel plans.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" {...register("email")} />
              </FormField>

              <FormField label="Password" error={errors.password?.message}>
                <Input type="password" {...register("password")} />
              </FormField>

              <FormField label="WhatsApp phone" error={errors.phone?.message}>
                <Input type="tel" {...register("phone")} placeholder="e.g. 0300 1234567" />
              </FormField>

              <FormField label="Name" error={errors.name?.message}>
                <Input type="text" {...register("name")} />
              </FormField>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Create account
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <GoogleAuthButton text="Sign up with Google" />

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link className="text-primary hover:underline" href={ROUTES.auth.login}>
                  Login
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
