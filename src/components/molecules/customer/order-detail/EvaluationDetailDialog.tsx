"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProgressStepApproval } from "@/types/orderManagement"
import { CheckCircle, X, Star, Calendar } from "lucide-react"

interface EvaluationDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  evaluation: ProgressStepApproval | null
  stepTitle?: string
}

export default function EvaluationDetailDialog({
  isOpen,
  onClose,
  evaluation,
  stepTitle,
}: EvaluationDetailDialogProps) {
  if (!evaluation) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPassStatus = (isPass: boolean) => {
    return isPass
      ? { icon: CheckCircle, label: "Đạt yêu cầu", color: "bg-green-100 text-green-800" }
      : { icon: X, label: "Chưa đạt yêu cầu", color: "bg-red-100 text-red-800" }
  }

  const passStatus = getPassStatus(evaluation.isPass)
  const PassIcon = passStatus.icon

  const criteriaItems = [
    {
      label: "Thiết kế chính xác",
      value: evaluation.isDesignAccurate,
      key: "isDesignAccurate",
    },
    {
      label: "Chất liệu đúng yêu cầu",
      value: evaluation.isMaterialCorrect,
      key: "isMaterialCorrect",
    },
    {
      label: "Màu sắc chính xác",
      value: evaluation.isColorCorrect,
      key: "isColorCorrect",
    },
    {
      label: "Chức năng đáp ứng",
      value: evaluation.isFunctionalityMet,
      key: "isFunctionalityMet",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chi tiết đánh giá {stepTitle && `- ${stepTitle}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Điểm tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(evaluation.totalScore)}`}>
                    {evaluation.totalScore}
                  </div>
                  <div className="text-sm text-gray-600">Tổng điểm</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(evaluation.qualityScore)}`}>
                    {evaluation.qualityScore}
                  </div>
                  <div className="text-sm text-gray-600">Điểm chất lượng</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Badge className={passStatus.color}>
                  <PassIcon className="h-4 w-4 mr-1" />
                  {passStatus.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tiêu chí đánh giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criteriaItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.label}</span>
                    <Badge className={item.value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {item.value ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đạt
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Chưa đạt
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Comment */}
          {evaluation.customerComment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nhận xét của khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 leading-relaxed">{evaluation.customerComment}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evaluation Date */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Ngày đánh giá:</span>
                <span>{formatDate(evaluation.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
