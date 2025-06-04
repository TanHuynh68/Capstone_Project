import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminService from "@/services/AdminService";
import { Badge } from "@/components/ui/badge";
import { formatVietnamDateHours } from "@/components/utils/date";
import BenefitCreateForm from "./create-rule";
interface Benefit {
  benefitID: string;
  benefitType: string;
  title: string;
  description?: string;
  version: number;
  createdAt: string;
  isActive: boolean;
  scoreChange: number;
  compensationRate: number;
  listVersion?: Array<{
    benefitID: string;
    version: number;
    createdAt: string;
  }>;
}

const BenefitManager: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filterTitle, setFilterTitle] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const size = 10;
  const [totalItems, setTotalItems] = useState<number>(0);
  const [benefitTypeFilter, setBenefitTypeFilter] = useState<number>(-1);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openVersionModal, setOpenVersionModal] = useState(false);

  const [selectedOldBenefit, setSelectedOldBenefit] = useState<Benefit | null>(
    null
  );
  const [openCompareModal, setOpenCompareModal] = useState(false);

  const { getBenefits, getBenefitById } = AdminService();

  const fetchBenefits = useCallback(async () => {
    const params: {
      title: string;
      page: number;
      size: number;
      benefitType?: number;
    } = {
      title: filterTitle,
      page,
      size,
    };
    if (benefitTypeFilter !== -1) {
      params.benefitType = benefitTypeFilter;
    }
    const res = await getBenefits(params);
    if (res?.responseRequestModel?.responseList) {
      setBenefits(res.responseRequestModel.responseList.items);
      setTotalItems(res.responseRequestModel.responseList.totalItems);
    }
  }, [filterTitle, benefitTypeFilter, page, size, getBenefits]);

  const fetchBenefitDetail = async (id: string) => {
    const res = await getBenefitById(id);
    if (res?.responseRequestModel) {
      setSelectedBenefit(res.responseRequestModel);
      setOpenDetailModal(true);
    }
  };

  const handleCompareVersion = async (oldbenefitID: string) => {
    const res = await getBenefitById(oldbenefitID);
    if (res?.responseRequestModel) {
      setSelectedOldBenefit(res.responseRequestModel);
      setOpenVersionModal(false);
      setOpenCompareModal(true);
    }
  };

  const mapBenefitType = (type: number | string) => {
    switch (type) {
      case 0:
      case "Chung":
        return "Chung";
      case 1:
      case "DatCoc":
        return "Đặt cọc";
      case 2:
      case "GiaoHang":
        return "Giao hàng";
      case 3:
      case "Phat":
        return "Phạt";
      case 4:
      case "BaoHanh":
        return "Bảo hành";
      default:
        return type;
    }
  };

  const mapIsActive = (active: boolean) => {
    return active ? (
      <Badge
        variant="outline"
        className="border-green-500 text-green-600 bg-green-50"
      >
        Đang áp dụng
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="border-gray-400 text-gray-500 bg-gray-50"
      >
        Ngừng áp dụng
      </Badge>
    );
  };

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  return (
    <div className="w-full max-w-full mx-auto space-y-6 p-4">
      <Card className="border shadow-md">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Bộ lọc quyền lợi</CardTitle>
          <Button onClick={() => setOpenCreateModal(true)}>
            Tạo quyền lợi
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Tìm theo tiêu đề..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchBenefits();
            }}
            className="flex-1"
          />
          <Select
            value={String(benefitTypeFilter)}
            onValueChange={(v) => setBenefitTypeFilter(Number(v))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn loại quyền lợi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Tất cả loại</SelectItem>
              <SelectItem value="0">Chung</SelectItem>
              <SelectItem value="1">Đặt cọc</SelectItem>
              <SelectItem value="2">Giao hàng</SelectItem>
              <SelectItem value="3">Phạt</SelectItem>
              <SelectItem value="4">Bảo hành</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchBenefits} className="w-full md:w-auto">
            Tìm kiếm
          </Button>
        </CardContent>
      </Card>

      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle>Danh sách quyền lợi</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">STT</TableHead>
                <TableHead className="text-center">Tiêu đề</TableHead>
                <TableHead className="text-center">Loại</TableHead>
                <TableHead className="text-center">Version</TableHead>
                <TableHead className="text-center">Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.length > 0 ? (
                benefits.map((benefit, index) => (
                  <TableRow
                    key={benefit.benefitID}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fetchBenefitDetail(benefit.benefitID)}
                  >
                    <TableCell className="text-center">
                      {(page - 1) * size + index + 1}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {benefit.title}
                    </TableCell>
                    <TableCell className="text-center">
                      {mapBenefitType(benefit.benefitType)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBenefit(benefit);
                          setOpenVersionModal(true);
                        }}
                      >
                        {benefit.version}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatVietnamDateHours(benefit.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không có quyền lợi nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <div>
              Trang {page} / {Math.ceil(totalItems / size)}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(totalItems / size)}
              >
                Trang sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Create Benefit */}
      <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo quyền lợi mới</DialogTitle>
          </DialogHeader>
          <BenefitCreateForm
            onCreated={() => {
              fetchBenefits();
              setOpenCreateModal(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Chi tiết Benefit */}
      <Dialog
        open={openDetailModal}
        onOpenChange={(open) => {
          setOpenDetailModal(open);
          if (!open) {
            setSelectedBenefit(null);
          }
        }}
      >
        <DialogContent className="max-w-lg bg-white rounded-xl shadow-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">
              Chi tiết quyền lợi
            </DialogTitle>
          </DialogHeader>
          {selectedBenefit && (
            <div className="space-y-6 mt-4">
              <div className="text-2xl font-bold text-primary border-b pb-2">
                {selectedBenefit.title}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground">Loại</span>
                  <span className="font-medium">
                    {mapBenefitType(selectedBenefit.benefitType)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground">Version</span>
                  <span
                    className={
                      selectedBenefit.listVersion &&
                      selectedBenefit.listVersion.length > 0
                        ? "font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline transition-colors"
                        : "font-medium text-gray-400 cursor-not-allowed"
                    }
                    onClick={() => {
                      if (
                        selectedBenefit.listVersion &&
                        selectedBenefit.listVersion.length > 0
                      ) {
                        setOpenVersionModal(true);
                      }
                    }}
                  >
                    {selectedBenefit.version}
                  </span>
                </div>
                <div className="flex justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground">Ngày tạo</span>
                  <span className="font-medium">
                    {formatVietnamDateHours(selectedBenefit.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground">Trạng thái</span>
                  {mapIsActive(selectedBenefit.isActive)}
                </div>
                <div className="flex justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground">Điểm thay đổi</span>
                  <span
                    className={`font-medium ${
                      selectedBenefit.scoreChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedBenefit.scoreChange > 0 ? "+" : ""}
                    {selectedBenefit.scoreChange}
                  </span>
                </div>
                <div className="flex justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground">
                    Tỷ lệ bồi thường
                  </span>
                  <span className="font-medium text-blue-600">
                    {selectedBenefit.compensationRate}%
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-muted-foreground block mb-2 font-medium">
                  Mô tả
                </span>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                  {selectedBenefit.description || "Không có mô tả."}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal danh sách version cũ */}
      <Dialog open={openVersionModal} onOpenChange={setOpenVersionModal}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Các phiên bản trước
            </DialogTitle>
          </DialogHeader>
          {selectedBenefit &&
          selectedBenefit.listVersion &&
          selectedBenefit.listVersion.length > 0 ? (
            <div className="space-y-4">
              {selectedBenefit.listVersion?.map((v) => (
                <div
                  key={v.benefitID}
                  className="flex justify-between p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCompareVersion(v.benefitID)}
                >
                  <span className="text-blue-600 underline hover:text-blue-800 cursor-pointer transition-colors">
                    Version {v.version}
                  </span>
                  <span>{formatVietnamDateHours(v.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>Không có phiên bản cũ.</div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openCompareModal} onOpenChange={setOpenCompareModal}>
        <DialogContent className="max-w-4xl bg-white rounded-xl shadow-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              So sánh phiên bản
            </DialogTitle>
          </DialogHeader>
          {selectedBenefit && selectedOldBenefit && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr>
                    <th className="border p-3 text-left">Phiên bản</th>
                    <th className="border p-3 text-left">
                      Hiện tại (V{selectedBenefit.version})
                    </th>
                    <th className="border p-3 text-left">
                      Phiên bản cũ (V{selectedOldBenefit.version})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Tiêu đề",
                      current: selectedBenefit.title,
                      old: selectedOldBenefit.title,
                      type: "text",
                    },
                    {
                      label: "Loại",
                      current: mapBenefitType(selectedBenefit.benefitType),
                      old: mapBenefitType(selectedOldBenefit.benefitType),
                      type: "text",
                    },
                    {
                      label: "Mô tả",
                      current: selectedBenefit.description || "Không có mô tả.",
                      old: selectedOldBenefit.description || "Không có mô tả.",
                      type: "description",
                    },
                    {
                      label: "Điểm thay đổi",
                      current: selectedBenefit.scoreChange,
                      old: selectedOldBenefit.scoreChange,
                      type: "number",
                    },
                    {
                      label: "Tỷ lệ bồi thường",
                      current: selectedBenefit.compensationRate,
                      old: selectedOldBenefit.compensationRate,
                      type: "number",
                      unit: "%",
                    },
                  ].map((item) => {
                    const isDifferent = item.current !== item.old;
                    let currentClass = "border p-3";
                    let oldClass = "border p-3";

                    if (item.type === "number") {
                      if (item.current > item.old) {
                        currentClass += " text-green-600 font-bold";
                      } else if (item.current < item.old) {
                        currentClass += " text-red-600 font-bold";
                      }
                    } else if (item.type === "description") {
                      if (isDifferent) {
                        currentClass += " text-black font-bold";
                        oldClass += " text-black font-bold";
                      }
                    } else {
                      if (isDifferent) {
                        currentClass += " text-red-600 font-bold";
                        oldClass += " text-red-600 font-bold";
                      }
                    }

                    return (
                      <tr key={item.label}>
                        <td className="border p-3 font-semibold">
                          {item.label}
                        </td>
                        <td className={currentClass}>
                          {item.current}
                          {item.unit && item.current !== undefined
                            ? item.unit
                            : ""}
                        </td>
                        <td className={oldClass}>
                          {item.old}
                          {item.unit && item.old !== undefined ? item.unit : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BenefitManager;
