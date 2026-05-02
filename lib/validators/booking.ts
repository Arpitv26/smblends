import { z } from "zod";

import { ADD_ON_TYPES, SERVICE_TYPES } from "@/lib/bookings/config";
import { isIsoCalendarDate } from "@/lib/validators/date";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,30}$/;
const TIME_SLOT_PATTERN = /^\d{2}:\d{2}:\d{2}$/;

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
    .refine(isIsoCalendarDate, "Choose a valid date."),
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
    .regex(TIME_SLOT_PATTERN, "Choose a valid time slot.")
});

export type BookingDraft = z.infer<typeof bookingDraftSchema>;
