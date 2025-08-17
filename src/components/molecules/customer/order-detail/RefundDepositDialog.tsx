"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, CheckCircle, DollarSign, AlertTriangle } from "lucide-react"
import type { OfferPhase } from "@/types/orderManagement"
import { formatCurrencyVND } from "@/utils"

interface RefundDepositDialogProps {
  isOpen: boolean
  onClose: () => void
  phases: OfferPhase[]
  onSubmit: (phaseIds: string[]) => Promise<void>
}

export default function RefundDepositDialog({ isOpen, onClose, phases, onSubmit }: RefundDepositDialogProps) {
  const [selectedPhases, setSelectedPhases] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getPhaseStatusConfig = (status: string) => {
    switch (status) {
      case "NotStarted":
        return {
          label: "Chưa bắt đầu",
          color: "bg-gray-100 text-gray-800",
          icon: null,
        }
      case "Dealed":
        return {
          label: "Đã thương lượng",
          color: "bg-indigo-100 text-indigo-800",
          icon: null,
        }
      case "Deposited":
        return {
          label: "Đã đặt cọc",
          color: "bg-yellow-100 text-yellow-800",
          icon: <CheckCircle className="h-3 w-3" />,
        }
      case "Withdrawed":
        return {
          label: "Đã rút cọc",
          color: "bg-orange-100 text-orange-800",
          icon: null,
        }
      case "InProgress":
        return {
          label: "Đang thực hiện",
          color: "bg-blue-100 text-blue-800",
          icon: null,
        }
      case "Rework":
        return {
          label: "Làm lại",
          color: "bg-purple-100 text-purple-800",
          icon: null,
        }
      case "Done":
        return {
          label: "Hoàn thành",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
        }
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
          icon: null,
        }
    }
  }

  // Calculate total refund amount
  const calculateTotalAmount = () => {
    return selectedPhases.reduce((total, phaseId) => {
      const phase = phases.find((p) => p.offerPhaseID === phaseId)
      return total + (phase?.offerPhasePrice || 0)
    }, 0)
  }

  const handlePhaseToggle = (phaseId: string) => {
    setSelectedPhases((prev) => (prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]))
  }

  const handleSelectAll = () => {
    setSelectedPhases(selectedPhases.length === phases.length ? [] : phases.map((p) => p.offerPhaseID))
  }

  const handleSubmit = async () => {
    if (selectedPhases.length === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedPhases)
      setSelectedPhases([])
      onClose()
    } catch (error) {
      console.error("Error refunding deposit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedPhases([])
    onClose()
  }

  const isAllSelected = selectedPhases.length === phases.length
  const isIndeterminate = selectedPhases.length > 0 && selectedPhases.length < phases.length
  const totalAmount = calculateTotalAmount()

  if (phases.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-700 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Hoàn tiền cọc
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không có giai đoạn nào có thể hoàn tiền cọc</p>
            <p className="text-sm text-gray-500 mt-2">Chỉ có thể hoàn tiền từ các giai đoạn đã đặt cọc</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[610px] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 -m-6 mb-4 p-6 border-b">
            <DialogTitle className="text-xl font-bold text-red-700 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Hoàn tiền cọc
            </DialogTitle>
            <p className="text-sm text-red-600 mt-1">Chọn các giai đoạn để hoàn tiền cọc do đơn hàng bị từ chối</p>
          </div>
        </DialogHeader>

        {/* Warning Notice */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Lưu ý quan trọng:</p>
            <p>Đơn hàng đã bị từ chối. Bạn có thể yêu cầu hoàn tiền cọc cho các giai đoạn đã thanh toán.</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Select All */}
          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  ref={(ref: any) => {
                    if (ref) ref.indeterminate = isIndeterminate
                  }}
                  onCheckedChange={handleSelectAll}
                  className="h-5 w-5 border-red-300 data-[state=checked]:bg-red-600"
                />
                <label htmlFor="select-all" className="font-medium cursor-pointer text-red-800">
                  Chọn tất cả ({selectedPhases.length}/{phases.length})
                </label>
              </div>

              {/* Total Amount Display */}
              {selectedPhases.length > 0 && (
                <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full border border-red-300">
                  <DollarSign className="h-4 w-4 text-red-700" />
                  <span className="font-semibold text-red-800">{formatCurrencyVND(totalAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Phases List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {phases.map((phase) => {
              const statusConfig = getPhaseStatusConfig(phase.offerPhaseStatus)
              const isSelected = selectedPhases.includes(phase.offerPhaseID)

              return (
                <Card
                  key={phase.offerPhaseID}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md m-1 ${
                    isSelected ? "ring-2 ring-red-500 bg-red-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handlePhaseToggle(phase.offerPhaseID)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}} // Handled by card click
                        className="mt-1 h-5 w-5 border-red-300 data-[state=checked]:bg-red-600"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{phase.phase}</span>
                            <span className="text-sm text-gray-600">{phase.phaseName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusConfig.icon}
                            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                          </div>
                        </div>

                        {phase.phaseDescription && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{phase.phaseDescription}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {new Date(phase.startDate).toLocaleDateString("vi-VN")} -{" "}
                            {new Date(phase.endDate).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="font-semibold text-red-600 flex items-center gap-1">
                            <RefreshCw className="h-4 w-4" />
                            {formatCurrencyVND(phase.offerPhasePrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Đã chọn: <span className="font-semibold text-red-600">{selectedPhases.length}</span> giai đoạn
              </div>
              {selectedPhases.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Tổng tiền hoàn:</span>
                  <span className="font-bold text-red-600 text-base">{formatCurrencyVND(totalAmount)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedPhases.length === 0 || isSubmitting}
                className="min-w-[120px] bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Hoàn tiền ({selectedPhases.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
