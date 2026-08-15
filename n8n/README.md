# n8n workflow — Booking Received

This is the automation that the website's `NEXT_PUBLIC_N8N_WEBHOOK` points to.
The frontend's only job is to POST a validated booking payload here and
display whatever this workflow returns. Everything else — availability,
persistence, the calendar event, and both emails — happens in n8n.

`booking-workflow.json` is a starting-point export you can import directly
into n8n (**Workflows → Import from File**). Wire up the four credentials
below, then activate it.

## Incoming payload

The webhook receives this shape (see `types/booking.ts` in the frontend for
the source of truth):

```json
{
  "service": { "id": "uuid", "name": "Standard Appointment", "durationMinutes": 60 },
  "customer": { "fullName": "Jordan Lee", "email": "jordan@example.com", "phone": "+1 555 010 0100" },
  "booking": {
    "date": "2026-08-10",
    "time": "14:00",
    "notes": "First visit",
    "timezone": "America/New_York",
    "source": "website"
  },
  "submittedAt": "2026-08-02T09:15:00.000Z"
}
```

## What the workflow must return

The frontend only understands this shape — anything else surfaces as a
generic "unexpected response" error to the customer:

```json
{ "status": "confirmed", "message": "You're all set.", "bookingReference": "BK-2381" }
```

`status` is one of `"confirmed"`, `"pending_review"`, or `"unavailable"`.

## Node-by-node flow

1. **Webhook** — `POST /booking`, response mode set to "Using 'Respond to
   Webhook' node" so the flow can branch before responding.
2. **Retrieve Service Details** — Supabase node, `select * from services
   where id = {{ $json.body.service.id }} and is_active = true`. Use the
   `service_role` key here — this is n8n, not the browser.
3. **Retrieve Business Settings** — Supabase node, reads the single
   `business_settings` row (timezone, opening_hours, buffer_minutes,
   `is_accepting_bookings`).
4. **Check Availability** — Function node that combines opening hours,
   `buffer_minutes`, and a Supabase query for existing `bookings` rows that
   overlap the requested `[start_time, end_time)` window. Also honors
   `is_accepting_bookings` and `booking_lead_time_minutes`.
5. **IF: Is Available** — branches on the result of step 4.
   - **True branch:**
     6. **Save Customer** — Supabase upsert on `customers` keyed by `email`.
     7. **Create Booking** — Supabase insert into `bookings` with
        `status = 'pending'`.
     8. **Create Google Calendar Event** — Google Calendar node (OAuth2),
        using the calendar ID from `business_settings.google_calendar_id`.
     9. **Update Booking** — Supabase update: sets
        `google_calendar_event_id` and `status = 'confirmed'`.
     10. **Send Confirmation Email** — Gmail node (OAuth2) to the customer.
     11. **Notify Business Owner** — Gmail node (OAuth2) to
         `business_settings.contact_email`.
     12. **Respond to Webhook** — `{ "status": "confirmed", "bookingReference": ... }`.
   - **False branch:**
     13. **Respond to Webhook** — `{ "status": "unavailable", "message": "That time was just taken — please pick another." }`.

## Credentials to configure in n8n

- **Supabase** — project URL + `service_role` key (Settings → API). Never
  put the service_role key in the website; it belongs only here.
- **Google Calendar OAuth2** — connect the business's Google account.
- **Gmail OAuth2** — same Google account, used for both customer
  confirmation and the owner notification.

## Error handling

Add an **Error Trigger** workflow (or a global n8n error workflow) so a
failure partway through — say, Calendar succeeds but Gmail fails — still
notifies the business owner and doesn't leave a booking in limbo. The
`bookings.status` column plus `confirmation_email_sent_at` are there so you
can build a retry/cleanup job later without guessing what happened.
