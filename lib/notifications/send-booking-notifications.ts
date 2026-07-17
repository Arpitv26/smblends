import "server-only";

import { Resend } from "resend";

import { formatPrice } from "@/lib/bookings/config";
import type { AddOnType, ServiceType } from "@/lib/bookings/config";
import type { BookingCancellationDetails } from "@/lib/bookings/types";
import { sendSms } from "@/lib/notifications/send-sms";

export type BookingNotificationDetails = {
  addOns: AddOnType[];
  bookingDate: string;
  cancelToken: string;
  clientEmail: string | null;
  clientName: string;
  clientPhone: string;
  isAfterHours: boolean;
  notes: string | null;
  priceCharged: number;
  serviceType: ServiceType;
  timeSlot: string;
};

type EmailMessage = {
  html: string;
  subject: string;
  text: string;
  to: string[];
};

type BookingSummaryDetails = {
  addOns: AddOnType[];
  bookingDate: string;
  clientEmail: string | null;
  clientName: string;
  clientPhone: string;
  isAfterHours: boolean;
  notes?: string | null;
  priceCharged: number;
  serviceType: ServiceType;
  timeSlot: string;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getResendClient(): Resend {
  return new Resend(requireEnv("RESEND_API_KEY", process.env.RESEND_API_KEY));
}

function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "SMBLENDS Bookings <onboarding@resend.dev>";
}

function getBarberNotificationEmail(): string {
  return requireEnv(
    "BARBER_NOTIFICATION_EMAIL",
    process.env.BARBER_NOTIFICATION_EMAIL
  );
}

function formatBookingDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric"
  }).format(baseDate);
}

function formatTimeSlot(timeSlot: string): string {
  const [hoursPart, minutesPart] = timeSlot.split(":");
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeSlot;
  }

  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

function formatSmsDate(date: string): string {
  const baseDate = new Date(`${date}T12:00:00.000Z`);

  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "short",
    timeZone: "America/Vancouver"
  }).format(baseDate);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAddOns(addOns: AddOnType[]): string {
  return addOns.length > 0 ? addOns.join(", ") : "None";
}

function buildCancelUrl(siteOrigin: string, cancelToken: string): string {
  return new URL(`/booking/cancel/${cancelToken}`, siteOrigin).toString();
}

function buildPlainTextSummary(booking: BookingSummaryDetails): string {
  return [
    `Client: ${booking.clientName}`,
    `Phone: ${booking.clientPhone}`,
    booking.clientEmail ? `Email: ${booking.clientEmail}` : "Email: Not provided",
    `Date: ${formatBookingDate(booking.bookingDate)}`,
    `Time: ${formatTimeSlot(booking.timeSlot)}${booking.isAfterHours ? " (after-hours)" : ""}`,
    `Service: ${booking.serviceType}`,
    `Add-ons: ${formatAddOns(booking.addOns)}`,
    `Total: ${formatPrice(booking.priceCharged)}`,
    booking.notes ? `Notes: ${booking.notes}` : "Notes: None"
  ].join("\n");
}

