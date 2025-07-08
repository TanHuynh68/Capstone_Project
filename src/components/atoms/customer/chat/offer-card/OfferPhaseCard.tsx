"use client"

import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"

import UpdateOfferPhase from "../chat-form/UpdateOfferPhase"
import { CustomBadge } from "./Badge"

import { formatDateRangeVN, offerStatusVariant, offerStatusVN, useCurrentUser } from "@/utils"
import { ROLE } from "@/constants"

interface OfferPhaseCardProps {
  offerPhase: OfferPhase
  fetchOfferPhase: (offerID: string) => Promise<void>
}

const OfferPhaseCard = ({ offerPhase, fetchOfferPhase }: OfferPhaseCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const currentUser = useCurrentUser()

  const handleOpenDialog = () => {
    if (currentUser?.role === ROLE.DESIGNER) {
      setIsOpen(true)
    }
  }

  const handleUpdateSuccess = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Card
        className={`p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-lg transition-all duration-300 ${
          currentUser?.role === ROLE.DESIGNER ? "cursor-pointer hover:from-gray-800 hover:to-gray-700" : ""
        }`}
        onClick={handleOpenDialog}
      >
        <div className="grid grid-cols-12 gap-3">
          <div className="flex gap-3 items-center col-span-9">
            <div className="text-xs font-semibold bg-gray-700 px-3 py-1 rounded-full">
              Giai đoạn {offerPhase?.phase}
            </div>
            <div className="text-lg font-semibold truncate">{offerPhase?.phaseName}</div>
          </div>

          <div className="col-span-3 flex justify-end">
            <CustomBadge variant={offerStatusVariant(offerPhase?.offerPhaseStatus)}>
              {offerStatusVN(offerPhase?.offerPhaseStatus)}
            </CustomBadge>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
          <div className="text-sm text-gray-300">
            {formatDateRangeVN(offerPhase?.startDate + "", offerPhase?.endDate + "")}
          </div>

          <div className="text-lg font-bold text-yellow-400">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(offerPhase?.offerPhasePrice)}
          </div>
        </div>

        {offerPhase?.phaseDescription && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-sm text-gray-300 line-clamp-2">{offerPhase.phaseDescription}</div>
          </div>
        )}

        {currentUser?.role === ROLE.DESIGNER && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs bg-blue-500 px-2 py-1 rounded text-white">Nhấn để chỉnh sửa</div>
          </div>
        )}
      </Card>

      {/* Update Dialog */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="min-w-[650px] p-6 overflow-hidden">
            <UpdateOfferPhase fetchOfferPhase={fetchOfferPhase} offer={offerPhase} onSuccess={handleUpdateSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default OfferPhaseCard
