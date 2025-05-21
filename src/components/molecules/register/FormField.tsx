import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName> & { error?: any }
  label: string
  type?: string
  placeholder?: string
  description?: string
  required?: boolean
}

export default function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field, label, type = "text", placeholder, description, required = false }: FormFieldProps<TFieldValues, TName>) {
  // Tách error ra khỏi field để không truyền vào Input
  const { error, ...inputProps } = field

  return (
    <FormItem>
      <FormLabel>
        {label} {required && <span className="text-red-500">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          type={type}
          placeholder={placeholder}
          {...inputProps}
          // Thêm class border-red-500 khi có lỗi
          className={error ? "border-red-500" : ""}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
