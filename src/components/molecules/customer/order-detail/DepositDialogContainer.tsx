"use client";

import { useState } from "react";
import DepositHistoryMainDialog from "./DepositHistoryMainDialog";
import DepositDetailDialog from "./DepositDetailDialog";

interface DepositTransaction {
  depositTransactionID: string;
  type: "Deposit" | "Withdraw";
  amount: number;
  description: string;
  transactionAt: string;
}

interface DepositDialogContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deposits: DepositHistoryItem[];
  loading?: boolean;
  onClose: () => void;
  fetchDepositTransaction: any;
}

export default function DepositDialogContainer({
  open,
  deposits,
  loading = false,
  onClose,
  fetchDepositTransaction,
}: DepositDialogContainerProps) {
  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] =
    useState<DepositHistoryItem | null>(null);
  const [detailTransactions, setDetailTransactions] = useState<
    DepositTransaction[]
  >([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleViewDetail = async (deposit: any) => {
    console.log("deposit: ", deposit);
    setSelectedDeposit(deposit);
    setDetailLoading(true);
    setDetailDialogOpen(true);

    try {
      // Mock data for demonstration
      const response = await fetchDepositTransaction(deposit.orderDepositID);
      console.log("fetchDepositTransaction: ", response);
      setDetailTransactions(response);
    } catch (error) {
      console.error("Error fetching deposit detail:", error);
      setDetailTransactions([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedDeposit(null);
    setDetailTransactions([]);
  };

  const handleCloseAll = () => {
    setDetailDialogOpen(false);
    setSelectedDeposit(null);
    setDetailTransactions([]);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleCloseAll}
      />

      {/* Container for both dialogs */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex gap-4 max-w-full max-h-full">
          {/* Main Dialog */}
          <DepositHistoryMainDialog
            deposits={deposits}
            loading={loading}
            onClose={handleCloseAll}
            onViewDetail={handleViewDetail}
          />

          {/* Detail Dialog - slides in from right */}
          {detailDialogOpen && (
            <DepositDetailDialog
              selectedDeposit={selectedDeposit}
              detailTransactions={detailTransactions}
              detailLoading={detailLoading}
              onClose={handleCloseDetail}
            />
          )}
        </div>
      </div>
    </>
  );
}
