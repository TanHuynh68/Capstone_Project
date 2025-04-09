/**
 * Custom hook for form validation
 *
 * This hook provides a convenient way to use the validation utilities with react-hook-form.
 */

import { useForm, type UseFormProps, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

/**
 * Custom hook for form validation with Zod schema
 * @param schema Zod schema for form validation
 * @param options Additional options for useForm
 * @returns Form methods from react-hook-form
 */
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">,
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema),
  })
}

export default useZodForm
