"use client";

import { useEffect, useState } from "react";
import { getBusinessSettings } from "@/lib/supabase/queries";
import type { BusinessSettingsRow } from "@/types/database";

interface UseBusinessSettingsResult {
  settings: BusinessSettingsRow | null;
  isLoading: boolean;
  error: string | null;
}

export function useBusinessSettings(): UseBusinessSettingsResult {
  const [settings, setSettings] = useState<BusinessSettingsRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getBusinessSettings();
        if (isMounted) setSettings(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Couldn't load business settings.");
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

  return { settings, isLoading, error };
}
