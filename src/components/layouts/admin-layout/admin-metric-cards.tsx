"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  FileText,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import DashboardService from "@/services/DashboardService";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconColor: string;
  change?: string;
  subtitle: any;
}
interface DashboardData {
  account: {
    totalAccount: number;
    totalAccountActive: number;
    numberOfCustomer: number;
    numberOfDesigner: number;
    totalNewAccountInFilter: number;
    newCustomerInFilter: number;
    newDesignerInFilter: number;
  };
  post: {
    totalPost: number;
    totalActivePost: number;
    totalNewPostInFilter: number;
    totalNewActivePost: number;
  };
  order: {
    totalOrder: number;
    totalRevenue: number;
    orderDone: number;
    orderInProgress: number;
    orderPendingConflict: number;
    orderCancelled: number;
    totalOrderInFilter: number;
    totalRevenueInFilter: number;
    orderDoneInFilter: number;
    orderInProgressInFilter: number;
    orderPendingConflictInFilter: number;
    orderCancelledInFilter: number;
  };
  report: {
    totalReport: number;
    reportPending: number;
    reportResolved: number;
    reportRejected: number;
    totalReportInFilter: number;
    reportPendingInFilter: number;
    reportResolvedInFilter: number;
    reportRejectedInFilter: number;
  };
}

const MetricCard = ({
  title,
  value,
  icon,
  iconColor,
  subtitle,
}: MetricCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <>
              <p className="text-xs text-gray-500">
                Không có thay đổi trong {title.toLowerCase()}
              </p>
              <p className="text-xs text-gray-400">
                So với không thời gian trước
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminMetricCards = () => {
  const { getDashboard } = DashboardService();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDataDashboard();
  }, []);

  const fetchDataDashboard = async () => {
    const response = await getDashboard({
      startDate: "2025-06-01",
      endDate: new Date().toISOString().split("T")[0],
    });
    if (response && response.responseRequestModel) {
      setData(response.responseRequestModel);
    }
    console.log("fetchDataDashboard: ", response);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const cards = [
    {
      title: "Doanh thu",
      value: formatCurrency(data?.order.totalRevenue || 0),
      icon: <DollarSign className="w-5 h-5 text-white" />,
      iconColor: "bg-green-500",
      subtitle: true,
    },
    {
      title: "Tổng tài khoản",
      value: data?.account.totalAccount,
      icon: <Users className="w-5 h-5 text-white" />,
      iconColor: "bg-blue-500",
      subtitle: true,
    },
    {
      title: "Khách hàng",
      value: data?.account.numberOfCustomer,
      icon: <UserCheck className="w-5 h-5 text-white" />,
      iconColor: "bg-purple-500",
      subtitle: true,
    },
    {
      title: "Nhà thiết kế",
      value: data?.account.numberOfDesigner,
      icon: <Users className="w-5 h-5 text-white" />,
      iconColor: "bg-indigo-500",
      subtitle: true,
    },
    {
      title: "Tổng bài đăng",
      value: data?.post.totalPost,
      icon: <FileText className="w-5 h-5 text-white" />,
      iconColor: "bg-cyan-500",
      subtitle: true,
    },
    {
      title: "Tổng đơn hàng",
      value: data?.order.totalOrder,
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      iconColor: "bg-orange-500",
      subtitle: true,
    },
    {
      title: "Đơn hàng hoàn thành",
      value: data?.order.orderDone,
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      iconColor: "bg-green-600",
      subtitle: true,
    },
    {
      title: "Tổng báo cáo",
      value: data?.report.totalReport,
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
      iconColor: "bg-red-500",
      subtitle: true,
    },
  ];

  return (
    <Card className="mb-4">
      <div className="flex">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>Tổng quan về PlushDollCustom</CardTitle>
            <CardDescription>Chào mừng quản trị viên trở lại!</CardDescription>
          </CardHeader>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  px-4 lg:px-6 mt-4">
        {cards.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            value={card?.value || 0}
            icon={card.icon}
            iconColor={card.iconColor}
            subtitle={card.subtitle}
          />
        ))}
      </div>
    </Card>
  );
};
