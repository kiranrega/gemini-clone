import { z } from 'zod';
// --- ZOD SCHEMAS (VALIDATION) ---
export const OTPSchema = z.object({
  countryCode: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "A valid 10-digit phone number is required").max(10),
});

export const MessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty"),
});