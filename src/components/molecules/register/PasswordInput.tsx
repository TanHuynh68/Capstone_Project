"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import PasswordStrengthMeter from "@/components/atoms/register/PasswordStrengthMeter"
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

interface PasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName> & { error?: any }
  label: string
  showStrengthMeter?: boolean
  placeholder?: string
  description?: string
  required?: boolean
}

const PasswordInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  field,
  label,
  showStrengthMeter = false,
  placeholder,
  description,
  required = false,
}: PasswordInputProps<TFieldValues, TName>) => {
  const [showPassword, setShowPassword] = useState(false)

  // Tách error ra khỏi field để không truyền vào Input
  const { error, ...inputProps } = field

  return (
    <FormItem>
      <FormLabel>
        {label} {required && <span className="text-red-500">*</span>}
      </FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`pr-10 ${error ? "border-red-500" : ""}`}
            {...inputProps}
            autoComplete="new-password"
          />
        </FormControl>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
      {showStrengthMeter && <PasswordStrengthMeter password={inputProps.value} />}
    </FormItem>
  )
}

export default PasswordInput
