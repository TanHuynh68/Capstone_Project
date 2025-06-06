"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import OfferPhaseCard from "./OfferPhaseCard"
import { motion } from "framer-motion"

interface OfferPhasesDialogProps {
  isOpen: boolean
  onClose: () => void
  offersPhase: OfferPhase[]
  fetchOfferPhase: () => void
}

const OfferPhasesDialog = ({ isOpen, onClose, offersPhase, fetchOfferPhase }: OfferPhasesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[400px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Giai đoạn dự án</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {offersPhase.length > 0 ? (
            offersPhase.map((item: OfferPhase) => (
              <motion.div
                key={item.offerPhaseID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OfferPhaseCard fetchOfferPhase={fetchOfferPhase} offerPhase={item} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">Không có giai đoạn nào được tìm thấy</div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OfferPhasesDialog
