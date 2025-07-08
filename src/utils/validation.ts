/**
 * Form Validation Utility
 * 
 * This file contains reusable validation functions for use with react-hook-form.
 * These functions can be used to validate common form fields across the application.
 */

import * as z from 'zod';
import { RegisterOptions } from 'react-hook-form';

/**
 * Common validation error messages
 */
export const ValidationErrors = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
  PASSWORD_NUMBER: 'Password must contain at least one number',
  PASSWORD_SPECIAL: 'Password must contain at least one special character',
  PASSWORDS_MUST_MATCH: 'Passwords do not match',
  PHONE_INVALID: 'Please enter a valid phone number',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  NUMBER_INVALID: 'Please enter a valid number',
  DATE_INVALID: 'Please enter a valid date',
  URL_INVALID: 'Please enter a valid URL',
};

/**
 * Required field validation
 * @returns Validation rule for required fields
 */
export const required = (): RegisterOptions => ({
  required: ValidationErrors.REQUIRED,
});

/**
 * Email validation
 * @returns Validation rule for email fields
 */
export const email = (): RegisterOptions => ({
  required: ValidationErrors.REQUIRED,
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: ValidationErrors.EMAIL_INVALID,
  },
});

/**
 * Password validation
 * Checks for minimum length, lowercase, uppercase, number, and special character
 * @returns Validation rules for password fields
 */
export const password = (): RegisterOptions => ({
  required: ValidationErrors.REQUIRED,
  minLength: {
    value: 8,
    message: ValidationErrors.PASSWORD_MIN_LENGTH,
  },
  validate: {
    lowercase: (value: string) => 
      /[a-z]/.test(value) || ValidationErrors.PASSWORD_LOWERCASE,
    uppercase: (value: string) => 
      /[A-Z]/.test(value) || ValidationErrors.PASSWORD_UPPERCASE,
    number: (value: string) => 
      /[0-9]/.test(value) || ValidationErrors.PASSWORD_NUMBER,
    special: (value: string) => 
      /[^A-Za-z0-9]/.test(value) || ValidationErrors.PASSWORD_SPECIAL,
  },
});

/**
 * Password confirmation validation
 * @param getPassword Function to get the password value to compare against
 * @returns Validation rule for password confirmation
 */
export const passwordConfirm = (getPassword: () => string): RegisterOptions => ({
  required: ValidationErrors.REQUIRED,
  validate: (value: string) => 
    value === getPassword() || ValidationErrors.PASSWORDS_MUST_MATCH,
});

/**
 * Phone number validation
 * @returns Validation rule for phone number fields
 */
export const phone = (): RegisterOptions => ({
  required: ValidationErrors.REQUIRED,
  pattern: {
    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
    message: ValidationErrors.PHONE_INVALID,
  },
});

/**
 * Min length validation
 * @param min Minimum length
 * @returns Validation rule for minimum length
 */
export const minLength = (min: number): RegisterOptions => ({
  minLength: {
    value: min,
    message: ValidationErrors.MIN_LENGTH(min),
  },
});

/**
 * Max length validation
 * @param max Maximum length
 * @returns Validation rule for maximum length
 */
export const maxLength = (max: number): RegisterOptions => ({
  maxLength: {
    value: max,
    message: ValidationErrors.MAX_LENGTH(max),
  },
});

/**
 * Number validation
 * @returns Validation rule for number fields
 */
export const number = (): RegisterOptions => ({
  pattern: {
    value: /^[0-9]+$/,
    message: ValidationErrors.NUMBER_INVALID,
  },
});

/**
 * URL validation
 * @returns Validation rule for URL fields
 */
export const url = (): RegisterOptions => ({
  pattern: {
    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    message: ValidationErrors.URL_INVALID,
  },
});

/**
 * Custom pattern validation
 * @param pattern Regular expression pattern
 * @param message Error message
 * @returns Validation rule for custom pattern
 */
export const pattern = (pattern: RegExp, message: string): RegisterOptions => ({
  pattern: {
    value: pattern,
    message,
  },
});

/**
 * Custom validation function
 * @param validateFn Validation function that returns true if valid, or an error message if invalid
 * @returns Validation rule for custom validation
 */
export const custom = (validateFn: (value: any) => true | string): RegisterOptions => ({
  validate: validateFn,
});

/**
 * Zod schema for common form validations
 * This can be used with react-hook-form's resolver
 */
export const createValidationSchema = () => {
  return {
    /**
     * Required field schema
     * @returns Zod schema for required fields
     */
    required: () => z.string().min(1, { message: ValidationErrors.REQUIRED }),

    /**
     * Email schema
     * @returns Zod schema for email validation
     */
    email: () => z.string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .email({ message: ValidationErrors.EMAIL_INVALID }),

    /**
     * Password schema
     * @returns Zod schema for password validation
     */
    password: () => z.string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .min(8, { message: ValidationErrors.PASSWORD_MIN_LENGTH })
      .refine(value => /[a-z]/.test(value), { message: ValidationErrors.PASSWORD_LOWERCASE })
      .refine(value => /[A-Z]/.test(value), { message: ValidationErrors.PASSWORD_UPPERCASE })
      .refine(value => /[0-9]/.test(value), { message: ValidationErrors.PASSWORD_NUMBER })
      .refine(value => /[^A-Za-z0-9]/.test(value), { message: ValidationErrors.PASSWORD_SPECIAL }),

    /**
     * Phone number schema
     * @returns Zod schema for phone validation
     */
    phone: () => z.string()
      .min(1, { message: ValidationErrors.REQUIRED })
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, { 
        message: ValidationErrors.PHONE_INVALID 
      }),

    /**
     * Min length schema
     * @param min Minimum length
     * @returns Zod schema for minimum length validation
     */
    minLength: (min: number) => z.string()
      .min(min, { message: ValidationErrors.MIN_LENGTH(min) }),

    /**
     * Max length schema
     * @param max Maximum length
     * @returns Zod schema for maximum length validation
     */
    maxLength: (max: number) => z.string()
      .max(max, { message: ValidationErrors.MAX_LENGTH(max) }),
  };
};

// Export a pre-initialized validation schema
export const validationSchema = createValidationSchema();
