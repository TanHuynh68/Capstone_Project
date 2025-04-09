/**
 * Profile form schemas
 *
 * This file contains Zod schemas for profile-related forms.
 */

import { ValidationErrors } from "@/components/utils/validation"
import { z } from "zod"

/**
 * Profile form schema
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: ValidationErrors.REQUIRED })
    .min(2, { message: ValidationErrors.MIN_LENGTH(2) }),
  email: z.string().min(1, { message: ValidationErrors.REQUIRED }).email({ message: ValidationErrors.EMAIL_INVALID }),
  phoneNumber: z
    .string()
    .min(1, { message: ValidationErrors.REQUIRED })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, {
      message: ValidationErrors.PHONE_INVALID,
    }),
  address: z.string().min(1, { message: ValidationErrors.REQUIRED }),
  avatar: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
