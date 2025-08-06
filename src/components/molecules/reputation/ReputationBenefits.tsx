import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatVietnamDateHours } from "@/utils/date";
import BenefitService from "@/services/BenefitService";

interface ReputationBenefit {
  level: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  requirements?: string;
  updatedAt?: string;
  maxActivities?: number;
}

interface ReputationBenefitsProps {
  onClose: () => void;
  currentLevel?: number;
  onOpenAllBenefits?: () => void;
  showAllBenefitsPanel?: boolean;
}

const ReputationBenefits = ({
  onClose,
  currentLevel = 1,
  onOpenAllBenefits,
  showAllBenefitsPanel = false,
}: ReputationBenefitsProps) => {
  const [benefits, setBenefits] = useState<ReputationBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getBenefitsLevel } = BenefitService();

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setIsLoading(true);
        const response = await getBenefitsLevel({});

        if (response?.isSuccess && response.responseRequestModel) {
          // Xử lý response từ API
          const apiData = response.responseRequestModel;

          // Tạo danh sách quyền lợi chỉ từ data API
          const generateBenefits = (): ReputationBenefit[] => [
            {
              level: 1,
              title: apiData.key.replace("Level", "Cấp"),
              description: `Số bài viết tối đa: ${apiData.value}, Số đơn rút tiền tối đa: ${apiData.value}, Số đơn report tối đa: ${apiData.value}`,
              isUnlocked: currentLevel >= 1,
              requirements: `Tối đa ${apiData.value} hoạt động/ngày`,
              updatedAt: apiData.updatedAt,
              maxActivities: apiData.value,
            },
          ];

          setBenefits(generateBenefits());
        } else {
          // Nếu API không trả về data, hiển thị thông báo
          setBenefits([]);
        }
      } catch (error) {
        console.error("Error fetching benefits:", error);
        toast.error("Không thể tải thông tin quyền lợi");
        setBenefits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenefits();
  }, [currentLevel, getBenefitsLevel]);

  return (
    <Card className="h-full flex flex-col overflow-x-hidden">
      <CardContent className="pt-0 overflow-x-hidden">
        <CardTitle className="relative flex justify-between items-center pb-3 z-10">
          Quyền lợi thành viên
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardTitle>

        <div className="space-y-3">
          <div className="max-h-[calc(4*7rem)] overflow-y-auto overflow-x-hidden pr-1">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-muted-foreground font-medium">
                    Đang tải quyền lợi...
                  </p>
                </div>
              ) : benefits.length > 0 ? (
                benefits.map((benefit) => (
                  <div
                    key={benefit.level}
                    className={cn(
                      "p-5 border rounded-xl w-full max-w-md mx-auto overflow-x-hidden transition-all duration-200",
                      benefit.isUnlocked
                        ? "bg-card border-border shadow-sm hover:shadow-md"
                        : "bg-muted/50 border-border opacity-60"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 justify-between">
                        <h3
                          className={cn(
                            "font-bold text-base",
                            benefit.isUnlocked
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {benefit.title}
                        </h3>
                        <span className="text-sm text-muted-foreground font-medium">
                          Tối đa {benefit.maxActivities || 3}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-sm mb-3 leading-relaxed",
                          benefit.isUnlocked
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {benefit.description}
                      </p>

                      {benefit.updatedAt && (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-muted-foreground">
                            Cập nhật:{" "}
                            {formatVietnamDateHours(benefit.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground font-medium mb-2">
                    Không có thông tin quyền lợi
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vui lòng thử lại sau hoặc liên hệ hỗ trợ
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground font-medium">
                Tham gia tích cực để nhận thêm các quyền lợi!
              </p>

              <div className="flex gap-2 justify-center">
                <Link
                  to={"/contact"}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-700 dark:hover:border-blue-300 rounded-lg transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
                <button
                  onClick={onOpenAllBenefits}
                  className="px-2 py-2 text-sm font-medium text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/50 hover:border-green-700 dark:hover:border-green-300 rounded-lg transition-colors"
                >
                  {showAllBenefitsPanel
                    ? "Ẩn tất cả quyền lợi"
                    : "Tất cả quyền lợi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReputationBenefits;
