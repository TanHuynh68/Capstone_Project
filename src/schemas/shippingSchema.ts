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

// Sender information schema - less strict for real-time validation
export const senderSchema = z.object({
    fromName: z.string().min(1, { message: "Vui lòng nhập họ tên người gửi" }),
    fromPhone: z
        .string()
        .min(1, { message: "Vui lòng nhập SĐT người gửi" })
        .regex(/^\d{10}$/, { message: "SĐT người gửi phải đủ 10 số" }),
    fromAddress: z.string().min(1, { message: "Vui lòng nhập địa chỉ người gửi" }),
    fromDistrictName: z.string().min(1, { message: "Vui lòng chọn quận/huyện người gửi" }),
    fromWardName: z.string().min(1, { message: "Vui lòng chọn phường/xã người gửi" }),
    fromProvinceName: z.string().min(1, { message: "Vui lòng chọn tỉnh/thành người gửi" }),
});

// Receiver information schema - less strict for real-time validation
export const receiverSchema = z.object({
    toName: z.string().min(1, { message: "Vui lòng nhập họ tên người nhận" }),
    toPhone: z
        .string()
        .min(1, { message: "Vui lòng nhập SĐT người nhận" })
        .regex(/^\d{10}$/, { message: "SĐT người nhận phải đủ 10 số" }),
    toAddressDetail: z.string().min(1, { message: "Vui lòng nhập địa chỉ người nhận" }),
    toDistrictName: z.string().min(1, { message: "Vui lòng chọn quận/huyện người nhận" }),
    toWardName: z.string().min(1, { message: "Vui lòng chọn phường/xã người nhận" }),
    toProvinceName: z.string().min(1, { message: "Vui lòng chọn tỉnh/thành người nhận" }),
});

// Product information schema - less strict for real-time validation
export const productSchema = z.object({
    content: z.string().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
    weight: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number()
            .min(1, { message: "Khối lượng phải lớn hơn 0" })
            .max(3000, { message: "Khối lượng tối đa là 3000" })
            .optional()
    ),
    length: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number()
            .min(1, { message: "Chiều dài phải lớn hơn 0" })
            .max(100, { message: "Chiều dài tối đa là 100" })
            .optional()
    ),
    width: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number()
            .min(1, { message: "Chiều rộng phải lớn hơn 0" })
            .max(100, { message: "Chiều rộng tối đa là 100" })
            .optional()
    ),
    height: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number()
            .min(1, { message: "Chiều cao phải lớn hơn 0" })
            .max(150, { message: "Chiều cao tối đa là 150" })
            .optional()
    ),
    images: z
        .array(z.instanceof(File))
        .min(1, { message: "Vui lòng thêm ít nhất 1 ảnh sản phẩm" })
        .optional(),
    note: z.string().optional(),
});

// Pick shift schema
export const pickShiftSchema = z.object({
    pickShiftId: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number().min(1, { message: "Vui lòng chọn ca lấy hàng" }).optional()
    ),
    pickShiftTitle: z.string().optional(),
});

// Main shipping form schema - strict for final validation
export const shippingFormSchema = z.object({
    // Sender information
    ...senderSchema.shape,
    // Receiver information
    ...receiverSchema.shape,
    // Product information
    content: z.string().min(1, { message: "Vui lòng nhập tên sản phẩm" }),
    weight: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number({
            required_error: "Vui lòng nhập khối lượng",
            invalid_type_error: "Khối lượng phải là số"
        })
            .min(1, { message: "Khối lượng phải lớn hơn 0" })
            .max(3000, { message: "Khối lượng tối đa là 3000" })
    ),
    length: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number({
            required_error: "Vui lòng nhập chiều dài",
            invalid_type_error: "Chiều dài phải là số"
        })
            .min(1, { message: "Chiều dài phải lớn hơn 0" })
            .max(100, { message: "Chiều dài tối đa là 100" })
    ),
    width: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number({
            required_error: "Vui lòng nhập chiều rộng",
            invalid_type_error: "Chiều rộng phải là số"
        })
            .min(1, { message: "Chiều rộng phải lớn hơn 0" })
            .max(100, { message: "Chiều rộng tối đa là 100" })
    ),
    height: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number({
            required_error: "Vui lòng nhập chiều cao",
            invalid_type_error: "Chiều cao phải là số"
        })
            .min(1, { message: "Chiều cao phải lớn hơn 0" })
            .max(150, { message: "Chiều cao tối đa là 150" })
    ),
    images: z
        .array(z.instanceof(File))
        .min(1, { message: "Vui lòng thêm ít nhất 1 ảnh sản phẩm" }),
    note: z.string().min(1, { message: "Vui lòng nhập ghi chú cho sản phẩm" }),
    // Pick shift
    pickShift: z.object({
        pickShiftId: z.preprocess(
            (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
            z.number({
                required_error: "Vui lòng chọn ca lấy hàng",
                invalid_type_error: "Ca lấy hàng phải là số"
            }).min(1, { message: "Vui lòng chọn ca lấy hàng" })
        ),
        pickShiftTitle: z.string().optional(),
    }),
    // Shipping fee
    shippingFee: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
        z.number({
            required_error: "Vui lòng tính phí giao hàng",
            invalid_type_error: "Phí giao hàng phải là số"
        }).min(0, { message: "Vui lòng tính phí giao hàng" })
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

// Validation function that returns formatted errors
export const validateShippingForm = (data: Record<string, unknown>) => {
    try {
        shippingFormSchema.parse(data);
        return { success: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const field = err.path.join('.');
                formattedErrors[field] = err.message;
            });
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { general: "Validation failed" } };
    }
};

