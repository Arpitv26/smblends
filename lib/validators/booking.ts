import { z } from "zod";

import { ADD_ON_TYPES, SERVICE_TYPES } from "@/lib/bookings/config";
import {
  isBeforeTodayInVancouver,
  isIsoCalendarDate
} from "@/lib/validators/date";
import { isIsoTimeSlot } from "@/lib/validators/time";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,30}$/;

export const bookingDraftSchema = z.object({
  addOns: z
    .array(z.enum(ADD_ON_TYPES))
    .default([])
    .refine(
      (addOns) => new Set(addOns).size === addOns.length,
      "Choose each add-on only once."
    ),
  bookingDate: z
    .string()
    .trim()
    .refine(isIsoCalendarDate, "Choose a valid date.")
    .refine(
      (date) => !isBeforeTodayInVancouver(date),
      "Choose today or a future date."
    ),
  clientEmail: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "Email must be 120 characters or less.")
    .refine(
      (value) => value.length === 0 || z.email().safeParse(value).success,
      "Enter a valid email address."
    ),
  clientName: z
    .string()
    .trim()
    .min(2, "Enter your name.")
    .max(80, "Name must be 80 characters or less."),
  clientPhone: z
    .string()
    .trim()
    .min(7, "Enter your phone number.")
    .max(30, "Phone number must be 30 characters or less.")
    .regex(PHONE_PATTERN, "Enter a valid phone number."),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be 500 characters or less."),
  serviceType: z.enum(SERVICE_TYPES, "Choose a service."),
  timeSlot: z
    .string()
    .trim()
    .min(1, "Choose a time slot.")
    .refine(isIsoTimeSlot, "Choose a valid time slot.")
});

export type BookingDraft = z.infer<typeof bookingDraftSchema>;
