"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send, X } from "lucide-react"
import type { EvaluationCriteria } from "@/types/orderManagement"

interface EvaluationFormProps {
  onSubmit: (criteria: EvaluationCriteria) => void
  onCancel: () => void
}

export default function EvaluationForm({ onSubmit, onCancel }: EvaluationFormProps) {
  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    qualityScore: 0,
    isDesignAccurate: false,
    isMaterialCorrect: false,
    isColorCorrect: false,
    isFunctionalityMet: false,
    customerComment: "",
  })

  const handleStarClick = (rating: number) => {
    setCriteria((prev) => ({ ...prev, qualityScore: rating }))
  }

  const handleCriteriaChange = (key: keyof EvaluationCriteria, value: boolean) => {
    setCriteria((prev) => ({ ...prev, [key]: value }))
  }

  const calculateTotalScore = () => {
    const booleanCriteria = [
      criteria.isDesignAccurate,
      criteria.isMaterialCorrect,
      criteria.isColorCorrect,
      criteria.isFunctionalityMet,
    ]
    const booleanScore = booleanCriteria.filter(Boolean).length * 5 // Each boolean criterion is worth 5 points
    const qualityScore = criteria.qualityScore * 2 // 5 stars * 2 = 10 points
    return Math.min(booleanScore + qualityScore, 30) // Total score capped at 30
  }

  const handleSubmit = () => {
    onSubmit(criteria)
  }

  const criteriaItems = [
    { key: "isDesignAccurate" as const, label: "Thiết kế chính xác" },
    { key: "isMaterialCorrect" as const, label: "Chất liệu đúng yêu cầu" },
    { key: "isColorCorrect" as const, label: "Màu sắc chính xác" },
    { key: "isFunctionalityMet" as const, label: "Đáp ứng chức năng" },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Tiêu chí đánh giá</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Score */}
        <div>
          <label className="text-sm font-medium mb-2 block">Chất lượng tổng thể</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= criteria.qualityScore ? "text-yellow-500 fill-current" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">({criteria.qualityScore}/5)</span>
          </div>
        </div>

        {/* Boolean Criteria */}
        <div className="space-y-3">
          {criteriaItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <label className="text-sm font-medium">{item.label}</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={criteria[item.key] === true ? "default" : "outline"}
                  onClick={() => handleCriteriaChange(item.key, true)}
                  className="px-3"
                >
                  Có
                </Button>
                <Button
                  size="sm"
                  variant={criteria[item.key] === false ? "default" : "outline"}
                  onClick={() => handleCriteriaChange(item.key, false)}
                  className="px-3"
                >
                  Không
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium mb-2 block">Nhận xét</label>
          <Textarea
            placeholder="Nhập nhận xét của bạn..."
            value={criteria.customerComment}
            onChange={(e) => setCriteria((prev) => ({ ...prev, customerComment: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Total Score */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Tổng điểm:</span>
            <span className="text-xl font-bold text-blue-600">{calculateTotalScore()}/30</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button className="w-full" onClick={handleSubmit} disabled={criteria.qualityScore === 0}>
          <Send className="h-4 w-4 mr-2" />
          Gửi đánh giá
        </Button>
      </CardContent>
    </Card>
  )
}
