import { z } from 'zod';

export const CreateSessionSchema = z.object({
    residentIds: z.array(z.string()).min(1, 'At least one resident must be selected'),
});

export const UpdateSessionSchema = z.object({
    currentStep: z.enum(['start', 'adls', 'review']).optional(),
    chartingData: z.record(z.unknown()).optional(),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type UpdateSessionInput = z.infer<typeof UpdateSessionSchema>;
