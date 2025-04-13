"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function EntityForm({
    fields,
    onSubmit,
    initialData,
    isLoading = false,
    title = "Form",
}: EntityFormProps) {
    // Dynamically create a Zod schema based on the fields
    const formSchema = z.object(
        fields.reduce((acc, field) => {
            let schema: any = z.string()

            if (field.type === "number") {
                schema = z.coerce.number()
            } else if (field.type === "checkbox") {
                schema = z.boolean()
            } else if (field.type === "email") {
                schema = z.string().email("Invalid email address")
            }

            // Handle required fields
            if (field.validation?.required) {
                schema = schema.min(1, { message: field.validation.required })
            } else if (!field.required) {
                schema = schema.optional()
            }

            // Text field validations
            if (field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "password") {
                if (field.validation?.minLength) {
                    schema = schema.min(field.validation.minLength, {
                        message: `Must be at least ${field.validation.minLength} characters`
                    })
                }

                if (field.validation?.maxLength) {
                    schema = schema.max(field.validation.maxLength, {
                        message: `Must be at most ${field.validation.maxLength} characters`
                    })
                }
            }

            // Number field validations
            if (field.type === "number") {
                if (field.validation?.min !== undefined) {
                    schema = schema.min(field.validation.min, {
                        message: `Must be at least ${field.validation.min}`
                    })
                }

                if (field.validation?.max !== undefined) {
                    schema = schema.max(field.validation.max, {
                        message: `Must be at most ${field.validation.max}`
                    })
                }
            }

            // Pattern validation
            if (field.validation?.pattern) {
                schema = schema.regex(field.validation.pattern.value, {
                    message: field.validation.pattern.message
                })
            }

            acc[field.name] = schema
            return acc
        }, {} as Record<string, any>)
    )

    // Create form with default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {},
    })

    // Handle form submission
    function handleSubmit(values: z.infer<typeof formSchema>) {
        onSubmit(values)
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {fields.map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name}
                                render={({ field: formField }) => (
                                    <FormItem className={field.type === "textarea" ? "col-span-2" : ""}>
                                        <FormLabel>
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </FormLabel>
                                        <FormControl>
                                            {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" ? (
                                                <Input
                                                    {...formField}
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    disabled={isLoading}
                                                />
                                            ) : field.type === "textarea" ? (
                                                <Textarea
                                                    {...formField}
                                                    placeholder={field.placeholder}
                                                    disabled={isLoading}
                                                    className="min-h-[100px]"
                                                />
                                            ) : field.type === "select" ? (
                                                <Select
                                                    onValueChange={formField.onChange}
                                                    defaultValue={formField.value}
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={field.placeholder} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option) => (
                                                            <SelectItem key={option.value.toString()} value={option.value.toString()}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : field.type === "checkbox" ? (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={formField.value}
                                                        onCheckedChange={formField.onChange}
                                                        disabled={isLoading}
                                                        id={field.name}
                                                    />
                                                    <label
                                                        htmlFor={field.name}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {field.placeholder || "Yes"}
                                                    </label>
                                                </div>
                                            ) : field.type === "date" ? (
                                                <Input
                                                    {...formField}
                                                    type="date"
                                                    disabled={isLoading}
                                                />
                                            ) : null}
                                        </FormControl>
                                        {field.description && (
                                            <FormDescription>{field.description}</FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset(initialData || {})}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : "Save"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
