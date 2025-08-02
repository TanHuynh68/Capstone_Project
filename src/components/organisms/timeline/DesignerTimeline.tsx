import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CheckCircle, Settings, RefreshCw, Package } from "lucide-react";
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
import { useCallback } from "react";

// CSS styles for FullCalendar customization
const calendarStyles = `
  .fc-event {
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    margin: 1px 0;
  }
  
  .fc-event:hover {
    opacity: 0.8;
  }
  
  .fc-event-main {
    padding: 2px 4px;
  }
  
  .fc-daygrid-event {
    white-space: nowrap;
    border-radius: 4px;
  }
  
  .fc-daygrid-day-events {
    margin: 0;
  }
  
  .fc-daygrid-day-frame {
    min-height: 120px;
  }
  
  .fc-daygrid-day-events {
    margin: 0;
    min-height: 80px;
  }
  
  .fc-daygrid-event {
    margin: 1px 0;
    border-radius: 4px;
    height: auto !important;
    min-height: 20px;
  }
  
  .fc-daygrid-event-dot {
    display: none;
  }
  
  .fc-daygrid-event-main {
    padding: 2px 4px;
    height: auto;
    min-height: 18px;
  }
  
  .fc-daygrid-day-number {
    font-weight: 500;
  }
  
  .fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(var(--primary));
  }
  
  /* Custom button styles */
  .fc-button {
    background: var(--primary) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 8px 16px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    color: white !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    position: relative !important;
    overflow: hidden !important;
  }
  
  /* Hide days from other months */
  .fc-day-other {
    display: none !important;
  }
  
  /* Show only one day from next month if needed */
  .fc-day-other.fc-day-next-month {
    display: table-cell !important;
  }
  
  /* Hide all other month days except the first one */
  .fc-day-other.fc-day-next-month:not(:first-of-type) {
    display: none !important;
  }
  
  /* Hide previous month days completely */
  .fc-day-other.fc-day-prev-month {
    display: none !important;
  }
  
  /* Ensure proper grid layout */
  .fc-daygrid-body {
    min-height: 400px !important;
  }
  
  /* Adjust day grid to show only current month + 1 day next month */
  .fc-daygrid-day-frame {
    min-height: 120px !important;
  }
  
  /* Custom grid layout for current month only */
  .fc-daygrid-day.fc-day-current {
    display: table-cell !important;
  }
  
  /* Ensure calendar takes full height */
  .fc-view-harness {
    height: 100% !important;
  }
  
  .fc-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .fc-button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    background: var(--primary-foreground) !important;
  }
  
  .fc-button:hover::before {
    left: 100%;
  }
  
  .fc-button:active {
    transform: translateY(0) !important;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1) !important;
  }
  
  .fc-button-active {
    background: var(--primary) !important;
    transform: scale(0.95) !important;
  }
  
  /* Disabled button styles */
  .fc-button:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
    transform: none !important;
  }
  
  .fc-button:disabled:hover {
    transform: none !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  }
  
  /* Toolbar container */
  .fc-toolbar {
    padding: 16px 0 !important;
    margin-bottom: 20px !important;
  }
  
  /* Button group styling */
  .fc-button-group {
    border-radius: 12px !important;
    overflow: hidden !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }
  
  .fc-button-group .fc-button {
    border-radius: 0 !important;
    margin: 0 !important;
  }
  
  .fc-button-group .fc-button:first-child {
    border-top-left-radius: 12px !important;
    border-bottom-left-radius: 12px !important;
  }
  
  .fc-button-group .fc-button:last-child {
    border-top-right-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
  }
  
  /* Today button basic styling */
  .fc-today-button {
    background: var(--primary) !important;
    border: none !important;
    border-radius: 8px !important;
    color: var(--primary-foreground) !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
  }
  
  .fc-today-button:hover {
    background: var(--primary) !important;
    opacity: 0.8 !important;
    transform: translateY(-1px) !important;
  }
  
  /* Prev/Next buttons basic styling */
  .fc-prev-button,
  .fc-next-button {
    min-width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: var(--primary) !important;
    border: none !important;
    border-radius: 8px !important;
    color: var(--primary-foreground) !important;
    font-weight: 600 !important;
  }
  
  .fc-prev-button:hover,
  .fc-next-button:hover {
    background: var(--primary) !important;
    opacity: 0.8 !important;
    transform: translateY(-1px) !important;
  }
  
  /* Header toolbar layout */
  .fc-header-toolbar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    flex-wrap: wrap !important;
    gap: 16px !important;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .fc-header-toolbar {
      flex-direction: column !important;
      gap: 12px !important;
    }
    
    .fc-toolbar-title {
      font-size: 1.1rem !important;
      text-align: center !important;
    }
    
    .fc-button {
      padding: 6px 12px !important;
      font-size: 12px !important;
    }
  }
`;

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
  Done: "bg-green-500",
  InProgress: "bg-yellow-500",
  Rework: "bg-red-500",
  Withdrawed: "bg-gray-500",
} as const;

