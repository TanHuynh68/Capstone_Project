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

// Sender information schema
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

// Receiver information schema
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

// Product information schema
export const productSchema = z.object({
    content: z.string({
        required_error: "Vui lòng nhập tên sản phẩm"
    }).min(1, { message: "Vui lòng nhập tên sản phẩm" }),
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
    note: z.string({
        required_error: "Vui lòng nhập ghi chú cho sản phẩm"
    }).min(1, { message: "Vui lòng nhập ghi chú cho sản phẩm" }),
});

// Pick shift schema
export const pickShiftSchema = z.object({
    pickShiftId: z.preprocess(
        (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
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

// Partial validation for individual sections
export const validateSender = (data: Record<string, unknown>) => {
    try {
        senderSchema.parse(data);
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
        receiverSchema.parse(data);
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
        productSchema.parse(data);
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