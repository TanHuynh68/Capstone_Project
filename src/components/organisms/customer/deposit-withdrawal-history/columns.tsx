"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip"; // Import TooltipProvider
import {
  formatDayAndTime,
  getOrderType,
  getPaymentMethodFromDescription,
} from "@/utils";
import ViewInvoiceButton from "@/components/organisms/manager-withdrawal-by-staff/ViewInvoiceButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import CustomerReportService from "@/services/CustomerReportService";
import ReportDialog from "@/components/molecules/customer-and-designer/report/ReportDialog";
import { ReportFormData } from "@/schemas/report/reportSchema";

// Report button component for table actions
const ReportButton = ({ walletOrder }: { walletOrder: WalletOrder }) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { createReport } = CustomerReportService();

  const handleReportSubmit = async (data: ReportFormData) => {
    const response = await createReport({
      ...data,
      targetID: walletOrder.walletID,
      reportType: 6,
    });
    setIsReportDialogOpen(false);
    return response;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsReportDialogOpen(true)}
        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Flag className="h-3 w-3 mr-1" />
        Báo cáo
      </Button>

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
        targetID={walletOrder.walletOrderID}
        defaultReportType={6} // Assuming 6 is for wallet transactions
      />
    </>
  );
};

export const columns: ColumnDef<WalletOrder>[] = [
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Loại giao dịch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.original.description;
      const orderType = getOrderType(description);
      return (
        <div className="flex items-center justify-center">
          <Badge
            variant={orderType === "Nạp tiền" ? "success" : "default"}
            className="whitespace-nowrap"
          >
            {orderType}
          </Badge>
        </div>
      );
    },
    accessorFn: (row) => getOrderType(row.description),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          <div className="pl-1"> Số tiền</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const description = row.original.description;
      const isDeposit = description.includes("Nạp");
      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
      return (
        <div className="flex items-center justify-center">
          <span className={isDeposit ? "text-green-600" : "text-red-600"}>
            {isDeposit ? (
              <ArrowUp className="inline mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="inline mr-1 h-4 w-4" />
            )}
            {formatted}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Phương thức
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.original.description;
      const paymentMethod = getPaymentMethodFromDescription(description);
      return <div className="text-center">{paymentMethod}</div>;
    },
    accessorFn: (row) => getPaymentMethodFromDescription(row.description),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Mô tả
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[300px] truncate cursor-pointer text-center">
                {row.getValue("description")}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="whitespace-pre-wrap">
                {row.getValue("description")}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Ngày giao dịch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("orderDate"));
      // Format the date
      const formatDate = formatDayAndTime(date);
      return <div className="whitespace-nowrap text-center">{formatDate}</div>;
    },
  },
  {
    accessorKey: "orderStatusDisplay",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Trạng thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("orderStatusDisplay") as string;
      return (
        <div className="flex justify-center">
          <Badge
            variant={
              status === "Completed"
                ? "success"
                : status === "Pending"
                ? "warning"
                : "destructive"
            }
          >
            {status === "Completed"
              ? "Hoàn thành"
              : status === "Pending"
              ? "Đang xử lý"
              : status === "Canceled"
              ? "Đã hủy"
              : status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
         Thao tác
        </Button>
      );
    },
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="grid grid-cols-2 gap-2 items-center">
          <ViewInvoiceButton
            row={{
              walletOrderID: order.walletOrderID,
              fullName: order.fullName,
              amount: order.amount,
              orderStatusDisplay: order.orderStatusDisplay,
              orderDate: order.orderDate,
              description: order.description,
              note: order.note ?? undefined,
              imageUrl: order.imageUrl ?? undefined,
            }}
          />
          <ReportButton walletOrder={order} />
        </div>
      );
    },
  },
];
