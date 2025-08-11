"use client";

import type React from "react";
import {
  Package,
  Truck,
  Wrench,
  CheckCircle,
  ArrowLeft,
  Flag,
  XCircle,
} from "lucide-react";
import { ROLE } from "@/constants";
import { ShippingFormDialog } from "@/components/organisms/delivery/shipping-form-dialog";

type OrderStatus =
  | "Created"
  | "ShippingToDesigner"
  | "InProgress"
  | "Completed"
  | "ShippingToCustomer"
  | "Done"
  | "DesignerRejected"
  | "PendingConflict"
  | "CustomerRejected"
  | "Rejected";

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  userRole: any;
  order: any;
  fetchOrderDetail: any;
}

interface StatusStep {
  key: OrderStatus;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const mainStatuses: StatusStep[] = [
  {
    key: "Created",
    label: "Đã tạo",
    icon: <Package className="w-4 h-4" />,
  },
  {
    key: "ShippingToDesigner",
    label: "Đang gửi hàng đến NTK",
    icon: <Truck className="w-4 h-4" />,
  },
  {
    key: "InProgress",
    label: "Đang thực hiện",
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    key: "Completed",
    label: "Hoàn thành",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    key: "ShippingToCustomer",
    label: "NTK trả hàng",
    icon: <ArrowLeft className="w-4 h-4" />,
  },
  {
    key: "Done",
    label: "Hoàn tất",
    icon: <Flag className="w-4 h-4" />,
  },
  {
    key: "Rejected",
    label: "Đã hủy",
    icon: <XCircle className="w-4 h-4" />,
  },
];

const statusDescriptions: Record<OrderStatus, string> = {
  Created: "Khách hàng cần gửi sản phẩm cần làm đến nhà thiết kế.",
  ShippingToDesigner:
    "Nhà thiết kế cần xác nhận sản phẩm có đúng với mô tả không. Nếu không đúng, có thể báo cáo.",
  DesignerRejected:
    "Nhà thiết kế đã từ chối. Đang chờ nhân viên xem xét đơn tố cáo để đưa ra hướng giải quyết.",
  InProgress:
    "Khách hàng cần thanh toán cho từng giai đoạn. Nhà thiết kế sẽ rút tiền để tiến hành làm. Sau mỗi giai đoạn, khách hàng cần đánh giá.",
  Completed:
    "Đơn đã hoàn thành. Nhà thiết kế cần giao sản phẩm đã hoàn thành cho khách hàng.",
  ShippingToCustomer:
    "Khách hàng cần xác nhận sản phẩm có đúng với mô tả không. Nếu không đúng, có thể báo cáo.",
  CustomerRejected:
    "Khách hàng đã từ chối. Đang chờ nhân viên xem xét đơn tố cáo để đưa ra hướng giải quyết.",
  Done: "Đơn hàng đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
  PendingConflict:
    "Đơn hàng đang xảy ra tranh chấp giữa 2 bên. Cần chờ nhân viên xem xét để đưa ra hướng giải quyết.",
  Rejected:
    "Đơn hàng đã bị hủy kèm quyền lợi. Xin lỗi vì trải nghiệm không được tốt này.",
};

export default function OrderStatusTimeline({
  currentStatus,
  userRole,
  order,
  fetchOrderDetail,
}: OrderStatusTimelineProps) {
  const getStatusInfo = (status: OrderStatus) => {
    const mainStatusIndex = mainStatuses.findIndex((s) => s.key === status);
    const isMainStatus = mainStatusIndex !== -1;

    switch (status) {
      case "DesignerRejected":
        return {
          currentIndex: 1,
          errorIndex: 1,
          errorMessage: "Nhà thiết kế đã từ chối",
          completedUntil: 0,
        };
      case "PendingConflict":
        return {
          currentIndex: 2,
          errorIndex: 2,
          errorMessage: "Đang có tranh chấp",
          completedUntil: 1,
        };
      case "CustomerRejected":
        return {
          currentIndex: 4,
          errorIndex: 4,
          errorMessage: "Khách hàng đã từ chối",
          completedUntil: 3,
          doneError: true,
        };
      case "Rejected":
        return {
          currentIndex: 6,
          errorIndex: 6,
          errorMessage: "Đơn hàng đã bị hủy",
          completedUntil: -1,
        };
      default:
        if (isMainStatus) {
          return {
            currentIndex: mainStatusIndex,
            completedUntil: mainStatusIndex - 1,
          };
        }
        return {
          currentIndex: 0,
          completedUntil: -1,
        };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);

  const getStepStyle = (index: number) => {
    const isCompleted = index <= (statusInfo.completedUntil ?? -1);
    const isCurrent = index === statusInfo.currentIndex;
    const isError =
      index === statusInfo.errorIndex || (statusInfo.doneError && index === 5);

    if (isError) {
      return {
        container: "bg-red-500 border-red-500",
        icon: "text-white",
        text: "text-red-600",
      };
    }

    if (isCurrent) {
      return {
        container: "bg-primary border-primary",
        icon: "text-white",
        text: "text-primary",
      };
    }

    if (isCompleted) {
      return {
        container: "bg-white border-primary",
        icon: "text-primary",
        text: "text-primary",
      };
    }

    return {
      container: "bg-gray-100 border-gray-300",
      icon: "text-gray-400",
      text: "text-gray-400",
    };
  };

  const getConnectorStyle = (index: number) => {
    const isCompleted = index <= (statusInfo.completedUntil ?? -1);
    const hasError =
      statusInfo.errorIndex !== undefined && index >= statusInfo.errorIndex;

    if (hasError) {
      return "bg-red-200";
    }

    if (isCompleted) {
      return "bg-primary";
    }

    return "bg-gray-200";
  };

  const getErrorMessage = (index: number) => {
    if (index === statusInfo.errorIndex) {
      return statusInfo.errorMessage;
    }
    if (statusInfo.doneError && index === 5) {
      return "Đơn hàng đã bị hủy";
    }
    return null;
  };

  const getDeliveryButtonText = () => {
    if (currentStatus === "Created" && userRole === ROLE.CUSTOMER) {
      return "Giao hàng cho NTK";
    }
    if (currentStatus === "Completed" && userRole === ROLE.DESIGNER) {
      return "Giao hàng cho KH";
    }
    return "";
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {mainStatuses.map((step, index) => {
          const stepStyle = getStepStyle(index);
          const errorMessage = getErrorMessage(index);

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative flex-1 min-h-[120px]"
            >
              {index < mainStatuses.length - 1 && (
                <div
                  className={`absolute top-6 h-0.5 ${getConnectorStyle(
                    index
                  )} z-0`}
                  style={{
                    left: "50%",
                    right: "-50%",
                    transform: "translateX(0)",
                  }}
                />
              )}

              <div
                className={`
                  relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${stepStyle.container}
                `}
              >
                <div className={stepStyle.icon}>{step.icon}</div>
              </div>

              <div
                className={`mt-2 text-sm font-medium text-center ${stepStyle.text} h-5`}
              >
                {step.label}
              </div>

              <div className="mt-1 h-8 flex items-start justify-center">
                {errorMessage && (
                  <div className="text-xs text-red-600 text-center max-w-40 leading-tight">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm">
          Trạng thái hiện tại:{" "}
          <span className="font-bold text-green-600">
            {mainStatuses.find((s) => s.key === currentStatus)?.label ||
              currentStatus}
          </span>
        </div>
        <div className="text-center text-sm mt-1 text-gray-600">
          {statusDescriptions[currentStatus]}
        </div>
      </div>

      {((currentStatus === "Created" && userRole === ROLE.CUSTOMER) ||
        (currentStatus === "Completed" && userRole === ROLE.DESIGNER)) && (
        <div className="flex justify-center items-center">
          <div className="mt-4 text-center w-[200px]">
            <ShippingFormDialog
              fetchData={fetchOrderDetail}
              text={getDeliveryButtonText()}
              orderID={order?.orderID}
              order={order}
            />
          </div>
        </div>
      )}
    </div>
  );
}
