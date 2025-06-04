import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import WalletService from "@/services/WalletService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatVietnamDateHours } from "@/components/utils/date";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WalletTransaction {
  walletTransactionID: string;
  beforeBalance: number;
  amount: number;
  afterBalance: number;
  description: string;
  transactionType: string;
  transactionDate: string;
}

const columnHelper = createColumnHelper<WalletTransaction>();

enum WalletTransactionType {
  All = "ALL",
  Deposit = "Deposit",
  Withdraw = "Withdraw",
  Transfer = "Transfer",
  Receive = "Receive",
  PlaceDeposit = "PlaceDeposit",
  RefundDeposit = "RefundDeposit",
}

interface WalletTransactionParams {
  page: number;
  size: number;
  walletID?: string;
  walletTransactionType?: WalletTransactionType;
}

const GetWalletTransaction = () => {
  const [data, setData] = useState<WalletTransaction[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<string | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const walletService = WalletService();
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>(
    {}
  );

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case WalletTransactionType.Deposit:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Nạp tiền</Badge>
        );
      case WalletTransactionType.Withdraw:
        return <Badge className="bg-red-500 hover:bg-red-600">Rút tiền</Badge>;
      case WalletTransactionType.Transfer:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Chuyển tiền</Badge>
        );
      case WalletTransactionType.Receive:
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">Nhận tiền</Badge>
        );
      case WalletTransactionType.PlaceDeposit:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Đặt cọc</Badge>
        );
      case WalletTransactionType.RefundDeposit:
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Hoàn cọc</Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            Không xác định
          </Badge>
        );
    }
  };

  const highlightText = (text: string, searchText: string) => {
    if (!searchText) return text;

    const parts = text.toString().split(new RegExp(`(${searchText})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const toggleCellExpand = (cellId: string) => {
    setExpandedCells((prev) => ({
      ...prev,
      [cellId]: !prev[cellId],
    }));
  };

  const renderCellContent = (
    content: string | React.ReactNode,
    cellId: string,
    maxLength: number = 30
  ) => {
    const contentStr = typeof content === "string" ? content : "";
    const isLong = contentStr.length > maxLength;
    const isExpanded = expandedCells[cellId];

    if (!isLong) return content;

    const displayContent = isExpanded
      ? contentStr
      : `${contentStr.slice(0, maxLength)}...`;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => toggleCellExpand(cellId)}
            >
              {highlightText(displayContent, globalFilter)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs break-words">{contentStr}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const columns = [
    columnHelper.display({
      id: "stt",
      header: "STT",
      cell: (info) => info.row.index + 1 + (currentPage - 1) * pageSize,
      enableSorting: false,
    }),
    columnHelper.accessor("walletTransactionID", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Mã giao dịch
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) =>
        renderCellContent(
          info.getValue(),
          `id-${info.row.id}-${info.column.id}`,
          15
        ),
    }),
    columnHelper.accessor("beforeBalance", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Số dư trước
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) =>
        renderCellContent(
          info.getValue().toLocaleString("vi-VN") + " đ",
          `beforeBalance-${info.row.id}-${info.column.id}`,
          25
        ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Số tiền
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) =>
        renderCellContent(
          info.getValue().toLocaleString("vi-VN") + " đ",
          `amount-${info.row.id}-${info.column.id}`,
          25
        ),
    }),
    columnHelper.accessor("afterBalance", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Số dư sau
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) =>
        renderCellContent(
          info.getValue().toLocaleString("vi-VN") + " đ",
          `afterBalance-${info.row.id}-${info.column.id}`,
          25
        ),
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Mô tả
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) =>
        renderCellContent(
          info.getValue(),
          `desc-${info.row.id}-${info.column.id}`,
          25
        ),
    }),
    columnHelper.accessor("transactionType", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Loại giao dịch
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) => {
        const type = info.getValue();
        const displayText = (() => {
          switch (type) {
            case WalletTransactionType.Deposit:
              return "Nạp tiền";
            case WalletTransactionType.Withdraw:
              return "Rút tiền";
            case WalletTransactionType.Transfer:
              return "Chuyển tiền";
            case WalletTransactionType.Receive:
              return "Nhận tiền";
            case WalletTransactionType.PlaceDeposit:
              return "Đặt cọc";
            case WalletTransactionType.RefundDeposit:
              return "Hoàn cọc";
            default:
              return "Không xác định";
          }
        })();
        return (
          <Badge className={getTransactionTypeBadge(type).props.className}>
            {renderCellContent(
              highlightText(displayText, globalFilter),
              `type-${info.row.id}-${info.column.id}`,
              25
            )}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("transactionDate", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-center font-bold"
          >
            Ngày giao dịch
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (info) =>
        renderCellContent(
          highlightText(formatVietnamDateHours(info.getValue()), globalFilter),
          `date-${info.row.id}-${info.column.id}`,
          25
        ),
    }),
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params: WalletTransactionParams = {
        page: currentPage,
        size: pageSize,
      };

      if (transactionType !== undefined) {
        params.walletTransactionType = transactionType as WalletTransactionType;
      }

      const response = await walletService.getStaffWalletTransaction(params);
      if (response?.responseRequestModel?.responseList) {
        setData(response.responseRequestModel.responseList.items);
        setTotalPages(
          response.responseRequestModel.responseList.totalPages || 1
        );
      }
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, transactionType]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleSearch = () => {
    setGlobalFilter(searchValue);
    setCurrentPage(1);
    fetchData();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Giao dịch của ví</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Tìm kiếm tất cả..."
              value={searchValue}
              className="pl-10"
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              size={18}
              onClick={handleSearch}
            />
          </div>

          <Select
            value={transactionType ?? WalletTransactionType.All}
            onValueChange={(value) => {
              setTransactionType(
                value === WalletTransactionType.All ? undefined : value
              );
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn loại giao dịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WalletTransactionType.All}>
                Tất cả loại giao dịch
              </SelectItem>
              <SelectItem value={WalletTransactionType.Deposit}>
                Nạp tiền
              </SelectItem>
              <SelectItem value={WalletTransactionType.Withdraw}>
                Rút tiền
              </SelectItem>
              <SelectItem value={WalletTransactionType.Transfer}>
                Chuyển tiền
              </SelectItem>
              <SelectItem value={WalletTransactionType.Receive}>
                Nhận tiền
              </SelectItem>
              <SelectItem value={WalletTransactionType.PlaceDeposit}>
                Đặt cọc
              </SelectItem>
              <SelectItem value={WalletTransactionType.RefundDeposit}>
                Hoàn cọc
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-5 w-[60px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu giao dịch
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage <= 1}
                className={`p-2 rounded-full hover:bg-gray-100 transition ${
                  currentPage <= 1 ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
                className={`p-2 rounded-full hover:bg-gray-100 transition ${
                  currentPage >= totalPages
                    ? "opacity-30 pointer-events-none"
                    : ""
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default GetWalletTransaction;