// Partial validation for individual sections - only validate fields that have values
export const validateSender = (data: Record<string, unknown>) => {
    try {
        // Only validate fields that have values
        const fieldsToValidate: Record<string, unknown> = {};
        const requiredFields = ['fromName', 'fromPhone', 'fromAddress', 'fromDistrictName', 'fromWardName', 'fromProvinceName'];

        requiredFields.forEach(field => {
            if (data[field] && String(data[field]).trim() !== '') {
                fieldsToValidate[field] = data[field];
            }
        });

        // If no fields have values, don't validate
        if (Object.keys(fieldsToValidate).length === 0) {
            return { success: true, errors: {} };
        }

        // Create a partial schema for validation
        const schemaShape: Record<string, z.ZodTypeAny> = {};
        requiredFields.forEach(field => {
            if (fieldsToValidate[field] !== undefined) {
                if (field === 'fromPhone') {
                    schemaShape[field] = z.string()
                        .min(1, { message: "Vui lòng nhập SĐT người gửi" })
                        .regex(/^\d{10}$/, { message: "SĐT người gửi phải đủ 10 số" });
                } else {
                    schemaShape[field] = z.string().min(1, { message: `Vui lòng nhập ${field.replace('from', '').toLowerCase()}` });
                }
            }
        });

        const partialSchema = z.object(schemaShape);
        partialSchema.parse(fieldsToValidate);
        return { success: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const field = err.path.join('.');
                formattedErrors[field] = err.message;
            });
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { general: "Sender validation failed" } };
    }
};

export const validateReceiver = (data: Record<string, unknown>) => {
    try {
        // Only validate fields that have values
        const fieldsToValidate: Record<string, unknown> = {};
        const requiredFields = ['toName', 'toPhone', 'toAddressDetail', 'toDistrictName', 'toWardName', 'toProvinceName'];

        requiredFields.forEach(field => {
            if (data[field] && String(data[field]).trim() !== '') {
                fieldsToValidate[field] = data[field];
            }
        });

        // If no fields have values, don't validate
        if (Object.keys(fieldsToValidate).length === 0) {
            return { success: true, errors: {} };
        }

        // Create a partial schema for validation
        const schemaShape: Record<string, z.ZodTypeAny> = {};
        requiredFields.forEach(field => {
            if (fieldsToValidate[field] !== undefined) {
                if (field === 'toPhone') {
                    schemaShape[field] = z.string()
                        .min(1, { message: "Vui lòng nhập SĐT người nhận" })
                        .regex(/^\d{10}$/, { message: "SĐT người nhận phải đủ 10 số" });
                } else {
                    schemaShape[field] = z.string().min(1, { message: `Vui lòng nhập ${field.replace('to', '').toLowerCase()}` });
                }
            }
        });

        const partialSchema = z.object(schemaShape);
        partialSchema.parse(fieldsToValidate);
        return { success: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const field = err.path.join('.');
                formattedErrors[field] = err.message;
            });
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { general: "Receiver validation failed" } };
    }
};

export const validateProduct = (data: Record<string, unknown>) => {
    try {
        // Only validate fields that have values
        const fieldsToValidate: Record<string, unknown> = {};
        const requiredFields = ['content', 'weight', 'length', 'width', 'height', 'images', 'note'];

        requiredFields.forEach(field => {
            if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
                fieldsToValidate[field] = data[field];
            }
        });

        // If no fields have values, don't validate
        if (Object.keys(fieldsToValidate).length === 0) {
            return { success: true, errors: {} };
        }

        // Create a partial schema for validation
        const schemaShape: Record<string, z.ZodTypeAny> = {};
        requiredFields.forEach(field => {
            if (fieldsToValidate[field] !== undefined) {
                if (['weight', 'length', 'width', 'height'].includes(field)) {
                    schemaShape[field] = z.preprocess(
                        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
                        z.number()
                            .min(1, { message: `${field.charAt(0).toUpperCase() + field.slice(1)} phải lớn hơn 0` })
                            .max(field === 'weight' ? 3000 : field === 'height' ? 150 : 100, {
                                message: `${field.charAt(0).toUpperCase() + field.slice(1)} tối đa là ${field === 'weight' ? 3000 : field === 'height' ? 150 : 100}`
                            })
                    );
                } else if (field === 'images') {
                    schemaShape[field] = z.array(z.instanceof(File)).min(1, { message: "Vui lòng thêm ít nhất 1 ảnh sản phẩm" });
                } else if (field === 'content') {
                    schemaShape[field] = z.string().min(1, { message: "Vui lòng nhập tên sản phẩm" });
                } else if (field === 'note') {
                    schemaShape[field] = z.string().min(1, { message: "Vui lòng nhập ghi chú cho sản phẩm" });
                }
            }
        });

        const partialSchema = z.object(schemaShape);
        partialSchema.parse(fieldsToValidate);
        return { success: true, errors: {} };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const field = err.path.join('.');
                formattedErrors[field] = err.message;
            });
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { general: "Product validation failed" } };
    }
}; 