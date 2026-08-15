"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BookingFormValues } from "@/types/booking";

interface DetailsStepProps {
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
}

export function DetailsStep({ register, errors }: DetailsStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          placeholder="Jordan Lee"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jordan@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 555 010 0100"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Anything we should know before your appointment?"
          aria-invalid={Boolean(errors.notes)}
          {...register("notes")}
        />
        {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
      </div>
    </div>
  );
}
