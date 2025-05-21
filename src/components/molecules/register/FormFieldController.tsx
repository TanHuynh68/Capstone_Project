import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

interface FormFieldControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  render: (props: { field: any }) => any
}

export default function FormFieldController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, render }: FormFieldControllerProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Truyền cả field và fieldState để component con có thể truy cập thông tin lỗi
        return render({ field: { ...field, error: fieldState.error } })
      }}
    />
  )
}
