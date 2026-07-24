import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GoogleAuthButtonProps = {
  className?: string;
  text?: string;
};

export function GoogleAuthButton({ className, text = "Continue with Google" }: GoogleAuthButtonProps) {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "h-10 w-full justify-center rounded-md border border-input bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <a href="/api/auth/google" className="flex items-center justify-center gap-3">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path
            d="M21.6 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.55Z"
            fill="#4285F4"
          />
          <path
            d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
            fill="#34A853"
          />
          <path
            d="M6.41 13.91A6.01 6.01 0 0 1 6.41 10.1V7.52H3.07a10 10 0 0 0 0 12.78l3.34-2.58Z"
            fill="#FBBC05"
          />
          <path
            d="M12 6.04c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.52l3.34 2.58C7.2 7.8 9.4 6.04 12 6.04Z"
            fill="#EA4335"
          />
        </svg>
        <span className="font-medium">{text}</span>
      </a>
    </Button>
  );
}