function buildHtmlSummary(booking: BookingSummaryDetails): string {
  const rows = [
    ["Client", booking.clientName],
    ["Phone", booking.clientPhone],
    ["Email", booking.clientEmail ?? "Not provided"],
    ["Date", formatBookingDate(booking.bookingDate)],
    [
      "Time",
      `${formatTimeSlot(booking.timeSlot)}${booking.isAfterHours ? " (after-hours)" : ""}`
    ],
    ["Service", booking.serviceType],
    ["Add-ons", formatAddOns(booking.addOns)],
    ["Total", formatPrice(booking.priceCharged)],
    ["Notes", booking.notes ?? "None"]
  ];

  const rowMarkup = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;color:#71717a;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;color:#18181b;font-weight:600;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#18181b;">
      <h1 style="margin:0 0 12px;font-size:24px;">SMBLENDS booking</h1>
      <table style="border-collapse:collapse;width:100%;max-width:560px;background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
        <tbody>${rowMarkup}</tbody>
      </table>
      <p style="margin-top:18px;color:#52525b;">Payment: cash or e-transfer to sanchitmehta51@gmail.com.</p>
    </div>
  `;
}

function buildBarberEmail(booking: BookingNotificationDetails): EmailMessage {
  const subject = `New SMBLENDS booking: ${booking.clientName} on ${formatBookingDate(booking.bookingDate)}`;
  const text = `New SMBLENDS booking\n\n${buildPlainTextSummary(booking)}`;

  return {
    html: buildHtmlSummary(booking),
    subject,
    text,
    to: [getBarberNotificationEmail()]
  };
}

function buildBarberCancellationEmail(
  booking: BookingCancellationDetails
): EmailMessage {
  const subject = `SMBLENDS booking cancelled: ${booking.clientName} on ${formatBookingDate(booking.bookingDate)}`;
  const text = `SMBLENDS booking cancelled\n\n${buildPlainTextSummary(booking)}`;

  return {
    html: buildHtmlSummary(booking),
    subject,
    text,
    to: [getBarberNotificationEmail()]
  };
}

function buildClientBookingSmsMessages(
  booking: BookingNotificationDetails,
  siteOrigin: string
): [string, string] {
  const formattedDate = formatSmsDate(booking.bookingDate);
  const formattedTime = formatTimeSlot(booking.timeSlot);
  const cancelUrl = buildCancelUrl(siteOrigin, booking.cancelToken);
  const afterHours = booking.isAfterHours ? " (after-hours)" : "";

  return [
    [
      "SMBLENDS confirmed.",
      `${formattedDate} at ${formattedTime}${afterHours}.`,
      `${booking.serviceType}. Total ${formatPrice(booking.priceCharged)}.`,
      "Address: text 778-681-7694."
    ].join("\n"),
    `Cancel: ${cancelUrl}`
  ];
}

function buildClientCancellationSms(booking: BookingCancellationDetails): string {
  const formattedDate = formatSmsDate(booking.bookingDate);
  const formattedTime = formatTimeSlot(booking.timeSlot);

  return `SMBLENDS cancelled: ${formattedDate} at ${formattedTime}. Book again: https://smblends.ca/book`;
}

async function sendEmail(message: EmailMessage): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getFromEmail(),
    html: message.html,
    subject: message.subject,
    text: message.text,
    to: message.to
  });

  if (error) {
    throw new Error(error.message);
  }
}

function collectFailures(
  results: PromiseSettledResult<void>[],
  label: string
): void {
  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected"
  );

  if (failures.length === 0) {
    return;
  }

  const reasons = failures
    .map((failure) =>
      failure.reason instanceof Error
        ? failure.reason.message
        : "Unknown notification failure"
    )
    .join("; ");

  throw new Error(`Failed to send ${failures.length} ${label}: ${reasons}`);
}

export async function sendBookingNotifications(
  booking: BookingNotificationDetails,
  siteOrigin: string
): Promise<void> {
  const clientMessages = buildClientBookingSmsMessages(booking, siteOrigin);
  const results = await Promise.allSettled([
    sendEmail(buildBarberEmail(booking)),
    ...clientMessages.map((body) =>
      sendSms({
        body,
        to: booking.clientPhone
      })
    )
  ]);

  collectFailures(results, "booking notification(s)");
}

export async function sendCancellationNotifications(
  booking: BookingCancellationDetails
): Promise<void> {
  const results = await Promise.allSettled([
    sendEmail(buildBarberCancellationEmail(booking)),
    sendSms({
      body: buildClientCancellationSms(booking),
      to: booking.clientPhone
    })
  ]);

  collectFailures(results, "cancellation notification(s)");
}

export async function sendClientCancellationNotification(
  booking: BookingCancellationDetails
): Promise<void> {
  await sendSms({
    body: buildClientCancellationSms(booking),
    to: booking.clientPhone
  });
}
