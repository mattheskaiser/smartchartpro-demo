import { z } from 'zod';

export const CreateReportSchema = z.object({
  reportDate: z.string().datetime(),
  sessionStartTime: z.string().datetime(),
  sessionEndTime: z.string().datetime(),
  cnaId: z.string().optional().nullable(),
  cnaName: z.string().optional().nullable(),
  cnaCertification: z.string().optional().nullable(),
  totalResidents: z.number().min(1),
  totalActivities: z.number().min(0),
  residentsData: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      room: z.string(),
      status: z.string(),
      imageData: z.string().optional().nullable(),
    })
  ),
  entriesData: z.array(
    z.object({
      residentId: z.string(),
      activityType: z.string(),
      assistance: z.string(),
      timestamp: z.string().datetime(),
      notes: z.string().optional(),
    })
  ),
  pdfData: z.string().optional().nullable(),
});

export const UpdateReportSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'archived']).optional(),
  reviewedBy: z.string().optional().nullable(),
  reviewedAt: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
