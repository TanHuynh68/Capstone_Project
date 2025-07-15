"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { X, Loader2, FileText, CheckCircle, XCircle } from "lucide-react"
import { processReportSchema, type ProcessReportFormData } from "@/schemas/updateReportSchema"
import type { ZodError } from "zod"

interface Report {
  reportID: string
  reporter: string
  targetID: string
  title: string
  reportType: string
  reportStatus: string
  createdAt: string
}

interface ProcessReportDialogProps {
  isOpen: boolean
  onClose: () => void
  report: Report | null
  onSubmit: (data: ProcessReportFormData) => Promise<boolean>
}

export default function ProcessReportDialog({ isOpen, onClose, report, onSubmit }: ProcessReportDialogProps) {
  const [formData, setFormData] = useState<ProcessReportFormData>({
    reportID: "",
    processNote: "",
    accept: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when report changes
  useEffect(() => {
    if (report) {
      setFormData({
        reportID: report.reportID,
        processNote: "",
        accept: true,
      })
      setErrors({})
    }
  }, [report])

  const handleInputChange = (field: keyof ProcessReportFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    try {
      processReportSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as ZodError
        const newErrors: Record<string, string> = {}
        zodError.issues.forEach((issue) => {
          const path = issue.path.join(".")
          newErrors[path] = issue.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const success = await onSubmit(formData)
      if (success) {
        handleClose()
        resetForm()
      }
    } catch (error) {
      console.error("Error processing report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      reportID: "",
      processNote: "",
      accept: true,
    })
    setErrors({})
  }

  const handleClose = () => {
    onClose()
    setErrors({})
  }

  if (!report) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Giải quyết báo cáo
          </DialogTitle>
          <p className="text-gray-600 text-sm">Xử lý và đưa ra quyết định cho báo cáo này</p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Report Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Thông tin báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">ID Báo cáo</Label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{report.reportID}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Người báo cáo</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">{report.reporter}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Tiêu đề</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">{report.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Loại báo cáo</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">{report.reportType}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Target ID</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-mono">{report.targetID || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Trạng thái hiện tại</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">{report.reportStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Form */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Quyết định xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Accept/Reject Decision */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Quyết định <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {formData.accept ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Label htmlFor="accept-switch" className="text-sm font-medium">
                      {formData.accept ? "Chấp nhận báo cáo" : "Từ chối báo cáo"}
                    </Label>
                  </div>
                  <Switch
                    id="accept-switch"
                    checked={formData.accept}
                    onCheckedChange={(checked) => handleInputChange("accept", checked)}
                  />
                </div>
                {errors.accept && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.accept}
                  </p>
                )}
              </div>

              {/* Process Note */}
              <div className="space-y-3">
                <Label htmlFor="processNote" className="text-sm font-semibold text-gray-700">
                  Ghi chú xử lý <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="processNote"
                  value={formData.processNote}
                  onChange={(e) => handleInputChange("processNote", e.target.value)}
                  placeholder={
                    formData.accept
                      ? "Nhập lý do chấp nhận báo cáo và các hành động đã thực hiện..."
                      : "Nhập lý do từ chối báo cáo..."
                  }
                  rows={4}
                  className={`resize-none ${
                    errors.processNote ? "border-red-500 focus:border-red-500 bg-red-50" : "focus:border-blue-500"
                  }`}
                />
                {errors.processNote && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.processNote}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Lưu ý:</span> Quyết định này sẽ được ghi lại và không thể hoàn tác
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="px-6 bg-transparent">
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 ${
                formData.accept
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : formData.accept ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Chấp nhận báo cáo
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối báo cáo
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
