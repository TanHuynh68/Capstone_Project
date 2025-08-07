import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import BenefitService from "@/services/BenefitService";
import { X } from "lucide-react";
import { formatVietnamDate } from "@/utils/date";

interface AllBenefit {
  benefitID: string;
  benefitType: string;
  title: string;
  customerScoreChange: number;
  designerScoreChange: number;
  customerCompensationRate: number;
  designerCompensationRate: number;
  version: number;
  createdAt: string;
}

interface AllBenefitsProps {
  title?: string;
  benefitType?: number; // 0-4
  page?: number;
  size?: number;
  onClose?: () => void;
}

interface BenefitParams {
  page: number;
  size: number;
  benefitType?: number;
}

const AllBenefits = ({
  title = "Tất cả quyền lợi hệ thống",
  benefitType,
  page = 1,
  size = 10,
  onClose,
}: AllBenefitsProps) => {
  const [benefits, setBenefits] = useState<AllBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getBenefits } = BenefitService();

  useEffect(() => {
    const fetchAllBenefits = async () => {
      try {
        setIsLoading(true);
        const params: BenefitParams = {
          page,
          size,
        };

        if (benefitType !== undefined) {
          params.benefitType = benefitType;
        }

        const response = await getBenefits(params);
        if (
          response?.isSuccess &&
          response.responseRequestModel?.responseList?.items
        ) {
          // Map từ response API thực tế
          setBenefits(response.responseRequestModel.responseList.items);
        } else {
          setBenefits([]);
        }
      } catch (error) {
        toast.error("Không thể tải danh sách quyền lợi");
        setBenefits([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBenefits();
  }, [getBenefits, benefitType, page, size]);

  const getBenefitTypeLabel = (type: string): string | ReactNode => {
    switch (type) {
      case "General":
        return "Chung";
      case "Delivery":
        return "Giao hàng";
      case "OrderAndProgress":
        return (
          <>
            Đơn hàng &<br />
            Tiến độ
          </>
        );
      case "PostAndOffer":
        return (
          <>
            Bài viết &<br />
            Đề xuất
          </>
        );
      case "Scam":
        return "Lừa đảo";
      default:
        return type;
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-x-hidden">
      <CardContent className="pt-0 overflow-x-hidden">
        <CardTitle className="relative flex justify-between items-center pb-3 z-10">
          {title}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
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
                    key={benefit.benefitID}
                    className={cn(
                      "p-5 border rounded-xl w-full max-w-md mx-auto overflow-x-hidden transition-all duration-200 bg-card border-border shadow-sm hover:shadow-md"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 justify-between">
                        <h3 className="font-bold text-base text-foreground">
                          {benefit.title}
                        </h3>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap">
                          {getBenefitTypeLabel(benefit.benefitType)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Điểm khách hàng:
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              benefit.customerScoreChange > 0
                                ? "text-green-600 dark:text-green-400"
                                : benefit.customerScoreChange < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground"
                            )}
                          >
                            {benefit.customerScoreChange > 0 ? "+" : ""}
                            {benefit.customerScoreChange}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Điểm nhà thiết kế:
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              benefit.designerScoreChange > 0
                                ? "text-green-600 dark:text-green-400"
                                : benefit.designerScoreChange < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground"
                            )}
                          >
                            {benefit.designerScoreChange > 0 ? "+" : ""}
                            {benefit.designerScoreChange}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Bồi thường khách:
                          </span>
                          <span className="font-medium text-foreground">
                            {benefit.customerCompensationRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Bồi thường nhà thiết kế:
                          </span>
                          <span className="font-medium text-foreground">
                            {benefit.designerCompensationRate}%
                          </span>
                        </div>
                      </div>

                      {benefit.createdAt && (
                        <div className="flex items-center gap-4 justify-end mt-3">
                          <span className="text-xs text-muted-foreground">
                            Phiên bản:{" "}
                            <span className="font-semibold text-muted-foreground">
                              {benefit.version}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Ngày tạo: {formatVietnamDate(benefit.createdAt)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AllBenefits;
