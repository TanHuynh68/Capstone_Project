"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  CheckCircle,
  Settings,
  RefreshCw,
  Package,
  Calendar,
  Clock,
  FileText,
  StickyNote,
} from "lucide-react";
import { formatVietnamDateHours } from "@/utils/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import CreateProgressStepDialog from "@/components/molecules/customer/order-detail/CreateProgressStepDialog";
import type { CreateProgressStepFormData } from "@/schemas/progressStepSchema";
import ProgressService from "@/services/ProgressService";
import { toast } from "sonner";
import DesignerService from "@/services/DesignerService";
import "./index.css";

interface TimelineEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: "Done" | "InProgress" | "Rework" | "Withdrawed";
  orderID: string;
  phaseName: string;
  note: string;
  color: string;
  orderColor: string;
}

interface DesignerTimelineProps {
  designerID?: string;
  className?: string;
}

const STATUS_ICONS = {
  Done: CheckCircle,
  InProgress: Settings,
  Rework: RefreshCw,
  Withdrawed: Settings,
} as const;

const STATUS_LABELS = {
  Done: "Hoàn thành",
  InProgress: "Cần làm",
  Rework: "Làm lại",
  Withdrawed: "Rút tiền",
} as const;

const STATUS_COLORS = {
  Done: "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
  InProgress:
    "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700",
  Rework: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
  Withdrawed:
    "bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700",
} as const;

// Tailwind color classes cho từng đơn hàng
const ORDER_COLORS = [
  "rgb(59 130 246)", // blue-500
  "rgb(139 92 246)", // purple-500
  "rgb(236 72 153)", // pink-500
  "rgb(99 102 241)", // indigo-500
  "rgb(20 184 166)", // teal-500
  "rgb(249 115 22)", // orange-500
  "rgb(6 182 212)", // cyan-500
  "rgb(16 185 129)", // emerald-500
  "rgb(244 63 94)", // rose-500
  "rgb(139 92 246)", // violet-500
] as const;

const ORDER_COLOR_CLASSES = [
  "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
  "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
  "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700",
  "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
  "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700",
  "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
  "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700",
  "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
  "bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700",
  "bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700",
] as const;

