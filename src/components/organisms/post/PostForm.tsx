"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import FormLabel from "@/components/atoms/post/customer-upload-post/FormLabel"
import FormError from "@/components/atoms/post/customer-upload-post/FormError"
import FileUpload from "@/components/molecules/post/customer-upload-post/FileUpload"
import MultipleFileUpload from "@/components/molecules/post/customer-upload-post/MultipleFileUpload"
import { toast } from "sonner"
import PostService from "@/services/PostService"
import { MESSAGE } from "@/constants"
import { UploadPostFormValues, uploadPostSchema } from "@/schemas/postSchema"

export default function PostForm() {
    const [originalFile, setOriginalFile] = useState<File | null>(null)
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
    const [submitting, setSubmitting] = useState(false)
    const { createPost } = PostService()

    const [formErrors, setFormErrors] = useState({
        originalFile: "",
        additionalFiles: "",
    })

    const form = useForm({
        resolver: zodResolver(uploadPostSchema),
        defaultValues: {
            Title: "",
            Description: "",
            ItemValue: 0,
            SuggestedPrice: 0,
        },
    })

    const onSubmit = async (data: UploadPostFormValues) => {
        // Validate files
        let hasErrors = false
        const errors = {
            originalFile: "",
            additionalFiles: "",
        }

        if (!originalFile) {
            errors.originalFile = "Vui lòng tải lên ảnh gốc của sản phẩm"
            hasErrors = true
        }

        // if (additionalFiles.length !== 3) {
        //     errors.additionalFiles = "Vui lòng tải lên đủ 3 ảnh mẫu"
        //     hasErrors = true
        // }

        setFormErrors(errors)

        if (hasErrors) return

        setSubmitting(true)
        const valuesSumit = {
            ...data,
            AttachmentFile:originalFile,
            AttachmentFiles:additionalFiles,
        }
        console.log('valuesSumit: ', valuesSumit)
        
        const response = await createPost(valuesSumit)
        
        if (response) {
            toast.success(MESSAGE.CREATE_POST_SUCCESSFULLY)
            // Reset form
            form.reset()
            setOriginalFile(null)
            setAdditionalFiles([])
        }
        setSubmitting(false)
    }

    return (
        <div className="grid grid-cols-1 gap-6 w-[900px]">
            <div className="">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Đăng Bài Mới</h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="Title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required htmlFor="title">
                                            Tiêu đề
                                        </FormLabel>

                                        <FormControl>
                                            <Input id="title" {...field} className="bg-white" />
                                        </FormControl>
                                        <FormError>{form.formState.errors.Title?.message}</FormError>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="Description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required htmlFor="description">
                                            Mô tả
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea id="description" {...field} className="bg-white min-h-[100px]" />
                                        </FormControl>
                                        <FormError>{form.formState.errors.Description?.message}</FormError>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ItemValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required htmlFor="itemValue">
                                            Giá trị sản phẩm
                                        </FormLabel>

                                        <FormControl>
                                            <Input id="itemValue" type="number" step="1" {...field} className="bg-white" />
                                        </FormControl>
                                        <FormError>{form.formState.errors.ItemValue?.message}</FormError>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="SuggestedPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required htmlFor="suggestedPrice">
                                            Giá đề xuất
                                        </FormLabel>

                                        <FormControl>
                                            <Input id="suggestedPrice" type="number" step="1" {...field} className="bg-white" />
                                        </FormControl>
                                        <FormError>{form.formState.errors.SuggestedPrice?.message}</FormError>
                                    </FormItem>
                                )}
                            />

                            <div>
                                <FormLabel required htmlFor="attachmentFile">
                                    Ảnh gốc sản phẩm
                                </FormLabel>
                                <FileUpload
                                    id="attachmentFile"
                                    onChange={setOriginalFile}
                                    value={originalFile}
                                    error={formErrors.originalFile}
                                    accept=".jpg,.jpeg,.png"
                                    maxSize={1048576} // 1MB
                                />
                            </div>

                            <div>
                                <FormLabel htmlFor="attachmentFiles">
                                    Ảnh mẫu sản phẩm
                                </FormLabel>
                                <MultipleFileUpload
                                    id="attachmentFiles"
                                    onChange={setAdditionalFiles}
                                    value={additionalFiles}
                                    error={formErrors.additionalFiles}
                                    accept=".jpg,.jpeg,.png"
                                    maxSize={1048576} // 1MB
                                    maxFiles={3}
                                />
                            </div>

                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
                                {submitting ? "Đang xử lý..." : "Đăng bài"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
