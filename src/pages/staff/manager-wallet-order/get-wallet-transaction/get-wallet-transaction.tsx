import { useState, useEffect, useMemo } from "react";
import WalletService from "@/services/WalletService";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { formatVietnamDateHours } from "@/components/utils/date";
import {
  DataTable,
  Column,
} from "@/components/organisms/manager-withdrawal-by-staff";
import { getTransactionTypeBadge } from "@/components/utils/badge-utils";
import {
  Tooltip,
  TooltipContent,
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
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<string | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const walletService = WalletService();

  const highlightMatch = (text: string, keyword: string) => {
    if (!text || !keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const keyword = searchTerm.trim().toLowerCase();
    return data.filter((transaction) =>
      Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(keyword)
      )
    );
  }, [data, searchTerm]);

  const columns: Column<WalletTransaction>[] = [
    {
      header: "STT",
      className: "text-center w-12",
      cell: (_row: WalletTransaction, index?: number) => (
        <span>
          {index !== undefined ? index + 1 + (currentPage - 1) * pageSize : ""}
        </span>
      ),
    },
    {
      header: "Mã giao dịch",
      accessorKey: "walletTransactionID",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.walletTransactionID, searchTerm),
    },
    {
      header: "Số dư trước",
      accessorKey: "beforeBalance",
      sortable: true,
      className: "text-center",
      cell: (row) => `${row.beforeBalance.toLocaleString("vi-VN")} ₫`,
    },
    {
      header: "Số tiền",
      accessorKey: "amount",
      sortable: true,
      className: "text-center",
      cell: (row) => `${row.amount.toLocaleString("vi-VN")} ₫`,
    },
    {
      header: "Số dư sau",
      accessorKey: "afterBalance",
      sortable: true,
      className: "text-center",
      cell: (row) => `${row.afterBalance.toLocaleString("vi-VN")} ₫`,
    },
    {
      header: "Mô tả",
      accessorKey: "description",
      sortable: true,
      className: "text-center max-w-[200px]",
      cell: (row) => (
          <Tooltip>
          <TooltipTrigger asChild>
            <div className="line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {highlightMatch(row.description, searchTerm)}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm text-left">
            {highlightMatch(row.description, searchTerm)}
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      header: "Loại giao dịch",
      accessorKey: "transactionType",
      sortable: true,
      className: "text-center",
      cell: (row) => getTransactionTypeBadge(row.transactionType),
    },
    {
      header: "Ngày giao dịch",
      accessorKey: "transactionDate",
      sortable: true,
      className: "text-center",
      cell: (row) => formatVietnamDateHours(row.transactionDate),
    },
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

  return (
    <div className="px-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Tìm kiếm tất cả..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(searchInput);
                  setCurrentPage(1);
                }
              }}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              size={18}
              onClick={() => {
                setSearchTerm(searchInput);
                setCurrentPage(1);
              }}
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

      <DataTable
        columns={columns}
        data={filteredData}
        loading={isLoading}
        emptyMessage="Không có dữ liệu giao dịch."
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
        getRowId={(row) => row.walletTransactionID}
      />
    </div>
  );
};

export default GetWalletTransaction;
