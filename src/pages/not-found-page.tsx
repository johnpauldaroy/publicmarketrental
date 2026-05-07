import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg space-y-6 rounded-[2rem] border border-border/70 bg-card/90 p-10 text-center shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="font-display text-5xl text-foreground">Page not found</h1>
        <p className="text-muted-foreground">
          The route does not exist in the current portal map. Return to the main entry point and continue from there.
        </p>
        <Link to="/login">
          <Button>Back to login</Button>
        </Link>
      </div>
    </div>
  );
}
