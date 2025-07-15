import * as z from "zod";

/**
 * Shipping form validation schemas
 * 
 * This file contains Zod schemas for shipping/delivery form validation.
 * 
 * Usage with react-hook-form:
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { shippingFormSchema, ShippingFormValues } from "@/schemas/shippingSchema";
 * 
 * const form = useForm<ShippingFormValues>({
 *   resolver: zodResolver(shippingFormSchema),
 *   defaultValues: {
 *     fromName: "",
 *     fromPhone: "",
 *     // ... other fields
 *   }
 * });
 * ```
 */

// Common validation patterns
const phoneRegex = /^0\d{9}$/;
const numberPreprocess = (val: unknown) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
};

// Base schemas for individual sections
export const senderSchema = z.object({
    fromName: z.string().trim().min(1, { message: "Vui lòng nhập họ tên người gửi" }),
    fromPhone: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập SĐT người gửi" })
        .regex(phoneRegex, { message: "SĐT người gửi phải đúng định dạng (0xxxxxxxxx)" }),
    fromAddress: z.string().trim().min(1, { message: "Vui lòng nhập địa chỉ người gửi" }),
    fromDistrictName: z.string().trim().min(1, { message: "Vui lòng chọn quận/huyện người gửi" }),
    fromWardName: z.string().trim().min(1, { message: "Vui lòng chọn phường/xã người gửi" }),
    fromProvinceName: z.string().trim().min(1, { message: "Vui lòng chọn tỉnh/thành người gửi" }),
});

export const receiverSchema = z.object({
    toName: z.string().trim().min(1, { message: "Vui lòng nhập họ tên người nhận" }),
    toPhone: z
        .string()
        .trim()
        .min(1, { message: "Vui lòng nhập SĐT người nhận" })
        .regex(phoneRegex, { message: "SĐT người nhận phải đúng định dạng (0xxxxxxxxx)" }),
    // toAddressDetail: z.string().trim().min(1, { message: "Vui lòng nhập địa chỉ người nhận" }),
    toDistrictName: z.string().trim().min(1, { message: "Vui lòng chọn quận/huyện người nhận" }),
    toWardName: z.string().trim().min(1, { message: "Vui lòng chọn phường/xã người nhận" }),
    toProvinceName: z.string().trim().min(1, { message: "Vui lòng chọn tỉnh/thành người nhận" }),
});

export const productSchema = z.object({
    content: z.string().trim().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
    weight: z.preprocess(
        numberPreprocess,
        z.number({
            required_error: "Vui lòng nhập khối lượng",
            invalid_type_error: "Khối lượng phải là số"
        })
            .min(0.1, { message: "Khối lượng phải lớn hơn 0" })
            .max(3000, { message: "Khối lượng tối đa là 3000kg" })
    ),
    length: z.preprocess(
        numberPreprocess,
        z.number({
            required_error: "Vui lòng nhập chiều dài",
            invalid_type_error: "Chiều dài phải là số"
        })
            .min(0.1, { message: "Chiều dài phải lớn hơn 0" })
            .max(100, { message: "Chiều dài tối đa là 100cm" })
    ),
    width: z.preprocess(
        numberPreprocess,
        z.number({
            required_error: "Vui lòng nhập chiều rộng",
            invalid_type_error: "Chiều rộng phải là số"
        })
            .min(0.1, { message: "Chiều rộng phải lớn hơn 0" })
            .max(100, { message: "Chiều rộng tối đa là 100cm" })
    ),
    height: z.preprocess(
        numberPreprocess,
        z.number({
            required_error: "Vui lòng nhập chiều cao",
            invalid_type_error: "Chiều cao phải là số"
        })
            .min(0.1, { message: "Chiều cao phải lớn hơn 0" })
            .max(150, { message: "Chiều cao tối đa là 150cm" })
    ),
    images: z
        .array(z.instanceof(File))
        .min(1, { message: "Vui lòng thêm ít nhất 1 ảnh sản phẩm" }),
    note: z.string().trim().min(1, { message: "Vui lòng nhập ghi chú cho sản phẩm" }),
});

export const pickShiftSchema = z.object({
    pickShiftId: z.preprocess(
        numberPreprocess,
        z.number({
            required_error: "Vui lòng chọn ca lấy hàng",
            invalid_type_error: "Ca lấy hàng phải là số"
        }).min(1, { message: "Vui lòng chọn ca lấy hàng" })
    ),
    pickShiftTitle: z.string().optional(),
});

// Main shipping form schema
export const shippingFormSchema = z.object({
    // Sender information
    ...senderSchema.shape,
    // Receiver information
    ...receiverSchema.shape,
    // Product information
    ...productSchema.shape,
    // Pick shift
    pickShift: pickShiftSchema,
    // Shipping fee
    shippingFee: z.preprocess(
        numberPreprocess,
        z.number({
            required_error: "Vui lòng tính phí giao hàng",
            invalid_type_error: "Phí giao hàng phải là số"
        }).min(0, { message: "Phí giao hàng không được âm" })
    ),
    // Optional order ID
    orderID: z.string().optional(),
});

