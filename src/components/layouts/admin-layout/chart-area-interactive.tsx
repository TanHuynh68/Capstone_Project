"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ShoppingCart, Flag, Calendar, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DashboardService from "@/services/DashboardService";

// Chart configurations for different types
const chartConfigs = {
  account: {
    title: "Thống kê tài khoản",
    description: "Tổng quan về người dùng trong hệ thống",
    icon: <Users className="w-4 h-4" />,
    fields: {
      totalAccount: { label: "Tổng tài khoản", color: "#3b82f6" }, // Bright blue
      totalAccountActive: { label: "Tài khoản hoạt động", color: "#10b981" }, // Bright green
      numberOfCustomer: { label: "Khách hàng", color: "#f59e0b" }, // Bright orange
      numberOfDesigner: { label: "Nhà thiết kế", color: "#8b5cf6" }, // Bright purple
      newAccount: { label: "Tài khoản mới", color: "#ef4444" }, // Bright red
      newCustomer: { label: "Khách hàng mới", color: "#06b6d4" }, // Bright cyan
      newDesigner: { label: "Nhà thiết kế mới", color: "#f97316" }, // Bright orange-red
    },
    defaultFields: ["totalAccount", "totalAccountActive"] as string[],
  },
  order: {
    title: "Thống kê đơn hàng",
    description: "Tình trạng các đơn hàng trong hệ thống",
    icon: <ShoppingCart className="w-4 h-4" />,
    fields: {
      totalOrder: { label: "Tổng đơn hàng", color: "#3b82f6" },
      orderDone: { label: "Đơn hoàn thành", color: "#10b981" },
      orderInProgress: { label: "Đơn đang thực hiện", color: "#f59e0b" },
      orderPendingConflict: { label: "Đơn tranh chấp", color: "#ef4444" },
      orderCancelled: { label: "Đơn đã hủy", color: "#6b7280" },
    },
    defaultFields: ["totalOrder", "orderDone"] as string[],
  },
  report: {
    title: "Thống kê báo cáo",
    description: "Tình trạng các báo cáo trong hệ thống",
    icon: <Flag className="w-4 h-4" />,
    fields: {
      totalReport: { label: "Tổng báo cáo", color: "#3b82f6" },
      reportPending: { label: "Báo cáo chờ xử lý", color: "#f59e0b" },
      reportResolved: { label: "Báo cáo đã giải quyết", color: "#10b981" },
      reportRejected: { label: "Báo cáo bị từ chối", color: "#ef4444" },
    },
    defaultFields: ["totalReport", "reportPending"] as string[],
  },
} as const;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { getDashboard } = DashboardService();

  // State management
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartType, setChartType] = React.useState<ChartType>("account");
  const [selectedFields, setSelectedFields] = React.useState<string[]>([
    ...chartConfigs.account.defaultFields,
  ]);
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [currentStats, setCurrentStats] = React.useState<DashboardStats | null>(
    null
  );

  // Custom date range state
  const [customDateRange, setCustomDateRange] = React.useState({
    startDate: "",
    endDate: "",
  });
  const [isCustomRange, setIsCustomRange] = React.useState(false);

  // Auto-adjust time range for mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Reset selected fields when chart type changes
  React.useEffect(() => {
    setSelectedFields([...chartConfigs[chartType].defaultFields]);
  }, [chartType]);

  // Calculate date range based on time range or custom range
  const getDateRange = React.useCallback(() => {
    if (isCustomRange && customDateRange.startDate && customDateRange.endDate) {
      return {
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate,
      };
    }

    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }, [timeRange, isCustomRange, customDateRange]);

  // Generate time series data by calling API multiple times
  const generateTimeSeriesFromAPI = React.useCallback(
    async (dateRange: { startDate: string; endDate: string }) => {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      const data: ChartDataPoint[] = [];

      // Calculate interval based on date range
      const totalDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      let interval = 1; // daily

      if (totalDays > 60) {
        interval = 7; // weekly for longer periods
      }

      const current = new Date(start);
      const promises: Promise<any>[] = [];

      // Create array of API calls
      while (current <= end) {
        const currentDateStr = current.toISOString().split("T")[0];
        const nextDate = new Date(current);
        nextDate.setDate(nextDate.getDate() + interval);
        const nextDateStr = nextDate.toISOString().split("T")[0];

        promises.push(
          getDashboard({
            startDate: currentDateStr,
            endDate:
              nextDateStr > dateRange.endDate ? dateRange.endDate : nextDateStr,
          }).then((response) => ({
            date: currentDateStr,
            data: response?.responseRequestModel || null,
          }))
        );

        current.setDate(current.getDate() + interval);
      }

      // Execute all API calls
      const results = await Promise.all(promises);

      // Process results into chart data
      results.forEach((result) => {
        if (result.data) {
          const dataPoint: ChartDataPoint = { date: result.date };

          // Add data based on chart type
          const statsData = result.data[chartType];
          Object.keys(chartConfigs[chartType].fields).forEach((field) => {
            dataPoint[field] = statsData[field as keyof typeof statsData] || 0;
          });

          data.push(dataPoint);
        }
      });

      return data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    },
    [getDashboard, chartType]
  );

  // Fetch dashboard data
  const fetchDashboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      const dateRange = getDateRange();
      console.log("Fetching data for date range:", dateRange);

      // Generate time series data from API
      const timeSeriesData = await generateTimeSeriesFromAPI(dateRange);
      console.log("Time series data:", timeSeriesData);
      setChartData(timeSeriesData);

      // Also fetch current stats for summary (latest period)
      const response = await getDashboard(dateRange);
      if (response) {
        setCurrentStats(response.responseRequestModel);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setChartData([]);
      setCurrentStats(null);
    } finally {
      setLoading(false);
    }
  }, [getDateRange, generateTimeSeriesFromAPI, getDashboard]);

  // Fetch data on component mount and when dependencies change
  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle field selection toggle
  const toggleField = (field: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        return prev.filter((f) => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  // Handle custom date range
  const handleCustomDateChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setCustomDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyCustomDateRange = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setIsCustomRange(true);
      setTimeRange("custom");
    }
  };

  const resetToPresetRange = (range: string) => {
    setIsCustomRange(false);
    setTimeRange(range);
  };

  // Create chart config based on selected fields
  const currentChartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    const currentConfig = chartConfigs[chartType];

    selectedFields.forEach((field) => {
      if (currentConfig.fields[field as keyof typeof currentConfig.fields]) {
        config[field] =
          currentConfig.fields[field as keyof typeof currentConfig.fields];
      }
    });

    return config;
  }, [chartType, selectedFields]);

  const currentConfig = chartConfigs[chartType];

  // Add this function before the return statement
  const calculateYAxisDomain = React.useMemo(() => {
    if (chartData.length === 0) return [0, 100];

    let maxValue = 0;
    chartData.forEach((dataPoint) => {
      selectedFields.forEach((field) => {
        const value = dataPoint[field] as number;
        if (value > maxValue) {
          maxValue = value;
        }
      });
    });

    // Add 25% headroom to the max value, minimum 10
    const upperBound = Math.max(Math.ceil(maxValue * 1.25), 10);
    return [0, upperBound];
  }, [chartData, selectedFields]);

  return (
    <Card className="@container/card my-4">
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-2 mb-2">
          {currentConfig.icon}
          <CardTitle>{currentConfig.title}</CardTitle>
        </div>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {currentConfig.description}
          </span>
          <span className="@[540px]/card:hidden">
            {currentConfig.description}
          </span>
        </CardDescription>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex gap-1">
            {(Object.keys(chartConfigs) as ChartType[]).map((type) => (
              <Button
                key={type}
                variant={chartType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(type)}
                className="h-8"
              >
                {chartConfigs[type].icon}
                <span className="ml-1 hidden sm:inline">
                  {chartConfigs[type].title.replace("Thống kê ", "")}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="absolute right-4 top-4 flex gap-2">
          {/* Custom Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-1" />
                {isCustomRange ? "Tùy chỉnh" : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) =>
                      handleCustomDateChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) =>
                      handleCustomDateChange("endDate", e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={applyCustomDateRange}
                    className="flex-1"
                  >
                    Áp dụng
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resetToPresetRange("30d")}
                    className="flex-1"
                  >
                    Đặt lại
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Preset Time Range */}
          <ToggleGroup
            type="single"
            value={isCustomRange ? "custom" : timeRange}
            onValueChange={(value) => {
              if (value && value !== "custom") {
                resetToPresetRange(value);
              }
            }}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 tháng
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 ngày
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 ngày
            </ToggleGroupItem>
            {isCustomRange && (
              <ToggleGroupItem value="custom" className="h-8 px-2.5">
                Tùy chỉnh
              </ToggleGroupItem>
            )}
          </ToggleGroup>

          <Select
            value={isCustomRange ? "custom" : timeRange}
            onValueChange={(value) => {
              if (value !== "custom") {
                resetToPresetRange(value);
              }
            }}
          >
            <SelectTrigger
              className="@[767px]/card:hidden flex w-32"
              aria-label="Select a value"
            >
              <SelectValue placeholder="30 ngày" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 tháng
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 ngày
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 ngày
              </SelectItem>
              {isCustomRange && (
                <SelectItem value="custom" className="rounded-lg">
                  Tùy chỉnh
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="h-8 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      {/* Date Range Display */}
      {(isCustomRange || timeRange) && (
        <div className="px-6 pb-2">
          <div className="text-sm text-gray-600">
            Khoảng thời gian:{" "}
            <span className="font-medium">
              {isCustomRange
                ? `${customDateRange.startDate} đến ${customDateRange.endDate}`
                : timeRange === "7d"
                ? "7 ngày qua"
                : timeRange === "30d"
                ? "30 ngày qua"
                : "3 tháng qua"}
            </span>
          </div>
        </div>
      )}

      {/* Field Selector */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Hiển thị:
          </span>
          {Object.entries(currentConfig.fields).map(([field, config]) => (
            <Badge
              key={field}
              variant={selectedFields.includes(field) ? "default" : "outline"}
              className="cursor-pointer hover:bg-opacity-80 transition-colors"
              onClick={() => toggleField(field)}
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{
                  backgroundColor: selectedFields.includes(field)
                    ? config.color
                    : "transparent",
                }}
              />
              {config.label}
            </Badge>
          ))}
        </div>
      </div>

      <CardContent className="px-2 pt-0 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-gray-600">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <div className="text-gray-400 mb-2">Không có dữ liệu</div>
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Thử lại
              </Button>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={currentChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                {selectedFields.map((field, index) => (
                  <linearGradient
                    key={field}
                    id={`fill${field}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={
                        currentChartConfig[field]?.color ||
                        `hsl(var(--chart-${index + 1}))`
                      }
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        currentChartConfig[field]?.color ||
                        `hsl(var(--chart-${index + 1}))`
                      }
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={calculateYAxisDomain}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("vi-VN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {selectedFields.map((field, index) => (
                <Area
                  key={field}
                  dataKey={field}
                  type="natural"
                  fill={`url(#fill${field})`}
                  stroke={
                    currentChartConfig[field]?.color ||
                    `hsl(var(--chart-${index + 1}))`
                  }
                  strokeWidth={2}
                  fillOpacity={0.6}
                  // Remove stackId="a" to prevent stacking
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )}

        {/* Current Stats Summary */}
        {currentStats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentStats[chartType]).map(([key, value]) => {
              const fieldConfig: any =
                currentConfig.fields[key as keyof typeof currentConfig.fields];
              if (!fieldConfig) return null;

              return (
                <div
                  key={key}
                  className="text-center p-3 rounded-lg border-2 border-solid"
                >
                  <div className="text-2xl font-bold">
                    {value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {fieldConfig.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
