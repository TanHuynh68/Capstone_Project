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
}

const ReputationBenefits = ({
  onClose,
  currentLevel = 1,
  onOpenAllBenefits,
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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </CardTitle>

        <div className="space-y-3">
          <div className="max-h-[calc(4*7rem)] overflow-y-auto overflow-x-hidden pr-1">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-500 font-medium">
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
                        ? "bg-white border-gray-200 shadow-sm hover:shadow-md"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 justify-between">
                        <h3
                          className={cn(
                            "font-bold text-base",
                            benefit.isUnlocked
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}
                        >
                          {benefit.title}
                        </h3>
                        <span className="text-sm text-gray-600 font-medium">
                          Tối đa {benefit.maxActivities || 3}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-sm mb-3 leading-relaxed",
                          benefit.isUnlocked ? "text-gray-700" : "text-gray-500"
                        )}
                      >
                        {benefit.description}
                      </p>

                      {benefit.updatedAt && (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-gray-400">
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
                  <p className="text-gray-500 font-medium mb-2">
                    Không có thông tin quyền lợi
                  </p>
                  <p className="text-sm text-gray-400">
                    Vui lòng thử lại sau hoặc liên hệ hỗ trợ
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500 font-medium">
                Tham gia tích cực để nhận thêm các quyền lợi!
              </p>

              <div className="flex gap-2 justify-center">
                <Link
                  to={"/contact"}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-700 rounded-lg transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
                <button
                  onClick={onOpenAllBenefits}
                  className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-700 rounded-lg transition-colors"
                >
                  Tất cả quyền lợi
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
