import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-6 w-6 text-muted-foreground" />
    </div>
  );
}
