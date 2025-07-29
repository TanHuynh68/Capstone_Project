import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Settings,
  RefreshCw,
} from "lucide-react";
import DesignerService from "@/services/DesignerService";
import { formatVietnamDateHours } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimelineEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: "Done" | "InProgress" | "Rework";
  orderID: string;
  phaseName: string;
  note: string;
  color: string;
}

interface DesignerTimelineProps {
  designerID?: string;
  className?: string;
}

const STATUS_ICONS = {
  Done: CheckCircle,
  InProgress: Settings,
  Rework: RefreshCw,
} as const;

const STATUS_LABELS = {
  Done: "hoàn thành",
  InProgress: "cần làm",
  Rework: "làm lại",
} as const;

const STATUS_COLORS = {
  Done: "bg-green-500",
  InProgress: "bg-yellow-500",
  Rework: "bg-red-500",
} as const;

export default function DesignerTimeline({
  designerID,
  className = "",
}: DesignerTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );

  const designerService = DesignerService();

  const fetchTimelineData = async () => {
    if (!designerID) return;

    setLoading(true);
    try {
      const response = await designerService.getTimeline({
        designerID,
        startDate: formatVietnamDateHours(
          startOfMonth(currentDate),
          "yyyy-MM-dd"
        ),
        endDate: formatVietnamDateHours(endOfMonth(currentDate), "yyyy-MM-dd"),
      });

      if (response?.responseRequestModel?.progressTimelineItems) {
        const timelineEvents: TimelineEvent[] = [];

        response.responseRequestModel.progressTimelineItems.forEach((item) => {
          item.offerPhases.forEach((phase) => {
            const status = phase.offerPhaseStatus as
              | "Done"
              | "InProgress"
              | "Rework";

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
            });
          });
        });

        setEvents(timelineEvents);
      }
    } catch (error) {
      console.error("Error fetching timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [currentDate, designerID]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get all days for the calendar view (including previous/next month days)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 1 = Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }); // 1 = Monday

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(
      (event) => event.startDate <= day && event.endDate >= day
    );
  };

  const getStatusIcon = (status: TimelineEvent["status"]) => {
    const IconComponent = STATUS_ICONS[status];
    return <IconComponent className="w-4 h-4" />;
  };

  const isEventStart = (event: TimelineEvent, day: Date) => {
    return isSameDay(event.startDate, day);
  };

  const isEventEnd = (event: TimelineEvent, day: Date) => {
    return isSameDay(event.endDate, day);
  };

  const getEventPosition = (event: TimelineEvent, day: Date) => {
    const isStart = isEventStart(event, day);
    const isEnd = isEventEnd(event, day);

    if (isStart && isEnd) {
      return "rounded"; // Single day event
    } else if (isStart) {
      return "rounded-l"; // Start of multi-day event
    } else if (isEnd) {
      return "rounded-r"; // End of multi-day event
    } else {
      return ""; // Middle of multi-day event
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Data and Legend */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Legend */}
              <div className="space-y-2">
                {/* <h4 className="text-sm font-medium text-gray-700">
                  Status Legend:
                </h4> */}
                <div className="space-y-2">
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <div
                      key={status}
                      className="flex items-center gap-2 text-sm"
                    >
                      {getStatusIcon(status as TimelineEvent["status"])}
                      <span>
                        {status} = {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danh sách đơn hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Danh sách đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {events.slice(0, 3).map((event) => {
                  return (
                    <Badge key={event.id} className={event.color}>
                      {event.title}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[200px] text-center">
                    {format(currentDate, "MMM y", { locale: vi })}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[80px] p-1 border border-gray-200 ${
                        isCurrentMonth ? "bg-white" : "bg-gray-50"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <div
                        className={`text-xs mb-1 ${
                          isCurrentMonth ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {format(day, "d")}
                      </div>

                      <div className="space-y-1">
                        {dayEvents.map((event) => {
                          const position = getEventPosition(event, day);
                          const isStart = isEventStart(event, day);

                          return (
                            <div
                              key={event.id}
                              className={`h-6 cursor-pointer transition-colors hover:opacity-80 ${event.color} text-white ${position} flex items-center px-2`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              {isStart && (
                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                  {getStatusIcon(event.status)}
                                  <span className="text-xs font-medium truncate">
                                    {event.phaseName}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between mr-5">
                <DialogTitle className="text-lg font-semibold">
                  Chi tiết giai đoạn
                </DialogTitle>
                {selectedEvent && (
                  <Badge className={STATUS_COLORS[selectedEvent.status]}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedEvent.status)}
                      {STATUS_LABELS[selectedEvent.status]}
                    </div>
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Thời gian:
                  </label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                    {selectedEvent &&
                      `${formatVietnamDateHours(
                        selectedEvent.startDate
                      )} - ${formatVietnamDateHours(selectedEvent.endDate)}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tên giai đoạn:
                  </label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                    {selectedEvent?.phaseName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Mô tả:
                  </label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                    {selectedEvent?.title}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Ghi chú:
                  </label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                    {selectedEvent?.note}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
