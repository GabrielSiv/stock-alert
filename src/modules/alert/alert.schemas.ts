import { z } from 'zod';

export const createAlertSchema = z.object({
  userId: z.string().cuid(),
  ticker: z
    .string()
    .min(1)
    .max(10)
    .transform((v) => v.toUpperCase()),
  targetPrice: z.number().positive(),
});

export const updateAlertSchema = z.object({
  alertId: z.string().cuid(),
  targetPrice: z.number().positive().optional(),
  active: z.boolean().optional(),
});

export const alertIdSchema = z.object({
  alertId: z.string().cuid(),
});

export const userIdSchema = z.object({
  userId: z.string().cuid(),
});
