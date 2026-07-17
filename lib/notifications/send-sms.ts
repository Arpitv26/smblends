import "server-only";

import { toE164PhoneNumber } from "@/lib/notifications/phone";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getTwilioCredentials(): {
  accountSid: string;
  authToken: string;
  fromNumber: string;
} {
  return {
    accountSid: requireEnv("TWILIO_ACCOUNT_SID", process.env.TWILIO_ACCOUNT_SID),
    authToken: requireEnv("TWILIO_AUTH_TOKEN", process.env.TWILIO_AUTH_TOKEN),
    fromNumber: requireEnv("TWILIO_PHONE_NUMBER", process.env.TWILIO_PHONE_NUMBER)
  };
}

export async function sendSms(params: {
  body: string;
  to: string;
}): Promise<void> {
  const toNumber = toE164PhoneNumber(params.to);

  if (!toNumber) {
    throw new Error("Client phone number is invalid for SMS delivery.");
  }

  const { accountSid, authToken, fromNumber } = getTwilioCredentials();
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString(
    "base64"
  );
  const formBody = new URLSearchParams({
    Body: params.body,
    From: fromNumber,
    To: toNumber
  });

  const response = await fetch(endpoint, {
    body: formBody.toString(),
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Twilio SMS failed (${response.status}): ${errorText.slice(0, 300)}`
    );
  }
}
