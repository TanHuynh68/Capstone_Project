"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UpdateBankCardForm } from "./update-bank-card-form"

interface UpdateBankCardButtonProps{
    walletID: string;
}
export function UpdateBankCardButton({walletID}:UpdateBankCardButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2 mt-5">
        <CreditCard className="h-4 w-4 " />
        Cập nhật
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật</DialogTitle>
          </DialogHeader>
          <UpdateBankCardForm walletID={walletID} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
