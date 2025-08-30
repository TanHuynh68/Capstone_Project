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
import { USER_ROUTES } from "@/routes/path";
import { useNavigate } from "react-router-dom";
import { statusDescriptions } from "@/constants/orderDetail.constants";

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
  | "Rejected"
  | "RequestShipToCus";

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

export default function OrderStatusTimeline({
  currentStatus,
  userRole,
  order,
  fetchOrderDetail,
}: OrderStatusTimelineProps) {
  const navigate = useNavigate();
  const baseStatuses: StatusStep[] = [
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
  ];

  // Modify labels based on rejection status
  if (currentStatus === "Rejected" && order?.oldStatus) {
    const oldStatus = order.oldStatus;

    if (oldStatus === "DesignerRejected") {
      baseStatuses[1].label = "Nhà thiết kế đã từ chối";
    } else if (oldStatus === "CustomerRejected") {
      baseStatuses[4].label = "Khách hàng đã từ chối";
    } else if (oldStatus === "RequestShipToCus") {
      baseStatuses[4].label = "Yêu cầu giao đến KH";
    }

    // Change the last status to "Đã hủy" when rejected
    baseStatuses[5].label = "Đã hủy";
    baseStatuses[5].icon = <XCircle className="w-4 h-4" />;
  }

  const getStatusInfo = (status: OrderStatus) => {
    // Handle rejected status with oldStatus
    if (status === "Rejected" && order?.oldStatus) {
      const oldStatus = order.oldStatus;
      let rejectionIndex = 0;

      if (oldStatus === "DesignerRejected") {
        rejectionIndex = 1; // ShippingToDesigner index
      } else if (oldStatus === "CustomerRejected") {
        rejectionIndex = 4; // ShippingToCustomer index
      }

      return {
        currentIndex: 5, // Done/Cancelled index
        completedUntil: rejectionIndex - 1,
        rejectionStartIndex: rejectionIndex,
      };
    }

    // Handle other rejection statuses
    switch (status) {
      case "DesignerRejected":
        return {
          currentIndex: 1,
          completedUntil: 0,
          rejectionStartIndex: 1,
        };
      case "PendingConflict":
        return {
          currentIndex: 2,
          completedUntil: 1,
          rejectionStartIndex: 2,
        };
      case "CustomerRejected":
        return {
          currentIndex: 4,
          completedUntil: 3,
          rejectionStartIndex: 4,
        };
      case "RequestShipToCus":
        return {
          currentIndex: 3,
          completedUntil: 2,
          rejectionStartIndex: 3,
        };
      default:
        // Handle main statuses
        const mainStatusIndex = baseStatuses.findIndex((s) => s.key === status);
        if (mainStatusIndex !== -1) {
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
    const isRejected =
      statusInfo.rejectionStartIndex !== undefined &&
      index >= statusInfo.rejectionStartIndex;

    // Special handling for RequestShipToCus status
    if (currentStatus === "RequestShipToCus") {
      if (index <= 2) {
        // Created, ShippingToDesigner, InProgress
        return {
          container: "bg-white border-primary",
          icon: "text-primary",
          text: "text-primary",
        };
      } else if (index === 3) {
        // Completed - show as red/problematic
        return {
          container: "bg-red-500 border-red-500",
          icon: "text-white",
          text: "text-red-600",
        };
      } else {
        // ShippingToCustomer, Done - show as incomplete
        return {
          container: "bg-gray-100 border-gray-300",
          icon: "text-gray-400",
          text: "text-gray-400",
        };
      }
    }

    if (isRejected) {
      return {
        container: "bg-red-500 border-red-500",
        icon: "text-white",
        text: "text-red-600",
      };
    }

    if (isCurrent && !isRejected) {
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
    const isRejected =
      statusInfo.rejectionStartIndex !== undefined &&
      index >= statusInfo.rejectionStartIndex;

    // Special handling for RequestShipToCus status
    if (currentStatus === "RequestShipToCus") {
      if (index <= 1) {
        // Connectors between Created->ShippingToDesigner and ShippingToDesigner->InProgress
        return "bg-primary";
      } else if (index === 2) {
        // Connector between InProgress->Completed
        return "bg-red-200";
      } else {
        // Remaining connectors
        return "bg-gray-200";
      }
    }

    if (isRejected) {
      return "bg-red-200";
    }

    if (isCompleted) {
      return "bg-primary";
    }

    return "bg-gray-200";
  };

  const getCurrentStatusLabel = () => {
    if (currentStatus === "Rejected" && order?.oldStatus) {
      return baseStatuses[5].label; // "Đã hủy"
    }
    if (currentStatus === "RequestShipToCus") {
      return "Yêu cầu giao hàng đến KH";
    }
    const currentStep = baseStatuses.find((s) => s.key === currentStatus);
    return currentStep?.label || currentStatus;
  };

  const getDeliveryButtonText = () => {
    if (currentStatus === "Created" && userRole === ROLE.CUSTOMER) {
      return "Giao hàng cho NTK";
    }
    if (currentStatus === "Completed" && userRole === ROLE.DESIGNER) {
      return "Giao hàng cho KH";
    }
    if (currentStatus === "RequestShipToCus" && userRole === ROLE.DESIGNER) {
      return "Hãy giao hàng cho KH";
    }
    return "";
  };

  const handleNavigateToProfile = (tab?: string) => {
    navigate(`/${USER_ROUTES.PROFILE}`, {
      state: { activeTab: tab },
    });
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {baseStatuses.map((step, index) => {
          const stepStyle = getStepStyle(index);

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative flex-1 min-h-[120px]"
            >
              {index < baseStatuses.length - 1 && (
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
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm">
          Trạng thái hiện tại:{" "}
          <span
            className={`font-bold ${
              currentStatus === "Rejected" ? "text-red-600" : "text-green-600"
            }`}
          >
            {getCurrentStatusLabel()}
          </span>
        </div>
        <div className="text-center text-sm mt-1 text-gray-600">
          {statusDescriptions[currentStatus]}
        </div>
      </div>

      {currentStatus === "ShippingToDesigner" && handleNavigateToProfile && (
        <div className="flex justify-center items-center">
          <div className="mt-4 text-center w-[200px]">
            <button
              onClick={() => handleNavigateToProfile("delivery")}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-white rounded-lg cursor-pointer text-sm font-medium"
            >
              Xem tiến độ giao hàng
            </button>
          </div>
        </div>
      )}

      {((currentStatus === "Created" && userRole === ROLE.CUSTOMER) ||
        (currentStatus === "Completed" && userRole === ROLE.DESIGNER) ||
        (currentStatus === "RequestShipToCus" &&
          userRole === ROLE.DESIGNER)) && (
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
