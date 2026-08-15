"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="font-display text-2xl">Something went wrong</h2>
      <p className="max-w-sm text-muted-foreground">
        We hit an unexpected error loading this page. You can try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
