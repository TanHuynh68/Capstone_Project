import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";
import { formatCurrencyVND } from "@/utils";

interface DepositHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deposits: DepositHistoryItem[];
  loading?: boolean;
  onClose: () => void;
}

type SortField = "depositAt" | "amount" | "type";
type SortOrder = "asc" | "desc";
type FilterType = "all" | "Deposit" | "Withdraw";

export default function DepositHistoryDialog({
  open,
  onOpenChange,
  deposits,
  loading = false,
  onClose,
}: DepositHistoryDialogProps) {
  const [sortField, setSortField] = useState<SortField>("depositAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Deposit":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Withdraw":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Deposit":
        return "Đặt cọc";
      case "Withdraw":
        return "Rút tiền";
      default:
        return type;
    }
  };

  const filteredAndSortedDeposits = useMemo(() => {
    let filtered = deposits;

    // Apply filter
    if (filterType !== "all") {
      filtered = deposits.filter((deposit) => deposit.type === filterType);
    }

    // Apply sort
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "depositAt":
          aValue = new Date(a.depositAt).getTime();
          bValue = new Date(b.depositAt).getTime();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [deposits, filterType, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const clearFilters = () => {
    setFilterType("all");
    setSortField("depositAt");
    setSortOrder("desc");
  };

  const totalDeposits = deposits
    .filter((d) => d.type === "Deposit")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalWithdraws = deposits
    .filter((d) => d.type === "Withdraw")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[900px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-foreground">
            <span>Lịch sử cọc</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Đang tải lịch sử cọc...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-card border border-border rounded-lg p-3">
                <div className="text-sm text-green-600 font-medium">
                  Tổng đặt cọc của nhà thiết kế
                </div>
                <div className="text-lg font-bold text-green-700">
                  {formatCurrencyVND(totalDeposits)}
                </div>
              </div>
                <div className="bg-card border border-border rounded-lg p-3">
                <div className="text-sm text-blue-600 font-medium">
                  Tổng tiền cọc của khách hàng
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {formatCurrencyVND(totalWithdraws)}
                </div>
              </div>
              {/* <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600 font-medium">Số dư</div>
                <div className="text-lg font-bold text-gray-700">
                  {formatCurrencyVND(totalDeposits - totalWithdraws)}
                </div>
              </div> */}
            </div>

            {/* Filters and Controls */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                  Lọc theo loại:
                </span>
                <Select
                  value={filterType}
                  onValueChange={(value: FilterType) => setFilterType(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Deposit">Đặt cọc</SelectItem>
                    <SelectItem value="Withdraw">Rút tiền</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                  Hiển thị {filteredAndSortedDeposits.length} /{" "}
                  {deposits.length} giao dịch
                </span>
              </div>

              <div className="ml-auto">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">STT</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("type")}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Loại {getSortIcon("type")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("amount")}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Số tiền {getSortIcon("amount")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("depositAt")}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Thời gian {getSortIcon("depositAt")}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedDeposits.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                      >
                        {filterType === "all"
                          ? "Chưa có giao dịch nào"
                          : `Không có giao dịch ${getTypeLabel(
                              filterType
                            ).toLowerCase()}`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedDeposits.map((deposit, index) => (
                      <TableRow
                        key={deposit.orderDepositID}
                        className="hover:bg-muted"
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={deposit.title}>
                            {deposit.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(deposit.type)}>
                            {getTypeLabel(deposit.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${
                              deposit.type === "Deposit"
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          >
                            {deposit.type === "Deposit" ? "+" : "-"}
                            {formatCurrencyVND(deposit.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(deposit.depositAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
