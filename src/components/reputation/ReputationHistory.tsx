import { useEffect, useState } from "react";
import { X, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ReputationService from "@/services/ReputationService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatVietnamDateHours } from "../utils/date";

interface ReputationHistoryItem {
  reputationHistoryID: string;
  scoreChange: number;
  reason: string;
  changedAt: string;
  createByStaffId: string;
}

interface ReputationHistoryProps {
  onClose: () => void;
}

const ReputationHistory = ({ onClose }: ReputationHistoryProps) => {
  const { getReputationHistory } = ReputationService();
  const [history, setHistory] = useState<ReputationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getReputationHistory();
        if (response?.isSuccess) {
          setHistory(response.responseRequestModel?.responseList?.items || []);
        }
      } catch (error) {
        console.error("Error fetching reputation history:", error);
        toast.error("Không thể tải lịch sử điểm uy tín");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [getReputationHistory]);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-0">
        <CardTitle className="relative flex justify-between items-center pb-3 z-10">
          Lịch sử điểm uy tín
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </CardTitle>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-gray-600"></div>
            </div>
          ) : history.length > 0 ? (
            <div className="max-h-[calc(4*7rem)] overflow-y-auto pr-1">
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.reputationHistoryID}
                    className="p-3 bg-white border rounded-lg"
                  >
                    <div className="grid grid-cols-[1fr,auto] gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Điểm:</span>
                          <span
                            className={cn(
                              "font-medium flex items-center gap-1",
                              item.scoreChange > 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {item.scoreChange > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {item.scoreChange > 0 ? "+" : ""}
                            {item.scoreChange}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-500">Lý do:</span>
                          <p className="text-sm text-gray-700">{item.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                          <Clock className="h-3.5 w-3.5" />
                          {formatVietnamDateHours(item.changedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium mb-1">Chưa có lịch sử điểm uy tín</p>
              <p className="text-sm">
                Điểm uy tín sẽ được cập nhật khi bạn thực hiện các hoạt động
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReputationHistory;
