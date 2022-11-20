import { z } from 'zod';

const CredentialsSchema = z.object({
  username: z.string().min(3).max(16),
  password: z
    .string()
    .min(8)
    .max(24)
    .regex(/((?=.*\d))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
});

export { CredentialsSchema };