// Type exports
export type SenderFormValues = z.infer<typeof senderSchema>;
export type ReceiverFormValues = z.infer<typeof receiverSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type PickShiftFormValues = z.infer<typeof pickShiftSchema>;
export type ShippingFormValues = z.infer<typeof shippingFormSchema>;

// Validation result type
export interface ValidationResult {
    success: boolean;
    errors: Record<string, string>;
}

// Generic validation function
const validateWithSchema = <T extends z.ZodTypeAny>(
    schema: T,
    data: unknown,
    errorPrefix = ""
): ValidationResult => {
    try {
        schema.parse(data);
        return { success: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const field = errorPrefix ? `${errorPrefix}.${err.path.join('.')}` : err.path.join('.');
                formattedErrors[field] = err.message;
            });
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { general: "Validation failed" } };
    }
};

// Main validation function
export const validateShippingForm = (data: Record<string, unknown>): ValidationResult => {
    return validateWithSchema(shippingFormSchema, data);
};

// Individual field validation functions - for real-time validation of specific fields
export const validateField = (fieldName: string, value: unknown): ValidationResult => {
    const fieldSchemas: Record<string, z.ZodTypeAny> = {
        // Sender fields
        fromName: z.string().trim().min(1, { message: "Vui lòng nhập họ tên người gửi" }),
        fromPhone: z.string().trim().min(1, { message: "Vui lòng nhập SĐT người gửi" })
            .regex(phoneRegex, { message: "SĐT người gửi phải đúng định dạng (0xxxxxxxxx)" }),
        fromAddress: z.string().trim().min(1, { message: "Vui lòng nhập địa chỉ người gửi" }),
        fromDistrictName: z.string().trim().min(1, { message: "Vui lòng chọn quận/huyện người gửi" }),
        fromWardName: z.string().trim().min(1, { message: "Vui lòng chọn phường/xã người gửi" }),
        fromProvinceName: z.string().trim().min(1, { message: "Vui lòng chọn tỉnh/thành người gửi" }),

        // Receiver fields
        toName: z.string().trim().min(1, { message: "Vui lòng nhập họ tên người nhận" }),
        toPhone: z.string().trim().min(1, { message: "Vui lòng nhập SĐT người nhận" })
            .regex(phoneRegex, { message: "SĐT người nhận phải đúng định dạng (0xxxxxxxxx)" }),
        // toAddressDetail: z.string().trim().min(1, { message: "Vui lòng nhập địa chỉ người nhận" }),
        toDistrictName: z.string().trim().min(1, { message: "Vui lòng chọn quận/huyện người nhận" }),
        toWardName: z.string().trim().min(1, { message: "Vui lòng chọn phường/xã người nhận" }),
        toProvinceName: z.string().trim().min(1, { message: "Vui lòng chọn tỉnh/thành người nhận" }),

        // Product fields
        content: z.string().trim().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
        weight: z.preprocess(numberPreprocess, z.number().min(0.1, { message: "Khối lượng phải lớn hơn 0" }).max(3000, { message: "Khối lượng tối đa là 3000kg" })),
        length: z.preprocess(numberPreprocess, z.number().min(0.1, { message: "Chiều dài phải lớn hơn 0" }).max(100, { message: "Chiều dài tối đa là 100cm" })),
        width: z.preprocess(numberPreprocess, z.number().min(0.1, { message: "Chiều rộng phải lớn hơn 0" }).max(100, { message: "Chiều rộng tối đa là 100cm" })),
        height: z.preprocess(numberPreprocess, z.number().min(0.1, { message: "Chiều cao phải lớn hơn 0" }).max(150, { message: "Chiều cao tối đa là 150cm" })),
        note: z.string().trim().min(1, { message: "Vui lòng nhập ghi chú cho sản phẩm" }),

        // Pick shift
        'pickShift.pickShiftId': z.preprocess(numberPreprocess, z.number().min(1, { message: "Vui lòng chọn ca lấy hàng" })),

        // Shipping fee
        shippingFee: z.preprocess(numberPreprocess, z.number().min(0, { message: "Phí giao hàng không được âm" })),
    };

    const schema = fieldSchemas[fieldName];
    if (!schema) {
        return { success: true, errors: {} };
    }

    return validateWithSchema(schema, value, fieldName.includes('.') ? '' : fieldName);
};

