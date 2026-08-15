"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { InterestsStep } from "@/components/booking/InterestsStep";
import { DateTimeStep } from "@/components/booking/DateTimeStep";
import { DetailsStep } from "@/components/booking/DetailsStep";
import { ReviewStep } from "@/components/booking/ReviewStep";
import { BookingSuccess, BookingUnavailable, BookingFailure } from "@/components/booking/BookingOutcome";
import { BookingErrorBoundary } from "@/components/booking/BookingErrorBoundary";

import { useServices } from "@/hooks/useServices";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { bookingFormSchema } from "@/lib/validations/booking";
import { submitBooking, BookingSubmissionError } from "@/lib/api/submitBooking";
import { detectTimezone } from "@/lib/timezones";
import type {
  AutomationCapabilitySlug,
  BookingFormValues,
  BookingStep,
  BookingWebhookResponse,
  Service,
  WebhookResultStatus,
} from "@/types/booking";

const STEP_FIELDS: Record<Exclude<BookingStep, "success">, (keyof BookingFormValues)[]> = {
  service: ["serviceId"],
  interests: ["automationInterests", "automationDescription"],
  datetime: ["date", "time", "timezone"],
  details: ["fullName", "email", "phone", "notes"],
  review: [],
};

const STEP_ORDER: BookingStep[] = ["service", "interests", "datetime", "details", "review"];

// The real n8n conflict branch returns status "conflict"; "unavailable" is
// kept as a synonym for backward compatibility. Both render identically.
function isSlotUnavailable(status: WebhookResultStatus): status is "unavailable" | "conflict" {
  return status === "unavailable" || status === "conflict";
}

interface BookingFormProps {
  /** Preselects an automation interest, e.g. from /book?automation=lead-management */
  initialAutomationSlug?: AutomationCapabilitySlug;
}

