import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingForm } from "@/components/booking/BookingForm";
import { AUTOMATION_CAPABILITIES, type AutomationCapabilitySlug } from "@/types/booking";

export const metadata: Metadata = {
  title: "Book a Consultation. GrowthLab.",
};

function resolveSlug(raw: string | string[] | undefined): AutomationCapabilitySlug | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const match = AUTOMATION_CAPABILITIES.find((c) => c.slug === value);
  return match?.slug;
}

export default function BookPage({
  searchParams,
}: {
  searchParams: { automation?: string | string[] };
}) {
  const automationSlug = resolveSlug(searchParams.automation);
  const capabilityName = AUTOMATION_CAPABILITIES.find((c) => c.slug === automationSlug)?.name;

  return (
    <div className="container max-w-2xl py-14 sm:py-20">
      {automationSlug && (
        <Link
          href="/#capabilities"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to What We Automate
        </Link>
      )}
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-dark">
          Book an appointment
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Let&apos;s find you a time</h1>
        <p className="mt-3 text-muted-foreground">
          {capabilityName
            ? `Tell us more about automating ${capabilityName.toLowerCase()}. Takes about a minute.`
            : "Takes about a minute. You'll get a confirmation by email right after."}
        </p>
      </div>
      <BookingForm initialAutomationSlug={automationSlug} />
    </div>
  );
}