// Partial validation functions for real-time validation
export const validateSender = (data: Record<string, unknown>): ValidationResult => {
    // Only validate fields that have values
    const fieldsToValidate: Record<string, unknown> = {};
    const senderFields = ['fromName', 'fromPhone', 'fromAddress', 'fromDistrictName', 'fromWardName', 'fromProvinceName'];

    senderFields.forEach(field => {
        if (data[field] && String(data[field]).trim() !== '') {
            fieldsToValidate[field] = data[field];
        }
    });

    // If no fields have values, don't validate
    if (Object.keys(fieldsToValidate).length === 0) {
        return { success: true, errors: {} };
    }

    // Create partial schema for validation
    const partialSchemaShape: Record<string, z.ZodTypeAny> = {};
    senderFields.forEach(field => {
        if (fieldsToValidate[field] !== undefined) {
            if (field === 'fromPhone') {
                partialSchemaShape[field] = z.string()
                    .trim()
                    .min(1, { message: "Vui lòng nhập SĐT người gửi" })
                    .regex(phoneRegex, { message: "SĐT người gửi phải đúng định dạng (0xxxxxxxxx)" });
            } else {
                partialSchemaShape[field] = z.string().trim().min(1, {
                    message: `Vui lòng nhập ${field.replace('from', '').toLowerCase()}`
                });
            }
        }
    });

    const partialSchema = z.object(partialSchemaShape);
    return validateWithSchema(partialSchema, fieldsToValidate);
};

export const validateReceiver = (data: Record<string, unknown>): ValidationResult => {
    // Only validate fields that have values
    const fieldsToValidate: Record<string, unknown> = {};
    const receiverFields = ['toName', 'toPhone', 'toDistrictName', 'toWardName', 'toProvinceName'];

    receiverFields.forEach(field => {
        if (data[field] && String(data[field]).trim() !== '') {
            fieldsToValidate[field] = data[field];
        }
    });

    // If no fields have values, don't validate
    if (Object.keys(fieldsToValidate).length === 0) {
        return { success: true, errors: {} };
    }

    // Create partial schema for validation
    const partialSchemaShape: Record<string, z.ZodTypeAny> = {};
    receiverFields.forEach(field => {
        if (fieldsToValidate[field] !== undefined) {
            if (field === 'toPhone') {
                partialSchemaShape[field] = z.string()
                    .trim()
                    .min(1, { message: "Vui lòng nhập SĐT người nhận" })
                    .regex(phoneRegex, { message: "SĐT người nhận phải đúng định dạng (0xxxxxxxxx)" });
            } else {
                partialSchemaShape[field] = z.string().trim().min(1, {
                    message: `Vui lòng nhập ${field.replace('to', '').toLowerCase()}`
                });
            }
        }
    });

    const partialSchema = z.object(partialSchemaShape);
    return validateWithSchema(partialSchema, fieldsToValidate);
};

export const validateProduct = (data: Record<string, unknown>): ValidationResult => {
    // Only validate fields that have values
    const fieldsToValidate: Record<string, unknown> = {};
    const productFields = ['content', 'weight', 'length', 'width', 'height', 'images', 'note'];

    productFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
            fieldsToValidate[field] = data[field];
        }
    });

    // If no fields have values, don't validate
    if (Object.keys(fieldsToValidate).length === 0) {
        return { success: true, errors: {} };
    }

    // Create partial schema for validation
    const partialSchemaShape: Record<string, z.ZodTypeAny> = {};
    productFields.forEach(field => {
        if (fieldsToValidate[field] !== undefined) {
            if (['weight', 'length', 'width', 'height'].includes(field)) {
                partialSchemaShape[field] = z.preprocess(
                    numberPreprocess,
                    z.number()
                        .min(0.1, { message: `${field.charAt(0).toUpperCase() + field.slice(1)} phải lớn hơn 0` })
                        .max(
                            field === 'weight' ? 3000 : field === 'height' ? 150 : 100,
                            {
                                message: `${field.charAt(0).toUpperCase() + field.slice(1)} tối đa là ${field === 'weight' ? '3000kg' : field === 'height' ? '150cm' : '100cm'
                                    }`
                            }
                        )
                );
            } else if (field === 'images') {
                partialSchemaShape[field] = z.array(z.instanceof(File)).min(1, {
                    message: "Vui lòng thêm ít nhất 1 ảnh sản phẩm"
                });
            } else if (field === 'content') {
                partialSchemaShape[field] = z.string().trim().min(1, {
                    message: "Vui lòng nhập tên sản phẩm"
                });
            } else if (field === 'note') {
                partialSchemaShape[field] = z.string().trim().min(1, {
                    message: "Vui lòng nhập ghi chú cho sản phẩm"
                });
            }
        }
    });

    const partialSchema = z.object(partialSchemaShape);
    return validateWithSchema(partialSchema, fieldsToValidate);
};

// Utility function to validate pick shift
export const validatePickShift = (data: Record<string, unknown>): ValidationResult => {
    const pickShiftData = data.pickShift as { pickShiftId?: number; pickShiftTitle?: string } | undefined;
    if (!pickShiftData || !pickShiftData.pickShiftId) {
        return { success: true, errors: {} };
    }

    return validateWithSchema(pickShiftSchema, pickShiftData, 'pickShift');
};

// Utility function to validate shipping fee
export const validateShippingFee = (data: Record<string, unknown>): ValidationResult => {
    if (data.shippingFee === undefined || data.shippingFee === null) {
        return { success: true, errors: {} };
    }

    const feeSchema = z.preprocess(
        numberPreprocess,
        z.number().min(0, { message: "Phí giao hàng không được âm" })
    );

    return validateWithSchema(feeSchema, data.shippingFee, 'shippingFee');
}; 