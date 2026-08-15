"use client";

import { useEffect, useState } from "react";
import { getActiveServices } from "@/lib/supabase/queries";
import type { Service } from "@/types/booking";

interface UseServicesResult {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

/** Loads active services once on mount. Read-only — no booking logic here. */
export function useServices(): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getActiveServices();
        if (isMounted) setServices(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Couldn't load services.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { services, isLoading, error };
}
