import { z } from 'zod';

const CreateTransactionSchema = z.object({
  amount: z.number().min(1).max(Infinity),
  from: z.string().min(3).max(16),
  to: z.string().min(3).max(16),
});

export { CreateTransactionSchema };
