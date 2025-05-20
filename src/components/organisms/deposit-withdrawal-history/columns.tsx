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
import { getOrderType, getPaymentMethodFromDescription } from "@/components/utils"

export const columns: ColumnDef<WalletOrder>[] = [
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Loại giao dịch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const description = row.original.description
      const orderType = getOrderType(description)

      return (
        <div className="flex items-center">
          <Badge variant={orderType === "Nạp tiền" ? "success" : "default"} className="whitespace-nowrap">
            {orderType}
          </Badge>
        </div>
      )
    },
    accessorFn: (row) => getOrderType(row.description),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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
         <div className="pl-1"> Số tiền</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const description = row.original.description
      const isDeposit = description.includes("Nạp")

      // Format the amount as currency
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)

      return (
        <div className="flex items-center">
          <span className={isDeposit ? "text-green-600" : "text-red-600"}>
            {isDeposit ? <ArrowUp className="inline mr-1 h-4 w-4" /> : <ArrowDown className="inline mr-1 h-4 w-4" />}
            {formatted}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Phương thức
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const description = row.original.description
      const paymentMethod = getPaymentMethodFromDescription(description)

      return <div>{paymentMethod}</div>
    },
    accessorFn: (row) => getPaymentMethodFromDescription(row.description),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Mô tả
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="max-w-[300px] truncate">{row.getValue("description")}</div>
    },
  },
  {
    accessorKey: "orderDate",
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
      const date = new Date(row.getValue("orderDate"))

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
    accessorKey: "orderStatusDisplay",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Trạng thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("orderStatusDisplay") as string

      return (
        <Badge variant={status === "Completed" ? "success" : status === "Pending" ? "warning" : "destructive"}>
          {status === "Completed"
            ? "Hoàn thành"
            : status === "Pending"
              ? "Đang xử lý"
              : status === "Canceled"
                ? "Đã hủy"
                : status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.walletOrderID)}>
              Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            {order.orderStatusDisplay === "Completed" && <DropdownMenuItem>Tải xuống biên lai</DropdownMenuItem>}
            {order.orderStatusDisplay === "Pending" && (
              <DropdownMenuItem className="text-red-600">Hủy giao dịch</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
