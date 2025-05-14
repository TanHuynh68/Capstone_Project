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
import RuleCreateForm from "./create-rule";
import { Badge } from "@/components/ui/badge";

interface Rule {
  ruleID: string;
  ruleType: string;
  title: string;
  description?: string;
  version: number;
  createdAt: string;
  isActive: boolean;
  scoreChange: number;
  compensationRate: number;
  listVersion?: Array<{
    ruleID: string;
    version: number;
    createdAt: string;
  }>;
}

const RuleManager: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [filterTitle, setFilterTitle] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const size = 10;
  const [totalItems, setTotalItems] = useState<number>(0);
  const [ruleTypeFilter, setRuleTypeFilter] = useState<number>(-1);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openVersionModal, setOpenVersionModal] = useState(false);

  const [selectedOldRule, setSelectedOldRule] = useState<Rule | null>(null);
  const [openCompareModal, setOpenCompareModal] = useState(false);

  const { getRules, getRuleById } = AdminService();

  const fetchRules = useCallback(async () => {
    const params: {
      title: string;
      page: number;
      size: number;
      ruleType?: number;
    } = {
      title: filterTitle,
      page,
      size,
    };
    if (ruleTypeFilter !== -1) {
      params.ruleType = ruleTypeFilter;
    }
    const res = await getRules(params);
    if (res?.responseRequestModel?.responseList) {
      setRules(res.responseRequestModel.responseList.items);
      setTotalItems(res.responseRequestModel.responseList.totalItems);
    }
  }, [filterTitle, ruleTypeFilter, page, size, getRules]);

  const fetchRuleDetail = async (id: string) => {
    const res = await getRuleById({ ruleID: id });
    if (res?.responseRequestModel) {
      setSelectedRule(res.responseRequestModel);
      setOpenDetailModal(true);
    }
  };

  const handleCompareVersion = async (oldRuleId: string) => {
    const res = await getRuleById({ ruleID: oldRuleId });
    if (res?.responseRequestModel) {
      setSelectedOldRule(res.responseRequestModel);
      setOpenVersionModal(false);
      setOpenCompareModal(true);
    }
  };

  const mapRuleType = (type: number | string) => {
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
    fetchRules();
  }, [fetchRules]);

  return (
    <div className="w-full max-w-full mx-auto space-y-6 p-4">
      <Card className="border shadow-md">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Bộ lọc luật lệ</CardTitle>
          <Button onClick={() => setOpenCreateModal(true)}>Tạo luật lệ</Button>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Tìm theo tiêu đề..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchRules();
            }}
            className="flex-1"
          />
          <Select
            value={String(ruleTypeFilter)}
            onValueChange={(v) => setRuleTypeFilter(Number(v))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn loại luật lệ" />
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
          <Button onClick={fetchRules} className="w-full md:w-auto">
            Tìm kiếm
          </Button>
        </CardContent>
      </Card>

      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle>Danh sách luật lệ</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length > 0 ? (
                rules.map((rule, index) => (
                  <TableRow
                    key={rule.ruleID}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => fetchRuleDetail(rule.ruleID)}
                  >
                    <TableCell>{(page - 1) * size + index + 1}</TableCell>
                    <TableCell>{rule.title}</TableCell>
                    <TableCell>{mapRuleType(rule.ruleType)}</TableCell>
                    <TableCell>{rule.version}</TableCell>
                    <TableCell>
                      {new Date(rule.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không có luật lệ nào.
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

      {/* Modal Create Rule */}
      <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Tạo luật lệ mới</DialogTitle>
          </DialogHeader>
          <RuleCreateForm
            onCreated={() => {
              fetchRules();
              setOpenCreateModal(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Chi tiết Rule */}
      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="max-w-lg bg-white rounded-xl shadow-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Chi tiết luật lệ
            </DialogTitle>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-primary">
                {selectedRule.title}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Loại</span>
                  <span className="font-medium">
                    {mapRuleType(selectedRule.ruleType)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Version</span>
                  <span
                    className="font-medium text-blue-600 underline cursor-pointer"
                    onClick={() => {
                      if (selectedRule.version > 1) {
                        setOpenVersionModal(true);
                      }
                    }}
                  >
                    {selectedRule.version}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Ngày tạo</span>
                  <span className="font-medium">
                    {new Date(selectedRule.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Trạng thái</span>
                  {mapIsActive(selectedRule.isActive)}
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Điểm thay đổi</span>
                  <span className="font-medium">
                    {selectedRule.scoreChange}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    Tỷ lệ bồi thường
                  </span>
                  <span className="font-medium">
                    {selectedRule.compensationRate}%
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Mô tả</span>
                <div className="font-medium">
                  {selectedRule.description || "Không có mô tả."}
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
          {selectedRule &&
          selectedRule.listVersion &&
          selectedRule.listVersion.length > 0 ? (
            <div className="space-y-4">
              {selectedRule.listVersion?.map((v) => (
                <div
                  key={v.ruleID}
                  className="flex justify-between p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCompareVersion(v.ruleID)}
                >
                  <span>Version {v.version}</span>
                  <span>{new Date(v.createdAt).toLocaleString()}</span>
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
          {selectedRule && selectedOldRule && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr>
                    <th className="border p-3 text-left">Phiên bản</th>
                    <th className="border p-3 text-left">
                      Hiện tại (V{selectedRule.version})
                    </th>
                    <th className="border p-3 text-left">
                      Phiên bản cũ (V{selectedOldRule.version})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Tiêu đề",
                      current: selectedRule.title,
                      old: selectedOldRule.title,
                      type: "text",
                    },
                    {
                      label: "Loại",
                      current: mapRuleType(selectedRule.ruleType),
                      old: mapRuleType(selectedOldRule.ruleType),
                      type: "text",
                    },
                    {
                      label: "Mô tả",
                      current: selectedRule.description || "Không có mô tả.",
                      old: selectedOldRule.description || "Không có mô tả.",
                      type: "description",
                    },
                    {
                      label: "Điểm thay đổi",
                      current: selectedRule.scoreChange,
                      old: selectedOldRule.scoreChange,
                      type: "number",
                    },
                    {
                      label: "Tỷ lệ bồi thường",
                      current: selectedRule.compensationRate,
                      old: selectedOldRule.compensationRate,
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

export default RuleManager;
