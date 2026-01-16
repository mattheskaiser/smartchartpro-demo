import { z } from 'zod';

export const CreateCNAAccountSchema = z.object({
    cnaId: z.string().min(1, 'CNA ID is required'),
    email: z.string().email('Invalid email address'),
});

export const UpdateCNAAccountSchema = z.object({
    isActive: z.boolean().optional(),
    email: z.string().email('Invalid email address').optional(),
    resetPassword: z.boolean().optional(),
});

export type CreateCNAAccountInput = z.infer<typeof CreateCNAAccountSchema>;
export type UpdateCNAAccountInput = z.infer<typeof UpdateCNAAccountSchema>;
