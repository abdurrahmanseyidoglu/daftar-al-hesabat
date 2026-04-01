import { z } from "zod";
import { MoneyDirection } from "../types/enums";
export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive("Amount must be bigger than 0"),
  details: z.string().optional(),
  direction: z.enum(MoneyDirection),
  date: z.date().refine((d) => !!d, "Date is required"),
  currency: z.string().min(1, "Currency is required"),
});
export type Record = z.infer<typeof schema>;
