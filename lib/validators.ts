import { z } from 'zod'

export const ProfileSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email(),
  gender: z.enum(['male', 'female', 'prefer_not_to_say']).optional(),
  age: z.coerce.number().int().min(10).max(100).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  current_level: z.enum(['matric', 'intermediate', 'bachelor', 'master']).optional(),
  class_year: z.string().optional(),
  field_of_study: z.string().optional(),
  institute_name: z.string().optional(),
  favorite_subjects: z.array(z.string()).default([]),
  weak_subjects: z.array(z.string()).default([]),
  technical_skills: z.array(z.string()).default([]),
  soft_skills: z.array(z.string()).default([]),
  career_interests: z.array(z.string()).default([]),
  hobbies: z.string().optional(),
  dream_career: z.string().optional(),
  why_career: z.string().optional(),
  work_type: z.enum(['remote', 'on-site', 'hybrid']).optional(),
  motivation: z.coerce.number().int().min(0).max(10).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  resume_url: z.string().url().optional().or(z.literal('')),
  selected_career_slug: z.string().optional()
})

export type ProfileInput = z.infer<typeof ProfileSchema>
