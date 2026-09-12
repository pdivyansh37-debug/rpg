import { z } from 'zod';

export const QuestDifficultySchema = z.enum(['TRIVIAL', 'EASY', 'MEDIUM', 'HARD']);
export const AttributeTypeSchema = z.enum(['STRENGTH', 'INTELLECT', 'STAMINA', 'AGILITY']);

export const CreateQuestSchema = z.object({
  title: z
    .string()
    .min(2, 'Quest title must be at least 2 characters')
    .max(100, 'Quest title cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable(),
  difficulty: QuestDifficultySchema.default('EASY'),
  attributeType: AttributeTypeSchema,
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  isRecurring: z.boolean().default(false),
});

export const CompleteQuestSchema = z.object({
  questId: z.string().uuid('Invalid Quest ID format'),
});

export type CreateQuestInput = z.infer<typeof CreateQuestSchema>;
export type CompleteQuestInput = z.infer<typeof CompleteQuestSchema>;
