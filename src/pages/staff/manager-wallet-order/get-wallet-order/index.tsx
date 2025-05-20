// FULL FIXED VERSION WITH SEARCH & HIGHLIGHT

"use client";

import React, { useEffect, useState, useMemo } from "react";
import StaffService from "@/services/StaffService";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DataTable,
  Column,
} from "@/components/organisms/manager-withdrawal-by-staff";
import { RefreshCw, Download, Search } from "lucide-react";
import PutWalletWithdraw from "../put-wallet-withdraw";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WalletOrder {
  walletOrderID: string;
  walletID: string;
  amount: number;
  fullName: string;
  orderStatusDisplay: string;
  description: string;
  orderDate: string;
  walletOrderImage: string | null;
  walletOrderNote: string | null;
  orderType: number;
  imageUrl?: string;
  note?: string;
}

interface Props {
  walletID?: string;
}

const ManagerWalletOrderByStaff: React.FC<Props> = ({ walletID }) => {
  const [orders, setOrders] = useState<WalletOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [orderType, setOrderType] = useState<number | undefined>(undefined);
  const [transactionStatusEnum, setTransactionStatusEnum] = useState<
    number | undefined
  >(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [qrLinks, setQrLinks] = useState<{
    vietQrLink: string;
    sepayQrLink: string;
  } | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { getWalletOrderByStaff, getQRWithdrawByStaff } = StaffService();

  // const statusLabelMap: Record<string, string> = {
  //   Pending: "Chờ duyệt",
  //   Completed: "Hoàn tất",
  //   Canceled: "Đã hủy",
  // };

  // const statusColorMap: Record<string, string> = {
  //   Pending: "text-yellow-600",
  //   Completed: "text-green-600",
  //   Failed: "text-red-600",
  //   Canceled: "text-gray-600",
  //   InProcess: "text-blue-600",
  // };

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

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const keyword = searchTerm.trim().toLowerCase();
    return orders.filter((order) =>
      Object.values(order).some((value) =>
        String(value).toLowerCase().includes(keyword)
      )
    );
  }, [orders, searchTerm]);

  const columns: Column<WalletOrder>[] = [
    {
      header: "STT",
      className: "text-center w-12",
      cell: (_row: WalletOrder, index?: number) => (
        <span>{index !== undefined ? index + 1 + (page - 1) * size : ""}</span>
      ),
    },
    {
      header: "Mã đơn",
      accessorKey: "walletOrderID",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.walletOrderID, searchTerm),
    },
    {
      header: "Họ tên",
      accessorKey: "fullName",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.fullName, searchTerm),
    },
    {
      header: "Mô tả",
      accessorKey: "description",
      className: "text-center max-w-[200px]",
      cell: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer">
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
      header: "Số tiền",
      accessorKey: "amount",
      cell: (row) => `${row.amount.toLocaleString()}₫`,
      sortable: true,
      className: "text-center",
    },
    {
      header: "Trạng thái",
      accessorKey: "orderStatusDisplay",
      cell: (row) => {
        const status = row.orderStatusDisplay;
        const label =
          status === "Pending"
            ? "Chờ duyệt"
            : status === "Completed"
            ? "Hoàn tất"
            : status === "Canceled"
            ? "Đã hủy"
            : status;

        const colorClass =
          status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : status === "Completed"
            ? "bg-green-100 text-green-800"
            : status === "Canceled"
            ? "bg-gray-200 text-gray-800"
            : "bg-gray-100 text-gray-800";

        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
          >
            {label}
          </span>
        );
      },
      sortable: true,
      className: "text-center",
    },
    {
      header: "Ngày tạo",
      accessorKey: "orderDate",
      cell: (row) => new Date(row.orderDate).toLocaleString("vi-VN"),
      sortable: true,
      className: "text-center",
    },
    {
      header: "Thao tác",
      accessorKey: "walletOrderID",
      className: "text-center",
      cell: (row) => {
        const isWithdraw = row.description?.toLowerCase().includes("rút");
        const isPending = row.orderStatusDisplay === "Pending";

        return isWithdraw && isPending ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleShowWithdraw(row.walletOrderID)}
          >
            Hoàn tiền
          </Button>
        ) : null;
      },
    },
    {
      header: "Ghi chú",
      className: "text-center",
      cell: (row) => {
        const hasImage = row.walletOrderImage || row.imageUrl;
        const hasNote = row.walletOrderNote || row.note;

        return hasImage || hasNote ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.custom(
                (t) => (
                  <div className="space-y-2 text-sm max-w-[280px] bg-white p-4 rounded-lg shadow-lg">
                    {(row.walletOrderImage || row.imageUrl) && (
                      <img
                        src={row.walletOrderImage || row.imageUrl}
                        alt="Ảnh minh chứng"
                        className="w-full h-auto rounded-md border"
                      />
                    )}
                    {(row.walletOrderNote || row.note) && (
                      <div>
                        <strong>Ghi chú:</strong>{" "}
                        <p>{row.walletOrderNote || row.note}</p>
                      </div>
                    )}
                    <div className="flex justify-end pt-1">
                      <Button
                        size="sm"
                        onClick={() => toast.dismiss(t)}
                        className="text-xs"
                      >
                        Đóng
                      </Button>
                    </div>
                  </div>
                ),
                {
                  duration: 10000,
                  position: "top-center",
                }
              );
            }}
          >
            Xem
          </Button>
        ) : null;
      },
    },
  ];

  const fetchWalletOrders = async () => {
    setLoading(true);
    try {
      const res = await getWalletOrderByStaff({
        walletID,
        page,
        size,
        orderType,
        transactionStatusEnum,
      });
      const items = res?.responseRequestModel?.responseList?.items;
      const total = res?.responseRequestModel?.responseList?.totalPages;
      setOrders(Array.isArray(items) ? items : []);
      setTotalPages(total || 1);
    } catch {
      toast.error("Lỗi khi tải dữ liệu ");
    } finally {
      setLoading(false);
    }
  };

  const handleShowWithdraw = async (walletOrderID: string) => {
    try {
      const res = await getQRWithdrawByStaff({ walletOrderID });
      const links = res?.responseRequestModel;
      if (links?.vietQrLink && links?.sepayQrLink) {
        setQrLinks({
          vietQrLink: links.vietQrLink,
          sepayQrLink: links.sepayQrLink,
        });
        setQrImage(links.vietQrLink);
        setSelectedOrderId(walletOrderID);
      }
    } catch {
      toast.error("Lỗi khi lấy QR");
    }
  };

  useEffect(() => {
    fetchWalletOrders();
  }, [walletID, page, size, orderType, transactionStatusEnum]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          Danh sách đơn ví {walletID ? `của ví ${walletID}` : "(tất cả ví)"}
        </h2>
        {/* <Button
          variant="outline"
          onClick={() => {
            setOrderType(undefined);
            setTransactionStatusEnum(undefined);
            setPage(1);
            setSearchInput("");
            setSearchTerm("");
          }}
        >
          Làm mới bộ lọc
        </Button> */}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={orderType === undefined ? "all" : orderType.toString()}
          onValueChange={(val) => {
            setOrderType(val === "all" ? undefined : Number(val));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả giao dịch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giao dịch</SelectItem>
            <SelectItem value="0">Nạp tiền</SelectItem>
            <SelectItem value="1">Rút tiền</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            transactionStatusEnum === undefined
              ? "all"
              : transactionStatusEnum.toString()
          }
          onValueChange={(val) => {
            setTransactionStatusEnum(val === "all" ? undefined : Number(val));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="0">Chờ duyệt</SelectItem>
            <SelectItem value="1">Hoàn tất</SelectItem>
            <SelectItem value="3">Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-full max-w-xs">
          <Input
            placeholder="Tìm theo tên, mã đơn..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(searchInput);
                setPage(1);
              }
            }}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
            size={18}
            onClick={() => {
              setSearchTerm(searchInput);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        loading={loading}
        emptyMessage="Không có đơn ví nào."
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
      />

      <Dialog
        open={!!selectedOrderId}
        onOpenChange={() => setSelectedOrderId(null)}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[900px] p-0 overflow-hidden rounded-xl">
          {selectedOrderId && qrLinks && (
            <div className="flex flex-col md:flex-row">
              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center bg-white p-6 md:p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Mã QR hoàn tiền
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        qrImage === qrLinks.vietQrLink
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {qrImage === qrLinks.vietQrLink ? "VietQR" : "SePay QR"}
                    </span>
                  </div>
                  <div className="relative mb-6">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-2 shadow-sm">
                      <img
                        src={qrImage ?? ""}
                        alt="QR Code"
                        className="h-full w-full object-contain"
                        onError={() => {
                          if (
                            qrLinks?.sepayQrLink &&
                            qrImage !== qrLinks.sepayQrLink
                          ) {
                            setQrImage(qrLinks.sepayQrLink);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => {
                        setQrImage(
                          qrImage === qrLinks.vietQrLink
                            ? qrLinks.sepayQrLink
                            : qrLinks.vietQrLink
                        );
                      }}
                      className="flex-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {qrImage === qrLinks.vietQrLink ? "SePay QR" : "VietQR"}
                    </button>

                    <button
                      onClick={() => {
                        if (qrImage) {
                          // Create a temporary anchor element
                          const a = document.createElement("a");
                          a.href = qrImage;
                          a.download = "qr-code.png";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }
                      }}
                      className="flex-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống
                    </button>
                  </div>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Hướng dẫn
                    </h4>
                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Quét mã QR bằng ứng dụng ngân hàng</li>
                      <li>Xác nhận thông tin giao dịch</li>
                      <li>Hoàn tất giao dịch</li>
                      <li>Xác nhận hoàn tiền ở mục bên phải</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Refund Information Section */}
              <div className="bg-gray-50 p-6 md:p-8 md:w-3/5">
                <div className="max-w-lg mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Thông tin hoàn tiền
                    </h2>
                    <div className="text-sm text-gray-500">
                      Mã đơn: {selectedOrderId}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Loại QR</div>
                      <div className="font-medium text-gray-900">
                        {qrImage === qrLinks.vietQrLink ? "VietQR" : "SePay QR"}
                      </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">
                        Trạng thái
                      </div>
                      <div className="font-medium">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Chờ xác nhận
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Form xác nhận */}
                  <div className="border-t border-gray-200 pt-6">
                    <PutWalletWithdraw
                      walletOrderID={selectedOrderId}
                      onSuccess={() => {
                        fetchWalletOrders();
                        setSelectedOrderId(null);
                      }}
                      onClose={() => setSelectedOrderId(null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerWalletOrderByStaff;
