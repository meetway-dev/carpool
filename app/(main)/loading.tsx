export default function MainLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30" />
          <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" style={{ animationDirection: "reverse", animationDuration: "1s" }} />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Loading rides...</p>
      </div>
    </div>
  );
}
