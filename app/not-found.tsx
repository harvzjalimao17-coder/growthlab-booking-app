import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="font-display text-2xl">Page not found</h1>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
