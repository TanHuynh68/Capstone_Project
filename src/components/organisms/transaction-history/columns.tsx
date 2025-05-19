"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { WALLET_TRANSACTION_TYPE } from "@/constants"
import { getTransactionTypeName } from "@/components/utils/helpers"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transactionType",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Loại giao dịch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const type = row.getValue("transactionType")+''
      const label = getTransactionTypeName(type)

      return (
        <div className="flex items-center">
          <Badge
            variant={
                type === WALLET_TRANSACTION_TYPE.Deposit+'' ||
                type === WALLET_TRANSACTION_TYPE.Receive+'' ||
                type === WALLET_TRANSACTION_TYPE.RefundDeposit+''
                  ? "success"
                  : "default"
              }
            className="whitespace-nowrap"
          >
            {label}
          </Badge>
        </div>
      )
    },
    filterFn: (row: any, id, value) => {
      return value.includes(row.getValue(id).toString())
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Số tiền
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const type = row.getValue("transactionType") 
      const isPositive =
        type === 'Deposit'

      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)

      return (
        <div className="flex items-center">
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? <ArrowUp className="inline mr-1 h-4 w-4" /> : <ArrowDown className="inline mr-1 h-4 w-4" />}
            {formatted}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "afterBalance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Số dư sau
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const afterBalance = Number.parseFloat(row.getValue("afterBalance"))

      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(afterBalance)

      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Ngày giao dịch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("transactionDate"))

      // Format the date
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date)

      return <div className="whitespace-nowrap">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>
              Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Tải xuống biên lai</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
