import * as React from "react";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  DollarSign,
  Users,
  ShoppingCart,
  Flag,
  ChartNoAxesCombined,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import DashboardService from "@/services/DashboardService";

interface SectionCardsProps {
  dashboardStats?: DashboardStats | null;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export function SectionCards({ dashboardStats, dateRange }: SectionCardsProps) {
  const { getGrowthRates } = DashboardService();

  // State for growth rates and comparison period
  const [growthRates, setGrowthRates] = React.useState<GrowthRates | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [comparisonRange, setComparisonRange] =
    React.useState<ComparisonDateRange>({
      compareStart: "",
      compareEnd: "",
    });

  // Set default comparison range (previous period)
  React.useEffect(() => {
    if (dateRange) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate previous period of same length
      const compareEnd = new Date(startDate);
      compareEnd.setDate(compareEnd.getDate() - 1);
      const compareStart = new Date(compareEnd);
      compareStart.setDate(compareStart.getDate() - daysDiff);

      setComparisonRange({
        compareStart: compareStart.toISOString().split("T")[0],
        compareEnd: compareEnd.toISOString().split("T")[0],
      });
    }
  }, [dateRange]);

  // Fetch growth rates when comparison range changes
  React.useEffect(() => {
    if (comparisonRange.compareStart && comparisonRange.compareEnd) {
      fetchGrowthRates();
    }
  }, [comparisonRange]);

  const fetchGrowthRates = async () => {
    setLoading(true);
    try {
      const response = await getGrowthRates(comparisonRange);
      console.log('fetchGrowthRates: ', response)
      if (response && response.responseRequestModel) {
        setGrowthRates({
          userGrowthRate: response.responseRequestModel.userGrowthRate,
          orderGrowthRate: response.responseRequestModel.orderGrowthRate,
          reportGrowthRate: response.responseRequestModel.reportGrowthRate,
        });
      }
    } catch (error) {
      console.error("Error fetching growth rates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComparisonDateChange = (
    field: "compareStart" | "compareEnd",
    value: string
  ) => {
    setComparisonRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatValue = (
    value: number,
    type: "currency" | "number" | "percentage"
  ) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("vi-VN");
    }
  };

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    return {
      value: `${isPositive ? "+" : ""}${rate.toFixed(1)}%`,
      isPositive,
      icon: isPositive ? TrendingUpIcon : TrendingDownIcon,
      variant: isPositive ? "default" : ("destructive" as const),
    };
  };

  const getGrowthDescription = (rate: number, type: string) => {
    const isPositive = rate >= 0;
    const absRate = Math.abs(rate);

    if (absRate === 0) return `No change in ${type.toLowerCase()}`;
    if (isPositive) {
      return absRate > 10
        ? `Strong growth in ${type.toLowerCase()}`
        : `Steady growth in ${type.toLowerCase()}`;
    } else {
      return absRate > 10
        ? `Significant decline in ${type.toLowerCase()}`
        : `Slight decline in ${type.toLowerCase()}`;
    }
  };

  // Card data configuration
  const cardData = [
    {
      title: "Total Revenue",
      description: "Tổng doanh thu",
      value: dashboardStats?.order.totalRevenue || 0,
      type: "currency" as const,
      icon: <DollarSign className="size-4" />,
      growthRate: null, // Revenue doesn't have growth rate in the API
      color: "text-green-600",
    },
    {
      title: "New Customers",
      description: "Khách hàng mới",
      value: dashboardStats?.account.newCustomerInFilter || 0,
      type: "number" as const,
      icon: <Users className="size-4" />,
      growthRate: growthRates?.userGrowthRate || 0,
      color: "text-blue-600",
    },
    {
      title: "Active Orders",
      description: "Đơn hàng hoạt động",
      value: dashboardStats?.order.orderInProgress || 0,
      type: "number" as const,
      icon: <ShoppingCart className="size-4" />,
      growthRate: growthRates?.orderGrowthRate || 0,
      color: "text-orange-600",
    },
    {
      title: "Reports Rate",
      description: "Tỷ lệ báo cáo",
      value: dashboardStats?.report.totalReport
        ? (dashboardStats.report.reportResolved /
            dashboardStats.report.totalReport) *
          100
        : 0,
      type: "percentage" as const,
      icon: <Flag className="size-4" />,
      growthRate: growthRates?.reportGrowthRate || 0,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Comparison Period Selector */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">So sánh với:</span>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-1" />
                {comparisonRange.compareStart && comparisonRange.compareEnd
                  ? `${comparisonRange.compareStart} - ${comparisonRange.compareEnd}`
                  : "Chọn khoảng thời gian"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="compareStart">Ngày bắt đầu so sánh</Label>
                  <Input
                    id="compareStart"
                    type="date"
                    value={comparisonRange.compareStart}
                    onChange={(e) =>
                      handleComparisonDateChange("compareStart", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareEnd">Ngày kết thúc so sánh</Label>
                  <Input
                    id="compareEnd"
                    type="date"
                    value={comparisonRange.compareEnd}
                    onChange={(e) =>
                      handleComparisonDateChange("compareEnd", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="sm"
                  onClick={fetchGrowthRates}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Đang tải..." : "Cập nhật"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
        {cardData.map((card, index) => {
          const growth =
            card.growthRate !== null ? formatGrowthRate(card.growthRate) : null;
          return (
            <Card key={index} className="@container/card">
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <div className={card.color}>{card.icon}</div>
                  <CardDescription>{card.title}</CardDescription>
                </div>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  {formatValue(card.value, card.type)}
                </CardTitle>
                {growth && (
                  <div className="absolute right-4 top-4">
                    <Badge
                      variant={
                        growth.variant === "destructive"
                          ? "destructive"
                          : "outline"
                      }
                      className="flex gap-1 rounded-lg text-xs"
                    >
                      <ChartNoAxesCombined className="size-3" />
                      {growth.value}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                {growth ? (
                  <>
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {getGrowthDescription(card.growthRate!, card.title)}
                      <ChartNoAxesCombined className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                      So với khoảng thời gian trước
                    </div>
                  </>
                ) : (
                  <>
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      Current period data
                    </div>
                    <div className="text-muted-foreground">
                      {card.description}
                    </div>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
