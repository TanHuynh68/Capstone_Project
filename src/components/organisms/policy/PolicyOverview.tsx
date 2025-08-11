import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Truck,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
interface PolicyOverviewProps {
  rules: PolicyRule[];
}

export default function PolicyOverview({ rules }: PolicyOverviewProps) {
  const totalRules = rules.length;
  const generalRules = rules.filter(
    (rule) => rule.benefitType === "General"
  ).length;
  const deliveryRules = rules.filter(
    (rule) => rule.benefitType === "Delivery"
  ).length;
  const orderRules = rules.filter(
    (rule) => rule.benefitType === "OrderAndProgress"
  ).length;

  const positiveCustomerRules = rules.filter(
    (rule) => rule.customerScoreChange > 0
  ).length;
  const negativeCustomerRules = rules.filter(
    (rule) => rule.customerScoreChange < 0
  ).length;
  const positiveDesignerRules = rules.filter(
    (rule) => rule.designerScoreChange > 0
  ).length;
  const negativeDesignerRules = rules.filter(
    (rule) => rule.designerScoreChange < 0
  ).length;

  const stats = [
    {
      title: "Tổng số quy tắc",
      value: totalRules,
      icon: FileText,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Chính sách chung",
      value: generalRules,
      icon: Users,
      color: "bg-gray-100 text-gray-800",
    },
    {
      title: "Chính sách giao hàng",
      value: deliveryRules,
      icon: Truck,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Chính sách đơn hàng",
      value: orderRules,
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  const scoreStats = [
    {
      title: "KH tăng điểm",
      value: positiveCustomerRules,
      icon: TrendingUp,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "KH giảm điểm",
      value: negativeCustomerRules,
      icon: TrendingDown,
      color: "bg-red-100 text-red-800",
    },
    {
      title: "NTK tăng điểm",
      value: positiveDesignerRules,
      icon: TrendingUp,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "NTK giảm điểm",
      value: negativeDesignerRules,
      icon: TrendingDown,
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Tổng quan chính sách
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Badge className={stat.color}>
                      <Icon className="h-4 w-4 mr-1" />
                      {stat.value}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Phân tích điểm số
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scoreStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Badge className={stat.color}>
                      <Icon className="h-4 w-4 mr-1" />
                      {stat.value}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
