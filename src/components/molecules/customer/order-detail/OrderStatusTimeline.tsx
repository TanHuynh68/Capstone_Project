"use client";

import type React from "react";
import {
  Package,
  Truck,
  Wrench,
  CheckCircle,
  ArrowLeft,
  Flag,
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
  | "CustomerRejected";

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
    label: "Gửi đến NTK",
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
    label: "Gửi đến KH",
    icon: <ArrowLeft className="w-4 h-4" />,
  },
  {
    key: "Done",
    label: "Hoàn tất",
    icon: <Flag className="w-4 h-4" />,
  },
];

export default function OrderStatusTimeline({
  currentStatus,
  userRole,
  order,
  fetchOrderDetail,
}: OrderStatusTimelineProps) {
  const getStatusInfo = (status: OrderStatus) => {
    const mainStatusIndex = mainStatuses.findIndex((s) => s.key === status);
    const isMainStatus = mainStatusIndex !== -1;

    // Xử lý các trường hợp đặc biệt
    switch (status) {
      case "DesignerRejected":
        return {
          currentIndex: 1, // ShippingToDesigner
          errorIndex: 1,
          errorMessage: "Nhà thiết kế đã từ chối",
          completedUntil: 0, // Chỉ Created được hoàn thành
        };
      case "PendingConflict":
        return {
          currentIndex: 2, // InProgress
          errorIndex: 2,
          errorMessage: "Đang có tranh chấp",
          completedUntil: 1, // Created và ShippingToDesigner hoàn thành
        };
      case "CustomerRejected":
        return {
          currentIndex: 4, // ShippingToCustomer
          errorIndex: 4,
          errorMessage: "Khách hàng đã từ chối",
          completedUntil: 3, // Hoàn thành đến Completed
          doneError: true, // Done cũng bị lỗi
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
    // Khi status là "Created" và role là CUSTOMER
    if (currentStatus === "Created" && userRole === ROLE.CUSTOMER) {
      return "Giao hàng cho NTK";
    }

    // Khi status là "Completed" và role là DESIGNER
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
              {/* Connector Line */}
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

              {/* Step Circle */}
              <div
                className={`
                  relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${stepStyle.container}
                `}
              >
                <div className={stepStyle.icon}>{step.icon}</div>
              </div>

              {/* Step Label */}
              <div
                className={`mt-2 text-sm font-medium text-center ${stepStyle.text} h-5`}
              >
                {step.label}
              </div>

              {/* Error Message - Fixed height container */}
              <div className="mt-1 h-8 flex items-start justify-center">
                {errorMessage && (
                  <div className="text-xs text-red-600 text-center max-w-20 leading-tight">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Description */}
      <div className="mt-4 text-center">
        <div className="text-sm ">
          Trạng thái hiện tại:{" "}
          <span className="font-bold  text-green-600 ">
            {mainStatuses.find((s) => s.key === currentStatus)?.label ||
              (currentStatus === "DesignerRejected"
                ? "Nhà thiết kế từ chối"
                : currentStatus === "PendingConflict"
                ? "Đang có tranh chấp"
                : currentStatus === "CustomerRejected"
                ? "Khách hàng từ chối"
                : currentStatus)}
          </span>
        </div>
      </div>

      {/* Delivery Button - Hiển thị phía dưới status description */}
      {((currentStatus === "Created" && userRole === ROLE.CUSTOMER) ||
        (currentStatus === "Completed" && userRole === ROLE.DESIGNER)) && (
        <div className="flex justify-center items-center">
          <div className="mt-4 text-center w-[200px] ">
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