export function BookingForm({ initialAutomationSlug }: BookingFormProps) {
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { settings, isLoading: settingsLoading } = useBusinessSettings();

  const [step, setStep] = useState<BookingStep>("service");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<BookingWebhookResponse | null>(null);
  // Snapshotted at the moment of submission, deliberately NOT derived from
  // live form state. Rendering the success screen from a reactively derived
  // value meant that screen could silently fail to render at all if that
  // value was ever falsy right as `step` flipped to "success".
  const [confirmedBooking, setConfirmedBooking] = useState<{
    service: Service;
    date: string;
    time: string;
  } | null>(null);

  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onBlur",
    defaultValues: {
      serviceId: "",
      automationInterests: initialAutomationSlug ? [initialAutomationSlug] : [],
      automationDescription: "",
      date: "",
      time: "",
      timezone: detectTimezone(),
      fullName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const values = watch();
  const selectedService = useMemo(
    () => services.find((s) => s.id === values.serviceId),
    [services, values.serviceId]
  );

  // If the query param arrives after first paint (e.g. client-side nav),
  // apply it once services/state are ready rather than only at mount.
  useEffect(() => {
    if (initialAutomationSlug && values.automationInterests.length === 0) {
      setValue("automationInterests", [initialAutomationSlug]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAutomationSlug]);

  async function goNext() {
    if (step === "review" || step === "success") return;
    const fields = STEP_FIELDS[step];
    const isValid = fields.length === 0 || (await trigger(fields));
    if (!isValid) return;

    const currentIndex = STEP_ORDER.indexOf(step);
    const next = STEP_ORDER[currentIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const currentIndex = STEP_ORDER.indexOf(step);
    const prev = STEP_ORDER[currentIndex - 1];
    if (prev) setStep(prev);
  }

  function handleSelectService(service: Service) {
    setValue("serviceId", service.id, { shouldValidate: true });
  }

  function handleToggleInterest(slug: AutomationCapabilitySlug) {
    const current = getValues("automationInterests");
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    setValue("automationInterests", next, { shouldValidate: true });
  }

  async function handleSubmit() {
    if (!selectedService) return;
    setIsSubmitting(true);
    setSubmitError(null);

    // Snapshot before the async call: the success screen renders from this
    // fixed copy, not from live state that could change identity mid-flight.
    const bookedService = selectedService;
    const bookedDate = getValues("date");
    const bookedTime = getValues("time");

    try {
      const result = await submitBooking(getValues(), selectedService);
      setOutcome(result);
      if (!isSlotUnavailable(result.status)) {
        setConfirmedBooking({ service: bookedService, date: bookedDate, time: bookedTime });
      }
      setStep("success");
    } catch (error) {
      const message =
        error instanceof BookingSubmissionError
          ? error.message
          : "Something went wrong submitting your booking. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBookAnother() {
    reset();
    setOutcome(null);
    setConfirmedBooking(null);
    setSubmitError(null);
    setStep("service");
  }

  function handleRetryAfterFailure() {
    setSubmitError(null);
  }

  function handleChooseAnotherTime() {
    setOutcome(null);
    setStep("datetime");
  }

  const isReviewStage = step === "review";

  return (
    <Card className="w-full">
      <CardContent className="p-6 sm:p-8">
        {step !== "success" && (
          <div className="mb-8">
            <BookingStepper current={step} />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={submitError ? "submit-error" : step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {submitError ? (
              <BookingFailure message={submitError} onRetry={handleRetryAfterFailure} />
            ) : step === "service" ? (
              <ServiceStep
                services={services}
                isLoading={servicesLoading}
                error={servicesError}
                selectedId={values.serviceId}
                onSelect={handleSelectService}
              />
            ) : step === "interests" ? (
              <InterestsStep
                selected={values.automationInterests}
                description={values.automationDescription}
                onToggle={handleToggleInterest}
                onDescriptionChange={(v) => setValue("automationDescription", v)}
                error={errors.automationInterests?.message}
              />
            ) : step === "datetime" && selectedService ? (
              <DateTimeStep
                durationMinutes={selectedService.durationMinutes}
                settings={settings}
                isLoadingSettings={settingsLoading}
                date={values.date}
                time={values.time}
                timezone={values.timezone}
                onDateChange={(d) => setValue("date", d, { shouldValidate: true })}
                onTimeChange={(t) => setValue("time", t, { shouldValidate: true })}
                onTimezoneChange={(tz) => setValue("timezone", tz, { shouldValidate: true })}
                errors={{
                  date: errors.date?.message,
                  time: errors.time?.message,
                  timezone: errors.timezone?.message,
                }}
              />
            ) : step === "details" ? (
              <DetailsStep register={register} errors={errors} />
            ) : step === "review" && selectedService ? (
              <ReviewStep values={getValues()} service={selectedService} />
            ) : step === "success" && outcome && isSlotUnavailable(outcome.status) ? (
              <BookingUnavailable
                message={outcome.message}
                onChooseAnotherTime={handleChooseAnotherTime}
              />
            ) : step === "success" && outcome && !isSlotUnavailable(outcome.status) && confirmedBooking ? (
              <BookingErrorBoundary
                fallback={
                  <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
                    <h3 className="font-display text-2xl">Booking confirmed</h3>
                    <p className="text-sm text-muted-foreground">
                      We couldn&apos;t display the automation preview, but your booking went
                      through.
                    </p>
                    {outcome.bookingReference && (
                      <p className="font-mono text-xs text-muted-foreground">
                        Reference:{" "}
                        <span className="text-foreground">{outcome.bookingReference}</span>
                      </p>
                    )}
                    <Button variant="outline" onClick={handleBookAnother} className="mt-2">
                      Book another appointment
                    </Button>
                  </div>
                }
              >
                <BookingSuccess
                  status={outcome.status}
                  message={outcome.message}
                  bookingReference={outcome.bookingReference}
                  service={confirmedBooking.service}
                  date={confirmedBooking.date}
                  time={confirmedBooking.time}
                  onBookAnother={handleBookAnother}
                />
              </BookingErrorBoundary>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {!submitError && step !== "success" && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === "service"}
              className={step === "service" ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {isReviewStage ? (
              <Button type="button" variant="accent" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner /> Submitting…
                  </>
                ) : (
                  "Confirm booking"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={step === "service" && !values.serviceId}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
