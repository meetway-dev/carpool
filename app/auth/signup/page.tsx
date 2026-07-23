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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Join RideConnect to find trusted rides and share your travel plans.
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
              <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <GoogleAuthButton text="Sign up with Google" />

              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link className="text-primary hover:underline" href={ROUTES.auth.login}>
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
