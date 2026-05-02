export const SERVICE_TYPES = ["Haircut", "Haircut & Beard"] as const;

export const ADD_ON_TYPES = ["Beard Fade / Line-up"] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export type AddOnType = (typeof ADD_ON_TYPES)[number];

export type PriceInput = {
  addOns: AddOnType[];
  isAfterHours: boolean;
  serviceType: ServiceType;
};

export const SERVICE_PRICES: Record<ServiceType, number> = {
  "Haircut": 20,
  "Haircut & Beard": 30
};

export const ADD_ON_PRICES: Record<AddOnType, number> = {
  "Beard Fade / Line-up": 10
};

export const AFTER_HOURS_SURCHARGE = 10;

export const AFTER_HOURS_START_MINUTES = 21 * 60;

export const APPOINTMENT_SLOT_MINUTES = 60;

export function calculateBookingPrice({
  addOns,
  isAfterHours,
  serviceType
}: PriceInput): number {
  const addOnTotal = addOns.reduce(
    (total, addOn) => total + ADD_ON_PRICES[addOn],
    0
  );

  return (
    SERVICE_PRICES[serviceType] +
    addOnTotal +
    (isAfterHours ? AFTER_HOURS_SURCHARGE : 0)
  );
}

export function formatPrice(price: number): string {
  return `$${price}`;
}
