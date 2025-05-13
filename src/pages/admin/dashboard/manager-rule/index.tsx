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
}

const RuleManager: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [filterTitle, setFilterTitle] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [ruleTypeFilter, setRuleTypeFilter] = useState<number>(-1);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const { getRules, getRuleById } = AdminService();

  const fetchRules = useCallback(async () => {
    const params: any = {
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
  }, [filterTitle, ruleTypeFilter, page, size]);

  const fetchRuleDetail = async (id: string) => {
    const res = await getRuleById({ ruleID: id });
    if (res?.responseRequestModel) {
      setSelectedRule(res.responseRequestModel);
      setOpenDetailModal(true);
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
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <TableRow
                    key={rule.ruleID}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => fetchRuleDetail(rule.ruleID)}
                  >
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
                  <TableCell colSpan={4} className="text-center">
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
                  <span className="font-medium">{selectedRule.version}</span>
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
    </div>
  );
};

export default RuleManager;