export default function DesignerTimeline({
  designerID,
  className = "",
}: DesignerTimelineProps) {
  const navigate = useNavigate();
  const progressService = ProgressService();
  const designerService = DesignerService();
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [showCreateProgressDialog, setShowCreateProgressDialog] =
    useState(false);
  const [selectedPhaseForProgress, setSelectedPhaseForProgress] =
    useState<TimelineEvent | null>(null);

  const fetchTimelineData = useCallback(async () => {
    if (!designerID) return;
    setLoading(true);
    try {
      const timelineResponse = await designerService.getTimeline({
        designerID,
      });
      if (timelineResponse?.responseRequestModel?.progressTimelineItems) {
        const timelineEvents: TimelineEvent[] = [];
        const orderColorMap = new Map<string, string>();
        const orderColorClassMap = new Map<string, string>();

        // Tạo map màu sắc cho từng đơn hàng
        timelineResponse.responseRequestModel.progressTimelineItems.forEach(
          (item, index) => {
            const colorIndex = index % ORDER_COLORS.length;
            orderColorMap.set(item.order.orderID, ORDER_COLORS[colorIndex]);
            orderColorClassMap.set(
              item.order.orderID,
              ORDER_COLOR_CLASSES[colorIndex]
            );
          }
        );

        timelineResponse.responseRequestModel.progressTimelineItems.forEach(
          (item) => {
            item.offerPhases.forEach((phase) => {
              const status = phase.offerPhaseStatus as
                | "Done"
                | "InProgress"
                | "Rework"
                | "Withdrawed";
              timelineEvents.push({
                id: phase.offerPhaseID,
                title: `${item.order.note}`,
                startDate: new Date(phase.startDate),
                endDate: new Date(phase.endDate),
                status: status,
                orderID: item.order.orderID,
                phaseName: phase.phaseName,
                note: item.order.note,
                color: STATUS_COLORS[status],
                orderColor:
                  orderColorMap.get(item.order.orderID) || ORDER_COLORS[0],
              });
            });
          }
        );
        setEvents(timelineEvents);
      }
    } catch (error) {
      console.error("Error fetching timeline data:", error);
    } finally {
      setLoading(false);
    }
  }, [designerID, designerService]);

  useEffect(() => {
    fetchTimelineData();
  }, [currentDate, designerID]);

  const getStatusIcon = (status: TimelineEvent["status"]) => {
    const IconComponent = STATUS_ICONS[status];
    return <IconComponent className="w-4 h-4" />;
  };

  // Chuyển đổi events sang format FullCalendar
  const fullCalendarEvents = events.map((event) => {
    const adjustedEndDate = new Date(event.endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    return {
      id: event.id,
      title: event.phaseName,
      start: event.startDate,
      end: adjustedEndDate,
      backgroundColor: event.orderColor,
      borderColor: event.orderColor,
      textColor: "white",
      extendedProps: {
        status: event.status,
        orderID: event.orderID,
        note: event.note,
        originalEvent: event,
      },
    };
  });

  const handleEventClick = (clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    if (originalEvent.status === "Done") {
      setSelectedEvent(originalEvent);
    } else {
      setSelectedPhaseForProgress(originalEvent);
      setShowCreateProgressDialog(true);
    }
  };

  const handleEventMouseEnter = (mouseEnterInfo: any) => {
    setHoveredEvent(mouseEnterInfo.event.id);
  };

  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
  };

  const handleOrderClick = (orderID: string) => {
    navigate(`/order/${orderID}`);
  };

  const handleCreateProgressSubmit = async (
    data: CreateProgressStepFormData
  ) => {
    try {
      const response = await progressService.createProgressStep(data);
      if (response?.statusCode === 201) {
        toast.success("Tạo tiến độ thành công!", {
          description: "Tiến độ đã được thêm vào giai đoạn này",
        });
        setShowCreateProgressDialog(false);
        setSelectedPhaseForProgress(null);
        await fetchTimelineData();
      }
    } catch (error) {
      console.error("Error creating progress step:", error);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-[700px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const uniqueOrders = Array.from(
    new Set(events.map((event) => event.orderID))
  );
  const orderColorClassMap = new Map<string, string>();
  uniqueOrders.forEach((orderID, index) => {
    const colorIndex = index % ORDER_COLOR_CLASSES.length;
    orderColorClassMap.set(orderID, ORDER_COLOR_CLASSES[colorIndex]);
  });

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Data and Legend */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-l">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-center items-center gap-2">
                <div className="text-center">
                  <h2 className="text-lg font-bold mb-1 text-foreground">
                    Lịch trình thiết kế
                  </h2>
                  <p className="text-xs text-center text-muted-foreground">
                    Quản lý tiến độ và lịch trình của bạn
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center">
                      <Package className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      Tổng đơn hàng
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="font-bold text-sm px-2 py-0.5"
                  >
                    {uniqueOrders.length}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-200 rounded-md flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      Hoàn thành
                    </span>
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 font-bold text-sm px-2 py-0.5">
                    {events.filter((event) => event.status === "Done").length}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-200 rounded-md flex items-center justify-center">
                      <Settings className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      Đang thực hiện
                    </span>
                  </div>
                  <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 font-bold text-sm px-2 py-0.5">
                    {
                      events.filter((event) => event.status === "InProgress" ||  event.status === "Withdrawed")
                        .length
                    }
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-200 rounded-md flex items-center justify-center">
                      <RefreshCw className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      Cần làm lại
                    </span>
                  </div>
                  <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 font-bold text-sm px-2 py-0.5">
                    {events.filter((event) => event.status === "Rework").length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danh sách đơn hàng */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-center items-center gap-2">
                {/* <FileText className="w-5 h-5 text-purple-500" /> */}

                <div className="text-center">
                  <h2 className="text-lg font-bold mb-1 text-foreground">
                    Danh sách đơn hàng
                  </h2>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uniqueOrders.map((orderID) => {
                  const orderEvent = events.find(
                    (event) => event.orderID === orderID
                  );
                  const colorClass = orderColorClassMap.get(orderID);
                  if (orderEvent) {
                    return (
                      <div
                        key={orderID}
                        className="group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => handleOrderClick(orderID)}
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              colorClass?.split(" ")[0]
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {orderEvent.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {
                                events.filter((e) => e.orderID === orderID)
                                  .length
                              }{" "}
                              giai đoạn
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
                {uniqueOrders.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có đơn hàng nào
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - FullCalendar */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-xl">
            <CardContent className="">
              <div className="h-[700px] designer-calendar">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  locale="vi"
                  firstDay={1}
                  buttonText={{
                    today: "Hôm nay",
                    month: "Tháng",
                    week: "Tuần",
                  }}
                  titleFormat={{
                    month: "long",
                    year: "numeric",
                  }}
                  headerToolbar={{
                    left: "title",
                    right: "today prev,next",
                  }}
                  events={fullCalendarEvents}
                  eventClick={handleEventClick}
                  eventMouseEnter={handleEventMouseEnter}
                  eventMouseLeave={handleEventMouseLeave}
                  eventDisplay="block"
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    meridiem: false,
                  }}
                  height="100%"
                  dayMaxEvents={false}
                  moreLinkClick="popover"
                  fixedWeekCount={false}
                  showNonCurrentDates={false}
                  eventClassNames={(arg) => {
                    const classes = [
                      "cursor-pointer",
                      "transition-all",
                      "duration-200",
                      "hover:scale-105",
                    ];
                    if (hoveredEvent === arg.event.id) {
                      classes.push("shadow-lg", "z-10");
                    }
                    return classes;
                  }}
                  eventContent={(arg) => {
                    const status = arg.event.extendedProps
                      .status as TimelineEvent["status"];
                    const IconComponent = STATUS_ICONS[status];
                    return (
                      <div className="flex items-center gap-2 p-1 rounded">
                        <IconComponent className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">
                          {arg.event.title}
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <DialogContent className="max-w-lg rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Chi tiết giai đoạn
                </DialogTitle>
                {selectedEvent && (
                  <Badge
                    className={`text-xs px-3 py-1 rounded-full ${
                      STATUS_COLORS[selectedEvent.status]
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedEvent.status)}
                      <span className="font-medium">
                        {STATUS_LABELS[selectedEvent.status]}
                      </span>
                    </div>
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 gap-6">
                {/* Thời gian thực hiện */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Thời gian thực hiện
                    </label>
                  </div>
                  <div className="p-4 bg-white dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {selectedEvent &&
                        `${formatVietnamDateHours(
                          selectedEvent.startDate
                        )} - ${formatVietnamDateHours(selectedEvent.endDate)}`}
                    </p>
                  </div>
                </div>

                {/* Tên giai đoạn */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tên giai đoạn
                    </label>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {selectedEvent?.phaseName}
                    </p>
                  </div>
                </div>

                {/* Mô tả dự án */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Mô tả dự án
                    </label>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedEvent?.title}
                    </p>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Ghi chú
                    </label>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-amber-950/20 rounded-xl border border-yellow-100 dark:border-amber-800 shadow-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedEvent?.note}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Progress Step Dialog */}
      {selectedPhaseForProgress  && (
        <CreateProgressStepDialog
          isOpen={showCreateProgressDialog}
          onClose={() => {
            setShowCreateProgressDialog(false);
            setSelectedPhaseForProgress(null);
          }}
          orderID={selectedPhaseForProgress.orderID}
          offerPhaseID={selectedPhaseForProgress.id}
          onSubmit={handleCreateProgressSubmit}
        />
      )}
    </div>
  );
}