// Màu sắc cho từng đơn hàng
const ORDER_COLORS = [
  "#3B82F6", // blue-500
  "#8B5CF6", // purple-500
  "#EC4899", // pink-500
  "#6366F1", // indigo-500
  "#14B8A6", // teal-500
  "#F97316", // orange-500
  "#06B6D4", // cyan-500
  "#10B981", // emerald-500
  "#F43F5E", // rose-500
  "#8B5CF6", // violet-500
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
      // Mock data for testing
      // const response = {
      //   isSuccess: true,
      //   message: "Phản hồi thành công",
      //   statusCode: 200,
      //   responseRequestModel: {
      //     progressTimelineItems: [
      //       {
      //         order: {
      //           orderID: "d19e8b9f-52c1-4352-b08d-5ad8fba4a71b",
      //           designerID: "e27f1786-ffa5-4d60-be23-359da537241b",
      //           orderStatus: "InProgress",
      //           note: "uia ",
      //           deadlineAt: "2025-07-31T16:59:59.999",
      //           startDate: "2025-07-19T11:01:05.7052882",
      //           endDate: null,
      //           createdAt: "2025-07-19T11:01:05.7052883",
      //           updatedAt: "2025-07-19T11:01:05.7052884",
      //         },
      //         offer: {
      //           offerID: "d19e8b9f-52c1-4352-b08d-5ad8fba4a71b",
      //           designerID: "e27f1786-ffa5-4d60-be23-359da537241b",
      //           note: "sinh 3",
      //           offerStatus: "Accepted",
      //         },
      //         offerPhases: [
      //           {
      //             offerPhaseID: "b7de8a54-66de-4878-9689-ff6707812656",
      //             offerID: "d19e8b9f-52c1-4352-b08d-5ad8fba4a71b",
      //             phase: 1,
      //             phaseName: "Giai đoạn 1",
      //             phaseDescription: "1",
      //             offerPhaseStatus: "Done",
      //             progressCount: 1,
      //             startDate: "2025-07-20T00:00:00",
      //             endDate: "2025-07-24T00:00:00",
      //             modifyDate: "2025-07-19T11:00:47.3930968",
      //           },
      //           {
      //             offerPhaseID: "11111111-2222-3333-4444-555555555555",
      //             offerID: "d19e8b9f-52c1-4352-b08d-5ad8fba4a71b",
      //             phase: 2,
      //             phaseName: "Tạo áo cho labubu sử dụng da Nappa cao cấcấp",
      //             phaseDescription: "Thiết kế mẫu",
      //             offerPhaseStatus: "InProgress",
      //             progressCount: 0,
      //             startDate: "2025-07-25T00:00:00",
      //             endDate: "2025-07-26T00:00:00",
      //             modifyDate: "2025-07-25T10:00:00",
      //           },
      //           {
      //             offerPhaseID: "66666666-7777-8888-9999-000000000000",
      //             offerID: "d19e8b9f-52c1-4352-b08d-5ad8fba4a71b",
      //             phase: 3,
      //             phaseName:
      //               "Giai đoạn hoàn thành những công đoạn cuối cùng để test",
      //             phaseDescription: "Xác nhận mẫu",
      //             offerPhaseStatus: "Rework",
      //             progressCount: 0,
      //             startDate: "2025-07-27T00:00:00",
      //             endDate: "2025-07-28T00:00:00",
      //             modifyDate: "2025-07-26T14:00:00",
      //           },
      //           {
      //             offerPhaseID: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      //             offerID: "d19e8b9f-52c1-4352-b08d-5ad8fba4a71b",
      //             phase: 4,
      //             phaseName: "Giai đoạn 4",
      //             phaseDescription: "Hoàn thiện",
      //             offerPhaseStatus: "Withdrawed",
      //             progressCount: 0,
      //             startDate: "2025-07-29T00:00:00",
      //             endDate: "2025-07-30T00:00:00",
      //             modifyDate: "2025-07-28T09:00:00",
      //           },
      //         ],
      //       },
      //       {
      //         order: {
      //           orderID: "a1b2c3d4-e5f6-7890-aaaa-bbbbccccdddd",
      //           designerID: "e27f1786-ffa5-4d60-be23-359da537241b",
      //           orderStatus: "Completed",
      //           note: "Đơn số 2 test ",
      //           deadlineAt: "2025-08-10T00:00:00",
      //           startDate: "2025-07-10T08:00:00",
      //           endDate: "2025-08-01T10:00:00",
      //           createdAt: "2025-07-10T08:00:00",
      //           updatedAt: "2025-08-01T10:00:00",
      //         },
      //         offer: {
      //           offerID: "a1b2c3d4-e5f6-7890-aaaa-bbbbccccdddd",
      //           designerID: "e27f1786-ffa5-4d60-be23-359da537241b",
      //           note: "Đơn mẫu 2",
      //           offerStatus: "Completed",
      //         },
      //         offerPhases: [
      //           {
      //             offerPhaseID: "99999999-8888-7777-6666-555555555555",
      //             offerID: "a1b2c3d4-e5f6-7890-aaaa-bbbbccccdddd",
      //             phase: 1,
      //             phaseName: "Giai đoạn đầu",
      //             phaseDescription: "Chuẩn bị",
      //             offerPhaseStatus: "Done",
      //             progressCount: 2,
      //             startDate: "2025-07-11T00:00:00",
      //             endDate: "2025-07-13T00:00:00",
      //             modifyDate: "2025-07-13T10:00:00",
      //           },
      //           {
      //             offerPhaseID: "88888888-7777-6666-5555-444444444444",
      //             offerID: "a1b2c3d4-e5f6-7890-aaaa-bbbbccccdddd",
      //             phase: 2,
      //             phaseName: "Thiết kế chính",
      //             phaseDescription: "Thi công mẫu",
      //             offerPhaseStatus: "Done",
      //             progressCount: 3,
      //             startDate: "2025-07-11T00:00:00",
      //             endDate: "2025-07-18T00:00:00",
      //             modifyDate: "2025-07-18T10:00:00",
      //           },
      //           {
      //             offerPhaseID: "77777777-6666-5555-4444-333333333333",
      //             offerID: "a1b2c3d4-e5f6-7890-aaaa-bbbbccccdddd",
      //             phase: 3,
      //             phaseName: "Bàn giao",
      //             phaseDescription: "Giao hàng",
      //             offerPhaseStatus: "Done",
      //             progressCount: 1,
      //             startDate: "2025-07-20T00:00:00",
      //             endDate: "2025-07-21T00:00:00",
      //             modifyDate: "2025-07-21T09:00:00",
      //           },
      //         ],
      //       },
      //       {
      //         order: {
      //           orderID: "12345678-90ab-cdef-1234-567890abcdef",
      //           designerID: "e27f1786-ffa5-4d60-be23-359da537241b",
      //           orderStatus: "Canceled",
      //           note: "Đơn số 3 test lun hehehehehe",
      //           deadlineAt: "2025-08-15T00:00:00",
      //           startDate: "2025-07-22T10:00:00",
      //           endDate: null,
      //           createdAt: "2025-07-22T10:00:00",
      //           updatedAt: "2025-07-28T15:00:00",
      //         },
      //         offer: {
      //           offerID: "12345678-90ab-cdef-1234-567890abcdef",
      //           designerID: "e27f1786-ffa5-4d60-be23-359da537241b",
      //           note: "Đơn huỷ do KH thay đổi",
      //           offerStatus: "Withdrawed",
      //         },
      //         offerPhases: [
      //           {
      //             offerPhaseID: "11223344-5566-7788-99aa-bbccddeeff00",
      //             offerID: "12345678-90ab-cdef-1234-567890abcdef",
      //             phase: 1,
      //             phaseName: "Tiếp nhận",
      //             phaseDescription: "Làm việc với khách hàng",
      //             offerPhaseStatus: "Done",
      //             progressCount: 1,
      //             startDate: "2025-07-23T00:00:00",
      //             endDate: "2025-07-24T00:00:00",
      //             modifyDate: "2025-07-24T12:00:00",
      //           },
      //           {
      //             offerPhaseID: "22334455-6677-8899-aabb-ccddeeff0011",
      //             offerID: "12345678-90ab-cdef-1234-567890abcdef",
      //             phase: 2,
      //             phaseName: "Demo",
      //             phaseDescription: "Demo ban đầu",
      //             offerPhaseStatus: "Rework",
      //             progressCount: 0,
      //             startDate: "2025-07-25T00:00:00",
      //             endDate: "2025-07-26T00:00:00",
      //             modifyDate: "2025-07-26T13:00:00",
      //           },
      //           {
      //             offerPhaseID: "33445566-7788-99aa-bbcc-ddeeff001122",
      //             offerID: "12345678-90ab-cdef-1234-567890abcdef",
      //             phase: 3,
      //             phaseName: "Huỷ đơn",
      //             phaseDescription: "Khách huỷ đơn",
      //             offerPhaseStatus: "Withdrawed",
      //             progressCount: 0,
      //             startDate: "2025-07-27T00:00:00",
      //             endDate: "2025-07-28T00:00:00",
      //             modifyDate: "2025-07-28T15:00:00",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // };

      const timelineResponse = await designerService.getTimeline({
        designerID,
      });

      if (timelineResponse?.responseRequestModel?.progressTimelineItems) {
        const timelineEvents: TimelineEvent[] = [];
        const orderColorMap = new Map<string, string>();

        // Tạo map màu sắc cho từng đơn hàng
        timelineResponse.responseRequestModel.progressTimelineItems.forEach(
          (item, index) => {
            const colorIndex = index % ORDER_COLORS.length;
            orderColorMap.set(item.order.orderID, ORDER_COLORS[colorIndex]);
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
                color: STATUS_COLORS[status], // Giữ lại cho status badge
                orderColor:
                  orderColorMap.get(item.order.orderID) || ORDER_COLORS[0], // Màu theo đơn hàng
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
    // Đảm bảo endDate bao gồm cả ngày cuối cùng
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

      // console.log("response", response);

      if (response?.statusCode === 200) {
        toast.success("Tạo tiến độ thành công!", {
          description: "Tiến độ đã được thêm vào giai đoạn này",
        });

        // Close the dialog after successful submission
        setShowCreateProgressDialog(false);
        setSelectedPhaseForProgress(null);

        // Optionally refresh the timeline data
        await fetchTimelineData();
      } else {
        // toast.error("Có lỗi xảy ra khi tạo tiến độ", {
        //   description: response?.message || "Vui lòng thử lại sau",
        // });
      }
    } catch (error) {
      console.error("Error creating progress step:", error);
      // toast.error("Có lỗi xảy ra khi tạo tiến độ", {
      //   description: "Vui lòng thử lại sau",
      // });
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
      <style>{calendarStyles}</style>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Data and Legend */}
        <div className="lg:col-span-1 space-y-4">
          {/* Thống kê tổng quan */}

          <Card className="flex items-center justify-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Lịch trình của nhà thiết kế
              </h2>
              <p className="text-sm text-gray-600">
                Xem lịch trình và tiến độ các đơn hàng của bạn
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Tổng đơn hàng:
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {
                      Array.from(new Set(events.map((event) => event.orderID)))
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      Giai đoạn hoàn thành:
                    </span>
                  </div>
                  <Badge className="bg-green-500 text-white font-semibold">
                    {events.filter((event) => event.status === "Done").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      Đang thực hiện:
                    </span>
                  </div>
                  <Badge className="bg-yellow-500 text-white font-semibold">
                    {
                      events.filter((event) => event.status === "InProgress")
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Cần làm lại:</span>
                  </div>
                  <Badge className="bg-red-500 text-white font-semibold">
                    {events.filter((event) => event.status === "Rework").length}
                  </Badge>
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
              <div className="space-y-2">
                {Array.from(new Set(events.map((event) => event.orderID))).map(
                  (orderID) => {
                    const orderEvent = events.find(
                      (event) => event.orderID === orderID
                    );
                    if (orderEvent) {
                      return (
                        <div
                          key={orderID}
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleOrderClick(orderID)}
                        >
                          <Badge
                            className="text-white"
                            style={{ backgroundColor: orderEvent.orderColor }}
                          >
                            {orderEvent.title}
                          </Badge>
                        </div>
                      );
                    }
                    return null;
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - FullCalendar */}
        <div className="lg:col-span-3 ">
          <Card className="mt-0">
            <CardContent>
              <div className="h-[700px] uppercase-title mt-0">
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
                      "transition-opacity",
                      "duration-200",
                    ];
                    if (hoveredEvent === arg.event.id) {
                      classes.push("opacity-80");
                    }
                    return classes;
                  }}
                  eventContent={(arg) => {
                    const status = arg.event.extendedProps
                      .status as TimelineEvent["status"];
                    const IconComponent = STATUS_ICONS[status];

                    return (
                      <div className="flex items-center gap-1 p-1">
                        <IconComponent className="w-3 h-3" />
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

      {/* Create Progress Step Dialog */}
      {selectedPhaseForProgress && (
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
