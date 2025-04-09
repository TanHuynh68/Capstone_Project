/**
 * Authentication form schemas
 *
 * This file contains Zod schemas for authentication-related forms.
 */

import { ValidationErrors } from "@/components/utils/validation"
import { z } from "zod"

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z.string().min(1, { message: ValidationErrors.REQUIRED }).email({ message: ValidationErrors.EMAIL_INVALID }),
  password: z.string().min(1, { message: ValidationErrors.REQUIRED }),
  rememberMe: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/**
 * Registration form schema
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .min(2, { message: ValidationErrors.MIN_LENGTH(2) }),
    email: z.string().min(1, { message: ValidationErrors.REQUIRED }).email({ message: ValidationErrors.EMAIL_INVALID }),
    password: z
      .string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .min(8, { message: ValidationErrors.PASSWORD_MIN_LENGTH })
      .refine((value) => /[a-z]/.test(value), { message: ValidationErrors.PASSWORD_LOWERCASE })
      .refine((value) => /[A-Z]/.test(value), { message: ValidationErrors.PASSWORD_UPPERCASE })
      .refine((value) => /[0-9]/.test(value), { message: ValidationErrors.PASSWORD_NUMBER })
      .refine((value) => /[^A-Za-z0-9]/.test(value), { message: ValidationErrors.PASSWORD_SPECIAL }),
    confirmPassword: z.string().min(1, { message: ValidationErrors.REQUIRED }),
    phoneNumber: z
      .string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, {
        message: ValidationErrors.PHONE_INVALID,
      }),
    gender: z.string().min(1, { message: ValidationErrors.REQUIRED }),
    role: z.string().min(1, { message: ValidationErrors.REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ValidationErrors.PASSWORDS_MUST_MATCH,
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: ValidationErrors.REQUIRED }).email({ message: ValidationErrors.EMAIL_INVALID }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .min(8, { message: ValidationErrors.PASSWORD_MIN_LENGTH })
      .refine((value) => /[a-z]/.test(value), { message: ValidationErrors.PASSWORD_LOWERCASE })
      .refine((value) => /[A-Z]/.test(value), { message: ValidationErrors.PASSWORD_UPPERCASE })
      .refine((value) => /[0-9]/.test(value), { message: ValidationErrors.PASSWORD_NUMBER })
      .refine((value) => /[^A-Za-z0-9]/.test(value), { message: ValidationErrors.PASSWORD_SPECIAL }),
    confirmPassword: z.string().min(1, { message: ValidationErrors.REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ValidationErrors.PASSWORDS_MUST_MATCH,
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

/**
 * Change password form schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: ValidationErrors.REQUIRED }),
    newPassword: z
      .string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .min(8, { message: ValidationErrors.PASSWORD_MIN_LENGTH })
      .refine((value) => /[a-z]/.test(value), { message: ValidationErrors.PASSWORD_LOWERCASE })
      .refine((value) => /[A-Z]/.test(value), { message: ValidationErrors.PASSWORD_UPPERCASE })
      .refine((value) => /[0-9]/.test(value), { message: ValidationErrors.PASSWORD_NUMBER })
      .refine((value) => /[^A-Za-z0-9]/.test(value), { message: ValidationErrors.PASSWORD_SPECIAL }),
    confirmPassword: z.string().min(1, { message: ValidationErrors.REQUIRED }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ValidationErrors.PASSWORDS_MUST_MATCH,
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
