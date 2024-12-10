import { z } from "zod";

export const fetchTransactionsQueryParamsSchema = z.object({
  accountAddress: z.string().min(1, "Account address is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .optional(),
});

export type FetchTransactionsQueryParams = z.infer<
  typeof fetchTransactionsQueryParamsSchema
>;
