import { z } from "zod";
import { MoneyDirection } from "../types/enums";

const recordSchema = z.object({
  amount: z.number().positive("Amount must be bigger than 0"),
  details: z.string().optional(),
  direction: z.enum(MoneyDirection),
  date: z.date().refine((d) => !!d, "Date is required"),
  currency: z.string().min(1, "Currency is required"),
  id: z.uuid().optional(),
});
export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  record: recordSchema,
});

export type FormValues = z.infer<typeof formSchema>;
export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  records: z.array(recordSchema),
});

export type RecordEntry = z.infer<typeof recordSchema>;
export type Record = z.infer<typeof schema>;
