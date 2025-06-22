"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { WALLET_TRANSACTION_V_TYPE } from "@/constants";
import { getTransactionTypeName } from "@/components/utils/helpers/helpers";
import { formatDayAndTime } from "@/components/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transactionType",
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
      const type = row.getValue("transactionType") + "";
      const label = getTransactionTypeName(type);

      return (
        <div className="flex items-center justify-center">
          <Badge
            variant={
              type === WALLET_TRANSACTION_V_TYPE.Deposit + "" ||
              type === WALLET_TRANSACTION_V_TYPE.Receive + "" ||
              type === WALLET_TRANSACTION_V_TYPE.RefundDeposit + ""
                ? "success"
                : "default"
            }
            className="whitespace-nowrap"
          >
            {label}
          </Badge>
        </div>
      );
    },
    filterFn: (row: any, id, value) => {
      return value.includes(row.getValue(id).toString());
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
          <div className="pl-1">Số tiền</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const type = row.getValue("transactionType");
      const isPositive =
        type === "Deposit" || type === "Receive" || type === "RefundDeposit";

      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);

      return (
        <div className="flex items-center justify-center">
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? (
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
    accessorKey: "beforeBalance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Số dư trước
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const beforeBalance = Number.parseFloat(row.getValue("beforeBalance"));

      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(beforeBalance);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "afterBalance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full"
        >
          Số dư sau
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const afterBalance = Number.parseFloat(row.getValue("afterBalance"));

      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(afterBalance);

      return <div className="text-center">{formatted}</div>;
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
    accessorKey: "transactionDate",
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
      const date = new Date(row.getValue("transactionDate"));
      // Format the date
      const formatDate = formatDayAndTime(date);
      return <div className="whitespace-nowrap text-center">{formatDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex flex-col gap-1 items-start">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem>Tải xuống biên lai</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
