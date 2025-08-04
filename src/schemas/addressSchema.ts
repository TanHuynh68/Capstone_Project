import { z } from "zod";

export const createAddressSchema = z.object({
    addressDetail: z
        .string()
        .min(1, "Địa chỉ chi tiết không được để trống")
        .max(200, "Địa chỉ chi tiết không được quá 200 ký tự"),
    district: z
        .string()
        .min(1, "Vui lòng chọn quận/huyện"),
    ward: z
        .string()
        .min(1, "Vui lòng chọn phường/xã"),
    isMainAddress: z.boolean(),
});

export type CreateAddressFormData = z.infer<typeof createAddressSchema>;

export const createAddressPayloadSchema = createAddressSchema.transform((data) => ({
    ...data,
    district: Number(data.district),
    ward: Number(data.ward),
}));

export type CreateAddressPayload = z.infer<typeof createAddressPayloadSchema>;

export const updateAddressSchema = createAddressSchema.extend({
    id: z.string().optional(),
});

export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>;
