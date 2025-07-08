"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex flex-col gap-1 items-start">
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
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(order.walletOrderID)
                }
              >
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
              {order.orderStatusDisplay === "Completed" && (
                <DropdownMenuItem>Tải xuống biên lai</DropdownMenuItem>
              )}
              {order.orderStatusDisplay === "Pending" && (
                <DropdownMenuItem className="text-red-600">
                  Hủy giao dịch
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      );
    },
  },
];
